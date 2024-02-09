// controllers/orderController.js

const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../../../models/User');
// Create operation
const createPayment = async (req, res, next) => {
  const { paymentMethodId } = req.body; // paymentMethodId is the id of the Stripe Payment Method
  const _id = req.user.userId;
  console.log('paymentMethodId', paymentMethodId);
  try {
    let user = await User.findOne({ _id });

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: user.email,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create a Payment Intent instead of a direct charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000, // amount in cents
      currency: 'usd',
      customer: user.stripeCustomerId,
      payment_method: paymentMethodId,
      off_session: true, // Set to true if the customer is not present during payment
      confirm: true, // Automatically confirm the payment intent
      description: 'My First Test Charge (created for API docs)',
    });

    console.log('user', user);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Payment created successfully',
      result: paymentIntent,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createPayment,
};
