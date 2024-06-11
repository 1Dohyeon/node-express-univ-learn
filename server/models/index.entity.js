const Sequelize = require("sequelize");
const User = require("./user.entity");
const Post = require("./post.entity");
const Comment = require("./comment.entity");
const Tag = require("./tag.entity");
const PostTag = require("./postTag.entity");

const env = process.env.NODE_ENV || "development";
const config = require("../config/dbConfig")[env];
const models = {};

// Sequelize 객체 생성 - MySQL의 DB와 연결할 수 있는 객체
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

models.sequelize = sequelize;
models.User = User;
models.Post = Post;
models.Comment = Comment;
models.Tag = Tag;
models.PostTag = PostTag;

// 모델 초기화
User.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);
Tag.init(sequelize);
PostTag.init(sequelize);

// 두 모델간 관계 설정
User.associate(models);
Post.associate(models);
Comment.associate(models);
Tag.associate(models);
// PostTag.associate(models);

module.exports = models;
