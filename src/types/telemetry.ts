export interface PLNData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  pf: number;
  status: boolean;
}

export interface PLTSData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  pf: number;
  status: boolean;
}

export interface BatteryData {
  voltage: number;
  current: number;
  power: number;
  energy: number;
  consumedWh: number;
  status: boolean;
}

export interface ProcessedBatteryData extends BatteryData {
  soc: number; 
  socStatus: 'critical' | 'low' | 'normal' | 'good' | 'full';
  remainingWh: number;
  estimatedRuntime: number;
}

export interface ATSStatus {
  activeSource: 'PLN' | 'PLTS';
  relayPLN: boolean;
  relayPLTS: boolean;
  lastSwitchTime: number;
}

export interface RealtimeData {
  pln: PLNData;
  plts: PLTSData;
  battery: BatteryData;
  ats: ATSStatus;
  timestamp: number;
}

export interface DeviceData {
  deviceId: string;
  realtime: RealtimeData;
}

export interface ChartDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface VoltageChartData {
  pln: ChartDataPoint[];
  plts: ChartDataPoint[];
  battery: ChartDataPoint[];
}

export interface PowerChartData {
  pln: ChartDataPoint[];
  plts: ChartDataPoint[];
  battery: ChartDataPoint[];
}

export interface SwitchEvent {
  id: string;
  timestamp: number;
  from: 'PLN' | 'PLTS';
  to: 'PLN' | 'PLTS';
  reason: 'manual' | 'auto_soc_low' | 'auto_soc_high' | 'auto_voltage_low';
  batterySoc?: number;
  batteryVoltage?: number;
}