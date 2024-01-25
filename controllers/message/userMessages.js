const { StatusCodes } = require('http-status-codes');
const Message = require('../../models/Message');

// Create operation
const userMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters
    const messagesPerPage = parseInt(req.query.limit) || 10;

    // Count total messages
    const totalMessages = await Message.countDocuments();

    const messages = await Message.find()
      .select('-createdBy -title -__v -updatedAt -readBy')
      .sort({ createdAt: -1 }) // Sort messages by createdAt in descending order (most recent first)
      .skip((page - 1) * messagesPerPage) // Skip the previous pages
      .limit(messagesPerPage); // Limit the number of messages per page
    const totalPages = Math.ceil(totalMessages / messagesPerPage);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Messages retrieved successfully',
      totalMessages,
      totalPages,
      messagesPerPage,
      result: messages,
    });
  } catch (err) {
    next(err);
  }
};

exports.userMessages = userMessages;
