const { StatusCodes } = require('http-status-codes');
const Message = require('../../models/Message');

// Create operation
const userMessages = async (req, res, next) => {
  try {
    const messages = await Message.find() // remove createdBy and _id
      .select('-createdBy -_id');

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Messages retrieved successfully',
      result: messages,
    });
  } catch (err) {
    next(err);
  }
};

exports.userMessages = userMessages;
