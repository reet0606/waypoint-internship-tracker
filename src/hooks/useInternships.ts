import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Internship } from '@/types';
import { demoInternships, indianStates } from '@/data';

const STORAGE_KEY = 'waypoint.admin.internships.v1';

function loadAdminInternships(): Internship[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Internship[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((i) => i && typeof i.id === 'string');
  } catch {
    return [];
  }
}

function saveAdminInternships(items: Internship[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota / privacy errors
  }
}

export function useInternships() {
  const [adminInternships, setAdminInternships] = useState<Internship[]>([]);
  const [lastRefreshed, setLastRefreshed] = useState<number | null>(null);

  useEffect(() => {
    setAdminInternships(loadAdminInternships());
  }, []);

  const internships = useMemo(() => {
    const demoMap = new Map(demoInternships.map((i) => [i.id, i]));
    const merged: Internship[] = [];
    for (const a of adminInternships) {
      if (demoMap.has(a.id)) {
        // admin edits override demo record
        demoMap.delete(a.id);
      }
      merged.push(a);
    }
    for (const d of demoMap.values()) merged.push(d);
    return merged;
  }, [adminInternships]);

  const persist = useCallback((next: Internship[]) => {
    setAdminInternships(next);
    saveAdminInternships(next);
  }, []);

  const upsertInternship = useCallback(
    (internship: Internship) => {
      setAdminInternships((prev) => {
        const idx = prev.findIndex((i) => i.id === internship.id);
        const next =
          idx >= 0
            ? prev.map((i) => (i.id === internship.id ? internship : i))
            : [internship, ...prev];
        saveAdminInternships(next);
        return next;
      });
    },
    []
  );

  const removeInternship = useCallback((id: string) => {
    setAdminInternships((prev) => {
      const next = prev.filter((i) => i.id !== id);
      saveAdminInternships(next);
      return next;
    });
  }, []);

  const resetAdmin = useCallback(() => {
    persist([]);
  }, [persist]);

  const refresh = useCallback(() => {
    setAdminInternships(loadAdminInternships());
    setLastRefreshed(Date.now());
  }, []);

  return {
    internships,
    loading: false,
    error: null,
    refresh,
    lastRefreshed,
    indianStates,
    upsertInternship,
    removeInternship,
    resetAdmin,
    adminCount: adminInternships.length,
  };
}
