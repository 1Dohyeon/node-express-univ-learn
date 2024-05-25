const Sequelize = require("sequelize");

module.exports = class SearchHistory extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        searcher_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        place: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        search_time: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: false,
        underscored: false,
        modelName: "SearchHistory",
        tableName: "searchHistory",
        paranoid: false,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "searcher_id", targetKey: "id" });
  }
};
