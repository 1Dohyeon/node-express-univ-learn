const Sequelize = require("sequelize");
const User = require("./user");
const SearchHistory = require("./searchHistory");
const KakaoUser = require("./kakaoUser");
const Post = require("./post");
const Comment = require("./comment");

const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
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
models.SearchHistory = SearchHistory;
models.KakaoUser = KakaoUser;
models.Post = Post;
models.Comment = Comment;

// 모델 초기화
User.init(sequelize);
SearchHistory.init(sequelize);
KakaoUser.init(sequelize);
Post.init(sequelize);
Comment.init(sequelize);

// 두 모델간 관계 설정
User.associate(models);
SearchHistory.associate(models);
KakaoUser.associate(models);
Post.associate(models);
Comment.associate(models);

module.exports = models;
