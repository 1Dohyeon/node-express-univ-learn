const Sequelize = require("sequelize");

module.exports = class PostTag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        postId: {
          type: Sequelize.DataTypes.BIGINT,
          primaryKey: true,
          references: {
            model: "posts",
            key: "id",
          },
        },
        tagId: {
          type: Sequelize.DataTypes.BIGINT,
          primaryKey: true,
          references: {
            model: "tags",
            key: "id",
          },
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "PostTag",
        tableName: "posttags",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(models) {}
};
