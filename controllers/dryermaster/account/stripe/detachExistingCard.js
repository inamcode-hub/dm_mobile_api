// controllers/orderController.js

const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../../../models/User');
// Create operation
const detachExistingCard = async (req, res, next) => {
  const _id = req.user.userId;
  const { paymentMethodId } = req.body;
  const amount = 10000; // Amount in cents

  try {
    const user = await User.findById(_id);
    if (!user.stripeCustomerId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User doesn't have a Stripe customer ID.",
      });
    }

    const detachedPaymentMethod = await stripe.paymentMethods.detach(
      paymentMethodId
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Payment method detached successfully.',
      data: detachedPaymentMethod,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  detachExistingCard,
};
