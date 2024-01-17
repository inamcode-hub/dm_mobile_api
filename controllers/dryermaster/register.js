const { StatusCodes } = require('http-status-codes');
const Dryermaster = require('../../models/Dryermaster');

// Create operation

const register = async (req, res, next) => {
  const { dmSerial, dmPassword } = req.body;
  const { userId, name, iss } = req.user;
  if (!dmSerial || !dmPassword)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please provide serial number and password',
    });

  try {
    const dryermaster = await Dryermaster.create({
      dmSerial,
      dmPassword,
      createdBy: userId,
    });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Dryermaster created',
      result: dryermaster,
    });
  } catch (err) {
    next(err);
  }
};

exports.register = register;
