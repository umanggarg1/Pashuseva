import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, selectCart } from '../store/cartSlice';
import { StarIcon, CartIcon, HeartIcon } from './Icons';

const StarRating = ({ rating, size = 'sm' }) => {
  const cls = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5 text-gold-400">
      {[1,2,3,4,5].map(i => <StarIcon key={i} className={cls} filled={i <= Math.round(rating)} />)}
    </div>
  );
};

const StockBadge = ({ stock }) => {
  if (stock === 0) return <span className="badge bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Out of Stock</span>;
  if (stock < 20) return <span className="badge bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400">Only {stock} left</span>;
  return <span className="badge bg-leaf-100 text-leaf-700 dark:bg-leaf-900/30 dark:text-leaf-400">In Stock</span>;
};

export default function ProductCard({ product, viewMode = 'grid' }) {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const [liked, setLiked] = useState(false);
  const [adding, setAdding] = useState(false);
  const inCart = cart.find(i => i.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock === 0) return;
    setAdding(true);
    dispatch(addToCart(product));
    setTimeout(() => setAdding(false), 800);
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/products/${product.id}`} className="card flex items-center gap-4 p-4 group">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=300&q=80'; }} />
          {product.badge && <span className="absolute top-1 left-1 badge bg-gold-500 text-white text-[10px]">{product.badge}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-leaf-600 font-semibold mb-0.5">{product.category}</div>
          <h3 className="font-bold text-earth-900 dark:text-white text-sm mb-1 truncate">{product.name}</h3>
          <p className="text-xs text-earth-500 dark:text-earth-400 line-clamp-2 mb-2">{product.description}</p>
          <div className="flex items-center gap-3">
            <StarRating rating={product.rating} />
            <span className="text-xs text-earth-400">({product.reviews})</span>
            <StockBadge stock={product.stock} />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="font-display font-bold text-xl text-gold-600 dark:text-gold-400">₹{product.price}</div>
          <button onClick={handleAddToCart} disabled={product.stock === 0}
            className={`btn-primary text-xs px-4 py-2 ${inCart ? 'bg-leaf-700' : ''} disabled:opacity-50 disabled:cursor-not-allowed`}>
            {adding ? '✓ Added!' : inCart ? '✓ In Cart' : 'Add to Cart'}
          </button>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/products/${product.id}`} className="card group overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img src={product.image} alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Overlay badges */}
        {product.badge && (
          <span className="absolute top-3 left-3 badge bg-gold-500 text-white shadow-lg">{product.badge}</span>
        )}
        <button onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${liked ? 'bg-red-500 text-white' : 'bg-white/80 text-earth-500 hover:bg-white'}`}>
          <HeartIcon className="w-3.5 h-3.5" filled={liked} />
        </button>

        {/* Stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs text-leaf-600 dark:text-leaf-400 font-semibold mb-1 uppercase tracking-wide">{product.category}</div>
        <h3 className="font-bold text-earth-900 dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-leaf-600 dark:group-hover:text-leaf-400 transition-colors">{product.name}</h3>
        <p className="text-xs text-earth-500 dark:text-earth-400 line-clamp-2 mb-3 flex-1">{product.description}</p>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} />
          <span className="text-xs text-earth-400">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-lg font-display font-bold text-gold-600 dark:text-gold-400">₹{product.price}</div>
            <StockBadge stock={product.stock} />
          </div>
          <button onClick={handleAddToCart} disabled={product.stock === 0}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
              adding ? 'bg-leaf-700 text-white scale-95' :
              inCart ? 'bg-leaf-600 text-white' :
              'bg-leaf-600 hover:bg-leaf-700 text-white hover:shadow-md hover:-translate-y-0.5'
            } disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none`}>
            <CartIcon className="w-3.5 h-3.5" />
            {adding ? 'Added!' : inCart ? 'In Cart' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
