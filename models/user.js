const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const bcrypt = require("bcrypt");

class User extends Model {
  async validPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

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
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
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
