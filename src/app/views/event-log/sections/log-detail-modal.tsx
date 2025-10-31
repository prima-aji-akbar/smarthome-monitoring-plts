"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ProcessedFirestoreLog } from "@/lib/firebase/firestore"
import {
  formatTimestamp,
  formatVoltage,
  formatCurrent,
  formatPower,
  formatEnergy,
  formatFrequency,
  formatPowerFactor,
  formatSOC,
  getSOCColor
} from "@/lib/utils/formatters"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface LogDetailModalProps {
  isOpen: boolean
  onClose: () => void
  log: ProcessedFirestoreLog | null
}

// Komponen kecil untuk menampilkan detail
const DataRow = ({ label, value, unit }: { label: string, value: string | number | undefined, unit?: string }) => {
  if (value === undefined || value === null) return null
  
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
      <span className="text-sm text-slate-600 dark:text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value} {unit}
      </span>
    </div>
  )
}

export function LogDetailModal({ isOpen, onClose, log }: LogDetailModalProps) {
  if (!log) return null

  const getSourceColor = (source: 'PLN' | 'PLTS') => {
    return source === 'PLN'
      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
      : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* ✅ PERUBAHAN DI SINI:
        - "max-w-xl" diubah menjadi "w-[90vw] rounded-lg sm:w-full sm:max-w-xl"
        - Ini akan membuat lebar modal 90% di mobile (memberi padding)
        - dan mengembalikannya ke max-w-xl di layar 'sm' ke atas.
      */}
      <DialogContent className="w-[90vw] rounded-lg sm:w-full sm:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Detail Log Rekaman</DialogTitle>
          <DialogDescription>
            Snapshot lengkap data sensor pada:
            <br />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {formatTimestamp(log.timestamp)}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Badge
            className={`text-base font-bold w-full justify-center py-2 ${getSourceColor(log.ats.activeSource)}`}
          >
            {log.ats.activeSource === 'PLN' ? '⚡' : '☀️'} Sumber Aktif: {log.ats.activeSource}
          </Badge>
          <Badge
            variant="outline"
            className={`text-base font-bold w-full justify-center py-2 ${getSOCColor(log.battery.soc)}`}
          >
            🔋 SOC: {formatSOC(log.battery.soc)}
          </Badge>
        </div>

        {/* ✅ PERUBAHAN DI SINI:
          - "md:grid-cols-3" diubah menjadi "sm:grid-cols-3"
          - Ini membuat layout 3 kolom aktif lebih cepat (di layar 'sm')
          - "gap-6" diubah menjadi "gap-4"
        */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t dark:border-slate-700">
          {/* PLN Details */}
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-blue-600 dark:text-blue-400 mb-2">⚡ Data PLN</h4>
            {log.pln.status ? (
              <>
                <DataRow label="Voltage" value={formatVoltage(log.pln.voltage)} />
                <DataRow label="Current" value={formatCurrent(log.pln.current)} />
                <DataRow label="Power" value={formatPower(log.pln.power)} />
                <DataRow label="Energy" value={formatEnergy(log.pln.energy)} />
                <DataRow label="Frequency" value={formatFrequency(log.pln.frequency)} />
                <DataRow label="PF" value={formatPowerFactor(log.pln.pf)} />
              </>
            ) : (
              <span className="text-sm text-slate-500 italic">PLN Off</span>
            )}
          </div>

          {/* PLTS Details */}
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-orange-600 dark:text-orange-400 mb-2">☀️ Data PLTS</h4>
            {log.plts.status ? (
              <>
                <DataRow label="Voltage" value={formatVoltage(log.plts.voltage)} />
                <DataRow label="Current" value={formatCurrent(log.plts.current)} />
                <DataRow label="Power" value={formatPower(log.plts.power)} />
                <DataRow label="Energy" value={formatEnergy(log.plts.energy)} />
                <DataRow label="Frequency" value={formatFrequency(log.plts.frequency)} />
                <DataRow label="PF" value={formatPowerFactor(log.plts.pf)} />
              </>
            ) : (
              <span className="text-sm text-slate-500 italic">PLTS Off</span>
            )}
          </div>

          {/* Battery Details */}
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-green-600 dark:text-green-400 mb-2">🔋 Data Baterai</h4>
            {log.battery.status ? (
              <>
                <DataRow label="SOC" value={formatSOC(log.battery.soc)} />
                <DataRow label="Voltage" value={formatVoltage(log.battery.voltage)} />
                <DataRow label="Current" value={formatCurrent(log.battery.current)} />
                <DataRow label="Power" value={formatPower(log.battery.power)} />
                <DataRow label="Consumed" value={log.battery.consumedWh.toFixed(2)} unit="Wh" />
              </>
            ) : (
              <span className="text-sm text-slate-500 italic">Baterai Off</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}