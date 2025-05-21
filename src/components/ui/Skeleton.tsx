import { cn } from "../../utils/cn";

interface SkeletonProps {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Base skeleton component for loading states
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={cn(
        "animate-pulse rounded-md bg-muted/70", 
        className
      )} 
    />
  );
}

/**
 * Chart skeleton for loading states
 */
export function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Skeleton className="h-5 w-3/4 mb-3" />
      <div className="h-[300px] flex flex-col justify-center items-center">
        <Skeleton className="w-full h-4/5 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Table skeleton for loading states
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="bg-muted/50 border-b py-4 px-4 flex">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-5 w-32 ml-auto" />
      </div>
      
      {/* Body */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-4 border-b last:border-b-0 flex items-center">
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-5 w-32 ml-6" />
          <Skeleton className="h-5 w-32 ml-auto" />
        </div>
      ))}
      
      {/* Footer */}
      <div className="px-4 py-3 border-t flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
} 