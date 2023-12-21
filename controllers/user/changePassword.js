const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ==========>>>>>> Create operation - create a user
const changePassword = async (req, res, next) => {
  const { userId } = req.user;
  const { password } = req.body;
  if (!password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Password is required',
    });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await User.findByIdAndUpdate(
      userId,
      {
        password: hashedPassword,
      },
      { new: true }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Password changed successfully',
      result,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  changePassword,
};
