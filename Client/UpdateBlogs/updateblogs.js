// When the page loads, fetch and pre-fill the existing post data
document.addEventListener("DOMContentLoaded", async () => {
    // Get the blog post ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("edit_id");
  
    if (!blogId) {
      alert("No blog post ID provided.");
      window.location.href = "../Blogs/blogs.php";
      return;
    }
  
    try {
      // Fetch the existing post data
      const response = await fetch(
        `../../Server/api/getblog.php?blog_id=${blogId}`
      );
      const data = await response.json();
  
      if (data.success) {
        // Pre-fill form fields with existing post data
        document.getElementById("title").value = data.post.title;
        document.getElementById("intro").value = data.post.intro;
        document.getElementById("content").value = data.post.content;
      } else {
        alert(data.message || "Failed to load post data.");
        window.location.href = "../Blog/blogs.php";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching post data.");
      window.location.href = "../Blogs/blogs.php";
    }
  });
  
  // Event listener for the update button
  document
    .querySelector(".post-button")
    .addEventListener("click", async function (event) {
      event.preventDefault(); // Prevent form submission
  
      // Get URL parameters to confirm blog_id
      const urlParams = new URLSearchParams(window.location.search);
      const blogId = urlParams.get("edit_id");
  
      if (!blogId) {
        alert("No blog post ID provided.");
        return;
      }
  
      // Collect form data
      const title = document.getElementById("title").value;
      const intro = document.getElementById("intro").value;
      const content = document.getElementById("content").value;
      const image = document.getElementById("photos").files[0]; // Get the image file
  
      // Validate fields
      if (!title || !intro || !content) {
        alert("Please fill in all fields.");
        return;
      }
  
      // Prepare form data for update
      const formData = new FormData();
      formData.append("id", blogId);
      formData.append("title", title);
      formData.append("intro", intro);
      formData.append("content", content);
  
      if (image) {
        // Only append the image if a new file is selected
        formData.append("image", image);
      }
  
      // Send update request
      try {
        const response = await fetch("../../Server/api/updateblogs.php", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
  
        if (data.success) {
          alert("Post updated successfully.");
          window.location.href = "../Blogs/blogs.php";
        } else {
          alert(data.message || "Failed to update post.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while updating the post.");
      }
    });
  