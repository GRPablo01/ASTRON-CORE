const { randomUUID } = require('node:crypto');

function requestContext(req, res, next) {
  req.requestId = randomUUID();
  req.timestamp = new Date().toISOString();

  res.setHeader('X-Request-Id', req.requestId);
  next();
}

module.exports = requestContext;
