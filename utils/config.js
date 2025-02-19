require("dotenv").config();

if (!process.env.SECRET) {
  throw new Error("SECRET key is missing! Define it in the .env file.");
}

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET,
};
