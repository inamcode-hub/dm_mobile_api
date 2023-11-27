const { StatusCodes } = require('http-status-codes');

// Global 404 error handler
const notFoundErrorHandler = (req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json({ success: false, message: 'Invalid URL' });
};

module.exports = {
  notFoundErrorHandler,
};
