const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

// ==========>>>>>> 1. Profile Read
const profileRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select(
      '-password -recoveryToken'
    );
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User profile',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  profileRead,
};
