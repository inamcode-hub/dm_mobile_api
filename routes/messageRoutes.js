// routes/messageRoutes.js

const express = require('express');
const router = express.Router();

const { createMessage } = require('../controllers/message/createMessage');
const {
  getAllMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
} = require('../controllers/message/messageController');
const {
  authenticateEmployeeAdmin,
} = require('../middleware/auth/employeeAdminAuth');

// Create a message
router.post('/', authenticateEmployeeAdmin, createMessage);

// Retrieve all messages
router.get('/', getAllMessages);

// Retrieve a message by ID
router.get('/:id', getMessageById);

// Update a message by ID
router.put('/:id', updateMessageById);

// Delete a message by ID
router.delete('/:id', deleteMessageById);

module.exports = router;
