import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import Logo from '../../Component/Logo';
import { LogOut, LayoutGrid } from 'lucide-react';

export default function AdminNavbar() {
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
      className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors duration-150"
      style={{
        background: mode === 'light' ? 'rgba(243, 241, 247, 0.94)' : 'rgba(15, 18, 25, 0.92)',
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={28} accentColor={t.accent} textColor={t.text} />
          <span
            className="wd-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border"
            style={{ borderColor: t.accent, color: t.accent, background: t.accentSoft }}
          >
            ADMIN CONSOLE
          </span>

          <nav className="hidden md:flex items-center gap-2 wd-mono text-xs ml-2">
            <Link
              to="/admin/categories"
              className="px-3 py-1.5 border flex items-center gap-1.5"
              style={{
                borderColor: isCurrent('/admin/categories') ? t.accent : t.border,
                background: isCurrent('/admin/categories') ? t.accentSoft : 'transparent',
                color: isCurrent('/admin/categories') ? t.accent : t.text,
              }}
            >
              <LayoutGrid size={12} /> CATEGORIES
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            className="wd-mono flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-bold border cursor-pointer"
            style={{ borderColor: t.border, background: mode === 'light' ? '#FBFAFC' : '#171D2A', color: t.text }}
          >
            {mode.toUpperCase()}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="wd-mono text-xs font-bold px-3 py-2 border flex items-center gap-1.5 cursor-pointer hover:opacity-75"
            style={{ borderColor: t.border, color: t.muted }}
          >
            <LogOut size={13} /> <span className="hidden sm:inline">EXIT</span>
          </button>
        </div>
      </div>
    </header>
  );
}
