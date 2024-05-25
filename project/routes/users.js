const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
const router = express.Router();

// 회원가입
router.post("/", async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });
    if (existingUser) {
      return res.status(400).json({ error: "이미 존재하는 이메일입니다." });
    }

    const hash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 로그인
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "사용자를 찾을 수 없습니다.",
      });
    }

    const result = await bcrypt.compare(req.body.password, user.password);
    if (result) {
      const token = generateToken(user);
      res.json({ success: true, token });
    } else {
      res
        .status(400)
        .json({ success: false, message: "비밀번호가 일치하지 않습니다." });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
