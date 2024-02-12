// controllers/orderController.js

const { StatusCodes } = require('http-status-codes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../../../../models/User');
// Create operation
const chargeExistingCard = async (req, res, next) => {
  const _id = req.user.userId;

  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'User payment methods retrieved successfully',
      data: ' ',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chargeExistingCard,
};
