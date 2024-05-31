const express = require("express");
const { Post, User, KakaoUser } = require("../models");

const router = express.Router();

// 게시글 작성
router.post("/", async (req, res) => {
  const { title, content, userId, kakaoUserId, location } = req.body;

  try {
    const post = await Post.create({
      title,
      content,
      userId,
      kakaoUserId,
      location,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 게시글 조회
router.get("/", async (req, res) => {
  const { location } = req.query;

  try {
    const posts = await Post.findAll({ where: { location } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
