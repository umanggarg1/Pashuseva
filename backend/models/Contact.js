// models/Contact.js — Contact-message data-access layer

const db = require('../db');

const Contact = {
  /** Return all contact messages. */
  findAll() {
    return db.contacts;
  },

  /** Find a single contact by id. */
  findById(id) {
    return db.contacts.find(c => c.id === parseInt(id, 10));
  },

  /**
   * Persist a new contact message.
   * @param {object} data - { name, email, phone, message }
   * @returns {object} The saved contact record
   */
  create({ name, email, phone, message }) {
    const contact = {
      id:        Date.now(),
      name,
      email:     email   || '',
      phone:     phone   || '',
      message,
      read:      false,
      createdAt: new Date().toISOString(),
    };
    db.contacts.push(contact);
    return contact;
  },

  /** Mark a message as read. Returns the updated record, or null if not found. */
  markRead(id) {
    const contact = db.contacts.find(c => c.id === parseInt(id, 10));
    if (!contact) return null;
    contact.read = true;
    return contact;
  },

  /** Count of all unread messages. */
  getUnreadCount() {
    return db.contacts.filter(c => !c.read).length;
  },

  /** Total messages stored. */
  getCount() {
    return db.contacts.length;
  },
};

module.exports = Contact;
