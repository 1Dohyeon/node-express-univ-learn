const express = require("express");
const router = express.Router();

// 홈 페이지 라우트
router.get("/", (req, res) => {
  res.redirect("/posts");
});

// 로그인 페이지 라우트
router.get("/login", (req, res) => {
  res.render("login.html");
});

// 회원가입 페이지 라우트
router.get("/register", (req, res) => {
  res.render("register.html");
});

module.exports = router;
