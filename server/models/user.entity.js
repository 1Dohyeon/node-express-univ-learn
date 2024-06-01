const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.DataTypes.BIGINT,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        nickname: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
          defaultValue: "", // 초기값을 빈 문자열로 설정
        },
        location: {
          type: Sequelize.STRING(100),
          allowNull: true,
          defaultValue: "서울 중구",
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
        hooks: {
          afterCreate: async (user, options) => {
            user.nickname = "user" + user.id;
            await user.save();
          },
        },
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Post, { foreignKey: "userId", sourceKey: "id" });
    this.hasMany(models.Comment, { foreignKey: "userId", sourceKey: "id" });
  }
};
