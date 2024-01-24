const { StatusCodes } = require('http-status-codes');
const Message = require('../../models/Message');

// Create operation
const createMessage = async (req, res, next) => {
  const { type, title, content } = req.body;
  const createdBy = req.user.userId;
  if (!title || !content || !type) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Please provide all required fields',
    });
  }
  try {
    const { name } = req.body;
    const message = await Message.create({ createdBy, title, content, type });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Message created successfully',
      result: message,
    });
  } catch (err) {
    next(err);
  }
};

exports.createMessage = createMessage;
