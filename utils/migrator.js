const { Umzug, SequelizeStorage } = require("umzug");
const { sequelize } = require("./db");

// Configure Umzug
const migrator = new Umzug({
  migrations: { glob: "migrations/*.js" },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
});

const runMigrations = async () => {
  await sequelize.authenticate();
  await migrator.up();
  console.log("Migrations applied!");
};

const rollbackLastMigration = async () => {
  await sequelize.authenticate();
  await migrator.down();
  console.log("Rolled back last migration.");
};

const showMigrationStatus = async () => {
  await sequelize.authenticate();
  const executed = await migrator.executed();
  console.log(
    "Executed Migrations:",
    executed.map((m) => m.name)
  );
};

module.exports = { runMigrations, rollbackLastMigration, showMigrationStatus };
