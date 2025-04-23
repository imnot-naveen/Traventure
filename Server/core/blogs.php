<?php
class Blog {
    private $conn;
    private $table = 'blogs';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all blogs
    public function getAllBlogs() {
        $query = 'SELECT id, title, intro, content, imageURL, createdAt, updatedAt FROM ' . $this->table . ' ORDER BY createdAt DESC';
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Get single blog by ID
    public function getBlogById($id) {
        $query = 'SELECT id, title, intro, content, imageURL, createdAt, updatedAt 
                  FROM ' . $this->table . ' WHERE id = :id LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Create a new blog post
    public function createBlog($data) {
        try {
            $query = 'INSERT INTO ' . $this->table . ' 
                      SET title = :title, intro = :intro, content = :content, imageURL = :imageURL, createdAt = NOW(), updatedAt = NOW()';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':title', $data->title);
            $stmt->bindParam(':intro', $data->intro);
            $stmt->bindParam(':content', $data->content);
            $stmt->bindParam(':imageURL', $data->imageURL);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Blog post created successfully.'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Update an existing blog post
    public function updateBlog($data) {
        try {
            $query = 'UPDATE ' . $this->table . ' 
                      SET title = :title, intro = :intro, content = :content, imageURL = :imageURL, updatedAt = NOW()
                      WHERE id = :id';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $data->id, PDO::PARAM_INT);
            $stmt->bindParam(':title', $data->title);
            $stmt->bindParam(':intro', $data->intro);
            $stmt->bindParam(':content', $data->content);
            $stmt->bindParam(':imageURL', $data->imageURL);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Blog post updated successfully.'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Delete a blog post by ID
    public function deleteBlog($id) {
        try {
            $query = 'DELETE FROM ' . $this->table . ' WHERE id = :id';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Blog post deleted successfully.'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }
}
?>
