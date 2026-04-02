// db/index.js — In-memory data store

const db = {
  products: [
    { id: 1,  name: 'Premium Wheat Bhoosa',     category: 'Dry Feed',     price: 450,  stock: 120, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80',  rating: 4.8, reviews: 124, featured: true,  description: 'High-quality wheat straw, perfect for daily roughage. Harvested from organic farms, sun-dried for maximum nutrition retention.', badge: 'Best Seller', createdAt: new Date().toISOString() },
    { id: 2,  name: 'Green Napier Grass Bundle', category: 'Green Fodder', price: 280,  stock: 85,  image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80',  rating: 4.6, reviews: 89,  featured: true,  description: 'Fresh-cut Napier grass packed with proteins and minerals essential for milk production.', badge: 'Fresh', createdAt: new Date().toISOString() },
    { id: 3,  name: 'Mineral Lick Block (Salt)', category: 'Supplements',  price: 180,  stock: 200, image: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=500&q=80', rating: 4.9, reviews: 210, featured: true,  description: 'Compressed mineral salt block enriched with trace elements. Supports bone strength and immunity.', badge: 'Top Rated', createdAt: new Date().toISOString() },
    { id: 4,  name: 'Cattle Concentrate Mix',    category: 'Concentrate',  price: 1200, stock: 60,  image: 'https://images.unsplash.com/photo-1559181567-c3190bbbbd45?w=500&q=80',  rating: 4.7, reviews: 156, featured: true,  description: 'Balanced concentrate mix with proteins, carbohydrates, and vitamins for high milk-yielding cows.', badge: 'Premium', createdAt: new Date().toISOString() },
    { id: 5,  name: 'Maize Silage (20kg)',        category: 'Silage',       price: 650,  stock: 45,  image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&q=80',  rating: 4.5, reviews: 67,  featured: false, description: 'Fermented maize silage - energy-dense feed ideal for high-producing dairy cows.', badge: null, createdAt: new Date().toISOString() },
    { id: 6,  name: 'Rice Straw Bundle',          category: 'Dry Feed',     price: 320,  stock: 150, image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80', rating: 4.3, reviews: 45,  featured: false, description: 'Clean, dry rice straw ideal as base roughage. Reduces feed costs significantly.', badge: null, createdAt: new Date().toISOString() },
    { id: 7,  name: 'Azolla Fern (Fresh)',         category: 'Green Fodder', price: 350,  stock: 30,  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',  rating: 4.8, reviews: 93,  featured: false, description: 'Protein-rich Azolla fern - the superfood for cows. Boosts milk yield by up to 15%.', badge: 'Superfood', createdAt: new Date().toISOString() },
    { id: 8,  name: 'Calcium Powder (1kg)',        category: 'Supplements',  price: 220,  stock: 180, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80', rating: 4.6, reviews: 112, featured: false, description: 'Pure calcium supplement to prevent milk fever and support strong bones.', badge: null, createdAt: new Date().toISOString() },
    { id: 9,  name: 'Groundnut Cake (De-oiled)',  category: 'Concentrate',  price: 850,  stock: 70,  image: 'https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca?w=500&q=80', rating: 4.4, reviews: 58,  featured: false, description: 'High-protein de-oiled groundnut cake. Excellent amino acid profile for muscle development.', badge: null, createdAt: new Date().toISOString() },
    { id: 10, name: 'Bajra Chara Bundle',          category: 'Green Fodder', price: 260,  stock: 95,  image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=500&q=80', rating: 4.5, reviews: 71,  featured: false, description: 'Fresh Pearl millet fodder, highly palatable and nutritious for all cattle.', badge: null, createdAt: new Date().toISOString() },
    { id: 11, name: 'Jowar Silage (15kg)',          category: 'Silage',       price: 520,  stock: 55,  image: 'https://images.unsplash.com/photo-1470093851219-69951fcbb533?w=500&q=80', rating: 4.4, reviews: 38,  featured: false, description: 'Sorghum silage with high digestibility. Great for dry season feeding.', badge: null, createdAt: new Date().toISOString() },
    { id: 12, name: 'Vitamin & Mineral Premix',    category: 'Supplements',  price: 480,  stock: 90,  image: 'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=500&q=80', rating: 4.7, reviews: 85,  featured: true,  description: 'Complete vitamin and mineral premix to prevent deficiencies and boost productivity.', badge: 'Essential', createdAt: new Date().toISOString() },
  ],

  contacts:      [],
  orders:        [],
  adminAccounts: [],
  users:         [],

  // ── Categories — managed independently from products ──────────────────────
  // Stored as objects so we can track metadata (description, icon, createdAt).
  // The names here are the single source of truth — products reference them by name.
  categories: [
    { id: 1, name: 'Dry Feed',     description: 'Hay, straw, and other dried roughage for daily feeding.',         icon: '🌾', createdAt: new Date().toISOString() },
    { id: 2, name: 'Green Fodder', description: 'Fresh-cut grasses, legumes and water plants rich in nutrition.',   icon: '🌿', createdAt: new Date().toISOString() },
    { id: 3, name: 'Concentrate',  description: 'Protein-rich cakes and mixed feeds for high milk production.',     icon: '🌰', createdAt: new Date().toISOString() },
    { id: 4, name: 'Supplements',  description: 'Minerals, vitamins and health boosters for livestock.',            icon: '💊', createdAt: new Date().toISOString() },
    { id: 5, name: 'Silage',       description: 'Fermented fodder stored for dry-season energy-dense feeding.',     icon: '🫙', createdAt: new Date().toISOString() },
  ],

  // ── ID counters ─────────────────────────────────────────────────────────────
  _productIdCounter:  13,
  _userIdCounter:      1,
  _adminIdCounter:     1,
  _categoryIdCounter:  6,

  nextProductId()  { return this._productIdCounter++;  },
  nextUserId()     { return this._userIdCounter++;     },
  nextAdminId()    { return this._adminIdCounter++;    },
  nextCategoryId() { return this._categoryIdCounter++; },
};

module.exports = db;
