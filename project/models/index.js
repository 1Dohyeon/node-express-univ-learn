'use strict';

const Sequelize = require('sequelize');
const User = require('./user');
const Comment = require('./comment');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

// Sequelize 객체 생성 - mysql의 DB와 연결할 수 있는 객체
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;

db.User = User;
db.Comment = Comment;

// 모델 생성 ==> 모델에 해당하는 mysql table 생성
User.init(sequelize);
Comment.init(sequelize);

// 두 모델간 관계 설정
User.associate(db);
Comment.associate(db);

module.exports = db;
