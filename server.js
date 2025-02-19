const dotenv = require("dotenv");
const colors = require("colors");

// Load environment variables
dotenv.config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middelwares/errorMiddleware");

// Verify environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables".red);
  process.exit(1);
}

// Initialize MongoDB connection
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const geminiRoutes = require("./routes/geminiRoutes");

// Initialize Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(errorHandler);

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/gemini", geminiRoutes);

// Export the app for Vercel serverless functions
module.exports = app;
