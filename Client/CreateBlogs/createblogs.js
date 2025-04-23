document.addEventListener("DOMContentLoaded", () => {
  // No longer handling post edit mode
});

document.querySelector(".post-button").addEventListener("click", async function (event) {
  event.preventDefault(); // Prevent form from submitting the traditional way

  const title = document.getElementById("title").value.trim();
  const intro = document.getElementById("intro").value.trim();
  const content = document.getElementById("content").value.trim();
  const image = document.getElementById("photos").files[0]; // Image file input

  // Validate fields
  if (!title || !intro || !content) {
    alert("Please fill in all fields.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("intro", intro);
  formData.append("content", content);

  if (image) {
    formData.append("image", image);
  }

  // No need for edit mode check anymore, directly handle creating the post
  try {
    const response = await fetch("../../Server/api/addblogs.php", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();

    if (data.success) {
      alert("Post created successfully.");
      window.location.href = "../Blogs/blogs.php";
    } else {
      alert(data.message || "Failed to create post.");
    }
  } catch (error) {
    console.error("Create error:", error);
    alert("An error occurred while creating the post.");
  }
});
