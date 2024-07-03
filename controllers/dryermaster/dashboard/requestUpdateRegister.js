const { StatusCodes } = require('http-status-codes');
const User = require('../../../models/User');
const Dryermaster = require('../../../models/Dryermaster');
const {
  getSensorData,
  updateRegister,
} = require('../../../lib/beaglonebone_api_server/beagleboneApi');

const requestUpdateRegister = async (req, res, next) => {
  const _id = req.user.userId;
  const { registerAddress, newValue } = req.body;

  try {
    const user = await User.findById(_id);
    if (!user.dryermasterId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User doesn't have a Dryer Master registered!",
      });
    }

    const dryermaster = await Dryermaster.findById(user.dryermasterId);
    const serialNumber = dryermaster.dmSerial;

    // Get live data from BeagleBone server
    const sensorData = await updateRegister(
      serialNumber,
      registerAddress,
      newValue
    );
    if (!sensorData.success) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        message: sensorData.status,
      });
    }
    // Respond with success
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Sensor data requested successfully.',

      result: {
        sensorData,
      },
    });
  } catch (err) {
    next(err);
  }
};

const moistureSetpoint = async (req, res, next) => {
  const _id = req.user.userId;
  const { newValue } = req.body;
  const registerAddress = 17;

  try {
    const user = await User.findById(_id);
    if (!user.dryermasterId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User doesn't have a Dryer Master registered!",
      });
    }

    const dryermaster = await Dryermaster.findById(user.dryermasterId);
    const serialNumber = dryermaster.dmSerial;

    // Get live data from BeagleBone server
    const sensorData = await updateRegister(
      serialNumber,
      registerAddress,
      newValue
    );
    if (!sensorData.success) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        message: sensorData.status,
      });
    }
    // Respond with success
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Sensor data requested successfully.',
      result: sensorData,
    });
  } catch (err) {
    next(err);
  }
};
const dischargeRateSetpoint = async (req, res, next) => {
  const _id = req.user.userId;
  let { newValue } = req.body; // Use let instead of const
  const registerAddress = 100;

  // Ensure newValue is a number and multiply by 10
  newValue = Number(newValue) * 10;

  try {
    const user = await User.findById(_id);
    if (!user.dryermasterId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User doesn't have a Dryer Master registered!",
      });
    }

    const dryermaster = await Dryermaster.findById(user.dryermasterId);
    const serialNumber = dryermaster.dmSerial;

    // Get live data from BeagleBone server
    const sensorData = await updateRegister(
      serialNumber,
      registerAddress,
      newValue
    );
    if (!sensorData.success) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        message: sensorData.status,
      });
    }
    // Respond with success
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Sensor data requested successfully.',
      result: sensorData,
    });
  } catch (err) {
    next(err);
  }
};
const updateMode = async (req, res, next) => {
  const _id = req.user.userId;
  const { newValue } = req.body;
  const registerAddress = 17;

  try {
    const user = await User.findById(_id);
    if (!user.dryermasterId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User doesn't have a Dryer Master registered!",
      });
    }

    const dryermaster = await Dryermaster.findById(user.dryermasterId);
    const serialNumber = dryermaster.dmSerial;

    // Get live data from BeagleBone server
    const sensorData = await updateRegister(
      serialNumber,
      registerAddress,
      newValue
    );
    if (!sensorData.success) {
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        success: false,
        message: sensorData.status,
      });
    }
    // Respond with success
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Sensor data requested successfully.',
      result: sensorData,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  requestUpdateRegister,
  dischargeRateSetpoint,
  moistureSetpoint,
  updateMode,
};
