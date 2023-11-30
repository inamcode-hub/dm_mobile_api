// controllers/userController.js

const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
var bcrypt = require('bcryptjs');

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

// ==========>>>>>> Export module

module.exports = {
  createUser,
  LoginUser,
};
