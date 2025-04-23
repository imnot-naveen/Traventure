document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const blogId = params.get("id");
  
    if (!blogId) {
      document.body.innerHTML = "<p>Invalid blog ID.</p>";
      return;
    }
  
    fetch(`../../Server/api/getblog.php?id=${blogId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const blog = data.post;
          document.querySelector('.title').textContent = blog.title;
          document.querySelector('.image').src = `../Public/${blog.image}`;
          document.querySelector('.image').alt = blog.title;
          document.querySelector('.intro').textContent = blog.intro;
          document.querySelector('.content').textContent = blog.content;
          document.querySelector('.date').textContent = new Date(blog.createdAt).toLocaleString();
  
          document.querySelector('.blog-details-container').classList.remove("hidden");
        } else {
          document.body.innerHTML = `<p>${data.message}</p>`;
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
        document.body.innerHTML = "<p>Error loading blog details.</p>";
      });
  });
  