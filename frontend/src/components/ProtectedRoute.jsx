// components/ProtectedRoute.jsx
// Wraps a route and redirects if the user is not authenticated or lacks the required role.

import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn, selectIsAdmin } from '../store/authSlice';

/**
 * @param {string}  role        - 'user' | 'admin' | undefined (any logged-in user)
 * @param {string}  redirectTo  - where to send unauthenticated visitors
 */
export default function ProtectedRoute({ children, role, redirectTo = '/login' }) {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdmin    = useSelector(selectIsAdmin);
  const location   = useLocation();

  if (!isLoggedIn) {
    // Preserve the page they tried to visit so we can redirect back after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (role === 'admin' && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}
