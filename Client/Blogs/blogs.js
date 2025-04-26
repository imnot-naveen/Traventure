document.addEventListener("DOMContentLoaded", () => {
  const blogContainer = document.querySelector(".blog-container");

  fetchBlogs();

  window.viewBlog = viewBlog;

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
              </div>
              
              <a href="../BlogDetails/blogdetails.html?id=${
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
    window.location.href = `../BlogDetails/blogdetails.html?id=${id}`;
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
