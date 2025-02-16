const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image_link: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "user",
    underscored: true,
    timestamps: false,
  }
);

module.exports = User;
