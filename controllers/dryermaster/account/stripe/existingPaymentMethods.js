// controllers/orderController.js

const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../../../models/User');
// Create operation
const existingPaymentMethods = async (req, res, next) => {
  const _id = req.user.userId;

  try {
    const user = await User.findById(_id);
    const customer = await stripe.paymentMethods.list({
      customer: user.stripeCustomerId,
      type: 'card', // Specify the type of payment methods to retrieve, e.g., 'card'
    });
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User payment methods retrieved successfully',
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  existingPaymentMethods,
};
