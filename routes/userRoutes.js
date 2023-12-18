// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const {
  createUser,
  LoginUser,
  forgotPassword,
  updateForgotPassword,
  isUserExpired,
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth/userAuth');
// const { authenticateAdmin } = require('../middleware/auth/adminAuth');

// ==========>>>>>> Create a user
router.post('/register', createUser); // public route

// ==========>>>>>> Login a user
router.post('/login', LoginUser); // public route

// ==========>>>>>> Forgot Password
router.post('/forgot_password', forgotPassword); // public route

// ==========>>>>>> Forgot Password - Reset Password
router.put('/forgot_password_update', updateForgotPassword); // public route

// ==========>>>>>> Is User Expired - Check if user is expired
router.get('/subscription_status', authenticateUser, isUserExpired); // private route - user
module.exports = router;
