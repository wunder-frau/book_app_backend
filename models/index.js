const User = require("./user");
const Book = require("./book");
const Note = require("./note");
const Link = require("./link");
const Picture = require("./picture");
const Author = require("./author");

// A User can have many Books
User.hasMany(Book, { foreignKey: "user_id", onDelete: "CASCADE" });
Book.belongsTo(User, { foreignKey: "user_id" });

// A Book belongs to an Author (1 author can have many books)
Author.hasMany(Book, { foreignKey: "author_id", onDelete: "CASCADE" });
Book.belongsTo(Author, { foreignKey: "author_id" });

// A Book can have many Notes
Book.hasMany(Note, { foreignKey: "book_id", onDelete: "CASCADE" });
Note.belongsTo(Book, { foreignKey: "book_id" });

// A Book can have many Links
Book.hasMany(Link, { foreignKey: "book_id", onDelete: "CASCADE" });
Link.belongsTo(Book, { foreignKey: "book_id" });

// A Book can have many Pictures
Book.hasMany(Picture, { foreignKey: "book_id", onDelete: "CASCADE" });
Picture.belongsTo(Book, { foreignKey: "book_id" });

module.exports = { User, Book, Note, Link, Picture, Author };
