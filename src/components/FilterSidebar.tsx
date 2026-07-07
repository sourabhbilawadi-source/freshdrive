import React from 'react';
import { useStore } from '@nanostores/react';
import { $filters, toggleCategory, toggleLocation, toggleBondPeriod, setCtcRange } from '../stores/filterStore';
import { Briefcase, MapPin, IndianRupee, FileSignature, RotateCcw } from 'lucide-react';

export default function FilterSidebar() {
  const { categories, locations, ctcMin, bondPeriods } = useStore($filters);

  const resetFilters = () => {
    $filters.set({
      categories: [],
      locations: [],
      ctcMin: 0,
      ctcMax: 20,
      bondPeriods: [],
      searchQuery: $filters.get().searchQuery,
      sortOrder: $filters.get().sortOrder,
    });
  };

  return (
    <div className="bg-cream border-brutal p-6 rounded-2xl shadow-brutal flex flex-col gap-6 sticky top-6">
      <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
        <h3 className="font-display text-xl font-bold text-ink">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-xs font-mono font-bold flex items-center gap-1 hover:text-coral transition-colors px-2..py-1 border-brutal bg-white rounded-lg shadow-button hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-button-hover active:translate-x-[2px] active:translate-y-[2px] cursor-pointer"
        >
          <RotateCcw className="w-3 h-3 text-ink" /> Reset
        </button>
      </div>

      {/* Category Checkboxes */}
      <div className="flex flex-col gap-3">
        <h4 className="font-sans text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-slate" /> Category
        </h4>
        <div className="flex flex-col gap-2.5 font-sans text-sm font-semibold">
          {[
            { id: 'it_services', label: 'IT Services' },
            { id: 'product', label: 'Product / MNC' },
            { id: 'govt', label: 'Govt / PSU' },
            { id: 'other', label: 'Other' },
          ].map((cat) => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={categories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-brutal rounded flex items-center justify-center transition-all ${
                categories.includes(cat.id) ? 'bg-lime' : 'bg-white'
              }`}>
                {categories.includes(cat.id) && (
                  <div className="w-2.5 h-2.5 bg-ink rounded-sm" />
                )}
              </div>
              <span className="text-ink group-hover:text-coral transition-colors">{cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Checkboxes */}
      <div className="flex flex-col gap-3">
        <h4 className="font-sans text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-slate" /> Location
        </h4>
        <div className="flex flex-col gap-2.5 font-sans text-sm font-semibold">
          {[
            { id: 'Bengaluru', label: 'Bengaluru' },
            { id: 'Hyderabad', label: 'Hyderabad' },
            { id: 'Pune', label: 'Pune' },
            { id: 'Mumbai', label: 'Mumbai' },
            { id: 'Delhi NCR', label: 'Delhi NCR' },
            { id: 'Chennai', label: 'Chennai' },
            { id: 'Kolkata', label: 'Kolkata' },
            { id: 'Pan India', label: 'Pan India / Remote' },
          ].map((loc) => (
            <label key={loc.id} className="flex items-center gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={locations.includes(loc.id)}
                onChange={() => toggleLocation(loc.id)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-brutal rounded flex items-center justify-center transition-all ${
                locations.includes(loc.id) ? 'bg-lime' : 'bg-white'
              }`}>
                {locations.includes(loc.id) && (
                  <div className="w-2.5 h-2.5 bg-ink rounded-sm" />
                )}
              </div>
              <span className="text-ink group-hover:text-coral transition-colors">{loc.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* CTC Range Radio Buttons */}
      <div className="flex flex-col gap-3">
        <h4 className="font-sans text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-1.5">
          <IndianRupee className="w-4 h-4 text-slate" /> Min CTC
        </h4>
        <div className="flex flex-col gap-2.5 font-sans text-sm font-semibold">
          {[
            { min: 0, label: 'All CTC' },
            { min: 3, label: '3+ LPA' },
            { min: 6, label: '6+ LPA' },
            { min: 10, label: '10+ LPA' },
          ].map((range) => (
            <label key={range.min} className="flex items-center gap-3 cursor-pointer group select-none">
              <input
                type="radio"
                name="ctcRange"
                checked={ctcMin === range.min}
                onChange={() => setCtcRange(range.min, 20)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-brutal rounded-full flex items-center justify-center transition-all ${
                ctcMin === range.min ? 'bg-coral' : 'bg-white'
              }`}>
                {ctcMin === range.min && (
                  <div className="w-2.5 h-2.5 bg-white rounded-full" />
                )}
              </div>
              <span className="text-ink group-hover:text-coral transition-colors">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bond Period Checkboxes */}
      <div className="flex flex-col gap-3">
        <h4 className="font-sans text-xs font-bold text-slate uppercase tracking-wider flex items-center gap-1.5">
          <FileSignature className="w-4 h-4 text-slate" /> Bond Period
        </h4>
        <div className="flex flex-col gap-2.5 font-sans text-sm font-semibold">
          {[
            { id: 'None', label: 'No Bond' },
            { id: '1 Year', label: '1 Year Bond' },
            { id: '2 Years', label: '2 Years Bond' },
          ].map((bond) => (
            <label key={bond.id} className="flex items-center gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={bondPeriods.includes(bond.id)}
                onChange={() => toggleBondPeriod(bond.id)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-brutal rounded flex items-center justify-center transition-all ${
                bondPeriods.includes(bond.id) ? 'bg-lime' : 'bg-white'
              }`}>
                {bondPeriods.includes(bond.id) && (
                  <div className="w-2.5 h-2.5 bg-ink rounded-sm" />
                )}
              </div>
              <span className="text-ink group-hover:text-coral transition-colors">{bond.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
