document.addEventListener("DOMContentLoaded", () => {
  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    post.addEventListener("click", () => {
      const postId = post.getAttribute("data-post-id");
      window.location.href = `/posts/${postId}`;
    });
  });

  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const searchTag = document.getElementById("searchTag").value;
      try {
        const response = await fetch(
          `/posts/search?tag=${encodeURIComponent(searchTag)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const posts = await response.json();
          if (posts.length === 0) {
            alert("없는 태그입니다.");
          } else {
            const postsContainer = document.getElementById("posts");
            postsContainer.innerHTML = `
              <ul>
                ${posts
                  .map(
                    (post) => `
                  <li class="post" data-post-id="${post.id}">
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <div class="post-footer">
                      <span>
                        <a href="/users/${post.User.id}">${
                      post.User.nickname
                    }</a>
                      </span>
                      <span>${new Date(post.createdAt).toLocaleString()}</span>
                    </div>
                    <div class="post-tags">
                      <strong>태그:</strong>
                      ${post.Tags.map(
                        (tag) => `<span class="tag">#${tag.name}</span>`
                      ).join("")}
                    </div>
                  </li>
                `
                  )
                  .join("")}
              </ul>
            `;
          }
        } else {
          alert("없는 태그입니다.");
        }
      } catch (error) {
        console.error("Error searching for posts:", error);
        alert("태그 검색 중 오류가 발생했습니다.");
      }
    });
  }
});
