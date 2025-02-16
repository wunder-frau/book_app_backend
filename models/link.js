const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class Link extends Model {}

Link.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    url: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    tableName: "links",
    modelName: "link",
    underscored: true,
    timestamps: false,
  }
);

module.exports = Link;
