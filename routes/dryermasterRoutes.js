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
const {
  existingCharges,
} = require('../controllers/dryermaster/account/stripe/existingCharges');
const {
  requestSensorData,
} = require('../controllers/dryermaster/dashboard/requestSensorData');
const {
  sseSensorData,
} = require('../controllers/dryermaster/dashboard/sseSensorData');

const {
  requestUpdateRegister,
  moistureSetpoint,
  dischargeRateSetpoint,
  updateMode,
} = require('../controllers/dryermaster/dashboard/requestUpdateRegister');

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

// DryerMaster account stripe payment routes - User can view existing charges
router.get('/account/stripe/charges', authenticateUser, existingCharges);

//================== DryerMaster BEAGLE BONE SERVER API ================== // USER ROUTES

// DryerMaster BEAGLE BONE SERVER API - User can request sensor data
router.get('/dashboard/requestSensorData', authenticateUser, requestSensorData);
router.post(
  '/dashboard/update_register',
  authenticateUser,
  requestUpdateRegister
);

router.post(
  '/dashboard/moisture_set_point',
  authenticateUser,
  moistureSetpoint
);
router.post(
  '/dashboard/discharge_rate_set_point',
  authenticateUser,
  dischargeRateSetpoint
);
router.post('/dashboard/update_mode', authenticateUser, updateMode);

// DryerMaster BEAGLE BONE SERVER API - User can request sensor data via SSE
router.get('/dashboard/sseSensorData', authenticateUser, sseSensorData);

module.exports = router;
