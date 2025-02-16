const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class Picture extends Model {}

Picture.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    image_url: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    sequelize,
    tableName: "pictures",
    modelName: "picture",
    underscored: true,
    timestamps: false,
  }
);

module.exports = Picture;
