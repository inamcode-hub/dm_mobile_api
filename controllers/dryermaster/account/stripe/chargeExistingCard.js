// controllers/orderController.js

const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../../../models/User');
const Dryermaster = require('../../../../models/Dryermaster');

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

    const dryermaster = await Dryermaster.findById(user.dryermasterId);
    // check if dryerMaster is not expired
    if (dryermaster.subscriptionExpiry > new Date()) {
      return res.status(StatusCodes.OK).json({
        success: false,
        message: 'Your subscription is still active.',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: user.stripeCustomerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
      metadata: { dryerMasterUserId: _id },
      description: 'Dryer Master Payment',
      statement_descriptor: 'Dryer Master Payment',
      receipt_email: user.email,
    });
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
    next(err);
  }
};

module.exports = {
  chargeExistingCard,
};
