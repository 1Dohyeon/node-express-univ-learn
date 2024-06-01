document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // 기본 폼 제출 동작을 막음

    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const nickname = document.getElementById("nickname").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // 비밀번호 확인
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      // 이메일 중복 체크
      let response = await fetch(`/auth/check-email/${email}`);
      let data = await response.json();
      if (!data.available) {
        alert("Email already in use");
        return;
      }

      // 닉네임 중복 체크
      response = await fetch(`/auth/check-nickname/${nickname}`);
      data = await response.json();
      if (!data.available) {
        alert("Nickname already in use");
        return;
      }

      // 모든 체크가 통과되면 폼 제출
      registerForm.submit();
    } catch (error) {
      console.error("Error checking availability:", error);
      alert("An error occurred. Please try again later.");
    }
  });
});
