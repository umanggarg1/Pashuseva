// models/AdminAccount.js
// Manages admin accounts that are created by the super admin via the dashboard.
// The root super admin (from .env) is NOT stored here — it is always valid.

const db     = require('../db');
const bcrypt = require('bcryptjs');

const AdminAccount = {

  /** Return all sub-admins (passwords stripped). */
  findAll() {
    return db.adminAccounts.map(({ password, ...safe }) => safe);
  },

  /** Find by numeric id — returns full record with hashed password. */
  findById(id) {
    return db.adminAccounts.find(a => a.id === parseInt(id, 10));
  },

  /** Find by username (case-insensitive) — returns full record. */
  findByUsername(username) {
    return db.adminAccounts.find(
      a => a.username.toLowerCase() === username.toLowerCase()
    );
  },

  /** True if a username is already taken (among sub-admins). */
  usernameExists(username) {
    return db.adminAccounts.some(
      a => a.username.toLowerCase() === username.toLowerCase()
    );
  },

  /**
   * Create a new admin account.
   * Password must already be bcrypt-hashed before calling this.
   * @param {{ username, displayName, password }} data
   * @returns {object} Safe record (no password)
   */
  create({ username, displayName, password }) {
    const account = {
      id:          db.nextAdminId(),
      username:    username.trim().toLowerCase(),
      displayName: displayName?.trim() || username.trim(),
      password,                        // bcrypt hash
      role:        'admin',
      createdAt:   new Date().toISOString(),
      createdBy:   'superadmin',
    };
    db.adminAccounts.push(account);
    const { password: _pw, ...safe } = account;
    return safe;
  },

  /**
   * Update username and/or password of an existing sub-admin.
   * @param {number} id
   * @param {{ username?, displayName?, password? }} fields - password should already be hashed
   * @returns {object|null} Updated safe record, or null if not found
   */
  update(id, { username, displayName, password }) {
    const idx = db.adminAccounts.findIndex(a => a.id === parseInt(id, 10));
    if (idx === -1) return null;

    const existing = db.adminAccounts[idx];
    db.adminAccounts[idx] = {
      ...existing,
      username:    username    ? username.trim().toLowerCase() : existing.username,
      displayName: displayName ? displayName.trim()            : existing.displayName,
      password:    password    || existing.password,
      updatedAt:   new Date().toISOString(),
    };
    const { password: _pw, ...safe } = db.adminAccounts[idx];
    return safe;
  },

  /**
   * Delete a sub-admin by id.
   * @returns {boolean} true if deleted, false if not found
   */
  delete(id) {
    const idx = db.adminAccounts.findIndex(a => a.id === parseInt(id, 10));
    if (idx === -1) return false;
    db.adminAccounts.splice(idx, 1);
    return true;
  },

  /** Strip password from a record. */
  sanitize(account) {
    if (!account) return null;
    const { password: _pw, ...safe } = account;
    return safe;
  },

  /** Count of sub-admins created. */
  getCount() {
    return db.adminAccounts.length;
  },
};

module.exports = AdminAccount;
