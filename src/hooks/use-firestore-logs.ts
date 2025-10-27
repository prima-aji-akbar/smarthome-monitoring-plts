"use client"

import { useState, useEffect } from 'react';
import { fetchRecentLogs, fetchLogsByDateRange, FirestoreLog } from '@/lib/firebase/firestore';

export function useFirestoreLogs(limitCount: number = 50) {
  const [logs, setLogs] = useState<FirestoreLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchRecentLogs(limitCount);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
      console.error('Error loading logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [limitCount]);

  const refresh = () => {
    loadLogs();
  };

  return { logs, loading, error, refresh };
}

export function useFirestoreLogsByDate() {
  const [logs, setLogs] = useState<FirestoreLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLogsByDateRange = async (startDate: Date, endDate: Date) => {
    try {
      setLoading(true);
      const data = await fetchLogsByDateRange(startDate, endDate);
      setLogs(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load logs');
      console.error('Error loading logs by date:', err);
    } finally {
      setLoading(false);
    }
  };

  return { logs, loading, error, loadLogsByDateRange };
}