import { useState, useCallback } from 'react';
import type { Company, FilterState } from '../../types/company';
import { useCompanies } from '../../hooks/useCompanies';
import { DashboardLayout } from '../layout/DashboardLayout';
import { FilterPanel } from './FilterPanel';
import { DataTable } from './DataTable';
import { StatsCard } from './StatsCard';
import { Card } from '../ui/Card';

/**
 * Main dashboard component that integrates all dashboard elements
 */
export function Dashboard() {
  // Initial filter state
  const [filterState, setFilterState] = useState<FilterState>({
    country: null,
    industry: null,
    searchTerm: '',
    sortBy: null,
    sortOrder: null,
  });

  // Get companies data with filters applied
  const { data, isLoading, error, filterOptions } = useCompanies(filterState);

  /**
   * Handle sorting when table headers are clicked
   */
  const handleSort = useCallback((field: keyof Company) => {
    setFilterState(prev => {
      // If already sorting by this field, toggle direction
      if (prev.sortBy === field) {
        return {
          ...prev,
          sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
        };
      }
      
      // Otherwise, sort by the new field in ascending order
      return {
        ...prev,
        sortBy: field,
        sortOrder: 'asc',
      };
    });
  }, []);

  /**
   * Calculate statistics from the company data
   */
  const calculateStats = () => {
    if (!data.companies.length) {
      return {
        totalCompanies: 0,
        avgEmployees: 0,
        largestCompany: null,
        smallestCompany: null,
      };
    }

    const totalEmployees = data.companies.reduce(
      (sum, company) => sum + company.numberOfEmployees,
      0
    );

    const avgEmployees = Math.round(totalEmployees / data.companies.length);

    // Find largest and smallest companies by employee count
    const sortedBySize = [...data.companies].sort(
      (a, b) => b.numberOfEmployees - a.numberOfEmployees
    );

    return {
      totalCompanies: data.companies.length,
      avgEmployees,
      largestCompany: sortedBySize[0],
      smallestCompany: sortedBySize[sortedBySize.length - 1],
    };
  };

  const stats = calculateStats();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg max-w-lg">
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p>
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </p>
          <button 
            className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout
      sidebar={
        <FilterPanel
          initialFilters={filterState}
          countries={filterOptions.countries}
          industries={filterOptions.industries}
          onFilterChange={setFilterState}
        />
      }
    >
      <div className="space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Companies"
            value={stats.totalCompanies}
            description={`${filterState.country || filterState.industry ? 'Filtered results' : 'All companies'}`}
          />
          <StatsCard
            title="Average Employees"
            value={stats.avgEmployees}
            description="Per company"
          />
          {stats.largestCompany && (
            <StatsCard
              title="Largest Company"
              value={stats.largestCompany.name}
              description={`${stats.largestCompany.numberOfEmployees.toLocaleString()} employees`}
            />
          )}
          {stats.smallestCompany && (
            <StatsCard
              title="Smallest Company"
              value={stats.smallestCompany.name}
              description={`${stats.smallestCompany.numberOfEmployees.toLocaleString()} employees`}
            />
          )}
        </div>

        {/* Data table */}
        <Card className="p-0">
          <DataTable 
            data={data.companies}
            filterState={filterState}
            onSort={handleSort}
          />
        </Card>
      </div>
    </DashboardLayout>
  );
} 