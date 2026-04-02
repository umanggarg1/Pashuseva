import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, XIcon } from './Icons';

export default function SearchBar({ value, onChange, onSearch, placeholder = 'Search products...', className = '' }) {
  const inputRef = useRef(null);

  const handleKey = (e) => {
    if (e.key === 'Enter' && onSearch) onSearch(value);
    if (e.key === 'Escape') { onChange(''); inputRef.current?.blur(); }
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="absolute left-3.5 text-earth-400 pointer-events-none">
        <SearchIcon className="w-4 h-4" />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder}
        className="input-field pl-10 pr-10"
      />
      {value && (
        <button onClick={() => { onChange(''); inputRef.current?.focus(); }}
          className="absolute right-3 text-earth-400 hover:text-earth-600 transition-colors">
          <XIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
