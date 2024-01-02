const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

// ==========>>>>>> 1. Profile Read
const profileUpdate = async (req, res, next) => {
  const { firstName, lastName, farmName, cellPhone, email } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user.userId,
      {
        firstName: firstName,
        lastName: lastName,
        farmName: farmName,
        cellPhone: cellPhone,
        email: email,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select('-password -recoveryToken -role -dmSerial');
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User profile updated',
      data: updateUser,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  profileUpdate,
};
