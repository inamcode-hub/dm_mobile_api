// controllers/userController.js

const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

// ==========>>>>>> Create operation - create a user
const createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const isFirstAccount = await User.countDocuments({});
    const role = isFirstAccount === 0 ? 'admin' : 'user';
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
  // check if email and password is provided
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
  try {
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
  } catch (err) {
    next(err);
  }
};

// ==========>>>>>> Forgot Password operation - forgot password

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  //  check if email is provided
  if (!email)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Please provide email' });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'User not found with this email' });
    }
    const token = await user.createPasswordResetToken();
    await User.findOneAndUpdate({ email }, { recoveryToken: token });

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
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to send password reset email',
      });
    }
  } catch (err) {
    next(err);
  }
};

// ==========>>>>>> Update Forgot Password operation - update password

const updateForgotPassword = async (req, res, next) => {
  const { email, token, password } = req.body;

  //  check if email and password is provided

  if (!email || !token || !password)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please provide email, token and password',
    });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'User not found with this email' });
    }

    if (token !== user.recoveryToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Invalid token' });
    }

    try {
      await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Token has expired',
        result: error,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    const userToken = await user.createJWT();
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password updated successfully',
      token: userToken,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

// ==========>>>>>> Export module

module.exports = {
  createUser,
  LoginUser,
  forgotPassword,
  updateForgotPassword,
};
