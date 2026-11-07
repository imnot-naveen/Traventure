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
     * Evaluates a transfer connection between two train legs at a junction.
     *
     * Validates minimum platform transfer windows (>=20m) and classifies
     * connections into same-day transfers (<=4h) or overnight layovers (4h-16h).
     *
     * @param string $leg1ArrTime  Inbound arrival time (HH:MM:SS)
     * @param string $leg2DepTime  Outbound departure time (HH:MM:SS)
     * @return array|null Returns connection metadata or null if infeasible
     */
    public function evaluateTransfer(string $leg1ArrTime, string $leg2DepTime): ?array {
        $arrSec = (int)strtotime("1970-01-01 " . $leg1ArrTime);
        $depSec = (int)strtotime("1970-01-01 " . $leg2DepTime);

        // Scenario 1: Same-day connection (min 20 mins, max 4 hours)
        if ($depSec >= $arrSec) {
            $diff = $depSec - $arrSec;
            if ($diff >= 1200 && $diff <= 14400) {
                return [
                    'isValid' => true,
                    'isOvernight' => false,
                    'layoverSeconds' => $diff,
                    'layoverFormatted' => $this->formatDuration($diff),
                ];
            }
        }

        // Scenario 2: Overnight connection (train departs next morning, 4h - 16h layover)
        if ($depSec < $arrSec) {
            $diff = ($depSec + 86400) - $arrSec;
            if ($diff >= 14400 && $diff <= 57600) {
                return [
                    'isValid' => true,
                    'isOvernight' => true,
                    'layoverSeconds' => $diff,
                    'layoverFormatted' => $this->formatDuration($diff),
                ];
            }
        }      

        return null;       
    }
}
