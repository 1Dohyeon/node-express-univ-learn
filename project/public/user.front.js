document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("password-confirm");
  const passwordError = document.getElementById("password-error");
  const emailError = document.createElement("div");
  emailError.classList.add("error-message");
  emailInput.parentNode.appendChild(emailError);

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();

      emailError.style.display = "none";
      passwordError.style.display = "none";

      const name = document.getElementById("name").value;
      const email = emailInput.value;
      const password = passwordInput.value;
      const passwordConfirm = passwordConfirmInput.value;

      if (password !== passwordConfirm) {
        passwordError.style.display = "block";
        passwordError.textContent = "비밀번호가 같지 않습니다";
        return;
      }

      const data = {
        name,
        email,
        password,
      };

      fetch("/auth/register", {
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
          if (error.message === "이미 존재하는 이메일입니다.") {
            emailError.style.display = "block";
            emailError.textContent = error.message;
          } else {
            passwordError.style.display = "block";
            passwordError.textContent = error.message;
          }
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

      fetch("/auth/login", {
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
            localStorage.setItem("token", data.token); // 토큰을 로컬 스토리지에 저장
            localStorage.setItem("userId", data.user.id); // 사용자 ID를 로컬 스토리지에 저장
            document.cookie = `token=${data.token};path=/`; // 토큰을 쿠키에 저장
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

  const kakaoLoginBtn = document.getElementById("kakaoLogin-button");
  if (kakaoLoginBtn) {
    kakaoLoginBtn.addEventListener("click", function () {
      window.location.href = "/auth/kakao/start";
    });
  }

  const logoutButton = document.getElementById("logout");
  if (logoutButton) {
    logoutButton.addEventListener("click", function () {
      localStorage.removeItem("token"); // 로컬 스토리지에서 토큰 삭제
      localStorage.removeItem("userId"); // 로컬 스토리지에서 사용자 ID 삭제
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // 쿠키에서 토큰 삭제
      window.location.href = "/"; // 메인 페이지로 리다이렉트
    });
  }
});
