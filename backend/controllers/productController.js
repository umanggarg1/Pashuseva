// controllers/productController.js

const Product  = require('../models/Product');
const Category = require('../models/Category');
const config   = require('../config');

const getProducts = (req, res) => {
  try { res.json(Product.findAll(req.query)); }
  catch (err) { res.status(500).json({ message: 'Failed to fetch products', error: err.message }); }
};

const getProductById = (req, res) => {
  const product = Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// Delegate to Category model so the list is always in sync with db.categories
const getCategories = (req, res) => {
  if (req.query.full === 'true') return res.json(Category.findAll());
  res.json(Category.getNames());
};

const getStats = (req, res) => {
  const Order    = require('../models/Order');
  const Contact  = require('../models/Contact');
  const User     = require('../models/User');

  res.json({
    ...Product.getStats(),
    totalCategories: Category.getCount(),
    totalOrders:     Order.getCount(),
    revenue:         Order.getTotalRevenue(),
    totalContacts:   Contact.getCount(),
    unreadContacts:  Contact.getUnreadCount(),
    totalUsers:      User.getCount(),
  });
};

const createProduct = (req, res) => {
  const { name, category, price, stock, description, featured, badge } = req.body;
  if (!name || !category || !price || !stock)
    return res.status(400).json({ message: 'name, category, price, and stock are required.' });

  const image = req.file
    ? `${config.getServerUrl()}/uploads/${req.file.filename}`
    : (req.body.image || '');

  res.status(201).json(Product.create({ name, category, price, stock, image, description, featured, badge }));
};

const updateProduct = (req, res) => {
  const { name, category, price, stock, description, featured, badge, image: bodyImage } = req.body;
  const image = req.file
    ? `${config.getServerUrl()}/uploads/${req.file.filename}`
    : bodyImage;

  const updated = Product.update(req.params.id, { name, category, price, stock, description, featured, badge, image });
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
};

const deleteProduct = (req, res) => {
  const deleted = Product.delete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Product not found' });
  res.json({ message: 'Product deleted successfully' });
};

module.exports = { getProducts, getProductById, getCategories, getStats, createProduct, updateProduct, deleteProduct };
