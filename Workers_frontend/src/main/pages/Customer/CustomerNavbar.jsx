import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import Logo from '../../Component/Logo';
import { 
  Menu, 
  X, 
  User, 
  PlusCircle, 
  ShoppingBag, 
  LogOut, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function CustomerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, setMode, theme: t } = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const brandAccent = mode === 'dark' ? '#A78BFA' : '#6247AA';
  const brandAccentSoft = mode === 'dark' ? 'rgba(167, 139, 250, 0.15)' : '#EDE9F6';

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-200 select-none"
        style={{
          background: mode === 'light' ? 'rgba(246, 244, 251, 0.94)' : 'rgba(15, 18, 25, 0.92)',
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="p-2 border flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95"
              style={{
                borderColor: t.border,
                background: t.surface,
                color: t.text,
              }}
              title="Open Navigation Panel"
            >
              <Menu size={16} />
            </button>

            <div className="flex items-center gap-2.5">
              <div 
                onClick={() => navigate('/customer/dashboard')} 
                className="cursor-pointer flex items-center transition-transform hover:scale-105"
              >
                <Logo size={28} accentColor={brandAccent} textColor={t.text} />
              </div>

              <span
                className="wd-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border hidden sm:inline-block animate-in fade-in duration-300"
                style={{ borderColor: brandAccent, color: brandAccent, background: brandAccentSoft }}
              >
                CLIENT CONSOLE
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-2 wd-mono text-xs ml-2">
              <Link
                to="/customer/dashboard"
                className="px-3 py-1.5 border transition-all duration-150 font-medium hover:-translate-y-0.5"
                style={{
                  borderColor: isCurrent('/customer/dashboard') ? brandAccent : t.border,
                  background: isCurrent('/customer/dashboard') ? brandAccentSoft : 'transparent',
                  color: isCurrent('/customer/dashboard') ? brandAccent : t.text,
                }}
              >
                OVERVIEW
              </Link>

              <Link
                to="/customer/create-job"
                className="px-3 py-1.5 border transition-all duration-150 font-medium flex items-center gap-1.5 hover:-translate-y-0.5"
                style={{
                  borderColor: isCurrent('/customer/create-job') ? brandAccent : t.border,
                  background: isCurrent('/customer/create-job') ? brandAccentSoft : 'transparent',
                  color: isCurrent('/customer/create-job') ? brandAccent : t.muted,
                }}
              >
                <PlusCircle size={12} />
                BOOK SERVICE
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {setMode && (
              <button
                type="button"
                onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                className="wd-mono flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-bold border cursor-pointer transition-all duration-150 active:scale-95"
                style={{
                  borderColor: t.border,
                  background: mode === 'light' ? '#FBFAFC' : '#171D2A',
                  color: t.text,
                }}
                title="Toggle Theme"
              >
                <span className="hidden sm:inline text-[10px]">{mode.toUpperCase()}</span>
                <span
                  style={{
                    position: 'relative',
                    width: 22,
                    height: 12,
                    background: t.border,
                    display: 'inline-block',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 1,
                      left: 1,
                      width: 10,
                      height: 10,
                      background: brandAccent,
                      transform: mode === 'dark' ? 'translateX(10px)' : 'translateX(0)',
                      transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  />
                </span>
              </button>
            )}

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-9 h-9 border flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95"
                style={{
                  borderColor: profileMenuOpen ? brandAccent : t.border,
                  background: brandAccentSoft,
                  color: brandAccent,
                }}
                title="Account Credentials"
              >
                <User size={16} strokeWidth={2.2} />
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 border p-4 z-50 wd-mono shadow-xl animate-in fade-in zoom-in-95 duration-150"
                  style={{ background: t.surface, borderColor: t.border, color: t.text }}
                >
                  <div className="flex items-center gap-3 border-b pb-3 mb-3" style={{ borderColor: t.border }}>
                    <div
                      className="w-10 h-10 border flex items-center justify-center font-bold text-sm"
                      style={{ borderColor: brandAccent, background: brandAccentSoft, color: brandAccent }}
                    >
                      {user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'C'}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="font-bold text-xs truncate" style={{ color: t.text }}>
                        {user?.fullName || 'Customer Operator'}
                      </div>
                      <div className="text-[10px] truncate" style={{ color: t.muted }}>
                        {user?.email || 'client@workersden.com'}
                      </div>
                      <span
                        className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.2 border"
                        style={{ borderColor: brandAccent, color: brandAccent, background: brandAccentSoft }}
                      >
                        ROLE // CUSTOMER
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate('/customer/dashboard');
                      }}
                      className="w-full text-left py-1.5 px-2 hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Active Orders & Logs</span>
                      <ChevronRight size={12} style={{ color: t.muted }} />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate('/customer/create-job');
                      }}
                      className="w-full text-left py-1.5 px-2 hover:bg-black/5 dark:hover:bg-white/5 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>New Service Dispatch</span>
                      <PlusCircle size={12} style={{ color: brandAccent }} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="wd-mono text-xs font-bold px-3 py-2 border flex items-center gap-1.5 cursor-pointer hover:opacity-75 transition-all duration-150 active:scale-95"
              style={{ borderColor: t.border, color: t.muted }}
              title="Sign Out"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">EXIT</span>
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex select-none animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          <div
            className="relative w-72 sm:w-80 h-full border-r p-6 flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-left duration-250"
            style={{
              background: t.surface,
              borderColor: t.border,
              color: t.text,
            }}
          >
            <div>
              <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: t.border }}>
                <Logo size={24} accentColor={brandAccent} textColor={t.text} />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 border hover:opacity-70 cursor-pointer transition-opacity"
                  style={{ borderColor: t.border, color: t.muted }}
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2 wd-mono text-xs">
                <span className="text-[10px] font-bold tracking-wider" style={{ color: t.muted }}>
                  DISPATCH MANAGEMENT
                </span>

                <button
                  type="button"
                  onClick={() => { setDrawerOpen(false); navigate('/customer/dashboard'); }}
                  className="w-full p-2.5 border flex items-center gap-3 font-semibold transition-all hover:translate-x-1 cursor-pointer"
                  style={{
                    borderColor: isCurrent('/customer/dashboard') ? brandAccent : t.border,
                    background: isCurrent('/customer/dashboard') ? brandAccentSoft : t.cardHover,
                    color: isCurrent('/customer/dashboard') ? brandAccent : t.text,
                  }}
                >
                  <ShoppingBag size={15} />
                  <span>My Active & Past Orders</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setDrawerOpen(false); navigate('/customer/create-job'); }}
                  className="w-full p-2.5 border flex items-center gap-3 font-semibold transition-all hover:translate-x-1 cursor-pointer"
                  style={{
                    borderColor: isCurrent('/customer/create-job') ? brandAccent : t.border,
                    background: isCurrent('/customer/create-job') ? brandAccentSoft : t.cardHover,
                    color: isCurrent('/customer/create-job') ? brandAccent : t.text,
                  }}
                >
                  <PlusCircle size={15} />
                  <span>Book Guided Service</span>
                </button>

                <div className="pt-4">
                  <span className="text-[10px] font-bold tracking-wider block mb-2" style={{ color: t.muted }}>
                    LOCALITY SECTOR
                  </span>
                  
                  <div className="p-3 border space-y-1.5 text-[11px]" style={{ borderColor: t.border, background: t.cardHover }}>
                    <div className="flex justify-between">
                      <span style={{ color: t.muted }}>Operating Metro</span>
                      <strong style={{ color: t.text }}>Pune, Maharashtra</strong>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: t.muted }}>Warranty Policy</span>
                      <strong style={{ color: brandAccent }}>30-Day Resolution</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t wd-mono text-[10px]" style={{ borderColor: t.border, color: t.muted }}>
              <div>CLIENT PROTOCOL // JWT_VERIFIED</div>
              <div className="mt-0.5">WORKERS DEN SYSTEM v2.4</div>
            </div>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-xs select-none animate-in fade-in duration-150">
          <div
            className="w-full max-w-sm p-6 border shadow-2xl animate-in zoom-in-95 duration-150"
            style={{ background: t.surface, borderColor: t.border, color: t.text }}
          >
            <div className="flex items-center gap-2.5 mb-3" style={{ color: '#EF4444' }}>
              <AlertTriangle size={18} />
              <h3 className="wd-display font-black text-base uppercase tracking-tight">
                Confirm Platform Exit
              </h3>
            </div>

            <p className="text-xs wd-mono leading-relaxed" style={{ color: t.muted }}>
              Are you sure you want to terminate your current dispatch session?
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="wd-mono text-xs font-semibold py-2.5 border cursor-pointer hover:bg-black/5 transition-colors"
                style={{ borderColor: t.border, color: t.text, background: 'transparent' }}
              >
                CANCEL
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="wd-mono text-xs font-bold py-2.5 cursor-pointer shadow-xs text-white active:scale-95 transition-transform"
                style={{ background: '#EF4444', border: 'none' }}
              >
                CONFIRM EXIT
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
