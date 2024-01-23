const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
const Dryermaster = require('../../models/Dryermaster');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const subscriptionCheck = async (req, res, next) => {
  const { userId, dryermasterId } = req.user;

  try {
    const dryermaster = await Dryermaster.findOne({ _id: dryermasterId });
    if (!dryermaster) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'You are not authorized!',
      });
    }

    const currentDate = new Date();
    const expiryDate = new Date(dryermaster.subscriptionExpiry);
    if (currentDate > expiryDate) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'User subscription expired',
        isExpired: true,
        expiryDate: dryermaster.subscriptionExpiry,
      });
    } else {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: 'User subscription not expired',
        isExpired: false,
        expiryDate: dryermaster.subscriptionExpiry,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscriptionCheck,
};
