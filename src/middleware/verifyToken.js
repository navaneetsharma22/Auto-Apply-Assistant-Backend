const jwt = require('jsonwebtoken');
const env = require('../config/env');

const verifyTokenMiddleware = (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No authentication token provided.' });
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

module.exports = verifyTokenMiddleware;
