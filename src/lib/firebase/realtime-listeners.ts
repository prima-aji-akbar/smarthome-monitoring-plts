// lib/firebase/realtime-listeners.ts
import { ref, onValue, off } from 'firebase/database';
import { database } from './config';
import { PLNData, PLTSData, BatteryData, ATSStatus } from '@/types/telemetry';

const DEVICE_ID = 'ATS001';

export function listenToPLNData(
  callback: (data: PLNData) => void,
  onError?: (error: Error) => void
): () => void {
  const plnRef = ref(database, `devices/${DEVICE_ID}/realtime/pln`);
  
  const unsubscribe = onValue(
    plnRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as PLNData);
      }
    },
    (error) => {
      if (onError) onError(error);
    }
  );
  
  return () => {
    off(plnRef);
    unsubscribe();
  };
}

export function listenToPLTSData(
  callback: (data: PLTSData) => void,
  onError?: (error: Error) => void
): () => void {
  const pltsRef = ref(database, `devices/${DEVICE_ID}/realtime/plts`);
  
  const unsubscribe = onValue(
    pltsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as PLTSData);
      }
    },
    (error) => {
      if (onError) onError(error);
    }
  );
  
  return () => {
    off(pltsRef);
    unsubscribe();
  };
}

export function listenToBatteryData(
  callback: (data: BatteryData) => void,
  onError?: (error: Error) => void
): () => void {
  const batteryRef = ref(database, `devices/${DEVICE_ID}/realtime/battery`);
  
  const unsubscribe = onValue(
    batteryRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as BatteryData);
      }
    },
    (error) => {
      if (onError) onError(error);
    }
  );
  
  return () => {
    off(batteryRef);
    unsubscribe();
  };
}

export function listenToATSStatus(
  callback: (data: ATSStatus) => void,
  onError?: (error: Error) => void
): () => void {
  const atsRef = ref(database, `devices/${DEVICE_ID}/realtime/ats`);
  
  const unsubscribe = onValue(
    atsRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as ATSStatus);
      }
    },
    (error) => {
      if (onError) onError(error);
    }
  );
  
  return () => {
    off(atsRef);
    unsubscribe();
  };
}

export function listenToTimestamp(
  callback: (timestamp: number) => void,
  onError?: (error: Error) => void
): () => void {
  const timestampRef = ref(database, `devices/${DEVICE_ID}/realtime/timestamp`);
  
  const unsubscribe = onValue(
    timestampRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as number);
      }
    },
    (error) => {
      if (onError) onError(error);
    }
  );
  
  return () => {
    off(timestampRef);
    unsubscribe();
  };
}

export function listenToManualSwitch(
  callback: (command: string) => void,
  onError?: (error: Error) => void
): () => void {
  const switchRef = ref(database, `devices/${DEVICE_ID}/control/manualSwitch`);
  
  const unsubscribe = onValue(
    switchRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as string);
      }
    },
    (error) => {
      if (onError) onError(error);
    }
  );
  
  return () => {
    off(switchRef);
    unsubscribe();
  };
}

export function listenToAllRealtimeData(
  onPLN: (data: PLNData) => void,
  onPLTS: (data: PLTSData) => void,
  onBattery: (data: BatteryData) => void,
  onATS: (data: ATSStatus) => void,
  onError?: (error: Error) => void
): () => void {
  const unsubscribers = [
    listenToPLNData(onPLN, onError),
    listenToPLTSData(onPLTS, onError),
    listenToBatteryData(onBattery, onError),
    listenToATSStatus(onATS, onError)
  ];
  
  return () => {
    unsubscribers.forEach(unsub => unsub());
  };
}