import { useState, useEffect } from 'react';
import type { Company, FilterState } from '../../types/company';
import { cn } from '../../utils/cn';
import { TableSkeleton } from '../ui/Skeleton';

interface DataTableProps {
  /** Array of companies to display */
  data: Company[];
  /** Current filter state */
  filterState: FilterState;
  /** Called when a column header is clicked for sorting */
  onSort: (field: keyof Company) => void;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

// Possible page size options
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
// Key for storing page size in localStorage
const PAGE_SIZE_KEY = 'dashboard_pageSize';

/**
 * Get the page size from localStorage or use the default
 */
function getStoredPageSize(): number {
  try {
    // Check if window exists (to prevent server-side rendering errors)
    if (typeof window === 'undefined') return 10;
    
    const stored = localStorage.getItem(PAGE_SIZE_KEY);
    const parsedSize = stored ? parseInt(stored, 10) : 10;
    return PAGE_SIZE_OPTIONS.includes(parsedSize) ? parsedSize : 10;
  } catch {
    return 10;
  }
}

/**
 * Save page size to localStorage
 */
function savePageSize(size: number): void {
  try {
    // Check if window exists (to prevent server-side rendering errors)
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(PAGE_SIZE_KEY, size.toString());
  } catch (error) {
    console.error('Failed to save page size', error);
  }
}

/**
 * Component to display company data in a table format
 * Supports sorting and pagination
 */
export function DataTable({
  data,
  filterState,
  onSort,
  isLoading,
  className,
}: DataTableProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(getStoredPageSize());
  const totalPages = Math.ceil(data.length / pageSize);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterState]);

  // Save page size when it changes
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    savePageSize(newSize);
    // Reset to page 1 when changing page size to avoid empty results
    setCurrentPage(1);
  };
  
  // Paginated data
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  /**
   * Render a sort indicator based on current sort state
   */
  const renderSortIndicator = (field: keyof Company) => {
    if (filterState.sortBy !== field) {
      return null;
    }

    return filterState.sortOrder === 'asc' ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 ml-1"
      >
        <path
          fillRule="evenodd"
          d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
          clipRule="evenodd"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-4 h-4 ml-1"
      >
        <path
          fillRule="evenodd"
          d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  /**
   * Render a sortable column header
   */
  const SortableHeader = ({ field, label }: { field: keyof Company; label: string }) => (
    <th 
      className="p-4 text-left font-medium text-sm cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {label}
        {renderSortIndicator(field)}
      </div>
    </th>
  );

  // Show loading state if needed
  if (isLoading) {
    return (
      <div className={cn('border rounded-lg overflow-hidden', className)}>
        <TableSkeleton rows={pageSize} />
      </div>
    );
  }

  return (
    <div className={cn('border rounded-lg overflow-hidden slide-up', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <SortableHeader field="name" label="Company Name" />
              <SortableHeader field="industry" label="Industry" />
              <SortableHeader field="country" label="Country" />
              <SortableHeader field="employees" label="Employees" />
            </tr>
          </thead>
          <tbody className="stagger-container">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No companies found matching the filters.
                </td>
              </tr>
            ) : (
              paginatedData.map((company, idx) => (
                <tr 
                  key={company.id} 
                  className="border-b last:border-b-0 hover:bg-muted/50 transition-colors stagger-item"
                  style={{animationDelay: `${idx * 50}ms`}}
                >
                  <td className="p-4 font-medium">{company.name}</td>
                  <td className="p-4">{company.industry}</td>
                  <td className="p-4">{company.country}</td>
                  <td className="p-4">{company.employees.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {data.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {data.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-
            {Math.min(currentPage * pageSize, data.length)} of {data.length}
          </div>
          
          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <select
              className="h-8 w-16 rounded border bg-background px-2 text-sm"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              aria-label="Items per page"
            >
              {PAGE_SIZE_OPTIONS.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          
          {/* Page navigation */}
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                aria-label="First page"
              >
                <span className="sr-only">First page</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="11 17 6 12 11 7"></polyline>
                  <polyline points="18 17 13 12 18 7"></polyline>
                </svg>
              </button>
              
              <button
                className="px-3 py-1.5 rounded transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <span className="mx-2 text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                className="px-3 py-1.5 rounded transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
              
              <button
                className="p-2 rounded transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Last page"
              >
                <span className="sr-only">Last page</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="13 17 18 12 13 7"></polyline>
                  <polyline points="6 17 11 12 6 7"></polyline>
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 