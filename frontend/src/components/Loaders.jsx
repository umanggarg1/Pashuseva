export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`animate-spin rounded-full border-2 border-earth-200 border-t-leaf-600 ${sizes[size]} ${className}`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-14 h-14 bg-gradient-to-br from-leaf-500 to-gold-500 rounded-2xl flex items-center justify-center animate-pulse-soft">
        <span className="text-2xl">🐄</span>
      </div>
      <div className="text-earth-500 dark:text-earth-400 text-sm font-medium">Loading...</div>
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-48 bg-earth-200 dark:bg-earth-700" />
      <div className="p-4">
        <div className="h-3 bg-earth-200 dark:bg-earth-700 rounded mb-2 w-1/3" />
        <div className="h-4 bg-earth-200 dark:bg-earth-700 rounded mb-1" />
        <div className="h-4 bg-earth-200 dark:bg-earth-700 rounded mb-3 w-4/5" />
        <div className="h-3 bg-earth-200 dark:bg-earth-700 rounded mb-4 w-2/3" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-earth-200 dark:bg-earth-700 rounded w-16" />
          <div className="h-8 bg-earth-200 dark:bg-earth-700 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => <ProductSkeleton key={i} />)}
    </div>
  );
}
