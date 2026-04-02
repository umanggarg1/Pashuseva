// routes/orderRoutes.js

const router = require('express').Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orderController');
const { requireAdmin } = require('../middleware');

router.get('/',             requireAdmin, getOrders);       // GET   /api/orders
router.get('/:id',          requireAdmin, getOrderById);    // GET   /api/orders/:id
router.post('/',                          createOrder);     // POST  /api/orders  (public — customers place orders)
router.patch('/:id/status', requireAdmin, updateOrderStatus); // PATCH /api/orders/:id/status

module.exports = router;
