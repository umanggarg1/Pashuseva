// controllers/contactController.js

const Contact = require('../models/Contact');

/**
 * GET /api/contacts  (admin only)
 */
const getContacts = (req, res) => {
  res.json(Contact.findAll());
};

/**
 * POST /api/contact
 * Body: { name, email?, phone?, message }
 */
const createContact = (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'name is required.' });
  }
  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'message is required.' });
  }

  const contact = Contact.create({ name, email, phone, message });
  res.status(201).json({
    message: 'Message received! We will contact you soon. 🙏',
    contact,
  });
};

/**
 * PATCH /api/contacts/:id/read  (admin only — mark as read)
 */
const markContactRead = (req, res) => {
  const updated = Contact.markRead(req.params.id);
  if (!updated) return res.status(404).json({ message: 'Contact not found' });
  res.json(updated);
};

module.exports = { getContacts, createContact, markContactRead };
