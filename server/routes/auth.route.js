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

module.exports = router;
