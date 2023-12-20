const { StatusCodes } = require('http-status-codes');
const User = require('../../models/User');
var bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const jose = require('jose');

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  //  check if email is provided
  if (!email)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: 'Please provide email' });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'User not found with this email' });
    }
    const token = await user.createPasswordResetToken();
    await User.findOneAndUpdate({ email }, { recoveryToken: token });

    const link = `${process.env.HOST_URL}/forgot-password-update?email=${email}&token=${token}`;

    const msg = {
      to: email, // The recipient's email address
      from: process.env.SENDGRID_EMAIL_SENDER, // Your verified sender email address
      subject: 'Reset Your Password',
      text: `Hi there,\n\nWe received a request to reset your password for your account. If you did not request a password reset, please ignore this email.\n\nTo reset your password, please click the link below:\n${link}\n\nBest,\nThe DryerMaster Team`,
      html: `<p>Hi there,</p><p>We received a request to reset your password for your account. If you did not request a password reset, please ignore this email.</p><p>To reset your password, please click the link below:<br><a href="${link}">Reset Password</a></p><p>Best,<br>The DryerMaster Team</p>`,
    };

    try {
      await sgMail.send(msg);
      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Password reset email sent successfully',
        email,
      });
    } catch (error) {
      console.error(error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to send password reset email',
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  forgotPassword,
};
