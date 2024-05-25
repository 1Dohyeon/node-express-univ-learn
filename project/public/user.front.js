document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(registerForm);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      };

      fetch("/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error);
            });
          }
          return response.json();
        })
        .then((data) => {
          alert("회원가입 성공");
          window.location.href = "/login";
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("회원가입 실패: " + error.message);
        });
    });
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(loginForm);
      const data = {
        email: formData.get("email"),
        password: formData.get("password"),
      };

      fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("로그인 성공");
            window.location.href = "/";
          } else {
            alert("로그인 실패: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("로그인 실패");
        });
    });
  }
});
