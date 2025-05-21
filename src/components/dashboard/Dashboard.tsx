import { useState, useCallback } from 'react';
import type { Company, FilterState } from '../../types/company';
import { useCompanies } from '../../hooks/useCompanies';
import { DashboardLayout } from '../layout/DashboardLayout';
import { FilterPanel } from './FilterPanel';
import { DataTable } from './DataTable';
import { StatsCard } from './StatsCard';
import { Card } from '../ui/Card';
import { IndustryPieChart } from './charts/IndustryPieChart';
import { CountryChart } from './charts/CountryChart';
import { EmployeeChart } from './charts/EmployeeChart';

/**
 * Main dashboard component that integrates all dashboard elements
 */
export function Dashboard() {
  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: "",
    country: null,
    industry: null,
    sortBy: "name" as keyof Company,
    sortOrder: "asc",
  });

  // Fetch and filter companies
  const { data, isLoading, showLoading, error, filterOptions, refreshData } = useCompanies(filters);
  const { companies } = data || { companies: [] };

  /**
   * Handle sorting when table headers are clicked
   */
  const handleSort = useCallback((field: keyof Company) => {
    setFilters(prev => {
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


  // Loading state - show spinner instead of empty dashboard
  if (isLoading && !showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-lg">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Error state - show error message and retry button
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
            onClick={refreshData}
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
          initialFilters={filters}
          countries={filterOptions?.countries || []}
          industries={filterOptions?.industries || []}
          onFilterChange={setFilters}
        />
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight fade-in">Dashboard</h1>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Companies"
            value={companies.length}
            description={`${filters.country || filters.industry ? 'Filtered results' : 'All companies'}`}
          />
          <StatsCard
            title="Countries"
            value={new Set(companies.map(c => c.country)).size}
            description="Unique"
          />
          <StatsCard
            title="Industries"
            value={new Set(companies.map(c => c.industry)).size}
            description="Unique"
          />
          <StatsCard
            title="Average Employees"
            value={companies.length 
              ? Math.round(companies.reduce((sum, c) => sum + c.employees, 0) / companies.length) 
              : 0
            }
            description="Per company"
          />
        </div>

        {/* Charts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Industry chart */}
          <div className="stagger-item">
            <IndustryPieChart 
              companies={companies} 
              isLoading={showLoading}
            />
          </div>
          
          {/* Country chart */}
          <div className="stagger-item">
            <CountryChart 
              companies={companies} 
              isLoading={showLoading}
            />
          </div>
          
          {/* Employee chart */}
          <div className="stagger-item md:col-span-2">
            <EmployeeChart 
              companies={companies} 
              isLoading={showLoading}
            />
          </div>
        </div>
        
        {/* Data table */}
        <div className="stagger-item mt-6">
          <Card className="p-0">
            <DataTable 
              data={companies}
              filterState={filters}
              onSort={handleSort}
              isLoading={showLoading}
            />
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
} 