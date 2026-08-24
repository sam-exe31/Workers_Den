import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import Logo from './../../Component/Logo';
import { Search, LayoutDashboard, UserCheck, LogOut, Radio } from 'lucide-react';

export default function WorkerNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, setMode, theme: t } = useTheme();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  const isCurrent = (path) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md transition-colors duration-150"
      style={{
        background: mode === 'light' ? 'rgba(246, 244, 251, 0.92)' : 'rgba(15, 18, 25, 0.90)',
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Terminal Designation */}
        <div className="flex items-center gap-3 select-none">
          <div onClick={() => navigate('/worker/dashboard')} className="cursor-pointer">
            <Logo size={28} accentColor={t.accent} textColor={t.text} />
          </div>

          <span
            className="wd-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border flex items-center gap-1.5"
            style={{ borderColor: t.border, color: t.accent, background: t.accentSoft }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            WORKER // TERMINAL
          </span>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Find Jobs Primary Action Button */}
          <button
            type="button"
            onClick={() => navigate('/worker/find-jobs')}
            className="wd-mono wd-btn text-xs font-bold px-3.5 py-2 flex items-center gap-1.5 cursor-pointer shadow-xs"
            style={{
              background: t.accent,
              color: t.accentText,
              border: 'none',
            }}
          >
            <Search size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">FIND WORK ORDERS</span>
            <span className="sm:hidden">DISPATCH</span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-2 wd-mono text-xs">
            <Link
              to="/worker/dashboard"
              className="px-3 py-1.5 border transition-colors flex items-center gap-1.5"
              style={{
                borderColor: isCurrent('/worker/dashboard') ? t.accent : t.border,
                background: isCurrent('/worker/dashboard') ? t.accentSoft : 'transparent',
                color: isCurrent('/worker/dashboard') ? t.accent : t.text,
              }}
            >
              <LayoutDashboard size={12} />
              COMMAND CENTER
            </Link>

            <Link
              to="/worker/profile"
              className="px-3 py-1.5 border transition-colors flex items-center gap-1.5"
              style={{
                borderColor: isCurrent('/worker/profile') ? t.accent : t.border,
                background: isCurrent('/worker/profile') ? t.accentSoft : 'transparent',
                color: isCurrent('/worker/profile') ? t.accent : t.text,
              }}
            >
              <UserCheck size={12} />
              LOCALITY & TRADES
            </Link>
          </nav>

          {/* Theme Switch */}
          <button
            type="button"
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            className="wd-mono flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-bold border cursor-pointer transition-colors"
            style={{
              borderColor: t.border,
              background: mode === 'light' ? '#FBFAFC' : '#171D2A',
              color: t.text,
            }}
            title="Toggle theme"
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
                  background: t.accent,
                  transform: mode === 'dark' ? 'translateX(10px)' : 'translateX(0)',
                  transition: 'transform 120ms ease',
                }}
              />
            </span>
          </button>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="wd-mono text-xs font-bold px-2.5 py-1.5 border flex items-center gap-1.5 cursor-pointer hover:opacity-75"
            style={{ borderColor: t.border, color: t.muted }}
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">EXIT</span>
          </button>
        </div>
      </div>
    </header>
  );
}
