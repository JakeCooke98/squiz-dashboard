import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import type { Company } from "../../../types/company";
import { Card, CardHeader, CardContent } from "../../ui/Card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "../../ui/Chart";
import { cn } from "../../../utils/cn";
import { ChartSkeleton } from "../../ui/Skeleton";

interface IndustryPieChartProps {
  /** Array of companies to visualize */
  companies: Company[];
  /** Optional title for the chart */
  title?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Pie chart showing distribution of companies by industry
 */
export function IndustryPieChart({
  companies,
  title = "Industry Distribution",
  isLoading,
  className,
}: IndustryPieChartProps) {
  // Skip processing if loading
  if (isLoading) {
    return (
      <Card className={cn("h-[300px] flex flex-col", className)}>
        <ChartSkeleton />
      </Card>
    );
  }

  // Generate chart data and config
  const { data, chartConfig } = useMemo(() => {
    // Count companies by industry
    const industryCounts: Record<string, number> = {};
    
    companies.forEach(company => {
      const industry = company.industry || "Unknown";
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    });
    
    // Convert to chart data format and sort
    const chartData = Object.entries(industryCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    
    // Combine smaller categories into "Other" if there are too many
    let finalData = chartData;
    if (chartData.length > 5) {
      const mainIndustries = chartData.slice(0, 4);
      const otherCount = chartData.slice(4).reduce((sum, item) => sum + item.value, 0);
      
      finalData = [
        ...mainIndustries,
        { name: "Other", value: otherCount },
      ];
    }
    
    // Create config for the chart with colors
    const config: ChartConfig = {};
    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];
    
    finalData.forEach((item, index) => {
      const colorIndex = index % colors.length;
      config[item.name] = {
        label: item.name,
        color: colors[colorIndex],
      };
    });
    
    return { 
      data: finalData, 
      chartConfig: config 
    };
  }, [companies]);
  
  // If no data, display a message
  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex flex-col">
          <div className="flex-1">
            <ChartContainer config={chartConfig} className="h-[220px]">
              <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="var(--background)"
                  label={false}
                  labelLine={false}
                  animationBegin={100}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  isAnimationActive={true}
                  onClick={() => {}}
                  style={{ cursor: "default" }}
                >
                  {data.map((entry, index) => {
                    const colorIndex = index % 5;
                    const color = `hsl(var(--chart-${colorIndex + 1}))`;
                    return (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={color}
                        stroke="var(--background)"
                        strokeWidth={2}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  content={<ChartTooltipContent />}
                  wrapperStyle={{ outline: 'none' }}
                  formatter={(value: number, name: string) => {
                    return value;
                  }}
                />
              </PieChart>
            </ChartContainer>
          </div>
          
          {/* Legend for identifying sections */}
          <div className="mt-auto grid grid-cols-3 gap-x-2 gap-y-0.5">
            {data.map((entry, index) => {
              const colorIndex = index % 5;
              const color = `hsl(var(--chart-${colorIndex + 1}))`;
              return (
                <div key={`legend-${index}`} className="flex items-center">
                  <div 
                    className="h-2.5 w-2.5 rounded-sm mr-1.5 flex-shrink-0" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs font-medium truncate">{entry.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 