// Ensure compatibility for older modules that expect `SlowBuffer` (Node 26 removal fix)
if (typeof global.SlowBuffer === 'undefined') {
  global.SlowBuffer = Buffer;
}

const dotenv = require("dotenv");
const colors = require("colors");

// Load environment variables
dotenv.config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
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
// Increase body size limits to support large inline media uploads
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));
app.use(errorHandler);

// API routes
// Mount auth routes under the standard API prefix.
app.use("/api/v1/auth", authRoutes);

// Backwards-compatible mount for clients still calling "/v1/auth" (pre-existing clients).
app.use("/v1/auth", authRoutes);
app.use("/api/gemini", geminiRoutes);
// Backwards-compatible mount for clients calling "/gemini" without the "/api" prefix.
app.use("/gemini", geminiRoutes);
// Rate limiter for Gemini endpoints to protect quota
const GEMINI_RATE_LIMIT_WINDOW_MS = parseInt(process.env.GEMINI_RATE_LIMIT_WINDOW_MS || '60000', 10);
const GEMINI_RATE_LIMIT_MAX = parseInt(process.env.GEMINI_RATE_LIMIT_MAX || '15', 10);

const geminiLimiter = rateLimit({
  windowMs: GEMINI_RATE_LIMIT_WINDOW_MS,
  max: GEMINI_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.setHeader('Retry-After', String(Math.ceil(GEMINI_RATE_LIMIT_WINDOW_MS / 1000)));
    res.status(429).json({ success: false, message: 'Too many requests - try again later.' });
  },
});

// Apply limiter to Gemini routes
app.use('/api/gemini', geminiLimiter, geminiRoutes);
app.use('/gemini', geminiLimiter, geminiRoutes);

// Only start server in development
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 8080;
//   app.listen(PORT, () => {
//     console.log(`Server Running on port ${PORT}`.bgCyan.white);
//   });
// }
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`.bgCyan.white);
});


app.get("/", (req, res) => {
  res.json({ message: "Backend is running success!" });
});

// Export the app for Vercel serverless functions
module.exports = app;

