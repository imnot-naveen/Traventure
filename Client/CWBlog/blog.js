/*document.addEventListener('DOMContentLoaded', () => {
    const postData = JSON.parse(sessionStorage.getItem('selectedPost'));

    if (postData) {
        document.querySelector('section h2').innerText = `Traventure in ${postData.city}: Where to go and What to see`;
        document.querySelector('.blog-title').textContent = postData.title;
        document.querySelector('.image').src = postData.image;
        document.querySelector('.blog-content').textContent = postData.content;
    } else {
        document.querySelector('main').innerHTML = '<p>Post not found.</p>';
    }
});*/

document.addEventListener('DOMContentLoaded', () => {
    // Get post ID from URL parameters (or another method of identifying the post)
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post_id');

    if (postId) {
        // Fetch post data from the server using the post ID
        fetch(`post.php?id=${postId}`)  // Replace with your actual API endpoint
            .then(response => response.json())
            .then(postData => {
                if (postData) {
                    // Update the page with the post data
                    document.querySelector('section h2').innerText = `Traventure in ${postData.city}: Where to go and What to see`;
                    document.querySelector('.blog-title').textContent = postData.title;
                    document.querySelector('.image').src = postData.image;
                    document.querySelector('.blog-content').textContent = postData.content;
                } else {
                    // Show an error message if the post is not found
                    document.querySelector('main').innerHTML = '<p>Post not found.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching post:', error);
                document.querySelector('main').innerHTML = '<p>There was an error loading the post.</p>';
            });
    } else {
        document.querySelector('main').innerHTML = '<p>Invalid post ID.</p>';
    }
});





