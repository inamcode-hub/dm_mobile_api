// samples/sample.js

const mongoose = require('mongoose');

const sampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  // Add more fields as needed
});

const Sample = mongoose.model('Sample', sampleSchema);

module.exports = Sample;
