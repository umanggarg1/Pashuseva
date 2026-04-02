// pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { selectDark } from '../store/themeSlice';
import { userLogin, adminLogin } from '../utils/api';
import { toast } from '../components/Toast';
import { LeafIcon, LoadingIcon } from '../components/Icons';

// ── Reusable input ────────────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, required }) {
  const dark = useSelector(selectDark);
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div>
      <label className="block text-xs font-bold text-earth-500 dark:text-earth-400 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="input-field pr-10"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600 text-xs font-semibold select-none"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── User Login Form ───────────────────────────────────────────────────────────
function UserLoginForm({ onSuccess }) {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill all fields.'); return; }
    setLoading(true);
    try {
      const res = await userLogin(form);
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Field label="Email Address" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
      <Field label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Enter your password" required />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-1">
        {loading ? <><LoadingIcon className="w-5 h-5" /> Signing in...</> : 'Sign In'}
      </button>

      <p className="text-center text-sm text-earth-500 dark:text-earth-400">
        Don't have an account?{' '}
        <Link to="/signup" className="text-leaf-600 font-bold hover:underline">Create one</Link>
      </p>
    </form>
  );
}

// ── Admin Login Form ──────────────────────────────────────────────────────────
function AdminLoginForm({ onSuccess }) {
  const [form, setForm]       = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (k) => (v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) { setError('Please fill all fields.'); return; }
    setLoading(true);
    try {
      const res = await adminLogin(form);
      onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Hint box */}
      <div className="bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-xl px-4 py-3 text-xs text-gold-700 dark:text-gold-400">
        <span className="font-bold">Hint:</span> Username: <code className="font-mono">admin</code> &nbsp;|&nbsp; Password: <code className="font-mono">pashuseva123</code>
      </div>

      <Field label="Admin Username" value={form.username} onChange={set('username')} placeholder="admin" required />
      <Field label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Admin password" required />

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-2.5 rounded-xl">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading}
        className="w-full py-3.5 flex items-center justify-center gap-2 text-base bg-gold-500 hover:bg-gold-600 text-white font-bold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1">
        {loading ? <><LoadingIcon className="w-5 h-5" /> Signing in...</> : 'Admin Sign In'}
      </button>
    </form>
  );
}

// ── Main LoginPage ────────────────────────────────────────────────────────────
export default function LoginPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const dark      = useSelector(selectDark);
  const [tab, setTab] = useState('user'); // 'user' | 'admin'

  // Where to go after successful login
  const from = location.state?.from?.pathname || '/';

  const handleSuccess = ({ user, token, message }) => {
    dispatch(setCredentials({ user, token }));
    toast.success(message || `Welcome, ${user.name}! 🙏`);
    // Admin always goes to /admin, users go back where they came from
    navigate(user.role === 'admin' ? '/admin' : from, { replace: true });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${dark ? '' : 'bg-gradient-to-br from-leaf-50 via-white to-gold-50'}`} style={dark ? { backgroundColor: 'var(--bg-page)' } : {}}>
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-leaf-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gradient-to-br from-leaf-500 to-gold-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-leaf-500/30">
              <LeafIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="font-display text-2xl font-bold text-earth-900 dark:text-white">PashuSeva</div>
              <div className="text-xs text-leaf-600 font-semibold">गाय सेवा • पवित्र पोषण</div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className={`card p-8 shadow-2xl ${dark ? 'shadow-black/40' : 'shadow-earth-200/60'}`}>
          <h1 className="font-display text-2xl font-bold text-earth-900 dark:text-white mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-earth-500 dark:text-earth-400 text-sm text-center mb-6">
            Sign in to your account to continue
          </p>

          {/* Tab switcher */}
          <div className={`flex rounded-xl p-1 mb-6 ${dark ? 'bg-earth-700' : 'bg-earth-100'}`}>
            <button
              onClick={() => setTab('user')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                tab === 'user'
                  ? 'bg-white dark:bg-earth-600 text-leaf-700 dark:text-leaf-400 shadow'
                  : 'text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'
              }`}
            >
              👤 User Login
            </button>
            <button
              onClick={() => setTab('admin')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                tab === 'admin'
                  ? 'bg-white dark:bg-earth-600 text-gold-700 dark:text-gold-400 shadow'
                  : 'text-earth-500 dark:text-earth-400 hover:text-earth-700 dark:hover:text-earth-200'
              }`}
            >
              🛡️ Admin Login
            </button>
          </div>

          {/* Forms */}
          {tab === 'user'  && <UserLoginForm  onSuccess={handleSuccess} />}
          {tab === 'admin' && <AdminLoginForm onSuccess={handleSuccess} />}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-earth-400 mt-6">
          <Link to="/" className="hover:text-leaf-600 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
