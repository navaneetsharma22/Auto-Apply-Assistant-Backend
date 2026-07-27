const crypto = require('crypto');
const env = require('../config/env');

const ALGORITHM = 'aes-256-cbc';
// Ensure 32-byte key derived from encryptionKey setting
const KEY = crypto.createHash('sha256').update(String(env.encryptionKey)).digest();

const encrypt = (text) => {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  let encrypted = cipher.update(typeof text === 'string' ? text : JSON.stringify(text), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
};

const decrypt = (encryptedText) => {
  if (!encryptedText) return null;
  const parts = encryptedText.split(':');
  if (parts.length !== 2) return null;
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  try {
    return JSON.parse(decrypted);
  } catch (e) {
    return decrypted;
  }
};

module.exports = {
  encrypt,
  decrypt,
};
