"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { TrendingUp } from "lucide-react"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive line chart"

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
  { date: "2024-04-08", desktop: 409, mobile: 320 },
]

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "#3b82f6",
  },
  mobile: {
    label: "Mobile",
    color: "#8b5cf6",
  },
} satisfies ChartConfig

export function ChartLineInteractive() {
  const [activeChart, setActiveChart] =
    React.useState<"desktop" | "mobile">("desktop")

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  )

  const getChartColor = (chart: "desktop" | "mobile") => {
    return chart === "desktop" ? "#3b82f6" : "#8b5cf6"
  }

  return (
    <div className="w-full">
        <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-3 mb-4">
          {(["desktop", "mobile"] as const).map((key) => {
            const chart = key
            const isActive = activeChart === chart
            return (
              <button
                key={chart}
                data-active={isActive}
                className={`flex-1 rounded-xl p-4 sm:p-5 text-left transition-all duration-300 border-2 ${
                  isActive 
                    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-400 dark:border-blue-600 shadow-lg' 
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md'
                }`}
                onClick={() => setActiveChart(chart)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-medium uppercase tracking-wide ${
                    isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {chartConfig[chart].label}
                  </span>
                  {isActive && (
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <span className={`text-2xl sm:text-3xl lg:text-4xl leading-none font-bold ${
                  isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
                <p className={`text-[10px] sm:text-xs mt-1.5 ${
                  isActive ? 'text-blue-600/80 dark:text-blue-400/80' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  Total Views
                </p>
              </button>
            )
          })}
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto w-full h-[200px] sm:h-[240px] md:h-[280px]"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="currentColor"
                className="stroke-slate-200 dark:stroke-slate-700"
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                minTickGap={32}
                className="text-slate-600 dark:text-slate-400"
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-slate-600 dark:text-slate-400"
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[140px] sm:w-[160px] bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />
              <Line
                dataKey={activeChart}
                type="monotone"
                stroke={getChartColor(activeChart)}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={{
                  fill: getChartColor(activeChart),
                  r: 4,
                  strokeWidth: 2,
                  stroke: "white",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                  stroke: "white",
                }}
              />
            </LineChart>
          </ChartContainer>
        </div>
    </div>
  )
}