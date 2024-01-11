const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const EditOperator = async (req, res, next) => {
  try {
    const { firstName, lastName, email, operatorId, password } = req.body;
    const { userId, name, role } = req.user;
    // check if user is main user
    if (role !== 'user') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Only main user can edit Operator',
      });
    }

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
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Operator not found',
      });
    }
    let updatedOperator;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updatedOperator = await User.findByIdAndUpdate(
        operatorId,
        {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
        { new: true }
      );
    } else {
      updatedOperator = await User.findByIdAndUpdate(
        operatorId,
        {
          firstName,
          lastName,
          email,
        },
        { new: true }
      );
    }

    if (updatedOperator) {
      updatedOperator.password = undefined;
      // any other fields you want to exclude
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Operator Updated successfully!',
      data: updatedOperator,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  EditOperator,
};
