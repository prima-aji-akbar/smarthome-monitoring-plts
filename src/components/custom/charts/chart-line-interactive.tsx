"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartDataPoint = Record<string, number | string | null | undefined>;

interface DynamicLineChartProps {
  chartData: ChartDataPoint[]; 
  chartConfig: ChartConfig;
  xAxisDataKey: string;
  dataKey: string; 
  wrapperClassName?: string;
  heightClassName?: string;
  xAxisTickFormatter?: (value: string | number | null | undefined, index?: number) => string; 
  // tooltip formatter with explicit label type
  tooltipLabelFormatter?: (label: string | number | null | undefined) => React.ReactNode;
}

export function ChartLineInteractive({
  chartData,
  chartConfig,
  xAxisDataKey,
  dataKey,
  xAxisTickFormatter,
  wrapperClassName = "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800",
  heightClassName = "h-[250px] min-h-[200px] md:h-full", 
  tooltipLabelFormatter, // 2. Ambil prop baru
}: DynamicLineChartProps) {
  
  const chartColor = chartConfig[dataKey]?.color || "hsl(var(--primary))";

  return (
    <div 
      className={`rounded-xl p-4 border-2 shadow-lg transition-all duration-300 ${wrapperClassName} w-full`}
    >
      <div className={`aspect-auto w-full ${heightClassName}`}>
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="currentColor"
                className="stroke-slate-200 dark:stroke-slate-800 opacity-60"
              />
              <XAxis
                dataKey={xAxisDataKey}
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={32}
                className="text-slate-700 dark:text-slate-300"
                tick={{ fontSize: 11 }}
                tickFormatter={xAxisTickFormatter || ((value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                })}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-slate-700 dark:text-slate-300"
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[140px] sm:w-[160px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl"
                    // 3. Teruskan prop ke labelFormatter
                    labelFormatter={tooltipLabelFormatter}
                  />
                }
              />
              <Line
                dataKey={dataKey}
                type="monotone"
                stroke={chartColor}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  )
}