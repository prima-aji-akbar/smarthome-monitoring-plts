"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Zap, 
  Sun, 
  AlertCircle, 
  Settings, 
  Power, 
  Loader2,
  BatteryCharging,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { useRealtimeData, useATSStatus } from "@/hooks/use-realtime-data";
import { useDeviceStatus } from "@/hooks/use-device-status";
import { useSwitchControl } from "@/hooks/use-switch-control";
import { useDeviceConfig } from "@/hooks/use-device-config";

import { 
  formatVoltage, 
  formatCurrent, 
  formatPower,
  formatSOC,
  getSOCColor
} from "@/lib/utils/formatters";

type Source = 'PLN' | 'PLTS';

export default function SwitchController() {
  // 3. Gunakan hook untuk data realtime
  const { pln, plts, battery, loading: dataLoading } = useRealtimeData();
  const { activeSource } = useATSStatus();
  const { isOnline } = useDeviceStatus();
  const { switchToPLN, switchToPLTS, isSwitching: isManualSwitching } = useSwitchControl();
  const { config, loading: configLoading, updateConfig } = useDeviceConfig();

  // State lokal untuk UI
  const [isUpdatingAutoMode, setIsUpdatingAutoMode] = useState(false);

  // 4. Dapatkan state dari hooks, bukan dummy data
  const autoMode = config?.autoMode ?? true; // Default ke true jika config blm dimuat
  const isLoading = dataLoading || configLoading;

  // 5. Implementasi fungsi switch yang memanggil Firebase
  const handleManualSwitch = async (target: Source) => {
    if (autoMode || isManualSwitching || !isOnline) return;

    if (target === 'PLN') {
      await switchToPLN();
    } else {
      await switchToPLTS();
    }
    // 'isManualSwitching' akan otomatis update dari hook
  };

  const handleAutoModeToggle = async (checked: boolean) => {
    setIsUpdatingAutoMode(true);
    try {
      // Panggil fungsi update dari hook config
      await updateConfig({ autoMode: checked });
    } catch (error) {
      console.error("Failed to update auto mode:", error);
      // (Opsional: tambahkan toast error di sini)
    } finally {
      setIsUpdatingAutoMode(false);
    }
  };
  
  // Helper untuk data (menghindari error jika data null saat load)
  const plnData = pln || { voltage: 0, current: 0, power: 0, status: false };
  const pltsData = plts || { voltage: 0, current: 0, power: 0, status: false };
  const batteryData = battery || { soc: 0, voltage: 0, status: false };

  // UI Skeleton untuk loading awal
  if (isLoading) {
    return <SwitcherSkeleton />;
  }

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-2.5">
              <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">
                Switch Controller
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Kontrol sumber daya dan mode otomatis
              </p>
            </div>
          </div>
          <Badge 
            variant={isOnline ? "default" : "destructive"}
            className={`transition-all ${isOnline 
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700" 
              : "border border-red-300 dark:border-red-700"
            }`}
          >
            {isOnline ? (
              <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
            ) : (
              <XCircle className="w-3.5 h-3.5 mr-1.5" />
            )}
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </div>

      <Card className="border shadow-sm flex-1">
        <CardContent className="p-4 sm:p-6">
          {/* Auto Mode Toggle */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Power className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    Mode Otomatis
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Perpindahan otomatis berdasarkan SOC Baterai
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isUpdatingAutoMode && (
                  <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                )}
                <Switch
                  checked={autoMode}
                  onCheckedChange={handleAutoModeToggle}
                  disabled={!isOnline || isUpdatingAutoMode}
                />
              </div>
            </div>
          </div>

          {/* Warning ketika auto mode aktif */}
          {autoMode && (
            <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Mode Otomatis Aktif
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Tombol manual dinonaktifkan. Matikan mode otomatis untuk beralih manual.
                </p>
              </div>
            </div>
          )}

          {/* Sumber Aktif Saat Ini */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Sumber Aktif Saat Ini
            </h3>
            <div className={`p-4 rounded-lg border-2 transition-all ${
              activeSource === 'PLN' 
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' 
                : 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeSource === 'PLN' ? (
                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Sun className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  )}
                  <div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {activeSource}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeSource === 'PLN' ? '⚡ Listrik Jaringan (Grid)' : '☀️ Tenaga Surya (Solar)'}
                    </p>
                  </div>
                </div>
                {/* 6. Gunakan state isManualSwitching dari hook */}
                {isManualSwitching && (
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 animate-pulse">
                    <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                    Memindahkan...
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Tombol Kontrol Manual */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Kontrol Manual
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Tombol PLN */}
              <Card className={`transition-all duration-200 ${
                activeSource === 'PLN' 
                  ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:border-slate-300 dark:hover:border-slate-600'
              } ${
                autoMode || !isOnline || isManualSwitching 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              }`}
              onClick={() => handleManualSwitch('PLN')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        activeSource === 'PLN'
                          ? 'bg-blue-500'
                          : 'bg-blue-100 dark:bg-blue-900/40'
                      }`}>
                        <Zap className={`w-5 h-5 ${
                          activeSource === 'PLN'
                            ? 'text-white'
                            : 'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">
                          PLN
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Listrik Jaringan
                        </p>
                      </div>
                    </div>
                    {activeSource === 'PLN' && !isManualSwitching && (
                      <Badge className="bg-blue-500 text-white">Aktif</Badge>
                    )}
                  </div>
                  
                  {/* 7. Tampilkan data asli */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Voltage:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {plnData.status ? formatVoltage(plnData.voltage) : 'Off'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Current:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {plnData.status ? formatCurrent(plnData.current) : 'Off'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Power:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {plnData.status ? formatPower(plnData.power) : 'Off'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tombol PLTS */}
              <Card className={`transition-all duration-200 ${
                activeSource === 'PLTS' 
                  ? 'border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                  : 'hover:border-slate-300 dark:hover:border-slate-600'
              } ${
                autoMode || !isOnline || isManualSwitching 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer'
              }`}
              onClick={() => handleManualSwitch('PLTS')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        activeSource === 'PLTS'
                          ? 'bg-orange-500'
                          : 'bg-orange-100 dark:bg-orange-900/40'
                      }`}>
                        <Sun className={`w-5 h-5 ${
                          activeSource === 'PLTS'
                            ? 'text-white'
                            : 'text-orange-600 dark:text-orange-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">
                          PLTS
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Tenaga Surya
                        </p>
                      </div>
                    </div>
                    {activeSource === 'PLTS' && !isManualSwitching && (
                      <Badge className="bg-orange-500 text-white">Aktif</Badge>
                    )}
                  </div>
                  
                  {/* 7. Tampilkan data asli */}
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Voltage:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {pltsData.status ? formatVoltage(pltsData.voltage) : 'Off'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Current:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {pltsData.status ? formatCurrent(pltsData.current) : 'Off'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Power:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {pltsData.status ? formatPower(pltsData.power) : 'Off'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Status Baterai */}
          <div className={`mt-6 p-4 rounded-lg border ${
            batteryData.status 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
              : 'bg-slate-50 dark:bg-slate-800/20 border-slate-200 dark:border-slate-700'
          }`}>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
              <BatteryCharging className="w-5 h-5" />
              Status Baterai
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">SOC</p>
                <p className={`text-lg font-bold ${getSOCColor(batteryData.soc)}`}>
                  {batteryData.status ? formatSOC(batteryData.soc) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Voltage</p>
                <p className={`text-lg font-bold ${
                  batteryData.status ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'
                }`}>
                  {batteryData.status ? formatVoltage(batteryData.voltage) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Status</p>
                <Badge className={batteryData.status 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-slate-100 text-slate-700"
                }>
                  {batteryData.status ? "Active" : "Offline"}
                </Badge>
              </div>
            </div>
          </div>
          
          {/* 8. Hapus tombol "Refresh" dan "Emergency Stop" */}
        </CardContent>
      </Card>
    </div>
  );
}

// Komponen Skeleton untuk loading
const SwitcherSkeleton = () => {
  return (
    <div className="w-full flex flex-col h-full">
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>

      <Card className="border shadow-sm flex-1">
        <CardContent className="p-4 sm:p-6">
          {/* Auto Mode Skeleton */}
          <Skeleton className="h-20 w-full mb-6 rounded-lg" />

          {/* Active Source Skeleton */}
          <div className="mb-6">
            <Skeleton className="h-4 w-32 mb-3" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>

          {/* Manual Switch Skeleton */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Skeleton className="h-36 w-full rounded-lg" />
              <Skeleton className="h-36 w-full rounded-lg" />
            </div>
          </div>

          {/* Battery Status Skeleton */}
          <Skeleton className="h-28 w-full mt-6 rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}