const { StatusCodes } = require('http-status-codes');
const Message = require('../../models/Message');

// Create operation
const createMessage = async (req, res, next) => {
  try {
    const { name } = req.body;
    const order = await Message.create({ name });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Message created successfully',
      result: order,
    });
  } catch (err) {
    next(err);
  }
};

exports.createMessage = createMessage;
