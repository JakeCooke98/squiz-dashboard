import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface DashboardLayoutProps {
  /** Content for the sidebar/filter panel */
  sidebar: ReactNode;
  /** Main content area */
  children: ReactNode;
}

/**
 * Main dashboard layout component with responsive design
 * Provides a sidebar for filters and a main content area
 */
export function DashboardLayout({ sidebar, children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Mobile toggle button */}
      <button
        className="md:hidden flex items-center justify-center p-4 bg-primary text-primary-foreground"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-expanded={isSidebarOpen}
        aria-controls="sidebar"
      >
        <span className="mr-2">
          {isSidebarOpen ? 'Hide Filters' : 'Show Filters'}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M3.75 6H6m-.75 6h2.25m-.75 6H6"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={cn(
          'w-full md:w-80 bg-card border-r border-border p-6 flex-shrink-0 transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'block' : 'hidden md:block'
        )}
      >
        {sidebar}
      </aside>

      {/* Main content */}
      <main className="flex-grow p-6 overflow-auto">{children}</main>
    </div>
  );
} 