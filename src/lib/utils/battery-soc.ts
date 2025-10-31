// lib/utils/battery-soc.ts
import { BatteryData, ProcessedBatteryData } from '@/types/telemetry';
import { 
  BATTERY_CONFIG, 
  SOC_THRESHOLDS,
  calculateSOCFromEnergy,
  getSOCStatusLevel 
} from './calculations';


export function calculateBatterySOC(consumedWh: number): number {
  return calculateSOCFromEnergy(consumedWh);
}

export function processBatteryData(rawData: BatteryData): ProcessedBatteryData {
  const soc = calculateBatterySOC(rawData.consumedWh);
  const remainingWh = BATTERY_CONFIG.CAPACITY_WH - rawData.consumedWh;
  
  const estimatedRuntime = rawData.power > 0 
    ? (remainingWh / rawData.power) * 60 
    : Infinity;
  
  return {
    ...rawData,
    soc,
    socStatus: getSOCStatusLevel(soc),
    remainingWh: Math.max(0, remainingWh),
    estimatedRuntime: Math.min(estimatedRuntime, 9999) // Cap at 9999 menit
  };
}

export function validateBatteryData(data: BatteryData): boolean {
  return (
    !isNaN(data.voltage) &&
    !isNaN(data.consumedWh) &&
    data.voltage >= 0 &&
    data.consumedWh >= 0 &&
    data.consumedWh <= BATTERY_CONFIG.CAPACITY_WH * 1.5 // Allow 150% for safety
  );
}

export function formatBatterySOC(soc: number): string {
  return `${soc.toFixed(1)}%`;
}

export function getBatteryIcon(soc: number, isCharging: boolean = false): string {
  if (isCharging) return '🔌';
  if (soc >= 80) return '🔋';
  if (soc >= 40) return '🔋';
  if (soc >= 20) return '🪫';
  return '⚠️';
}

export function getBatteryColorClass(soc: number): string {
  if (soc >= 80) return 'text-green-600 dark:text-green-400';
  if (soc >= 40) return 'text-yellow-600 dark:text-yellow-400';
  if (soc >= 20) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}