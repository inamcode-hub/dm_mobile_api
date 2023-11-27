// controllers/orderController.js

const { StatusCodes } = require('http-status-codes');
const Sample = require('../models/Sample');

// Create operation
const createSample = async (req, res, next) => {
  try {
    const { name } = req.body;
    const order = await Sample.create({ name });
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Sample created successfully',
      result: order,
    });
  } catch (err) {
    next(err);
  }
};

// Read operation: Get all orders
const getAllSamples = async (req, res, next) => {
  try {
    const orders = await Sample.find();
    const count = await Sample.countDocuments();
    res
      .status(200)
      .json({ success: true, message: 'All orders', count, result: orders });
  } catch (err) {
    next(err);
  }
};

// Read operation: Get a order by ID
const getSampleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Sample.findById(id);
    if (!order) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Sample not found', result: order });
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Single Sample by id', result: order });
  } catch (err) {
    next(err);
  }
};

// Update operation: Update a order by ID
const updateSampleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Please provide name' });
      return;
    }
    const order = await Sample.findByIdAndUpdate(id, { name }, { new: true });
    if (!order) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Sample not found', result: order });
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
const deleteSampleById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Sample.findByIdAndDelete(id);
    if (!order) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: 'Sample not found', result: order });
    }
    res
      .status(StatusCodes.OK)
      .json({ success: true, message: 'Deleted!', result: order });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createSample,
  getAllSamples,
  getSampleById,
  updateSampleById,
  deleteSampleById,
};
