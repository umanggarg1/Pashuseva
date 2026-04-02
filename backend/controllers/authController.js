// controllers/authController.js

const bcrypt       = require('bcryptjs');
const jwt          = require('jsonwebtoken');
const config       = require('../config');
const User         = require('../models/User');
const AdminAccount = require('../models/AdminAccount');

// ── Helpers ───────────────────────────────────────────────────────────────────

function generateToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── User Signup ───────────────────────────────────────────────────────────────
// POST /api/auth/signup
const userSignup = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'name, email, and password are required.' });
    if (!isValidEmail(email))
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (confirmPassword && password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match.' });
    if (User.emailExists(email))
      return res.status(409).json({ message: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = User.create({ name, email, phone, password: hashed });
    const token  = generateToken({ id: user.id, role: 'user', email: user.email });

    res.status(201).json({ message: 'Account created! Welcome to PashuSeva.', token, user });
  } catch {
    res.status(500).json({ message: 'Signup failed. Please try again.' });
  }
};

// ── User Login ────────────────────────────────────────────────────────────────
// POST /api/auth/login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'email and password are required.' });

    const user = User.findByEmail(email);
    if (!user)        return res.status(401).json({ message: 'No account found with this email.' });
    if (!user.active) return res.status(403).json({ message: 'Your account has been deactivated.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Incorrect password.' });

    const token = generateToken({ id: user.id, role: 'user', email: user.email });
    res.json({ message: `Welcome back, ${user.name}!`, token, user: User.sanitize(user) });
  } catch {
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

// ── Admin Login ───────────────────────────────────────────────────────────────
// POST /api/auth/admin/login
// Works for BOTH the root super-admin (from .env) AND sub-admins stored in db.
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ message: 'username and password are required.' });

    // 1. Check root super-admin first
    if (
      username.toLowerCase() === config.ADMIN_USERNAME.toLowerCase() &&
      password === config.ADMIN_PASSWORD
    ) {
      const token = generateToken({ role: 'admin', username: config.ADMIN_USERNAME, isSuperAdmin: true });
      return res.json({
        message: 'Admin login successful.',
        token,
        user: { id: 0, name: 'Super Administrator', username: config.ADMIN_USERNAME, role: 'admin', isSuperAdmin: true },
      });
    }

    // 2. Check sub-admin accounts created via dashboard
    const subAdmin = AdminAccount.findByUsername(username);
    if (!subAdmin) return res.status(401).json({ message: 'Invalid admin credentials.' });

    const ok = await bcrypt.compare(password, subAdmin.password);
    if (!ok) return res.status(401).json({ message: 'Invalid admin credentials.' });

    const token = generateToken({ role: 'admin', adminId: subAdmin.id, username: subAdmin.username, isSuperAdmin: false });
    res.json({
      message: `Welcome, ${subAdmin.displayName}!`,
      token,
      user: AdminAccount.sanitize(subAdmin),
    });
  } catch {
    res.status(500).json({ message: 'Admin login failed. Please try again.' });
  }
};

// ── Get Current User ──────────────────────────────────────────────────────────
// GET /api/auth/me
const getMe = (req, res) => {
  if (req.user.role === 'admin') {
    if (req.user.isSuperAdmin) {
      return res.json({ id: 0, name: 'Super Administrator', username: config.ADMIN_USERNAME, role: 'admin', isSuperAdmin: true });
    }
    const subAdmin = AdminAccount.findById(req.user.adminId);
    if (!subAdmin) return res.status(404).json({ message: 'Admin account not found.' });
    return res.json(AdminAccount.sanitize(subAdmin));
  }
  const user = User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json(User.sanitize(user));
};

// ── List All Users (admin only) ───────────────────────────────────────────────
// GET /api/auth/users
const getAllUsers = (_req, res) => {
  const users = User.findAll();
  res.json({ users, total: users.length });
};

// ── List All Sub-Admins (super admin only) ────────────────────────────────────
// GET /api/auth/admins
const getAllAdmins = (_req, res) => {
  const admins = AdminAccount.findAll();
  res.json({ admins, total: admins.length });
};

// ── Create Sub-Admin (super admin only) ──────────────────────────────────────
// POST /api/auth/admins
const createAdmin = async (req, res) => {
  try {
    const { username, displayName, password, confirmPassword } = req.body;

    // Validation
    if (!username || !password)
      return res.status(400).json({ message: 'username and password are required.' });
    if (username.length < 3)
      return res.status(400).json({ message: 'Username must be at least 3 characters.' });
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores.' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    if (confirmPassword && password !== confirmPassword)
      return res.status(400).json({ message: 'Passwords do not match.' });

    // Block using root super-admin username
    if (username.toLowerCase() === config.ADMIN_USERNAME.toLowerCase())
      return res.status(409).json({ message: `Username "${config.ADMIN_USERNAME}" is reserved.` });

    // Check duplicate username among sub-admins
    if (AdminAccount.usernameExists(username))
      return res.status(409).json({ message: 'An admin with this username already exists.' });

    const hashed = await bcrypt.hash(password, 12);
    const admin  = AdminAccount.create({ username, displayName, password: hashed });

    res.status(201).json({ message: `Admin "${admin.username}" created successfully!`, admin });
  } catch {
    res.status(500).json({ message: 'Failed to create admin. Please try again.' });
  }
};

// ── Update Sub-Admin (super admin only) ──────────────────────────────────────
// PUT /api/auth/admins/:id
const updateAdmin = async (req, res) => {
  try {
    const { username, displayName, password, confirmPassword } = req.body;
    const id = parseInt(req.params.id, 10);

    // Prevent editing root admin (id 0)
    if (id === 0)
      return res.status(403).json({ message: 'The root super admin account cannot be edited here.' });

    // If changing username, check uniqueness
    if (username) {
      if (username.length < 3)
        return res.status(400).json({ message: 'Username must be at least 3 characters.' });
      if (!/^[a-zA-Z0-9_]+$/.test(username))
        return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores.' });
      if (username.toLowerCase() === config.ADMIN_USERNAME.toLowerCase())
        return res.status(409).json({ message: `Username "${config.ADMIN_USERNAME}" is reserved.` });

      const existing = AdminAccount.findByUsername(username);
      if (existing && existing.id !== id)
        return res.status(409).json({ message: 'Another admin already uses this username.' });
    }

    // If changing password, validate
    let hashedPassword;
    if (password) {
      if (password.length < 6)
        return res.status(400).json({ message: 'New password must be at least 6 characters.' });
      if (confirmPassword && password !== confirmPassword)
        return res.status(400).json({ message: 'Passwords do not match.' });
      hashedPassword = await bcrypt.hash(password, 12);
    }

    const updated = AdminAccount.update(id, { username, displayName, password: hashedPassword });
    if (!updated) return res.status(404).json({ message: 'Admin account not found.' });

    res.json({ message: 'Admin account updated successfully!', admin: updated });
  } catch {
    res.status(500).json({ message: 'Failed to update admin. Please try again.' });
  }
};

// ── Delete Sub-Admin (super admin only) ──────────────────────────────────────
// DELETE /api/auth/admins/:id
const deleteAdmin = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (id === 0)
    return res.status(403).json({ message: 'The root super admin cannot be deleted.' });

  const deleted = AdminAccount.delete(id);
  if (!deleted) return res.status(404).json({ message: 'Admin account not found.' });

  res.json({ message: 'Admin account deleted successfully.' });
};

module.exports = {
  userSignup, userLogin, adminLogin, getMe,
  getAllUsers,
  getAllAdmins, createAdmin, updateAdmin, deleteAdmin,
};
