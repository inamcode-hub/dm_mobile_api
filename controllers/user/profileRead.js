const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ==========>>>>>> 1. Profile Read
const profileRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select(
      '-password -recoveryToken'
    );
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
