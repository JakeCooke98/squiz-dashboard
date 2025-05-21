import type { CompaniesResponse, ApiError } from '../types/company';

// Get API URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not defined');
}

/**
 * Fetches companies data from the API
 * @throws {ApiError} If the API request fails
 */
export async function fetchCompanies(): Promise<CompaniesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/data`);
    
    if (!response.ok) {
      const error: ApiError = {
        message: `HTTP error! status: ${response.status}`,
        status: response.status,
      };
      throw error;
    }

    const data = await response.json();
    return {
      companies: data,
      total: data.length,
    };
  } catch (error) {
    // Handle network errors or other exceptions
    const apiError: ApiError = {
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      status: error instanceof Response ? error.status : 500,
    };
    throw apiError;
  }
}

/**
 * Utility function to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error
  );
} 