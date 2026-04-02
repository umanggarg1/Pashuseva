// routes/index.js — Central router registry

const router           = require('express').Router();
const productRoutes    = require('./productRoutes');
const orderRoutes      = require('./orderRoutes');
const contactRoutes    = require('./contactRoutes');
const authRoutes       = require('./authRoutes');
const categoryRoutes   = require('./categoryRoutes');
const { getStats }     = require('../controllers/productController');
const { requireAdmin } = require('../middleware');

router.use('/auth',       authRoutes);       // /api/auth/*
router.use('/products',   productRoutes);    // /api/products/*
router.use('/orders',     orderRoutes);      // /api/orders/*
router.use('/contact',    contactRoutes);    // POST  /api/contact
router.use('/contacts',   contactRoutes);    // GET   /api/contacts
router.use('/categories', categoryRoutes);   // /api/categories/*

router.get('/stats',  requireAdmin, getStats);
router.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

module.exports = router;
