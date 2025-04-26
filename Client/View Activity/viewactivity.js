document.addEventListener("DOMContentLoaded", () => {
  // Get the post ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("post_id");

  if (!postId) {
    document.querySelector(".blog-post-container").innerHTML =
      "<p>No blog post specified. Please select a post to view.</p>";
    return;
  }

  // Fetch blog post details
  fetch(`../../Server/api/getblogpost.php?blog_id=${postId}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const post = data.post;

        // Update page title
        document.title = `Traventure - ${post.title}`;

        // Populate post details
        document.getElementById("post-title").textContent = post.title;
        document.getElementById("post-city").textContent = post.city;

        // Format date
        const createdDate = new Date(post.createdAt);
        document.getElementById("post-date").textContent =
          createdDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });

        // Set image
        const postImage = document.getElementById("post-image");
        postImage.src = `../../Public/Uploads/${post.image}`;
        postImage.alt = post.title;

        // Set intro and content
        document.getElementById("post-intro").textContent = post.intro;
        document.getElementById("post-body").innerHTML = post.content.replace(
          /\n/g,
          "<br>"
        ); // Convert newlines to <br> tags
      } else {
        // Handle error
        document.querySelector(
          ".blog-post-container"
        ).innerHTML = `<p>Error: ${data.message}</p>`;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      document.querySelector(".blog-post-container").innerHTML =
        "<p>An error occurred while loading the blog post.</p>";
    });
});
