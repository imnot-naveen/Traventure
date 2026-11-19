-- ============================================================================
-- Traventure High-Throughput Composite Index Optimization
-- 
-- Eliminates full-table scans across 8,000+ stop records and establishes
-- covering index-only access paths for sub-50ms transit pathfinding.
-- ============================================================================

-- 1. Transit Pathfinding Origin Covering Index
-- Satisfies origin filtering (WHERE stationid = ?) and index-nested loop join on trainID
ALTER TABLE `trainstops`
    ADD INDEX `idx_trainstops_origin_covering` (`stationid`, `trainID`, `departuretime`);

-- 2. Transit Pathfinding Destination Covering Index
-- Satisfies destination join (JOIN ON ts1.trainID = ts2.trainID WHERE ts2.stationid = ?)
ALTER TABLE `trainstops`
    ADD INDEX `idx_trainstops_dest_covering` (`trainID`, `stationid`, `arrivaltime`);

-- 3. Pessimistic Seat Hold Lookup Index
-- Accelerates coach layout retrieval and lock verification for specific dates & statuses
ALTER TABLE `seat_reservations`
    ADD INDEX `idx_seat_reservations_lookup` (`train_id`, `journey_date`, `status`);

-- 4. Lease Sweeper Background Cleanup Index
-- Powers the high-frequency CLI cleanup cron sweeper (WHERE status = 'HELD' AND expires_at < NOW())
ALTER TABLE `seat_reservations`
    ADD INDEX `idx_seat_reservations_sweeper` (`status`, `expires_at`);

-- 5. User Destination Reviews Index
-- Optimizes destination rating deduplication checks
ALTER TABLE `userreviews`
    ADD INDEX `idx_userreviews_dest_user` (`destination`, `username`);

-- 6. Terminal Station Join Optimization
-- Accelerates terminal station name resolution for express line runs
ALTER TABLE `train`
    ADD INDEX `idx_train_endstation` (`endStation`);
