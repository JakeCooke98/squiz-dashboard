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
          {children as React.ReactElement}
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
    formatter?: (value: number, name: string) => [string, string];
  }>;
  label?: string;
  className?: string;
}

export function ChartTooltipContent({
  active,
  payload,
}: ChartTooltipContentProps) {
  const { config } = useChartContext();
  
  if (!active || !payload || !payload.length) {
    return null;
  }
  
  const data = payload[0];
  const dataKey = data.dataKey;
  const name = data.name;
  const value = data.value;
  const color = data.color || (config[name]?.color || config[dataKey]?.color || 'hsl(var(--primary))');
  
  return (
    <div className="bg-popover/95 shadow-md rounded-md border px-3 py-1.5 text-sm animate-in fade-in-50 duration-100">
      {name && (
        <div className="flex items-center mb-1">
          <div 
            className="w-2 h-2 rounded-sm mr-1.5" 
            style={{ backgroundColor: color }}
          />
          <span className="font-medium">
            {config[name]?.label || name}
          </span>
        </div>
      )}
      <div>
        {value}
      </div>
    </div>
  );
} 