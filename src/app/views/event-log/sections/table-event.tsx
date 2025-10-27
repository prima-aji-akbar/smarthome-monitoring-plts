"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, Calendar, Zap } from "lucide-react";
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

interface SwitchEvent {
  id: string;
  timestamp: number;
  from: 'PLN' | 'PLTS';
  to: 'PLN' | 'PLTS';
  currentSource: 'PLN' | 'PLTS';
  reason: 'manual' | 'auto_soc_low' | 'auto_soc_high' | 'auto_voltage_low';
  batterySoc?: number;
  batteryVoltage?: number;
}

const generateDummyEvents = (): SwitchEvent[] => {
  const events: SwitchEvent[] = [];
  const reasons: SwitchEvent['reason'][] = ['manual', 'auto_soc_low', 'auto_soc_high', 'auto_voltage_low'];
  
  let currentSource: 'PLN' | 'PLTS' = 'PLN';
  
  for (let i = 0; i < 50; i++) {
    const reason = reasons[Math.floor(Math.random() * reasons.length)];
    const from: 'PLN' | 'PLTS' = currentSource;
    const to: 'PLN' | 'PLTS' = from === 'PLN' ? 'PLTS' : 'PLN';
    
    let batterySoc: number;
    let batteryVoltage: number;
    
    if (reason === 'auto_soc_low') {
      batterySoc = Math.floor(Math.random() * 20);
      batteryVoltage = 46 + Math.random() * 2;
    } else if (reason === 'auto_soc_high') {
      batterySoc = 80 + Math.floor(Math.random() * 20);
      batteryVoltage = 52 + Math.random() * 2;
    } else if (reason === 'auto_voltage_low') {
      batterySoc = Math.floor(Math.random() * 30);
      batteryVoltage = 44 + Math.random() * 2;
    } else {
      batterySoc = Math.floor(Math.random() * 100);
      batteryVoltage = 48 + Math.random() * 6;
    }
    
    events.push({
      id: `evt_${Date.now()}_${i}`,
      timestamp: Date.now() - (i * 3600000),
      from,
      to,
      currentSource: to,
      reason,
      batterySoc,
      batteryVoltage,
    });
    
    currentSource = to;
  }
  
  return events.sort((a, b) => b.timestamp - a.timestamp);
};

export default function TableEvent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [events] = useState<SwitchEvent[]>(generateDummyEvents());

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReasonLabel = (reason: SwitchEvent['reason']) => {
    const labels = {
      manual: '👤 Manual',
      auto_soc_low: '🔋 SOC Low',
      auto_soc_high: '⚡ SOC High',
      auto_voltage_low: '⚠️ Voltage Low',
    };
    return labels[reason];
  };

  const getReasonColor = (reason: SwitchEvent['reason']) => {
    const colors = {
      manual: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      auto_soc_low: 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
      auto_soc_high: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
      auto_voltage_low: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    };
    return colors[reason];
  };

  const getSourceColor = (source: 'PLN' | 'PLTS') => {
    return source === 'PLN' 
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
      : 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400';
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
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            href="#"
            isActive={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(i);
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href="#"
            isActive={currentPage === totalPages}
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-2.5">
            <ArrowRightLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">Event Log</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Switch History & Activity</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
          <Calendar className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{events.length} Events</span>
        </div>
      </div>

      <Card className="border shadow-sm bg-white dark:bg-slate-900">
        <CardContent className="p-4 sm:p-6">
          {/* Desktop Table */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      Timestamp
                    </div>
                  </TableHead>
                  <TableHead>Switch Path</TableHead>
                  <TableHead>Current Source</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-center">Battery SOC</TableHead>
                  <TableHead className="text-center">Voltage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEvents.map((event, index) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          index === 0 ? 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200' :
                          'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                          {startIndex + index + 1}
                        </div>
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getSourceColor(event.from)}`}>
                          {getSourceIcon(event.from)} {event.from}
                        </span>
                        <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getSourceColor(event.to)}`}>
                          {getSourceIcon(event.to)} {event.to}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${
                          event.currentSource === 'PLN' 
                            ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700'
                            : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700'
                        }`}>
                          {getSourceIcon(event.currentSource)} {event.currentSource}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getReasonColor(event.reason)}`}>
                        {getReasonLabel(event.reason)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg">
                        <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                        <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          {event.batterySoc !== undefined ? `${event.batterySoc}%` : '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {event.batteryVoltage !== undefined 
                          ? `${event.batteryVoltage.toFixed(2)}V` 
                          : '-'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {currentEvents.map((event, index) => (
              <Card 
                key={event.id} 
                className="overflow-hidden border shadow-sm"
              >
                <div className={`p-3 ${getReasonColor(event.reason)}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      {getReasonLabel(event.reason)}
                    </span>
                    <span className="text-xs font-medium bg-white/40 dark:bg-black/20 px-2 py-1 rounded">
                      #{startIndex + index + 1}
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(event.timestamp)}
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 py-2">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getSourceColor(event.from)}`}>
                      {getSourceIcon(event.from)} {event.from}
                    </span>
                    <ArrowRightLeft className="w-4 h-4 text-slate-400" />
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getSourceColor(event.to)}`}>
                      {getSourceIcon(event.to)} {event.to}
                    </span>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border-2 border-slate-200 dark:border-slate-700">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1.5">Active Source</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                      event.currentSource === 'PLN'
                        ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400'
                        : 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                    }`}>
                      <span className="text-base">{getSourceIcon(event.currentSource)}</span>
                      {event.currentSource}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t dark:border-slate-700">
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-2.5">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Battery SOC</p>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-500" />
                        <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                          {event.batterySoc !== undefined ? `${event.batterySoc}%` : '-'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5">
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Voltage</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {event.batteryVoltage !== undefined 
                          ? `${event.batteryVoltage.toFixed(2)}V` 
                          : '-'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination Info & Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Showing <span className="text-slate-800 dark:text-slate-200 font-semibold">{startIndex + 1}</span> to <span className="text-slate-800 dark:text-slate-200 font-semibold">{Math.min(endIndex, events.length)}</span> of <span className="text-slate-800 dark:text-slate-200 font-semibold">{events.length}</span> events
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                
                {renderPaginationItems()}
                
                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}