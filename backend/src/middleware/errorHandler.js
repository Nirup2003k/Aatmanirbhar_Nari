const errorHandler = (err, req, res, _next) => {
  console.error('API Error:', err);

  const statusCode = err.statusCode || err.status || (res.statusCode !== 200 ? res.statusCode : 500);

  if (statusCode >= 500) {
    return res.status(statusCode).json({
      success: false,
      message: 'Internal Server Error',
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An error occurred',
  });
};

module.exports = errorHandler;
