// When the page loads, check if there's a post to edit
document.addEventListener("DOMContentLoaded", () => {
  const postToEdit = JSON.parse(sessionStorage.getItem("postToEdit"));

  if (postToEdit) {
    // Pre-fill form fields with existing post data
    document.getElementById("title").value = postToEdit.title;
    document.getElementById("intro").value = postToEdit.intro;
    document.getElementById("content").value = postToEdit.content;

    // Set a flag to indicate edit mode
    document.querySelector(".post-button").dataset.editMode = true;
  }
});

// Event listener for the post button
document
  .querySelector(".post-button")
  .addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent form submission

    const title = document.getElementById("title").value;
    const city = document.getElementById("city").value;
    const intro = document.getElementById("intro").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("photos").files[0]; // Get the image file

    // Check if the fields are filled
    if (!title || !city || !intro || !content) {
      alert("Please fill in all fields.");
      return;
    }

    // Form data to send to the backend
    const formData = new FormData();
    formData.append("title", title);
    formData.append("city", city);
    formData.append("intro", intro);
    formData.append("content", content);

    if (image) {
      // Only append the image if a new file is selected
      formData.append("image", image);
    }

    // Determine the action based on edit mode
    if (document.querySelector(".post-button").dataset.editMode) {
      // Edit existing post
      const postToEdit = JSON.parse(sessionStorage.getItem("postToEdit"));
      formData.append("id", postToEdit.id); // Pass the post ID to identify which post to edit

      try {
        const response = await fetch("../../Server/api/updateblogpost.php", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (data.success) {
          alert("Post updated successfully.");
          sessionStorage.removeItem("postToEdit"); // Clear session data
          window.location.href = "../CWManageposts/manageposts.html";
        } else {
          alert(data.message || "Failed to update post.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while updating the post.");
      }
    } else {
      // Create a new post
      try {
        const response = await fetch("../../Server/api/addblogpost.php", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();

        if (data.success) {
          alert("Post created successfully.");
          window.location.href = "../CWManagePosts/manageposts.php";
        } else {
          alert(data.message || "Failed to create post.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while creating the post.");
      }
    }
  });
