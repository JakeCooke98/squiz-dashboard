import type { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  /** Title of the statistic */
  title: string;
  /** Value to display */
  value: string | number;
  /** Optional description or context */
  description?: string;
  /** Optional icon */
  icon?: ReactNode;
  /** Optional trend indicator (positive, negative, neutral) */
  trend?: 'up' | 'down' | 'neutral';
  /** Trend percentage or value */
  trendValue?: string | number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Component to display a key statistic in a card format
 */
export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn('', className)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          
          {trend && trendValue && (
            <div className="flex items-center mt-2">
              {trend === 'up' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-green-500 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {trend === 'down' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4 text-red-500 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span
                className={cn('text-sm font-medium', {
                  'text-green-500': trend === 'up',
                  'text-red-500': trend === 'down',
                  'text-gray-500': trend === 'neutral',
                })}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
    </Card>
  );
} 