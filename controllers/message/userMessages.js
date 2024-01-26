const { StatusCodes } = require('http-status-codes');
const Message = require('../../models/Message');

const userMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const messagesPerPage = parseInt(req.query.limit) || 10;
    const userId = req.user.userId; // Get the user's ID
    const createdAt = req.user.createdAt; // Get the createdAt query parameter

    const totalMessages = await Message.countDocuments({
      createdAt: { $gte: createdAt },
    });

    let messages = await Message.find({ createdAt: { $gte: createdAt } })
      .select('-content -__v -updatedAt -createdBy')
      .sort({ createdAt: -1 })
      .skip((page - 1) * messagesPerPage)
      .limit(messagesPerPage);
    // Add readMessage property to each message
    messages = messages.map((message) => ({
      ...message.toObject(), // Convert document to plain JavaScript object
      readMessage: message.readBy.includes(userId),
      readBy: undefined, // Remove readBy property from the response
    }));

    //readBy property removed from the response

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
