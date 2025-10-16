import { ChartLineInteractive } from "@/components/custom/charts/chart-line-linear";
import { Card, CardContent } from "@/components/ui/card";

export default function RealtimeActivity() {
    return (
        <div className="w-full flex flex-col">
            <div className="mb-2 sm:mb-3">
                <h1 className="font-bold text-sm sm:text-base lg:text-lg">Realtime Activity</h1>
            </div>
            <Card className="flex-1">
                <CardContent className="p-3 sm:p-6 h-full flex items-center">
                    <div className="w-full overflow-x-auto">
                        <ChartLineInteractive />
                    </div>
                </CardContent>            
            </Card>
        </div>
    )
}