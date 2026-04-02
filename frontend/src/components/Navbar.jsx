import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleDark, selectDark } from '../store/themeSlice';
import { selectCartCount } from '../store/cartSlice';
import { selectUser, selectIsLoggedIn, selectIsAdmin, logout } from '../store/authSlice';
import { toast } from './Toast';
import { LeafIcon, SunIcon, MoonIcon, CartIcon, MenuIcon, XIcon } from './Icons';

const NAV_LINKS = [
  { label: 'Home',     path: '/'         },
  { label: 'Products', path: '/products' },
  { label: 'About',    path: '/about'    },
  { label: 'Contact',  path: '/contact'  },
];

// ── User avatar dropdown ──────────────────────────────────────────────────────
function UserMenu({ user, isAdmin }) {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const dark       = useSelector(selectDark);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully. See you soon! 👋');
    navigate('/');
    setOpen(false);
  };

  // Initials avatar
  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all ${
          dark ? 'hover:bg-earth-700' : 'hover:bg-earth-100'
        }`}
      >
        {/* Avatar circle */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
          isAdmin ? 'bg-gradient-to-br from-gold-500 to-gold-600' : 'bg-gradient-to-br from-leaf-500 to-leaf-700'
        }`}>
          {initials}
        </div>
        <div className="hidden sm:block text-left">
          <div className={`text-xs font-bold leading-none ${dark ? 'text-white' : 'text-earth-900'}`}>
            {user.name.split(' ')[0]}
          </div>
          <div className={`text-[10px] leading-none mt-0.5 ${isAdmin ? 'text-gold-500' : 'text-leaf-600'}`}>
            {isAdmin ? '🛡️ Admin' : '👤 User'}
          </div>
        </div>
        <svg className={`w-3 h-3 transition-transform ${dark ? 'text-earth-400' : 'text-earth-500'} ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl border z-50 overflow-hidden animate-fade-in"
             style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-default)' }}>
          {/* Profile header */}
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-input)' }}>
            <div className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>{user.name}</div>
            <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user.email || user.username}</div>
            <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isAdmin ? 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400' : 'bg-leaf-100 text-leaf-700 dark:bg-leaf-900/30 dark:text-leaf-400'
            }`}>
              {isAdmin ? '🛡️ Administrator' : '👤 User'}
            </span>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                  dark ? 'text-earth-300 hover:bg-earth-700 hover:text-white' : 'text-earth-700 hover:bg-earth-50'
                }`}>
                <span>🛡️</span> Admin Dashboard
              </Link>
            )}
            <Link to="/products" onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                dark ? 'text-earth-300 hover:bg-earth-700 hover:text-white' : 'text-earth-700 hover:bg-earth-50'
              }`}>
              <span>📦</span> Browse Products
            </Link>
            <Link to="/cart" onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                dark ? 'text-earth-300 hover:bg-earth-700 hover:text-white' : 'text-earth-700 hover:bg-earth-50'
              }`}>
              <span>🛒</span> My Cart
            </Link>
          </div>

          <div className={`border-t py-1 ${dark ? 'border-earth-700' : 'border-earth-100'}`}>
            <button onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export default function Navbar() {
  const dispatch    = useDispatch();
  const dark        = useSelector(selectDark);
  const cartCount   = useSelector(selectCartCount);
  const isLoggedIn  = useSelector(selectIsLoggedIn);
  const isAdmin     = useSelector(selectIsAdmin);
  const user        = useSelector(selectUser);
  const location    = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path) =>
    location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled || mobileOpen ? 'shadow-xl' : 'shadow-sm'} navbar-surface border-b backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-leaf-500 to-gold-500 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-leaf-500/40 transition-all">
              <LeafIcon className="w-5 h-5" />
            </div>
            <div>
              <div className={`font-display font-bold text-xl leading-none ${dark ? 'text-white' : 'text-earth-900'}`}>PashuSeva</div>
              <div className="text-[10px] text-leaf-600 font-semibold tracking-wide leading-none mt-0.5">गाय सेवा • पवित्र पोषण</div>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, path }) => (
              <Link key={path} to={path}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(path)
                    ? 'bg-leaf-50 text-leaf-700 dark:bg-leaf-900/30 dark:text-leaf-400'
                    : dark ? 'text-earth-300 hover:text-white hover:bg-earth-700' : 'text-earth-600 hover:text-earth-900 hover:bg-earth-50'
                }`}>
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/admin')
                    ? 'bg-gold-50 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400'
                    : dark ? 'text-earth-300 hover:text-white hover:bg-earth-700' : 'text-earth-600 hover:text-earth-900 hover:bg-earth-50'
                }`}>
                Admin
              </Link>
            )}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button onClick={() => dispatch(toggleDark())}
              className={`p-2 rounded-xl transition-all ${dark ? 'bg-earth-700 text-gold-400 hover:bg-earth-600' : 'bg-earth-100 text-earth-600 hover:bg-earth-200'}`}>
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Cart */}
            <Link to="/cart"
              className={`relative p-2 rounded-xl transition-all ${dark ? 'bg-earth-700 text-white hover:bg-earth-600' : 'bg-earth-100 text-earth-700 hover:bg-earth-200'}`}>
              <CartIcon />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-black leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth section */}
            {isLoggedIn && user ? (
              <UserMenu user={user} isAdmin={isAdmin} />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${dark ? 'text-earth-300 hover:text-white hover:bg-earth-700' : 'text-earth-600 hover:bg-earth-100'}`}>
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2 rounded-xl transition-all ${dark ? 'bg-earth-700 text-white' : 'bg-earth-100 text-earth-700'}`}>
              {mobileOpen ? <XIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[28rem]' : 'max-h-0'}`}>
        <div className={`px-4 pb-4 pt-2 navbar-surface border-t`} style={{ borderColor: 'var(--border-default)' }}>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, path }) => (
              <Link key={path} to={path}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive(path) ? 'bg-leaf-50 text-leaf-700 dark:bg-leaf-900/30 dark:text-leaf-400'
                  : dark ? 'text-earth-300 hover:bg-earth-700 hover:text-white' : 'text-earth-600 hover:bg-earth-50'
                }`}>
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin"
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold ${isActive('/admin') ? 'bg-gold-50 text-gold-700' : dark ? 'text-earth-300 hover:bg-earth-700 hover:text-white' : 'text-earth-600 hover:bg-earth-50'}`}>
                Admin
              </Link>
            )}

            {/* Mobile auth */}
            <div className={`mt-2 pt-2 border-t ${dark ? 'border-earth-700' : 'border-earth-100'}`}>
              {isLoggedIn && user ? (
                <div>
                  <div className={`px-4 py-2 text-xs font-bold text-earth-400`}>
                    Signed in as <span className={isAdmin ? 'text-gold-500' : 'text-leaf-600'}>{user.name}</span>
                  </div>
                  <button onClick={() => { dispatch(logout()); setMobileOpen(false); toast.success("Logged out! 👋"); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                    🚪 Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className={`px-4 py-2.5 rounded-xl text-sm font-semibold text-center ${dark ? 'text-earth-300 hover:bg-earth-700' : 'text-earth-600 hover:bg-earth-50'}`}>
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn-primary text-sm py-2.5 text-center">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
