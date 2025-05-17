// config/config.js
require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  dataDir: process.env.DATA_DIR || './data',
  jwtSecret: process.env.JWT_SECRET || 'default-jwt-secret',
  apiKey: process.env.API_KEY || 'default-api-key',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024), // 10MB default
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000']
};
