import axios from 'axios';

// ── Base URL ─────────────────────────────────────────────────────────────────
// In production (Vercel) this is set via VITE_API_URL env variable.
// In development Vite proxies /api → localhost:5000 so we just use '/api'.
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Auto-attach JWT token
API.interceptors.request.use((config) => {
  try {
    const saved = localStorage.getItem('pashuseva_auth');
    if (saved) {
      const { token } = JSON.parse(saved);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const userSignup    = (data)     => API.post('/auth/signup', data);
export const userLogin     = (data)     => API.post('/auth/login', data);
export const adminLogin    = (data)     => API.post('/auth/admin/login', data);
export const getMe         = ()         => API.get('/auth/me');
export const getAllUsers    = ()         => API.get('/auth/users');
export const getAllAdmins   = ()         => API.get('/auth/admins');
export const createAdmin   = (data)     => API.post('/auth/admins', data);
export const updateAdmin   = (id, data) => API.put(`/auth/admins/${id}`, data);
export const deleteAdmin   = (id)       => API.delete(`/auth/admins/${id}`);

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories     = ()         => API.get('/categories');
export const getCategoriesFull = ()         => API.get('/categories?full=true');
export const createCategory    = (data)     => API.post('/categories', data);
export const updateCategory    = (id, data) => API.put(`/categories/${id}`, data);
export const deleteCategory    = (id)       => API.delete(`/categories/${id}`);

// ── Products ──────────────────────────────────────────────────────────────────
export const getProducts   = (params = {}) => API.get('/products', { params });
export const getProduct    = (id)           => API.get(`/products/${id}`);
export const createProduct = (data)         => API.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct = (id, data)     => API.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct = (id)           => API.delete(`/products/${id}`);
export const getStats      = ()             => API.get('/stats');

// ── Orders ────────────────────────────────────────────────────────────────────
export const createOrder = (data) => API.post('/orders', data);
export const getOrders   = ()     => API.get('/orders');

// ── Contact ───────────────────────────────────────────────────────────────────
export const submitContact = (data) => API.post('/contact', data);
export const getContacts   = ()     => API.get('/contacts');

export default API;
