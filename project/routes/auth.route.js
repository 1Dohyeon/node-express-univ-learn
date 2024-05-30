const express = require("express");
const { checkEmail, createUser, login } = require("../service/auth.service");
const {
  startKakaoLogin,
  getKakaoUrl,
  finishKakaoLogin,
} = require("../service/kakao.auth.service");
const bcrypt = require("bcrypt");

const router = express.Router();

// 회원가입
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const alreadyUser = await checkEmail(email);

    if (!alreadyUser) {
      const user = await createUser(name, email, password);
      res.status(201).json({ user, message: "사용 가능한 이메일입니다." });
    } else {
      res.status(400).json({ error: "이미 존재하는 이메일입니다." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 로그인
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await login(email, password);
    res.json({ success: true, token, user });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
});

// 카카오 로그인 시작
router.get("/kakao/start", (req, res) => {
  const url = startKakaoLogin();
  res.redirect(url);
});

// 카카오 로그인 시작
router.get("/kakao/start", (req, res) => {
  try {
    const url = startKakaoLogin();
    res.redirect(url);
  } catch (error) {
    console.error("Error during Kakao login start:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// 카카오 로그인 완료
router.get("/kakao/finish", async (req, res) => {
  const finalUrl = getKakaoUrl(req);
  await finishKakaoLogin(finalUrl, req, res);
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: "로그아웃 실패" });
    }
    res.clearCookie("token"); // 쿠키 삭제
    res.json({ success: true, message: "로그아웃 성공" });
  });
});

module.exports = router;
