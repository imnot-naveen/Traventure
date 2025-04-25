document.addEventListener("DOMContentLoaded", () => {
    let offset = 0;
    const limit = 10;

    function fetchBlogs() {
        fetch(`../../Server/api/getallblogsUnderReview.php?limit=${limit}&offset=${offset}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    data.forEach(post => {
                        const postElement = document.createElement('div');
                        postElement.classList.add('post');
                        postElement.setAttribute('data-id', post.id); // Store ID for later reference

                        postElement.innerHTML = `
                            <div class="blog-box">
                                <div class="blog-header">
                                    <div class="user-info">
                                        <img src="../assets/icons/user.png" alt="Profile" class="profile"/>
                                        <div class="user-details">
                                            <p class="username">${post.author}</p>
                                            <p class="date">${new Date(post.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <a href="../BlogDetails/blogdetails.php?id=${post.id}" class="blog-link">
                                    <img src="../Public/${post.image}" alt="${post.title}" class="blog-image"/>
                                    <p class="intro">${post.intro}</p>
                                </a>
                                <div class="blog-actions">
                                    <button class="accept-btn" onclick="updateStatus(${post.id}, 'accepted')">Accept</button>
                                    <button class="decline-btn" onclick="updateStatus(${post.id}, 'declined')">Decline</button>
                                </div>
                                
                            </div>
                        `;

                        document.querySelector('.blog-container').appendChild(postElement);
                    });

                    document.querySelector('.blog-wrapper').classList.remove('hidden');
                } else {
                    document.querySelector('.blog-wrapper').innerHTML = `
                        <div class="no-blogs-box">
                            <p>No blogs to review</p>
                            <img src="../assets/waiting.gif">
                        </div>
                        `;

                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                document.querySelector('.blog-wrapper').innerHTML = `<p>Error loading blogs: ${error.message}</p>`;
            });
    }

    fetchBlogs();
});

function updateStatus(postId, newStatus) {
    fetch("../../Server/api/updateblogStatus.php", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: postId, status: newStatus })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        console.log("Response Data:", data);  // Log the response data

        if (data.success) {
            alert(`Post status updated to ${newStatus}`);
            const postElement = document.querySelector(`.post[data-id="${postId}"]`);
            postElement.querySelector('.status').textContent = `Status: ${newStatus}`;
        } else {
            console.error("Error in response:", data.message);  // Log error message
            alert(data.message || "Failed to update status");
        }
    })
    .catch(error => {
        console.error("Error updating status:", error);
        alert("An error occurred while updating the status.");
    });
}

