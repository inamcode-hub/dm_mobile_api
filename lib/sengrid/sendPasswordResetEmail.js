const sgMail = require('@sendgrid/mail');

// Set your SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send email with password reset token
const sendPasswordResetEmail = async (email, resetToken) => {
  //  Set your email template here with reset token
  const html = `
    <p>Click the button below to reset your password:</p>
    <p>
      <a href="${process.env.PUBLIC_WEBSITE_URL}/recoverpassword?token=${resetToken}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
    </p>
  `;

  const msg = {
    to: email,
    from: 'no-replay@inamwebsolutions.com', // Set your email address here
    subject: 'Password Reset',
    html: html,
  };

  try {
    await sgMail.send(msg);
    // console.log('Password reset email sent successfully')
    return true;
  } catch (error) {
    // console.error('Error sending password reset email:', error)
    return false;
  }
};

module.exports = {
  sendPasswordResetEmail,
};
