"use client"

import { database } from "@/lib/firebase/config";
import { ref, set, update, child } from "firebase/database"; 
import { BATTERY_CONFIG } from "@/lib/utils/calculations";
import { getDeviceControlRef, getEventLogRef } from "@/lib/firebase/database";
import { SwitchEvent } from "@/types/telemetry";

const DEVICE_ID = "ATS001";

function getRandom(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateRandomRealtimeData() {
  const activeSource = Math.random() > 0.5 ? "PLN" : "PLTS";
  
  const plnStatus = activeSource === "PLN" || Math.random() > 0.3;
  const pltsStatus = activeSource === "PLTS" || Math.random() > 0.5;
  const batteryStatus = true;
  const timestamp = Date.now();

  const soc = getRandom(20, 100, 1);
  const capacityWh = BATTERY_CONFIG.CAPACITY_WH; 
  const consumedWh = (1 - (soc / 100)) * capacityWh; 
  const voltage = getRandom(11.8, 13.5);

  const data = {
    pln: {
      voltage: plnStatus ? getRandom(210, 230) : 0,
      current: plnStatus ? getRandom(0.5, 3) : 0,
      power: plnStatus ? getRandom(100, 700) : 0,
      energy: getRandom(100, 150),
      frequency: plnStatus ? getRandom(49.8, 50.2) : 0,
      pf: plnStatus ? getRandom(0.8, 1.0) : 0,
      status: plnStatus,
    },
    plts: {
      voltage: pltsStatus ? getRandom(200, 225) : 0,
      current: pltsStatus ? getRandom(0.5, 2.5) : 0,
      power: pltsStatus ? getRandom(100, 500) : 0,
      energy: getRandom(50, 80),
      frequency: pltsStatus ? getRandom(49.8, 50.2) : 0,
      pf: pltsStatus ? getRandom(0.8, 1.0) : 0,
      status: pltsStatus,
    },
    battery: {
      voltage: voltage,
      current: (activeSource === "PLN" ? getRandom(1, 5) : getRandom(-5, -1)),
      power: getRandom(50, 150),
      energy: getRandom(10, 20),
      consumedWh: consumedWh,
      status: batteryStatus,
    },
    ats: {
      activeSource: activeSource,
      relayPLN: activeSource === "PLN",
      relayPLTS: activeSource === "PLTS",
      lastSwitchTime: timestamp - 300000,
    },
    timestamp: timestamp,
    config: {
      autoMode: Math.random() > 0.5, // Mengatur AutoMode secara acak
    },
    batterySoc: soc, // Kita simpan untuk eventLog
    batteryVoltage: voltage, // Kita simpan untuk eventLog
  };
  
  return data;
}

export async function sendFullDummySnapshot() {
  try {
    const data = generateRandomRealtimeData();

    // 4. Siapkan semua referensi path
    const realtimeRef = ref(database, `devices/${DEVICE_ID}/realtime`);
    const configRef = ref(database, `devices/${DEVICE_ID}/config`);
    const controlRef = getDeviceControlRef();
    const eventLogRef = getEventLogRef();

    await set(realtimeRef, {
      pln: data.pln,
      plts: data.plts,
      battery: data.battery,
      ats: data.ats,
      timestamp: data.timestamp,
    });

    await update(configRef, data.config);

    await set(ref(database, `devices/${DEVICE_ID}/control/manualSwitch`), "");

    if (Math.random() < 0.2) {
      const fromSource = data.ats.activeSource === "PLN" ? "PLTS" : "PLN";
      const reason: SwitchEvent['reason'] = ['auto_soc_low', 'auto_soc_high', 'auto_voltage_low'][Math.floor(Math.random() * 3)] as SwitchEvent['reason'];
      
      const dummyEvent: Omit<SwitchEvent, 'id'> = {
        timestamp: data.timestamp - 10000,
        from: fromSource,
        to: data.ats.activeSource as 'PLN' | 'PLTS',
        reason: reason,
        batterySoc: data.batterySoc,
        batteryVoltage: data.batteryVoltage,
      };
      
      const newEventRef = child(eventLogRef, `${dummyEvent.timestamp}`);
      await set(newEventRef, dummyEvent);
      console.log("✅ Dummy EventLog juga dikirim!");
    }

    console.log("✅ Snapshot REALTIME lengkap dikirim ke RTDB:", data.timestamp);
    return data.timestamp;
  } catch (error) {
    console.error("❌ Error sending dummy snapshot:", error);
    throw error;
  }
}