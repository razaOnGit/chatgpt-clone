const errorResponse = require("../utils/errroResponse");
const colors = require("colors");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log the error
  console.error(colors.red(`[ERROR] ${err.stack || err.message}`));

  // Mongoose cast Error
  if (err.name === "CastError") {
    const message = "Resource Not Found";
    error = new errorResponse(message, 404);
  }
  // Duplicate key error
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new errorResponse(message, 400);
  }
  // Mongoose validation
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new errorResponse(message, 400);
  }
  // API errors
  if (err.name === "APIError") {
    error = new errorResponse(err.message, err.statusCode || 500);
  }
  // General errors
  if (!error.statusCode) {
    error = new errorResponse("Internal Server Error", 500);
  }

  res.status(error.statusCode).json({
    success: false,
    error: error.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

module.exports = errorHandler;
