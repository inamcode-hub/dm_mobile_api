// sellers/seller.js

const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    role: {
      type: String,
      enum: ['oem', 'dealer', 'integrator', 'direct'],
      default: 'oem',
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'Employee',
      required: [true, 'Please provide createdBy'],
    },
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;
