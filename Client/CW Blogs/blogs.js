document.addEventListener("DOMContentLoaded", () => {
  const blogContainer = document.querySelector(".blog-container");

  fetchBlogs();

  window.viewBlog = viewBlog;
  window.editBlog = editBlog;
  window.deleteBlog = deleteBlog;

  function fetchBlogs() {
    fetch("../../Server/api/getallblogs.php?limit=10&offset=0")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (Array.isArray(data) && data.length > 0) {
          blogContainer.innerHTML = "";

          data.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.classList.add("blog-card");

            postElement.innerHTML = `
                          <div class="card-header">
                              <div class="user-info">
                                  <img src="../assets/icons/user.png" alt="Profile" class="profile"/>
                                  <div class="user-details">
                                      <p class="username">${post.author}</p>
                                      <p class="date">${new Date(
                                        post.createdAt
                                      ).toLocaleDateString()}</p>
                                  </div>
                              </div>
                              <div class="action-buttons">
                                  <button class="edit-btn" data-id="${
                                    post.id
                                  }" title="Edit">
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="#4a90e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="#4a90e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                  </button>
                                  <button class="delete-btn" data-id="${
                                    post.id
                                  }" title="Delete">
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M3 6H5H21" stroke="#ff5252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#ff5252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M10 11V17" stroke="#ff5252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                          <path d="M14 11V17" stroke="#ff5252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                      </svg>
                                  </button>
                              </div>
                          </div>
                          
                          <a href="../BlogDetails/blogdetails.php?id=${
                            post.id
                          }" class="blog-link">
                              <div class="card-image-container">
                                  <img src="../Public/${post.image}" alt="${
              post.title
            }" class="blog-image"/>
                                  <div class="image-overlay"></div>
                              </div>
                              <div class="card-content">
                                  <h3 class="blog-title">${post.title}</h3>
                                  <p class="intro">${post.intro}</p>
                                  <div class="read-more">
                                      Read More <i class="fas fa-arrow-right"></i>
                                  </div>
                              </div>
                          </a>
                      `;

            const editBtn = postElement.querySelector(".edit-btn");
            const deleteBtn = postElement.querySelector(".delete-btn");

            editBtn.addEventListener("click", (e) => {
              e.preventDefault();
              const blogId = editBtn.getAttribute("data-id");
              editBlog(blogId);
            });

            deleteBtn.addEventListener("click", (e) => {
              e.preventDefault();
              const blogId = deleteBtn.getAttribute("data-id");
              deleteBlog(blogId);
            });

            blogContainer.appendChild(postElement);
          });
        } else {
          blogContainer.innerHTML = `
                      <div class="no-blogs">
                          <i class="far fa-newspaper"></i>
                          <h3>No blogs found</h3>
                          <p>Be the first to create a blog post!</p>
                      </div>
                  `;
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        blogContainer.innerHTML = `
                  <div class="error-message">
                      <i class="fas fa-exclamation-triangle"></i>
                      <h3>Error loading blogs</h3>
                      <p>Please try again later</p>
                  </div>
              `;
      });
  }

  function viewBlog(id) {
    window.location.href = `../BlogDetails/blogdetails.php?id=${id}`;
  }

  function editBlog(id) {
    window.location.href = `../BlogUpdate/blogupdate.php?edit_id=${id}`;
  }

  function deleteBlog(id) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    fetch("../../Server/api/deleteblogs.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showNotification("Post deleted successfully");
          fetchBlogs();
        } else {
          showNotification(data.message || "Failed to delete post", "error");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        showNotification("An error occurred while deleting the post", "error");
      });
  }

  function showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
          <i class="fas fa-${
            type === "success" ? "check-circle" : "exclamation-circle"
          }"></i>
          <span>${message}</span>
      `;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
});
