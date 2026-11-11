<?php
declare(strict_types=1);

/**
 * Traventure Concurrency-Safe Seat Reservation Engine
 *
 * Uses InnoDB row-level pessimistic locking (SELECT ... FOR UPDATE) and
 * time-bounded 5-minute reservation leases to prevent double-booking race conditions.
 */
class SeatReservationService {
    private PDO $db;
    private const HOLD_MINUTES = 5;

    public function __construct(PDO $db) {
        $this->db = $db;
    }

    /**
     * Releases any seat holds whose 5-minute reservation lease has expired.
     */
    public function releaseExpiredHolds(): int {
        $driver = $this->db->getAttribute(PDO::ATTR_DRIVER_NAME);
        $nowExpr = ($driver === 'sqlite') ? "datetime('now')" : "NOW()";

        $stmt = $this->db->prepare("
            UPDATE seat_reservations
            SET status = 'RELEASED', expires_at = NULL
            WHERE status = 'HELD'
              AND expires_at IS NOT NULL
              AND expires_at < {$nowExpr}
        ");
        $stmt->execute();
        return $stmt->rowCount();
    }

    /**
     * Generates the 32-seat Observation / 1st Class coach layout with live availability.
     */
    public function getSeatMap(int $trainId, string $journeyDate): array {
        $this->releaseExpiredHolds();

        $stmt = $this->db->prepare("
            SELECT seat_number, status, user_id, expires_at
            FROM seat_reservations
            WHERE train_id = :train_id
              AND journey_date = :journey_date
              AND status IN ('HELD', 'CONFIRMED')
        ");
        $stmt->execute([
            ':train_id' => $trainId,
            ':journey_date' => $journeyDate
        ]);

        $occupied = [];
        foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
            $occupied[$row['seat_number']] = $row;
        }

        // Standard 8 rows x 4 seats (A, B | C, D) = 32 seats
        $rows = 8;
        $cols = ['A', 'B', 'C', 'D'];
        $seatMap = [];

        for ($r = 1; $r <= $rows; $r++) {
            foreach ($cols as $col) {
                $seatNo = "{$col}{$r}";
                $record = $occupied[$seatNo] ?? null;

                $seatMap[] = [
                    'seatNumber' => $seatNo,
                    'row' => $r,
                    'col' => $col,
                    'isWindow' => in_array($col, ['A', 'D'], true),
                    'status' => $record ? $record['status'] : 'AVAILABLE',
                    'heldByUserId' => $record ? (int)$record['user_id'] : null,
                    'expiresAt' => $record['expires_at'] ?? null
                ];
            }
        }

        return $seatMap;
    }

    /**
     * Atomically locks and holds one or more seats for a user for 5 minutes
     * using pessimistic row locking (SELECT ... FOR UPDATE).
     *
     * @param int    $trainId
     * @param string $journeyDate (YYYY-MM-DD)
     * @param array  $seatNumbers e.g. ['A1', 'A2']
     * @param int    $userId
     * @param string $coachClass
     *
     * @return array [ 'success' => bool, 'message' => string, 'expiresAt' => ?string ]
     */
    public function holdSeats(int $trainId, string $journeyDate, array $seatNumbers, int $userId, string $coachClass = '1st Class'): array {
        if (empty($seatNumbers)) {
            return ['success' => false, 'message' => 'Please select at least one seat.'];
        }

        $expiresAt = date('Y-m-d H:i:s', time() + (self::HOLD_MINUTES * 60));

        try {
            $this->db->beginTransaction();
            $this->releaseExpiredHolds();

            $driver = $this->db->getAttribute(PDO::ATTR_DRIVER_NAME);
            $forUpdateExpr = ($driver === 'mysql') ? "FOR UPDATE" : "";

            foreach ($seatNumbers as $seat) {
                $stmt = $this->db->prepare("
                    SELECT id, status, user_id, expires_at
                    FROM seat_reservations
                    WHERE train_id = :train_id 
                      AND journey_date = :journey_date 
                      AND seat_number = :seat_number 
                    {$forUpdateExpr}
                ");
                $stmt->execute([
                    ':train_id' => $trainId,
                    ':journey_date' => $journeyDate,
                    ':seat_number' => $seat
                ]);

                $row = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($row) {
                    if ($row['status'] === 'CONFIRMED') {
                        throw new Exception("Seat {$seat} is already booked.");
                    }
                    if ($row['status'] === 'HELD' && (int)$row['user_id'] !== $userId) {
                        throw new Exception("Seat {$seat} is temporarily held by another passenger.");
                    }

                    $updStmt = $this->db->prepare("
                        UPDATE seat_reservations 
                        SET status = 'HELD', 
                            user_id = :user_id,
                            coach_class = :coach_class, 
                            expires_at = :expires_at 
                        WHERE id = :id
                    ");
                    $updStmt->execute([
                        ':user_id' => $userId,
                        ':coach_class' => $coachClass,
                        ':expires_at' => $expiresAt,
                        ':id' => $row['id']
                    ]);
                } else {
                    $insStmt = $this->db->prepare("
                        INSERT INTO seat_reservations
                            (train_id, journey_date, coach_class, seat_number, user_id, status, expires_at)
                        VALUES 
                            (:train_id, :journey_date, :coach_class, :seat_number, :user_id, 'HELD', :expires_at)
                    ");
                    $insStmt->execute([
                        ':train_id' => $trainId,
                        ':journey_date' => $journeyDate,
                        ':coach_class' => $coachClass,
                        ':seat_number' => $seat,
                        ':user_id' => $userId,
                        ':expires_at' => $expiresAt
                    ]);
                }
            }

            $this->db->commit();
            return [
                'success' => true,
                'message' => 'Seats held for 5 minutes.',
                'expiresAt' => $expiresAt
            ];
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Promotes held seats to CONFIRMED once payment succeeds.
     */
    public function confirmSeats(int $trainId, string $journeyDate, array $seatNumbers, int $userId, int $bookingId): bool {
        if (empty($seatNumbers)) {
            return false;
        }

        try {
            $this->db->beginTransaction();

            $placeholders = implode(',', array_fill(0, count($seatNumbers), '?'));
            $sql = "
                UPDATE seat_reservations
                SET status = 'CONFIRMED',
                    booking_id = ?,
                    expires_at = NULL
                WHERE train_id = ?
                  AND journey_date = ?
                  AND user_id = ?
                  AND status = 'HELD'
                  AND seat_number IN ({$placeholders})
            ";

            $params = array_merge([$bookingId, $trainId, $journeyDate, $userId], $seatNumbers);
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            $updatedCount = $stmt->rowCount();
            if ($updatedCount !== count($seatNumbers)) {
                $this->db->rollBack();
                return false;
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            return false;
        }
    }
}

