"use client"

import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase/config';
import { RealtimeData } from '@/types/telemetry';

const DEVICE_ID = 'ATS001'; // Sesuaikan dengan device ID Anda

export function useRealtimeData() {
  const [data, setData] = useState<RealtimeData | null>(null);
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
        console.error('Firebase error:', err);
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
    battery: data?.battery || null,
    ats: data?.ats || null
  };
}

export function useBatterySOC() {
  const { battery } = useRealtimeData();
  
  return {
    soc: battery?.soc || 0,
    voltage: battery?.voltage || 0,
    status: battery?.status || false,
    isLow: (battery?.soc || 0) <= 40,
    isFull: (battery?.soc || 0) >= 80
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