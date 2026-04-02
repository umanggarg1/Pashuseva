// routes/authRoutes.js

const router = require('express').Router();
const {
  userSignup, userLogin, adminLogin, getMe,
  getAllUsers,
  getAllAdmins, createAdmin, updateAdmin, deleteAdmin,
} = require('../controllers/authController');
const { requireAuth, requireAdmin, requireSuperAdmin } = require('../middleware');

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/signup',      userSignup);    // POST  /api/auth/signup
router.post('/login',       userLogin);     // POST  /api/auth/login
router.post('/admin/login', adminLogin);    // POST  /api/auth/admin/login

// ── Any logged-in user ────────────────────────────────────────────────────────
router.get('/me',           requireAuth,       getMe);         // GET /api/auth/me

// ── Any admin ─────────────────────────────────────────────────────────────────
router.get('/users',        requireAdmin,      getAllUsers);   // GET /api/auth/users

// ── Super admin only — manage sub-admin accounts ─────────────────────────────
router.get(   '/admins',     requireSuperAdmin, getAllAdmins);  // GET    /api/auth/admins
router.post(  '/admins',     requireSuperAdmin, createAdmin);  // POST   /api/auth/admins
router.put(   '/admins/:id', requireSuperAdmin, updateAdmin);  // PUT    /api/auth/admins/:id
router.delete('/admins/:id', requireSuperAdmin, deleteAdmin);  // DELETE /api/auth/admins/:id

module.exports = router;
