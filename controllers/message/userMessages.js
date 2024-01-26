const { StatusCodes } = require('http-status-codes');
const Message = require('../../models/Message');
const Employee = require('../../models/Employee');

const userMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const messagesPerPage = parseInt(req.query.limit) || 10;
    const userId = req.user.userId; // Get the user's ID

    const totalMessages = await Message.countDocuments();

    let messages = await Message.find()
      .select('-content -__v -updatedAt')
      .sort({ createdAt: -1 })
      .skip((page - 1) * messagesPerPage)
      .limit(messagesPerPage);

    // Function to return the employee name
    const getEmployeeName = async (employeeId) => {
      const employee = await Employee.findById(employeeId);
      return employee.firstName + ' ' + employee.lastName;
    };

    // Fetch and add sender name to each message
    const result = await Promise.all(
      messages.map(async (message) => {
        const author = await getEmployeeName(message.createdBy);
        return {
          ...message.toObject(), // Convert document to plain JavaScript object
          readMessage: message.readBy.includes(userId),
          author, // Add resolved sender name
          readBy: undefined, // Remove readBy property from the response
          createdBy: undefined, // Remove createdBy property from the response
        };
      })
    );
    //readBy property removed from the response

    const totalPages = Math.ceil(totalMessages / messagesPerPage);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Messages retrieved successfully',
      totalMessages,
      totalPages,
      messagesPerPage,
      result,
    });
  } catch (err) {
    next(err);
  }
};

exports.userMessages = userMessages;
