// lib/firebase/test-connection.ts - ENHANCED VERSION
import { ref, get, onValue, off } from 'firebase/database';
import { collection, getDocs, limit, query, orderBy } from 'firebase/firestore';
import { database, firestore } from '../lib/firebase/config';

const DEVICE_ID = 'ATS001';

/**
 * Test Firebase Realtime Database Connection
 */
export async function testRealtimeDatabase(): Promise<void> {
  console.log('\n🔍 === TESTING REALTIME DATABASE ===');
  
  try {
    const realtimeRef = ref(database, `devices/${DEVICE_ID}/realtime`);
    console.log('📡 Fetching realtime data...');
    
    const snapshot = await get(realtimeRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('✅ RTDB Connection: SUCCESS');
      console.log('📊 Data received:', {
        hasPLN: !!data.pln,
        hasPLTS: !!data.plts,
        hasBattery: !!data.battery,
        hasATS: !!data.ats,
        rawTimestamp: data.timestamp,
        timestamp: data.timestamp ? new Date(data.timestamp).toLocaleString('id-ID') : 'No timestamp'
      });
      
      if (data.battery) {
        console.log('🔋 Battery Sample:', {
          voltage: data.battery.voltage,
          consumedWh: data.battery.consumedWh,
          status: data.battery.status
        });
      }
      
      if (data.ats) {
        console.log('⚡ ATS Status:', {
          activeSource: data.ats.activeSource,
          relayPLN: data.ats.relayPLN,
          relayPLTS: data.ats.relayPLTS
        });
      }
    } else {
      console.log('⚠️  RTDB Connection: SUCCESS but NO DATA found');
    }
  } catch (error) {
    console.error('❌ RTDB Connection: FAILED', error);
  }
}

/**
 * Test Firestore Connection with DETAILED DEBUG
 */
export async function testFirestore(): Promise<void> {
  console.log('\n🔍 === TESTING FIRESTORE (DETAILED) ===');
  
  try {
    const logsRef = collection(firestore, `devices/${DEVICE_ID}/logs`);
    console.log('📡 Fetching logs from Firestore...');
    
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(5));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      console.log('✅ Firestore Connection: SUCCESS');
      console.log(`📊 Found ${snapshot.size} log entries\n`);
      
      // ✅ Show RAW STRUCTURE untuk debugging
      snapshot.docs.forEach((doc, index) => {
        const rawData = doc.data();
        
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`📝 Log ${index + 1} (Document ID: ${doc.id})`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        
        // ✅ Debug timestamp structure
        console.log('🕐 TIMESTAMP DEBUG:');
        console.log('   Raw timestamp field:', rawData.timestamp);
        console.log('   Type:', typeof rawData.timestamp);
        
        if (rawData.timestamp?.integerValue) {
          const ts = parseInt(rawData.timestamp.integerValue, 10);
          console.log('   ✅ Found integerValue:', rawData.timestamp.integerValue);
          console.log('   ✅ Parsed as number:', ts);
          console.log('   ✅ As date:', new Date(ts).toLocaleString('id-ID'));
        } else if (typeof rawData.timestamp === 'number') {
          console.log('   ✅ Direct number:', rawData.timestamp);
          console.log('   ✅ As date:', new Date(rawData.timestamp).toLocaleString('id-ID'));
        } else {
          console.log('   ❌ Unknown format!');
        }
        
        // Sample other fields
        console.log('\n📋 Sample Fields:');
        console.log('   batteryVoltage:', rawData.batteryVoltage);
        console.log('   batteryConsumedWh:', rawData.batteryConsumedWh);
        console.log('   atsActiveSource:', rawData.atsActiveSource);
        
        // Show full structure (first log only)
        if (index === 0) {
          console.log('\n📦 FULL RAW DATA (First Log):');
          console.log(JSON.stringify(rawData, null, 2));
        }
      });
    } else {
      console.log('⚠️  Firestore Connection: SUCCESS but NO LOGS found');
    }
  } catch (error) {
    console.error('❌ Firestore Connection: FAILED', error);
  }
}

/**
 * Test Real-time Listener
 */
