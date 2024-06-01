document.addEventListener("DOMContentLoaded", () => {
  const isUserLoggedIn =
    document.body.getAttribute("data-logged-in") === "true";

  const commentForm = document.getElementById("commentForm");
  if (commentForm) {
    commentForm.addEventListener("submit", (event) => {
      if (!isUserLoggedIn) {
        event.preventDefault();
        alert("Please log in to add a comment.");
      }
    });
  }
});
