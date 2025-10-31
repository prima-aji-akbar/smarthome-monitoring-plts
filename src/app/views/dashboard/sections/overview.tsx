"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Zap, History, ArrowLeftRight } from "lucide-react";
import { useDeviceStatus } from "@/hooks/use-device-status";
import { useATSStatus } from "@/hooks/use-realtime-data";
import { useEventLog } from "@/hooks/use-event-logs";
import { formatTimestamp, formatUptime } from "@/lib/utils/formatters";

export default function Overview() {
    const { isOnline, uptime } = useDeviceStatus();
    const { activeSource } = useATSStatus();
    
    const { events, loading: logLoading } = useEventLog(1);
    const lastEvent = events?.[0];

        const lastSwitchTime = lastEvent?.timestamp ?? 0;
        const lastSwitchFrom = lastEvent?.from ?? '...';
        const lastSwitchTo = lastEvent?.to ?? '...';

    return (
        <div className="w-full flex flex-col h-full">
            <div className="mb-3 sm:mb-4">
                <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">Overview</h1>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 flex-1">
                
                {/* Status Card */}
                <Card className="flex flex-col bg-gradient-to-br from-blue-400 to-blue-500 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <h2 className="text-white font-bold text-xs sm:text-sm lg:text-base">Status</h2>
                            <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-2.5">
                                <Heart 
                                    className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white ${isOnline ? 'animate-pulse' : ''}`} 
                                    fill={isOnline ? "white" : "none"} 
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <Separator className="bg-white/20" />
                    <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-end">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 lg:p-4 shadow-md">
                            {isOnline ? (
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full"></div>
                                            <div className="absolute inset-0 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 bg-green-500 rounded-full animate-ping opacity-75"></div>
                                        </div>
                                        <h1 className="text-sm sm:text-base lg:text-xl font-bold text-green-700">
                                            Online
                                        </h1>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-green-600 mt-1 font-medium">
                                        System Running Normally
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                                        <h1 className="text-sm sm:text-base lg:text-xl font-bold text-red-700">
                                            Offline
                                        </h1>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-red-600 mt-1 font-medium">
                                        Device Disconnected
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Source Card */}
                <Card className="flex flex-col bg-gradient-to-br from-amber-400 to-amber-500 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <h2 className="text-white font-semibold text-xs sm:text-sm lg:text-base">Source</h2>
                            <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-2.5">
                                <Zap className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="white" />
                            </div>
                        </div>
                    </CardHeader>
                    <Separator className="bg-white/20" />
                    <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-end">
                        <div className={`bg-white/95 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 lg:p-4 shadow-md border-l-4 ${
                            activeSource === 'PLN' 
                                ? 'border-blue-500' 
                                : 'border-orange-500'
                        }`}>
                            <h1 className={`text-base sm:text-lg lg:text-2xl font-bold ${
                                activeSource === 'PLN'
                                    ? 'text-blue-700'
                                    : 'text-orange-700'
                            }`}>
                                {activeSource}
                            </h1>
                            <p className={`text-[10px] sm:text-xs mt-1 font-medium ${
                                activeSource === 'PLN'
                                    ? 'text-blue-600'
                                    : 'text-orange-600'
                            }`}>
                                {activeSource === 'PLN' ? '⚡ Grid Power' : '☀️ Solar Power'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Uptime Card */}
                <Card className="flex flex-col bg-gradient-to-br from-green-400 to-green-500 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <h2 className="text-white font-semibold text-xs sm:text-sm lg:text-base">Uptime</h2>
                            <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-2.5">
                                <History className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white animate-spin" style={{ animationDuration: '3s' }} />
                            </div>
                        </div>
                    </CardHeader>
                    <Separator className="bg-white/20" />
                    <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-end">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 lg:p-4 shadow-md border-l-4 border-purple-500">
                            <h1 className="text-lg sm:text-xl lg:text-3xl font-bold text-purple-700 font-mono tracking-tight">
                                {isOnline ? formatUptime(uptime) : '00:00:00'}
                            </h1>
                            <p className="text-[10px] sm:text-xs text-purple-600 mt-1 font-medium">
                                ⏱️ Hours Running
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Last Switch Card */}
                <Card className="flex flex-col bg-gradient-to-br from-red-400 to-red-500 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <h2 className="text-white font-semibold text-xs sm:text-sm lg:text-base">Last Switch</h2>
                            <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-2.5">
                                <ArrowLeftRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                            </div>
                        </div>
                    </CardHeader>
                    <Separator className="bg-white/20" />
                    <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-end">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2.5 sm:p-3 lg:p-4 shadow-md border-l-4 border-indigo-500">
                            <p className="text-[10px] sm:text-xs lg:text-sm text-slate-700 font-semibold leading-relaxed">
                                {logLoading ? 'Loading...' : (lastSwitchTime > 0 ? formatTimestamp(lastSwitchTime) : 'No switch data')}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="text-[9px] sm:text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    {lastSwitchFrom}
                                </span>
                                <ArrowLeftRight className="w-3 h-3 text-slate-400" />
                                <span className="text-[9px] sm:text-[10px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                    {lastSwitchTo}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}