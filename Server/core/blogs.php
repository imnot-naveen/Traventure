<?php
class Blog {
    private $conn;
    private $table = 'blogs';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all blogs
    public function getAllBlogs() {
        $query = 'SELECT b.id, b.title, b.intro, b.content, b.imageURL, b.createdAt, b.updatedAt,
                         p.username AS author_username, p.fullname AS author_name
                  FROM ' . $this->table . ' b
                  JOIN Person p ON b.author = p.username
                  ORDER BY b.createdAt DESC';
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    // Get blog by id
    public function getBlogById($id) {
        $query = 'SELECT b.id, b.title, b.intro, b.content, b.imageURL, b.createdAt, b.updatedAt,
                         p.username AS author_username, p.fullname AS author_name
                  FROM ' . $this->table . ' b
                  JOIN Person p ON b.author = p.username
                  WHERE b.id = :id LIMIT 1';
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    

    // Create a new blog post
    public function createBlog($data) {
        try {
            $query = 'INSERT INTO ' . $this->table . ' 
          SET title = :title, intro = :intro, content = :content, imageURL = :imageURL, 
              author = :author, createdAt = NOW(), updatedAt = NOW()';

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':title', $data->title);
            $stmt->bindParam(':intro', $data->intro);
            $stmt->bindParam(':content', $data->content);
            $stmt->bindParam(':imageURL', $data->imageURL);
            $stmt->bindParam(':author', $data->author);


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
