"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Zap, Sun, AlertCircle, Settings, Power } from "lucide-react";

type Source = 'PLN' | 'PLTS';

export default function SwitchController() {
  const [activeSource, setActiveSource] = useState<Source>('PLN');
  const [autoMode, setAutoMode] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  // Dummy data
  const deviceStatus = {
    pln: {
      voltage: 220.5,
      current: 8.2,
      power: 1808.1,
      status: true,
    },
    plts: {
      voltage: 48.3,
      current: 15.5,
      power: 748.65,
      status: true,
    },
    battery: {
      soc: 75,
      voltage: 50.2,
      status: true,
    },
  };

  const handleManualSwitch = (target: Source) => {
    if (autoMode || isSwitching || !isOnline) return;
    
    setIsSwitching(true);
    // Simulate switching delay
    setTimeout(() => {
      setActiveSource(target);
      setIsSwitching(false);
    }, 1500);
  };

  const handleAutoModeToggle = (checked: boolean) => {
    setAutoMode(checked);
    if (checked) {
      // Simulate auto mode logic
      if (deviceStatus.battery.soc > 70 && deviceStatus.plts.status) {
        setActiveSource('PLTS');
      } else {
        setActiveSource('PLN');
      }
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      {/* Header outside card */}
      <div className="mb-3 sm:mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-200 dark:bg-slate-700 rounded-lg p-2.5">
              <Settings className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">
                Switch Controller
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Control power source switching
              </p>
            </div>
          </div>
          <Badge 
            variant={isOnline ? "default" : "destructive"}
            className={isOnline ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : ""}
          >
            {isOnline ? "Online" : "Offline"}
          </Badge>
        </div>
      </div>

      <Card className="border shadow-sm flex-1">{/* Removed CardHeader - using external header now */}

        <CardContent className="p-6">
          {/* Auto Mode Toggle */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Power className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                    Auto Mode
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Automatic switching based on battery SOC
                  </p>
                </div>
              </div>
              <Switch
                checked={autoMode}
                onCheckedChange={handleAutoModeToggle}
                disabled={!isOnline}
              />
            </div>
          </div>

          {/* Warning when auto mode is on */}
          {autoMode && (
            <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Auto Mode Active
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                  Manual switching is disabled. Turn off auto mode to control manually.
                </p>
              </div>
            </div>
          )}

          {/* Current Active Source */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Current Active Source
            </h3>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeSource === 'PLN' ? (
                    <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Sun className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  )}
                  <div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {activeSource}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {activeSource === 'PLN' ? '⚡ Grid Power' : '☀️ Solar Power'}
                    </p>
                  </div>
                </div>
                {isSwitching && (
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 animate-pulse">
                    Switching...
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Manual Switch Buttons */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Manual Switch Control
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* PLN Button */}
              <Card className={`cursor-pointer transition-all duration-200 ${
                activeSource === 'PLN' 
                  ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                  : 'hover:border-slate-300 dark:hover:border-slate-600'
              } ${
                autoMode || !isOnline || isSwitching 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              onClick={() => handleManualSwitch('PLN')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        activeSource === 'PLN'
                          ? 'bg-blue-500'
                          : 'bg-blue-100 dark:bg-blue-900/40'
                      }`}>
                        <Zap className={`w-5 h-5 ${
                          activeSource === 'PLN'
                            ? 'text-white'
                            : 'text-blue-600 dark:text-blue-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">
                          PLN
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Grid Power
                        </p>
                      </div>
                    </div>
                    {activeSource === 'PLN' && (
                      <Badge className="bg-blue-500 text-white">Active</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Voltage:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {deviceStatus.pln.voltage.toFixed(1)} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Current:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {deviceStatus.pln.current.toFixed(1)} A
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Power:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {deviceStatus.pln.power.toFixed(1)} W
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PLTS Button */}
              <Card className={`cursor-pointer transition-all duration-200 ${
                activeSource === 'PLTS' 
                  ? 'border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20' 
                  : 'hover:border-slate-300 dark:hover:border-slate-600'
              } ${
                autoMode || !isOnline || isSwitching 
                  ? 'opacity-50 cursor-not-allowed' 
                  : ''
              }`}
              onClick={() => handleManualSwitch('PLTS')}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${
                        activeSource === 'PLTS'
                          ? 'bg-amber-500'
                          : 'bg-amber-100 dark:bg-amber-900/40'
                      }`}>
                        <Sun className={`w-5 h-5 ${
                          activeSource === 'PLTS'
                            ? 'text-white'
                            : 'text-amber-600 dark:text-amber-400'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-100">
                          PLTS
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Solar Power
                        </p>
                      </div>
                    </div>
                    {activeSource === 'PLTS' && (
                      <Badge className="bg-amber-500 text-white">Active</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Voltage:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {deviceStatus.plts.voltage.toFixed(1)} V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Current:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {deviceStatus.plts.current.toFixed(1)} A
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">Power:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {deviceStatus.plts.power.toFixed(1)} W
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Battery Status */}
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">
              Battery Status
            </h3>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">SOC</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {deviceStatus.battery.soc}%
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Voltage</p>
                <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {deviceStatus.battery.voltage.toFixed(1)} V
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Status</p>
                <Badge className={deviceStatus.battery.status 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                  : "bg-red-100 text-red-700"
                }>
                  {deviceStatus.battery.status ? "Good" : "Error"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              disabled={!isOnline}
            >
              Refresh Status
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              disabled={!isOnline}
            >
              Emergency Stop
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}