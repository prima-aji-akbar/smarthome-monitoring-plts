"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Beaker, Database, Loader2, Send, Wifi } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { 
  runAllTests, 
  testRealtimeDatabase, 
  testFirestore,
  testRealtimeListener,
  testControlPath
} from "@/test/test-connection";

import { sendRandomLogToFirestore } from "@/test/log-seeder";
// 1. Impor fungsi baru 'sendFullDummySnapshot'
import { sendFullDummySnapshot } from "@/test/realtime-seeder";

export default function TestConnectionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState<string | null>(null);

  const handleRunAllTests = async () => {
    setIsLoading(true);
    console.log("🚀 Memulai semua tes...");
    await runAllTests();
    setIsLoading(false);
  };

  const handleSeedFirestore = async () => {
    setSeedLoading("firestore");
    try {
      await sendRandomLogToFirestore();
      alert("1 log palsu (Firestore) telah dikirim!");
    } catch (e: any) {
      alert("Gagal mengirim log: " + e.message);
    }
    setSeedLoading(null);
  };

  // 2. Ubah handler ini untuk memanggil fungsi baru
  const handleSeedRealtime = async () => {
    setSeedLoading("realtime");
    try {
      // Panggil 'sendFullDummySnapshot'
      await sendFullDummySnapshot();
      alert("1 snapshot palsu LENGKAP (Realtime + Config + Control + EventLog) telah dikirim!");
    } catch (e: any) {
      alert("Gagal mengirim data realtime: " + e.message);
    }
    setSeedLoading(null);
  };

  return (
    <div className="w-full">
      <div className="bg-[var(--body-background)] min-h-screen lg:px-8">
        <div className="w-full max-w-[100%] mx-auto px-3 sm:px-4 py-3 sm:py-4">
          
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-2.5">
              <Beaker className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                Test & Diagnostics
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Jalankan tes koneksi dan kirim data palsu (seeder).
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Kolom Kiri: Tes Koneksi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-blue-500" />
                  Connection Tests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Buka console (F12) untuk melihat hasil. Tes ini akan memeriksa koneksi ke RTDB, Firestore, dan listener.
                </p>
                <Button 
                  onClick={handleRunAllTests} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Activity className="w-4 h-4 mr-2" />
                  )}
                  Run All Diagnostic Tests
                </Button>
                <Separator />
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => testRealtimeDatabase()} disabled={isLoading}>Test RTDB</Button>
                  <Button variant="outline" onClick={() => testFirestore()} disabled={isLoading}>Test Firestore</Button>
                  <Button variant="outline" onClick={() => testControlPath()} disabled={isLoading}>Test Control Path</Button>
                  <Button variant="outline" onClick={() => testRealtimeListener()} disabled={isLoading}>Test Listener (10s)</Button>
                </div>
              </CardContent>
            </Card>

            {/* Kolom Kanan: Seeder Data Palsu */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-green-500" />
                  Dummy Data Seeder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Gunakan ini jika alat (ESP32) sedang offline. Ini akan mengirim data acak ke database untuk mengisi dashboard.
                </p>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={handleSeedFirestore}
                  disabled={seedLoading !== null}
                >
                  {seedLoading === "firestore" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="w-4 h-4 mr-2" />
                  )}
                  Send 1 Dummy Log (to Firestore)
                </Button>

                {/* 3. Perbarui teks tombol */}
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={handleSeedRealtime}
                  disabled={seedLoading !== null}
                >
                  {seedLoading === "realtime" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Activity className="w-4 h-4 mr-2" />
                  )}
                  Send 1 Full Dummy Snapshot (to RTDB)
                </Button>

              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}