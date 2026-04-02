# 🐄 PashuSeva — Cattle Feed E-Commerce Platform

A full-stack React + Node.js website for selling cow feeding products.

---

## 📁 Project Structure

```
pashuseva/
├── backend/
│   ├── server.js          # Express REST API
│   ├── package.json
│   └── uploads/           # Product image uploads
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── src/
    │   ├── App.jsx                    # Root with routing
    │   ├── main.jsx                   # React entry point
    │   ├── index.css                  # Tailwind + custom styles
    │   ├── components/
    │   │   ├── Navbar.jsx             # Responsive navbar + dark mode
    │   │   ├── Footer.jsx             # Site footer
    │   │   ├── ProductCard.jsx        # Grid/list product card
    │   │   ├── SearchBar.jsx          # Search input
    │   │   ├── CategoryFilter.jsx     # Category pill buttons
    │   │   ├── Icons.jsx              # All SVG icons
    │   │   ├── Toast.jsx              # Toast notifications
    │   │   └── Loaders.jsx            # Skeletons & spinners
    │   ├── pages/
    │   │   ├── HomePage.jsx           # Hero, features, featured products
    │   │   ├── ProductsPage.jsx       # Browse with search/filter/sort/pagination
    │   │   ├── ProductDetailPage.jsx  # Single product detail
    │   │   ├── CartPage.jsx           # Cart + order placement
    │   │   ├── AboutPage.jsx          # About us + team + timeline
    │   │   ├── ContactPage.jsx        # Contact form + FAQ
    │   │   └── AdminPage.jsx          # Full admin dashboard
    │   ├── store/
    │   │   ├── store.js               # Redux store
    │   │   ├── cartSlice.js           # Cart state
    │   │   ├── themeSlice.js          # Dark mode state
    │   │   └── authSlice.js           # Admin auth state
    │   └── utils/
    │       └── api.js                 # Axios API calls
    └── package.json
```

---

## 🚀 Quick Start

### Step 1 — Backend

```bash
cd backend
npm install
node server.js
# API runs at http://localhost:5000
```

### Step 2 — Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:3000
```

---

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/products | List products (filter, search, sort, paginate) |
| GET | /api/products/:id | Get single product |
| POST | /api/products | Create product (multipart) |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/categories | Get all categories |
| GET | /api/stats | Dashboard stats |
| POST | /api/orders | Place order |
| GET | /api/orders | List orders |
| POST | /api/contact | Submit contact form |
| POST | /api/admin/login | Admin login |

### Query params for GET /api/products:
- `search` — text search
- `category` — filter by category
- `featured` — true/false
- `sort` — newest | price_asc | price_desc | rating
- `page` — page number (default 1)
- `limit` — per page (default 12)

---

---

## ✨ Features

### Customer Side
- 🏠 **Home** — Hero, authenticity section, featured products, testimonials
- 📦 **Products** — Search, category filter, sort, grid/list view, pagination
- 🔍 **Product Detail** — Full info, qty selector, add to cart
- 🛒 **Cart** — Quantity management, order form, stock updates on order
- ℹ️ **About** — Timeline, team, values
- 📞 **Contact** — Form with backend persistence, FAQ accordion
- 🌙 **Dark/Light mode** toggle

### Admin Side
- 🔐 Login with token-based auth
- 📊 Stats dashboard (products, orders, revenue, low stock)
- ➕ Add product with image upload or URL
- ✏️ Edit any product inline via modal
- 🗑️ Delete with confirmation dialog
- 📋 Orders management table

### Technical
- Redux Toolkit for cart, theme, auth state
- React Router v6 with nested routes
- Axios for all API calls
- Vite proxy for dev (no CORS issues)
- Tailwind CSS with custom design tokens
- Responsive at all breakpoints (mobile-first)

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | leaf-600 (#16a34a) |
| Accent | gold-500 (#f59e0b) |
| Background | earth-50 / earth-950 |
| Font | Playfair Display + Nunito |

---

## 🛠 Tech Stack

- **Frontend:** React 18, Redux Toolkit, React Router 6, Tailwind CSS, Vite
- **Backend:** Node.js, Express, Multer (file uploads), CORS
- **State:** Redux (cart, theme, auth)
- **Styling:** Tailwind with custom theme + dark mode
