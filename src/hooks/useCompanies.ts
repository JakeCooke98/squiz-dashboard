import { useQuery } from '@tanstack/react-query';
import { fetchCompanies } from '../services/api';
import type { Company, FilterState } from '../types/company';
import { useMemo } from 'react';

/**
 * Custom hook for managing companies data with filtering, sorting, and search
 * @param filterState - Current filter state
 */
export function useCompanies(filterState: FilterState) {
  // Fetch companies data with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: fetchCompanies,
  });

  // Process and filter the data based on filterState
  const processedData = useMemo(() => {
    if (!data?.companies) return { companies: [], total: 0 };

    let filteredCompanies = [...data.companies];

    // Apply search filter
    if (filterState.searchTerm) {
      const searchLower = filterState.searchTerm.toLowerCase();
      filteredCompanies = filteredCompanies.filter((company) =>
        company.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply country filter
    if (filterState.country) {
      filteredCompanies = filteredCompanies.filter(
        (company) => company.country === filterState.country
      );
    }

    // Apply industry filter
    if (filterState.industry) {
      filteredCompanies = filteredCompanies.filter(
        (company) => company.industry === filterState.industry
      );
    }

    // Apply sorting
    if (filterState.sortBy && filterState.sortOrder) {
      filteredCompanies.sort((a, b) => {
        const aValue = a[filterState.sortBy!];
        const bValue = b[filterState.sortBy!];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filterState.sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filterState.sortOrder === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return {
      companies: filteredCompanies,
      total: filteredCompanies.length,
    };
  }, [data, filterState]);

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    if (!data?.companies) {
      return {
        countries: [],
        industries: [],
      };
    }

    const countries = Array.from(
      new Set(data.companies.map((company) => company.country))
    ).sort();

    const industries = Array.from(
      new Set(data.companies.map((company) => company.industry))
    ).sort();

    return {
      countries,
      industries,
    };
  }, [data]);

  return {
    data: processedData,
    isLoading,
    error,
    filterOptions,
  };
} 