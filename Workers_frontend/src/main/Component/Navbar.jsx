import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Find Jobs', href: '#find-jobs' },
];

export function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0B0D]/90 backdrop-blur-md border-b border-[#27272A] px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div
          onClick={() => goTo('/')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-[8px] bg-[#16161A] border border-[#27272A] flex items-center justify-center text-[#F4A340] group-hover:border-[#F4A340] transition-colors">
            <ShieldCheck size={18} strokeWidth={2.2} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-lg tracking-tight text-[#F7F6F2]">
              WORKERS<span className="text-[#F4A340]"> DEN</span>
            </span>
            <span className="text-[10px] font-mono text-[#A0A0AA] px-1.5 py-0.5 bg-[#16161A] border border-[#27272A] rounded-sm">
              PUNE
            </span>
          </div>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#A0A0AA]">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-[#F7F6F2] transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => goTo('/login')}
            className="text-xs font-medium text-[#A0A0AA] hover:text-[#F7F6F2] px-3 py-2 transition-colors cursor-pointer"
          >
            Log in
          </button>
          <button
            onClick={() => goTo('/register')}
            className="group bg-[#F4A340] hover:bg-[#E09230] text-[#0B0B0D] font-semibold text-xs px-4 py-2 rounded-[10px] transition-all flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <span>Post a Job</span>
            <ArrowUpRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 rounded-[8px] border border-[#27272A] text-[#F7F6F2] cursor-pointer"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden max-w-7xl mx-auto mt-3 pt-3 border-t border-[#27272A] flex flex-col gap-1 text-sm">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-2 py-2.5 rounded-[8px] text-[#A0A0AA] hover:text-[#F7F6F2] hover:bg-[#16161A] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => goTo('/login')}
              className="flex-1 text-xs font-medium text-[#F7F6F2] border border-[#27272A] rounded-[8px] py-2.5 cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={() => goTo('/register')}
              className="flex-1 bg-[#F4A340] text-[#0B0B0D] font-semibold text-xs rounded-[8px] py-2.5 cursor-pointer"
            >
              Post a Job
            </button>
          </div>
        </div>
      )}
    </header>
  );
}