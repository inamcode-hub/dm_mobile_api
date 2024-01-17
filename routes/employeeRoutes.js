// routes/employeeRoutes.js

const express = require('express');
const router = express.Router();
const { registerAdmin } = require('../controllers/employee/registerAdmin');
const { login } = require('../controllers/employee/login');
const {
  registerEmployeeAsAdmin,
} = require('../controllers/employee/registerEmployeeAsAdmin');

const {
  authenticateEmployeeAdmin,
} = require('../middleware/auth/employeeAdminAuth');

// registerAdmin as employee
router.post('/register-admin', registerAdmin);

// login as employee
router.post('/login', login);

// register employee as admin
router.post(
  '/register-employee-as-admin',
  authenticateEmployeeAdmin,
  registerEmployeeAsAdmin
);

module.exports = router;
