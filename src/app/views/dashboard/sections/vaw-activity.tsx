"use client"

import { useMemo } from "react";
import { ChartAreaAxes } from "@/components/custom/charts/chart-area-axes";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Zap, Activity, Loader2 } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";

import { useFirestoreLogs } from "@/hooks/use-firestore-logs";

const sharedChartConfig = {
  pln: { label: "PLN", color: "hsl(221.2 83.2% 53.3%)" },
  plts: { label: "PLTS", color: "hsl(39.3 90.9% 51.4%)" },
} satisfies ChartConfig;

const ChartSkeleton = ({ title, Icon }: { title: string, Icon: React.ElementType }) => (
  <Card>
    <CardContent className="p-3 sm:p-4 md:p-6">
      <div>
        <div className="flex gap-3 pb-3 items-center">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
          <h1 className="font-semibold text-sm sm:text-base text-slate-500">{title}</h1>
        </div>
        <div className="w-full">
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-4 border-2 border-slate-200 dark:border-slate-800 shadow-inner">
            <div className="h-[150px] sm:h-[180px] md:h-[200px] w-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

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

export default function VawActivity() {
  const { logs, loading } = useFirestoreLogs(100);

  const chartableData = useMemo(() => {
    const reversedLogs = [...logs].reverse();
    return reversedLogs.map((log) => ({
      time: log.timestamp,
      pln_voltage: log.pln.status ? log.pln.voltage : 0,
      pln_current: log.pln.status ? log.pln.current : 0,
      pln_power: log.pln.status ? log.pln.power : 0,
      plts_voltage: log.plts.status ? log.plts.voltage : 0,
      plts_current: log.plts.status ? log.plts.current : 0,
      plts_power: log.plts.status ? log.plts.power : 0,
    }));
  }, [logs]);

  const voltageConfig = {
    pln: { ...sharedChartConfig.pln, label: "PLN (V)" },
    plts: { ...sharedChartConfig.plts, label: "PLTS (V)" },
  };
  const currentConfig = {
    pln: { ...sharedChartConfig.pln, label: "PLN (A)" },
    plts: { ...sharedChartConfig.plts, label: "PLTS (A)" },
  };
  const powerConfig = {
    pln: { ...sharedChartConfig.pln, label: "PLN (W)" },
    plts: { ...sharedChartConfig.plts, label: "PLTS (W)" },
  };
  
  const voltageData = chartableData.map(d => ({ time: d.time, pln: d.pln_voltage, plts: d.plts_voltage }));
  const currentData = chartableData.map(d => ({ time: d.time, pln: d.pln_current, plts: d.plts_current }));
  const powerData = chartableData.map(d => ({ time: d.time, pln: d.pln_power, plts: d.plts_power }));

  const formatChartTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) { /* ... (skeleton tetap sama) ... */
    return (
      <div className="w-full">
        <div className="mb-3">
          <h1 className="font-bold text-lg sm:text-xl">VAW Activity (Last 100 Logs)</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <ChartSkeleton title="Voltage" Icon={Heart} />
          <ChartSkeleton title="Current" Icon={Zap} />
          <ChartSkeleton title="Power" Icon={Activity} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3">
        <h1 className="font-bold text-lg sm:text-xl text-slate-800 dark:text-slate-100">VAW Activity (Last 100 Logs)</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {/* Voltage Chart */}
        <div className="rounded-lg">
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div>
                <div className="flex gap-3 pb-3 items-center">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  <h1 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100">Voltage (V)</h1>
                </div>
                <div className="w-full">
                  <ChartAreaAxes
                    chartData={voltageData}
                    chartConfig={voltageConfig}
                    xAxisDataKey="time"
                    xAxisTickFormatter={formatChartTime}
                    // 2. Berikan prop formatter ke chart
                    tooltipLabelFormatter={formatTooltipTimestamp} 
                    wrapperClassName="bg-gradient-to-br from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-950/30 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800 shadow-lg"
                    heightClassName="h-[150px] sm:h-[180px] md:h-[200px]" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Current Chart */}
        <div className="rounded-lg">
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div>
                <div className="flex gap-3 pb-3 items-center">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  <h1 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100">Current (A)</h1>
                </div>
                <div className="w-full">
                  <ChartAreaAxes
                    chartData={currentData}
                    chartConfig={currentConfig}
                    xAxisDataKey="time"
                    xAxisTickFormatter={formatChartTime}
                    // 3. Berikan prop formatter ke chart
                    tooltipLabelFormatter={formatTooltipTimestamp}
                    wrapperClassName="bg-gradient-to-br from-green-50 to-slate-50 dark:from-green-950/30 dark:to-slate-950/30 rounded-xl p-4 border-2 border-green-200 dark:border-green-800 shadow-lg"
                    heightClassName="h-[150px] sm:h-[180px] md:h-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Power Chart */}
        <div className="rounded-lg">
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div>
                <div className="flex gap-3 pb-3 items-center">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                  <h1 className="font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100">Power (W)</h1>
                </div>
                <div className="w-full">
                  <ChartAreaAxes
                    chartData={powerData}
                    chartConfig={powerConfig}
                    xAxisDataKey="time"
                    xAxisTickFormatter={formatChartTime}
                    // 4. Berikan prop formatter ke chart
                    tooltipLabelFormatter={formatTooltipTimestamp}
                    wrapperClassName="bg-gradient-to-br from-red-50 to-slate-50 dark:from-red-950/30 dark:to-slate-950/30 rounded-xl p-4 border-2 border-red-200 dark:border-red-800 shadow-lg"
                    heightClassName="h-[150px] sm:h-[180px] md:h-[200px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}