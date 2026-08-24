import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import LandingNavbar from '../Component/LandingNavbar';
import Footer from '../Component/Footer';
import { ShieldCheck, Wallet, Clock, Users, ArrowRight, MapPin } from 'lucide-react';

const GithubIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.5 0 12.3c0 5.44 3.44 10.05 8.21 11.68.6.11.82-.27.82-.6 0-.29-.01-1.06-.02-2.08-3.34.75-4.04-1.66-4.04-1.66-.55-1.42-1.34-1.8-1.34-1.8-1.09-.77.08-.75.08-.75 1.21.09 1.84 1.28 1.84 1.28 1.07 1.88 2.81 1.33 3.5 1.02.11-.8.42-1.33.76-1.64-2.67-.31-5.47-1.38-5.47-6.15 0-1.36.47-2.47 1.24-3.34-.12-.31-.54-1.57.12-3.28 0 0 1.01-.33 3.3 1.28.96-.27 1.98-.41 3-.42 1.02.01 2.04.15 3 .42 2.29-1.6 3.3-1.28 3.3-1.28.66 1.71.24 2.97.12 3.28.77.87 1.24 1.98 1.24 3.34 0 4.78-2.81 5.83-5.49 6.14.43.38.81 1.13.81 2.28 0 1.65-.02 2.98-.02 3.38 0 .33.22.72.83.6C20.57 22.34 24 17.74 24 12.3 24 5.5 18.63 0 12 0z" />
  </svg>
);

const LinkedinIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.48v6.26zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
  </svg>
);

const LeetcodeIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.48 23.4a3.14 3.14 0 0 1-2.2-.9l-4.53-4.5a3.04 3.04 0 0 1-.65-3.36l2.86-6.9a3.15 3.15 0 0 1 1.94-1.79l6.98-2.27a3.16 3.16 0 0 1 3.36.83l1.6 1.75a1.6 1.6 0 0 1-2.36 2.16l-1.6-1.75a.35.35 0 0 0-.36-.09l-6.98 2.27a.35.35 0 0 0-.21.2l-2.86 6.9c-.05.13-.02.28.08.38l4.53 4.5c.1.1.25.13.38.08l6.85-2.32a.35.35 0 0 0 .2-.2l.9-2.16a1.6 1.6 0 0 1 2.96 1.22l-.9 2.16a3.15 3.15 0 0 1-1.95 1.8l-6.85 2.32c-.36.12-.73.18-1.09.18z" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: 'GitHub', Icon: GithubIcon, href: '#' },
  { label: 'LinkedIn', Icon: LinkedinIcon, href: '#' },
  { label: 'LeetCode', Icon: LeetcodeIcon, href: '#' },
];

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

        <section className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
          <div className="wd-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accent }}>THE BUILDER</div>
          <h2 className="wd-display font-black text-2xl uppercase tracking-tight mt-1 mb-6" style={{ color: t.text }}>
            Who's behind this
          </h2>

          <div className="border p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6" style={{ background: t.surface, borderColor: t.border }}>
            <div
              className="w-16 h-16 border flex items-center justify-center font-black text-xl shrink-0"
              style={{ borderColor: t.accent, background: t.accentSoft, color: t.accent }}
            >
              SG
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="wd-display font-black text-lg uppercase" style={{ color: t.text }}>Samarth Ghate</h3>
                <span className="wd-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border" style={{ borderColor: t.border, color: t.muted }}>
                  Solo Builder
                </span>
              </div>

              <p className="text-xs leading-relaxed mt-3 max-w-xl" style={{ color: t.muted }}>
                Workers Den is a solo-built, end-to-end service marketplace — designed, backed, and shipped from scratch
                as a major project. It covers full-stack architecture, JWT-based auth, role-based dispatch logic, and a
                production-style frontend, built to be a proper showcase of real-world engineering, not a tutorial clone.
              </p>

              <div className="flex items-center gap-3 mt-5">
                {SOCIAL_LINKS.map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 border flex items-center justify-center transition-colors duration-150 hover:opacity-75"
                    style={{ borderColor: t.border, color: t.text }}
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        
      </main>

      <Footer />
    </div>
  );
}