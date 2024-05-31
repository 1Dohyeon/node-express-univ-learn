const Post = require("../models/post.entity");
const User = require("../models/user.entity");

exports.getPostsByLocation = async (location) => {
  const posts = await Post.findAll({
    where: { location },
    include: [{ model: User, attributes: ["nickname"] }],
  });

  return posts;
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
    order: [["createdAt", "DESC"]],
  });
};

exports.getPostById = async (postId) => {
  return await Post.findByPk(postId, {
    include: [{ model: User, attributes: ["nickname"] }],
  });
};
