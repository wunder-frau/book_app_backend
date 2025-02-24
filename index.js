const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
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

const allowedOrigins = [
  "https://books.iresta.rest",
  "http://localhost:5173",
  "http://localhost:5174",
];
app.use(
  cors({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: allowedOrigins,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  })
);

app.use(express.json());
app.use(requestLogger);

app.use(helmet({ permissionsPolicy: false }));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("The server is about to crash");
  }, 0);
});

app.use("/api/users", usersRouter);
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.use("/api/notes", notesRoutes);

app.use(errorLogger);
app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
