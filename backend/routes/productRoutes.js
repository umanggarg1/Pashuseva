// routes/productRoutes.js

const router = require('express').Router();
const {
  getProducts,
  getProductById,
  getCategories,
  getStats,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { upload, requireAdmin } = require('../middleware');

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/',            getProducts);         // GET  /api/products
router.get('/categories',  getCategories);       // GET  /api/categories  (mounted separately)
router.get('/stats',       requireAdmin, getStats); // GET  /api/stats
router.get('/:id',         getProductById);      // GET  /api/products/:id

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.post(  '/',    requireAdmin, upload.single('image'), createProduct);  // POST   /api/products
router.put(   '/:id', requireAdmin, upload.single('image'), updateProduct);  // PUT    /api/products/:id
router.delete('/:id', requireAdmin,                         deleteProduct);  // DELETE /api/products/:id

module.exports = router;
