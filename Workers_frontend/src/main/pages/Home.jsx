import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext'; 
import api from '../../api/axiosClient';
import { ArrowRight, ShieldCheck, Zap, Layers, Users, Wrench } from 'lucide-react';

const STATIC_CATEGORIES = [
  { name: 'Plumbing', price: '₹499', code: 'TR-01', image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80' },
  { name: 'Electrical', price: '₹399', code: 'TR-02', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80' },
  { name: 'Carpentry', price: '₹599', code: 'TR-03', image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80' },
  { name: 'Painting', price: '₹799', code: 'TR-04', image: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=600&auto=format&fit=crop&q=80' },
  { name: 'Cleaning', price: '₹349', code: 'TR-05', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80' },
  { name: 'AC Repair', price: '₹449', code: 'TR-06', image: 'https://plus.unsplash.com/premium_photo-1683134512538-7b390d0adc9e?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXBwbGlhbmNlJTIwZml4fGVufDB8fDB8fHww' },
  { name: 'Appliance Fix', price: '₹549', code: 'TR-07', image: 'https://images.unsplash.com/photo-1758101755915-462eddc23f57?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { name: 'General Help', price: '₹299', code: 'TR-08', image: 'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=600&auto=format&fit=crop&q=80' },
];

const STATS = [
  { value: '500+', label: 'Jobs Completed' },
  { value: '120+', label: 'Verified Pros' },
  { value: '4.8', label: 'Avg. Rating' },
  { value: '30 Days', label: 'Service Warranty' },
];

const WORKFLOW = [
  {
    step: '01',
    title: 'DIRECT DISPATCH',
    desc: 'Requests auto-match with qualified local tradesmen without bid wars or wait times.',
    Icon: Zap,
  },
  {
    step: '02',
    title: 'LOCKED PRICING',
    desc: 'Standardized rate cards and optimistic concurrency lock prevent surprise overcharging.',
    Icon: ShieldCheck,
  },
  {
    step: '03',
    title: 'VERIFIED SIGN-OFF',
    desc: 'Payments and ratings release strictly when the task transitions to COMPLETED status.',
    Icon: Layers,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { mode, theme: t } = useTheme();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/Categories')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const merged = res.data.map((cat, idx) => ({
            name: cat.catName,
            price: `₹${cat.customerPrice}`,
            code: `TR-0${idx + 1}`,
            image: STATIC_CATEGORIES[idx % STATIC_CATEGORIES.length].image,
          }));
          setCategories(merged);
        } else {
          setCategories(STATIC_CATEGORIES);
        }
      })
      .catch(() => setCategories(STATIC_CATEGORIES));
  }, []);

  const displayCategories = categories.length > 0 ? categories : STATIC_CATEGORIES;

  return (
    <div
      style={{
        background: t.bg,
        color: t.text,
        transition: 'background 150ms ease, color 150ms ease',
      }}
      className="w-full min-h-screen"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 space-y-16">
        
        {/* ─── Hero Section ─── */}
        <section className="pt-4 sm:pt-10">
          <div className="flex items-center gap-2 mb-4">
            <span
              className="wd-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 border uppercase tracking-wider"
              style={{
                background: t.accentSoft,
                borderColor: t.border,
                color: t.accent,
              }}
            >
              PUNE 
            </span>
            <span className="flex items-center gap-1.5 wd-mono text-[10px] font-bold" style={{ color: t.success }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: t.success }} />
              VERIFIED WORKFORCE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <h1
                className="wd-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-none uppercase"
                style={{ color: t.text }}
              >
                Post the job. <span style={{ color: t.accent }}>Find the worker.</span> Close it out.
              </h1>

              <p className="text-sm sm:text-base leading-relaxed max-w-xl" style={{ color: t.muted }}>
                Standardized platform pricing, real-time work-order tracking, and verified trade professionals. Built like physical tools for repeat daily operation.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="wd-mono wd-btn text-xs font-bold px-6 py-3.5 flex items-center gap-2 cursor-pointer shadow-xs"
                  style={{
                    background: t.accent,
                    color: t.accentText,
                    border: 'none',
                  }}
                >
                  BOOK A SERVICE <ArrowRight size={14} strokeWidth={2.5} />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="wd-mono wd-btn text-xs font-semibold px-5 py-3.5 border cursor-pointer"
                  style={{
                    borderColor: t.border,
                    color: t.text,
                    background: 'transparent',
                  }}
                >
                  OPERATE AS WORKER
                </button>
              </div>
            </div>
          
          </div>
        </section>
        

        {/* ─── Service Category Photo Cards ─── */}
        <section id="services" className="space-y-6">
          <div className="flex justify-between items-baseline border-b pb-3" style={{ borderColor: t.border }}>
            <div className="flex items-center gap-2">
              <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}></span>
              <h2 className="wd-display font-black text-xl uppercase tracking-tight" style={{ color: t.text }}>
                Standard Service Catalog
              </h2>
            </div>
            <span className="wd-mono text-xs" style={{ color: t.muted }}></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {displayCategories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate('/browse')}
                className="group relative border overflow-hidden cursor-pointer flex flex-col justify-end transition-all duration-200 hover:-translate-y-1"
                style={{
                  background: t.surface,
                  borderColor: t.border,
                  minHeight: 220,
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{
                    filter: mode === 'dark' ? 'brightness(0.65) contrast(1.1)' : 'brightness(0.85) contrast(1.05)',
                  }}
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background: mode === 'dark'
                      ? 'linear-gradient(to top, rgba(15, 18, 25, 0.95) 0%, rgba(15, 18, 25, 0.3) 60%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(28, 21, 40, 0.9) 0%, rgba(28, 21, 40, 0.25) 60%, transparent 100%)',
                  }}
                />

                <div className="relative z-10 p-4 space-y-1">
                  <div className="wd-display font-black text-lg text-white uppercase tracking-tight">
                    {cat.name}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="wd-mono text-xs font-bold text-white/90">
                      from {cat.price}
                    </span>
                    <span className="wd-mono text-[10px] text-white/70 border border-white/30 px-1.5 py-0.5">
                      INSTANT
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="grid grid-cols-2 lg:grid-cols-4 border divide-x"
          style={{
            background: t.surface,
            borderColor: t.border,
          }}
        >
          {STATS.map((s, idx) => (
            <div key={idx} className="p-5 sm:p-6" style={{ borderColor: t.border }}>
              <div className="wd-display font-black text-2xl sm:text-3xl" style={{ color: t.accent }}>
                {s.value}
              </div>
              <div className="wd-mono text-[11px] font-semibold mt-1 uppercase tracking-wider" style={{ color: t.muted }}>
                {s.label}
              </div>
            </div>
          ))}
        </section>

        {/* ─── Workflow Execution ─── */}
        <section id="workflow" className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: t.border }}>
            <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}></span>
            <h2 className="wd-display font-black text-xl uppercase tracking-tight" style={{ color: t.text }}>
              Execution Protocol
            </h2>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 border divide-y md:divide-y-0 md:divide-x"
            style={{ background: t.surface, borderColor: t.border }}
          >
            {WORKFLOW.map(({ step, title, desc, Icon }) => (
              <div key={step} className="p-6 space-y-3" style={{ borderColor: t.border }}>
                <div
                  className="w-8 h-8 flex items-center justify-center border"
                  style={{ borderColor: t.border, background: t.accentSoft, color: t.accent }}
                >
                  <Icon size={16} strokeWidth={2.25} />
                </div>
                <div className="wd-mono text-[10px] font-bold" style={{ color: t.accent }}>
                  STEP {step}
                </div>
                <h3 className="wd-display font-extrabold text-base uppercase" style={{ color: t.text }}>
                  {title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: t.muted }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Roles & Access ─── */}
        <section id="team" className="space-y-6">
          <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: t.border }}>
            <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}></span>
            <h2 className="wd-display font-black text-xl uppercase tracking-tight" style={{ color: t.text }}>
              Platform Roles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className="p-6 border flex items-start gap-4"
              style={{ background: t.surface, borderColor: t.border }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center border shrink-0"
                style={{ borderColor: t.border, background: t.accentSoft, color: t.accent }}
              >
                <Users size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="wd-display font-black text-base uppercase" style={{ color: t.text }}>Customer Console</h4>
                <p className="text-xs leading-relaxed" style={{ color: t.muted }}>
                  Create job  with specific time slots, inspect assigned operator profiles, and release payment ratings upon closeout.
                </p>
              </div>
            </div>

            <div
              className="p-6 border flex items-start gap-4"
              style={{ background: t.surface, borderColor: t.border }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center border shrink-0"
                style={{ borderColor: t.border, background: t.accentSoft, color: t.accent }}
              >
                <Wrench size={18} />
              </div>
              <div className="space-y-1">
                <h4 className="wd-display font-black text-base uppercase" style={{ color: t.text }}>Worker Terminal</h4>
                <p className="text-xs leading-relaxed" style={{ color: t.muted }}>
                  Discover local sector tickets, claim jobs with one click, and manage progress through the state machine.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Bottom CTA ─── */}
        <section
          className="border p-8 flex flex-col sm:flex-row items-center justify-between gap-6"
          style={{ background: t.surface, borderColor: t.border }}
        >
          <div className="space-y-1">
            <div className="wd-mono text-xs font-bold" style={{ color: t.accent }}>READY TO DISPATCH?</div>
            <div className="wd-display font-black text-xl uppercase" style={{ color: t.text }}>
              Book an appointment or claim open work orders now.
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="wd-mono wd-btn text-xs font-bold px-6 py-3.5 whitespace-nowrap cursor-pointer"
            style={{
              background: t.accent,
              color: t.accentText,
              border: 'none',
            }}
          >
            ENTER PLATFORM →
          </button>
        </section>

        {/* ─── Footer ─── */}
        <footer
          className="pt-6 pb-12 border-t flex flex-col sm:flex-row justify-between items-center gap-4 wd-mono text-xs"
          style={{ borderColor: t.border, color: t.muted }}
        >
          <div>© 2026 WORKERS DEN · ALL RIGHTS RESERVED </div>
          <div>A samesa company product</div>
        </footer>

      </div>
    </div>
  );
}
