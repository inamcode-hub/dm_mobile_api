const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
const Dryermaster = require('../../models/Dryermaster');

// ==========>>>>>> Create operation - create a user
const loginDryermaster = async (req, res, next) => {
  const { dmSerial, dmPassword } = req.body;
  if (!dmSerial || !dmPassword) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please provide Dryermaster serial and password',
    });
  }
  try {
    const dm = await Dryermaster.findOne({ dmSerial, dmPassword });
    if (!dm) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
    const existingUser = await User.findOne({ dryermasterId: dm._id });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User already registered with this Dryermaster',
      });
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Dryermaster logged in successfully!',
      dryermasterId: dm._id,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loginDryermaster,
};
