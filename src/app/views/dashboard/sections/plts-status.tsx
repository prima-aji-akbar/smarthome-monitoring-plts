"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import {
  Sun,
  Loader2,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// 1. Impor hook dan formatters
import { useRealtimeData } from "@/hooks/use-realtime-data";
import {
  formatVoltage,
  formatCurrent,
  formatPower,
  formatFrequency,
  formatPowerFactor,
} from "@/lib/utils/formatters";
import { PLTSData } from "@/types/telemetry";

// Komponen Skeleton untuk loading
const PLTSSkeleton = () => {
    return (
        <div className="w-full flex flex-col h-full">
            <div className="mb-3 sm:mb-4">
                <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">
                    PLTS Status
                </h1>
            </div>
            
            <Card className="flex-1 flex flex-col bg-gray-400 border-0 shadow-lg">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <h2 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                            Solar Power
                        </h2>
                        <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-2.5">
                            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white animate-spin" />
                        </div>
                    </div>
                </CardHeader>
                <Separator className="bg-white/20" />
                <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-end">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md border-l-4 border-gray-600">
                        <div className="flex items-baseline gap-2 mb-3">
                            <Skeleton className="h-10 w-28" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                            {[...Array(4)].map((_, i) => (
                                <div key={i}>
                                    <Skeleton className="h-4 w-12 mb-1" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default function PLTSStatus() {
  // 2. Panggil hook untuk data realtime
  const { plts, loading } = useRealtimeData();

  // 3. Helper untuk menangani data null saat loading
  const pltsData: PLTSData = plts || {
    voltage: 0,
    current: 0,
    power: 0,
    energy: 0,
    frequency: 0,
    pf: 0,
    status: false,
  };

  const isPLTSActive = pltsData.status;

  // 5. Tampilkan skeleton saat loading
  if (loading) {
    return <PLTSSkeleton />;
  }

  const gradient = isPLTSActive
    ? "from-orange-400 to-orange-500"
    : "from-gray-400 to-gray-500";
  const borderColor = isPLTSActive ? "border-orange-600" : "border-gray-600";
  const textColor = isPLTSActive ? "text-orange-600" : "text-gray-600";
  const Icon = isPLTSActive ? CheckCircle : XCircle;

  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-3 sm:mb-4">
        <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">
          PLTS Status
        </h1>
      </div>

      <Card
        className={`flex-1 flex flex-col bg-gradient-to-br ${gradient} border-0 shadow-lg hover:shadow-xl transition-shadow duration-300`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h2 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
              Solar Power
            </h2>
            <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-2.5">
              <Sun
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white"
                fill="white"
              />
            </div>
          </div>
        </CardHeader>
        <Separator className="bg-white/20" />
        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-end">
          <div
            className={`bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md border-l-4 ${borderColor}`}
          >
            <div className="flex items-baseline gap-2 mb-3">
              <p
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${textColor}`}
              >
                {isPLTSActive ? "Online" : "Offline"}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  isPLTSActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Icon className="w-3 h-3 inline-block mr-1" />
                {isPLTSActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div>
                <p className="text-slate-500">Voltage</p>
                <p className="font-semibold text-slate-700">
                  {isPLTSActive ? formatVoltage(pltsData.voltage) : "---"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Current</p>
                <p className="font-semibold text-slate-700">
                  {isPLTSActive ? formatCurrent(pltsData.current) : "---"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Power</p>
                <p className="font-semibold text-slate-700">
                  {isPLTSActive ? formatPower(pltsData.power) : "---"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Frequency</p>
                <p className="font-semibold text-slate-700">
                  {isPLTSActive ? formatFrequency(pltsData.frequency) : "---"}
                </p>
              </div>
               <div>
                <p className="text-slate-500">Power Factor</p>
                <p className="font-semibold text-slate-700">
                  {isPLTSActive ? formatPowerFactor(pltsData.pf) : "---"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}