// routes/categoryRoutes.js

const router = require('express').Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { requireAdmin } = require('../middleware');

// ── Public ─────────────────────────────────────────────────────────────────────
router.get('/',    getCategories);               // GET  /api/categories          → name list
router.get('/',    getCategories);               // GET  /api/categories?full=true → full objects
router.get('/:id', requireAdmin, getCategoryById); // GET  /api/categories/:id

// ── Admin only ─────────────────────────────────────────────────────────────────
router.post(  '/',    requireAdmin, createCategory);  // POST   /api/categories
router.put(   '/:id', requireAdmin, updateCategory);  // PUT    /api/categories/:id
router.delete('/:id', requireAdmin, deleteCategory);  // DELETE /api/categories/:id

module.exports = router;
