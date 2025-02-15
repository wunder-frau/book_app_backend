const router = require("express").Router();
const { Blog } = require("../models");

// Middleware to find a blog by ID
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) return res.status(404).json({ error: "Blog not found" });
  next();
};

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

router.get("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    res.json(req.blog);
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.status(201).json(blog);
  } catch (error) {
    return res.status(400).json({ error: "Failed to create blog" });
  }
});

router.delete("/:id", blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
    return res.status(204).end();
  } else {
    return res.status(404).json({ error: "Blog not found" });
  }
});

router.put("/:id", blogFinder, async (req, res) => {
  const { likes } = req.body;

  if (likes !== 1 && likes !== -1) {
    return res
      .status(400)
      .json({ error: "You can only increment or decrement by 1" });
  }

  if (typeof likes !== "number") {
    return res.status(400).json({ error: "Likes must be a number" });
  }

  const likesCount = req.blog.likes + likes;
  if (likesCount < 0) {
    return res.status(400).json({ error: "Likes cannot be negative" });
  }
  req.blog.likes = likesCount;
  await req.blog.save({ fields: ["likes"] });
  console.log("After Update:", req.blog.likes);
  res.json(req.blog);
});

module.exports = router;
