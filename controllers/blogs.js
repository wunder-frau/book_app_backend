const router = require("express").Router();
const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  try {
    req.blog = await Blog.findByPk(req.params.id);
    if (!req.blog) {
      return next(new Error("Blog not found"));
    }
    next();
  } catch (error) {
    next(error);
  }
};

// GET all blogs
router.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// GET a specific blog by ID
// router.get("/:id", blogFinder, async (req, res) => {
//   res.json(req.blog);
// });

// // POST a new blog (Centralized error handling)
// router.post("/", async (req, res, next) => {
//   try {
//     const { author, url, title, likes } = req.body;

//     if (!author || !url || !title) {
//       return next(new Error("Author, URL, and Title are required"));
//     }

//     const blog = await Blog.create({ author, url, title, likes });
//     res.status(201).json(blog);
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/", async (req, res, next) => {
  try {
    const { title, url, userId } = req.body;
    if (!title || !url || !userId) {
      return next(new Error("Title, URL, and userId are required"));
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return next(new Error("User not found"));
    }
    const blog = await Blog.create({
      title,
      url,
      author: user.username,
      userId,
    });

    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

// DELETE a blog by ID
router.delete("/:id", blogFinder, async (req, res, next) => {
  try {
    await req.blog.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// UPDATE blog likes
router.put("/:id", blogFinder, async (req, res, next) => {
  try {
    const { likes } = req.body;

    if (typeof likes !== "number") {
      return next(new Error("Likes must be a number"));
    }

    if (likes !== 1 && likes !== -1) {
      return next(new Error("You can only increment or decrement by 1"));
    }

    const newLikes = req.blog.likes + likes;
    if (newLikes < 0) {
      return next(new Error("Likes cannot be negative"));
    }

    req.blog.likes = newLikes;
    await req.blog.save({ fields: ["likes"] });

    res.json(req.blog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
