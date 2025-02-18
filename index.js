const express = require("express");
const cors = require("cors");
require("express-async-errors");
const { requestLogger, errorLogger } = require("./middleware/logger");
const app = express();

const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");

const usersRouter = require("./controllers/users");
const authRoutes = require("./controllers/auth");
const booksRoutes = require("./controllers/books");
const notesRoutes = require("./controllers/notes");

const errorHandler = require("./middleware/errorHandler");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(requestLogger);

app.use("/api/users", usersRouter);
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/notes", notesRoutes);

app.use(errorHandler);
app.use(errorLogger);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
