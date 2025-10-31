"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import {
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  BatteryWarning,
  Battery,
  Loader2,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// 1. Impor hook dan formatters
import { useRealtimeData } from "@/hooks/use-realtime-data";
import {
  formatVoltage,
  formatCurrent,
  formatPower,
  formatSOC,
} from "@/lib/utils/formatters";
import { ProcessedBatteryData } from "@/types/telemetry";

// Komponen Skeleton untuk loading
const BatterySkeleton = () => {
    return (
        <div className="w-full flex flex-col h-full">
            <div className="mb-3 sm:mb-4">
                <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">
                    Battery Status
                </h1>
            </div>
            
            <Card className="flex-1 flex flex-col bg-gray-400 border-0 shadow-lg">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <h2 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                            Battery Level
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

export default function BatteryStatus() {
  // 2. Panggil hook untuk data realtime
  const { battery, loading } = useRealtimeData();

  // 3. Helper untuk menangani data null saat loading
  const batteryData: ProcessedBatteryData = battery || {
    soc: 0,
    voltage: 0,
    current: 0,
    power: 0,
    energy: 0,
    status: false,
    consumedWh: 0,
    socStatus: 'critical',
    remainingWh: 0,
    estimatedRuntime: 0,
  };

  // 4. Logika untuk mengubah warna & ikon berdasarkan SOC
  const getBatteryAppearance = (status: ProcessedBatteryData['socStatus']) => {
    switch (status) {
      case 'full':
      case 'good':
        return {
          gradient: "from-green-400 to-green-500",
          borderColor: "border-green-600",
          textColor: "text-green-600",
          Icon: BatteryFull,
        };
      case 'normal':
        return {
          gradient: "from-yellow-400 to-yellow-500",
          borderColor: "border-yellow-600",
          textColor: "text-yellow-600",
          Icon: BatteryMedium,
        };
      case 'low':
        return {
          gradient: "from-orange-400 to-orange-500",
          borderColor: "border-orange-600",
          textColor: "text-orange-600",
          Icon: BatteryLow,
        };
      case 'critical':
      default:
        return {
          gradient: "from-red-400 to-red-500",
          borderColor: "border-red-600",
          textColor: "text-red-600",
          Icon: BatteryWarning,
        };
    }
  };

  // 5. Tampilkan skeleton saat loading
  if (loading) {
    return <BatterySkeleton />;
  }

  const { gradient, borderColor, textColor, Icon } = getBatteryAppearance(batteryData.socStatus);

  return (
    <div className="w-full flex flex-col h-full">
      <div className="mb-3 sm:mb-4">
        <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">
          Battery Status
        </h1>
      </div>

      {/* 6. Gunakan data dinamis untuk warna */}
      <Card
        className={`flex-1 flex flex-col bg-gradient-to-br ${gradient} border-0 shadow-lg hover:shadow-xl transition-shadow duration-300`}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <h2 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
              Battery Level
            </h2>
            <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-2.5">
              <Icon
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white"
                fill="white"
              />
            </div>
          </div>
        </CardHeader>
        <Separator className="bg-white/20" />
        <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-end">
          {/* 7. Gunakan data dinamis untuk border */}
          <div
            className={`bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md border-l-4 ${borderColor}`}
          >
            <div className="flex items-baseline gap-2 mb-3">
              {/* 8. Gunakan data & formatters */}
              <p
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${textColor}`}
              >
                {formatSOC(batteryData.soc)}
              </p>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  batteryData.status
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {batteryData.status ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              <div>
                <p className="text-slate-500">Voltage</p>
                <p className="font-semibold text-slate-700">
                  {formatVoltage(batteryData.voltage)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Current</p>
                <p className="font-semibold text-slate-700">
                  {formatCurrent(batteryData.current)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Power</p>
                <p className="font-semibold text-slate-700">
                  {formatPower(batteryData.power)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Consumed</p>
                <p className="font-semibold text-slate-700">
                  {batteryData.consumedWh.toFixed(2)} Wh
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}