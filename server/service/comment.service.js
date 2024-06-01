const Comment = require("../models/comment.entity");
const User = require("../models/user.entity");

exports.createComment = async (userId, postId, content) => {
  return await Comment.create({
    userId,
    postId,
    content,
  });
};

exports.getCommentById = async (commentId) => {
  return await Comment.findByPk(commentId);
};

exports.getCommentsByPostId = async (postId) => {
  return await Comment.findAll({
    where: { postId },
    include: [{ model: User, attributes: ["id", "nickname"] }],
    order: [["createdAt", "ASC"]],
  });
};

exports.deleteComment = async (commentId) => {
  return await Comment.destroy({ where: { id: commentId } });
};
