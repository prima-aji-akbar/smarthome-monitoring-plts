import { ref, get, set, update, onValue, off, DatabaseReference } from 'firebase/database';
import { database } from './config';
import { RealtimeData, SwitchEvent } from '@/types/telemetry';
import { DeviceConfig } from '@/types/device';

const DEVICE_ID = 'ATS001';

export function getDeviceRealtimeRef(): DatabaseReference {
  return ref(database, `devices/${DEVICE_ID}/realtime`);
}

export function getDeviceControlRef(): DatabaseReference {
  return ref(database, `devices/${DEVICE_ID}/control`);
}

export function getEventLogRef(): DatabaseReference {
  return ref(database, `devices/${DEVICE_ID}/eventLog`);
}

export async function fetchRealtimeData(): Promise<RealtimeData | null> {
  try {
    const dataRef = getDeviceRealtimeRef();
    const snapshot = await get(dataRef);
    
    if (snapshot.exists()) {
      return snapshot.val() as RealtimeData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching realtime data:', error);
    throw error;
  }
}

export async function sendSwitchCommand(target: 'PLN' | 'PLTS'): Promise<boolean> {
  try {
    const controlRef = ref(database, `devices/${DEVICE_ID}/control/manualSwitch`);
    await set(controlRef, target);
    console.log(`✅ Switch command sent: ${target}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending switch command:', error);
    throw error;
  }
}

export async function fetchEventLog(limit: number = 50): Promise<SwitchEvent[]> {
  try {
    const eventRef = getEventLogRef();
    const snapshot = await get(eventRef);
    
    if (snapshot.exists()) {
      const events = snapshot.val();
      const eventArray = Object.entries(events).map(([id, data]) => ({
        id,
        ...(data as Omit<SwitchEvent, 'id'>)
      }));
      
      return eventArray
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
    }
    return [];
  } catch (error) {
    console.error('Error fetching event log:', error);
    throw error;
  }
}

export function subscribeToRealtimeData(
  callback: (data: RealtimeData | null) => void,
  onError?: (error: Error) => void
): () => void {
  const dataRef = getDeviceRealtimeRef();
  
  const unsubscribe = onValue(
    dataRef,
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val() as RealtimeData);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Realtime data subscription error:', error);
      if (onError) onError(error);
    }
  );
  
  return () => {
    off(dataRef);
    unsubscribe();
  };
}

export function subscribeToEventLog(
  callback: (events: SwitchEvent[]) => void,
  limit: number = 50
): () => void {
  const eventRef = getEventLogRef();
  
  const unsubscribe = onValue(eventRef, (snapshot) => {
    if (snapshot.exists()) {
      const events = snapshot.val();
      const eventArray = Object.entries(events).map(([id, data]) => ({
        id,
        ...(data as Omit<SwitchEvent, 'id'>)
      }));
      
      const sortedEvents = eventArray
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);
      
      callback(sortedEvents);
    } else {
      callback([]);
    }
  });
  
  return () => {
    off(eventRef);
    unsubscribe();
  };
}

export async function updateDeviceConfig(config: Partial<DeviceConfig>): Promise<void> {
  try {
    const configRef = ref(database, `devices/${DEVICE_ID}/config`);
    await update(configRef, config);
    console.log('✅ Device config updated');
  } catch (error) {
    console.error('❌ Error updating device config:', error);
    throw error;
  }
}