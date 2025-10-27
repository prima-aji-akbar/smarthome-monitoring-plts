import { Card, CardContent } from "@/components/ui/card";
import { ChartLineInteractive } from "@/components/custom/charts/chart-line-interactive";

export default function BatteryUsage(){
    return (
        <div className="w-full flex flex-col h-full">
            <div className="mb-3 sm:mb-4">
                <div className="flex items-center gap-2">

                    <h1 className="font-bold text-lg sm:text-xl lg:text-2xl text-slate-800 dark:text-slate-100">
                        Battery Usage
                    </h1>
                </div>
            </div>
            <Card className="flex-1 border-0 shadow-lg bg-white dark:bg-slate-900 hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-4 sm:p-6 h-full">
                    <div className="w-full overflow-x-auto">
                        <ChartLineInteractive />
                    </div>
                </CardContent>            
            </Card>
        </div>
    )
}