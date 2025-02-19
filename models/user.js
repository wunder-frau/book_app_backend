const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../utils/db");
const bcrypt = require("bcrypt");

class User extends Model {
  async validPassword(password) {
    return bcrypt.compare(password, this.password);
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
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
