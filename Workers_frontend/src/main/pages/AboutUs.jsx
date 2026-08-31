import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import LandingNavbar from '../Component/LandingNavbar';
import Footer from '../Component/Footer';
import { ShieldCheck, Wallet, Clock, Users, ArrowRight, MapPin } from 'lucide-react';

const STATS = [
  { label: 'VERIFIED TECHNICIANS', value: '500+' },
  { label: 'JOBS COMPLETED', value: '12,000+' },
  { label: 'AVG RATING', value: '4.8 / 5' },
  { label: 'SECTORS COVERED', value: '9' },
];

const VALUES = [
  {
    Icon: ShieldCheck,
    title: 'Verified, Not Just Listed',
    body: 'Every technician on the platform is identity-checked and background-reviewed before they can claim a single job.',
  },
  {
    Icon: Wallet,
    title: 'Standardized Pricing',
    body: 'No bidding wars, no last-minute markups. Every category has a fixed customer price and a guaranteed worker payout, set upfront.',
  },
  {
    Icon: Clock,
    title: 'Fast Dispatch',
    body: 'Jobs post to the matched sector feed instantly. Technicians claim, accept, and get moving — most jobs are picked up within the hour.',
  },
  {
    Icon: Users,
    title: 'Built for Both Sides',
    body: 'Customers get accountability and fair pricing. Workers get steady leads, guaranteed payouts, and control over their own schedule.',
  },
];

export default function AboutUs() {
  const navigate = useNavigate();
  const { mode, theme: t } = useTheme();

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans transition-colors duration-150">
      <LandingNavbar />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b" style={{ borderColor: t.border }}>
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1600&auto=format&fit=crop&q=80"
              alt="Workers Den technicians"
              className="w-full h-full object-cover"
              style={{ filter: mode === 'dark' ? 'brightness(0.35) contrast(1.1)' : 'brightness(0.55) contrast(1.05)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: mode === 'dark' ? 'linear-gradient(to bottom, rgba(15,18,25,0.7), rgba(15,18,25,0.94))' : 'linear-gradient(to bottom, rgba(28,21,40,0.55), rgba(28,21,40,0.85))' }}
            />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-20 sm:py-28 text-center">
            <span className="wd-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-white/30 text-white/90">
              ABOUT WORKERS DEN
            </span>
            <h1 className="wd-display font-black text-3xl sm:text-5xl text-white uppercase tracking-tight mt-4 leading-tight">
              Skilled work, run like infrastructure.
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto mt-4 leading-relaxed">
              Workers Den connects verified tradespeople with customers across Pune — with fixed pricing, guaranteed payouts,
              and accountability built into every job order.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="border p-5 text-center" style={{ background: t.surface, borderColor: t.border }}>
              <div className="wd-display font-black text-2xl" style={{ color: t.accent }}>{s.value}</div>
              <div className="wd-mono text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: t.muted }}>{s.label}</div>
            </div>
          ))}
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
          <div className="max-w-2xl">
            <div className="wd-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accent }}>OUR STORY</div>
            <h2 className="wd-display font-black text-2xl uppercase tracking-tight mt-1" style={{ color: t.text }}>
              Why we built this
            </h2>
            <p className="text-sm leading-relaxed mt-3" style={{ color: t.muted }}>
              Finding a plumber, electrician, or handyman you can actually trust usually means asking around, hoping for the best,
              and negotiating a price on the spot. On the other side, skilled technicians lose hours chasing leads through word of mouth
              with no guarantee they get paid what they were promised.
            </p>
            <p className="text-sm leading-relaxed mt-3" style={{ color: t.muted }}>
              Workers Den fixes both sides of that problem — a dispatch system where every job has a fixed price, every technician
              is verified before they can claim work, and every payout is guaranteed the moment a job is marked complete.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
          <div className="wd-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accent }}>HOW IT WORKS</div>
          <h2 className="wd-display font-black text-2xl uppercase tracking-tight mt-1 mb-6" style={{ color: t.text }}>
            What we stand on
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map(({ Icon, title, body }) => (
              <div key={title} className="border p-6" style={{ background: t.surface, borderColor: t.border }}>
                <div className="w-10 h-10 border flex items-center justify-center mb-4" style={{ borderColor: t.accent, background: t.accentSoft, color: t.accent }}>
                  <Icon size={18} />
                </div>
                <h3 className="wd-display font-black text-base uppercase" style={{ color: t.text }}>{title}</h3>
                <p className="text-xs leading-relaxed mt-2" style={{ color: t.muted }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t" style={{ borderColor: t.border, background: t.accentSoft }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="wd-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: t.accent }}>
                <MapPin size={12} /> CURRENTLY LIVE IN PUNE
              </div>
              <h2 className="wd-display font-black text-xl sm:text-2xl uppercase tracking-tight mt-1" style={{ color: t.text }}>
                Ready to get started?
              </h2>
            </div>
            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="wd-mono wd-btn text-xs font-bold px-6 py-3.5 flex items-center gap-2 cursor-pointer"
                style={{ background: t.accent, color: t.accentText, border: 'none' }}
              >
                BOOK A SERVICE <ArrowRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => navigate('/register?role=WORKER')}
                className="wd-mono wd-btn text-xs font-bold px-6 py-3.5 border cursor-pointer"
                style={{ borderColor: t.border, color: t.text, background: 'transparent' }}
              >
                JOIN AS A WORKER
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
