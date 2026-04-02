import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectCart, selectCartTotal, removeFromCart, updateQty, clearCart } from '../store/cartSlice';
import { selectDark } from '../store/themeSlice';
import { createOrder } from '../utils/api';
import { toast } from '../components/Toast';
import { TrashIcon, ArrowLeftIcon, CartIcon, CheckIcon } from '../components/Icons';

function CartItem({ item }) {
  const dispatch = useDispatch();
  const dark = useSelector(selectDark);

  return (
    <div className={`card flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4`}>
      <img src={item.image} alt={item.name}
        className="w-full sm:w-20 h-40 sm:h-20 rounded-xl object-cover flex-shrink-0"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=80'; }} />

      <div className="flex-1 min-w-0">
        <div className="text-xs text-leaf-600 font-semibold">{item.category}</div>
        <h3 className="font-bold text-earth-900 dark:text-white text-sm mt-0.5 truncate">{item.name}</h3>
        <div className="text-xs text-earth-500 dark:text-earth-400 mt-1">Unit price: ₹{item.price}</div>
      </div>

      {/* Qty controls */}
      <div className={`flex items-center rounded-xl border overflow-hidden flex-shrink-0 ${dark ? 'border-earth-600' : 'border-earth-200'}`}>
        <button onClick={() => item.qty > 1 ? dispatch(updateQty({ id: item.id, qty: item.qty - 1 })) : dispatch(removeFromCart(item.id))}
          className={`px-3 py-2 font-bold transition-colors ${dark ? 'bg-earth-700 text-white hover:bg-earth-600' : 'bg-earth-50 hover:bg-earth-100 text-earth-700'}`}>−</button>
        <span className={`px-4 py-2 font-bold min-w-[2.5rem] text-center text-sm ${dark ? 'text-white' : 'text-earth-900'}`}>{item.qty}</span>
        <button onClick={() => dispatch(updateQty({ id: item.id, qty: item.qty + 1 }))}
          className={`px-3 py-2 font-bold transition-colors ${dark ? 'bg-earth-700 text-white hover:bg-earth-600' : 'bg-earth-50 hover:bg-earth-100 text-earth-700'}`}>+</button>
      </div>

      {/* Subtotal */}
      <div className="text-right flex-shrink-0">
        <div className="font-display font-bold text-lg text-gold-600 dark:text-gold-400">₹{item.price * item.qty}</div>
        <button onClick={() => dispatch(removeFromCart(item.id))}
          className="text-red-400 hover:text-red-600 mt-1 transition-colors p-1">
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function OrderForm({ cart, total, onSuccess }) {
  const dark = useSelector(selectDark);
  const [form, setForm] = useState({ customerName: '', customerPhone: '', customerAddress: '' });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.customerName || !form.customerPhone || !form.customerAddress) {
      toast.error('Please fill all delivery details.'); return;
    }
    setLoading(true);
    try {
      const items = cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty }));
      const res = await createOrder({ ...form, items, total });
      onSuccess(res.data.id);
      toast.success('Order placed successfully! 🙏');
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className={`card p-6`}>
      <h3 className="font-display font-bold text-lg text-earth-900 dark:text-white mb-5">Delivery Details</h3>
      <div className="flex flex-col gap-4 mb-6">
        {[
          { key: 'customerName', label: 'Full Name *', type: 'text', placeholder: 'Ramesh Yadav' },
          { key: 'customerPhone', label: 'Phone Number *', type: 'tel', placeholder: '+91 98765 43210' },
          { key: 'customerAddress', label: 'Delivery Address *', type: 'textarea', placeholder: 'Village, Tehsil, District, State - Pincode' },
        ].map(({ key, label, type, placeholder }) => (
          <div key={key}>
            <label className="text-xs font-bold text-earth-500 dark:text-earth-400 mb-1 block">{label}</label>
            {type === 'textarea' ? (
              <textarea rows={3} placeholder={placeholder} value={form[key]} onChange={e => set(key, e.target.value)}
                className="input-field resize-none" />
            ) : (
              <input type={type} placeholder={placeholder} value={form[key]} onChange={e => set(key, e.target.value)}
                className="input-field" />
            )}
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={loading}
        className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? (
          <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
        ) : (
          <><CheckIcon className="w-5 h-5" /> Place Order (₹{total.toLocaleString()})</>
        )}
      </button>
    </div>
  );
}

