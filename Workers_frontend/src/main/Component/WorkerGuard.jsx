import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import api from '../../api/axiosClient';
import { useTheme } from '../../theme/ThemeContext';
import { WorkerProvider } from '../../context/WorkerContext';

/**
 * WorkerGuard — sits between ProtectedRoute and all worker pages (except /worker/setup).
 *
 * Responsibilities:
 *   1. Fetch /workers/me (always — needed to populate WorkerContext for children).
 *   2. If profile is incomplete (no locality), redirect to /worker/setup.
 *   3. Otherwise, wrap children in WorkerProvider so the profile is shared
 *      across WorkerNavbar + WorkerDashboard (and any other page that needs it)
 *      without duplicate API calls.
 */
export default function WorkerGuard() {
  const { theme: t } = useTheme();

  // 'checking' | 'ok' | 'setup'
  const [status, setStatus]               = useState('checking');
  const [initialProfile, setInitialProfile] = useState(null);

  useEffect(() => {
    api
      .get('/workers/me')
      .then(res => {
        const profile = res.data;
        if (profile && profile.locality) {
          localStorage.setItem('worker_setup_complete', 'true');
          setInitialProfile(profile);
          setStatus('ok');
        } else if (localStorage.getItem('worker_setup_complete') === 'true') {
          // Trust the cache (e.g. locality cleared by a backend migration) — let them through.
          setInitialProfile(profile);
          setStatus('ok');
        } else {
          setStatus('setup');
        }
      })
      .catch(() => {
        // On network error, trust the localStorage cache so workers aren't
        // forced through setup every time the backend is slow.
        if (localStorage.getItem('worker_setup_complete') === 'true') {
          setStatus('ok');
        } else {
          setStatus('setup');
        }
      });
  }, []);

  if (status === 'checking') {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: t.bg }}
      >
        <div className="wd-mono text-xs animate-pulse" style={{ color: t.muted }}>
          Loading your profile…
        </div>
      </div>
    );
  }

  if (status === 'setup') {
    return <Navigate to="/worker/setup" replace />;
  }

  return (
    <WorkerProvider initialProfile={initialProfile}>
      <Outlet />
    </WorkerProvider>
  );
}
