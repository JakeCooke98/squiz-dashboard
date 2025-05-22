import { useState, useEffect } from 'react';
import type { FilterState } from '../../types/company';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/Select';

interface FilterPanelProps {
  /** Initial filter state */
  initialFilters: FilterState;
  /** Available countries for filtering */
  countries: string[];
  /** Available industries for filtering */
  industries: string[];
  /** Called when filters change */
  onFilterChange: (filters: FilterState) => void;
}

/**
 * Component for displaying and managing dashboard filters
 */
export function FilterPanel({
  initialFilters,
  countries,
  industries,
  onFilterChange,
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [searchInput, setSearchInput] = useState(initialFilters.searchTerm);

  // Debounce search input
  useEffect(() => {
    const timerId = setTimeout(() => {
      if (searchInput !== filters.searchTerm) {
        setFilters(prev => ({ ...prev, searchTerm: searchInput }));
      }
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchInput, filters.searchTerm]);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  /**
   * Updates a single filter value
   */
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Narrow down the data by applying filters below.
        </p>
      </div>

      {/* Search filter */}
      <div className="space-y-2">
        <Label htmlFor="search">Search by Company Name</Label>
        <Input
          id="search"
          type="text"
          placeholder="Search companies by name..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      </div>

      {/* Country filter */}
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select
          value={filters.country || 'all'}
          onValueChange={value => {
            updateFilter('country', value === 'all' ? null : value);
          }}
        >
          <SelectTrigger id="country">
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map(country => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Industry filter */}
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select
          value={filters.industry || 'all'}
          onValueChange={value => {
            updateFilter('industry', value === 'all' ? null : value);
          }}
        >
          <SelectTrigger id="industry">
            <SelectValue placeholder="Select an industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            {industries.map(industry => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sort controls */}
      <div className="space-y-2">
        <Label htmlFor="sortBy">Sort By</Label>
        <Select
          value={filters.sortBy || 'none'}
          onValueChange={value => {
            if (value === 'none') {
              updateFilter('sortBy', null);
            } else if (value === 'name' || value === 'employees') {
              updateFilter('sortBy', value);
            }
          }}
        >
          <SelectTrigger id="sortBy">
            <SelectValue placeholder="Select field to sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Sorting</SelectItem>
            <SelectItem value="name">Company Name</SelectItem>
            <SelectItem value="employees">Number of Employees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filters.sortBy && (
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Select
            value={filters.sortOrder || 'asc'}
            onValueChange={value => {
              if (value === 'asc' || value === 'desc') {
                updateFilter('sortOrder', value);
              }
            }}
          >
            <SelectTrigger id="sortOrder">
              <SelectValue placeholder="Select sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reset button */}
      <button
        className="w-full mt-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground py-2 px-4 rounded-md text-sm"
        onClick={() => {
          const resetState: FilterState = {
            country: null,
            industry: null,
            searchTerm: '',
            sortBy: null,
            sortOrder: null,
          };
          setFilters(resetState);
          setSearchInput('');
        }}
      >
        Reset Filters
      </button>
    </div>
  );
} 