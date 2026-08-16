// Express calls this automatically whenever a route calls next(err),
// or when a route's async function throws.
module.exports = function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
