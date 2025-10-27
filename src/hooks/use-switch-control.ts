"use client"

import { useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '@/lib/firebase/config';

const DEVICE_ID = 'ATS001';

export function useSwitchControl() {
  const [isSwitching, setIsSwitching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchToPLN = async () => {
    setIsSwitching(true);
    setError(null);
    
    try {
      const controlRef = ref(database, `devices/${DEVICE_ID}/control/manualSwitch`);
      await set(controlRef, 'PLN');
      
      console.log('✅ Switch to PLN command sent');
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to switch';
      setError(errorMsg);
      console.error('❌ Switch error:', err);
      return false;
    } finally {
      setIsSwitching(false);
    }
  };

  const switchToPLTS = async () => {
    setIsSwitching(true);
    setError(null);
    
    try {
      const controlRef = ref(database, `devices/${DEVICE_ID}/control/manualSwitch`);
      await set(controlRef, 'PLTS');
      
      console.log('✅ Switch to PLTS command sent');
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to switch';
      setError(errorMsg);
      console.error('❌ Switch error:', err);
      return false;
    } finally {
      setIsSwitching(false);
    }
  };

  const toggleSwitch = async (currentSource: 'PLN' | 'PLTS') => {
    if (currentSource === 'PLN') {
      return await switchToPLTS();
    } else {
      return await switchToPLN();
    }
  };

  return {
    switchToPLN,
    switchToPLTS,
    toggleSwitch,
    isSwitching,
    error
  };
}