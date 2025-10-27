import BatteryStatus from "./sections/battery-status";
import BatteryUsage from "./sections/battery-usage";
import Overview from "./sections/overview";
import RealtimeActivity from "./sections/real-time-activity";
import VawActivity from "./sections/vaw-activity";

export default function Dashboard() {
  return (
    <div className="w-full">
      <div className="bg-[var(--body-background)] min-h-screen lg:px-8">
        <div className="w-full max-w-[100%] mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">            {/* Overview - Full width on mobile, 1 column on desktop */}
            <div className="w-full lg:col-span-1 flex">
              <Overview />
            </div>
            
            {/* Realtime Activity - Full width on mobile, 2 columns on desktop */}
            <div className="w-full lg:col-span-2 flex">
              <RealtimeActivity />
            </div>
            
            {/* AC/DC dan Battery */}
            <div className="w-full lg:col-span-2 flex">
              <BatteryUsage/>
            </div>

            {/* AC/DC dan Battery */}
            <div className="w-full lg:col-span-1 flex">
              <BatteryStatus/>
            </div>

            {/* VAW Activity - Full width on all screens */}
            <div className="w-full lg:col-span-3">
              <VawActivity/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}