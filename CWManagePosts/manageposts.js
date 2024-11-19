// Load posts from localStorage or initialize an empty array
const posts = JSON.parse(localStorage.getItem('posts')) || [];

// Function to display posts on the page
function displayPosts(filteredPosts = posts) {
    const postContainer = document.querySelector('.post-card-container');
    postContainer.innerHTML = ''; // Clear existing posts

    filteredPosts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
            <div class="post-content">
                <a href="#" onclick="viewPost('${post.title}')"><h2>${post.title}</h2></a>
                <p>${post.intro}</p>
                <div class="post-actions">
                    <span class="edit-icon" onclick="editPost('${post.title}')">&#9998;</span>
                    <span class="delete-icon" onclick="deletePost('${post.title}')">&#128465;</span>
                </div>
            </div>
        `;
        postContainer.appendChild(postCard);
    });
}

// Search function to filter posts by city
function searchByCity() {
    const searchInput = document.querySelector('.search input').value.trim().toLowerCase();
    const filteredPosts = posts.filter(post => post.city.toLowerCase().includes(searchInput));
    displayPosts(filteredPosts);

    // Update the heading based on search results
    document.querySelector('h1').textContent = searchInput
        ? `Attractions in ${searchInput.charAt(0).toUpperCase() + searchInput.slice(1)}`
        : 'Most Recent Posts';
}

// Function to save selected post title in sessionStorage and navigate to blog.html
function viewPost(title) {
    sessionStorage.setItem('selectedPostTitle', title);
    window.location.href = "../CWBlog/blog.html";
}
function editPost(title) {
    // Find the post data by title
    const post = posts.find(p => p.title === title);
    
    // Save the post data in sessionStorage for editing
    sessionStorage.setItem('postToEdit', JSON.stringify(post));
    
    // Redirect to the create form
    window.location.href = "../CWCreate/create.html";
}

// Function to delete a post by title
function deletePost(title) {
    // Retrieve posts from localStorage
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Filter out the post with the specified title
    posts = posts.filter(post => post.title !== title);

    // Update localStorage with the filtered posts array
    localStorage.setItem('posts', JSON.stringify(posts));

    // Refresh the displayed posts
    displayPosts(posts);
}


// Load initial posts on page load
document.addEventListener('DOMContentLoaded', () => {
    displayPosts();

    // Attach event listener to search button
    document.querySelector('.search .btn').addEventListener('click', searchByCity);
});
