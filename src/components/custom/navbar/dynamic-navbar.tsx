"use client"

import { usePathname } from "next/navigation";

export default function DynamicNavbar() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/event-log')) return 'Event Log';
    if (pathname.includes('/logout')) return 'Logout';
    if (pathname.includes('/switch-control')) return 'Switch Control';
    if (pathname.includes('/test-connection')) return 'Test Connection';
    return 'Dashboard';
  };

  return (
    <div className="flex flex-1 items-center justify-between gap-4 ">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs sm:text-sm text-muted-foreground truncate">
          Home / {getPageTitle()}
        </span>
      </div>
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap lg:pr-6">
        {getPageTitle()}
      </h1>
    </div>
  );
}