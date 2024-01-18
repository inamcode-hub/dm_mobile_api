const { StatusCodes } = require('http-status-codes');
const User = require('../../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const AddOperator = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { role, totalOperators, dmSerial, farmName, subscriptionExpiry } =
      req.user;
    // check if user is main user
    if (role !== 'user') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Only admin can add operator',
      });
    }

    const users = await User.find({ dmSerial: dmSerial, active: true });
    const totalUsers = await User.find({ dmSerial: dmSerial });

    // maximum total Operators is totalOperators + 5
    if (totalUsers.length >= totalOperators + 6) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `You have reached maximum numbers of ${
          totalOperators + 5
        } operators!`,
      });
    }

    if (users.length > totalOperators) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `You can only add ${totalOperators} operators!`,
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
      totalOperators: 0,
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Operator created successfully!',
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AddOperator,
};
