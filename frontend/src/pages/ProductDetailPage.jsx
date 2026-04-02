import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCart } from '../store/cartSlice';
import { selectDark } from '../store/themeSlice';
import { getProduct } from '../utils/api';
import { toast } from '../components/Toast';
import { PageLoader } from '../components/Loaders';
import { CartIcon, StarIcon, CheckIcon, ArrowLeftIcon, ShieldIcon, TruckIcon, AwardIcon, HeartIcon } from '../components/Icons';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const dark = useSelector(selectDark);
  const cart = useSelector(selectCart);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  const inCart = cart.find(i => i.id === product?.id);

  useEffect(() => {
    setLoading(true);
    getProduct(id)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  if (loading) return <PageLoader />;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <div className="text-6xl">😢</div>
      <h2 className="text-xl font-bold text-earth-800 dark:text-white">Product not found</h2>
      <Link to="/products" className="btn-primary">Back to Products</Link>
    </div>
  );

  const stockStatus = product.stock === 0 ? { label: 'Out of Stock', cls: 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200' }
    : product.stock < 20 ? { label: `Only ${product.stock} left`, cls: 'text-gold-600 bg-gold-50 dark:bg-gold-900/20 border-gold-200' }
    : { label: 'In Stock', cls: 'text-leaf-600 bg-leaf-50 dark:bg-leaf-900/20 border-leaf-200' };

  return (
    <main className={`min-h-screen page-bg py-8 px-4 sm:px-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-earth-500 dark:text-earth-400 mb-8">
          <Link to="/" className="hover:text-leaf-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-leaf-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-earth-900 dark:text-white font-medium truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div>
            <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl mb-4 group">
              <img src={product.image} alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80'; }} />
              {product.badge && (
                <span className="absolute top-4 left-4 badge bg-gold-500 text-white text-sm px-3 py-1 shadow-lg">{product.badge}</span>
              )}
              <button onClick={() => setLiked(!liked)}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all shadow-lg ${liked ? 'bg-red-500 text-white' : 'bg-white/80 text-earth-400 hover:bg-white'}`}>
                <HeartIcon className="w-5 h-5" filled={liked} />
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="text-sm text-leaf-600 font-semibold uppercase tracking-widest mb-2">{product.category}</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-earth-900 dark:text-white mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex text-gold-400">
                {[1,2,3,4,5].map(i => <StarIcon key={i} className="w-5 h-5" filled={i <= Math.round(product.rating)} />)}
              </div>
              <span className="text-earth-600 dark:text-earth-300 font-semibold">{product.rating}</span>
              <span className="text-earth-400 text-sm">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="font-display text-4xl font-bold text-gold-600 dark:text-gold-400 mb-4">
              ₹{product.price}
            </div>

            {/* Stock */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold mb-6 self-start ${stockStatus.cls}`}>
              <CheckIcon className="w-4 h-4" />
              {stockStatus.label}
            </div>

            {/* Description */}
            <p className="text-earth-600 dark:text-earth-300 leading-relaxed mb-8">{product.description}</p>

            {/* Qty + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex items-center rounded-xl border ${dark ? 'border-earth-600' : 'border-earth-200'} overflow-hidden`}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className={`px-4 py-3 text-lg font-bold transition-colors ${dark ? 'bg-earth-700 text-white hover:bg-earth-600' : 'bg-earth-50 text-earth-700 hover:bg-earth-100'}`}>−</button>
                  <span className={`px-5 py-3 font-bold min-w-[3rem] text-center ${dark ? 'text-white' : 'text-earth-900'}`}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    className={`px-4 py-3 text-lg font-bold transition-colors ${dark ? 'bg-earth-700 text-white hover:bg-earth-600' : 'bg-earth-50 text-earth-700 hover:bg-earth-100'}`}>+</button>
                </div>
                <button onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-base transition-all ${inCart ? 'bg-leaf-700 text-white' : 'btn-primary'}`}>
                  <CartIcon className="w-5 h-5" />
                  {inCart ? 'Add More to Cart' : 'Add to Cart'}
                </button>
              </div>
            )}

            {/* Guarantees */}
            <div className={`rounded-2xl p-5 ${dark ? 'bg-earth-800 border-earth-700' : 'bg-leaf-50 border-leaf-100'} border`}>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: <ShieldIcon className="w-6 h-6" />, label: 'Authentic' },
                  { icon: <TruckIcon className="w-6 h-6" />, label: 'Fast Delivery' },
                  { icon: <AwardIcon className="w-6 h-6" />, label: 'Certified' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2">
                    <div className="text-leaf-600">{icon}</div>
                    <span className="text-xs font-semibold text-earth-600 dark:text-earth-300">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Back button */}
            <Link to="/products" className="flex items-center gap-2 text-earth-500 hover:text-leaf-600 text-sm font-medium mt-6 transition-colors self-start">
              <ArrowLeftIcon className="w-4 h-4" /> Back to Products
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
