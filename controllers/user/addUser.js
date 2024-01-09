const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const AddUser = async (req, res, next) => {
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
      user: newUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddUser,
};
