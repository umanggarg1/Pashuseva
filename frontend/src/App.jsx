import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectDark } from './store/themeSlice';
import { selectIsLoggedIn, selectIsAdmin } from './store/authSlice';

import Navbar    from './components/Navbar';
import Footer    from './components/Footer';
import ToastContainer from './components/Toast';

import HomePage         from './pages/HomePage';
import ProductsPage     from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage         from './pages/CartPage';
import AboutPage        from './pages/AboutPage';
import ContactPage      from './pages/ContactPage';
import AdminPage        from './pages/AdminPage';
import LoginPage        from './pages/LoginPage';
import SignupPage       from './pages/SignupPage';

// Redirect already-logged-in users away from /login and /signup
function GuestRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdmin    = useSelector(selectIsAdmin);
  if (isLoggedIn) return <Navigate to={isAdmin ? '/admin' : '/'} replace />;
  return children;
}

// Redirect unauthenticated users; optionally check for admin role
function PrivateRoute({ children, adminOnly = false }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdmin    = useSelector(selectIsAdmin);
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const dark = useSelector(selectDark);

  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark');
    else       document.documentElement.classList.remove('dark');
  }, [dark]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-root)', color: 'var(--text-primary)' }}>
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Public pages */}
          <Route path="/"          element={<HomePage />}          />
          <Route path="/products"  element={<ProductsPage />}      />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/about"     element={<AboutPage />}         />
          <Route path="/contact"   element={<ContactPage />}       />

          {/* Guest only — redirect logged-in users away */}
          <Route path="/login"  element={<GuestRoute><LoginPage  /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />

          {/* Requires login */}
          <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />

          {/* Admin only */}
          <Route path="/admin" element={<PrivateRoute adminOnly><AdminPage /></PrivateRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
}
