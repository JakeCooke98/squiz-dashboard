import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { Company } from "../../../types/company";
import { Card, CardHeader, CardContent } from "../../ui/Card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "../../ui/Chart";

interface CountryChartProps {
  /** Array of company data */
  companies: Company[];
  /** Chart title */
  title?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Horizontal bar chart showing distribution of companies by country
 */
export function CountryChart({
  companies,
  title = "Companies by Country",
  className,
}: CountryChartProps) {
  // Generate chart data and config
  const { data, chartConfig } = useMemo(() => {
    // Count companies by country
    const countryCounts: Record<string, number> = {};
    
    companies.forEach(company => {
      const country = company.country || "Unknown";
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });
    
    // Convert to chart data format and sort
    const chartData = Object.entries(countryCounts)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Limit to top 8 countries
    
    // Create config for the chart
    const config: ChartConfig = {
      count: {
        label: "Number of Companies",
        color: `hsl(var(--chart-2))`,
      },
    };
    
    return { 
      data: chartData, 
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
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] flex flex-col">
          <ChartContainer config={chartConfig} className="flex-1">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 25, left: 25, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} stroke="var(--border)" />
              <XAxis 
                type="number" 
                axisLine={{ stroke: "var(--border)" }}
                tickLine={true}
                tickMargin={5}
                tick={{ fontSize: 11 }}
                domain={[0, 'dataMax']}
              />
              <YAxis 
                dataKey="country" 
                type="category" 
                tick={{ fontSize: 12 }}
                width={50}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={true}
                tickMargin={5}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="count" 
                fill="var(--color-count)" 
                radius={[0, 4, 4, 0]}
                barSize={20}
                animationDuration={800}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
} 