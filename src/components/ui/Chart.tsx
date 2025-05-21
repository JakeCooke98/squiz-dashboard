import { type ReactNode, createContext, useContext } from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "../../utils/cn";

/**
 * Chart configuration type for consistent theming
 */
export interface ChartConfig {
  [key: string]: {
    label: string;
    color?: string;
  };
}

/**
 * Context for sharing chart configuration
 */
interface ChartContextType {
  config: ChartConfig;
}

const ChartContext = createContext<ChartContextType>({ config: {} });

/**
 * Hook to access chart configuration
 */
export function useChartContext() {
  return useContext(ChartContext);
}

/**
 * Container component for charts that provides configuration and responsive sizing
 */
interface ChartContainerProps {
  children: ReactNode;
  config: ChartConfig;
  className?: string;
}

export function ChartContainer({
  children,
  config,
  className,
}: ChartContainerProps) {
  // Create CSS variables for colors in config
  const style = Object.entries(config).reduce(
    (acc, [key, value]) => {
      if (value.color) {
        acc[`--color-${key}`] = value.color;
      }
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <ChartContext.Provider value={{ config }}>
      <div className={cn("w-full h-full", className)} style={style}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

/**
 * Customized tooltip content component for charts
 */
interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    dataKey: string;
    color?: string;
    payload?: Record<string, any>;
  }>;
  label?: string;
  className?: string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
}: ChartTooltipContentProps) {
  const { config } = useChartContext();
  
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className={cn("rounded-lg border bg-card p-3 shadow-md animate-in fade-in-50 zoom-in-95", className)}>
      {label && (
        <div className="mb-2 font-medium text-card-foreground">
          {label}
        </div>
      )}
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => {
          const dataKey = entry.dataKey;
          const itemConfig = config[dataKey] || {};
          const color = entry.color || itemConfig.color || `hsl(var(--chart-${index + 1}))`;
          
          return (
            <div key={`item-${index}`} className="flex items-center">
              <div
                className="h-3 w-3 rounded-sm mr-2.5"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium text-sm">
                {itemConfig.label || entry.name}:
              </span>
              <span className="ml-1.5 text-sm text-muted-foreground font-medium">
                {typeof entry.value === 'number' 
                  ? entry.value.toLocaleString() 
                  : entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
} 