import { useCallback, useState } from 'react';

const SESSION_KEY = 'waypoint.admin.session';

const isDev = import.meta.env.DEV;

export function useAdminAuth() {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    try {
      if (isDev) return true; // auto-unlock in development/demo mode for testing
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  const unlock = useCallback((passphrase: string) => {
    if (isDev) {
      // In development/demo mode, allow entry without a configured passphrase
      // so the admin UI can be tested. This is NOT secure and must not ship.
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // ignore
      }
      setUnlocked(true);
      return true;
    }

    const expected = import.meta.env.VITE_ADMIN_PASSPHRASE;
    if (!expected) {
      // No passphrase configured in production — refuse entry.
      return false;
    }
    const ok = passphrase === expected;
    if (ok) {
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // ignore
      }
      setUnlocked(true);
    }
    return ok;
  }, []);

  const lock = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setUnlocked(false);
  }, []);

  return { unlocked, unlock, lock, isDev };
}
