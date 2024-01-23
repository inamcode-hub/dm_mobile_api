const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');
const Dryermaster = require('../../models/Dryermaster');

const forgotPasswordUpdate = async (req, res, next) => {
  const { email, token, password } = req.body;

  //  check if email and password is provided

  if (!email || !token || !password)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please provide email, token and password',
    });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'User not found with this email' });
    }

    if (token !== user.recoveryToken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Invalid token' });
    }

    try {
      await jose.jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
    } catch (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Token has expired',
        result: error,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const dryermaster = await Dryermaster.findById(user.dryermasterId);
    if (!dryermaster) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Dryermaster not found',
      });
    }
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, recoveryToken: '' }
    );
    const userToken = await user.createJWT();
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password updated successfully',
      token: userToken,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      email: user.email,
      dmSerial: dryermaster.dmSerial,
      dmModel: dryermaster.dmModel,
      subscriptionExpiry: dryermaster.subscriptionExpiry,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  forgotPasswordUpdate,
};
