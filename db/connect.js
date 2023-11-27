const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};

module.exports = connectDB;
