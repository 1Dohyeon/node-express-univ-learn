const express = require("express");
const authMiddleware = require("../middlewares/auth");
const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "이 페이지는 인증된 사용자만 볼 수 있습니다.",
    user: req.user,
  });
});

module.exports = router;
