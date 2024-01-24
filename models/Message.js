// messages/message.js

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  // Add more fields as needed
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
