// post.route.js
const express = require("express");
const router = express.Router();
const postService = require("../service/post.service");
const userService = require("../service/user.service");
const tagService = require("../service/tag.service");

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
  res.render("post_write.html", { user: req.user });
});

// 게시글 작성
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const user = await userService.getUserById(req.user.id);
    const post = await postService.createPost(
      req.user.id,
      title,
      content,
      user.location
    );

    if (tags) {
      const tagNames = tags.split(",").map((tag) => tag.trim());
      const tagRecords = await tagService.findOrCreateTags(tagNames);
      await postService.addTagsToPost(post.id, tagRecords);
    }

    res.redirect("/posts");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 태그로 게시글 검색
router.get("/search", async (req, res) => {
  try {
    const { tag } = req.query;
    let location = "서울 중구"; // 기본 위치 설정

    if (req.isAuthenticated && req.isAuthenticated()) {
      const user = await userService.getUserById(req.user.id);
      location = user.location;
    }

    const posts = await postService.getPostsByTagAndLocation(tag, location);

    if (posts.length === 0) {
      return res.status(404).json([]);
    }
    res.json(posts);
  } catch (err) {
    if (err.message.includes("Tag")) {
      res.status(404).json([]);
    } else {
      res.status(500).json({ message: "태그 검색 중 오류가 발생했습니다." });
    }
  }
});

router.get("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    const { post } = await postService.getPostById(req.params.id);
    if (!post) {
      return res.redirect("/posts");
    }
    if (post.User.id !== user.id) {
      return res.redirect(`/posts/${req.params.id}`);
    }
    res.render("post_edit.html", { post, user });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 게시글 수정
router.post("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const { post } = await postService.getPostById(req.params.id);
    if (!post) {
      return res.redirect(`/posts/${req.params.id}`);
    }
    if (post.User.id !== req.user.id) {
      return res.redirect(`/posts/${req.params.id}`);
    }
    await postService.updatePost(req.params.id, title, content);
    if (tags) {
      const tagNames = tags.split(",").map((tag) => tag.trim());
      const tagRecords = await tagService.findOrCreateTags(tagNames);
      await postService.addTagsToPost(post.id, tagRecords);
    }
    res.redirect(`/posts/${req.params.id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 게시글 삭제
router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const { post } = await postService.getPostById(req.params.id);
    if (!post) {
      return res.redirect("/posts");
    }
    if (post.User.id !== req.user.id) {
      return res.redirect(`/posts/${req.params.id}`);
    }
    await postService.deletePost(req.params.id);
    res.redirect("/posts");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 게시글 목록 조회 및 렌더링
router.get("/", async (req, res) => {
  try {
    let location = "서울특별시 중구"; // 기본 위치
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
    const { post, comments } = await postService.getPostById(req.params.id);
    if (!post) {
      return res.redirect("/posts");
    }
    res.render("post.html", { post, comments, user: req.user });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
