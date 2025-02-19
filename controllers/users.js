const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { SECRET } = require("../utils/config");

// Middleware: Extract & Verify Token
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

// GET: Fetch All Users (Excluding Password)
router.get("/", async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ["password"] } });
  res.json(users);
});

// GET: Fetch a Single User by ID (Excluding Password)
router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["password"] },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// POST: Create a New User (Sign Up)
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT: Update User Info (User Can Only Update Themselves)
router.put("/:id", tokenExtractor, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    // Ensure users can only update their own profile
    if (user.id !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "You can only update your own account" });
    }

    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists)
        return res.status(400).json({ error: "Email already in use" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE: Remove a User (User Can Only Delete Themselves)
router.delete("/:id", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.id !== req.decodedToken.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own account" });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
