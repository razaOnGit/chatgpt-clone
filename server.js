const dotenv = require("dotenv");
const colors = require("colors");

// Load environment variables first, before any other imports
const result = dotenv.config();
if (result.error) {
    console.error("Error loading .env file:".red, result.error);
    process.exit(1);
}

// Log environment variables loading
console.log("Environment variables loaded:".cyan);
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "✓".green : "✗".red);
console.log("PORT:", process.env.PORT ? "✓".green : "✗".red);
console.log("DEV_MODE:", process.env.DEV_MODE ? "✓".green : "✗".red);

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

//mongo connection
connectDB();

//routes path
const authRoutes = require("./routes/authRoutes");
const geminiRoutes = require("./routes/geminiRoutes");

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

//API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/gemini", geminiRoutes);

// Export the app for Vercel serverless functions
module.exports = app;
