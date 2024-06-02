document.addEventListener("DOMContentLoaded", function () {
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
