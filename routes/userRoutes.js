// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const {
  createUser,
  LoginUser,
  forgotPassword,
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth/userAuth');
// const { authenticateAdmin } = require('../middleware/auth/adminAuth');

// ==========>>>>>> Create a user
router.post('/register', createUser); // public route

// ==========>>>>>> Login a user
router.post('/login', LoginUser); // public route

// ==========>>>>>> Forgot Password
router.post('/forgot_password', forgotPassword); // public route

module.exports = router;
