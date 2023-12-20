const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const nextBillingDate = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // Set the billing period end date to July 1st of the next year
  const nextBillingDate = new Date(currentYear + 1, 6, 1); // Months are 0-indexed, so 6 is July

  return nextBillingDate;
};
// ==========>>>>>> Create operation - create a user
const registerUser = async (req, res, next) => {
  try {
    const subscriptionExpiry = nextBillingDate();
    const { firstName, lastName, email, password, dmSerial } = req.body;
    const isFirstAccount = await User.countDocuments({});
    const role = isFirstAccount === 0 ? 'admin' : 'user';
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role,
      dmSerial,
      subscriptionExpiry,
    });
    const token = await user.createJWT();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User created successfully!',
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      token,
      email: user.email,
      dmSerial: user.dmSerial,
      subscriptionExpiry: user.subscriptionExpiry,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerUser,
};