export function testRealtimeListener(): () => void {
  console.log('\n🔍 === TESTING REALTIME LISTENER ===');
  console.log('👂 Starting listener for 10 seconds...');
  
  const realtimeRef = ref(database, `devices/${DEVICE_ID}/realtime/timestamp`);
  let updateCount = 0;
  let lastTimestamp = 0;
  
  const unsubscribe = onValue(
    realtimeRef,
    (snapshot) => {
      if (snapshot.exists()) {
        updateCount++;
        const timestamp = snapshot.val() as number;
        const now = Date.now();
        const delay = now - timestamp;
        
        console.log(`📡 Update #${updateCount}:`, {
          rawTimestamp: timestamp,
          timestamp: new Date(timestamp).toLocaleString('id-ID'),
          delay: `${delay}ms`,
          timeSinceLast: lastTimestamp ? `${timestamp - lastTimestamp}ms` : 'First update'
        });
        
        lastTimestamp = timestamp;
      }
    },
    (error) => {
      console.error('❌ Listener error:', error);
    }
  );
  
  setTimeout(() => {
    console.log(`\n✅ Listener test completed. Received ${updateCount} updates in 10 seconds.`);
    off(realtimeRef);
    unsubscribe();
  }, 10000);
  
  return () => {
    off(realtimeRef);
    unsubscribe();
  };
}

/**
 * Test Control Path
 */
export async function testControlPath(): Promise<void> {
  console.log('\n🔍 === TESTING CONTROL PATH ===');
  
  try {
    const controlRef = ref(database, `devices/${DEVICE_ID}/control/manualSwitch`);
    console.log('📡 Reading current control value...');
    
    const snapshot = await get(controlRef);
    
    if (snapshot.exists()) {
      console.log('✅ Control path accessible');
      console.log('📊 Current value:', snapshot.val());
    } else {
      console.log('⚠️  Control path exists but no value set');
    }
  } catch (error) {
    console.error('❌ Control path test: FAILED', error);
  }
}

/**
 * Run all connection tests
 */
export async function runAllTests(): Promise<void> {
  console.log('\n🚀 ==========================================');
  console.log('🚀 FIREBASE CONNECTION DIAGNOSTIC TEST v2.0');
  console.log('🚀 Device ID:', DEVICE_ID);
  console.log('🚀 ==========================================');
  
  await testRealtimeDatabase();
  await testFirestore();
  await testControlPath();
  
  console.log('\n📊 === STARTING REALTIME LISTENER TEST ===');
  testRealtimeListener();
  
  console.log('\n✅ All static tests completed!');
  console.log('💡 Check console for real-time updates in the next 10 seconds...\n');
}

/**
 * Quick connection check
 */
export async function quickConnectionCheck(): Promise<{
  rtdb: boolean;
  firestore: boolean;
  hasRealtimeData: boolean;
  hasLogs: boolean;
}> {
  const result = {
    rtdb: false,
    firestore: false,
    hasRealtimeData: false,
    hasLogs: false
  };
  
  try {
    const realtimeRef = ref(database, `devices/${DEVICE_ID}/realtime`);
    const rtdbSnapshot = await get(realtimeRef);
    result.rtdb = true;
    result.hasRealtimeData = rtdbSnapshot.exists();
    
    const logsRef = collection(firestore, `devices/${DEVICE_ID}/logs`);
    const firestoreSnapshot = await getDocs(query(logsRef, limit(1)));
    result.firestore = true;
    result.hasLogs = !firestoreSnapshot.empty;
  } catch (error) {
    console.error('Quick check error:', error);
  }
  
  return result;
}

// Export untuk browser console
type FirebaseTest = {
  runAll: () => Promise<void>;
  testRTDB: () => Promise<void>;
  testFirestore: () => Promise<void>;
  testListener: () => () => void;
  testControl: () => Promise<void>;
  quickCheck: () => Promise<{
    rtdb: boolean;
    firestore: boolean;
    hasRealtimeData: boolean;
    hasLogs: boolean;
  }>;
};

declare global {
  interface Window {
    firebaseTest?: FirebaseTest;
  }
}

if (typeof window !== 'undefined') {
  window.firebaseTest = {
    runAll: runAllTests,
    testRTDB: testRealtimeDatabase,
    testFirestore: testFirestore,
    testListener: testRealtimeListener,
    testControl: testControlPath,
    quickCheck: quickConnectionCheck
  };
  
  console.log('🔥 Firebase Test v2.0 available in console:');
  console.log('   window.firebaseTest.runAll() - Run all tests');
  console.log('   window.firebaseTest.testFirestore() - Test Firestore with DEBUG');
}