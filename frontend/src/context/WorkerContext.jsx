import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axiosClient';

/**
 * WorkerContext — single source of truth for the logged-in worker's profile.
 *
 * Provided by WorkerGuard (which fetches the profile once on mount).
 * Consumed by WorkerNavbar, WorkerDashboard, and any other page that needs
 * availability state so they all stay in sync without extra API calls.
 */

const WorkerContext = createContext(null);

const DEFAULT_WORKER_CTX = {
  profile: null,
  setProfile: () => {},
  toggleAvailability: async () => {},
  refreshProfile: async () => {},
};

export function WorkerProvider({ initialProfile, children }) {
  const [profile, setProfile] = useState(initialProfile ?? null);

  /** Toggle is_available and sync the new profile into context. */
  const toggleAvailability = useCallback(async () => {
    if (!profile) return;
    try {
      const res = await api.post('/workers/profile', {
        ...profile,
        isAvailable: !profile.isAvailable,
      });
      setProfile(res.data);
    } catch {
      // fail silently — availability pill will show stale state until refresh
    }
  }, [profile]);

  /** Re-fetch the profile (e.g. after saving on the profile page). */
  const refreshProfile = useCallback(async () => {
    try {
      const res = await api.get('/workers/me');
      setProfile(res.data);
    } catch {}
  }, []);

  return (
    <WorkerContext.Provider value={{ profile, setProfile, toggleAvailability, refreshProfile }}>
      {children}
    </WorkerContext.Provider>
  );
}

/** Safe hook that returns shared context if present, or graceful fallbacks if rendered outside Provider */
export function useWorker() {
  const ctx = useContext(WorkerContext);
  return ctx || DEFAULT_WORKER_CTX;
}
