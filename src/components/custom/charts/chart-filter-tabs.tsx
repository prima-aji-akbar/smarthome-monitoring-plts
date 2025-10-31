"use client"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export type ChartRange = "today" | "week" | "month";

interface ChartFilterTabsProps {
  range: ChartRange;
  onRangeChange: (value: ChartRange) => void;
  disabled?: boolean;
}

export function ChartFilterTabs({ 
  range, 
  onRangeChange,
  disabled = false
}: ChartFilterTabsProps) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={range}
      onValueChange={(value: ChartRange | "") => {
        if (value) onRangeChange(value);
      }}
      className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg"
      disabled={disabled}
    >
      <ToggleGroupItem
        value="today"
        className="px-3 data-[state=on]:bg-white data-[state=on]:text-slate-900 dark:data-[state=on]:bg-slate-950 dark:data-[state=on]:text-slate-100"
      >
        Today
      </ToggleGroupItem>
      <ToggleGroupItem
        value="week"
        className="px-3 data-[state=on]:bg-white data-[state=on]:text-slate-900 dark:data-[state=on]:bg-slate-950 dark:data-[state=on]:text-slate-100"
      >
        This Week
      </ToggleGroupItem>
      <ToggleGroupItem
        value="month"
        className="px-3 data-[state=on]:bg-white data-[state=on]:text-slate-900 dark:data-[state=on]:bg-slate-950 dark:data-[state=on]:text-slate-100"
      >
        This Month
      </ToggleGroupItem>
    </ToggleGroup>
  )
}