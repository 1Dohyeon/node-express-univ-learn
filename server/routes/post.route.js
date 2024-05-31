const express = require("express");
const router = express.Router();
const postService = require("../service/post.service");
const userService = require("../service/user.service");

// 로그인 확인 미들웨어
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// 게시글 작성 페이지
router.get("/write", isAuthenticated, (req, res) => {
  res.render("post_write.html");
});

// 게시글 작성
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = await userService.getUserById(req.user.id);
    const post = await postService.createPost(
      req.user.id,
      title,
      content,
      user.location
    );
    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 게시글 목록 조회 및 렌더링
router.get("/", async (req, res) => {
  try {
    let location = "서울 중구"; // 기본 위치
    if (req.isAuthenticated()) {
      const user = await userService.getUserById(req.user.id);
      location = user.location;
    }
    const posts = await postService.getPostsByLocation(location);
    res.render("posts.html", { posts, location, user: req.user });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 게시글 상세 조회
router.get("/:id", async (req, res) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.render("post.html", { post });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

module.exports = router;
