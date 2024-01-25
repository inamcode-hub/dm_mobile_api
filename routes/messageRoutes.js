// routes/messageRoutes.js

const express = require('express');
const router = express.Router();

const { createMessage } = require('../controllers/message/createMessage');

const {
  authenticateEmployeeAdmin,
} = require('../middleware/auth/employeeAdminAuth');
const { userMessages } = require('../controllers/message/userMessages');
const { authenticateUser } = require('../middleware/auth/userAuth');
const { readMessage } = require('../controllers/message/readMessage');

// Create a message (admin only)
router.post('/', authenticateEmployeeAdmin, createMessage);

// Get all messages (user only)
router.get('/user', authenticateUser, userMessages);

// Read a message (user only)
router.get('/user/:id', authenticateUser, readMessage);

module.exports = router;
