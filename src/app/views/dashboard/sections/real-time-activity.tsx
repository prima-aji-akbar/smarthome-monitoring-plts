"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChartAreaAxes } from "@/components/custom/charts/chart-area-axes"; 
import { ChartConfig } from "@/components/ui/chart";
import { Activity, Loader2 } from "lucide-react";

import { useRealtimeData } from "@/hooks/use-realtime-data"; 
import { useFirestoreLogs } from "@/hooks/use-firestore-logs";
import { RealtimeData } from "@/types/telemetry";

const chartConfig = {
  pln: { label: "PLN", color: "hsl(221.2 83.2% 53.3%)" },
  plts: { label: "PLTS", color: "hsl(39.3 90.9% 51.4%)" },
} satisfies ChartConfig;

type PowerDataPoint = {
  time: number;
  pln: number;
  plts: number;
};

// 1. Definisikan fungsi formatter di sini
const formatTooltipTimestamp = (timestamp: number) => {
  if (!timestamp) return "Invalid Date";
  return new Date(timestamp).toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
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

export default function RealtimeActivity() {
  const { logs, loading: logsLoading } = useFirestoreLogs(50); 
  const { data: liveData } = useRealtimeData(); 

  const [dataPoints, setDataPoints] = useState<PowerDataPoint[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (logs.length > 0 && !isHydrated) {
      const reversedLogs = [...logs].reverse(); 
      const historicalPoints = reversedLogs.map(log => ({
        time: log.timestamp,
        pln: log.pln.status ? log.pln.power : 0,
        plts: log.plts.status ? log.plts.power : 0,
      }));
      setDataPoints(historicalPoints);
      setIsHydrated(true); 
    }
  }, [logs, isHydrated]); 

  useEffect(() => {
    if (liveData && liveData.pln && liveData.plts && isHydrated) {
      const newPoint: PowerDataPoint = {
        time: liveData.timestamp,
        pln: liveData.pln.status ? liveData.pln.power : 0,
        plts: liveData.plts.status ? liveData.plts.power : 0,
      };
      setDataPoints((prevData) => {
        if (prevData.length > 0 && liveData.timestamp <= prevData[prevData.length - 1].time) {
          return prevData; 
        }
        return [...prevData, newPoint].slice(-50); 
      });
    }
  }, [liveData?.timestamp, isHydrated]); 

  const formatChartTime = (timestamp: number) => {
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
          <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">
            Realtime Power Activity (W)
          </h1>
        </div>
      </div>

      {isLoading && dataPoints.length === 0 ? (
        <ChartSkeleton />
      ) : (
        <Card className="flex-1 border-0 shadow-lg bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow duration-300 flex flex-col">
          <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="flex-1 w-full">
              <ChartAreaAxes
                chartData={dataPoints}
                chartConfig={chartConfig}
                xAxisDataKey="time"
                xAxisTickFormatter={formatChartTime}
                // 2. Berikan prop formatter ke chart
                tooltipLabelFormatter={formatTooltipTimestamp}
                wrapperClassName="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800 shadow-lg h-full"
                heightClassName="h-full min-h-[250px] md:min-h-0" 
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}