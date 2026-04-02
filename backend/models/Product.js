// models/Product.js — Product data-access layer
// All direct reads/writes to the products store live here.
// Controllers call these methods; they never touch db directly.

const db = require('../db');

const Product = {
  /**
   * Return all products, optionally filtered, sorted, and paginated.
   * @param {object} query - { category, search, featured, sort, page, limit }
   */
  findAll({ category, search, featured, sort, page = 1, limit = 12 } = {}) {
    let result = [...db.products];

    // ── Filters ──────────────────────────────────────────────────────────────
    if (category && category !== 'All') {
      result = result.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (featured === 'true' || featured === true) {
      result = result.filter(p => p.featured);
    }

    // ── Sorting ───────────────────────────────────────────────────────────────
    const sorters = {
      price_asc:  (a, b) => a.price - b.price,
      price_desc: (a, b) => b.price - a.price,
      rating:     (a, b) => b.rating - a.rating,
      newest:     (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    };
    if (sorters[sort]) result.sort(sorters[sort]);

    // ── Pagination ────────────────────────────────────────────────────────────
    const total = result.length;
    const pageNum = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const start = (pageNum - 1) * pageSize;
    const data = result.slice(start, start + pageSize);

    return {
      products: data,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  /** Find a single product by its numeric id. Returns undefined if not found. */
  findById(id) {
    return db.products.find(p => p.id === parseInt(id, 10));
  },

  /** Return a de-duplicated list of all categories, with 'All' first. */
  getCategories() {
    return ['All', ...new Set(db.products.map(p => p.category))];
  },

  /**
   * Create a new product and persist it to the store.
   * @param {object} data - Product fields from the request
   * @returns {object} The newly created product
   */
  create({ name, category, price, stock, image, description, featured, badge }) {
    const product = {
      id: db.nextProductId(),
      name,
      category,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      image: image || '',
      description: description || '',
      featured: featured === 'true' || featured === true,
      badge: badge || null,
      rating: 4.5,
      reviews: 0,
      createdAt: new Date().toISOString(),
    };
    db.products.push(product);
    return product;
  },

  /**
   * Update an existing product by id.
   * Returns the updated product, or null if not found.
   */
  update(id, fields) {
    const idx = db.products.findIndex(p => p.id === parseInt(id, 10));
    if (idx === -1) return null;

    const existing = db.products[idx];

    db.products[idx] = {
      ...existing,
      name:        fields.name        ?? existing.name,
      category:    fields.category    ?? existing.category,
      price:       fields.price       !== undefined ? parseFloat(fields.price)   : existing.price,
      stock:       fields.stock       !== undefined ? parseInt(fields.stock, 10) : existing.stock,
      description: fields.description ?? existing.description,
      image:       fields.image       ?? existing.image,
      featured:    fields.featured    !== undefined
                     ? (fields.featured === 'true' || fields.featured === true)
                     : existing.featured,
      badge:       fields.badge       !== undefined ? (fields.badge || null) : existing.badge,
      updatedAt:   new Date().toISOString(),
    };

    return db.products[idx];
  },

  /**
   * Delete a product by id.
   * Returns true if deleted, false if not found.
   */
  delete(id) {
    const idx = db.products.findIndex(p => p.id === parseInt(id, 10));
    if (idx === -1) return false;
    db.products.splice(idx, 1);
    return true;
  },

  /** Decrement stock for each order item. */
  decrementStock(items = []) {
    items.forEach(({ id, qty }) => {
      const product = db.products.find(p => p.id === id);
      if (product) product.stock = Math.max(0, product.stock - qty);
    });
  },

  /** Return aggregate stats used by the admin dashboard. */
  getStats() {
    return {
      totalProducts:    db.products.length,
      featuredProducts: db.products.filter(p => p.featured).length,
      lowStock:         db.products.filter(p => p.stock < 20).length,
      categories:       new Set(db.products.map(p => p.category)).size,
    };
  },
};

module.exports = Product;
