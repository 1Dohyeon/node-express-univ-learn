const Post = require("../models/post.entity");
const User = require("../models/user.entity");

exports.getPostsByLocation = async (location) => {
  return await Post.findAll({
    where: { location },
    include: [{ model: User, attributes: ["nickname"] }],
    order: [["createdAt", "DESC"]],
  });
};

exports.createPost = async (userId, title, content, location) => {
  return await Post.create({
    userId,
    title,
    content,
    location,
  });
};

exports.getPostsByUserId = async (userId) => {
  return await Post.findAll({
    where: { userId },
    include: [{ model: User, attributes: ["nickname"] }],
    order: [["createdAt", "DESC"]],
  });
};

exports.getPostById = async (postId) => {
  return await Post.findByPk(postId, {
    include: [{ model: User, attributes: ["id", "nickname"] }],
  });
};

exports.updatePost = async (postId, title, content) => {
  return await Post.update({ title, content }, { where: { id: postId } });
};

exports.deletePost = async (postId) => {
  return await Post.destroy({ where: { id: postId } });
};
