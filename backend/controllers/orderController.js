// controllers/orderController.js

const Order   = require('../models/Order');
const Product = require('../models/Product');

/**
 * GET /api/orders
 */
const getOrders = (req, res) => {
  res.json(Order.findAll());
};

/**
 * GET /api/orders/:id
 */
const getOrderById = (req, res) => {
  const order = Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

/**
 * POST /api/orders
 * Body: { items: [{ id, name, price, qty }], customerName, customerPhone,
 *         customerAddress, total }
 */
const createOrder = (req, res) => {
  const { items, customerName, customerPhone, customerAddress, total } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'items array is required and must not be empty.' });
  }
  if (!customerName) {
    return res.status(400).json({ message: 'customerName is required.' });
  }

  // Reduce stock levels for each ordered item
  Product.decrementStock(items);

  const order = Order.create({ items, customerName, customerPhone, customerAddress, total });
  res.status(201).json(order);
};

/**
 * PATCH /api/orders/:id/status
 * Body: { status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' }
 */
const updateOrderStatus = (req, res) => {
  const { status } = req.body;
  const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
  }

  const updated = Order.updateStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ message: 'Order not found' });
  res.json(updated);
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus };
