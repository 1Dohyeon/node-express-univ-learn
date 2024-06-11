const Comment = require("../models/comment.entity");
const User = require("../models/user.entity");

// 댓글 생성
exports.createComment = async (userId, postId, content) => {
  return await Comment.create({
    userId,
    postId,
    content,
  });
};

// 댓글 고유 id를 통해 댓글 정보 가져옴
exports.getCommentById = async (commentId) => {
  return await Comment.findByPk(commentId);
};

// 게시글 id를 통해 게시글에 적힌 모든 댓글을 가져옴
exports.getCommentsByPostId = async (postId) => {
  return await Comment.findAll({
    where: { postId },
    include: [{ model: User, attributes: ["id", "nickname"] }],
    order: [["createdAt", "ASC"]],
  });
};

// 댓글 삭제
exports.deleteComment = async (commentId) => {
  return await Comment.destroy({ where: { id: commentId } });
};
