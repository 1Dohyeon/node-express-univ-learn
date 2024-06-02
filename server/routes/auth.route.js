const express = require("express");
const router = express.Router();
const authService = require("../service/auth.service");

// 이메일 중복 체크
router.get("/check-email/:email", authService.checkEmailAvailability);

// 닉네임 중복 체크
router.get("/check-nickname/:nickname", authService.checkNicknameAvailability);

// 회원가입
router.post("/register", authService.register);

// 로그인
router.post("/login", authService.login);

// 로그아웃
router.post("/logout", authService.logout);

// 카카오 로그인
router.get("/kakao/start", authService.startKakaoLogin);

// 카카오 로그인 콜백
router.get("/kakao/finish", async (req, res) => {
  const finalUrl = authService.getKakaoUrl(req);
  await authService.finishKakaoLogin(finalUrl, req, res);
});

module.exports = router;
