const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

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
    const { role, firstName, lastName, dmSerial, subscriptionExpiry } = user;
    res.status(StatusCodes.OK).json({
      success: true,
      role,
      firstName,
      lastName,
      token,
      email,
      dmSerial,
      subscriptionExpiry,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  LoginUser,
};
