import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import type { Company } from "../../../types/company";
import { Card, CardHeader, CardContent } from "../../ui/Card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "../../ui/Chart";

interface IndustryPieChartProps {
  /** Array of company data */
  companies: Company[];
  /** Chart title */
  title?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Pie chart showing distribution of companies by industry
 */
export function IndustryPieChart({
  companies,
  title = "Companies by Industry",
  className,
}: IndustryPieChartProps) {
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
    finalData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: `hsl(var(--chart-${(index % 5) + 1}))`,
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
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={<ChartTooltipContent />}
                  wrapperStyle={{ outline: 'none' }}
                  formatter={(value, name) => {
                    return [
                      `${value} (${Math.round((Number(value) / companies.length) * 100)}%)`,
                      name
                    ];
                  }}
                />
              </PieChart>
            </ChartContainer>
          </div>
          
          {/* Legend for identifying sections */}
          <div className="mt-auto grid grid-cols-3 gap-x-2 gap-y-0.5">
            {data.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div 
                  className="h-2.5 w-2.5 rounded-sm mr-1.5 flex-shrink-0" 
                  style={{ backgroundColor: `hsl(var(--chart-${(index % 5) + 1}))` }}
                />
                <span className="text-xs font-medium truncate">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 