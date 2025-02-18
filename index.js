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
//app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const allowedOrigins = ["https://books.iresta.rest", "http://localhost:5173"];

app.use(
  cors({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(requestLogger);

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