function OrderSuccess({ orderId, onContinue }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-leaf-100 dark:bg-leaf-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckIcon className="w-12 h-12 text-leaf-600" />
        </div>
        <h2 className="font-display text-3xl font-bold text-earth-900 dark:text-white mb-3">Order Placed! 🙏</h2>
        <p className="text-earth-500 dark:text-earth-400 mb-2">Thank you for trusting PashuSeva.</p>
        <p className="text-sm text-earth-400 dark:text-earth-500 mb-8 font-mono bg-earth-100 dark:bg-earth-800 px-4 py-2 rounded-lg">
          Order ID: {orderId}
        </p>
        <p className="text-earth-600 dark:text-earth-300 text-sm mb-8">
          Your order will be delivered within 24-48 hours. Our team will call you to confirm.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={onContinue} className="btn-primary px-8">Continue Shopping</button>
          <Link to="/" className="btn-outline px-8">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const dispatch = useDispatch();
  const dark = useSelector(selectDark);
  const cart = useSelector(selectCart);
  const total = useSelector(selectCartTotal);
  const [orderId, setOrderId] = useState(null);

  const handleOrderSuccess = (id) => {
    setOrderId(id);
    dispatch(clearCart());
  };

  if (orderId) return <OrderSuccess orderId={orderId} onContinue={() => setOrderId(null)} />;

  if (cart.length === 0) return (
    <div className={`min-h-screen page-bg flex items-center justify-center px-4`}>
      <div className="text-center">
        <CartIcon className="w-20 h-20 text-earth-300 dark:text-earth-600 mx-auto mb-6" />
        <h2 className="font-display text-2xl font-bold text-earth-900 dark:text-white mb-3">Your cart is empty</h2>
        <p className="text-earth-500 dark:text-earth-400 mb-8">Add products to feed your beloved gau mata!</p>
        <Link to="/products" className="btn-secondary">Shop Now</Link>
      </div>
    </div>
  );

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <main className={`min-h-screen page-bg py-8 px-4 sm:px-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/products" className={`p-2 rounded-xl transition-all ${dark ? 'bg-earth-800 text-earth-300 hover:bg-earth-700' : 'bg-white text-earth-600 hover:bg-earth-50 shadow'}`}>
            <ArrowLeftIcon />
          </Link>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-earth-900 dark:text-white">Shopping Cart</h1>
            <p className="text-earth-500 dark:text-earth-400 text-sm">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-earth-900 dark:text-white">Items</h2>
              <button onClick={() => dispatch(clearCart())}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors flex items-center gap-1">
                <TrashIcon /> Clear All
              </button>
            </div>
            {cart.map(item => <CartItem key={item.id} item={item} />)}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Summary */}
            <div className={`card p-6`}>
              <h3 className="font-display font-bold text-lg text-earth-900 dark:text-white mb-5">Order Summary</h3>
              <div className="flex flex-col gap-3 mb-5">
                <div className={`flex justify-between text-sm ${dark ? 'text-earth-300' : 'text-earth-600'}`}>
                  <span>Products ({cart.length} types)</span>
                  <span className="font-semibold">₹{total.toLocaleString()}</span>
                </div>
                <div className={`flex justify-between text-sm ${dark ? 'text-earth-300' : 'text-earth-600'}`}>
                  <span>Total Units</span>
                  <span className="font-semibold">{totalItems}</span>
                </div>
                <div className={`flex justify-between text-sm ${dark ? 'text-earth-300' : 'text-earth-600'}`}>
                  <span>Delivery</span>
                  <span className="font-semibold text-leaf-600">FREE</span>
                </div>
                <div className={`h-px ${dark ? 'bg-earth-700' : 'bg-earth-100'}`} />
                <div className="flex justify-between">
                  <span className="font-bold text-earth-900 dark:text-white">Total Amount</span>
                  <span className="font-display font-bold text-xl text-gold-600 dark:text-gold-400">₹{total.toLocaleString()}</span>
                </div>
              </div>
              <div className={`text-xs text-center text-earth-400 flex items-center justify-center gap-1`}>
                <CheckIcon className="w-3 h-3 text-leaf-500" />
                Free delivery on all orders
              </div>
            </div>

            {/* Order form */}
            <OrderForm cart={cart} total={total} onSuccess={handleOrderSuccess} />
          </div>
        </div>
      </div>
    </main>
  );
}
