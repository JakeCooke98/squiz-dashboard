import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  /** Card title */
  title?: string;
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * A reusable card component for displaying content with consistent styling
 */
export function Card({ title, children, className }: CardProps) {
  return (
    <div 
      className={cn(
        'bg-card text-card-foreground rounded-lg border border-border shadow-sm p-6', 
        className
      )}
    >
      {title && <h3 className="font-semibold text-lg mb-4">{title}</h3>}
      {children}
    </div>
  );
}

/**
 * Displays content in a card header section
 */
export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-4 flex items-center justify-between', className)}>
      {children}
    </div>
  );
}

/**
 * Displays content in a card content section
 */
export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

/**
 * Displays content in a card footer section
 */
export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mt-6 flex items-center justify-between', className)}>
      {children}
    </div>
  );
} 