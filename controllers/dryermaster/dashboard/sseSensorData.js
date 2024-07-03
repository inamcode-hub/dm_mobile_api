const { StatusCodes } = require('http-status-codes');
const jose = require('jose');
const User = require('../../../models/User');
const Dryermaster = require('../../../models/Dryermaster');
const {
  getSensorData,
} = require('../../../lib/beaglonebone_api_server/beagleboneApi');

const sseSensorData = async (req, res, next) => {
  const token = req.query.token;
  try {
    const { payload, protectedHeader } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const { userId, name, iss } = payload;
    req.user = { userId, name, role: iss };
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Not authorized to access this route!',
      result: error?.code,
    });
  }
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

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); // flush the headers to establish SSE connection

    const sendData = async () => {
      const sensorData = await getSensorData(serialNumber);
      if (!sensorData.success) {
        res.write(
          `event: error\ndata: ${JSON.stringify({
            message: sensorData.status,
          })}\n\n`
        );
      } else {
        res.write(`data: ${JSON.stringify(sensorData.data)}\n\n`);
      }
    };

    // Send data immediately
    await sendData();

    // Send data every 5 seconds
    const intervalId = setInterval(sendData, 5000);

    // Handle client disconnection
    req.on('close', () => {
      clearInterval(intervalId);
      res.end();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sseSensorData,
};
