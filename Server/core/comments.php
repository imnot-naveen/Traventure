<?php
class Comment {
    private $conn;
    private $table = 'comments';

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get comments for a blog post
    public function getCommentsByBlogId($blogId) {
        $query = 'SELECT c.id, c.comment, 
                         u.username AS author_username
                  FROM ' . $this->table . ' c
                  JOIN person u ON c.author = u.username
                  WHERE c.blogId = :blogId
                  ORDER BY c.created_at DESC';

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':blogId', $blogId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Create a new comment
    public function createComment($data) {
        try {
            $query = 'INSERT INTO ' . $this->table . ' 
                      SET blogId = :blogId, author = :author, comment = :comment';

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':blogId', $data->blogId, PDO::PARAM_INT);
            $stmt->bindParam(':author', $data->author);
            $stmt->bindParam(':comment', $data->comment);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Comment added successfully.'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Update a comment
    public function updateComment($data) {
        try {
            $query = 'UPDATE ' . $this->table . ' 
                      SET comment = :comment 
                      WHERE id = :id AND author = :author';

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $data->id, PDO::PARAM_INT);
            $stmt->bindParam(':author', $data->author);
            $stmt->bindParam(':comment', $data->comment);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Comment updated successfully.'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }

    // Delete a comment
    public function deleteComment($id, $author) {
        try {
            $query = 'DELETE FROM ' . $this->table . ' WHERE id = :id AND author = :author';
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->bindParam(':author', $author);

            if ($stmt->execute()) {
                return ['success' => true, 'message' => 'Comment deleted successfully.'];
            }
        } catch (PDOException $e) {
            return ['success' => false, 'message' => 'Error: ' . $e->getMessage()];
        }
    }
}
?>
