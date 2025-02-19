const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class Author extends Model {}

Author.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "authors",
    modelName: "author",
    underscored: true,
    timestamps: false,
  }
);

module.exports = Author;
