"use client"

import { useState, useEffect, useRef } from 'react';
import { listenToTimestamp } from '@/lib/firebase/realtime-listeners';

const CONNECTION_TIMEOUT = 10000; // 10 seconds

export function useDeviceStatus() {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<number>(0);
  const [uptime, setUptime] = useState(0);
  
  const checkIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const uptimeIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = listenToTimestamp(
      (timestamp) => {
        setLastSeen(timestamp);
        setIsOnline(true);
      },
      (error) => {
        console.error('Device status error:', error);
        setIsOnline(false);
      }
    );

    checkIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastSeen;
      
      if (timeSinceLastUpdate > CONNECTION_TIMEOUT) {
        setIsOnline(false);
      }
    }, 5000);

    uptimeIntervalRef.current = setInterval(() => {
      if (isOnline) {
        setUptime(prev => prev + 1);
      }
    }, 1000);

    return () => {
      unsubscribe();
      if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);
      if (uptimeIntervalRef.current) clearInterval(uptimeIntervalRef.current);
    };
  }, [lastSeen, isOnline]);

  const getConnectionStatus = (): 'online' | 'offline' | 'unstable' => {
    if (!lastSeen) return 'offline';
    
    const now = Date.now();
    const timeSinceLastUpdate = now - lastSeen;
    
    if (timeSinceLastUpdate < 5000) return 'online';
    if (timeSinceLastUpdate < CONNECTION_TIMEOUT) return 'unstable';
    return 'offline';
  };

  const getTimeSinceLastUpdate = (): number => {
    if (!lastSeen) return 0;
    return Date.now() - lastSeen;
  };

  return {
    isOnline,
    lastSeen,
    uptime,
    connectionStatus: getConnectionStatus(),
    timeSinceLastUpdate: getTimeSinceLastUpdate()
  };
}


export function useSystemHealth() {
  const { isOnline, connectionStatus, timeSinceLastUpdate } = useDeviceStatus();
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    if (!isOnline) {
      setHealthStatus('critical');
    } else if (connectionStatus === 'unstable') {
      setHealthStatus('warning');
    } else {
      setHealthStatus('healthy');
    }
  }, [isOnline, connectionStatus]);

  return {
    healthStatus,
    isHealthy: healthStatus === 'healthy',
    isWarning: healthStatus === 'warning',
    isCritical: healthStatus === 'critical',
    connectionStatus,
    timeSinceLastUpdate
  };
}