// pages/SignupPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { selectDark } from '../store/themeSlice';
import { userSignup } from '../utils/api';
import { toast } from '../components/Toast';
import { LeafIcon, CheckIcon, LoadingIcon } from '../components/Icons';

// ── Password strength helper ──────────────────────────────────────────────────
function getStrength(pwd) {
  let score = 0;
  if (pwd.length >= 6)                     score++;
  if (pwd.length >= 10)                    score++;
  if (/[A-Z]/.test(pwd))                   score++;
  if (/[0-9]/.test(pwd))                   score++;
  if (/[^A-Za-z0-9]/.test(pwd))            score++;
  return score; // 0–5
}

const STRENGTH_LABELS = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
const STRENGTH_COLORS = ['', 'bg-red-500', 'bg-orange-500', 'bg-gold-500', 'bg-leaf-500', 'bg-emerald-500'];
const STRENGTH_TEXT   = ['', 'text-red-500', 'text-orange-500', 'text-gold-600', 'text-leaf-600', 'text-emerald-600'];

function PasswordStrengthBar({ password }) {
  const strength = getStrength(password);
  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1,2,3,4,5].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? STRENGTH_COLORS[strength] : 'bg-earth-200 dark:bg-earth-600'}`} />
        ))}
      </div>
      <p className={`text-xs font-semibold ${STRENGTH_TEXT[strength]}`}>{STRENGTH_LABELS[strength]}</p>
    </div>
  );
}

// ── Field component ───────────────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, placeholder, required, hint, error }) {
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
          className={`input-field pr-10 ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600 text-xs font-semibold select-none">
            {show ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-earth-400 text-xs mt-1">{hint}</p>}
    </div>
  );
}

// ── Requirements checklist ────────────────────────────────────────────────────
function Requirement({ met, text }) {
  return (
    <div className={`flex items-center gap-2 text-xs transition-colors ${met ? 'text-leaf-600 dark:text-leaf-400' : 'text-earth-400'}`}>
      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${met ? 'bg-leaf-100 dark:bg-leaf-900/40 text-leaf-600' : 'bg-earth-100 dark:bg-earth-700'}`}>
        {met && <CheckIcon className="w-2.5 h-2.5" />}
      </div>
      {text}
    </div>
  );
}

// ── Main SignupPage ───────────────────────────────────────────────────────────
export default function SignupPage() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const dark      = useSelector(selectDark);

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k) => (v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  // Client-side validation
  const validate = () => {
    const errs = {};
    if (!form.name.trim())            errs.name     = 'Full name is required.';
    if (!form.email.trim())           errs.email    = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.';
    if (!form.password)               errs.password = 'Password is required.';
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters.';
    if (!form.confirmPassword)        errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await userSignup(form);
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      toast.success(res.data.message || 'Account created! Welcome 🙏');
      navigate('/', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally { setLoading(false); }
  };

  const strength = getStrength(form.password);

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 ${dark ? '' : 'bg-gradient-to-br from-leaf-50 via-white to-gold-50'}`} style={dark ? { backgroundColor: 'var(--bg-page)' } : {}}>
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-leaf-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
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
          <h1 className="font-display text-2xl font-bold text-earth-900 dark:text-white mb-1 text-center">
            Create Account
          </h1>
          <p className="text-earth-500 dark:text-earth-400 text-sm text-center mb-6">
            Join thousands of farmers on PashuSeva
          </p>

          {/* Info banner — admin note */}
          <div className={`flex items-start gap-3 rounded-xl px-4 py-3 mb-6 text-xs ${dark ? 'bg-earth-700 border-earth-600' : 'bg-blue-50 border-blue-100'} border`}>
            <span className="text-blue-500 flex-shrink-0 mt-0.5">ℹ️</span>
            <p className={dark ? 'text-earth-300' : 'text-blue-700'}>
              Signup is for <strong>regular users</strong> only. Admin accounts are managed separately.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field
              label="Full Name" value={form.name} onChange={set('name')}
              placeholder="Ramesh Yadav" required error={errors.name}
            />
            <Field
              label="Email Address" type="email" value={form.email} onChange={set('email')}
              placeholder="you@example.com" required error={errors.email}
            />
            <Field
              label="Phone Number" type="tel" value={form.phone} onChange={set('phone')}
              placeholder="+91 98765 43210" hint="Optional — for order updates"
            />
            <div>
              <Field
                label="Password" type="password" value={form.password} onChange={set('password')}
                placeholder="Min. 6 characters" required error={errors.password}
              />
              <PasswordStrengthBar password={form.password} />
              {form.password && (
                <div className="grid grid-cols-2 gap-1 mt-2">
                  <Requirement met={form.password.length >= 6}   text="At least 6 chars" />
                  <Requirement met={/[A-Z]/.test(form.password)} text="Uppercase letter" />
                  <Requirement met={/[0-9]/.test(form.password)} text="Number" />
                  <Requirement met={/[^A-Za-z0-9]/.test(form.password)} text="Special char" />
                </div>
              )}
            </div>
            <Field
              label="Confirm Password" type="password" value={form.confirmPassword} onChange={set('confirmPassword')}
              placeholder="Re-enter your password" required error={errors.confirmPassword}
            />

            {serverError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-2.5 rounded-xl">
                {serverError}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-60 disabled:cursor-not-allowed mt-1">
              {loading
                ? <><LoadingIcon className="w-5 h-5" /> Creating Account...</>
                : 'Create Account 🙏'
              }
            </button>

            <p className="text-center text-sm text-earth-500 dark:text-earth-400">
              Already have an account?{' '}
              <Link to="/login" className="text-leaf-600 font-bold hover:underline">Sign in</Link>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-earth-400 mt-6">
          <Link to="/" className="hover:text-leaf-600 transition-colors">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}
