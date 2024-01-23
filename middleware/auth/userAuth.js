const jose = require('jose');
const User = require('../../models/User');
const { StatusCodes } = require('http-status-codes');

// Middleware for normal authentication
const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  // check if auth header exists and starts with Bearer

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Bearer token is missing!' });
  }

  // get token from auth header
  const token = authHeader.split(' ')[1];

  try {
    const { payload, protectedHeader } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const { userId, name, iss } = payload;
    req.user = { userId, name, role: iss };
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized to access this route!',
      result: error?.code,
    });
  }
  const _id = req.user.userId;
  const iss = req.user.role;
  const user = await User.findOne({ _id });
  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'You are not authorized!' });
  }
  if (user.active === false) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'You are not authorized!' });
  }
  if (user.role !== iss) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'You are not authorized!' });
  }
  next();
};

module.exports = { authenticateUser };
