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
      alert("패스워드가 일치하지 않습니다.");
      return;
    }

    try {
      // 이메일 중복 체크
      let response = await fetch(`/auth/check-email/${email}`);
      let data = await response.json();
      if (!data.available) {
        alert("이미 존재하는 이메일입니다.");
        return;
      }

      // 닉네임 중복 체크
      response = await fetch(`/auth/check-nickname/${nickname}`);
      data = await response.json();
      if (!data.available) {
        alert("이미 존재하는 닉네임입니다.");
        return;
      }

      // 모든 체크가 통과되면 폼 제출
      registerForm.submit();
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("회원가입 에러");
    }
  });
});
