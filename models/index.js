const User = require("./user");
const Book = require("./book");
const Note = require("./note");
const Link = require("./link");
const Picture = require("./picture");

// User.hasMany(Blog);
// // Blog.belongsTo(User);
// // Blog.sync({ alter: true });
// User.sync({ alter: true });

User.hasMany(Book, { foreignKey: "user_id", onDelete: "CASCADE" });
Book.belongsTo(User, { foreignKey: "user_id" });

Book.hasMany(Note, { foreignKey: "book_id", onDelete: "CASCADE" });
Note.belongsTo(Book, { foreignKey: "book_id" });

Book.hasMany(Link, { foreignKey: "book_id", onDelete: "CASCADE" });
Link.belongsTo(Book, { foreignKey: "book_id" });

Book.hasMany(Picture, { foreignKey: "book_id", onDelete: "CASCADE" });
Picture.belongsTo(Book, { foreignKey: "book_id" });

module.exports = { User, Book, Note, Link, Picture };
