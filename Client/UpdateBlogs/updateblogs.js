// When the page loads, fetch and pre-fill the existing post data
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const blogId = urlParams.get("edit_id");

  if (!blogId) {
    alert("No blog post ID provided.");
    window.location.href = "../Blogs/blogs.php";
    return;
  }

  try {
    const response = await fetch(
      `../../Server/api/getblog.php?blog_id=${blogId}`
    );
    const data = await response.json();

    if (data.success) {
      document.getElementById("title").value = data.post.title;
      document.getElementById("intro").value = data.post.intro;
      document.getElementById("content").value = data.post.content;
    } else {
      alert(data.message || "Failed to load post data.");
      window.location.href = "../Blogs/blogs.php";
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while fetching post data.");
    window.location.href = "../Blogs/blogs.php";
  }
});

document
  .querySelector(".post-button")
  .addEventListener("click", async function (event) {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get("edit_id");

    if (!blogId) {
      alert("No blog post ID provided.");
      return;
    }

    const title = document.getElementById("title").value;
    const intro = document.getElementById("intro").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("photos").files[0];

    if (!title || !intro || !content) {
      alert("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("id", blogId);
    formData.append("title", title);
    formData.append("intro", intro);
    formData.append("content", content);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("../../Server/api/updateblogs.php", {
        method: "POST",
        body: formData,
      });

      const text = await response.text(); // Get raw text first
      console.log("Raw response:", text); // Debugging

      const data = JSON.parse(text); // Then parse to JSON

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
