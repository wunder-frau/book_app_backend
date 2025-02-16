const router = require("express").Router();
const { Book, User, Author } = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "Token missing or incorrect format" });
  }
  try {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalid" });
  }
};

router.get("/", async (req, res) => {
  const books = await Book.findAll({
    attributes: { exclude: ["user_id", "author_id"] },
    include: [{ model: Author, attributes: ["id", "firstname", "lastname"] }],
  });
  res.json(books);
});

router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    const { title, firstname, lastname } = req.body;
    if (!title || !firstname || !lastname) {
      return res.status(400).json({
        error: "All fields (title, firstname, lastname) are required",
      });
    }

    let author = await Author.findOne({
      where: { firstname, lastname },
    });

    if (!author) {
      author = await Author.create({ firstname, lastname });
    }

    const book = await Book.create({
      title,
      author_id: author.id,
      user_id: user.id,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", tokenExtractor, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.user_id !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "You can only update your own books" });
    }

    const { title, firstname, lastname } = req.body;

    if (!title && !firstname && !lastname) {
      return res
        .status(400)
        .json({ error: "At least one field must be updated" });
    }

    if (title) book.title = title;

    if (firstname && lastname) {
      let author = await Author.findOne({ where: { firstname, lastname } });

      if (!author) {
        author = await Author.create({ firstname, lastname });
      }

      book.author_id = author.id;
    }

    await book.save();
    res.json({ message: "Book updated successfully", book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", tokenExtractor, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.user_id !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own books" });
    }

    await book.destroy();
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
