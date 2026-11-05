<?php
declare(strict_types=1);

/**
 * Traventure Transit Routing Engine
 * 
 * Computes optimal direct and multi-leg train connections across the Sri Lanka
 * Railway Network using graph adjacency and timetable interval traversal.
 */
class TransitRouter {
    private PDO $db;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Checks if a train runs on a specific day of the week.
     */
    public function isTrainRunning(string $daysStr, string $dayOfWeek, bool $isWeekend): bool {
        $daysStr = trim($daysStr);
        if ($daysStr === '' || $daysStr === 'Daily') {
            return true;
        }
        if ($daysStr === 'Weekdays') {
            return !$isWeekend;
        }
        if ($daysStr === 'Weekends') {
            return $isWeekend;
        }

        $tokens = array_map('trim', explode(',', $daysStr));
        return in_array($dayOfWeek, $tokens, true);
    }

    /**
     * Computes the duration in seconds between departure and arrival times,
     * correctly handling overnight midnight wraps.
     */
    public function calculateDurationSeconds(string $depTime, string $arrTime): array {
        $depSec = (int)strtotime("1970-01-01 " . $depTime);
        $arrSec = (int)strtotime("1970-01-01 " . $arrTime);
        
        $isOvernight = false;
        if ($arrSec < $depSec) {
            $arrSec += 86400; // Overnight wrap past midnight (+24h)
            $isOvernight = true;
        }

        $durationSec = $arrSec - $depSec;
        return [
            'durationSeconds' => $durationSec,
            'isOvernight' => $isOvernight
        ];
    }

    /**
     * Formats duration in seconds to a human-readable string: e.g. "2h 45m"
     */
    public function formatDuration(int $seconds): string {
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        return "{$hours}h {$minutes}m";
    }

    /**
     * Fetch all candidate direct trains between two stations.
     */
    public function findDirectTrains(int $startStationId, int $endStationId, string $searchDate): array {
        $dayOfWeek = date('D', strtotime($searchDate));
        $isWeekend = in_array($dayOfWeek, ['Sat', 'Sun'], true);

        $sql = "
            SELECT 
                t.trainID,
                t.name AS trainName,
                t.type AS trainType,
                t.days,
                ts1.departuretime AS departureTime,
                ts2.arrivaltime AS arrivalTime,
                st_start.name AS startStationName,
                st_end.name AS endStationName,
                st_term.name AS terminalStationName
            FROM trainstops ts1
            JOIN trainstops ts2 ON ts1.trainID = ts2.trainID
            JOIN train t ON t.trainID = ts1.trainID
            JOIN station st_start ON st_start.stationID = ts1.stationid
            JOIN station st_end ON st_end.stationID = ts2.stationid
            LEFT JOIN station st_term ON st_term.stationID = t.endStation
            WHERE ts1.stationid = :startStation 
              AND ts2.stationid = :endStation
              AND (
                  ts1.departuretime < ts2.arrivaltime 
                  OR (ts2.arrivaltime < ts1.departuretime)
              )
            ORDER BY ts1.departuretime ASC
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':startStation' => $startStationId,
            ':endStation' => $endStationId
        ]);

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $results = [];

        foreach ($rows as $row) {
            if (!$this->isTrainRunning($row['days'] ?? '', $dayOfWeek, $isWeekend)) {
                continue;
            }

            $durationData = $this->calculateDurationSeconds($row['departureTime'], $row['arrivalTime']);
            $formatted = $this->formatDuration($durationData['durationSeconds']);

            $results[] = [
                'type' => 'direct',
                'trainID' => $row['trainID'],
                'trainName' => $row['trainName'],
                'trainType' => $row['trainType'],
                'departureStation' => $row['startStationName'],
                'departureTime' => substr($row['departureTime'], 0, 5),
                'arrivalStation' => $row['endStationName'],
                'arrivalTime' => substr($row['arrivalTime'], 0, 5),
                'terminalStation' => $row['terminalStationName'] ?? $row['endStationName'],
                'duration' => $formatted,
                'isOvernight' => $durationData['isOvernight'],
                'days' => $row['days']
            ];
        }

        return $results;
    }

    /**
     * =========================================================================
     * YOUR HANDS-ON MISSION: MULTI-LEG TRANSFER EVALUATION
     * =========================================================================
     * 
     * Given Leg 1 (arriving at a transit junction) and Leg 2 (departing from the same junction),
     * determine if the connection is valid, calculate the layover, and classify whether
     * it is a Same-Day transfer or an Overnight Layover.
     * 
     * @param string $leg1ArrTime  Departure station -> Junction arrival time (e.g., "21:30:00")
     * @param string $leg2DepTime  Junction departure -> Destination departure time (e.g., "05:55:00")
     * 
     * @return array|null Returns null if transfer is invalid/infeasible, OR an array:
     *   [
     *      'isValid' => true,
     *      'isOvernight' => bool,           // True if traveler must stay overnight
     *      'layoverSeconds' => int,         // Duration waiting at junction in seconds
     *      'layoverFormatted' => string     // e.g. "8h 25m"
     *   ]
     * 
     * RULES:
     * 1. Minimum transfer time at a junction is 20 minutes (1200 seconds) so travelers can change platforms.
     * 2. If Leg 2 departs later on the same day ($leg2DepTime >= $leg1ArrTime + 20 mins):
     *    - If layover is <= 4 hours (14400 seconds), it's a SAME-DAY transfer ('isOvernight' => false).
     *    - If layover > 4 hours on the same day, you can still consider it same-day or reject if too long.
     * 3. If Leg 2 departs earlier in the clock time than Leg 1 arrives (e.g. arrives at 21:30 at night,
     *    next train is at 05:55 the next morning):
     *    - Add 86400 seconds (24 hours) to Leg 2 departure time to calculate overnight layover.
     *    - If overnight layover is between 4 hours (14400s) and 16 hours (57600s),
     *      it is a valid OVERNIGHT layover ('isOvernight' => true).
     * 4. Otherwise, return null (infeasible).
     */
    public function evaluateTransfer(string $leg1ArrTime, string $leg2DepTime): ?array {
        // TODO: Implement your transfer logic here!
        // Hint: You can use strtotime("1970-01-01 " . $time) to convert time strings to timestamps.
        
        return null; // Replace this with your implementation
    }
}

