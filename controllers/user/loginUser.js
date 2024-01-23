const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
const Dryermaster = require('../../models/Dryermaster');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const LoginUser = async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password is provided
  if (!email || !password)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Please provide email and password' });
  //  check if password is at least 8 characters
  if (password.length < 8)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Password must be at least 8 characters',
    });
  try {
    const user = await User.findOne({ email });
    // check if user exists
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Invalid credentials' });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    //  check if password is correct
    if (!isPasswordCorrect) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Invalid credentials' });
    }
    if (user.active === false) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'You are not authorized!' });
    }
    const dryermaster = await Dryermaster.findById(user.dryermasterId);
    if (!dryermaster) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Dryermaster not found',
      });
    }
    //  create token and send to client
    const token = await user.createJWT();
    const { role, firstName, lastName } = user;
    res.status(StatusCodes.OK).json({
      success: true,
      role,
      firstName,
      lastName,
      token,
      email,
      dmSerial: dryermaster.dmSerial,
      dmModel: dryermaster.dmModel,
      subscriptionExpiry: dryermaster.subscriptionExpiry,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  LoginUser,
};
