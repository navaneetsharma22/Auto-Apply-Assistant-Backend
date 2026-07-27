const dotenv = require('dotenv');

dotenv.config();

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'ENCRYPTION_KEY'];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`[WARNING] Missing recommended environment variable: ${key}`);
  }
});

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/auto_apply_assistant',
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_change_me',
  encryptionKey: process.env.ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
};
