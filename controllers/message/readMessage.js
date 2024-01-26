const { StatusCodes } = require('http-status-codes');
const Message = require('../../models/Message');
const Employee = require('../../models/Employee');

const readMessage = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    let message = await Message.findOne({ _id: id }).select('-__v');
    if (!message) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Message not found',
      });
    }
    const employee = await Employee.findOne({ _id: message.createdBy });

    message = {
      ...message.toObject(),
      createdBy: undefined,
      author: `${employee?.firstName} ${employee?.lastName}`,
    };

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
