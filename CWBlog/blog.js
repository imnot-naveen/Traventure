document.addEventListener('DOMContentLoaded', function () {
    const title = sessionStorage.getItem('selectedPostTitle');  // Get selected post title from sessionStorage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];  // Get all posts from localStorage
    const post = posts.find(post => post.title === title);  // Find the post with the matching title

    if (post) {
        // Set the heading with the city from the post
        document.querySelector('section h2').innerText = `Traventure in ${post.city}: Where to go and What to see`;
        
        // Update the blog content
        document.querySelector('.blog h2').innerText = post.title;
        document.querySelector('.content-container img').src = post.image || "../assets/default.jpg";
        document.querySelector('.content-container p').innerText = post.content;
    }
});


