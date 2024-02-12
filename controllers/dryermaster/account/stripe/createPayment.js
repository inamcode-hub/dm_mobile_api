// controllers/orderController.js

const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../../../models/User');
// Create operation
const createPayment = async (req, res, next) => {
  const { paymentMethodId } = req.body; // paymentMethodId is the id of the Stripe Payment Method
  const _id = req.user.userId;

  try {
    let user = await User.findOne({ _id });

    let customerId; // Declare variable to hold the Stripe customer ID

    if (!user.stripeCustomerId) {
      // If user does not have a Stripe customer ID, create a new Stripe customer
      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: user.email,
        name: user.firstName + ' ' + user.lastName,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Update the user in the database with the new Stripe customer ID
      const updatedUser = await User.findByIdAndUpdate(
        _id,
        { stripeCustomerId: customer.id },
        { new: true }
      ); // Use { new: true } to return the updated user object
      customerId = updatedUser.stripeCustomerId; // Use the updated Stripe customer ID for the payment intent
    } else {
      // If user already has a Stripe customer ID, use it for the payment intent
      customerId = user.stripeCustomerId;
    }

    // Now, create a Payment Intent with the correct Stripe customer ID
    const paymentIntent = await stripe.paymentIntents.create({
      payment_method_types: ['card'],
      amount: 10000, // amount in cents
      currency: 'usd',
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true, // Set to true if the customer is not present during payment
      confirm: true, // Automatically confirm the payment intent
      metadata: {
        dryerMasterUserId: _id,
      },
      description: 'Dryer Master Payment',
      statement_descriptor: 'Dryer Master Payment',
      receipt_email: user.email,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Payment successful. Your Subscription has been activated.',
      result: paymentIntent,
    });
  } catch (err) {
    console.error(err); // Log for server-side debugging
    if (err.type === 'StripeCardError') {
      // Handle common card errors
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: err.message, // e.g., "Your card has expired."
      });
    } else {
      // Handle other errors
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'An error occurred processing your payment. Please try again.',
      });
    }
  }
};

module.exports = {
  createPayment,
};
