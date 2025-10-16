"use client"

import { ChartAreaAxes } from "@/components/custom/charts/chartAreaAxes";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Zap, Activity } from "lucide-react";
import { useState } from "react";

export default function VawActivity() {
    const [statusCheck, setStatusCheck] = useState(false);

    return (
        <div className="w-full">
            <div className="mb-3">
                <h1 className="font-bold text-lg sm:text-xl">VAW Activity</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-lg">
                    <Card>
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div>
                                <div className="flex gap-3 pb-3 items-center">
                                    <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <h1 className="font-semibold text-sm sm:text-base">Voltage</h1>
                                </div>
                                <div className="w-full overflow-x-auto">
                                    <ChartAreaAxes/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="rounded-lg">
                    <Card>
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div>
                                <div className="flex gap-3 pb-3 items-center">
                                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <h1 className="font-semibold text-sm sm:text-base">Current</h1>
                                </div>
                                <div className="w-full overflow-x-auto">
                                    <ChartAreaAxes/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="rounded-lg">
                    <Card>
                        <CardContent className="p-3 sm:p-4 md:p-6">
                            <div>
                                <div className="flex gap-3 pb-3 items-center">
                                    <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                                    <h1 className="font-semibold text-sm sm:text-base">Power</h1>
                                </div>
                                <div className="w-full overflow-x-auto">
                                    <ChartAreaAxes/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}