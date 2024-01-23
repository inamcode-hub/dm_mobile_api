const { StatusCodes } = require('http-status-codes');
const User = require('../../../models/User');
const Dryermaster = require('../../../models/Dryermaster');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const AddOperator = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please fill all required fields!',
    });
  }
  try {
    const { role, userId, dryermasterId } = req.user;
    // check if user is main user
    if (role !== 'user') {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Only admin can add operator',
      });
    }
    const dryermaster = await Dryermaster.findOne({ _id: dryermasterId });
    if (!dryermaster) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'You are not authorized!',
      });
    }
    const { totalOperators } = dryermaster;
    const users = await User.find({ dryermasterId, active: true });
    const totalUsers = await User.find({ dryermasterId });

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
      farmName: users[0]?.farmName,
      email,
      password,
      role: 'operator',
      dryermasterId,
    });
    newUser.password = undefined;
    newUser.__v = undefined;
    newUser.dryermasterId = undefined;
    newUser.role = undefined;
    newUser._id = undefined;

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
