const express = require("express");
const { verifyToken } = require("../utils/jwt");
const User = require("../models/user");
const router = express.Router();

router.get("/", async (req, res) => {
  const token = req.cookies.token;
  let user = null;

  if (token) {
    try {
      const decoded = verifyToken(token);
      user = await User.findByPk(decoded.id);
    } catch (err) {
      console.error("Invalid token");
    }
  }

  res.render("main", { user });
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
