// routes/dryermasterRoutes.js

const express = require('express');
const router = express.Router();

const { register } = require('../controllers/dryermaster/register');

const { authenticateEmployee } = require('../middleware/auth/employeeAuth');
const { authenticateUser } = require('../middleware/auth/userAuth');
const {
  createPayment,
} = require('../controllers/dryermaster/account/stripe/createPayment');
const {
  existingPaymentMethods,
} = require('../controllers/dryermaster/account/stripe/existingPaymentMethods');
const {
  chargeExistingCard,
} = require('../controllers/dryermaster/account/stripe/chargeExistingCard');
const {
  detachExistingCard,
} = require('../controllers/dryermaster/account/stripe/detachExistingCard');
// register dryermaster
router.post('/register', authenticateEmployee, register);

//================== DryerMaster account stripe payment routes ================== // USER ROUTES

// DryerMaster account stripe payment routes - User can create a payment
router.post('/account/stripe', authenticateUser, createPayment);

// DryerMaster account stripe payment routes - User can view existing payment methods
router.get('/account/stripe', authenticateUser, existingPaymentMethods);

// DryerMaster account stripe payment routes - User can charge an existing card
router.post('/account/stripe/charge', authenticateUser, chargeExistingCard);

// DryerMaster account stripe payment routes - User can detach an existing card
router.post('/account/stripe/detach', authenticateUser, detachExistingCard);
module.exports = router;
