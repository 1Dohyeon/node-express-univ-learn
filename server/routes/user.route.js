const express = require("express");
const router = express.Router();
const userService = require("../service/user.service");
const postService = require("../service/post.service");

// 로그인 확인 미들웨어
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// 마이페이지 - 사용자 정보 수정
router.get("/my", isAuthenticated, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    const posts = await postService.getPostsByUserId(req.user.id);
    res.render("user_my.html", { user, posts });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 사용자 기본 정보 조회
router.get("/:id", userService.getUserProfile);

// 사용자 정보 업데이트
router.put("/my", isAuthenticated, async (req, res) => {
  try {
    const { name, nickname, location } = req.body;
    await userService.updateUser(req.user.id, { name, nickname, location });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 사용자 삭제
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      throw new Error("사용자 id를 찾을 수 없습니다.");
    }
    await userService.deleteUser(userId);
    req.logout(); // 사용자 로그아웃 처리
    res.status(200).json({ message: "계정이 삭제되었습니다." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 시/도 목록 제공
router.get("/api/sido", async (req, res) => {
  try {
    const sidos = await userService.getSidoList();
    res.json(sidos);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 군/구 목록 제공
router.get("/api/gungu", async (req, res) => {
  try {
    const { sido } = req.query;
    const gungus = await userService.getGunguList(sido);
    res.json(gungus);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
