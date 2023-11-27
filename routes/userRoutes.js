// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const { createUser, LoginUser } = require('../controllers/userController');
const { authenticateUser } = require('../middleware/auth/userAuth');
// const { authenticateAdmin } = require('../middleware/auth/adminAuth');

// ==========>>>>>> Create a user
router.post('/register', createUser); // public route
router.post('/login', LoginUser); // public route
router.get('/profile', authenticateUser, (req, res) => {
  res.send('Profile');
}); // private route

module.exports = router;
