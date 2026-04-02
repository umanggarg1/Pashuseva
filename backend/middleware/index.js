// middleware/index.js

const multer = require('multer');
const path   = require('path');
const fs     = require('fs');
const jwt    = require('jsonwebtoken');
const config = require('../config');

// ── 1. Request Logger ─────────────────────────────────────────────────────────
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms     = Date.now() - start;
    const status = res.statusCode;
    const color  = status >= 500 ? '\x1b[31m' : status >= 400 ? '\x1b[33m' : status >= 300 ? '\x1b[36m' : '\x1b[32m';
    const reset  = '\x1b[0m';
    console.log(`${color}[${req.method.padEnd(7)}]${reset} ${req.originalUrl.padEnd(40)} ${color}${status}${reset}  ${ms}ms`);
  });
  next();
};

// ── Helper: extract & verify JWT ──────────────────────────────────────────────
function verifyToken(req) {
  const authHeader = req.headers['authorization'] || '';
  const token      = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  try { return jwt.verify(token, config.JWT_SECRET); }
  catch { return null; }
}

// ── 2. requireAuth — any logged-in user OR admin ──────────────────────────────
const requireAuth = (req, res, next) => {
  const decoded = verifyToken(req);
  if (!decoded) return res.status(401).json({ message: 'Authentication required.' });
  req.user = decoded;
  next();
};

// ── 3. requireAdmin — any admin (super or sub) ────────────────────────────────
const requireAdmin = (req, res, next) => {
  const decoded = verifyToken(req);
  if (!decoded)                  return res.status(401).json({ message: 'Authentication required.' });
  if (decoded.role !== 'admin')  return res.status(403).json({ message: 'Admin access required.' });
  req.user = decoded;
  next();
};

// ── 4. requireSuperAdmin — root super admin ONLY ──────────────────────────────
//    Only the account whose username matches config.ADMIN_USERNAME gets through.
const requireSuperAdmin = (req, res, next) => {
  const decoded = verifyToken(req);
  if (!decoded)                   return res.status(401).json({ message: 'Authentication required.' });
  if (decoded.role !== 'admin')   return res.status(403).json({ message: 'Admin access required.' });
  if (!decoded.isSuperAdmin)      return res.status(403).json({ message: 'Super admin access required. Only the root admin can manage admin accounts.' });
  req.user = decoded;
  next();
};

// ── 5. Multer — Image Upload ──────────────────────────────────────────────────
if (!fs.existsSync(config.UPLOAD_DIR)) fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.UPLOAD_DIR),
  filename:    (_req, file,  cb) => {
    const ext      = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext).replace(/[^a-z0-9]/gi, '_').toLowerCase();
    cb(null, `${Date.now()}_${basename}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  config.ALLOWED_IMAGE_TYPES.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error(`Invalid file type. Allowed: ${config.ALLOWED_IMAGE_TYPES.join(', ')}`), false);
};

const upload = multer({ storage, limits: { fileSize: config.MAX_FILE_SIZE }, fileFilter });

// ── 6. Not Found ──────────────────────────────────────────────────────────────
const notFound = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

// ── 7. Global Error Handler ───────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.error('\x1b[31m[ERROR]\x1b[0m', err.message);
  if (err.code === 'LIMIT_FILE_SIZE')
    return res.status(400).json({ message: `File too large. Max ${config.MAX_FILE_SIZE / 1024 / 1024}MB.` });
  if (err instanceof multer.MulterError)
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
};

module.exports = { requestLogger, requireAuth, requireAdmin, requireSuperAdmin, upload, notFound, errorHandler };
