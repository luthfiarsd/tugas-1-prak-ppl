const express = require("express");
const itemRoutes = require("./routes/itemRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API berjalan normal",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.use("/api/items", itemRoutes);

app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(` Server berjalan di http://localhost:${PORT}`);
    console.log(` Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
