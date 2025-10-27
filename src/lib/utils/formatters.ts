export function formatVoltage(voltage: number): string {
  return `${voltage.toFixed(2)} V`;
}

export function formatCurrent(current: number): string {
  return `${current.toFixed(2)} A`;
}

export function formatPower(power: number): string {
  if (power >= 1000) {
    return `${(power / 1000).toFixed(2)} kW`;
  }
  return `${power.toFixed(2)} W`;
}

export function formatEnergy(energy: number): string {
  return `${energy.toFixed(3)} kWh`;
}

export function formatFrequency(frequency: number): string {
  return `${frequency.toFixed(1)} Hz`;
}

export function formatPowerFactor(pf: number): string {
  return pf.toFixed(2);
}

export function formatSOC(soc: number): string {
  return `${soc.toFixed(1)}%`;
}

export function getSOCColor(soc: number): string {
  if (soc >= 80) return 'text-green-600 dark:text-green-400';
  if (soc >= 40) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export function getSOCStatus(soc: number): string {
  if (soc >= 80) return 'Full';
  if (soc >= 40) return 'Normal';
  return 'Low';
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} hari yang lalu`;
  if (hours > 0) return `${hours} jam yang lalu`;
  if (minutes > 0) return `${minutes} menit yang lalu`;
  return `${seconds} detik yang lalu`;
}

export function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function getSourceIcon(source: 'PLN' | 'PLTS'): string {
  return source === 'PLN' ? '⚡' : '☀️';
}

export function getSourceColor(source: 'PLN' | 'PLTS'): string {
  return source === 'PLN' 
    ? 'text-blue-600 dark:text-blue-400' 
    : 'text-orange-600 dark:text-orange-400';
}