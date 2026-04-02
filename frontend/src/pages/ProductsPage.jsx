import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectDark } from '../store/themeSlice';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { ProductGridSkeleton } from '../components/Loaders';
import { FilterIcon, GridIcon, ListIcon, ChevronDownIcon } from '../components/Icons';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
  const dark = useSelector(selectDark);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, sort };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const res = await getProducts(params);
      setProducts(res.data.products);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, category, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  useEffect(() => {
    getCategories().then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category !== 'All') params.category = category;
    setSearchParams(params, { replace: true });
    setPage(1);
  }, [search, category]);

  return (
    <main className={`min-h-screen page-bg`}>
      {/* Page Header */}
      <div className="border-b" style={{ backgroundColor: 'var(--bg-section)', borderColor: 'var(--border-default)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="section-title text-2xl md:text-3xl">All Products</h1>
              <p className="text-earth-500 dark:text-earth-400 text-sm mt-1">
                {loading ? 'Loading...' : `${total} products found`}
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Sort */}
              <div className="relative">
                <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
                  className={`input-field pr-8 py-2 text-sm appearance-none cursor-pointer min-w-[160px] ${dark ? 'bg-earth-700' : ''}`}>
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 text-earth-400 pointer-events-none w-4 h-4" />
              </div>

              {/* View toggle */}
              <div className={`flex rounded-xl border ${dark ? 'border-earth-600 bg-earth-700' : 'border-earth-200 bg-white'} p-0.5`}>
                <button onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-leaf-600 text-white shadow' : dark ? 'text-earth-400 hover:text-white' : 'text-earth-400 hover:text-earth-700'}`}>
                  <GridIcon className="w-4 h-4" />
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-leaf-600 text-white shadow' : dark ? 'text-earth-400 hover:text-white' : 'text-earth-400 hover:text-earth-700'}`}>
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile filter toggle */}
              <button onClick={() => setShowFilters(!showFilters)}
                className={`sm:hidden flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium ${dark ? 'border-earth-600 text-earth-300 bg-earth-700' : 'border-earth-200 text-earth-600 bg-white'}`}>
                <FilterIcon className="w-4 h-4" /> Filters
              </button>
            </div>
          </div>

          {/* Search */}
          <SearchBar value={search} onChange={setSearch} className="max-w-md mb-4" />

          {/* Category Filters */}
          <div className={`${showFilters || 'hidden sm:block'}`}>
            <CategoryFilter categories={categories} active={category} onChange={(c) => { setCategory(c); setPage(1); }} />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <ProductGridSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🐄</div>
            <h3 className="text-xl font-bold text-earth-800 dark:text-white mb-2">No products found</h3>
            <p className="text-earth-500 dark:text-earth-400 mb-6">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }}
              className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'flex flex-col gap-4'}>
              {products.map(p => <ProductCard key={p.id} product={p} viewMode={viewMode} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${page === 1 ? 'opacity-40 cursor-not-allowed' : 'btn-outline'}`}>
                  ← Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                  .reduce((acc, n, i, arr) => {
                    if (i > 0 && n - arr[i - 1] > 1) acc.push('...');
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) => n === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-3 py-2 text-earth-400">…</span>
                  ) : (
                    <button key={n} onClick={() => setPage(n)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${n === page ? 'bg-leaf-600 text-white shadow' : dark ? 'bg-earth-700 text-earth-300 hover:bg-earth-600' : 'bg-white text-earth-600 hover:bg-earth-100 border border-earth-200'}`}>
                      {n}
                    </button>
                  ))
                }

                <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${page === totalPages ? 'opacity-40 cursor-not-allowed' : 'btn-outline'}`}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
