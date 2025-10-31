"use client"

// 1. Impor 'useCallback'
import { useState, useEffect, useCallback } from 'react';
import { 
  fetchRecentLogs, 
  fetchLogsByDateRange, 
  ProcessedFirestoreLog
} from '@/lib/firebase/firestore';

export function useFirestoreLogs(limitCount: number = 50) {
  const [logs, setLogs] = useState<ProcessedFirestoreLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 2. Bungkus 'loadLogs' dengan 'useCallback'
  const loadLogs = useCallback(async () => {
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
  }, [limitCount]); // Dependensi pada limitCount

  useEffect(() => {
    loadLogs();
  }, [loadLogs]); // 'loadLogs' sekarang stabil

  // 3. Kembalikan 'loadLogs' sebagai 'refresh'
  return { logs, loading, error, refresh: loadLogs };
}

export function useFirestoreLogsByDate() {
  const [logs, setLogs] = useState<ProcessedFirestoreLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 4. Bungkus 'loadLogsByDateRange' dengan 'useCallback'
  // Ini adalah perbaikan utama untuk 'vaw-activity.tsx'
  const loadLogsByDateRange = useCallback(async (startDate: Date, endDate: Date) => {
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
  }, []); // Tidak ada dependensi, fungsi ini stabil

  return { logs, loading, error, loadLogsByDateRange };
}