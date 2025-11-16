"use client"

import { useState, useEffect } from 'react';
import { ref, onValue, off, query, orderByChild, limitToLast } from 'firebase/database';
import { database } from '@/lib/firebase/config';
import { SwitchEvent } from '@/types/telemetry';
import { calculateBatterySOC } from '@/lib/utils/battery-soc';

const DEVICE_ID = 'ATS001';

export function useEventLog(limit: number = 50) {
  const [events, setEvents] = useState<SwitchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventLogRef = ref(database, `devices/${DEVICE_ID}/eventLog`);
    const eventQuery = query(eventLogRef, orderByChild('timestamp'), limitToLast(limit));

    const unsubscribe = onValue(
      eventQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const eventArray = Object.entries(data).map(([id, eventData]: [string, unknown]) => {
            const evt = eventData as Partial<SwitchEvent> & Record<string, unknown>;
            const batterySoc = evt.batterySoc ?? 
              (typeof evt.consumedWh === 'number' 
                ? calculateBatterySOC(evt.consumedWh) 
                : undefined);
            
            return {
              id,
              ...(evt as Partial<SwitchEvent>),
              batterySoc  
            } as SwitchEvent;
          });
          
          const sortedEvents = eventArray.sort((a, b) => b.timestamp - a.timestamp);
          setEvents(sortedEvents);
          setError(null);
        } else {
          setEvents([]);
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => {
      off(eventLogRef);
      unsubscribe();
    };
  }, [limit]);

  return { events, loading, error };
}