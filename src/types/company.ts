/**
 * Represents a company record from the API
 */
export interface Company {
  /** Unique identifier for the company */
  id: string;
  /** Company name */
  name: string;
  /** Number of employees */
  employees: number;
  /** Number of employees (legacy field) */
  numberOfEmployees?: number;
  /** Company industry */
  industry: string;
  /** Company country */
  country: string;
}

/**
 * Represents the filter state for the dashboard
 */
export interface FilterState {
  /** Selected country filter */
  country: string | null;
  /** Selected industry filter */
  industry: string | null;
  /** Search term for company names */
  searchTerm: string;
  /** Current sort field */
  sortBy: keyof Company | null;
  /** Sort direction */
  sortOrder: 'asc' | 'desc' | null;
}

/**
 * Represents the response from the companies API
 */
export interface CompaniesResponse {
  /** Array of company records */
  companies: Company[];
  /** Total number of companies */
  total: number;
}

/**
 * Represents an error response from the API
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** HTTP status code */
  status: number;
} 