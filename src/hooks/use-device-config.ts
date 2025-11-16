"use client"

import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/lib/firebase/config';
import { updateDeviceConfig } from '@/lib/firebase/database';
import { DeviceConfig } from '@/types/device';

const DEVICE_ID = 'ATS001';

export function useDeviceConfig() {
  const [config, setConfig] = useState<DeviceConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const configRef = ref(database, `devices/${DEVICE_ID}/config`);

    const unsubscribe = onValue(
      configRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setConfig(snapshot.val() as DeviceConfig);
          setError(null);
        } else {
          setError('No device config found');
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      off(configRef);
      unsubscribe();
    };
  }, []);

  return { 
    config, 
    loading, 
    error,
    autoMode: config?.autoMode ?? true, // Default ke auto saat loading
    updateConfig: updateDeviceConfig // Ekspor fungsi update
  };
}