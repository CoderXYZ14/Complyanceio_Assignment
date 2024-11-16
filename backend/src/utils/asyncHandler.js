const asyncHandler = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next);
  } catch (err) {
    // Changed from err.code to err.statusCode
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export { asyncHandler };
