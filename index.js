const express = require("express");
const app = express();

const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");

const blogsRouter = require("./controllers/blogs");

app.use(express.json());

app.use("/api/blogs", blogsRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
// require("dotenv").config();

// const { Sequelize, Model, DataTypes } = require("sequelize");
// const express = require("express");
// const app = express();
// app.use(express.json());

// const sequelize = new Sequelize(process.env.DATABASE_URL);

// class Blog extends Model {}

// Blog.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     author: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     url: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     title: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     likes: {
//       type: DataTypes.INTEGER,
//       defaultValue: 0,
//     },
//   },
//   {
//     sequelize,
//     underscored: true,
//     timestamps: false,
//     modelName: "blogs",
//   }
// );

// app.get("/api/blogs", async (req, res) => {
//   const notes = await Blog.findAll();
//   res.json(notes);
// });

// app.post("/api/blogs", async (req, res) => {
//   try {
//     const note = await Blog.create(req.body);
//     return res.json(note);
//   } catch (error) {
//     return res.status(400).json({ error });
//   }
// });

// app.delete("/api/blogs/:id", async (req, res) => {
//   try {
//     const blog = await Blog.findByPk(req.params.id);

//     if (!blog) {
//       return res.status(404).json({ error: "Blog not found" });
//     }

//     await blog.destroy(req.params.id);
//     return res.json(note);
//     res.status(204).end();
//   } catch (error) {
//     res.status(500).json({ error: "Failed to delete blog" });
//   }
// });

// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
