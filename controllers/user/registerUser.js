const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
const Dryermaster = require('../../models/Dryermaster');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const nextBillingDate = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Set the billing period end date to July 1st of the next year
  const nextBillingDate = new Date(currentYear + 1, 6, 1); // Months are 0-indexed, so 6 is July

  return nextBillingDate;
};
// ==========>>>>>> Create operation - create a user
const registerUser = async (req, res, next) => {
  const { firstName, lastName, farmName, email, password, dryermasterId } =
    req.body;
  const subscriptionExpiry = nextBillingDate();
  if (
    !firstName ||
    !lastName ||
    !farmName ||
    !email ||
    !password ||
    !dryermasterId
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }

  try {
    const dryermaster = await Dryermaster.findById(dryermasterId);
    if (!dryermaster) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Dryermaster not found',
      });
    }

    const existingUser = await User.findOne({ dryermasterId });
    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'User already registered with this Dryermaster',
      });
    }
    const updatedDryermaster = await Dryermaster.findByIdAndUpdate(
      dryermasterId,
      {
        $set: {
          subscriptionExpiry,
        },
      },
      { new: true }
    );

    const user = await User.create({
      firstName,
      lastName,
      farmName,
      email,
      password,
      dryermasterId: dryermasterId,
    });
    const token = await user.createJWT();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully!',
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token,
      dmSerial: updatedDryermaster.dmSerial,
      subscriptionExpiry: updatedDryermaster.subscriptionExpiry,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
};
