// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const { authenticateUser } = require('../middleware/auth/userAuth');
const { registerUser } = require('../controllers/user/registerUser');
const { LoginUser } = require('../controllers/user/loginUser');
const { forgotPassword } = require('../controllers/user/forgotPassword');
const {
  forgotPasswordUpdate,
} = require('../controllers/user/forgotPasswordUpdate');
const { subscriptionCheck } = require('../controllers/user/subscriptionCheck');
// const { authenticateAdmin } = require('../middleware/auth/adminAuth');

// ==========>>>>>> Create a user
router.post('/register', registerUser); // public route

// ==========>>>>>> Login a user
router.post('/login', LoginUser); // public route

// ==========>>>>>> Forgot Password
router.post('/forgot_password', forgotPassword); // public route

// ==========>>>>>> Forgot Password - Reset Password
router.put('/forgot_password_update', forgotPasswordUpdate); // public route

// ==========>>>>>> subscriptionCheck - with token in header - private route - user - check if user subscription is expired

router.get('/subscription_status', authenticateUser, subscriptionCheck); // private route - user
module.exports = router;
