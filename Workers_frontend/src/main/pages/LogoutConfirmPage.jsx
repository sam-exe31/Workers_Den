import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import Logo from '../Component/Logo';
import { LogOut, ArrowLeft, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function LogoutConfirmPage() {
  const navigate = useNavigate();
  const { theme: t } = useTheme();

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const role = user?.role ? user.role.replace('ROLE_', '') : 'USER';
  const name = user?.fullName || user?.email || 'User';

  const dashboardPath = role === 'WORKER' ? '/worker/dashboard' : '/customer/dashboard';

  const handleConfirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('worker_setup_complete');
    navigate('/login', { replace: true });
  };

  const handleCancel = () => {
    navigate(dashboardPath, { replace: true });
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-4 sm:p-8 font-sans"
      style={{ background: t.bg, color: t.text }}
    >
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b" style={{ borderColor: t.border }}>
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleCancel}>
          <Logo size={28} accentColor={t.accent} textColor={t.text} />
          <span className="wd-mono text-xs font-bold uppercase tracking-widest" style={{ color: t.accent }}>
            Workers Den
          </span>
        </div>

        <button
          type="button"
          onClick={handleCancel}
          className="wd-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-75 transition-opacity"
          style={{ color: t.muted }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </header>

      {/* Center Logout Confirmation Card */}
      <main className="max-w-md w-full mx-auto my-auto py-12 px-4">
        <div
          className="border p-8 space-y-6 shadow-xl rounded-sm text-center"
          style={{ background: t.surface, borderColor: t.border }}
        >
          <div
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center border shadow-inner"
            style={{ background: 'rgba(194,59,30,0.08)', borderColor: t.stamp, color: t.stamp }}
          >
            <LogOut size={28} />
          </div>

          <div className="space-y-2">
            <span className="wd-mono text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 border" style={{ borderColor: t.border, color: t.muted }}>
              Session Action
            </span>
            <h1 className="wd-display font-black text-2xl tracking-tight mt-2" style={{ color: t.text }}>
              Log out of Workers Den?
            </h1>
            <p className="wd-mono text-xs leading-relaxed max-w-xs mx-auto" style={{ color: t.muted }}>
              You are currently signed in as <strong style={{ color: t.text }}>{name}</strong> ({role.toLowerCase()}). Are you sure you want to end your session?
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleConfirmLogout}
              className="w-full wd-mono text-xs font-bold py-3.5 border cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ background: t.stamp, color: '#ffffff', borderColor: t.stamp }}
            >
              <LogOut size={16} /> Yes, Log Out Now
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full wd-mono text-xs font-bold py-3.5 border cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
              style={{ background: t.accent, color: t.accentText, borderColor: t.accent }}
            >
              <CheckCircle2 size={16} /> Stay Logged In
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center py-4 wd-mono text-[11px]" style={{ color: t.muted }}>
        Workers Den Platform · Secure Session Management
      </footer>
    </div>
  );
}
