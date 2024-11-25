<?php
class BlogPost {
    private $conn;
    private $posts_table = 'posts';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Fetch all blog posts
    public function getAllPosts() {
        $query = 'SELECT postID, title, city, intro, content, imageURL, created_at FROM ' . $this->posts_table;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Fetch a single blog post by ID
    public function getPostById($postID) {
        $query = 'SELECT postID, title, city, intro, content, imageURL, created_at FROM ' . $this->posts_table . ' WHERE postID = :postID LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':postID', $postID, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create a new blog post
    public function createPost($data) {
        try {
            $query = 'INSERT INTO ' . $this->posts_table . ' 
                      SET title = :title, city = :city, intro = :intro, 
                          content = :content, imageURL = :imageURL, created_at = NOW()';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':title', $data->title);
            $stmt->bindParam(':city', $data->city);
            $stmt->bindParam(':intro', $data->intro);
            $stmt->bindParam(':content', $data->content);
            $stmt->bindParam(':imageURL', $data->imageURL);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Blog post created successfully.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Update an existing blog post
    public function updatePost($data) {
        try {
            $query = 'UPDATE ' . $this->posts_table . ' 
                      SET title = :title, city = :city, intro = :intro, 
                          content = :content, imageURL = :imageURL 
                      WHERE postID = :postID';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':postID', $data->postID, PDO::PARAM_INT);
            $stmt->bindParam(':title', $data->title);
            $stmt->bindParam(':city', $data->city);
            $stmt->bindParam(':intro', $data->intro);
            $stmt->bindParam(':content', $data->content);
            $stmt->bindParam(':imageURL', $data->imageURL);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Blog post updated successfully.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Delete a blog post by ID
    public function deletePost($postID) {
        try {
            $query = 'DELETE FROM ' . $this->posts_table . ' WHERE postID = :postID';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':postID', $postID, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Blog post deleted successfully.'];
            }
        } catch (Exception $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }
}
?>
