import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { $filters, toggleCategory, toggleLocation, toggleBondPeriod, setCtcRange } from '../stores/filterStore';
import { Briefcase, MapPin, IndianRupee, FileSignature, RotateCcw, ChevronDown } from 'lucide-react';

export default function FilterBar() {
  const { categories, locations, ctcMin, bondPeriods } = useStore($filters);
  const [openDropdown, setOpenDropdown] = useState<'category' | 'location' | 'ctc' | 'bond' | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState<React.CSSProperties>({});
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const categoryBtnRef = useRef<HTMLButtonElement>(null);
  const locationBtnRef = useRef<HTMLButtonElement>(null);
  const ctcBtnRef = useRef<HTMLButtonElement>(null);
  const bondBtnRef = useRef<HTMLButtonElement>(null);

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
    setOpenDropdown(null);
  };

  // Close dropdown on outside click, escape key, window resize, or scroll
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        // Also ensure we are not clicking the dropdown panel itself (rendered via portal/fixed body placement)
        const activePanel = document.getElementById('filter-dropdown-panel');
        if (activePanel && activePanel.contains(event.target as Node)) {
          return;
        }
        setOpenDropdown(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
      }
    };

    const handleScrollOrResize = () => {
      setOpenDropdown(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, { passive: true });

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScrollOrResize, { passive: true });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize);
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScrollOrResize);
      }
    };
  }, []);

  const handleToggleDropdown = (
    type: 'category' | 'location' | 'ctc' | 'bond', 
    btnRef: React.RefObject<HTMLButtonElement | null>
  ) => {
    if (openDropdown === type) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(type);
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        const dropdownWidth = type === 'location' ? 240 : 220;
        
        let left = rect.left;
        
        // Right edge alignment: ensure popover does not render off-screen
        if (left + dropdownWidth > window.innerWidth) {
          left = window.innerWidth - dropdownWidth - 16;
        }
        
        // Left edge alignment: ensure popover is not pushed off-screen left
        if (left < 16) {
          left = 16;
        }

        setDropdownCoords({
          position: 'fixed',
          top: `${rect.bottom + 8}px`,
          left: `${left}px`,
          minWidth: `${dropdownWidth}px`,
          zIndex: 50,
        });
      }
    }
  };

  return (
    <div ref={containerRef} className="w-full bg-cream border-brutal p-4 rounded-2xl shadow-brutal relative overflow-hidden">
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto scrollbar-none w-full py-1 snap-x pr-8"
      >
        {/* Category Filter */}
        <div className="snap-start shrink-0">
          <button
            ref={categoryBtnRef}
            onClick={() => handleToggleDropdown('category', categoryBtnRef)}
            className={`btn-brutal px-4 py-2 rounded-full font-sans font-bold text-sm flex items-center gap-2 cursor-pointer transition-all ${
              categories.length > 0 || openDropdown === 'category' ? 'bg-lime text-ink' : 'bg-white text-ink'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Category</span>
            {categories.length > 0 && (
              <span className="bg-coral text-white text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full border border-ink">
                {categories.length}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Location Filter */}
        <div className="snap-start shrink-0">
          <button
            ref={locationBtnRef}
            onClick={() => handleToggleDropdown('location', locationBtnRef)}
            className={`btn-brutal px-4 py-2 rounded-full font-sans font-bold text-sm flex items-center gap-2 cursor-pointer transition-all ${
              locations.length > 0 || openDropdown === 'location' ? 'bg-lime text-ink' : 'bg-white text-ink'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Location</span>
            {locations.length > 0 && (
              <span className="bg-coral text-white text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full border border-ink">
                {locations.length}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* CTC Filter */}
        <div className="snap-start shrink-0">
          <button
            ref={ctcBtnRef}
            onClick={() => handleToggleDropdown('ctc', ctcBtnRef)}
            className={`btn-brutal px-4 py-2 rounded-full font-sans font-bold text-sm flex items-center gap-2 cursor-pointer transition-all ${
              ctcMin > 0 || openDropdown === 'ctc' ? 'bg-lime text-ink' : 'bg-white text-ink'
            }`}
          >
            <IndianRupee className="w-4 h-4" />
            <span>Min CTC</span>
            {ctcMin > 0 && (
              <span className="bg-coral text-white text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full border border-ink">
                {ctcMin}L+
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'ctc' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Bond Period Filter */}
        <div className="snap-start shrink-0">
          <button
            ref={bondBtnRef}
            onClick={() => handleToggleDropdown('bond', bondBtnRef)}
            className={`btn-brutal px-4 py-2 rounded-full font-sans font-bold text-sm flex items-center gap-2 cursor-pointer transition-all ${
              bondPeriods.length > 0 || openDropdown === 'bond' ? 'bg-lime text-ink' : 'bg-white text-ink'
            }`}
          >
            <FileSignature className="w-4 h-4" />
            <span>Bond Period</span>
            {bondPeriods.length > 0 && (
              <span className="bg-coral text-white text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full border border-ink">
                {bondPeriods.length}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openDropdown === 'bond' ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Reset button */}
        <div className="snap-start shrink-0">
          <button
            onClick={resetFilters}
            className="btn-brutal bg-white text-ink hover:text-coral px-4 py-2 rounded-full font-sans font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-button hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-button-hover active:translate-x-[2px] active:translate-y-[2px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Right side fade indicator for scrolling on mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-cream via-cream/80 to-transparent pointer-events-none rounded-r-2xl md:hidden z-10" />

      {/* Dropdown Popover Panel (fixed positioning avoids scrolling container overflow clips) */}
      {openDropdown && (
        <div 
          id="filter-dropdown-panel"
          style={dropdownCoords}
          className="bg-white border-brutal p-5 rounded-xl shadow-brutal flex flex-col gap-3"
        >
          {openDropdown === 'category' && (
            <>
              <h4 className="font-sans text-xs font-bold text-slate uppercase tracking-wider">Filter Category</h4>
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
            </>
          )}

          {openDropdown === 'location' && (
            <>
              <h4 className="font-sans text-xs font-bold text-slate uppercase tracking-wider">Filter Location</h4>
              <div className="flex flex-col gap-2.5 font-sans text-sm font-semibold max-h-[180px] overflow-y-auto pr-1">
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
            </>
          )}

          {openDropdown === 'ctc' && (
            <>
              <h4 className="font-sans text-xs font-bold text-slate uppercase tracking-wider">Min CTC</h4>
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
            </>
          )}

          {openDropdown === 'bond' && (
            <>
              <h4 className="font-sans text-xs font-bold text-slate uppercase tracking-wider">Bond Period</h4>
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
