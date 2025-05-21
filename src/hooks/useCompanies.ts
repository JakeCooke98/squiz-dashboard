import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Company, FilterState, ApiError } from '../types/company';
import { useLoading } from './useLoading';
import { fetchCompanies as apiFetchCompanies } from '../services/api';

interface UseCompaniesResult {
  data: {
    companies: Company[];
    totalCount: number;
  };
  isLoading: boolean;
  showLoading: boolean;
  error: Error | ApiError | null;
  filterOptions: {
    countries: string[];
    industries: string[];
  };
  refreshData: () => void;
}

/**
 * Hook for accessing and filtering company data
 */
export function useCompanies(filters: FilterState): UseCompaniesResult {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [error, setError] = useState<Error | ApiError | null>(null);
  const { isLoading, showLoading, startLoading, stopLoading } = useLoading();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  /**
   * Fetch company data from the API
   */
  const fetchCompaniesData = useCallback(async () => {
    try {
      startLoading();
      
      const response = await apiFetchCompanies();
      
      // Transform data to match our Company interface - using numberOfEmployees from API
      const transformedCompanies = response.companies.map((company: any) => ({
        ...company,
        employees: company.numberOfEmployees,
      }));
      
      setCompanies(transformedCompanies);
      setError(null);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  // Initial data load - only once when component mounts
  useEffect(() => {
    if (isInitialLoad) {
      fetchCompaniesData();
      setIsInitialLoad(false);
    }
  }, [fetchCompaniesData, isInitialLoad]);

  // Filter and sort companies based on selected filters
  const filteredCompanies = useMemo(() => {
    if (companies.length === 0) return [];
    
    return companies.filter(company => {
      // Filter by country
      if (filters.country && company.country !== filters.country) {
        return false;
      }
      
      // Filter by industry
      if (filters.industry && company.industry !== filters.industry) {
        return false;
      }
      
      // Filter by search term
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const nameMatch = company.name.toLowerCase().includes(searchTerm);
        const industryMatch = company.industry.toLowerCase().includes(searchTerm);
        const countryMatch = company.country.toLowerCase().includes(searchTerm);
        
        return nameMatch || industryMatch || countryMatch;
      }
      
      return true;
    }).sort((a, b) => {
      // Apply sorting
      if (filters.sortBy && filters.sortOrder) {
        const aValue = a[filters.sortBy];
        const bValue = b[filters.sortBy];
        
        // Handle string vs number
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filters.sortOrder === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else {
          // @ts-ignore
          return filters.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
      }
      
      return 0;
    });
  }, [companies, filters]);

  // Extract unique values for filter options
  const filterOptions = useMemo(() => {
    const countries = Array.from(new Set(companies.map(company => company.country))).sort();
    const industries = Array.from(new Set(companies.map(company => company.industry))).sort();
    
    return {
      countries,
      industries,
    };
  }, [companies]);

  return {
    data: {
      companies: filteredCompanies,
      totalCount: filteredCompanies.length,
    },
    isLoading,
    showLoading,
    error,
    filterOptions,
    refreshData: fetchCompaniesData,
  };
} 