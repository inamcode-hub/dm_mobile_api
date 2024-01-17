// routes/sellerRoutes.js

const express = require('express');
const router = express.Router();

const {
  registerSellerAsAdmin,
} = require('../controllers/seller/registerSellerAsAdmin');
const {
  authenticateEmployeeAdmin,
} = require('../middleware/auth/employeeAdminAuth');

router.post('/register', authenticateEmployeeAdmin, registerSellerAsAdmin);

module.exports = router;
