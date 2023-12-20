const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const subscriptionCheck = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    const currentDate = new Date();
    const expiryDate = new Date(user.subscriptionExpiry);
    if (currentDate > expiryDate) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'User subscription expired',
        isExpired: true,
        expiryDate: user.subscriptionExpiry,
      });
    } else {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'User subscription not expired',
        isExpired: false,
        expiryDate: user.subscriptionExpiry,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscriptionCheck,
};
