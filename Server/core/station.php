<?php
class Station {
    private $conn;
    private $station_table = 'station';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch a single blog post by ID
    public function getDistance($starting_stationId, $destination_stationId) {
      // Prepare query to get distance_from_start for both stations
      $query = "SELECT stationID, distance_from_start FROM " . $this->station_table . 
               " WHERE stationID IN (?, ?)";
      
      // Prepare statement
      $stmt = $this->conn->prepare($query);
      
      // Bind parameters
      $stmt->bind_param("ii", $starting_stationId, $destination_stationId);
      
      // Execute query
      $stmt->execute();
      
      // Get result
      $result = $stmt->get_result();
      
      $distances = [];
      
      // Fetch data
      while($row = $result->fetch_assoc()) {
          $distances[$row['stationID']] = $row['distance_from_start'];
      }
      
      // Check if both stations exist
      if(count($distances) != 2) {
          return false; // One or both stations not found
      }
      
      // Calculate the absolute difference between the two distances
      $distance = abs($distances[$starting_stationId] - $distances[$destination_stationId]);
      
      return $distance;
  }

}
?>
