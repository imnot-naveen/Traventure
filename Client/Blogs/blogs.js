document.addEventListener("DOMContentLoaded", () => {
  // Function to fetch and display blogs
  fetchBlogs();
});

// Function to fetch blogs from API and display them
function fetchBlogs() {
  // Fetch blogs from the API with pagination
  fetch("../../Server/api/getallblogs.php?limit=10&offset=0")
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received:", data); // Check what data is returned from the API

      // Clear the container
      const blogContainer = document.querySelector(".blog-container");
      if (!blogContainer) {
        console.error("Blog container not found");
        return;
      }
      blogContainer.innerHTML = "";

      if (Array.isArray(data) && data.length > 0) {
        // Loop through the fetched blogs and display them
        data.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.classList.add("post");

          // Use a placeholder for author since it's not in the data
          postElement.innerHTML = `
                    <div class="blog-box">
                        <!-- Blog Header -->
                        <div class="blog-header">
                            <div class="user-info">
                                <img src="../assets/icons/user.png" alt="Profile" class="profile"/>
                                <div class="user-details">
                                    <p class="username">Author</p>
                                    <p class="date">${new Date(
                                      post.createdAt
                                    ).toLocaleString()}</p>
                                </div>
                            </div>
                            <!-- Action Buttons (Edit and Delete with SVGs) -->
                            <div class="post-options">
                                <button class="edit-btn" data-id="${
                                  post.id
                                }" data-tooltip="Edit">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                                    </svg>
                                </button>
                                <button class="delete-btn" data-id="${
                                  post.id
                                }" data-tooltip="Delete">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <!-- Rest of your code remains the same -->
                        <a href="../BlogDetails/blogdetails.php?id=${
                          post.id
                        }" class="blog-link">
                            <img src="../Public/${post.image}" alt="${
            post.title
          }" class="blog-image"/>
                            <p class="intro">${post.intro}</p>
                        </a>

                        <!-- Comments Section -->
                        <div class="comments-section">
                            <p class="comment-title">Comments <span class="comment-count">0</span></p>
                            <textarea class="comment-box" placeholder="Leave a comment..."></textarea>
                            <button class="submit-comment">Submit</button>
                            <div class="comment-list"></div>
                        </div>
                    </div>
                    `;

          // Add event listeners for edit and delete buttons
          const editBtn = postElement.querySelector(".edit-btn");
          const deleteBtn = postElement.querySelector(".delete-btn");

          editBtn.addEventListener("click", () => {
            editBlog(post.id);
          });

          deleteBtn.addEventListener("click", () => {
            deleteBlog(post.id);
          });

          // Append the post element to the wrapper
          blogContainer.appendChild(postElement);

          const commentBox = postElement.querySelector(".comment-box");
          const submitBtn = postElement.querySelector(".submit-comment");
          const commentList = postElement.querySelector(".comment-list");
          const commentCount = postElement.querySelector(".comment-count");

          let count = 0;
          const updateCommentCount = () => {
            commentCount.textContent = count;
          };

          submitBtn.addEventListener("click", () => {
            const text = commentBox.value.trim();

            if (text !== "") {
              const comment = document.createElement("div");
              comment.classList.add("comment");
              comment.textContent = text;

              commentList.appendChild(comment);
              commentBox.value = "";
              count++;
              updateCommentCount();
            }
          });
        });

        // Once the blogs are fetched, remove the hidden class to show the content
        const blogWrapper = document.querySelector(".blog-wrapper");
        if (blogWrapper) {
          blogWrapper.classList.remove("hidden");
        }
      } else {
        // Show message if no blogs are found
        const blogWrapper = document.querySelector(".blog-wrapper");
        if (blogWrapper) {
          blogWrapper.innerHTML = "<p>No blogs found.</p>";
        }
      }
    })
    .catch((error) => {
      // Handle errors during the fetch
      console.error("Fetch error:", error);
      const blogWrapper = document.querySelector(".blog-wrapper");
      if (blogWrapper) {
        blogWrapper.innerHTML = "<p>Error loading blogs.</p>";
      }
    });
}

// Function to view a post
function viewBlog(id) {
  window.location.href = `../BlogDetails/blogdetails.php?id=${id}`;
}

// Function to edit a post
function editBlog(id) {
  window.location.href = `../BlogUpdate/blogupdate.php?edit_id=${id}`;
}

// Function to delete a post by ID
function deleteBlog(id) {
  // Confirm deletion
  if (!confirm("Are you sure you want to delete this post?")) {
    return;
  }

  // Send delete request to the correct endpoint
  fetch("../../Server/api/deleteblogs.php", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Post deleted successfully");
        fetchBlogs(); // Refresh posts after successful deletion
      } else {
        alert(data.message || "Failed to delete post");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while deleting the post");
    });
}
