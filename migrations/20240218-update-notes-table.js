const { Sequelize } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("notes", "content", {
      type: Sequelize.STRING(5000),
      allowNull: false,
    });

    await queryInterface.addColumn("notes", "created_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("notes", "updated_at", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn("notes", "content", {
      type: Sequelize.TEXT,
      allowNull: false,
    });

    await queryInterface.removeColumn("notes", "created_at");
    await queryInterface.removeColumn("notes", "updated_at");
  },
};
