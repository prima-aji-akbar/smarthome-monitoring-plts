// lib/firebase/firestore.ts - FIXED VERSION
import { collection, query, orderBy, limit, getDocs, where, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from './config';
import { calculateBatterySOC } from '@/lib/utils/battery-soc';


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
    consumedWh: number;
    status: boolean;
  };
  ats: {
    activeSource: 'PLN' | 'PLTS';
    relayPLN: boolean;
    relayPLTS: boolean;
  };
}

export interface ProcessedFirestoreLog extends FirestoreLog {
  battery: FirestoreLog['battery'] & {
    soc: number;
  };
}

// ✅ FUNGSI UNTUK PARSE TIMESTAMP DARI FIRESTORE
interface FirestoreDocData {
  timestamp?: { integerValue?: string } | number | { seconds: number; nanos?: number } | null;
}

function parseTimestamp(data: FirestoreDocData): number {
  // Firestore menyimpan timestamp sebagai integerValue (string)
  if (data.timestamp && typeof (data.timestamp as { integerValue?: string }).integerValue === 'string') {
    return parseInt((data.timestamp as { integerValue?: string }).integerValue!, 10);
  }
  
  // Fallback: jika sudah berupa number
  if (typeof data.timestamp === 'number') {
    return data.timestamp;
  }
  
  // Handle Firestore Timestamp object format { seconds, nanos }
  if (data.timestamp && typeof data.timestamp === 'object' && 'seconds' in data.timestamp) {
    const ts = data.timestamp as { seconds: number; nanos?: number };
    return ts.seconds * 1000 + Math.floor((ts.nanos ?? 0) / 1e6);
  }

  // Fallback: gunakan waktu sekarang
  console.warn('⚠️ Invalid timestamp format:', data.timestamp);
  return Date.now();
}

// ✅ FUNGSI UNTUK PARSE FIELD DARI FIRESTORE FORMAT
function parseFirestoreDoc(doc: QueryDocumentSnapshot<DocumentData>): FirestoreLog {
  const data = doc.data();
  
  // Debug log untuk melihat struktur data
  console.log('📄 Raw Firestore doc:', doc.id, data);
  
  // ✅ Parse timestamp dengan benar
  const timestamp = parseTimestamp(data);
  
  console.log('🕐 Parsed timestamp:', {
    raw: data.timestamp,
    parsed: timestamp,
    date: new Date(timestamp).toLocaleString('id-ID')
  });
  
  // ✅ Parse nested fields dari format Firestore
  type FirestoreFieldValue =
    | { doubleValue?: number; integerValue?: string; booleanValue?: boolean; stringValue?: string }
    | number
    | boolean
    | string
    | undefined;
  
  const parseDoubleValue = (field: FirestoreFieldValue): number => {
    if (field && typeof (field as { doubleValue?: number }).doubleValue !== 'undefined') {
      return (field as { doubleValue?: number }).doubleValue as number;
    }
    if (typeof field === 'number') return field;
    return 0;
  };
  
  const parseBoolValue = (field: FirestoreFieldValue): boolean => {
    if (field && typeof (field as { booleanValue?: boolean }).booleanValue !== 'undefined') {
      return Boolean((field as { booleanValue?: boolean }).booleanValue);
    }
    if (typeof field === 'boolean') return field;
    return false;
  };
  
  const parseStringValue = (field: FirestoreFieldValue): string => {
    if (field && typeof (field as { stringValue?: string }).stringValue !== 'undefined') {
      return (field as { stringValue?: string }).stringValue as string;
    }
    if (typeof field === 'string') return field;
    return '';
  };
  
  return {
    id: doc.id,
    timestamp,
    pln: {
      voltage: parseDoubleValue(data.plnVoltage),
      current: parseDoubleValue(data.plnCurrent),
      power: parseDoubleValue(data.plnPower),
      energy: parseDoubleValue(data.plnEnergy),
      frequency: parseDoubleValue(data.plnFrequency),
      pf: parseDoubleValue(data.plnPF),
      status: parseBoolValue(data.plnStatus)
    },
    plts: {
      voltage: parseDoubleValue(data.pltsVoltage),
      current: parseDoubleValue(data.pltsCurrent),
      power: parseDoubleValue(data.pltsPower),
      energy: parseDoubleValue(data.pltsEnergy),
      frequency: parseDoubleValue(data.pltsFrequency),
      pf: parseDoubleValue(data.pltsPF),
      status: parseBoolValue(data.pltsStatus)
    },
    battery: {
      voltage: parseDoubleValue(data.batteryVoltage),
      current: parseDoubleValue(data.batteryCurrent),
      power: parseDoubleValue(data.batteryPower),
      energy: parseDoubleValue(data.batteryEnergy),
      consumedWh: parseDoubleValue(data.batteryConsumedWh),
      status: parseBoolValue(data.batteryStatus)
    },
    ats: {
      activeSource: parseStringValue(data.atsActiveSource) as 'PLN' | 'PLTS',
      relayPLN: parseBoolValue(data.atsRelayPLN),
      relayPLTS: parseBoolValue(data.atsRelayPLTS)
    }
  };
}

function processFirestoreLog(log: FirestoreLog): ProcessedFirestoreLog {
  const soc = calculateBatterySOC(log.battery.consumedWh);
  
  return {
    ...log,
    battery: {
      ...log.battery,
      soc
    }
  };
}

export async function fetchRecentLogs(limitCount: number = 50): Promise<ProcessedFirestoreLog[]> {
  try {
    console.log('🔍 Fetching recent logs from Firestore...');
    
    const logsRef = collection(firestore, `devices/${DEVICE_ID}/logs`);
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(limitCount));
    
    const snapshot = await getDocs(q);
    
    console.log(`📊 Found ${snapshot.size} log documents`);
    
    // ✅ Parse dokumen dengan fungsi baru
    const rawLogs = snapshot.docs.map(doc => parseFirestoreDoc(doc));
    
    return rawLogs.map(processFirestoreLog);
  } catch (error) {
    console.error('❌ Error fetching Firestore logs:', error);
    throw error;
  }
}

export async function fetchLogsByDateRange(
  startDate: Date, 
  endDate: Date,
  limitCount: number = 100
): Promise<ProcessedFirestoreLog[]> {
  try {
    console.log('🔍 Fetching logs by date range:', {
      start: startDate.toLocaleString('id-ID'),
      end: endDate.toLocaleString('id-ID')
    });
    
    const logsRef = collection(firestore, `devices/${DEVICE_ID}/logs`);
    
    const startTimestamp = startDate.getTime();
    const endTimestamp = endDate.getTime();
    
    console.log('📅 Timestamp range:', { startTimestamp, endTimestamp });
    
    const q = query(
      logsRef,
      where('timestamp', '>=', startTimestamp),
      where('timestamp', '<=', endTimestamp),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    console.log(`📊 Found ${snapshot.size} logs in date range`);
    
    // ✅ Parse dokumen dengan fungsi baru
    const rawLogs = snapshot.docs.map(doc => parseFirestoreDoc(doc));
    
    return rawLogs.map(processFirestoreLog);
  } catch (error) {
    console.error('❌ Error fetching logs by date range:', error);
    throw error;
  }
}

export async function fetchDailyLogs(date: Date): Promise<ProcessedFirestoreLog[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  return fetchLogsByDateRange(startOfDay, endOfDay, 1000);
}

export { firestore };