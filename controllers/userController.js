// controllers/userController.js

const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ==========>>>>>> Create operation - create a user
const createUser = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  //  check if user count is 0 then role will be admin else user
  const isFirstAccount = await User.countDocuments({});
  const role = isFirstAccount === 0 ? 'admin' : 'user';
  try {
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    const token = await user.createJWT();
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully!',
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
    });
  } catch (err) {
    next(err);
  }
};

// ==========>>>>>> login operation - login user

const LoginUser = async (req, res, next) => {
  const { email, password } = req.body;
  //  check if email and password is provided

  if (!email || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Please provide email and password' });

  //  check if password is at least 8 characters

  if (password.length < 8)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Password must be at least 8 characters',
    });

  const user = await User.findOne({ email });

  // check if user exists

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Invalid credentials' });
  }
  const isPasswordCorrect = await user.comparePassword(password);

  //  check if password is correct

  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Invalid credentials' });
  }
  //  create token and send to client

  const token = await user.createJWT();
  const { role, firstName, lastName } = user;
  res
    .status(StatusCodes.OK)
    .json({ success: true, role, firstName, lastName, token });
};

// ==========>>>>>> Forgot Password operation - forgot password

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  //  check if email is provided

  if (!email)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Please provide email' });

  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'User not found with this email' });
  }
  const token = await user.createPasswordResetToken();
  const link = `${process.env.HOST_URL}/forgot-password-update?email=${email}&token=${token}`;

  const msg = {
    to: email, // The recipient's email address
    from: process.env.SENDGRID_EMAIL_SENDER, // Your verified sender email address
    subject: 'Reset Your Password',
    text: `Hi there,\n\nWe received a request to reset your password for your account. If you did not request a password reset, please ignore this email.\n\nTo reset your password, please click the link below:\n${link}\n\nBest,\nThe DryerMaster Team`,
    html: `<p>Hi there,</p><p>We received a request to reset your password for your account. If you did not request a password reset, please ignore this email.</p><p>To reset your password, please click the link below:<br><a href="${link}">Reset Password</a></p><p>Best,<br>The DryerMaster Team</p>`,
  };

  try {
    await sgMail.send(msg);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password reset email sent successfully',
      email,
    });
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Failed to send password reset email' });
  }
};

// ==========>>>>>> Export module

module.exports = {
  createUser,
  LoginUser,
  forgotPassword,
};
