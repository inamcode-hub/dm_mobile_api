const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const DeleteOperator = async (req, res, next) => {
  const operatorId = req.params.id;
  try {
    const { userId, name, role } = req.user;
    // check if user is main user
    if (role !== 'user') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Only main user can delete Operator',
      });
    }
    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'User not found',
      });
    }
    const { farmName, dmSerial, subscriptionExpiry } = user;
    // find operator
    const operator = await User.findById(operatorId);
    if (!operator) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Operator not found',
      });
    }
    if (operator.dmSerial !== dmSerial) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Operator not found',
      });
    }
    // delete operator
    const deletedOperator = await User.findByIdAndDelete(operatorId);
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Operator Deleted successfully!',
      data: deletedOperator,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  DeleteOperator,
};
