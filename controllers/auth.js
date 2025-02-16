const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { SECRET } = require("../utils/config");

const router = express.Router();

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing" });
  }

  try {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "token invalid" });
  }
};

router.post("/signup", async (req, res) => {
  try {
    const { name, password, about, image_link } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, about, image_link, password_hash });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await User.findOne({ where: { name } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, name: user.name }, SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/profile", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id, {
      attributes: { exclude: ["password_hash"] },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
