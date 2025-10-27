export interface DeviceInfo {
  id: string;
  name: string;
  location?: string;
  installedDate?: string;
  lastMaintenance?: string;
}

export interface DeviceConfig {
  batteryNominalVoltage: number;
  batteryCapacityAh: number;
  batteryCapacityWh: number;
  
  socCutoff: number;
  socReconnect: number;
  
  minVoltageCutoff: number;
  
  minSwitchIntervalMs: number;
  sendIntervalMs: number;
  
  autoMode: boolean;
}

export interface DeviceStatus {
  isOnline: boolean;
  lastSeen: number;
  uptime: number;
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  firmwareVersion?: string;
}

export type SwitchCommand = 'PLN' | 'PLTS' | '';

export interface DeviceControl {
  manualSwitch: SwitchCommand;
  autoMode?: boolean;
  resetEnergy?: boolean;
}

export interface DeviceAlert {
  id: string;
  timestamp: number;
  level: 'info' | 'warning' | 'error' | 'critical';
  type: 'battery_low' | 'voltage_low' | 'connection_lost' | 'switch_failure' | 'sensor_error';
  message: string;
  acknowledged?: boolean;
}

export interface DeviceStatistics {
  totalEnergyPLN: number;      // kWh
  totalEnergyPLTS: number;     // kWh
  energySaved: number;          // kWh
  
  totalSwitches: number;
  autoSwitches: number;
  manualSwitches: number;
  
  totalUptime: number;          // seconds
  plnUptime: number;            // seconds
  pltsUptime: number;           // seconds
  
  systemEfficiency: number;     // percentage
  batteryEfficiency: number;    // percentage
}

export interface DeviceHealth {
  overall: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  battery: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  connection: 'excellent' | 'good' | 'fair' | 'poor';
  sensors: {
    pln: boolean;
    plts: boolean;
    battery: boolean;
  };
  lastCheck: number;
}

export interface Device {
  info: DeviceInfo;
  config: DeviceConfig;
  status: DeviceStatus;
  health: DeviceHealth;
  statistics?: DeviceStatistics;
  alerts?: DeviceAlert[];
}

export interface DeviceListItem {
  id: string;
  name: string;
  isOnline: boolean;
  activeSource: 'PLN' | 'PLTS';
  batterySOC: number;
  lastSeen: number;
}