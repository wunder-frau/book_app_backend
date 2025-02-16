const router = require("express").Router();
const { Book, User } = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");

// ✅ Middleware: Extract and Verify JWT Token
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

// ✅ GET: Fetch all books
router.get("/", async (req, res) => {
  const books = await Book.findAll({
    attributes: { exclude: ["user_id"] },
    include: { model: User, attributes: ["id", "name"] },
  });
  res.json(books);
});

// ✅ POST: Create a new book (Only logged-in users)
router.post("/", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id);
    if (!user) return res.status(401).json({ error: "Invalid token" });

    const { title, author_name, author_lastname } = req.body;
    if (!title || !author_name || !author_lastname) {
      return res.status(400).json({
        error: "All fields (title, author_name, author_lastname) are required",
      });
    }

    const book = await Book.create({
      title,
      author_name,
      author_lastname,
      user_id: user.id,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ PUT: Update a book (Only the owner can update)
router.put("/:id", tokenExtractor, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    if (book.user_id !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "You can only update your own books" });
    }

    const { title, author_name, author_lastname } = req.body;
    book.title = title || book.title;
    book.author_name = author_name || book.author_name;
    book.author_lastname = author_lastname || book.author_lastname;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ DELETE: Remove a book (Only the owner can delete)
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

router.put("/:id", tokenExtractor, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });

    // 🔹 Only the owner of the book can update it
    if (book.user_id !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "You can only update your own books" });
    }

    // 🔹 Validate request body (Prevent empty updates)
    const { title, author_name, author_lastname } = req.body;
    if (!title && !author_name && !author_lastname) {
      return res
        .status(400)
        .json({ error: "At least one field must be updated" });
    }

    // 🔹 Update the fields (Only update provided values)
    if (title) book.title = title;
    if (author_name) book.author_name = author_name;
    if (author_lastname) book.author_lastname = author_lastname;

    await book.save();
    res.json({ message: "Book updated successfully", book });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
