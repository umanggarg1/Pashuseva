// routes/contactRoutes.js

const router = require('express').Router();
const {
  getContacts,
  createContact,
  markContactRead,
} = require('../controllers/contactController');
const { requireAdmin } = require('../middleware');

router.get('/',          requireAdmin, getContacts);      // GET   /api/contacts
router.post('/',                       createContact);    // POST  /api/contact  (public — customers submit)
router.patch('/:id/read', requireAdmin, markContactRead); // PATCH /api/contacts/:id/read

module.exports = router;
