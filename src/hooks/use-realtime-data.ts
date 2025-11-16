"use client"

import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase/config';
import { RealtimeData, ProcessedBatteryData } from '@/types/telemetry';
import { processBatteryData, validateBatteryData } from '@/lib/utils/battery-soc';

const DEVICE_ID = 'ATS001';

export function useRealtimeData() {
  const [data, setData] = useState<RealtimeData | null>(null);
  const [processedBattery, setProcessedBattery] = useState<ProcessedBatteryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const dataRef = ref(database, `devices/${DEVICE_ID}/realtime`);

    const unsubscribe = onValue(
      dataRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const realtimeData = snapshot.val() as RealtimeData;
          
          // ✅ Validate & process battery data
          if (realtimeData.battery && validateBatteryData(realtimeData.battery)) {
            const processed = processBatteryData(realtimeData.battery);
            setProcessedBattery(processed);
          } else {
            setProcessedBattery(null);
          }
          
          setData(realtimeData);
          setIsConnected(true);
          setError(null);
        } else {
          setError('No data available');
          setIsConnected(false);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        setIsConnected(false);
      }
    );

    return () => {
      off(dataRef);
      unsubscribe();
    };
  }, []);

  return { 
    data, 
    loading, 
    error,
    isConnected,
    pln: data?.pln || null,
    plts: data?.plts || null,
    battery: processedBattery || null,  // ✅ Return processed battery with SOC
    ats: data?.ats || null
  };
}

// ✅ FIXED: useBatterySOC now calculates SOC correctly
export function useBatterySOC() {
  const { battery } = useRealtimeData();
  
  return {
    soc: battery?.soc || 0,  // ✅ Now from processed data
    voltage: battery?.voltage || 0,
    consumedWh: battery?.consumedWh || 0,
    remainingWh: battery?.remainingWh || 0,
    status: battery?.status || false,
    socStatus: battery?.socStatus || 'critical',
    isLow: (battery?.soc || 0) <= 40,
    isFull: (battery?.soc || 0) >= 80,
    isCritical: (battery?.soc || 0) <= 20
  };
}

export function useATSStatus() {
  const { ats } = useRealtimeData();
  
  return {
    activeSource: ats?.activeSource || 'PLN',
    isPLNActive: ats?.activeSource === 'PLN',
    isPLTSActive: ats?.activeSource === 'PLTS',
    lastSwitchTime: ats?.lastSwitchTime || 0
  };
}