"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartLineInteractive } from "@/components/custom/charts/chart-line-interactive";
import { ChartConfig } from "@/components/ui/chart";
import { BatteryCharging, Loader2 } from "lucide-react";

import { useFirestoreLogs } from "@/hooks/use-firestore-logs";
import { useRealtimeData } from "@/hooks/use-realtime-data"; 

const chartConfig = {
  soc: { label: "SOC", color: "hsl(142.1 76.2% 36.3%)" },
} satisfies ChartConfig;

type SocDataPoint = {
  time: number;
  soc: number;
};

// 1. Definisikan fungsi formatter di sini
const formatTooltipTimestamp = (label: string | number | null | undefined) => {
  if (label === null || label === undefined || label === "") return "Invalid Date";

  const timestamp = typeof label === "string" ? parseInt(label, 10) : label;
  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) return "Invalid Date";

  return new Date(timestamp).toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const ChartSkeleton = () => ( /* ... (skeleton tetap sama) ... */
    <Card className="flex-1 border-0 shadow-lg bg-white dark:bg-slate-900 flex flex-col">
        <CardContent className="p-4 sm:p-6 h-full flex-1 flex flex-col">
            <div className="w-full flex-1">
                <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-800 shadow-inner h-full">
                    <div className="h-[250px] min-h-[200px] md:h-full w-full flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
);

export default function BatteryUsage() {
  const { logs, loading: logsLoading } = useFirestoreLogs(50);
  const { data: liveData, battery: liveBattery } = useRealtimeData(); 

  const [socData, setSocData] = useState<SocDataPoint[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (logs.length > 0 && !isHydrated) {
      const reversedLogs = [...logs].reverse(); 
      const historicalPoints = reversedLogs.map(log => ({
        time: log.timestamp,
        soc: log.battery.soc,
      }));
      setSocData(historicalPoints);
      setIsHydrated(true); 
    }
  }, [logs, isHydrated]);

  useEffect(() => {
    if (liveData && liveBattery && isHydrated) {
      const newPoint: SocDataPoint = {
        time: liveData.timestamp,
        soc: liveBattery.soc, 
      };

      setSocData((prevData) => {
        if (prevData.length > 0 && liveData.timestamp <= prevData[prevData.length - 1].time) {
          return prevData;
        }
        return [...prevData, newPoint].slice(-50);
      });
    }
  }, [liveData?.timestamp, liveBattery?.soc, isHydrated]); 

  const formatChartTime = (value: string | number | null | undefined) => {
    if (!value) return "";
    const timestamp = typeof value === "string" ? parseInt(value) : value;
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const isLoading = logsLoading || !isHydrated;

  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <BatteryCharging className="w-6 h-6 text-green-600 dark:text-green-400" />
          <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">
            Realtime Battery (SOC)
          </h1>
        </div>
      </div>

      {isLoading && socData.length === 0 ? (
        <ChartSkeleton />
      ) : (
        <Card className="flex-1 border-0 shadow-lg bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex-1 w-full">
              <ChartLineInteractive
                chartData={socData}
                chartConfig={chartConfig}
                xAxisDataKey="time"
                dataKey="soc" 
                xAxisTickFormatter={formatChartTime}
                // 2. Berikan prop formatter ke chart
                tooltipLabelFormatter={formatTooltipTimestamp}
                wrapperClassName="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800 h-full"
                heightClassName="h-full min-h-[250px] md:min-h-0" 
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}