// routes/dryermasterRoutes.js

const express = require('express');
const router = express.Router();

const { register } = require('../controllers/dryermaster/register');

const { authenticateEmployee } = require('../middleware/auth/employeeAuth');
// register dryermaster
router.post('/register', authenticateEmployee, register);

module.exports = router;
