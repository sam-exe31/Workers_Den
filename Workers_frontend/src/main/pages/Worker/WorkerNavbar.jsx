import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import { useWorker } from '../../../context/WorkerContext';
import api from '../../../api/axiosClient';
import Logo from './../../Component/Logo';
import {
  LayoutDashboard,
  Briefcase,
  IndianRupee,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  AlertTriangle,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/worker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/worker/find-jobs', label: 'Available Work', icon: Briefcase },
  { to: '/worker/my-jobs', label: 'My Jobs', icon: Briefcase },
  { to: '/worker/earnings', label: 'Earnings', icon: IndianRupee },
  { to: '/worker/profile', label: 'Profile', icon: User },
];

// ── Logout confirmation dialog ───────────────────────────────────────────────
function LogoutDialog({ onConfirm, onCancel, firstName, t }) {
  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: 'rgba(24, 32, 46, 0.55)', backdropFilter: 'blur(2px)' }}
      onClick={onCancel}
    >
      {/* Card — stop propagation so clicking the card doesn't close */}
      <div
        className="w-full max-w-sm border shadow-lg"
        style={{ background: t.surface, borderColor: t.borderStrong }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header strip */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: t.border, background: t.cardHover }}
        >
          <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>
            Confirm action
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer hover:opacity-60 p-0.5"
            style={{ color: t.muted }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          <div className="flex items-start gap-3.5">
            <div
              className="w-9 h-9 shrink-0 flex items-center justify-center border"
              style={{ borderColor: t.stamp, background: 'rgba(194,59,30,0.08)', color: t.stamp }}
            >
              <AlertTriangle size={16} />
            </div>
            <div>
              <div className="font-semibold text-sm" style={{ color: t.text }}>
                Log out of Workers Den?
              </div>
              <p className="wd-mono text-xs mt-1 leading-relaxed" style={{ color: t.muted }}>
                You'll need to sign in again to access your work dashboard{firstName ? `, ${firstName}` : ''}.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-6 pb-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 wd-mono text-xs font-bold py-2.5 border cursor-pointer"
            style={{ borderColor: t.border, color: t.text, background: 'transparent' }}
          >
            Stay signed in
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 wd-mono wd-btn text-xs font-bold py-2.5 flex items-center justify-center gap-2 cursor-pointer"
            style={{ background: t.stamp, color: '#fff', border: 'none' }}
          >
            <LogOut size={13} /> Log out
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main navbar ───────────────────────────────────────────────────────────────
export default function WorkerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme: t } = useTheme();

  // ── shared worker profile from context (or fallback) ──
  const { profile: ctxProfile, toggleAvailability: ctxToggleAvailability } = useWorker();
  const [localProfile, setLocalProfile] = useState(null);

  const [mobileOpen, setMobile] = useState(false);
  const [showLogoutDialog, setDialog] = useState(false);
  const [logoutHovered, setLogoutHov] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      if (location.pathname === '/worker/dashboard') {
        navigate('/worker/logout');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (!ctxProfile) {
      api.get('/workers/me')
        .then(res => setLocalProfile(res.data))
        .catch(() => { });
    }
  }, [ctxProfile]);

  const profile = ctxProfile || localProfile;

  const toggleAvailability = async () => {
    if (ctxProfile) {
      return ctxToggleAvailability();
    }
    if (!profile) return;
    try {
      const res = await api.post('/workers/profile', {
        ...profile,
        isAvailable: !profile.isAvailable,
      });
      setLocalProfile(res.data);
    } catch { }
  };

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const firstName = user?.fullName?.split(' ')[0] || profile?.userName || 'Worker';

  const confirmLogout = () => {
    navigate('/worker/logout');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ── Logout dialog ── */}
      {showLogoutDialog && (
        <LogoutDialog
          onConfirm={confirmLogout}
          onCancel={() => setDialog(false)}
          firstName={firstName}
          t={t}
        />
      )}

      <header
        className="sticky top-0 z-50 w-full"
        style={{ background: t.surface, borderBottom: `1px solid ${t.border}` }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => navigate('/worker/dashboard')}
          >
            <Logo size={26} accentColor={t.accent} textColor={t.text} />
            <span
              className="wd-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border hidden sm:inline"
              style={{ borderColor: t.warning, color: t.warning, background: 'rgba(183,121,31,0.08)' }}
            >
              Worker
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3.5 py-2 wd-mono text-xs font-bold transition-colors"
                style={{
                  color: isActive(to) ? t.accent : t.muted,
                  background: isActive(to) ? t.accentSoft : 'transparent',
                  borderBottom: isActive(to) ? `2px solid ${t.accent}` : '2px solid transparent',
                }}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2.5 shrink-0">

            {/* Availability pill */}
            {profile && (
              <button
                type="button"
                onClick={toggleAvailability}
                className="hidden sm:flex items-center gap-1.5 wd-mono text-[11px] font-bold px-3 py-1.5 border cursor-pointer transition-all"
                style={{
                  borderColor: profile.isAvailable ? t.success : t.border,
                  color: profile.isAvailable ? t.success : t.muted,
                  background: profile.isAvailable ? 'rgba(47,125,79,0.08)' : 'transparent',
                }}
                title={profile.isAvailable ? 'Go offline' : 'Go online'}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: profile.isAvailable ? t.success : t.muted }} />
                {profile.isAvailable ? 'Available' : 'Offline'}
              </button>
            )}

            {/* Notifications stub */}
            <button
              type="button"
              className="p-2 border cursor-pointer hover:opacity-70"
              style={{ borderColor: t.border, color: t.muted }}
              title="Notifications"
            >
              <Bell size={15} />
            </button>

            {/* Name + avatar + logout */}
            <div className="hidden sm:flex items-center gap-0">
              <Link
                to="/worker/profile"
                className="wd-mono text-xs font-bold px-3 py-1.5 border-y border-l flex items-center gap-2 hover:opacity-85 transition-opacity"
                style={{ borderColor: t.border, color: t.text }}
              >
                {(profile?.profileImage || profile?.profile_image) ? (
                  <img
                    src={profile.profileImage || profile.profile_image}
                    alt={firstName}
                    className="w-5 h-5 rounded-full object-cover border"
                    style={{ borderColor: t.accent }}
                  />
                ) : null}
                {firstName}
              </Link>

              {/* Logout button with hover tooltip */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => navigate('/worker/logout')}
                  onMouseEnter={() => setLogoutHov(true)}
                  onMouseLeave={() => setLogoutHov(false)}
                  className="wd-mono text-xs font-bold px-2.5 py-2 border cursor-pointer flex items-center gap-1 transition-colors"
                  style={{
                    borderColor: logoutHovered ? t.stamp : t.border,
                    color: logoutHovered ? t.stamp : t.muted,
                    background: logoutHovered ? 'rgba(194,59,30,0.06)' : 'transparent',
                  }}
                >
                  <LogOut size={13} />
                </button>

                {/* Hover tooltip */}
                {logoutHovered && (
                  <div
                    className="absolute top-full right-0 mt-1.5 px-2.5 py-1 wd-mono text-[10px] font-bold whitespace-nowrap pointer-events-none"
                    style={{ background: t.text, color: t.surface }}
                  >
                    Log out
                    {/* Arrow */}
                    <span
                      className="absolute -top-1 right-3 w-2 h-2 rotate-45"
                      style={{ background: t.text }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobile(!mobileOpen)}
              className="md:hidden p-2 border cursor-pointer"
              style={{ borderColor: t.border, color: t.muted }}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div
            className="md:hidden border-t"
            style={{ borderColor: t.border, background: t.surface }}
          >
            <nav className="flex flex-col px-4 py-3 space-y-0.5">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobile(false)}
                  className="flex items-center gap-3 px-4 py-3 wd-mono text-xs font-bold"
                  style={{
                    color: isActive(to) ? t.accent : t.text,
                    background: isActive(to) ? t.accentSoft : 'transparent',
                    borderLeft: isActive(to) ? `3px solid ${t.accent}` : '3px solid transparent',
                  }}
                >
                  <Icon size={14} />
                  {label}
                </Link>
              ))}

              <div className="border-t pt-3 mt-1" style={{ borderColor: t.border }}>
                {profile && (
                  <button
                    type="button"
                    onClick={toggleAvailability}
                    className="w-full flex items-center gap-2 px-4 py-3 wd-mono text-xs font-bold cursor-pointer"
                    style={{ color: profile.isAvailable ? t.success : t.muted }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ background: profile.isAvailable ? t.success : t.muted }} />
                    {profile.isAvailable ? 'Available — tap to go offline' : 'Offline — tap to go online'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => { setMobile(false); navigate('/worker/logout'); }}
                  className="w-full flex items-center gap-2 px-4 py-3 wd-mono text-xs font-bold cursor-pointer hover:opacity-75"
                  style={{ color: t.muted }}
                >
                  <LogOut size={13} /> Log out
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
