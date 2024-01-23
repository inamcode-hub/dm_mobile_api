const { StatusCodes } = require('http-status-codes');
const Dryermaster = require('../../models/Dryermaster');
const Seller = require('../../models/Seller');
// Create operation

const register = async (req, res, next) => {
  const { dmSerial, dmPassword, soldBy, dmModel } = req.body;
  const { userId, name, iss } = req.user;
  if (!dmSerial || !dmPassword)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please provide serial number and password',
    });
  const seller = await Seller.findById(soldBy);
  if (!seller)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Seller not found',
    });

  try {
    const dryermaster = await Dryermaster.create({
      dmSerial,
      dmPassword,
      dmModel,
      createdBy: userId,
      soldBy,
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
