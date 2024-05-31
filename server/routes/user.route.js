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
router.put("/my", isAuthenticated, userService.updateUser);

// 사용자 기본 정보 조회
router.get("/:id", userService.getUserProfile);

module.exports = router;
