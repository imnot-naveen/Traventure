/*// Load posts from localStorage or initialize an empty array
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
    const selectedPost = posts.find(post => post.title === title);
    if (selectedPost) {
        sessionStorage.setItem('selectedPost', JSON.stringify(selectedPost));
        window.location.href = "../CWBlog/blog.html";
    }
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
});*/

// Function to fetch posts from the server
function fetchPosts() {
    fetch('getallblogposts.php')  // Replace with your API endpoint
        .then(response => response.json())
        .then(posts => {
            if (posts.length === 0) {
                document.querySelector('.post-card-container').innerHTML = '<p>Oops, there are no posts available.</p>';
            } else {
                displayPosts(posts);
            }
        });
}

// Function to display posts on the page
function displayPosts(posts) {
    const postContainer = document.querySelector('.post-card-container');
    postContainer.innerHTML = ''; // Clear existing posts

    posts.forEach(post => {
        const postCard = document.createElement('div');
        postCard.classList.add('post-card');
        postCard.innerHTML = `
            <img src="${post.image}" alt="${post.title}">
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

// Search function to filter posts by city
function searchByCity() {
    const searchInput = document.querySelector('.search input').value.trim().toLowerCase();
    
    // Fetch posts filtered by city from the server
    fetch(`post.php?city=${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(posts => displayPosts(posts));

    // Update the heading based on search results
    document.querySelector('h1').textContent = searchInput
        ? `Attractions in ${searchInput.charAt(0).toUpperCase() + searchInput.slice(1)}`
        : 'Most Recent Posts';
}

// Function to view a post
function viewPost(id) {
    window.location.href = `../CWBlog/blog.html?post_id=${id}`;
}

// Function to edit a post
function editPost(id) {
    window.location.href = `../CWCreate/create.html?edit_id=${id}`;
}

// Function to delete a post by ID
function deletePost(id) {
    fetch(`post.php?id=${id}`, { method: 'DELETE' })
        .then(() => fetchPosts());  // Refresh posts after deletion
}

// Load initial posts on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();  // Fetch and display posts from the server

    // Attach event listener to search button
    document.querySelector('.search .btn').addEventListener('click', searchByCity);
});


