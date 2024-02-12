// controllers/orderController.js

const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../../../models/User');
// Create operation
const chargeExistingCard = async (req, res, next) => {
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      metadata: { dryerMasterUserId: _id },
      description: 'Dryer Master Payment',
      statement_descriptor: 'Dryer Master Payment',
      receipt_email: user.email,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Charge successful',
      data: paymentIntent,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  chargeExistingCard,
};
