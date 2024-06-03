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
        },
        location: {
          type: Sequelize.STRING(100),
          allowNull: true,
          defaultValue: "서울특별시 중구",
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
      }
    );
  }

  static associate(models) {
    this.hasMany(models.Post, { foreignKey: "userId", sourceKey: "id" });
    this.hasMany(models.Comment, { foreignKey: "userId", sourceKey: "id" });
  }
};
