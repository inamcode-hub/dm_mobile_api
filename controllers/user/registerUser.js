const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

// ==========>>>>>> Create operation - create a user
const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, dmSerial } = req.body;
    const isFirstAccount = await User.countDocuments({});
    const role = isFirstAccount === 0 ? 'admin' : 'user';
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      dmSerial,
      subscriptionExpiry: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ),
    });
    const token = await user.createJWT();
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully!',
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
      email: user.email,
      dmSerial: user.dmSerial,
      subscriptionExpiry: user.subscriptionExpiry,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
};
