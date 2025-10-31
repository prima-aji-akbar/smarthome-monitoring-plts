"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts" 
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DynamicAreaChartProps {
  chartData: any[]; 
  chartConfig: ChartConfig; 
  xAxisDataKey: string; 
  heightClassName?: string;
  wrapperClassName?: string; 
  xAxisTickFormatter?: (value: any) => string; 
  // 1. Tambahkan prop baru untuk tooltip formatter
  tooltipLabelFormatter?: (label: any) => React.ReactNode; 
}

export function ChartAreaAxes({
  chartData,
  chartConfig,
  xAxisDataKey,
  heightClassName = "h-[250px] min-h-[200px] md:h-full", 
  wrapperClassName = "bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800 shadow-lg h-full",
  xAxisTickFormatter,
  tooltipLabelFormatter, // 2. Ambil prop baru
}: DynamicAreaChartProps) {

  return (
    <div className={`${wrapperClassName} w-full`}>
      <div className={`${heightClassName} w-full`}>
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: -10, right: 8, top: 8, bottom: 8 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-purple-200 dark:stroke-purple-800" />
              <XAxis
                dataKey={xAxisDataKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11 }}
                className="text-purple-700 dark:text-purple-300"
                tickFormatter={xAxisTickFormatter}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickCount={5}
                tick={{ fontSize: 11 }}
                className="text-purple-700 dark:text-purple-300"
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent 
                    indicator="line" 
                    className="text-xs bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm"
                    // 3. Teruskan prop ke labelFormatter
                    labelFormatter={tooltipLabelFormatter} 
                  />
                }
              />
              {Object.keys(chartConfig).map((key) => (
                <Area
                  key={key}
                  dataKey={key}
                  type="natural"
                  fill={`var(--color-${key})`}
                  fillOpacity={0.4}
                  stroke={`var(--color-${key})`}
                  stackId="a" 
                  strokeWidth={2}
                  dot={false} 
                />
              ))}
              <ChartLegend 
                content={<ChartLegendContent className="text-xs" />} 
                wrapperStyle={{ fontSize: '11px' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}