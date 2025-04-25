document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const blogId = params.get("id");

  if (!blogId) {
    document.body.innerHTML = "<p>Invalid blog ID.</p>";
    return;
  }

  fetch(`../../Server/api/getblog.php?id=${blogId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const blog = data.post;
        document.querySelector(".title").textContent = blog.title;
        document.querySelector(".image").src = `../Public/${blog.image}`;
        document.querySelector(".image").alt = blog.title;
        document.querySelector(".intro").textContent = blog.intro;
        document.querySelector(".content").textContent = blog.content;
        document.querySelector(".username").textContent = blog.author;
        document.querySelector(".date").textContent = new Date(
          blog.createdAt
        ).toLocaleString();

        document
          .querySelector(".blog-details-container")
          .classList.remove("hidden");

        const commentSectionHTML = `
          <div class="comments-section">
            <p class="comment-title">Comments <span class="comment-count">0</span></p>
            <form id="comment-form">
              <textarea class="comment-box" placeholder="Leave a comment..." required></textarea>
              <button class="submit-comment" type="submit">Submit</button>
            </form>
            <div class="comment-list"></div>
          </div>
        `;
        document
          .querySelector(".blog-details-container")
          .insertAdjacentHTML("beforeend", commentSectionHTML);

        const commentList = document.querySelector(".comment-list");
        const commentCount = document.querySelector(".comment-count");
        let count = 0;

        const updateCommentCount = () => {
          commentCount.textContent = count;
        };

        const renderComment = (commentObj) => {
          const comment = document.createElement("div");
          comment.classList.add("comment");

          const author = document.createElement("strong");
          author.textContent = commentObj.author + ": ";
          const text = document.createElement("span");
          text.classList.add("comment-text");
          text.textContent = commentObj.comment;

          comment.appendChild(author);
          comment.appendChild(text);

          const menuButton = document.createElement("button");
          menuButton.classList.add("comment-menu");
          menuButton.textContent = "⋮";

          const menuOptions = document.createElement("div");
          menuOptions.classList.add("comment-menu-options", "hidden");
          menuOptions.innerHTML = `
            <button class="edit-comment">Edit</button>
            <button class="delete-comment">Delete</button>
          `;

          // Edit comment
          menuOptions
            .querySelector(".edit-comment")
            .addEventListener("click", () => {
              const newText = prompt("Edit your comment:", text.textContent);
              if (newText && newText !== text.textContent) {
                const formData = new FormData();
                formData.append("id", commentObj.id);
                formData.append("comment", newText);

                fetch("../../Server/api/updatecomment.php", {
                  method: "POST",
                  body: formData,
                })
                  .then((res) => res.json())
                  .then((response) => {
                    if (response.success) {
                      text.textContent = newText;
                      alert("Comment updated!");
                    } else {
                      alert("Failed to edit comment: " + response.message);
                    }
                  })
                  .catch((err) => {
                    console.error("Error editing comment:", err);
                  });
              }
            });

          // Delete comment
          menuOptions
            .querySelector(".delete-comment")
            .addEventListener("click", () => {
              if (confirm("Are you sure you want to delete this comment?")) {
                const data = {
                  id: commentObj.id, // Send the comment ID as part of the request body
                };

                fetch("../../Server/api/deletecomment.php", {
                  method: "DELETE", // Use DELETE method instead of POST
                  body: JSON.stringify(data), // Send data as JSON
                  headers: {
                    "Content-Type": "application/json", // Ensure that the server knows you're sending JSON
                  },
                })
                  .then((res) => res.json())
                  .then((response) => {
                    if (response.success) {
                      comment.remove();
                      count--;
                      updateCommentCount();
                      alert("Comment deleted.");
                    } else {
                      alert("Failed to delete comment: " + response.message);
                    }
                  })
                  .catch((err) => {
                    console.error("Error deleting comment:", err);
                  });
              }
            });

          menuButton.addEventListener("click", () => {
            menuOptions.classList.toggle("hidden");
          });

          comment.appendChild(menuButton);
          comment.appendChild(menuOptions);
          commentList.appendChild(comment);
        };

        // Load existing comments
        fetch(`../../Server/api/getcomments.php?blogId=${blogId}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              commentList.innerHTML = "";
              data.comments.forEach((commentObj) => {
                renderComment(commentObj);
                count++;
              });
              updateCommentCount();
            } else {
              console.error("Failed to fetch comments:", data.message);
            }
          })
          .catch((err) => console.error("Error fetching comments:", err));

        // Handle new comment
        document
          .getElementById("comment-form")
          .addEventListener("submit", (e) => {
            e.preventDefault();
            const commentBox = document.querySelector(".comment-box");
            const text = commentBox.value.trim();

            if (text !== "") {
              const formData = new FormData();
              formData.append("blogId", blogId);
              formData.append("comment", text);

              fetch("../../Server/api/addcomment.php", {
                method: "POST",
                body: formData,
              })
                .then((res) => res.json())
                .then((response) => {
                  if (response.success) {
                    // Assuming API returns the new comment's ID
                    renderComment({
                      id: response.commentId,
                      author: "You",
                      comment: text,
                    });
                    commentBox.value = "";
                    count++;
                    updateCommentCount();
                  } else {
                    alert("Failed to add comment: " + response.message);
                  }
                })
                .catch((err) => {
                  console.error("Error adding comment:", err);
                  alert("There was an error submitting your comment.");
                });
            }
          });
      } else {
        document.body.innerHTML = `<p>${data.message}</p>`;
      }
    })
    .catch((err) => {
      console.error("Fetch error:", err);
      document.body.innerHTML = "<p>Error loading blog details.</p>";
    });
});
