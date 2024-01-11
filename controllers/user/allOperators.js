const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const AllOperators = async (req, res, next) => {
  try {
    const { userId, name, role } = req.user;
    if (role !== 'user') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Only main user can get users',
      });
    }
    const user = await User.findById(userId);

    const { dmSerial } = user;
    // find all users with dmSerial and role operator and status active true
    const users = await User.find(
      { dmSerial: dmSerial, role: 'operator', active: true },
      {
        password: 0,
        subscriptionExpiry: 0,
        address: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
      }
    );
    if (users.length == 0) {
      return res.status(StatusCodes.OK).json({
        success: false,
        message: 'No users found',
        data: users,
      });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'All users',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  AllOperators,
};
