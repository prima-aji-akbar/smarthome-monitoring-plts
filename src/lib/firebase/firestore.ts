import { initializeFirestore, collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore';
import { app } from './config';

const firestore = initializeFirestore(app, {
  ignoreUndefinedProperties: true
});

const DEVICE_ID = 'ATS001';

export interface FirestoreLog {
  id?: string;
  timestamp: number;
  pln: {
    voltage: number;
    current: number;
    power: number;
    energy: number;
    frequency: number;
    pf: number;
    status: boolean;
  };
  plts: {
    voltage: number;
    current: number;
    power: number;
    energy: number;
    frequency: number;
    pf: number;
    status: boolean;
  };
  battery: {
    voltage: number;
    current: number;
    power: number;
    energy: number;
    soc: number;
    consumedWh: number;
    status: boolean;
  };
  ats: {
    activeSource: 'PLN' | 'PLTS';
    relayPLN: boolean;
    relayPLTS: boolean;
  };
}

export async function fetchRecentLogs(limitCount: number = 50): Promise<FirestoreLog[]> {
  try {
    const logsRef = collection(firestore, `devices/${DEVICE_ID}/logs`);
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreLog[];
  } catch (error) {
    console.error('Error fetching Firestore logs:', error);
    throw error;
  }
}

export async function fetchLogsByDateRange(
  startDate: Date, 
  endDate: Date,
  limitCount: number = 100
): Promise<FirestoreLog[]> {
  try {
    const logsRef = collection(firestore, `devices/${DEVICE_ID}/logs`);
    const q = query(
      logsRef,
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      where('timestamp', '<=', Timestamp.fromDate(endDate)),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreLog[];
  } catch (error) {
    console.error('Error fetching logs by date range:', error);
    throw error;
  }
}

export async function fetchDailyLogs(date: Date): Promise<FirestoreLog[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return fetchLogsByDateRange(startOfDay, endOfDay, 1000);
}

export { firestore };