const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors());

// Connect MongoDB
connectDB();

// Test Route
app.get("/test", (req, res) => {
  res.send("Backend Working ✅");
});

// Products Route
app.use("/api/products", require("./routes/productRoutes"));

// Server Start
app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
const openrouterRoutes = require("./routes/openrouterRoutes");
app.use("/api/chatbot", openrouterRoutes);