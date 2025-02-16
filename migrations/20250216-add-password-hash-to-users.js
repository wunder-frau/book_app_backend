const { Sequelize } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("users", "password_hash", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.sequelize.query(`
      UPDATE users 
      SET password_hash = 'default_hashed_password'
      WHERE password_hash IS NULL;
    `);

    await queryInterface.changeColumn("users", "password_hash", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("users", "password_hash");
  },
};
