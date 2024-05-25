const express = require("express");
const { verifyToken } = require("../utils/jwt");
const User = require("../models/user");
const router = express.Router();

router.get("/", async (req, res) => {
  const token = req.cookies.token;
  let user = null;
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜를 ISO 형식으로 변환

  if (token) {
    try {
      const decoded = verifyToken(token);
      user = await User.findByPk(decoded.id);
    } catch (err) {
      console.error("Invalid token");
    }
  }

  res.render("main", { user, today });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
