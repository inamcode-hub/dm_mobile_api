// routes/dryermasterRoutes.js

const express = require('express');
const router = express.Router();

const { register } = require('../controllers/dryermaster/register');

const { authenticateEmployee } = require('../middleware/auth/employeeAuth');
const { authenticateUser } = require('../middleware/auth/userAuth');
const {
  createPayment,
} = require('../controllers/dryermaster/account/stripe/createPayment');
// register dryermaster
router.post('/register', authenticateEmployee, register);

// DryerMaster account stripe payment routes - User can create a payment
router.post('/account/stripe', authenticateUser, createPayment);

module.exports = router;
