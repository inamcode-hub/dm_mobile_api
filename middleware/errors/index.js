const { mongooseErrorHandler } = require('./mongooseErrorHandler');
const { notFoundErrorHandler } = require('./notFoundErrorHandler');

module.exports = { mongooseErrorHandler, notFoundErrorHandler };
