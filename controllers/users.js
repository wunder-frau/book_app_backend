const router = require("express").Router();

const { User } = require("../models");

router.get("/", async (req, res, next) => {
  const users = await User.findAll();
  res.json(users);
});

router.post("/", async (req, res) => {
  try {
    const { name, about, image_link } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name and username are required" });
    }

    const user = await User.create({
      name,
      about,
      image_link,
    });

    console.log("Created User:", user.toJSON()); // ✅ Debugging log

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).end();
  }
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  await user.destroy();
  res.json({ message: "User deleted successfully" });
});

router.put("/:id", async (req, res) => {
  try {
    const { name, about, image_link } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.about = about || user.about;
    user.image_link = image_link || user.image_link;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
