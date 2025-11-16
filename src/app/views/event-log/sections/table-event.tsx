"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// 1. Impor "RefreshCw" untuk ikon tombol baru
import { 
  Calendar, 
  Database, 
  Eye, 
  Loader2, 
  AlertTriangle, 
  RefreshCw // <-- Mengganti PlusSquare
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { useFirestoreLogs } from "@/hooks/use-firestore-logs";
import { ProcessedFirestoreLog } from "@/lib/firebase/firestore";
import { formatTimestamp, formatPower, formatSOC } from "@/lib/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";
import { LogDetailModal } from "./log-detail-modal"; 

export default function TableEvent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // 3. Panggil hook 'refresh' dari useFirestoreLogs
  const { logs, loading, error, refresh } = useFirestoreLogs(100);
  
  const [selectedLog, setSelectedLog] = useState<ProcessedFirestoreLog | null>(null);

  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = logs.slice(startIndex, endIndex);

  const getSourceColor = (source: 'PLN' | 'PLTS') => {
    return source === 'PLN' 
      ? 'text-blue-700 dark:text-blue-400'
      : 'text-orange-700 dark:text-orange-400';
  };

  const getSourceIcon = (source: 'PLN' | 'PLTS') => {
    return source === 'PLN' ? '⚡' : '☀️';
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => { e.preventDefault(); setCurrentPage(i); }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink href="#" isActive={currentPage === 1} onClick={(e) => { e.preventDefault(); setCurrentPage(1); }}>1</PaginationLink>
        </PaginationItem>
      );
      if (currentPage > 3) {
        items.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink href="#" isActive={currentPage === i} onClick={(e) => { e.preventDefault(); setCurrentPage(i); }}>{i}</PaginationLink>
          </PaginationItem>
        );
      }
      if (currentPage < totalPages - 2) {
        items.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink href="#" isActive={currentPage === totalPages} onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }}>{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }
    return items;
  };

  const renderSkeletons = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell><Skeleton className="h-6 w-24" /></TableCell>
        <TableCell><Skeleton className="h-8 w-20" /></TableCell>
      </TableRow>
    ));
  };

  const renderMobileSkeletons = () => {
    return Array.from({ length: 3 }).map((_, index) => (
      <Card key={`mob-skeleton-${index}`} className="overflow-hidden border shadow-sm">
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full" />
          <div className="grid grid-cols-3 gap-3 pt-3 border-t dark:border-slate-700">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-2.5">
            <Database className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">Sensor Logs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Full sensor history from Firestore</p>
          </div>
        </div>
        
        {/* 6. Tombol refresh ditambahkan di sini */}
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
            <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {/* Logika loading diubah agar hanya tampil saat fetch awal */}
              {loading && logs.length === 0 ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                `${logs.length} Logs`
              )}
            </span>
          </div>

          {/* PERBAIKAN: Tombol Refresh ditambahkan 
            - Menggunakan fungsi 'refresh' dari hook.
            - Menampilkan 'Loader2' saat loading.
          */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => refresh()} 
            disabled={loading}
            className="shadow-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            <span className="sr-only">Refresh Logs</span>
          </Button>

        </div>
      </div>

      <Card className="border shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-4 sm:p-6">
           {/* Desktop Table */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Active Source</TableHead>
                  <TableHead>Battery SOC</TableHead>
                  <TableHead>PLN Power</TableHead>
                  <TableHead>PLTS Power</TableHead>
                  <TableHead className="text-center">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  renderSkeletons()
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-red-500">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                      Failed to load data: {error}
                    </TableCell>
                  </TableRow>
                ) : currentLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-slate-500">
                      No logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  currentLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-bold ${getSourceColor(log.ats.activeSource)}`}>
                          {getSourceIcon(log.ats.activeSource)} {log.ats.activeSource}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          {formatSOC(log.battery.soc)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {log.pln.status ? formatPower(log.pln.power) : 'Off'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {log.plts.status ? formatPower(log.plts.power) : 'Off'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {loading ? (
              renderMobileSkeletons()
            ) : error ? (
               <div className="text-center py-10 text-red-500">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                  Failed to load data: {error}
                </div>
            ) : currentLogs.length === 0 ? (
               <div className="text-center py-10 text-slate-500">
                  No logs found.
                </div>
            ) : (
              currentLogs.map((log) => (
                <Card key={log.id} className="overflow-hidden border shadow-sm">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Calendar className="w-3 h-3" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                      <span className={`text-sm font-bold ${getSourceColor(log.ats.activeSource)}`}>
                        {getSourceIcon(log.ats.activeSource)} {log.ats.activeSource}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-3 border-t dark:border-slate-700">
                      <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-2.5 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">SOC</p>
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          {formatSOC(log.battery.soc)}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">PLN</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {log.pln.status ? formatPower(log.pln.power) : 'Off'}
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5 text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">PLTS</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {log.plts.status ? formatPower(log.plts.power) : 'Off'}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Full Details
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Pagination Info & Controls */}
          {!loading && !error && logs.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Showing <span className="text-slate-800 dark:text-slate-200 font-semibold">{startIndex + 1}</span> to <span className="text-slate-800 dark:text-slate-200 font-semibold">{Math.min(endIndex, logs.length)}</span> of <span className="text-slate-800 dark:text-slate-200 font-semibold">{logs.length}</span> logs
              </div>
              
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
      
      <LogDetailModal 
        isOpen={!!selectedLog} 
        onClose={() => setSelectedLog(null)} 
        log={selectedLog} 
      />
    </div>
  );
}