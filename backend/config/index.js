// config/index.js
require('dotenv').config();

const config = {
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // Render requires 0.0.0.0 — locally defaults to localhost
  HOST: process.env.HOST || 'localhost',

  // Comma-separated origins e.g. "https://pashuseva.vercel.app"
  // Use "*" for local dev only
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',

  UPLOAD_DIR:          './uploads',
  MAX_FILE_SIZE:        5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'admin',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'pashuseva123',
  ADMIN_TOKEN:    process.env.ADMIN_TOKEN    || 'pashuseva-admin-token-2024',

  JWT_SECRET:     process.env.JWT_SECRET     || 'pashuseva_super_secret_jwt_key_2024',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',

  // Returns the public-facing server URL for building image URLs.
  // Render automatically sets RENDER_EXTERNAL_URL — we use that first.
  getServerUrl() {
    if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL;
    if (process.env.NODE_ENV === 'production') return `https://${this.HOST}`;
    return `http://localhost:${this.PORT}`;
  },
};

module.exports = config;
