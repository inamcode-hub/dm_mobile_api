const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const AddOperator = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { userId, name, role } = req.user;
    // check if user is main user
    if (role !== 'user') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Only main user can add user',
      });
    }
    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'User not found',
      });
    }
    const { farmName, dmSerial, subscriptionExpiry } = user;

    // check if 5 users are already added
    // also include main user
    const users = await User.find({ dmSerial: dmSerial });
    if (users.length >= 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Only 5 users are allowed',
      });
    }
    const newUser = await User.create({
      firstName,
      lastName,
      farmName,
      email,
      password,
      role: 'operator',
      dmSerial,
      subscriptionExpiry,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User created successfully!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddOperator,
};
