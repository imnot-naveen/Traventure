// Function to fetch posts from the server
function fetchPosts() {
  fetch("../../Server/api/getallblogposts.php?limit=10&offset=0")
    .then((response) => response.json())
    .then((posts) => {
      if (!posts || posts.length === 0) {
        document.querySelector(".post-card-container").innerHTML =
          "<p class='no-posts'>No activities found. Check back later!</p>";
      } else {
        displayPosts(posts);
      }
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
      document.querySelector(".post-card-container").innerHTML =
        "<p class='error-message'>Unable to load activities. Please try again later.</p>";
    });
}

// Function to display posts on the page
function displayPosts(posts) {
  const postContainer = document.querySelector(".post-card-container");
  postContainer.innerHTML = ""; // Clear existing posts

  posts.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.classList.add("post-card");
    postCard.innerHTML = `
            <img src="../../Public/Uploads/${post.image}" alt="${
      post.title
    }" loading="lazy">
            <div class="post-content">
                <a href="#" onclick="viewPost(${post.id})"><h2>${
      post.title
    }</h2></a>
                <p>${post.intro}</p>
                <div class="post-meta">
                    <span class="location"><i class="fas fa-map-marker-alt"></i> ${
                      post.city || "Unknown location"
                    }</span>
                </div>
            </div>
        `;
    postContainer.appendChild(postCard);
  });
}

function searchByCity() {
  const searchInput = document
    .getElementById("searchCity")
    .value.trim()
    .toLowerCase();

  // Fetch posts filtered by city from the server
  if (searchInput) {
    fetch(
      `../../Server/api/getallblogposts.php?city=${encodeURIComponent(
        searchInput
      )}&limit=10&offset=0`
    )
      .then((response) => response.json())
      .then((posts) => {
        const postContainer = document.querySelector(".post-card-container");
        if (!posts || posts.length === 0) {
          postContainer.innerHTML = `<p class="no-posts">No activities found in ${searchInput}. Try another city!</p>`;
        } else {
          displayPosts(posts); // Function to display the posts
        }
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        document.querySelector(".post-card-container").innerHTML =
          "<p class='error-message'>Unable to search activities. Please try again later.</p>";
      });

    // Update the heading based on search results
    document.querySelector(".heading").textContent = `Activities in ${
      searchInput.charAt(0).toUpperCase() + searchInput.slice(1)
    }`;
  } else {
    // If search input is empty, fetch all posts again
    fetchPosts();
    document.querySelector(".heading").textContent =
      "Discover Amazing Activities";
  }
}

// Function to view a post
function viewPost(id) {
  window.location.href = `../View Activity/viewactivity.html?post_id=${id}`;
}

// Attach event listener to search button
document.getElementById("searchBtn").addEventListener("click", searchByCity);

// Also search when pressing Enter in the search field
document
  .getElementById("searchCity")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      searchByCity();
    }
  });
