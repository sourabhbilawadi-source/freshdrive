import React from 'react';
import { useStore } from '@nanostores/react';
import { $filters, setSortOrder } from '../stores/filterStore';
import { ArrowUpDown } from 'lucide-react';

export default function SortDropdown() {
  const { sortOrder } = useStore($filters);

  return (
    <div className="flex items-center gap-2">
      <span className="font-sans text-sm font-semibold text-slate flex items-center gap-1 whitespace-nowrap">
        <ArrowUpDown className="w-4 h-4 text-ink" /> Sort by
      </span>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as any)}
        className="px-3 py-2 bg-white font-sans border-brutal text-ink rounded-xl shadow-button cursor-pointer hover:bg-cream/40 transition-all text-sm font-semibold"
        aria-label="Sort listings"
      >
        <option value="newest">Newest</option>
        <option value="deadline">Deadline soon</option>
        <option value="ctc">CTC (High-Low)</option>
      </select>
    </div>
  );
}
