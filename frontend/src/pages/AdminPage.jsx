import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectIsAdmin, selectUser, logout } from '../store/authSlice';
import { selectDark } from '../store/themeSlice';
import {
  getProducts, createProduct, updateProduct, deleteProduct,
  getStats, getOrders, getAllUsers,
  getAllAdmins, createAdmin, updateAdmin, deleteAdmin,
  getCategoriesFull, createCategory, updateCategory, deleteCategory,
} from '../utils/api';
import { toast } from '../components/Toast';
import { PageLoader, Spinner } from '../components/Loaders';
import { EditIcon, TrashIcon, PlusIcon, UploadIcon, XIcon, CheckIcon } from '../components/Icons';

const CATEGORIES = ['Dry Feed', 'Green Fodder', 'Concentrate', 'Supplements', 'Silage'];

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

function InputField({ label, type = 'text', value, onChange, placeholder, hint, required, error }) {
  const dark = useSelector(selectDark);
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return (
    <div>
      <label className="block text-xs font-bold text-earth-500 dark:text-earth-400 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`input-field ${isPassword ? 'pr-14' : ''} ${error ? 'border-red-400' : ''}`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-earth-400 hover:text-earth-600">
            {show ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {hint && !error && <p className="text-earth-400 text-xs mt-1">{hint}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats Grid
// ─────────────────────────────────────────────────────────────────────────────

function StatsGrid({ stats, adminCount, categoryCount }) {
  const items = [
    { label: 'Products',    value: stats.totalProducts    ?? 0,  color: 'text-leaf-600',    bg: 'bg-leaf-50 dark:bg-leaf-900/20'     },
    { label: 'Categories',  value: categoryCount          ?? 0,  color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-900/20'     },
    { label: 'Orders',      value: stats.totalOrders      ?? 0,  color: 'text-purple-600',  bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Users',       value: stats.totalUsers       ?? 0,  color: 'text-indigo-600',  bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Admins',      value: adminCount + 1,               color: 'text-gold-700',    bg: 'bg-gold-50 dark:bg-gold-900/20'     },
    { label: 'Revenue',     value: `₹${(stats.revenue || 0).toLocaleString()}`, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {items.map(({ label, value, color, bg }) => (
        <div key={label} className="card p-4 text-center">
          <div className={`inline-block px-3 py-1.5 rounded-xl ${bg} mb-2`}>
            <div className={`font-display font-bold text-xl ${color}`}>{value}</div>
          </div>
          <div className="text-xs text-earth-500 dark:text-earth-400 font-medium">{label}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Account Modal  (Create / Edit)
// ─────────────────────────────────────────────────────────────────────────────

function AdminModal({ existing, onClose, onSave }) {
  const dark = useSelector(selectDark);
  const [form, setForm] = useState({
    username:        existing?.username    || '',
    displayName:     existing?.displayName || '',
    password:        '',
    confirmPassword: '',
  });
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);

  const set = (k) => (v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: '' })); };

  const validate = () => {
    const errs = {};
    if (!form.username) errs.username = 'Username is required.';
    else if (form.username.length < 3) errs.username = 'Min. 3 characters.';
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) errs.username = 'Letters, numbers, underscores only.';

    if (!existing) {
      // Creating new — password is mandatory
      if (!form.password) errs.password = 'Password is required.';
      else if (form.password.length < 6) errs.password = 'Min. 6 characters.';
      if (form.password && form.confirmPassword && form.password !== form.confirmPassword)
        errs.confirmPassword = 'Passwords do not match.';
    } else {
      // Editing — password is optional but must match if provided
      if (form.password) {
        if (form.password.length < 6) errs.password = 'Min. 6 characters.';
        if (form.confirmPassword && form.password !== form.confirmPassword)
          errs.confirmPassword = 'Passwords do not match.';
      }
    }
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        username:    form.username,
        displayName: form.displayName || form.username,
        ...(form.password ? { password: form.password, confirmPassword: form.confirmPassword } : {}),
      };
      const res = existing
        ? await updateAdmin(existing.id, payload)
        : await createAdmin(payload);
      toast.success(res.data.message);
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save admin.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl ${dark ? 'bg-earth-800 border border-earth-700' : 'bg-white shadow-2xl'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? 'border-earth-700' : 'border-earth-100'}`}>
          <div>
            <h3 className="font-display font-bold text-lg text-earth-900 dark:text-white">
              {existing ? 'Edit Admin Account' : 'Create New Admin'}
            </h3>
            <p className="text-xs text-earth-400 mt-0.5">
              {existing ? `Editing: @${existing.username}` : 'New admin will have full dashboard access.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-earth-400 hover:text-earth-600 hover:bg-earth-100 dark:hover:bg-earth-700 transition-all">
            <XIcon />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Info banner */}
          <div className={`flex gap-3 px-4 py-3 rounded-xl text-xs ${dark ? 'bg-gold-900/20 border-gold-800 text-gold-300' : 'bg-gold-50 border-gold-200 text-gold-700'} border`}>
            <span className="flex-shrink-0 mt-0.5">🛡️</span>
            <span>
              {existing
                ? 'Leave password fields blank to keep the current password unchanged.'
                : 'This admin will be able to log in at the Admin Login tab and access the dashboard.'}
            </span>
          </div>

          <InputField label="Username" value={form.username} onChange={set('username')}
            placeholder="e.g. rajesh_admin" required
            hint="Letters, numbers, underscores only. Min. 3 characters."
            error={errors.username} />

          <InputField label="Display Name" value={form.displayName} onChange={set('displayName')}
            placeholder="e.g. Rajesh Kumar"
            hint="Shown in the dashboard header." />

          <div className={`h-px ${dark ? 'bg-earth-700' : 'bg-earth-100'}`} />

          <InputField label={existing ? 'New Password' : 'Password'} type="password"
            value={form.password} onChange={set('password')}
            placeholder={existing ? 'Leave blank to keep current' : 'Min. 6 characters'}
            required={!existing} error={errors.password} />

          <InputField label="Confirm Password" type="password"
            value={form.confirmPassword} onChange={set('confirmPassword')}
            placeholder="Re-enter password"
            required={!existing && !!form.password} error={errors.confirmPassword} />
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 px-6 py-4 border-t ${dark ? 'border-earth-700' : 'border-earth-100'}`}>
          <button onClick={onClose} className="btn-outline py-2 px-5 text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 ${existing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gold-500 hover:bg-gold-600'}`}>
            {saving
              ? <><Spinner size="sm" className="border-white/30 border-t-white" />Saving...</>
              : <><CheckIcon className="w-4 h-4" />{existing ? 'Update Admin' : 'Create Admin'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Admins Tab
// ─────────────────────────────────────────────────────────────────────────────

function AdminsTab({ admins, isSuperAdmin, onRefresh }) {
  const dark            = useSelector(selectDark);
  const [modal,         setModal]         = useState(null);   // null | 'create' | { ...adminObj }
  const [deleteConfirm, setDeleteConfirm] = useState(null);   // null | id

  const handleDelete = async (id) => {
    try {
      const res = await deleteAdmin(id);
      toast.success(res.data.message);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete admin.');
    } finally { setDeleteConfirm(null); }
  };

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="font-display font-bold text-lg text-earth-900 dark:text-white">Admin Accounts</h2>
          <p className="text-xs text-earth-500 dark:text-earth-400 mt-0.5">
            Manage who has admin dashboard access. Only the super admin can add or remove admins.
          </p>
        </div>
        {isSuperAdmin && (
          <button onClick={() => setModal('create')}
            className="btn-primary flex items-center gap-2 py-2 text-sm self-start sm:self-auto whitespace-nowrap">
            <PlusIcon /> New Admin
          </button>
        )}
      </div>

      {/* Root super admin — always shown, always first */}
      <div className={`rounded-2xl border mb-3 overflow-hidden ${dark ? 'border-earth-700' : 'border-earth-200'}`}>
        <div className={`flex items-center gap-4 px-5 py-4 ${dark ? 'bg-gold-900/20' : 'bg-gold-50'}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-earth-900 dark:text-white">Super Administrator</span>
              <span className="badge bg-gold-100 text-gold-700 dark:bg-gold-900/40 dark:text-gold-400 text-[10px]">Root Admin</span>
            </div>
            <div className="text-xs text-earth-500 dark:text-earth-400 font-mono mt-0.5">@admin &nbsp;·&nbsp; Configured via .env</div>
          </div>
          <div className="text-xs text-earth-400 hidden sm:block">Cannot be edited here</div>
        </div>
      </div>

      {/* Sub-admin list */}
      {admins.length === 0 ? (
        <div className={`rounded-2xl border border-dashed py-14 text-center ${dark ? 'border-earth-700' : 'border-earth-200'}`}>
          <div className="text-5xl mb-3">🛡️</div>
          <p className="font-semibold text-earth-700 dark:text-earth-300 mb-1">No sub-admins yet</p>
          <p className="text-sm text-earth-400 mb-5">Create admin accounts to give others dashboard access.</p>
          {isSuperAdmin && (
            <button onClick={() => setModal('create')} className="btn-primary text-sm py-2 px-6 inline-flex items-center gap-2">
              <PlusIcon /> Create First Admin
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {admins.map((admin) => (
            <div key={admin.id} className={`card flex items-center gap-4 px-5 py-4`}>
              {/* Avatar */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-leaf-500 to-leaf-700 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {(admin.displayName || admin.username).slice(0, 2).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-earth-900 dark:text-white">{admin.displayName}</span>
                  <span className="badge bg-leaf-100 text-leaf-700 dark:bg-leaf-900/30 dark:text-leaf-400 text-[10px]">Admin</span>
                </div>
                <div className="flex items-center gap-3 flex-wrap mt-0.5">
                  <span className="text-xs text-earth-500 dark:text-earth-400 font-mono">@{admin.username}</span>
                  <span className="text-earth-300 dark:text-earth-600">·</span>
                  <span className="text-xs text-earth-400">
                    Created {new Date(admin.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                  </span>
                </div>
              </div>

              {/* Actions — only super admin sees them */}
              {isSuperAdmin && (
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setModal(admin)}
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Edit admin">
                    <EditIcon />
                  </button>
                  <button onClick={() => setDeleteConfirm(admin.id)}
                    className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors"
                    title="Delete admin">
                    <TrashIcon />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Not super admin notice */}
      {!isSuperAdmin && (
        <div className={`mt-4 flex gap-3 px-4 py-3 rounded-xl text-xs ${dark ? 'bg-earth-800 border-earth-700 text-earth-400' : 'bg-earth-50 border-earth-200 text-earth-500'} border`}>
          <span>ℹ️</span>
          <span>Only the <strong>root super admin</strong> can create, edit, or remove admin accounts.</span>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modal && (
        <AdminModal
          existing={modal === 'create' ? null : modal}
          onClose={() => setModal(null)}
          onSave={onRefresh}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-bold text-lg text-earth-900 dark:text-white mb-2">Delete Admin Account?</h3>
            <p className="text-sm text-earth-500 dark:text-earth-400 mb-6">
              This admin will immediately lose dashboard access. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-outline py-2">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Products Tab
// ─────────────────────────────────────────────────────────────────────────────

function ProductModal({ product, categoryNames = [], onClose, onSave }) {
  const dark    = useSelector(selectDark);
  const fileRef = useRef();
  const defaultCategory = categoryNames[0] || 'Dry Feed';
  const [form, setForm] = useState({
    name: '', category: defaultCategory, price: '', stock: '',
    image: '', description: '', featured: false, badge: '',
    ...(product ? { ...product, price: String(product.price), stock: String(product.stock) } : {}),
  });
  const [preview, setPreview] = useState(product?.image || '');
  const [file,    setFile]    = useState(null);
  const [saving,  setSaving]  = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) { toast.error('Name, price, and stock are required.'); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('image', file);
      const res = product ? await updateProduct(product.id, fd) : await createProduct(fd);
      onSave(res.data);
      toast.success(product ? 'Product updated!' : 'Product added!');
      onClose();
    } catch { toast.error('Failed to save product.'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl ${dark ? 'bg-earth-800 border border-earth-700' : 'bg-white shadow-2xl'}`}>
        <div className={`flex items-center justify-between p-6 border-b ${dark ? 'border-earth-700' : 'border-earth-100'}`}>
          <h3 className="font-display font-bold text-lg text-earth-900 dark:text-white">{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl text-earth-400 hover:text-earth-600 hover:bg-earth-100 dark:hover:bg-earth-700"><XIcon /></button>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-earth-500 dark:text-earth-400 mb-2 block">Product Image</label>
            <div className="flex items-start gap-4">
              {preview ? (
                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={preview} alt="preview" className="w-full h-full object-cover" onError={e => e.target.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80'} />
                  <button onClick={() => { setPreview(''); setFile(null); set('image', ''); }} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white"><XIcon className="w-3 h-3" /></button>
                </div>
              ) : (
                <div onClick={() => fileRef.current?.click()} className={`w-24 h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer ${dark ? 'border-earth-600 hover:border-leaf-500 text-earth-500' : 'border-earth-300 hover:border-leaf-400 text-earth-400'}`}>
                  <UploadIcon className="w-6 h-6 mb-1" /><span className="text-[10px]">Upload</span>
                </div>
              )}
              <div className="flex-1">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                <button onClick={() => fileRef.current?.click()} className="btn-outline text-xs py-1.5 px-3 mb-2">Choose File</button>
                <p className="text-xs text-earth-400">Or enter image URL below</p>
                <input type="text" placeholder="https://..." value={form.image} onChange={e => { set('image', e.target.value); if (!file) setPreview(e.target.value); }} className="input-field mt-2 text-xs" />
              </div>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-earth-500 dark:text-earth-400 mb-1 block">Product Name *</label>
            <input type="text" placeholder="e.g. Premium Wheat Bhoosa" value={form.name} onChange={e => set('name', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-bold text-earth-500 dark:text-earth-400 mb-1 block">Category *</label>
            <select value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
              {(categoryNames.length ? categoryNames : ['Dry Feed','Green Fodder','Concentrate','Supplements','Silage']).map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-earth-500 dark:text-earth-400 mb-1 block">Badge</label>
            <input type="text" placeholder="e.g. Best Seller" value={form.badge || ''} onChange={e => set('badge', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-bold text-earth-500 dark:text-earth-400 mb-1 block">Price (₹) *</label>
            <input type="number" placeholder="450" value={form.price} onChange={e => set('price', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="text-xs font-bold text-earth-500 dark:text-earth-400 mb-1 block">Stock Qty *</label>
            <input type="number" placeholder="100" value={form.stock} onChange={e => set('stock', e.target.value)} className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-earth-500 dark:text-earth-400 mb-1 block">Description</label>
            <textarea rows={3} placeholder="Product description..." value={form.description} onChange={e => set('description', e.target.value)} className="input-field resize-none" />
          </div>
          <div className="sm:col-span-2 flex items-center gap-3">
            <input type="checkbox" id="featured" checked={form.featured} onChange={e => set('featured', e.target.checked)} className="w-4 h-4 accent-leaf-600" />
            <label htmlFor="featured" className="text-sm font-medium text-earth-700 dark:text-earth-300">Mark as Featured Product</label>
          </div>
        </div>
        <div className={`flex justify-end gap-3 px-6 py-4 border-t ${dark ? 'border-earth-700' : 'border-earth-100'}`}>
          <button onClick={onClose} className="btn-outline py-2">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary py-2 px-6 flex items-center gap-2 disabled:opacity-60">
            {saving ? <><Spinner size="sm" className="border-white/30 border-t-white" />Saving...</> : <><CheckIcon className="w-4 h-4" />{product ? 'Update' : 'Add Product'}</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductsTab({ products, onEdit, onDelete }) {
  const dark = useSelector(selectDark);
  return (
    <div className="overflow-x-auto rounded-2xl border border-earth-200 dark:border-earth-700">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className={`${dark ? 'bg-earth-700 text-earth-300' : 'bg-earth-50 text-earth-500'} text-xs uppercase tracking-wider`}>
            {['Product','Category','Price','Stock','Featured','Rating','Actions'].map(h => <th key={h} className="px-4 py-3 text-left font-bold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={p.id} className={`border-t ${dark ? 'border-earth-700' : 'border-earth-100'} ${i%2===0?'':dark?'bg-earth-800/50':'bg-earth-50/50'} hover:bg-leaf-50/30 dark:hover:bg-leaf-900/10 transition-colors`}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" onError={e => { e.target.src='https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=100&q=80'; }} />
                  <div>
                    <div className="font-semibold text-sm text-earth-900 dark:text-white max-w-[180px] truncate">{p.name}</div>
                    {p.badge && <span className="text-[10px] bg-gold-100 text-gold-700 px-1.5 py-0.5 rounded font-bold">{p.badge}</span>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-leaf-600 font-medium text-sm">{p.category}</td>
              <td className="px-4 py-3 font-bold text-sm text-gold-600 dark:text-gold-400">₹{p.price}</td>
              <td className="px-4 py-3"><span className={`text-sm font-bold ${p.stock<20?'text-red-500':'text-earth-700 dark:text-earth-300'}`}>{p.stock}</span></td>
              <td className="px-4 py-3"><span className={`badge ${p.featured?'bg-leaf-100 text-leaf-700 dark:bg-leaf-900/30 dark:text-leaf-400':'bg-earth-100 text-earth-500 dark:bg-earth-700 dark:text-earth-400'}`}>{p.featured?'Yes':'No'}</span></td>
              <td className="px-4 py-3 text-sm text-earth-600 dark:text-earth-300">{p.rating} ★</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button onClick={() => onEdit(p)} className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors"><EditIcon /></button>
                  <button onClick={() => onDelete(p.id)} className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition-colors"><TrashIcon /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && <div className="text-center py-12 text-earth-400">No products found.</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Orders Tab
// ─────────────────────────────────────────────────────────────────────────────

function OrdersTab({ orders }) {
  const dark = useSelector(selectDark);
  if (!orders.length) return <div className="text-center py-12 text-earth-400">No orders yet.</div>;
  return (
    <div className="overflow-x-auto rounded-2xl border border-earth-200 dark:border-earth-700">
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className={`${dark?'bg-earth-700 text-earth-300':'bg-earth-50 text-earth-500'} text-xs uppercase tracking-wider`}>
            {['Order ID','Customer','Items','Total','Status','Date'].map(h=><th key={h} className="px-4 py-3 text-left font-bold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {orders.map((o,i)=>(
            <tr key={o.id} className={`border-t ${dark?'border-earth-700':'border-earth-100'} ${i%2===0?'':dark?'bg-earth-800/50':'bg-earth-50/50'}`}>
              <td className="px-4 py-3 font-mono text-xs text-earth-600 dark:text-earth-400">{o.id}</td>
              <td className="px-4 py-3"><div className="font-semibold text-sm text-earth-900 dark:text-white">{o.customerName}</div><div className="text-xs text-earth-400">{o.customerPhone}</div></td>
              <td className="px-4 py-3 text-sm text-earth-600 dark:text-earth-300">{o.items?.length} items</td>
              <td className="px-4 py-3 font-bold text-gold-600 dark:text-gold-400">₹{o.total?.toLocaleString()}</td>
              <td className="px-4 py-3"><span className="badge bg-gold-100 text-gold-700">{o.status}</span></td>
              <td className="px-4 py-3 text-xs text-earth-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Users Tab
// ─────────────────────────────────────────────────────────────────────────────

function UsersTab({ users }) {
  const dark = useSelector(selectDark);
  if (!users.length) return (
    <div className="text-center py-14">
      <div className="text-5xl mb-3">👥</div>
      <p className="text-earth-400">No registered users yet.</p>
    </div>
  );
  return (
    <div className="overflow-x-auto rounded-2xl border border-earth-200 dark:border-earth-700">
      <table className="w-full min-w-[500px]">
        <thead>
          <tr className={`${dark?'bg-earth-700 text-earth-300':'bg-earth-50 text-earth-500'} text-xs uppercase tracking-wider`}>
            {['ID','Name','Email','Phone','Role','Joined'].map(h=><th key={h} className="px-4 py-3 text-left font-bold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {users.map((u,i)=>(
            <tr key={u.id} className={`border-t ${dark?'border-earth-700':'border-earth-100'} ${i%2===0?'':dark?'bg-earth-800/50':'bg-earth-50/50'}`}>
              <td className="px-4 py-3 text-xs text-earth-400 font-mono">#{u.id}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-leaf-500 to-leaf-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {u.name.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
                  </div>
                  <span className="font-semibold text-sm text-earth-900 dark:text-white">{u.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-earth-600 dark:text-earth-300">{u.email}</td>
              <td className="px-4 py-3 text-sm text-earth-500 dark:text-earth-400">{u.phone||'—'}</td>
              <td className="px-4 py-3"><span className="badge bg-leaf-100 text-leaf-700 dark:bg-leaf-900/30 dark:text-leaf-400">{u.role}</span></td>
              <td className="px-4 py-3 text-xs text-earth-400">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main AdminPage
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Categories Tab
// ─────────────────────────────────────────────────────────────────────────────

function CategoriesTab({ categories, onRefresh }) {
  const dark = useSelector(selectDark);
  const [modal,         setModal]         = useState(null);  // null | 'create' | { ...cat }
  const [deleteConfirm, setDeleteConfirm] = useState(null);  // null | categoryObj
  const [form,          setForm]          = useState({ name: '', description: '', icon: '📦' });
  const [errors,        setErrors]        = useState({});
  const [saving,        setSaving]        = useState(false);

  const openCreate = () => {
    setForm({ name: '', description: '', icon: '📦' });
    setErrors({});
    setModal('create');
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '📦' });
    setErrors({});
    setModal(cat);
  };

  const set = (k) => (v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim())               errs.name = 'Category name is required.';
    else if (form.name.trim().length < 2) errs.name = 'Minimum 2 characters.';
    return errs;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { name: form.name.trim(), description: form.description.trim(), icon: form.icon.trim() };
      const res = modal === 'create'
        ? await createCategory(payload)
        : await updateCategory(modal.id, payload);
      toast.success(res.data.message);
      onRefresh();
      setModal(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (cat) => {
    try {
      const res = await deleteCategory(cat.id);
      toast.success(res.data.message);
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category.');
    } finally { setDeleteConfirm(null); }
  };

  const QUICK_ICONS = ['🌾', '🌿', '🌰', '💊', '🫙', '🐄', '🥬', '🌱', '🌽', '🧪', '🫘', '🌊', '⚗️', '📦'];

  return (
    <div>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-display font-bold text-lg text-earth-900 dark:text-white">Product Categories</h2>
          <p className="text-xs text-earth-500 dark:text-earth-400 mt-0.5">
            Renaming a category automatically re-tags all products using it.
          </p>
        </div>
        <button onClick={openCreate}
          className="btn-primary flex items-center gap-2 py-2 text-sm self-start sm:self-auto whitespace-nowrap">
          <PlusIcon /> New Category
        </button>
      </div>

      {/* Categories grid */}
      {categories.length === 0 ? (
        <div className={`rounded-2xl border-2 border-dashed py-16 text-center ${dark ? 'border-earth-700' : 'border-earth-200'}`}>
          <div className="text-5xl mb-3">🏷️</div>
          <p className="font-semibold text-earth-700 dark:text-earth-300 mb-1">No categories yet</p>
          <p className="text-sm text-earth-400 mb-5">Create your first category to start organising products.</p>
          <button onClick={openCreate} className="btn-primary text-sm py-2 px-6 inline-flex items-center gap-2">
            <PlusIcon /> Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => (
            <div key={cat.id} className="card p-5 group hover:-translate-y-0.5">
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${dark ? 'bg-earth-700' : 'bg-earth-100'}`}>
                    {cat.icon || '📦'}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-earth-900 dark:text-white truncate">{cat.name}</h3>
                    <span className="text-[10px] text-earth-400 font-mono">ID #{cat.id}</span>
                  </div>
                </div>
                {/* Action buttons — always visible on mobile, hover on desktop */}
                <div className="flex gap-1.5 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => openEdit(cat)}
                    className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    title="Edit category">
                    <EditIcon />
                  </button>
                  <button onClick={() => setDeleteConfirm(cat)}
                    className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                    title="Delete category">
                    <TrashIcon />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-earth-500 dark:text-earth-400 leading-relaxed line-clamp-2 mb-3 min-h-[2.5rem]">
                {cat.description || <span className="italic text-earth-300 dark:text-earth-600">No description.</span>}
              </p>

              {/* Footer */}
              <div className={`pt-3 border-t text-[10px] text-earth-400 flex items-center justify-between ${dark ? 'border-earth-700' : 'border-earth-100'}`}>
                <span>
                  Created {new Date(cat.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {cat.updatedAt && (
                  <span className="text-leaf-500">Edited</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl overflow-hidden ${dark ? 'bg-earth-800 border border-earth-700' : 'bg-white shadow-2xl'}`}>

            {/* Modal header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${dark ? 'border-earth-700' : 'border-earth-100'}`}>
              <div>
                <h3 className="font-display font-bold text-lg text-earth-900 dark:text-white">
                  {modal === 'create' ? '🏷️ New Category' : `✏️ Edit: ${modal.name}`}
                </h3>
                <p className="text-xs text-earth-400 mt-0.5">
                  {modal === 'create'
                    ? 'This category will appear in product filters and dropdowns.'
                    : 'Renaming will update all products in this category automatically.'}
                </p>
              </div>
              <button onClick={() => setModal(null)}
                className="p-2 rounded-xl text-earth-400 hover:text-earth-600 hover:bg-earth-100 dark:hover:bg-earth-700 transition-all flex-shrink-0">
                <XIcon />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 flex flex-col gap-5">

              {/* Rename cascade notice (edit only) */}
              {modal !== 'create' && (
                <div className={`flex gap-3 px-4 py-3 rounded-xl text-xs border ${dark ? 'bg-blue-900/20 border-blue-800 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                  <span className="flex-shrink-0">ℹ️</span>
                  <span>Saving a new name will automatically re-tag all products currently assigned to <strong>"{modal.name}"</strong>.</span>
                </div>
              )}

              {/* Name field */}
              <div>
                <label className="block text-xs font-bold text-earth-500 dark:text-earth-400 mb-1.5">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => set('name')(e.target.value)}
                  placeholder="e.g. Organic Feed"
                  className={`input-field ${errors.name ? 'border-red-400 focus:border-red-500' : ''}`}
                  autoFocus
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Icon picker */}
              <div>
                <label className="block text-xs font-bold text-earth-500 dark:text-earth-400 mb-2">
                  Icon
                </label>
                {/* Quick-pick emoji grid */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {QUICK_ICONS.map(ic => (
                    <button key={ic} type="button" onClick={() => set('icon')(ic)}
                      className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all ${
                        form.icon === ic
                          ? 'ring-2 ring-leaf-500 bg-leaf-50 dark:bg-leaf-900/30 scale-110 shadow'
                          : dark ? 'bg-earth-700 hover:bg-earth-600' : 'bg-earth-100 hover:bg-earth-200'
                      }`}>
                      {ic}
                    </button>
                  ))}
                </div>
                {/* Custom emoji input */}
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${dark ? 'bg-earth-700' : 'bg-earth-100'}`}>
                    {form.icon || '📦'}
                  </div>
                  <input
                    type="text"
                    value={form.icon}
                    onChange={e => set('icon')(e.target.value)}
                    placeholder="Paste any emoji here"
                    className="input-field flex-1 text-sm"
                    maxLength={4}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-earth-500 dark:text-earth-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => set('description')(e.target.value)}
                  placeholder="Short description shown to customers on the products page..."
                  className="input-field resize-none"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className={`flex justify-end gap-3 px-6 py-4 border-t ${dark ? 'border-earth-700' : 'border-earth-100'}`}>
              <button onClick={() => setModal(null)} className="btn-outline py-2 px-5 text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="btn-primary py-2 px-6 flex items-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                {saving
                  ? <><Spinner size="sm" className="border-white/30 border-t-white" /> Saving...</>
                  : <><CheckIcon className="w-4 h-4" /> {modal === 'create' ? 'Create Category' : 'Save Changes'}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Dialog ───────────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-4">{deleteConfirm.icon || '🗑️'}</div>
            <h3 className="font-bold text-lg text-earth-900 dark:text-white mb-2">
              Delete "{deleteConfirm.name}"?
            </h3>
            <p className="text-sm text-earth-500 dark:text-earth-400 mb-6">
              All products in this category will be moved to{' '}
              <strong className="text-earth-700 dark:text-earth-300">"Uncategorized"</strong>.
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-outline py-2">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const dark       = useSelector(selectDark);
  const isAdmin    = useSelector(selectIsAdmin);
  const user       = useSelector(selectUser);
  const isSuperAdmin = user?.isSuperAdmin === true;

  const [products,      setProducts]      = useState([]);
  const [orders,        setOrders]        = useState([]);
  const [users,         setUsers]         = useState([]);
  const [admins,        setAdmins]        = useState([]);
  const [categories,    setCategories]    = useState([]);
  const [stats,         setStats]         = useState({});
  const [loading,       setLoading]       = useState(true);
  const [tab,           setTab]           = useState('products');
  const [productModal,  setProductModal]  = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { if (!isAdmin) navigate('/login', { replace: true }); }, [isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const calls = [getProducts({ limit: 100 }), getOrders(), getStats(), getAllUsers(), getCategoriesFull()];
      if (isSuperAdmin) calls.push(getAllAdmins());
      const [pRes, oRes, sRes, uRes, cRes, aRes] = await Promise.all(calls);
      setProducts(pRes.data.products);
      setOrders(oRes.data);
      setStats(sRes.data);
      setUsers(uRes.data.users);
      setCategories(cRes.data);
      if (aRes) setAdmins(aRes.data.admins);
    } catch { toast.error('Failed to load data.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isAdmin) fetchAll(); }, [isAdmin, isSuperAdmin]);

  const handleDeleteProduct = async (id) => {
    try { await deleteProduct(id); setProducts(prev => prev.filter(p => p.id !== id)); toast.success('Product deleted!'); }
    catch { toast.error('Failed to delete.'); }
    finally { setDeleteConfirm(null); }
  };

  const handleLogout = () => { dispatch(logout()); toast.success('Logged out! 👋'); navigate('/'); };

  if (!isAdmin) return null;
  if (loading)  return <PageLoader />;

  const TABS = [
    { id: 'products',   label: `📦 Products (${products.length})`    },
    { id: 'orders',     label: `🛒 Orders (${orders.length})`        },
    { id: 'users',      label: `👥 Users (${users.length})`          },
    { id: 'categories', label: `🏷️ Categories (${categories.length})` },
    { id: 'admins',     label: `🛡️ Admins (${admins.length + 1})`    },
  ];

  return (
    <main className={`min-h-screen page-bg`}>
      {/* Header */}
      <div className="border-b px-4 sm:px-6 py-4" style={{ backgroundColor: 'var(--bg-section)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl font-bold text-earth-900 dark:text-white">Admin Dashboard</h1>
              {isSuperAdmin && (
                <span className="badge bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400 text-[10px]">Super Admin</span>
              )}
            </div>
            <p className="text-xs text-earth-400 dark:text-earth-500">
              Signed in as <span className="text-gold-600 font-bold">{user?.name || user?.displayName || 'Administrator'}</span>
              <span className="text-earth-400"> &nbsp;·&nbsp; @{user?.username || 'admin'}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {tab === 'products' && (
              <button onClick={() => setProductModal({ type: 'add' })} className="btn-primary flex items-center gap-2 py-2 text-sm">
                <PlusIcon /> Add Product
              </button>
            )}
            <Link to="/" className={`text-sm font-medium px-4 py-2 rounded-xl transition-all ${dark ? 'bg-earth-700 text-earth-300 hover:bg-earth-600' : 'bg-earth-100 text-earth-600 hover:bg-earth-200'}`}>
              ← Site
            </Link>
            <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700 font-semibold transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="mb-8">
          <StatsGrid stats={stats} adminCount={admins.length} categoryCount={categories.length} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-5 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                tab === t.id
                  ? t.id === 'admins' ? 'bg-gold-500 text-white shadow' : t.id === 'categories' ? 'bg-blue-600 text-white shadow' : 'bg-leaf-600 text-white shadow'
                  : dark ? 'bg-earth-700 text-earth-300 hover:bg-earth-600' : 'bg-white text-earth-600 hover:bg-earth-50 border border-earth-200'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'products' && (
          <ProductsTab
            products={products}
            onEdit={p  => setProductModal({ type: 'edit', product: p })}
            onDelete={id => setDeleteConfirm(id)}
          />
        )}
        {tab === 'orders'     && <OrdersTab orders={orders} />}
        {tab === 'users'      && <UsersTab  users={users}   />}
        {tab === 'categories' && <CategoriesTab categories={categories} onRefresh={fetchAll} />}
        {tab === 'admins'     && (
          <AdminsTab admins={admins} isSuperAdmin={isSuperAdmin} onRefresh={fetchAll} />
        )}
      </div>

      {/* Product Modal */}
      {productModal && (
        <ProductModal
          product={productModal.product}
          categoryNames={categories.map(c => c.name)}
          onClose={() => setProductModal(null)}
          onSave={() => fetchAll()}
        />
      )}

      {/* Product Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="card p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-bold text-lg text-earth-900 dark:text-white mb-2">Delete Product?</h3>
            <p className="text-sm text-earth-500 dark:text-earth-400 mb-6">This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-outline py-2">Cancel</button>
              <button onClick={() => handleDeleteProduct(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-xl">Delete</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
