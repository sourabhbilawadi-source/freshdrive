import { map } from 'nanostores';

export interface FilterState {
  categories: string[];
  locations: string[];
  ctcMin: number;
  ctcMax: number;
  bondPeriods: string[];
  searchQuery: string;
  sortOrder: 'newest' | 'deadline' | 'ctc';
}

export const $filters = map<FilterState>({
  categories: [],
  locations: [],
  ctcMin: 0,
  ctcMax: 20, // 20+ LPA covers the range
  bondPeriods: [],
  searchQuery: '',
  sortOrder: 'newest',
});

// Helper functions to update state cleanly
export function toggleCategory(category: string) {
  const current = $filters.get().categories;
  if (current.includes(category)) {
    $filters.setKey('categories', current.filter((c) => c !== category));
  } else {
    $filters.setKey('categories', [...current, category]);
  }
}

export function toggleLocation(location: string) {
  const current = $filters.get().locations;
  if (current.includes(location)) {
    $filters.setKey('locations', current.filter((l) => l !== location));
  } else {
    $filters.setKey('locations', [...current, location]);
  }
}

export function toggleBondPeriod(bond: string) {
  const current = $filters.get().bondPeriods;
  if (current.includes(bond)) {
    $filters.setKey('bondPeriods', current.filter((b) => b !== bond));
  } else {
    $filters.setKey('bondPeriods', [...current, bond]);
  }
}

export function setCtcRange(min: number, max: number) {
  $filters.setKey('ctcMin', min);
  $filters.setKey('ctcMax', max);
}

export function setSearchQuery(query: string) {
  $filters.setKey('searchQuery', query);
}

export function setSortOrder(order: 'newest' | 'deadline' | 'ctc') {
  $filters.setKey('sortOrder', order);
}
