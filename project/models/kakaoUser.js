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
    this.hasMany(models.SearchHistory, {
      foreignKey: "searcher_id",
      sourceKey: "id",
    });
  }
};
