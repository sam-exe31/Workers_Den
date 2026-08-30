import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0B0D]/90 backdrop-blur-md border-b border-[#27272A] px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <div 
          onClick={() => navigate('/')} 
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

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#A0A0AA]">
          <a href="#services" className="hover:text-[#F7F6F2] transition-colors">Services</a>
          <a href="#how-it-works" className="hover:text-[#F7F6F2] transition-colors">How it works</a>
          <a href="#find-jobs" className="hover:text-[#F7F6F2] transition-colors">Find Jobs</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/login')}
            className="text-xs font-medium text-[#A0A0AA] hover:text-[#F7F6F2] px-3 py-2 transition-colors"
          >
            Log in
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="group bg-[#F4A340] hover:bg-[#E09230] text-[#0B0B0D] font-semibold text-xs px-4 py-2 rounded-[10px] transition-all flex items-center gap-1 shadow-sm"
          >
            <span>Get Started</span>
            <ArrowUpRight size={13} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </header>
  );
}