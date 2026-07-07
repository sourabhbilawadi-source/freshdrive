import React from 'react';
import { useStore } from '@nanostores/react';
import { $filters, setSearchQuery } from '../stores/filterStore';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const { searchQuery } = useStore($filters);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-ink" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search jobs by title or company..."
        className="w-full pl-12 pr-4 py-3 bg-white font-sans border-brutal text-ink rounded-xl shadow-button focus:shadow-button-hover transition-all placeholder:text-slate/60 text-base"
        aria-label="Search jobs"
      />
    </div>
  );
}
