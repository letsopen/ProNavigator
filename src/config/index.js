const path = require('path');
require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  dbPath: process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'nav.db'),
  uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '..', '..', 'public', 'uploads'),
  jwtSecret: process.env.JWT_SECRET || 'please-change-this-default-secret-in-production',

  logLevel: process.env.LOG_LEVEL || 'info',
  nodeEnv: process.env.NODE_ENV || 'development',

};

module.exports = config;
