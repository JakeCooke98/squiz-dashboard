import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './components/dashboard/Dashboard';

// Create a client with 5 minute stale time
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Root application component
 * Wraps the application with necessary providers and sets up the main layout
 */
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background">
        <header className="bg-primary text-primary-foreground px-6 py-4 shadow-sm">
          <h1 className="text-2xl font-bold">Company Dashboard</h1>
        </header>
        <Dashboard />
      </div>
    </QueryClientProvider>
  );
}

export default App;
