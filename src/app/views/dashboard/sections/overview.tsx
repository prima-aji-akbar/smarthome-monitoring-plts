"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Heart, Zap, History, ArrowLeftRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Overview() {
    const [uptime, setUptime] = useState(0);
    const [systemStatus,] = useState<'online' | 'offline'>('online');
    const [currentSource,] = useState<'PLN' | 'PLTS'>('PLN');
    const [lastSwitch,] = useState(new Date());

    // Uptime counter
    useEffect(() => {
        const interval = setInterval(() => {
            setUptime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Format uptime to HH:MM:SS
    const formatUptime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Format timestamp
    const formatTimestamp = (date: Date) => {
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="w-full flex flex-col h-full">
            <div className="mb-2 sm:mb-3">
                <h1 className="font-bold text-sm sm:text-base lg:text-lg">Overview</h1>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 flex-1">
                {/* Status Card */}
                <Card className="flex flex-col">
                    <CardContent className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col">
                        <div className="flex gap-1 sm:gap-2 lg:gap-3 pb-1 sm:pb-2 items-center mb-1 sm:mb-2">
                            <Heart className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0" />
                            <h1 className="font-semibold text-[10px] sm:text-xs lg:text-sm truncate">
                                Status
                            </h1>
                        </div>
                        <div className="flex-1 flex items-center">
                            {systemStatus === 'online' ? (
                                <div className="w-full bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded p-1.5 sm:p-2 lg:p-3">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <h1 className="text-[10px] sm:text-xs lg:text-sm font-semibold text-green-700 dark:text-green-300">
                                            Online
                                        </h1>
                                    </div>
                                    <p className="text-[8px] sm:text-[10px] text-green-600 dark:text-green-400 mt-0.5 sm:mt-1">
                                        System Running
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded p-1.5 sm:p-2 lg:p-3">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></div>
                                        <h1 className="text-[10px] sm:text-xs lg:text-sm font-semibold text-red-700 dark:text-red-300">
                                            Offline
                                        </h1>
                                    </div>
                                    <p className="text-[8px] sm:text-[10px] text-red-600 dark:text-red-400 mt-0.5 sm:mt-1">
                                        System Down
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Source Card */}
                <Card className="flex flex-col">
                    <CardContent className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col">
                        <div className="flex gap-1 sm:gap-2 lg:gap-3 pb-1 sm:pb-2 items-center mb-1 sm:mb-2">
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0" />
                            <h1 className="font-semibold text-[10px] sm:text-xs lg:text-sm truncate">
                                Source
                            </h1>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className={`w-full rounded p-1.5 sm:p-2 lg:p-3 ${
                                currentSource === 'PLN' 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700' 
                                    : 'bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700'
                            }`}>
                                <h1 className={`text-xs sm:text-sm lg:text-base font-bold ${
                                    currentSource === 'PLN'
                                        ? 'text-blue-700 dark:text-blue-300'
                                        : 'text-amber-700 dark:text-amber-300'
                                }`}>
                                    {currentSource}
                                </h1>
                                <p className={`text-[8px] sm:text-[10px] mt-0.5 sm:mt-1 ${
                                    currentSource === 'PLN'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-amber-600 dark:text-amber-400'
                                }`}>
                                    {currentSource === 'PLN' ? 'Grid Power' : 'Solar Power'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Uptime Card */}
                <Card className="flex flex-col">
                    <CardContent className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col">
                        <div className="flex gap-1 sm:gap-2 lg:gap-3 pb-1 sm:pb-2 items-center mb-1 sm:mb-2">
                            <History className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0" />
                            <h1 className="font-semibold text-[10px] sm:text-xs lg:text-sm truncate">
                                Uptime
                            </h1>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className="w-full bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded p-1.5 sm:p-2 lg:p-3">
                                <h1 className="text-sm sm:text-base lg:text-xl font-bold text-purple-700 dark:text-purple-300 font-mono">
                                    {formatUptime(uptime)}
                                </h1>
                                <p className="text-[8px] sm:text-[10px] text-purple-600 dark:text-purple-400 mt-0.5 sm:mt-1">
                                    Hours Running
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Last Switch Card */}
                <Card className="flex flex-col">
                    <CardContent className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col">
                        <div className="flex gap-1 sm:gap-2 lg:gap-3 pb-1 sm:pb-2 items-center mb-1 sm:mb-2">
                            <ArrowLeftRight className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 shrink-0" />
                            <h1 className="font-semibold text-[10px] sm:text-xs lg:text-sm truncate">
                                Last Switch
                            </h1>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className="w-full bg-slate-100 dark:bg-slate-800/30 border border-slate-300 dark:border-slate-700 rounded p-1.5 sm:p-2 lg:p-3">
                                <p className="text-[9px] sm:text-[10px] lg:text-xs text-slate-700 dark:text-slate-300 font-medium break-words leading-tight">
                                    {formatTimestamp(lastSwitch)}
                                </p>
                                <p className="text-[8px] sm:text-[9px] text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1">
                                    PLN → PLTS
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}