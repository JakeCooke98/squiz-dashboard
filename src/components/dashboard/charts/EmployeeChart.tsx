import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { Company } from "../../../types/company";
import { Card, CardHeader, CardContent } from "../../ui/Card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "../../ui/Chart";

interface EmployeeChartProps {
  /** Array of company data */
  companies: Company[];
  /** Chart title */
  title?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Vertical bar chart showing companies by employee count
 */
export function EmployeeChart({
  companies,
  title = "Top Companies by Employees",
  className,
}: EmployeeChartProps) {
  // Generate chart data and config
  const { data, chartConfig } = useMemo(() => {
    // Sort companies by employee count and take top 10
    const topCompanies = [...companies]
      .sort((a, b) => b.numberOfEmployees - a.numberOfEmployees)
      .slice(0, 10);
    
    // Format data for the chart
    const chartData = topCompanies.map(company => ({
      name: company.name,
      employees: company.numberOfEmployees,
    }));
    
    // Create config for the chart
    const config: ChartConfig = {
      employees: {
        label: "Number of Employees",
        color: `hsl(var(--chart-1))`,
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
              margin={{ top: 5, right: 10, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="var(--border)" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={40}
                tick={{ fontSize: 12 }}
                interval={0}
                axisLine={{ stroke: "var(--border)" }}
                tickLine={true}
                tickMargin={5}
              />
              <YAxis 
                tickFormatter={(value) => 
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value
                }
                axisLine={{ stroke: "var(--border)" }}
                tickLine={true}
                tickMargin={5}
                tick={{ fontSize: 11 }}
                domain={[0, 'dataMax']}
              />
              <Tooltip content={<ChartTooltipContent />} />
              <Bar 
                dataKey="employees" 
                fill="var(--color-employees)" 
                radius={[4, 4, 0, 0]}
                barSize={26}
                animationDuration={1000}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
} 