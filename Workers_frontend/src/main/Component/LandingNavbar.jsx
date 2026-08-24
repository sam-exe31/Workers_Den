import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext'; 
import { ArrowRight, Menu, X, Wrench, GitCommit, Users2,BookOpen } from 'lucide-react';
import Logo from './Logo';

export default function LandingNavbar() {
  const navigate = useNavigate();
  const { mode, setMode, theme: t } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const btnRef = useRef(null);
  const timerRef = useRef(null);
  const [hoverDir, setHoverDir] = useState(null);
  const [isLit, setIsLit] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const target = sessionStorage.getItem('scrollTarget');
    if (target && window.location.pathname === '/') {
      sessionStorage.removeItem('scrollTarget');
      requestAnimationFrame(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, []);

  const getDirection = (e, elem) => {
    const rect = elem.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const dir = Math.round(Math.atan2(y, x) / (Math.PI / 2) + 4) % 4;
    return ['top', 'right', 'bottom', 'left'][dir];
  };

  const handleMouseEnter = (e) => {
    if (!btnRef.current) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoverDir(getDirection(e, btnRef.current));
    setIsLit(true);
  };

  const handleMouseLeave = (e) => {
    if (!btnRef.current) return;
    setHoverDir(getDirection(e, btnRef.current));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsLit(false);
    }, 1000);
  };

  const getTransform = () => {
    if (isLit) return 'translate(0%, 0%)';
    switch (hoverDir) {
      case 'top': return 'translate(0%, -100%)';
      case 'bottom': return 'translate(0%, 100%)';
      case 'left': return 'translate(-100%, 0%)';
      case 'right': return 'translate(100%, 0%)';
      default: return 'translate(-100%, 0%)';
    }
  };

  const navLinks = [
    { label: 'SERVICES', href: '/#services', code: '01', Icon: Wrench },
    { label: 'WORKFLOW', href: '/#workflow', code: '02', Icon: GitCommit },
    { label: 'ROLES', href: '/#team', code: '03', Icon: Users2 },
    { label: 'About US', href: '/AboutUs', code: '04', Icon: BookOpen },

  ];

  const handleNavClick = (e, href) => {
    const hashIndex = href.indexOf('#');

    if (hashIndex === -1) {
      setMobileMenuOpen(false);
      return;
    }

    const hash = href.slice(hashIndex + 1);
    e.preventDefault();
    setMobileMenuOpen(false);

    if (window.location.pathname === '/') {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      sessionStorage.setItem('scrollTarget', hash);
      navigate('/');
    }
  };

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md transition-colors duration-150"
      style={{
        background: mode === 'light' ? 'rgba(246, 244, 251, 0.92)' : 'rgba(15, 18, 25, 0.90)',
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <Logo className="flex items-center justify-center transition-transform duration-150 group-hover:scale-95 shadow-sm"/>
          

          <div className="flex flex-col">
            <span
              className="wd-display text-base sm:text-lg font-black tracking-tight leading-none"
              style={{ color: t.text }}
            >
              WORKERS<span style={{ color: t.accent }}>DEN</span>
            </span>
            <span className="wd-mono text-[9px] tracking-widest uppercase mt-0.5" style={{ color: t.muted }}>
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2.5 wd-mono text-xs">
          {navLinks.map(({ label, href, Icon, About}) => (
            <a
              key={label}
              href={href}
              className="px-3 py-1.5 border transition-all duration-150 hover:-translate-y-0.5 flex items-center gap-2"
              style={{
                borderColor: t.border,
                color: t.text,
                background: mode === 'light' ? 'rgba(251, 250, 252, 0.6)' : 'rgba(23, 29, 42, 0.6)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = t.accent;
                e.currentTarget.style.background = t.accentSoft;
                e.currentTarget.style.color = t.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = t.border;
                e.currentTarget.style.background = mode === 'light' ? 'rgba(251, 250, 252, 0.6)' : 'rgba(23, 29, 42, 0.6)';
                e.currentTarget.style.color = t.text;
              }}
            >
              <div
                className="w-4 h-4 flex items-center justify-center border text-[9px] font-bold shrink-0"
                style={{ borderColor: t.border, background: t.surface }}
              >
                <Icon size={10} strokeWidth={2.5} />
              </div>
              <span className="font-semibold tracking-wider">{label}</span>
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            className="wd-mono flex items-center gap-2 px-2.5 py-1.5 text-[11px] font-bold border cursor-pointer transition-colors"
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
                width: 24,
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
                  transform: mode === 'dark' ? 'translateX(12px)' : 'translateX(0)',
                  transition: 'transform 120ms ease',
                }}
              />
            </span>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="wd-mono text-xs font-semibold px-3 py-1.5 transition-colors cursor-pointer"
              style={{ color: t.text }}
              onMouseEnter={(e) => (e.currentTarget.style.color = t.accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = t.text)}
            >
              LOG IN
            </button>

            <button
              ref={btnRef}
              type="button"
              onClick={() => navigate('/register')}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative overflow-hidden wd-mono text-xs font-bold px-4 py-2 flex items-center gap-2 cursor-pointer select-none"
              style={{
                border: `1px solid ${t.accent}`,
                background: 'transparent',
                color: isLit ? t.accentText : t.accent,
                transition: 'color 200ms ease',
              }}
            >
              <span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: t.accent,
                  transform: getTransform(),
                  transition: 'transform 260ms cubic-bezier(0.25, 1, 0.5, 1)',
                  zIndex: 0,
                }}
              />

              <span className="relative z-10 flex items-center gap-1.5 tracking-wider font-extrabold">
                GET STARTED
                <ArrowRight size={14} strokeWidth={2.75} />
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 border flex items-center justify-center cursor-pointer"
            style={{ borderColor: t.border, color: t.text, background: t.surface }}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="md:hidden w-full border-t px-5 py-4 space-y-3 wd-mono text-xs"
          style={{ background: t.surface, borderColor: t.border }}
        >
          <div className="flex flex-col gap-2">
            {navLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, {
                      borderColor: t.accent,
                      background: t.accentSoft,
                      color: t.accent
                    })}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, {
                      borderColor: t.border,
                      background: mode === 'light' ? 'rgba(251, 250, 252, 0.6)' : 'rgba(23, 29, 42, 0.6)',
                      color: t.text
                    })}
                className="py-2.5 px-3 border font-semibold flex items-center justify-between"
                style={{ borderColor: t.border, color: t.text }}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-5 h-5 flex items-center justify-center border text-[9px]"
                    style={{ borderColor: t.border, color: t.accent }}
                  >
                    <Icon size={12} />
                  </div>
                  <span>{label}</span>
                </div>
                <ArrowRight size={13} style={{ color: t.accent }} />
              </a>
            ))}

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                className="w-full py-2.5 border text-center font-bold cursor-pointer"
                style={{ borderColor: t.border, color: t.text }}
              >
                LOG IN
              </button>

              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); navigate('./register'); }}
                className="w-full py-2.5 font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                style={{ background: t.accent, color: t.accentText, border: 'none' }}
              >
                GET STARTED <ArrowRight size={14} strokeWidth={2.75} />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
