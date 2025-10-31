"use client"

import { firestore } from "../lib/firebase/config";
import { doc, setDoc } from "firebase/firestore";

// ID Perangkat, sama seperti di config.h
const DEVICE_ID = "ATS001";

/**
 * Helper untuk angka acak
 */
function getRandom(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

/**
 * Membuat satu objek log acak dengan format flat
 * Sesuai dengan yang dibaca oleh parser di lib/firebase/firestore.ts
 */
function generateRandomLogData() {
  const timestamp = Date.now();
  const activeSource = Math.random() > 0.5 ? "PLN" : "PLTS";
  
  const plnStatus = activeSource === "PLN" || Math.random() > 0.3; // PLN bisa tetap on (status true) meski source PLTS
  const pltsStatus = activeSource === "PLTS" || Math.random() > 0.5; // PLTS bisa on/off
  const batteryStatus = true;

  // Nilai SOC (0-100)
  const soc = getRandom(20, 100, 1);
  // Total kapasitas 1200Wh (dari 12V * 100Ah)
  // Hitung consumedWh berdasarkan SOC
  const consumedWh = (1 - (soc / 100)) * 1200;

  const logData = {
    timestamp: timestamp,
    
    // Data PLN
    plnVoltage: plnStatus ? getRandom(210, 230) : 0,
    plnCurrent: plnStatus ? getRandom(0.5, 3) : 0,
    plnPower: plnStatus ? getRandom(100, 700) : 0,
    plnEnergy: getRandom(100, 150), // Energi total (dummy)
    plnFrequency: plnStatus ? getRandom(49.8, 50.2) : 0,
    plnPF: plnStatus ? getRandom(0.8, 1.0) : 0,
    plnStatus: plnStatus,
    
    // Data PLTS
    pltsVoltage: pltsStatus ? getRandom(200, 225) : 0,
    pltsCurrent: pltsStatus ? getRandom(0.5, 2.5) : 0,
    pltsPower: pltsStatus ? getRandom(100, 500) : 0,
    pltsEnergy: getRandom(50, 80), // Energi total (dummy)
    pltsFrequency: pltsStatus ? getRandom(49.8, 50.2) : 0,
    pltsPF: pltsStatus ? getRandom(0.8, 1.0) : 0,
    pltsStatus: pltsStatus,
    
    // Data Baterai
    batteryVoltage: getRandom(11.8, 13.5),
    batteryCurrent: (activeSource === "PLN" ? getRandom(1, 5) : getRandom(-5, -1)), // Positif = charging, Negatif = discharging
    batteryPower: getRandom(50, 150),
    batteryEnergy: getRandom(10, 20), // Energi total (dummy)
    batteryConsumedWh: consumedWh,
    batteryStatus: batteryStatus,
    
    // Data ATS
    atsActiveSource: activeSource,
    atsRelayPLN: activeSource === "PLN",
    atsRelayPLTS: activeSource === "PLTS",
  };
  
  return logData;
}

/**
 * Fungsi utama untuk mengirim log palsu ke Firestore
 */
export async function sendRandomLogToFirestore() {
  try {
    const logData = generateRandomLogData();
    
    // Path harus sama persis: devices/{DEVICE_ID}/logs/{timestamp}
    //
    const docPath = `devices/${DEVICE_ID}/logs/${logData.timestamp}`;
    const docRef = doc(firestore, docPath);
    
    // Gunakan setDoc untuk mengirim data (web SDK v9)
    await setDoc(docRef, logData);
    
    console.log("✅ Dummy log sent to Firestore:", logData.timestamp);
    return logData.timestamp;
  } catch (error) {
    console.error("❌ Error sending dummy log:", error);
    throw error;
  }
}