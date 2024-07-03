const { StatusCodes } = require('http-status-codes');
const User = require('../../../models/User');
const Dryermaster = require('../../../models/Dryermaster');
const {
  getSensorData,
} = require('../../../lib/beaglonebone_api_server/beagleboneApi');

const requestSensorData = async (req, res, next) => {
  const _id = req.user.userId;

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
    const sensorData = await getSensorData(serialNumber);
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

module.exports = {
  requestSensorData,
};
