import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Battery } from "lucide-react";

export default function BatteryStatus() {
    // Dummy data
    const batteryData = {
        soc: 85,
        voltage: 48.5,
        current: 12.3,
        power: 596.55,
        status: true,
        consumedWh: 245.8
    };

    return (
        <div className="w-full flex flex-col h-full">
            <div className="mb-3 sm:mb-4">
                <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">
                    Battery Status
                </h1>
            </div>
            
            {/* Battery Info Card */}
            <Card className="flex-1 flex flex-col bg-gradient-to-br from-green-400 to-green-500 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <h2 className="text-white font-semibold text-sm sm:text-base lg:text-lg">
                            Battery Level
                        </h2>
                        <div className="bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-2.5">
                            <Battery className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" fill="white" />
                        </div>
                    </div>
                </CardHeader>
                <Separator className="bg-white/20" />
                <CardContent className="p-3 sm:p-4 flex-1 flex flex-col justify-end">
                    <div className="bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-md border-l-4 border-green-600">
                        <div className="flex items-baseline gap-2 mb-3">
                            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600">
                                {batteryData.soc}%
                            </p>
                            <span className={`text-xs px-2 py-1 rounded-full ${batteryData.status ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {batteryData.status ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                            <div>
                                <p className="text-slate-500">Voltage</p>
                                <p className="font-semibold text-slate-700">{batteryData.voltage.toFixed(2)} V</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Current</p>
                                <p className="font-semibold text-slate-700">{batteryData.current.toFixed(2)} A</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Power</p>
                                <p className="font-semibold text-slate-700">{batteryData.power.toFixed(2)} W</p>
                            </div>
                            <div>
                                <p className="text-slate-500">Consumed</p>
                                <p className="font-semibold text-slate-700">{batteryData.consumedWh.toFixed(2)} Wh</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}