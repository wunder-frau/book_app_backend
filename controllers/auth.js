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
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json({ error: "Name and password are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    const hash_password = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      password: hash_password,
      email,
    });

    const userForToken = { id: user.id, email: user.email };
    const accessToken = jwt.sign(userForToken, SECRET, {
      expiresIn: 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      message: "User created successfully",
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: 60 * 60 * 24 * 7,
    });

    res.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/profile", tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
