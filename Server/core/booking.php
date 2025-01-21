<?php
class Booking {
    private $conn;
    private $booking_table = 'booking';

    public function __construct($db) {
        $this->conn = $db;
    }

    //Booking properties
    public $booking_id;
    public $user_id;
    public $no_of_passengers;
    public $payment_status;
    public $booking_date;

    // Create a new booking
    public function createBooking() { 
      try {
          // Insert into the booking table
          $query = 'INSERT INTO ' . $this->booking_table . ' 
                    SET user_id = :user_id, 
                        no_of_passengers = :no_of_passengers, 
                        payment_status = :payment_status, 
                        booking_date = :booking_date';

          $stmt = $this->conn->prepare($query);

          // Bind parameters
          $stmt->bindParam(':user_id', $this->user_id);
          $stmt->bindParam(':no_of_passengers', $this->no_of_passengers);
          $stmt->bindParam(':payment_status', $this->payment_status);
          
          // Set the current date for booking_date
          $currentDate = date('Y-m-d');
          $stmt->bindParam(':booking_date', $currentDate);

          // Execute the query
          if ($stmt->execute()) {
              return ['success' => true, 'message' => 'Booking created successfully.'];
          } else {
              return ['success' => false, 'message' => 'Failed to create booking.'];
          }
      } catch (Exception $e) {
          return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
      }
    }


    // Fetch all blog posts
    // public function getAllPosts() {
    //     $query = 'SELECT postID, title, city, intro, content, imageURL, created_at FROM ' . $this->posts_table;
    //     $stmt = $this->conn->prepare($query);
    //     $stmt->execute();
    //     return $stmt->fetchAll(PDO::FETCH_ASSOC);
    // }

    // Fetch a single blog post by ID
    // public function getPostById($postID) {
    //     $query = 'SELECT postID, title, city, intro, content, imageURL, created_at FROM ' . $this->posts_table . ' WHERE postID = :postID LIMIT 1';
    //     $stmt = $this->conn->prepare($query);
    //     $stmt->bindParam(':postID', $postID, PDO::PARAM_INT);
    //     $stmt->execute();
    //     return $stmt->fetch(PDO::FETCH_ASSOC);
    // }



    // Update an existing blog post
    // public function updatePost($data) {
    //     try {
    //         $query = 'UPDATE ' . $this->posts_table . ' 
    //                   SET title = :title, city = :city, intro = :intro, 
    //                       content = :content, imageURL = :imageURL 
    //                   WHERE postID = :postID';
    //         $stmt = $this->conn->prepare($query);
    //         $stmt->bindParam(':postID', $data->postID, PDO::PARAM_INT);
    //         $stmt->bindParam(':title', $data->title);
    //         $stmt->bindParam(':city', $data->city);
    //         $stmt->bindParam(':intro', $data->intro);
    //         $stmt->bindParam(':content', $data->content);
    //         $stmt->bindParam(':imageURL', $data->imageURL);

    //         if ($stmt->execute()) {
    //             return ['success' => true, 'message' => 'Blog post updated successfully.'];
    //         }
    //     } catch (Exception $e) {
    //         return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    //     }
    // }

    // Delete a blog post by ID
    // public function deletePost($postID) {
    //     try {
    //         $query = 'DELETE FROM ' . $this->posts_table . ' WHERE postID = :postID';
    //         $stmt = $this->conn->prepare($query);
    //         $stmt->bindParam(':postID', $postID, PDO::PARAM_INT);

    //         if ($stmt->execute()) {
    //             return ['success' => true, 'message' => 'Blog post deleted successfully.'];
    //         }
    //     } catch (Exception $e) {
    //         return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
    //     }
    // }
}
?>
