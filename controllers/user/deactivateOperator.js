const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const DeactivateOperator = async (req, res, next) => {
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
    const { farmName, dmSerial, subscriptionExpiry } = user;
    // find operator
    const operator = await User.findById(operatorId);
    if (!operator) {
      return res.status(StatusCodes.NOT_FOUND).json({
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
    // change active status of user only
    const deletedOperator = await User.findByIdAndUpdate(
      operatorId,
      { active: false },
      {
        new: true,
        select:
          '-password -subscriptionExpiry -address -createdAt -updatedAt -__v',
      }
    );
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Operator Deactivate successfully!',
      data: deletedOperator,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  DeactivateOperator,
};
