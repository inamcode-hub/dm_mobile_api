const xss = require('xss');

// Custom middleware to sanitize user input
function sanitizeInput(req, res, next) {
  // Check if there is any user input to sanitize
  if (req.body) {
    // Iterate through the request body and sanitize each value
    Object.keys(req.body).forEach((key) => {
      const value = req.body[key];
      req.body[key] = xss(value);
    });
  }

  next();
}

module.exports = sanitizeInput;
