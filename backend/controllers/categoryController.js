// controllers/categoryController.js

const Category = require('../models/Category');

// ── GET /api/categories  (public — used by product filter pills) ─────────────
const getCategories = (req, res) => {
  // ?full=true  →  return full objects (for admin panel)
  // default     →  return name strings with 'All' prepended (for product pages)
  if (req.query.full === 'true') {
    return res.json(Category.findAll());
  }
  res.json(Category.getNames());
};

// ── GET /api/categories/:id  (admin) ─────────────────────────────────────────
const getCategoryById = (req, res) => {
  const cat = Category.findById(req.params.id);
  if (!cat) return res.status(404).json({ message: 'Category not found.' });
  res.json(cat);
};

// ── POST /api/categories  (admin) ────────────────────────────────────────────
// Body: { name, description?, icon? }
const createCategory = (req, res) => {
  const { name, description, icon } = req.body;

  if (!name || !name.trim())
    return res.status(400).json({ message: 'Category name is required.' });
  if (name.trim().length < 2)
    return res.status(400).json({ message: 'Name must be at least 2 characters.' });
  if (Category.nameExists(name))
    return res.status(409).json({ message: `Category "${name.trim()}" already exists.` });

  const category = Category.create({ name, description, icon });
  res.status(201).json({ message: `Category "${category.name}" created successfully!`, category });
};

// ── PUT /api/categories/:id  (admin) ─────────────────────────────────────────
// Body: { name?, description?, icon? }
const updateCategory = (req, res) => {
  const { name, description, icon } = req.body;
  const id = parseInt(req.params.id, 10);

  if (!Category.findById(id))
    return res.status(404).json({ message: 'Category not found.' });

  if (name) {
    if (name.trim().length < 2)
      return res.status(400).json({ message: 'Name must be at least 2 characters.' });
    if (Category.nameExists(name, id))
      return res.status(409).json({ message: `Category "${name.trim()}" already exists.` });
  }

  const result = Category.update(id, { name, description, icon });
  if (!result) return res.status(404).json({ message: 'Category not found.' });

  const { category, affectedProducts } = result;
  res.json({
    message: affectedProducts > 0
      ? `Category updated. ${affectedProducts} product(s) re-tagged automatically.`
      : 'Category updated successfully.',
    category,
    affectedProducts,
  });
};

// ── DELETE /api/categories/:id  (admin) ──────────────────────────────────────
const deleteCategory = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (!Category.findById(id))
    return res.status(404).json({ message: 'Category not found.' });

  const result = Category.delete(id);
  if (!result) return res.status(404).json({ message: 'Category not found.' });

  res.json({
    message: result.affectedProducts > 0
      ? `Category deleted. ${result.affectedProducts} product(s) moved to "Uncategorized".`
      : 'Category deleted successfully.',
    affectedProducts: result.affectedProducts,
  });
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
