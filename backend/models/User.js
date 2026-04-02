// models/User.js — User data-access layer

const db = require('../db');

const User = {
  /** Return all users (passwords excluded for safety). */
  findAll() {
    return db.users.map(({ password, ...safe }) => safe);
  },

  /** Find user by id. Returns full record including hashed password. */
  findById(id) {
    return db.users.find(u => u.id === parseInt(id, 10));
  },

  /** Find user by email (case-insensitive). Returns full record. */
  findByEmail(email) {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  /** Check whether an email is already registered. */
  emailExists(email) {
    return db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
  },

  /**
   * Create and persist a new user account.
   * @param {object} data - { name, email, phone?, password (already hashed) }
   * @returns {object} Safe user record (no password)
   */
  create({ name, email, phone, password }) {
    const user = {
      id:        db.nextUserId(),
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      phone:     phone?.trim() || '',
      password,                          // bcrypt hash
      role:      'user',                 // always 'user' — admin is hardcoded
      active:    true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    // Return without password
    const { password: _pw, ...safe } = user;
    return safe;
  },

  /** Return user without password field. */
  sanitize(user) {
    if (!user) return null;
    const { password: _pw, ...safe } = user;
    return safe;
  },

  /** Count of all registered users. */
  getCount() {
    return db.users.length;
  },
};

module.exports = User;
