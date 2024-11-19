// When the page loads, check if there's a post to edit
document.addEventListener('DOMContentLoaded', () => {
    const postToEdit = JSON.parse(sessionStorage.getItem('postToEdit'));
    
    if (postToEdit) {
        // Pre-fill form fields with existing post data
        document.getElementById('title').value = postToEdit.title;
        document.getElementById('city').value = postToEdit.city;
        document.getElementById('intro').value = postToEdit.intro;
        document.getElementById('content').value = postToEdit.content;

        // Set a flag to indicate edit mode
        document.querySelector('.post-button').dataset.editMode = true;
    }
});

// Event listener for the post button
document.querySelector('.post-button').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission

    const title = document.getElementById('title').value;
    const city = document.getElementById('city').value;
    const intro = document.getElementById('intro').value;
    const content = document.getElementById('content').value;
    const image = document.getElementById('photos').value;

    // Check if the fields are filled
    if (!title || !city || !intro || !content) {
        alert("Please fill in all fields.");
        return;
    }

    // Retrieve posts from localStorage
    let posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Check if we are in edit mode
    if (document.querySelector('.post-button').dataset.editMode) {
        // Edit existing post
        const postToEdit = JSON.parse(sessionStorage.getItem('postToEdit'));
        const index = posts.findIndex(post => post.title === postToEdit.title);

        if (index !== -1) {
            // Update the post data at the found index
            posts[index] = { title, city, intro, content, image };
        }

        // Clear edit mode and remove post data from sessionStorage
        sessionStorage.removeItem('postToEdit');
        delete document.querySelector('.post-button').dataset.editMode;
    } else {
        // Add a new post
        posts.push({ title, city, intro, content, image });
    }

    // Save the updated list of posts to localStorage
    localStorage.setItem('posts', JSON.stringify(posts));
    console.log("Post saved to localStorage:", posts); // Debugging output

    // Redirect to manageposts.html
    window.location.href = "../CWManageposts/manageposts.html";
});
