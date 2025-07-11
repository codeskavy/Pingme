import { envMode } from "../app.js";

// Middleware to catch and format errors
const errorMiddleware = (err, req, res, next) => {
  // Default message and status code
  err.message ||= "Internal Server Error";
  err.statusCode ||= 500;

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern).join(", ");
    err.message = `Duplicate field: ${field}`;
    err.statusCode = 400;
  }

  // Handle invalid ObjectId error (e.g., malformed MongoDB ID)
  if (err.name === "CastError") {
    err.message = `Invalid format for field: ${err.path}`;
    err.statusCode = 400;
  }

  // Structure the response
  const response = {
    success: false,
    message: err.message,
  };

  // Show error details in development mode only
  if (envMode === "DEVELOPMENT") {
    response.stack = err.stack;
    response.error = err;
  }

  return res.status(err.statusCode).json(response);
};

// TryCatch wrapper for route handlers (prevents repetitive try-catch blocks)
const TryCatch = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export { errorMiddleware, TryCatch };
