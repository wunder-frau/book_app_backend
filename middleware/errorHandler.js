const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.message) {
    return res.status(400).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal server error" });
};

module.exports = errorHandler;
