// Function to fetch posts from the server
function fetchPosts() {
  fetch("../../Server/api/getallblogposts.php?limit=10&offset=0")
    .then((response) => response.json())
    .then((posts) => {
      if (!posts || posts.length === 0) {
        document.querySelector(".post-card-container").innerHTML =
          "<p>Oops, there are no posts available.</p>";
      } else {
        displayPosts(posts);
      }
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
}

// Function to display posts on the page
function displayPosts(posts) {
  const postContainer = document.querySelector(".post-card-container");
  postContainer.innerHTML = ""; // Clear existing posts

  posts.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");
    postCard.innerHTML = `
            <img src="../../Public/Uploads/${post.image}" alt="${post.title}">
            <div class="post-content">
                <a href="#" onclick="viewPost(${post.id})"><h2>${post.title}</h2></a>
                <p>${post.intro}</p>
                <div class="post-actions">
                    <span class="edit-icon" onclick="editPost(${post.id})">&#9998;</span>
                    <span class="delete-icon" onclick="deletePost(${post.id})">&#128465;</span>
                </div>
            </div>
        `;
    postContainer.appendChild(postCard);
  });
}

function searchByCity() {
  const searchInput = document
    .querySelector(".search input")
    .value.trim()
    .toLowerCase();

  // Fetch posts filtered by city from the server
  if (searchInput) {
    fetch(`../../Server/api/getallblogposts.php?city=${encodeURIComponent(searchInput)}&limit=10&offset=0`)
      .then((response) => response.json())
      .then((posts) => {
        if (!posts || posts.length === 0) {
          document.querySelector(".post-card-container").innerHTML =
            "<p>Oops, there are no posts available in this city.</p>";
        } else {
          displayPosts(posts); // Function to display the posts
        }
      })
      .catch((error) => {
        console.error('Error fetching posts:', error);
      });

    // Update the heading based on search results
    document.querySelector("h1").textContent = `Attractions in ${searchInput.charAt(0).toUpperCase() + searchInput.slice(1)}`;
  } else {
    // If search input is empty, fetch all posts again
    fetchPosts();
    document.querySelector("h1").textContent = "Most Recent Posts";
  }
}

// Function to view a post
function viewPost(id) {
  window.location.href = `../CWBlog/blog.php?post_id=${id}`;
}

// Function to edit a post
function editPost(id) {
  window.location.href = `../CWUpdate/update.php?edit_id=${id}`;
}

// Function to delete a post by ID
function deletePost(id) {
  // Confirm deletion
  if (!confirm("Are you sure you want to delete this post?")) {
    return;
  }

  // Send delete request to the correct endpoint
  fetch("../../Server/api/deleteblogpost.php", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ postID: id }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Post deleted successfully");
        fetchPosts(); // Refresh posts after successful deletion
      } else {
        alert(data.message || "Failed to delete post");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while deleting the post");
    });
}

// Load initial posts on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchPosts(); // Fetch and display posts from the server

  // Attach event listener to search button
  document
    .querySelector(".search .btn")
    .addEventListener("click", searchByCity);
});
