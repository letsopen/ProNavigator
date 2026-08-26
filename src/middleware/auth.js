const jwt = require('jsonwebtoken');
const config = require('../config');
const { sendError } = require('../utils/response');
const logger = require('../utils/logger');

function extractToken(req) {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    return authHeader.split(' ')[1];
  }
  return req.cookies && req.cookies.nav_token ? req.cookies.nav_token : null;
}

function authenticateToken(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return sendError(res, '未提供认证令牌', 1005, 401);
  }

  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) {
      logger.warn('JWT verification failed: %s', err.message);
      return sendError(res, '认证令牌无效或已过期', 1006, 401);
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
  authenticateToken,
};
