const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Keep the same structure even when it fails!
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [], // For validation details
    stack: process.env.NODE_ENV === "development" ? err.stack : null
  });
};

export { errorHandler };
