const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        'promotion',
        'information',
        'warning',
        'alert',
        'reminder',
        'news and announcement',
        'other',
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },

    // Add readBy field to track which users have read the message
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
