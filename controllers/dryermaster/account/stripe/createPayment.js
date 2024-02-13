// Import necessary modules and initialize Stripe
const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../../../models/User');
const Dryermaster = require('../../../../models/Dryermaster');

// Helper function to retrieve existing payment methods for a customer
const retrieveCustomerPaymentMethods = async (customerId) => {
  return await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });
};

// Main function to create a payment
const createPayment = async (req, res, next) => {
  const { paymentMethodId } = req.body;
  const _id = req.user.userId;
  let amount = 10000; // Amount in cents

  try {
    // Retrieve user and check for existing Stripe customer ID
    let user = await User.findOne({ _id });
    let customerId = user.stripeCustomerId;

    const dryermaster = await Dryermaster.findById(user.dryermasterId);
    // check if dryerMaster is not expired
    if (dryermaster.subscriptionExpiry > new Date()) {
      return res.status(StatusCodes.OK).json({
        success: false,
        message: 'Your subscription is still active.',
      });
    }
    // Create a new Stripe customer if necessary
    if (!customerId) {
      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        invoice_settings: { default_payment_method: paymentMethodId },
        metadata: { dryerMasterUserId: _id },
      });
      // Update user with new Stripe customer ID
      await User.findByIdAndUpdate(
        _id,
        { stripeCustomerId: customer.id },
        { new: true }
      );
      customerId = customer.id;
    }

    // Check if the payment method already exists for the customer
    const existingPaymentMethods = await retrieveCustomerPaymentMethods(
      customerId
    );
    const newPaymentMethod = await stripe.paymentMethods.retrieve(
      paymentMethodId
    );

    const cardExists = existingPaymentMethods.data.some(
      (pm) =>
        pm.card.last4 === newPaymentMethod.card.last4 &&
        pm.card.exp_month === newPaymentMethod.card.exp_month &&
        pm.card.exp_year === newPaymentMethod.card.exp_year
    );

    if (!cardExists) {
      // Attach the new payment method to the customer if it doesn't exist
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });
    }

    // Create a Payment Intent with the customer ID and payment method
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

    if (paymentIntent.status !== 'succeeded') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Payment failed. Please try again.',
      });
    }

    // Update the user's subscription expiry date

    const expiry = dryermaster.subscriptionExpiry;
    const currentYear = new Date().getFullYear();
    // Convert `expiry` to a Date object to work with
    let currentSubscriptionExpiry = new Date(expiry);
    // Set the year to the current year
    currentSubscriptionExpiry.setFullYear(currentYear);
    // If the calculated expiry is in the past (meaning the current date is past the expiry date in the current year),
    // add one more year to ensure the subscription is extended properly from today's date
    if (currentSubscriptionExpiry < new Date()) {
      currentSubscriptionExpiry.setFullYear(currentYear + 1);
    }

    const updatedUser = await Dryermaster.findByIdAndUpdate(
      user.dryermasterId,
      { subscriptionExpiry: currentSubscriptionExpiry },
      { new: true }
    );

    // Respond with success
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Payment successful. Your Subscription has been activated.',
      result: {
        subscriptionExpiry: updatedUser.subscriptionExpiry,
        paymentIntent_status: paymentIntent.status,
      },
    });
  } catch (err) {
    // Handle errors appropriately
    if (err.type === 'StripeCardError') {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: err.message });
    } else {
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
