export const BATTERY_CONFIG = {
  NOMINAL_VOLTAGE: 12.0,
  CAPACITY_AH: 100.0,
  get CAPACITY_WH() {
    return this.NOMINAL_VOLTAGE * this.CAPACITY_AH;
  }
} as const;

export const SOC_THRESHOLDS = {
  CUTOFF: 40.0,      // Switch to PLN when SOC <= 40%
  RECONNECT: 80.0,    // Switch to PLTS when SOC >= 80%
  LOW: 20.0,          // Critical low
  FULL: 95.0          // Considered full
} as const;

export const VOLTAGE_THRESHOLDS = {
  MIN_CUTOFF: 11.5,   // Minimum voltage cutoff
  NOMINAL: 12.0,      // Nominal voltage
  FULL: 13.8,         // Full charge voltage
  CRITICAL: 11.0      // Critical low voltage
} as const;

export function calculateSOCFromEnergy(consumedWh: number): number {
  const remaining = BATTERY_CONFIG.CAPACITY_WH - consumedWh;
  let soc = (remaining / BATTERY_CONFIG.CAPACITY_WH) * 100.0;
  
  // Clamp between 0-100
  if (soc > 100.0) soc = 100.0;
  if (soc < 0.0) soc = 0.0;
  
  return soc;
}

export function estimateSOCFromVoltage(voltage: number): number {
  const voltageMap: [number, number][] = [
    [12.7, 100],
    [12.5, 90],
    [12.4, 80],
    [12.3, 70],
    [12.2, 60],
    [12.1, 50],
    [12, 40],
    [11.9, 30],
    [11.8, 20],
    [11.5, 10],
    [11, 0]
  ];
  
  for (let i = 0; i < voltageMap.length - 1; i++) {
    const [v1, soc1] = voltageMap[i];
    const [v2, soc2] = voltageMap[i + 1];
    
    if (voltage >= v2 && voltage <= v1) {
      const ratio = (voltage - v2) / (v1 - v2);
      return soc2 + ratio * (soc1 - soc2);
    }
  }
  
  // Out of range
  if (voltage > 12.7) return 100;
  if (voltage < 11.0) return 0;
  
  return 0;
}

export function calculateRemainingTime(soc: number, powerDraw: number): number {
  if (powerDraw <= 0) return Infinity;
  
  const remainingWh = (soc / 100) * BATTERY_CONFIG.CAPACITY_WH;
  const hours = remainingWh / powerDraw;
  
  return hours * 60; // Convert to minutes
}

export function calculateEfficiency(power: number, voltage: number, current: number): number {
  if (voltage === 0 || current === 0) return 0;
  
  const apparentPower = voltage * current;
  if (apparentPower === 0) return 0;
  
  return (power / apparentPower) * 100;
}

export function shouldSwitchToPLN(soc: number, voltage: number): boolean {
  return soc <= SOC_THRESHOLDS.CUTOFF || voltage <= VOLTAGE_THRESHOLDS.MIN_CUTOFF;
}

export function shouldSwitchToPLTS(soc: number): boolean {
  return soc >= SOC_THRESHOLDS.RECONNECT;
}

export function getSOCStatusLevel(soc: number): 'critical' | 'low' | 'normal' | 'good' | 'full' {
  if (soc >= SOC_THRESHOLDS.FULL) return 'full';
  if (soc >= SOC_THRESHOLDS.RECONNECT) return 'good';
  if (soc >= SOC_THRESHOLDS.CUTOFF) return 'normal';
  if (soc >= SOC_THRESHOLDS.LOW) return 'low';
  return 'critical';
}

export function calculateEnergySavings(pltsEnergy: number, costPerKWh: number = 1444): number {
  return pltsEnergy * costPerKWh;
}

export function calculatePower(voltage: number, current: number): number {
  return voltage * current;
}

export function whToKWh(wh: number): number {
  return wh / 1000;
}

export function kWhToWh(kwh: number): number {
  return kwh * 1000;
}

export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

export function getBatteryHealthStatus(
  voltage: number, 
  soc: number
): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
  const voltageHealth = voltage >= VOLTAGE_THRESHOLDS.NOMINAL;
  const socHealth = soc >= SOC_THRESHOLDS.CUTOFF;
  
  if (voltage >= VOLTAGE_THRESHOLDS.FULL && soc >= SOC_THRESHOLDS.FULL) {
    return 'excellent';
  }
  if (voltageHealth && socHealth) {
    return 'good';
  }
  if (voltage >= VOLTAGE_THRESHOLDS.MIN_CUTOFF && soc >= SOC_THRESHOLDS.LOW) {
    return 'fair';
  }
  if (voltage >= VOLTAGE_THRESHOLDS.CRITICAL) {
    return 'poor';
  }
  return 'critical';
}