const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error status
  let statusCode = err.statusCode || 500;

  // Default error message
  let message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = errorHandler;