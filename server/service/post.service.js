const { Post, User, Comment, Tag } = require("../models/index.entity");
const commentService = require("./comment.service");

// 게시글의 location 값에 따라 다른 게시글들을 보여줌
exports.getPostsByLocation = async (location) => {
  return await Post.findAll({
    where: { location },
    include: [{ model: User, attributes: ["nickname"] }],
    order: [["createdAt", "DESC"]],
  });
};

// 게시글 생성
exports.createPost = async (userId, title, content, location) => {
  return await Post.create({
    userId,
    title,
    content,
    location,
  });
};

exports.addTagsToPost = async (postId, tags) => {
  const post = await Post.findByPk(postId);
  if (!post) {
    throw new Error("Post not found");
  }
  await post.setTags(tags);
};

// 사용자 id를 통해 사용자가 작성한 모든 게시글을 불러옴
exports.getPostsByUserId = async (userId) => {
  return await Post.findAll({
    where: { userId },
    include: [{ model: User, attributes: ["nickname"] }],
    order: [["createdAt", "DESC"]],
  });
};

// 게시글 고유 id를 통해서 게시글을 가져옴
exports.getPostById = async (postId) => {
  const post = await Post.findByPk(postId, {
    include: [
      { model: User, attributes: ["id", "nickname"] },
      { model: Tag, attributes: ["name"] }, // 태그 정보 포함
    ],
  });
  const comments = await commentService.getCommentsByPostId(postId);
  return { post, comments };
};

// 태그와 위치로 게시글 검색
exports.getPostsByTagAndLocation = async (tagName, location) => {
  const tag = await Tag.findOne({ where: { name: tagName } });
  if (!tag) {
    throw new Error(`Tag '${tagName}' not found`);
  }

  return await Post.findAll({
    where: { location },
    include: [
      { model: User, attributes: ["nickname"] },
      { model: Tag, where: { name: tagName }, attributes: ["name"] },
    ],
  });
};

// 게시글 업데이트
exports.updatePost = async (postId, title, content) => {
  return await Post.update({ title, content }, { where: { id: postId } });
};

// 게시글 삭제
exports.deletePost = async (postId) => {
  return await Post.destroy({ where: { id: postId } });
};
