"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An area chart with axes"

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#8b5cf6",
  },
  mobile: {
    label: "Mobile",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function ChartAreaAxes() {
  return (
    <div className="w-full">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
        <ChartContainer config={chartConfig} className="h-[150px] sm:h-[180px] md:h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -10,
              right: 8,
              top: 8,
              bottom: 8,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-purple-200 dark:stroke-purple-800" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              className="text-purple-700 dark:text-purple-300"
              tickFormatter={(value) => value.slice(0, 3)}
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
              content={<ChartTooltipContent indicator="line" className="text-xs bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
              strokeWidth={2}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
              strokeWidth={2}
            />
            <ChartLegend 
              content={<ChartLegendContent className="text-xs" />} 
              wrapperStyle={{ fontSize: '11px' }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}