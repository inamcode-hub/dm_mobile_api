const { StatusCodes } = require('http-status-codes');

// ==========>>>>>> login operation - login user - validateLoginInput
const sendErrorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

const validateLoginInput = (email, password, res) => {
  if (!email || !password) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Please provide email and password'
    );
  }
  if (password.length < 8) {
    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      'Password must be at least 8 characters'
    );
  }
};

module.exports = { validateLoginInput, sendErrorResponse };
