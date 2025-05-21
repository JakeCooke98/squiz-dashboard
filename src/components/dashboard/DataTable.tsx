import { useState } from 'react';
import type { Company, FilterState } from '../../types/company';
import { cn } from '../../utils/cn';

interface DataTableProps {
  /** Array of companies to display */
  data: Company[];
  /** Current filter state */
  filterState: FilterState;
  /** Called when a column header is clicked for sorting */
  onSort: (field: keyof Company) => void;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component to display company data in a table format
 * Supports sorting and pagination
 */
export function DataTable({
  data,
  filterState,
  onSort,
  className,
}: DataTableProps) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  // Paginated data
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
      className="p-4 text-left font-medium text-sm cursor-pointer hover:bg-muted/50"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {label}
        {renderSortIndicator(field)}
      </div>
    </th>
  );

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b">
            <tr>
              <SortableHeader field="name" label="Company Name" />
              <SortableHeader field="industry" label="Industry" />
              <SortableHeader field="country" label="Country" />
              <SortableHeader field="numberOfEmployees" label="Employees" />
              <th className="p-4 text-left font-medium text-sm">Website</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center">
                  No companies found matching the filters.
                </td>
              </tr>
            ) : (
              paginatedData.map((company) => (
                <tr key={company.id} className="border-b last:border-b-0 hover:bg-muted/50">
                  <td className="p-4 font-medium">{company.name}</td>
                  <td className="p-4">{company.industry}</td>
                  <td className="p-4">{company.country}</td>
                  <td className="p-4">{company.numberOfEmployees}</td>
                  <td className="p-4">
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      Visit
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4 ml-1"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                          clipRule="evenodd"
                        />
                        <path
                          fillRule="evenodd"
                          d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, data.length)} of {data.length}
          </div>
          <div className="flex space-x-1">
            <button
              className="px-2 py-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className="px-2 py-1 rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 