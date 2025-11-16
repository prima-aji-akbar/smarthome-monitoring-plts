import BatteryStatus from "./sections/battery-status";
import BatteryUsage from "./sections/battery-usage";
import Overview from "./sections/overview";
import RealtimeActivity from "./sections/real-time-activity";
import VawActivity from "./sections/vaw-activity";
import PLNStatus from "./sections/pln-status";
import PLTSStatus from "./sections/plts-status";

export default function Dashboard() {
  return (
    <div className="w-full">
      {/* PERBAIKAN: 
        - Menggunakan padding yang lebih konsisten (p-4 md:p-6 lg:p-8).
        - Mengganti bg-[var(--body-background)] dengan bg-slate-50 dark:bg-slate-950
          untuk latar belakang yang sedikit berbeda dari body utama (opsional, tapi rapi).
      */}
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-[100%] mx-auto">
          {/* PERBAIKAN UTAMA:
            - Menggabungkan 2 grid terpisah menjadi 1 grid 12 kolom.
            - Menggunakan gap-4 atau md:gap-6 untuk spasi yang lebih konsisten.
            - Mengatur ulang urutan komponen.
            - Menghapus 'flex' dari div wrapper komponen agar tinggi komponen pas.
          */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            
            {/* Baris 1: Overview (Status, Uptime, dll) */}
            <div className="w-full lg:col-span-12">
              <Overview />
            </div>

            {/* Baris 2: Kartu Status Utama (Pindah ke atas) */}
            <div className="w-full lg:col-span-4">
              <BatteryStatus/>
            </div>
            <div className="w-full lg:col-span-4">
              <PLNStatus />
            </div>
            <div className="w-full lg:col-span-4">
              <PLTSStatus />
            </div>

            {/* Baris 3: Chart Power & SOC Realtime */}
            <div className="w-full lg:col-span-6">
              <RealtimeActivity />
            </div>
            <div className="w-full lg:col-span-6">
              <BatteryUsage/>
            </div>

            {/* Baris 4: VAW Activity (sekarang realtime) */}
            <div className="w-full lg:col-span-12">
              <VawActivity/>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}