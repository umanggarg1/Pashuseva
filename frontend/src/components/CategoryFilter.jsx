export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
            active === cat
              ? 'bg-leaf-600 text-white shadow-md shadow-leaf-600/30'
              : 'bg-earth-100 dark:bg-earth-700 text-earth-600 dark:text-earth-300 hover:bg-earth-200 dark:hover:bg-earth-600'
          }`}>
          {cat}
        </button>
      ))}
    </div>
  );
}
