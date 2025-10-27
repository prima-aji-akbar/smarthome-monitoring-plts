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

  const getGradientColors = (chart: "desktop" | "mobile") => {
    return chart === "desktop" 
      ? "from-blue-400 to-blue-500" 
      : "from-purple-400 to-purple-500"
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
              className={`flex-1 rounded-xl p-4 sm:p-5 text-left transition-all duration-300 border-0 shadow-lg hover:shadow-xl ${
                isActive 
                  ? `bg-gradient-to-br ${getGradientColors(chart)}` 
                  : 'bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800'
              }`}
              onClick={() => setActiveChart(chart)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold uppercase tracking-wide ${
                  isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300'
                }`}>
                  {chartConfig[chart].label}
                </span>
                {isActive && (
                  <div className="bg-white/30 backdrop-blur-sm rounded-full p-1.5">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <span className={`text-2xl sm:text-3xl lg:text-4xl leading-none font-bold ${
                isActive ? 'text-white' : 'text-slate-700 dark:text-slate-200'
              }`}>
                {total[key as keyof typeof total].toLocaleString()}
              </span>
              <p className={`text-[10px] sm:text-xs mt-1.5 font-medium ${
                isActive ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
              }`}>
                Total Views
              </p>
            </button>
          )
        })}
      </div>
      <div className={`bg-gradient-to-br ${activeChart === 'desktop' ? 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800' : 'from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800'} rounded-xl p-4 border-2 shadow-lg transition-all duration-300`}>
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
              className={activeChart === 'desktop' ? 'stroke-blue-200 dark:stroke-blue-800' : 'stroke-purple-200 dark:stroke-purple-800'}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={32}
              className={activeChart === 'desktop' ? 'text-blue-700 dark:text-blue-300' : 'text-purple-700 dark:text-purple-300'}
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
              className={activeChart === 'desktop' ? 'text-blue-700 dark:text-blue-300' : 'text-purple-700 dark:text-purple-300'}
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