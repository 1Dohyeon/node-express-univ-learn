const express = require("express");
const { Comment, User, KakaoUser, Post } = require("../models");

const router = express.Router();

// 댓글 작성
router.post("/", async (req, res) => {
  const { content, userId, kakaoUserId, postId } = req.body;

  try {
    const comment = await Comment.create({
      content,
      userId,
      kakaoUserId,
      postId,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 댓글 조회
router.get("/", async (req, res) => {
  const { postId } = req.query;

  try {
    const comments = await Comment.findAll({ where: { postId } });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
