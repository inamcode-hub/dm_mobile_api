// controllers/orderController.js

const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../../../models/User');
const existingCharges = async (req, res, next) => {
  const _id = req.user.userId;
  // Get page and size from query parameters or use defaults

  const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
  const startingAfter = req.query.starting_after; // Optional: for cursor-based pagination
  try {
    const user = await User.findById(_id);
    const params = {
      customer: user.stripeCustomerId,
      limit: limit,
    };
    if (!user.stripeCustomerId) {
      return res.status(StatusCodes.OK).json({
        success: false,
        message: 'User has no stripeCustomerId',
        data: [],
        hasMore: false,
      });
    }
    // If there's a starting_after id, use it for pagination
    if (startingAfter) {
      params.starting_after = startingAfter;
    }

    // Retrieve the customer's charges (transactions) with pagination
    const charges = await stripe.charges.list(params);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User charges retrieved successfully',
      data: charges.data,
      limit: limit,
      hasMore: charges.has_more,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  existingCharges, // Update the exported function name accordingly
};
