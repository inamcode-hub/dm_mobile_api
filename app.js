const express = require('express');
const connectDB = require('./db/connect');
require('dotenv').config();
const sanitizeInput = require('./middleware/xss');
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const morgan = require('morgan');
const sampleRoutes = require('./routes/sampleRoutes');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const dryermasterRoutes = require('./routes/dryermasterRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const messageRoutes = require('./routes/messageRoutes');
const {
  mongooseErrorHandler,
  notFoundErrorHandler,
} = require('./middleware/errors');

// =================== Setup start here ===================
const app = express();
app.use(express.json());

// =================== Middleware ===================
app.use(sanitizeInput);
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // limit each IP to 1000 requests per windowMs
  })
);
app.use(helmet());
app.use(cors());
// morgan.token('client-ip', (req) => req.ip);
// app.use(morgan(':client-ip :method :url :response-time ms'));
app.use(express.static('public'));

// =================== Routes ===================

app.get('/', (req, res) => {
  res.send(`<h1>API is running...</h1>`);
});

// =================== Multiple Action Api Routes ===================
app.use('/api/v1/samples', sampleRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/dryermaster', dryermasterRoutes);
app.use('/api/v1/seller', sellerRoutes);
app.use('/api/v1/message', messageRoutes);

//  =================== Single Action Routes ===================

// =================== Error Handlers ===================
app.use(mongooseErrorHandler);
app.use(notFoundErrorHandler);

// =================== Server and Database ===================
const port = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDB(); // Connect to the database
    const server = app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
    return server;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
  }
};

startServer();

module.exports = {
  app,
  startServer,
};
