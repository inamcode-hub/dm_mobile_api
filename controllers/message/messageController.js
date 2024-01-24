// controllers/orderController.js

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

// Read operation: Get all orders
const getAllMessages = async (req, res, next) => {
  try {
    const orders = await Message.find();
    const count = await Message.countDocuments();
    res
      .status(200)
      .json({ success: true, message: 'All orders', count, result: orders });
  } catch (err) {
    next(err);
  }
};

// Read operation: Get a order by ID
const getMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Message.findById(id);
    if (!order) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Message not found', result: order });
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Single Message by id', result: order });
  } catch (err) {
    next(err);
  }
};

// Update operation: Update a order by ID
const updateMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Please provide name' });
      return;
    }
    const order = await Message.findByIdAndUpdate(id, { name }, { new: true });
    if (!order) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Message not found', result: order });
      return;
    }
    res
      .status(StatusCodes.ACCEPTED)
      .json({ success: true, message: 'Updated!', result: order });
  } catch (err) {
    next(err);
  }
};

// Delete operation: Delete a order by ID
const deleteMessageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Message.findByIdAndDelete(id);
    if (!order) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Message not found', result: order });
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Deleted!', result: order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
};
