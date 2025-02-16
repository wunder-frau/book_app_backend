const express = require("express");
require("express-async-errors");
const app = express();

const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");

const usersRouter = require("./controllers/users");
const authRoutes = require("./controllers/auth");
// const blogsRouter = require("./controllers/blogs");
// const loginRouter = require("./controllers/login");

const errorHandler = require("./middleware/errorHandler");
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
