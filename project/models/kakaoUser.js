const Sequelize = require("sequelize");

module.exports = class KakaoUser extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.DataTypes.BIGINT,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        location: {
          type: Sequelize.STRING(100),
          allowNull: true,
          defaultValue: "서울 중구",
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "KakaoUser",
        tableName: "kakao_users",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Post, { foreignKey: "kakaoUserId", sourceKey: "id" });
    this.hasMany(models.Comment, {
      foreignKey: "kakaoUserId",
      sourceKey: "id",
    });
  }
};