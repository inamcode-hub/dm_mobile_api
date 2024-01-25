const { StatusCodes } = require('http-status-codes');
const Message = require('../../models/Message');

const readMessage = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    const message = await Message.findOne({ _id: id }).select(
      '-__v -createdBy'
    );
    if (!message) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Message not found',
      });
    }

    const alreadyRead = message.readBy.includes(userId);

    if (!alreadyRead) {
      await Message.updateOne({ _id: id }, { $push: { readBy: userId } });
    }
    //remove readBy from response
    message.readBy = undefined;
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Message found',
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

exports.readMessage = readMessage;
