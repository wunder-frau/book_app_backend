const { Sequelize } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      about: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image_link: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable("users");
  },
};
