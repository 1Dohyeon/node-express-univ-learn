const express = require("express");
const { User } = require("../models");
const { verifyToken } = require("../utils/jwt");

const router = express.Router();

// 사용자 정보 조회
router.get("/mypage", verifyToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "location"],
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 사용자 정보 수정
router.put("/mypage", verifyToken, async (req, res) => {
  const { name, location } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      user.name = name || user.name;
      user.location = location || user.location;
      await user.save();
      res.json({ success: true, user });
    } else {
      res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
