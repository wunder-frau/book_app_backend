const router = require("express").Router();
const { Note, Book } = require("../models");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");

// Middleware: Extract and Verify JWT Token
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

router.get("/:bookId", tokenExtractor, async (req, res) => {
  try {
    const userId = req.decodedToken.id;
    const notes = await Note.findAll({
      where: { book_id: req.params.bookId, user_id: userId },
      attributes: ["id", "content"],
    });

    console.log("Notes fetched from DB:", notes);

    res.json(Array.isArray(notes) ? notes : []);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving notes" });
  }
});

// POST: Create a note (Any user can add notes to an existing book)
router.post("/:bookId", tokenExtractor, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.bookId);
    if (!book) return res.status(404).json({ error: "Book not found" });

    const { content } = req.body;
    if (!content || content.length > 5000) {
      return res
        .status(400)
        .json({ error: "Content must be between 1 and 5000 characters" });
    }

    // Create note and link it to book + user
    const note = await Note.create({
      content,
      book_id: book.id,
      user_id: req.decodedToken.id, // Store who added the note
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update a note (Only the note owner can edit)
router.put("/:id", tokenExtractor, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    if (note.user_id !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "You can only update your own notes" });
    }

    const { content } = req.body;
    if (!content || content.length > 5000) {
      return res
        .status(400)
        .json({ error: "Content must be between 1 and 5000 characters" });
    }

    note.content = content;
    await note.save();
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Remove a note (Only the note owner can delete)
router.delete("/:id", tokenExtractor, async (req, res) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    if (note.user_id !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own notes" });
    }

    await note.destroy();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
