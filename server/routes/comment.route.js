const express = require("express");
const router = express.Router();
const commentService = require("../service/comment.service");

// 로그인 확인 미들웨어
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// 댓글 작성
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const { postId, content } = req.body;
    await commentService.createComment(req.user.id, postId, content);
    res.redirect(`/posts/${postId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 댓글 삭제
router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const comment = await commentService.getCommentById(req.params.id);
    if (comment.userId !== req.user.id) {
      return res.redirect(`/posts/${comment.postId}`);
    }
    await commentService.deleteComment(req.params.id);
    res.redirect(`/posts/${comment.postId}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
