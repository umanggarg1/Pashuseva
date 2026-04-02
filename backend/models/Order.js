// models/Order.js — Order data-access layer

const db = require('../db');

const Order = {
  /** Return all orders. */
  findAll() {
    return db.orders;
  },

  /** Find a single order by its string id. */
  findById(id) {
    return db.orders.find(o => o.id === id);
  },

  /**
   * Create and persist a new order.
   * @param {object} data - { items, customerName, customerPhone, customerAddress, total }
   * @returns {object} The newly created order
   */
  create({ items, customerName, customerPhone, customerAddress, total }) {
    const order = {
      id:              `ORD-${Date.now()}`,
      items,
      customerName,
      customerPhone:   customerPhone   || '',
      customerAddress: customerAddress || '',
      total:           parseFloat(total) || 0,
      status:          'pending',
      createdAt:       new Date().toISOString(),
    };
    db.orders.push(order);
    return order;
  },

  /**
   * Update the status of an order (e.g. pending → shipped → delivered).
   * Returns the updated order, or null if not found.
   */
  updateStatus(id, status) {
    const order = db.orders.find(o => o.id === id);
    if (!order) return null;
    order.status    = status;
    order.updatedAt = new Date().toISOString();
    return order;
  },

  /** Total revenue across all orders. */
  getTotalRevenue() {
    return db.orders.reduce((sum, o) => sum + (o.total || 0), 0);
  },

  /** Count of all orders. */
  getCount() {
    return db.orders.length;
  },
};

module.exports = Order;
