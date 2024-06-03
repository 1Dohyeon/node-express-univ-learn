document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        const errorMessageElement = document.getElementById("error-message");
        if (result.success) {
          window.location.href = "/";
        } else {
          errorMessageElement.style.display = "block";
          errorMessageElement.innerText =
            result.message || "Invalid email or password";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while processing your request");
      });
  });
