import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import Logo from '../../Component/Logo';
import {
  Menu,
  X,
  User,
  PlusCircle,
  Briefcase,
  LogOut,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/customer/dashboard', label: 'Overview', icon: Briefcase },
  { to: '/customer/requests', label: 'My Requests', icon: Briefcase },
  { to: '/customer/profile', label: 'Profile', icon: User },
];

function LogoutDialog({ onConfirm, onCancel, firstName, t }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ background: 'rgba(24, 32, 46, 0.55)', backdropFilter: 'blur(2px)' }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm border shadow-lg"
        style={{ background: t.surface, borderColor: t.borderStrong }}
        onClick={e => e.stopPropagation()}
      >
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
                You'll need to sign in again to create or track requests{firstName ? `, ${firstName}` : ''}.
              </p>
            </div>
          </div>
        </div>

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

export default function CustomerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme: t } = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [logoutHovered, setLogoutHovered] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      if (location.pathname === '/customer/dashboard') {
        navigate('/customer/logout');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, navigate]);

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const firstName = user?.fullName?.split(' ')[0] || 'Customer';

  const confirmLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {showLogoutDialog && (
        <LogoutDialog
          onConfirm={confirmLogout}
          onCancel={() => setShowLogoutDialog(false)}
          firstName={firstName}
          t={t}
        />
      )}

      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: t.surface,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">

          {/* Brand */}
          <div
            className="flex items-center gap-2.5 cursor-pointer shrink-0"
            onClick={() => navigate('/customer/dashboard')}
          >
            <Logo size={26} accentColor={t.accent} textColor={t.text} />
            <span
              className="wd-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border hidden sm:inline"
              style={{ borderColor: t.accent, color: t.accent, background: t.accentSoft }}
            >
              Customer
            </span>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
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
          <div className="flex items-center gap-3 shrink-0">
            {/* Create Request CTA */}
            <button
              type="button"
              onClick={() => navigate('/customer/create-job')}
              className="wd-mono wd-btn text-xs font-bold px-4 py-2 flex items-center gap-1.5 cursor-pointer"
              style={{ background: t.accent, color: t.accentText, border: 'none' }}
            >
              <PlusCircle size={14} />
              <span className="hidden sm:inline">Create Request</span>
              <span className="sm:hidden">New</span>
            </button>

            {/* Name + Logout */}
            <div className="hidden sm:flex items-center gap-0">
              <Link
                to="/customer/profile"
                className="wd-mono text-xs font-bold px-3 py-2 border-y border-l flex items-center gap-1.5 hover:opacity-85 transition-opacity"
                style={{ borderColor: t.border, color: t.text }}
              >
                {firstName}
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => navigate('/customer/logout')}
                  onMouseEnter={() => setLogoutHovered(true)}
                  onMouseLeave={() => setLogoutHovered(false)}
                  className="wd-mono text-xs font-bold px-2.5 py-2 border cursor-pointer flex items-center gap-1 transition-colors"
                  style={{
                    borderColor: logoutHovered ? t.stamp : t.border,
                    color: logoutHovered ? t.stamp : t.muted,
                    background: logoutHovered ? 'rgba(194,59,30,0.06)' : 'transparent',
                  }}
                  title="Log out"
                >
                  <LogOut size={13} />
                </button>

                {logoutHovered && (
                  <div
                    className="absolute top-full right-0 mt-1.5 px-2.5 py-1 wd-mono text-[10px] font-bold whitespace-nowrap pointer-events-none z-10"
                    style={{ background: t.text, color: t.surface }}
                  >
                    Log out
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 border cursor-pointer"
              style={{ borderColor: t.border, color: t.muted }}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
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
                  onClick={() => setMobileOpen(false)}
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
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); navigate('/customer/logout'); }}
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
