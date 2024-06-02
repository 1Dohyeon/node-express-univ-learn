document.addEventListener("DOMContentLoaded", () => {
  const isUserLoggedIn =
    document.body.getAttribute("data-logged-in") === "true";

  const commentForm = document.getElementById("commentForm");
  if (commentForm) {
    commentForm.addEventListener("submit", (event) => {
      if (!isUserLoggedIn) {
        event.preventDefault();
        alert("로그인 후에 댓글을 작성할 수 있습니다.");
      }
    });
  }
});
