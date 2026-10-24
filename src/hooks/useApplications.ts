import { useEffect, useState, useCallback } from 'react';
import type { Application, TrackerStatus } from '@/types';

const KEY = 'waypoint_applications_v1';

function load(): Record<string, Application> {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, Application>;
  } catch {
    return {};
  }
}

export function useApplications() {
  const [apps, setApps] = useState<Record<string, Application>>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(apps));
    } catch {
      /* ignore quota errors */
    }
  }, [apps]);

  const setStatus = useCallback((internshipId: string, status: TrackerStatus) => {
    setApps((prev) => {
      const existing = prev[internshipId];
      const now = Date.now();
      return {
        ...prev,
        [internshipId]: {
          internshipId,
          status,
          appliedAt: existing?.appliedAt ?? now,
          updatedAt: now,
          notes: existing?.notes ?? '',
        },
      };
    });
  }, []);

  const updateNotes = useCallback((internshipId: string, notes: string) => {
    setApps((prev) => {
      const existing = prev[internshipId];
      if (!existing) return prev;
      return { ...prev, [internshipId]: { ...existing, notes, updatedAt: Date.now() } };
    });
  }, []);

  const remove = useCallback((internshipId: string) => {
    setApps((prev) => {
      const next = { ...prev };
      delete next[internshipId];
      return next;
    });
  }, []);

  const toggleSaved = useCallback((internshipId: string) => {
    setApps((prev) => {
      const existing = prev[internshipId];
      if (existing) {
        const next = { ...prev };
        delete next[internshipId];
        return next;
      }
      const now = Date.now();
      return {
        ...prev,
        [internshipId]: {
          internshipId,
          status: 'Saved' as TrackerStatus,
          appliedAt: now,
          updatedAt: now,
          notes: '',
        },
      };
    });
  }, []);

  return { apps, setStatus, updateNotes, remove, toggleSaved };
}
