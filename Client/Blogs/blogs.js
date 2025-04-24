document.addEventListener("DOMContentLoaded", () => {
    // Function to fetch and display blogs
    function fetchBlogs() {
        // Fetch blogs from the API with pagination (limit and offset)
        fetch("../../Server/api/getallblogs.php?limit=10&offset=0")
            .then(response => response.json())
            .then(data => {
                console.log(data); // Check what data is returned from the API
                if (Array.isArray(data) && data.length > 0) {
                    // Loop through the fetched blogs and display them
                    data.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.classList.add('post');
  
                        postElement.innerHTML = `
                            <div class="blog-box">
                                <!-- Blog Header -->
                                <div class="blog-header">
                                    <div class="user-info">
                                        <img src="../assets/icons/user.png" alt="Profile" class="profile"/>
                                        <div class="user-details">
                                          <p class="username">${post.author}</p>
                                          <p class="date">${new Date(post.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <!-- Triple Dots (Options Button) -->
                                    <div class="post-options">
                                        <button class="options-btn">⋮</button>
                                        <div class="dropdown-menu hidden">
                                            <button class="edit-btn" onclick="editBlog(${post.id})">Edit</button>
                                            <button class="delete-btn" onclick="deleteBlog(${post.id})">Delete</button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Blog Image and Intro -->
                                <a href="../BlogDetails/blogdetails.php?id=${post.id}" class="blog-link">
                                  <img src="../Public/${post.image}" alt="${post.title}" class="blog-image"/>
                                  <p class="intro">${post.intro}</p>
                                
  
                                <!-- Comments Section -->
                                <div class="comments-section">
                                    <p class="comment-title">Comments <span class="comment-count">0</span></p>
                                    <textarea class="comment-box" placeholder="Leave a comment..."></textarea>
                                    <button class="submit-comment">Submit</button>
                                    <div class="comment-list"></div>
                                </div>
                                
                            </div>
                        `;
                        
                        // Set up dropdown functionality
                        const optionsBtn = postElement.querySelector('.options-btn');
                        const dropdownMenu = postElement.querySelector('.dropdown-menu');

                        optionsBtn.addEventListener('click', (e) => {
                            e.stopPropagation(); // prevent event from bubbling up
                            dropdownMenu.classList.toggle('hidden');

                            // Close all other dropdowns
                            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                                if (menu !== dropdownMenu) {
                                    menu.classList.add('hidden');
                                }
                            });
                        });

                        // Append the post element to the wrapper
                        document.querySelector('.blog-container').appendChild(postElement);

                        const commentBox = postElement.querySelector('.comment-box');
                        const submitBtn = postElement.querySelector('.submit-comment');
                        const commentList = postElement.querySelector('.comment-list');
                        const commentCount = postElement.querySelector('.comment-count');

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
                    document.querySelector('.blog-wrapper').classList.remove('hidden');
                } else {
                    // Show message if no blogs are found
                    document.querySelector('.blog-wrapper').innerHTML = '<p>No blogs found.</p>';
                }
            })
            .catch(error => {
                // Handle errors during the fetch
                console.error('Fetch error:', error);
                document.querySelector('.blog-wrapper').innerHTML = '<p>Error loading blogs.</p>';
            });
    }
  
    // Initially fetch and display blogs
    fetchBlogs();

});

// Function to view a post
function viewBlog(id) {
    window.location.href = `../BlogDetails/blogdetails.php?post_id=${id}`;
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

 