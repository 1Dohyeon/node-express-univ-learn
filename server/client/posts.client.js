document.addEventListener("DOMContentLoaded", () => {
  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    post.addEventListener("click", () => {
      const postId = post.getAttribute("data-post-id");
      window.location.href = `/posts/${postId}`;
    });
  });
});
