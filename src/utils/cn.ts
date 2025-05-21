import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges multiple class names and Tailwind CSS classes together
 * Handles conditional classes and duplicate/conflicting utility classes
 * 
 * @param inputs - Class names or conditional class expressions
 * @returns Merged class string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 