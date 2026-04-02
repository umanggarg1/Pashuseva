// models/Category.js — Category data-access layer

const db = require('../db');

const Category = {

  /** Return all categories. */
  findAll() {
    return [...db.categories];
  },

  /** Return just the name strings, with 'All' prepended (used by public API). */
  getNames() {
    return ['All', ...db.categories.map(c => c.name)];
  },

  /** Find by numeric id. */
  findById(id) {
    return db.categories.find(c => c.id === parseInt(id, 10));
  },

  /** Find by name (case-insensitive). */
  findByName(name) {
    return db.categories.find(
      c => c.name.toLowerCase() === name.trim().toLowerCase()
    );
  },

  /** True if a category name already exists (ignores given id — used for uniqueness on edit). */
  nameExists(name, excludeId = null) {
    return db.categories.some(
      c => c.name.toLowerCase() === name.trim().toLowerCase() &&
           c.id !== excludeId
    );
  },

  /**
   * Create a new category.
   * @param {{ name, description?, icon? }} data
   * @returns {object} The created category
   */
  create({ name, description, icon }) {
    const category = {
      id:          db.nextCategoryId(),
      name:        name.trim(),
      description: description?.trim() || '',
      icon:        icon?.trim()        || '📦',
      createdAt:   new Date().toISOString(),
    };
    db.categories.push(category);
    return category;
  },

  /**
   * Update a category's name, description and/or icon.
   * When the name changes, all products using the old name are automatically
   * re-tagged with the new name.
   *
   * @param {number} id
   * @param {{ name?, description?, icon? }} fields
   * @returns {{ category, affectedProducts }} | null if not found
   */
  update(id, { name, description, icon }) {
    const idx = db.categories.findIndex(c => c.id === parseInt(id, 10));
    if (idx === -1) return null;

    const oldName = db.categories[idx].name;
    const newName = name?.trim() || oldName;

    db.categories[idx] = {
      ...db.categories[idx],
      name:        newName,
      description: description !== undefined ? description.trim() : db.categories[idx].description,
      icon:        icon        !== undefined ? icon.trim()        : db.categories[idx].icon,
      updatedAt:   new Date().toISOString(),
    };

    // ── Cascade: rename category on all products that used the old name ──────
    let affectedProducts = 0;
    if (newName !== oldName) {
      db.products.forEach(p => {
        if (p.category === oldName) {
          p.category = newName;
          affectedProducts++;
        }
      });
    }

    return { category: db.categories[idx], affectedProducts };
  },

  /**
   * Delete a category by id.
   * Products that had this category are re-assigned to 'Uncategorized'.
   *
   * @returns {{ deleted, affectedProducts }} | null if not found
   */
  delete(id) {
    const idx = db.categories.findIndex(c => c.id === parseInt(id, 10));
    if (idx === -1) return null;

    const deletedName = db.categories[idx].name;
    db.categories.splice(idx, 1);

    // ── Cascade: re-assign orphaned products ─────────────────────────────────
    let affectedProducts = 0;
    db.products.forEach(p => {
      if (p.category === deletedName) {
        p.category = 'Uncategorized';
        affectedProducts++;
      }
    });

    return { deleted: true, affectedProducts };
  },

  /** Count of categories. */
  getCount() {
    return db.categories.length;
  },
};

module.exports = Category;
