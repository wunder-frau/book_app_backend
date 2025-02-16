const User = require("./user");
const Book = require("./book");

// User.hasMany(Blog);
// // Blog.belongsTo(User);
// // Blog.sync({ alter: true });
// User.sync({ alter: true });

User.hasMany(Book, { foreignKey: "user_id", onDelete: "CASCADE" });
Book.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  User,
  Book,
};
