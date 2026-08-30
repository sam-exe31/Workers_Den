import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import api from '../../api/axiosClient';
import { Navbar } from '../Component/Navbar';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  MapPin,
  Camera,
  CheckCircle2,
  Briefcase,
  Star,
  Tag,
  IndianRupee,
  User,
  Wrench,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Static fallback jobs
───────────────────────────────────────────── */
const STATIC_JOBS = [
  { name: 'AC Repair',     price: 700,  area: 'Kothrud',  timing: 'Today · 6:00 PM',      photos: 2, picked: 3, desc: "AC isn't cooling properly." },
  { name: 'Home Cleaning', price: 1200, area: 'Baner',    timing: 'Tomorrow · 10:00 AM',  photos: 4, picked: 2, desc: '2BHK deep clean before moving in.' },
  { name: 'Catering',      price: 8500, area: 'Wakad',    timing: 'Saturday · 4:00 PM',   photos: 0, picked: 4, desc: 'Traditional snacks & setup for 40 guests.' },
  { name: 'Electrical',    price: 600,  area: 'Hadapsar', timing: 'Today · 3:00 PM',      photos: 1, picked: 2, desc: 'Install 3 ceiling fans.' },
];

const PRO_ROLES = ['Electricians', 'Plumbers', 'Cleaners', 'Caterers', 'Photographers', 'Carpenters', 'AC Technicians', 'Painters'];

/* Real service imagery, treated dark so it reads as product — not stock.
   IDs reused from the auth pages so brand imagery carries through signup. */
const IMAGES = {
  customer: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1000&auto=format&fit=crop&q=80',
  worker:   'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&auto=format&fit=crop&q=80',
  job:      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1000&auto=format&fit=crop&q=80',
};

/* ─────────────────────────────────────────────
   Shared button treatments — the highlighted CTA
───────────────────────────────────────────── */
const BTN_PRIMARY =
  'group inline-flex items-center justify-center gap-2 bg-[#F4A340] hover:bg-[#E09230] active:scale-[0.98] text-[#0B0B0D] font-bold text-sm px-6 py-3 rounded-[10px] transition-all duration-200 cursor-pointer shadow-lg shadow-[#F4A340]/25 hover:shadow-xl hover:shadow-[#F4A340]/40 hover:-translate-y-0.5';
const BTN_OUTLINE =
  'group inline-flex items-center justify-center gap-2 bg-transparent border border-[#3E3E44] hover:border-[#F7F6F2] text-[#F7F6F2] font-semibold text-sm px-6 py-3 rounded-[10px] transition-all duration-200 cursor-pointer hover:-translate-y-0.5';
const BTN_LIGHT =
  'group inline-flex items-center justify-center gap-2 bg-[#F7F6F2] hover:bg-white active:scale-[0.98] text-[#0B0B0D] font-bold text-sm px-6 py-3 rounded-[10px] transition-all duration-200 cursor-pointer shadow-lg shadow-black/30 hover:-translate-y-0.5';

/* ─────────────────────────────────────────────
   Motion primitives (reused across sections)
───────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1];

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* ─────────────────────────────────────────────
   Hero Job Card — the product's visual centerpiece.
   Animates once on mount: card lifts in, the 4-step
   tracker fills to the live "Pick" step, and the pros
   who picked stack in — reinforcing "you choose".
───────────────────────────────────────────── */
function HeroJobCard() {
  const reduce = useReducedMotion();
  const steps = ['Post', 'Pick', 'Choose', 'Done'];
  const activeStep = 1; // "Pick" is live — 3 pros have already picked
  const pros = [
    { initials: 'RS', color: '#F4A340' },
    { initials: 'AK', color: '#6EA8FE' },
    { initials: 'SP', color: '#A78BFA' },
  ];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      className="relative w-full max-w-sm"
    >
      {/* soft glow behind the card */}
      <div className="pointer-events-none absolute -inset-6 bg-[#F4A340]/10 blur-3xl rounded-full" aria-hidden />

      <div className="relative bg-[#16161A] border border-[#27272A] rounded-[18px] overflow-hidden shadow-2xl">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#27272A]">
          <span className="flex items-center gap-2 text-[#F4A340] text-[11px] font-mono font-semibold uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#F4A340] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F4A340]" />
            </span>
            Job Posted
          </span>
          <span className="text-[11px] font-mono text-[#57575E]">Just now</span>
        </div>

        {/* Job detail */}
        <div className="px-5 py-5 space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#57575E]">AC Repair</span>
            <h3 className="mt-1 font-bold text-[18px] leading-snug text-[#F7F6F2]">
              AC isn't cooling
            </h3>
          </div>
          <div className="flex flex-col gap-1.5 text-[12px] text-[#A0A0AA]">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} className="text-[#F4A340]" />
              Kothrud, Pune
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              Today · 6:00 PM
            </span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[9px] font-mono uppercase text-[#57575E] block">Fixed price</span>
              <span className="text-[22px] font-bold text-[#F7F6F2]">₹700</span>
            </div>
            {/* pros who picked — you choose */}
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex -space-x-2">
                {pros.map((p, i) => (
                  <motion.span
                    key={p.initials}
                    initial={reduce ? false : { opacity: 0, scale: 0.4, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.7 + i * 0.15 }}
                    className="w-6 h-6 rounded-full border-2 border-[#16161A] flex items-center justify-center text-[8px] font-bold text-[#0B0B0D]"
                    style={{ background: p.color }}
                  >
                    {p.initials}
                  </motion.span>
                ))}
              </div>
              <span className="text-[10px] text-[#A0A0AA]">
                3 picked · <span className="text-[#F4A340] font-semibold">you choose</span>
              </span>
            </div>
          </div>
        </div>

        {/* 4-step progress tracker */}
        <div className="px-5 py-4 border-t border-[#27272A]">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => {
              const isDone = i < activeStep;
              const isActive = i === activeStep;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1">
                    <motion.div
                      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * 0.12 }}
                      className={[
                        'relative w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold',
                        isDone || isActive ? 'bg-[#F4A340] text-[#0B0B0D]' : 'bg-[#27272A] text-[#57575E]',
                      ].join(' ')}
                    >
                      {isActive && !reduce && (
                        <motion.span
                          className="absolute inset-0 rounded-full ring-2 ring-[#F4A340]"
                          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                      {isDone ? '✓' : i + 1}
                    </motion.div>
                    <span className={[
                      'text-[9px] font-mono uppercase tracking-wide',
                      isActive || isDone ? 'text-[#F4A340]' : 'text-[#57575E]',
                    ].join(' ')}>
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="relative flex-1 h-px mx-2 bg-[#27272A] overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-[#F4A340]"
                        initial={reduce ? false : { width: '0%' }}
                        animate={{ width: i < activeStep ? '100%' : '0%' }}
                        transition={{ duration: 0.5, ease: EASE, delay: 0.4 + i * 0.12 }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="px-5 pb-5">
          <button className="group w-full bg-[#0B0B0D] border border-[#27272A] hover:border-[#F4A340] text-[#F7F6F2] text-[11px] font-mono py-2.5 rounded-[10px] transition-colors cursor-pointer flex items-center justify-center gap-1.5">
            View Responses
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main page
───────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/Categories')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((cat, idx) => ({
            name:   cat.catName,
            price:  cat.customerPrice || 500,
            area:   ['Kothrud', 'Baner', 'Wakad', 'Hadapsar'][idx % 4],
            timing: ['Today · 2:00 PM', 'Tomorrow · 10:00 AM', 'Today · 5:00 PM', 'Saturday · 11:00 AM'][idx % 4],
            photos: idx % 3,
            picked: (idx % 3) + 1,
            desc:   `${cat.catName} job across Pune. Quick pick-up by nearby professionals.`,
          }));
          setJobs(mapped);
        } else {
          setJobs(STATIC_JOBS);
        }
      })
      .catch(() => setJobs(STATIC_JOBS));
  }, []);

  const displayJobs               = jobs.length > 0 ? jobs : STATIC_JOBS;
  const [featuredJob, ...restJobs] = displayJobs;
  const secondaryJobs              = restJobs.slice(0, 3);

  /* Scroll-reveal props — one-time, gentle, and fully disabled
     under prefers-reduced-motion so content never gets stuck hidden. */
  const revealProps = reduce
    ? {}
    : { variants: fadeUp, initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-80px' } };
  const staggerProps = reduce
    ? {}
    : { variants: staggerContainer, initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-80px' } };
  const childVariants = reduce ? undefined : fadeUp;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F7F6F2] flex flex-col font-sans selection:bg-[#F4A340] selection:text-[#0B0B0D]">
      <Navbar />

      <main className="flex-1">

        {/* ═══════════════════════════════════════
            HERO
        ═══════════════════════════════════════ */}
        <section className="relative w-full pt-16 pb-24 px-6 border-b border-[#27272A] overflow-hidden">
          {/* ambient depth: fine dot grid + warm glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            aria-hidden
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #1c1c22 1px, transparent 0)',
              backgroundSize: '32px 32px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%)',
            }}
          />
          <div className="pointer-events-none absolute -top-24 right-0 w-[38rem] h-[38rem] bg-[#F4A340]/[0.06] blur-[120px] rounded-full" aria-hidden />

          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

            {/* Left: copy + CTAs */}
            <motion.div
              className="lg:col-span-6 space-y-8"
              variants={staggerContainer}
              initial={reduce ? false : 'hidden'}
              animate="show"
            >
              {/* Eyebrow */}
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-3 py-1 bg-[#16161A] border border-[#27272A] rounded-full text-[#F4A340]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#F4A340] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F4A340]" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest">
                  Now live in Pune
                </span>
              </motion.div>

              {/* Headline */}
              <motion.div variants={fadeUp} className="space-y-1">
                <h1 className="font-bold text-5xl sm:text-6xl tracking-tight leading-[1.05]">
                  Got a job?
                </h1>
                <p className="font-bold text-5xl sm:text-6xl tracking-tight leading-[1.05] text-[#A0A0AA]">
                  Post it. Get it done.
                </p>
              </motion.div>

              {/* Description */}
              <motion.p variants={fadeUp} className="text-[15px] text-[#A0A0AA] leading-relaxed max-w-md">
                Describe what you need, when and where. Skilled people
                nearby pick your job — you choose who gets it done.
              </motion.p>

              {/* CTA buttons */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  id="hero-post-job-btn"
                  onClick={() => navigate('/register?role=CUSTOMER')}
                  className={BTN_PRIMARY}
                >
                  Post a Job
                  <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  id="hero-find-jobs-btn"
                  onClick={() => navigate('/register?role=WORKER')}
                  className={BTN_OUTLINE}
                >
                  Find Work
                  <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </motion.div>

              {/* Trust strip */}
              <motion.div variants={fadeUp} className="flex items-center flex-wrap gap-x-4 gap-y-2 text-[11px] text-[#57575E]">
                <span className="flex items-center gap-1.5">
                  <Tag size={12} className="text-[#F4A340]" />
                  Fixed prices — no haggling
                </span>
                <span className="w-1 h-1 rounded-full bg-[#27272A]" />
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[#F4A340]" />
                  ID verification rolling out
                </span>
              </motion.div>
            </motion.div>

            {/* Right: Hero Job Card (the product, not a stock photo) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <HeroJobCard />
            </div>

          </div>
        </section>

        {/* ═══════════════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════════════ */}
        <section id="how-it-works" className="w-full py-24 px-6 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto space-y-14">
            <motion.div {...revealProps} className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F4A340]">Simple flow</span>
              <h2 className="text-4xl font-bold tracking-tight">Post. Pick. Choose. Done.</h2>
            </motion.div>

            <motion.div {...staggerProps} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { num: '01', title: 'Post',   desc: 'Tell us what needs doing. Describe the job, the time, and where in Pune.', icon: Briefcase },
                { num: '02', title: 'Pick',   desc: 'People nearby pick jobs they can handle. No back-and-forth quoting.', icon: Zap },
                { num: '03', title: 'Choose', desc: "You see who's interested and choose who gets the job.", icon: Star },
                { num: '04', title: 'Done',   desc: "Get it done. Leave a review. That's it.", icon: CheckCircle2 },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.num}
                    variants={childVariants}
                    className="group bg-[#16161A] border border-[#27272A] hover:border-[#3E3E44] p-6 rounded-[14px] flex flex-col justify-between gap-8 transition-all duration-200"
                  >
                    <div className="space-y-4">
                      <div className="w-9 h-9 rounded-[10px] bg-[#0B0B0D] border border-[#27272A] group-hover:border-[#F4A340] flex items-center justify-center text-[#F4A340] transition-colors">
                        <Icon size={16} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[#F7F6F2]">{step.title}</h3>
                        <p className="mt-1.5 text-xs text-[#A0A0AA] leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-[#57575E] uppercase tracking-widest">Step {step.num}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            WHAT NEEDS DOING? — Asymmetric job cards
        ═══════════════════════════════════════ */}
        <section id="services" className="w-full py-24 px-6 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto space-y-12">
            <motion.div {...revealProps} className="flex items-end justify-between flex-wrap gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#F4A340]">Live in Pune</span>
                <h2 className="text-4xl font-bold tracking-tight">What needs doing?</h2>
              </div>
              <p className="text-xs text-[#57575E] max-w-xs leading-relaxed">
                Example jobs. Post yours and let people come to you.
              </p>
            </motion.div>

            <motion.div {...staggerProps} className="grid grid-cols-1 lg:grid-cols-12 gap-5">

              {/* Featured job — large, with a real job photo */}
              {featuredJob && (
                <motion.div
                  variants={childVariants}
                  className="lg:col-span-7 group bg-[#16161A] border border-[#27272A] hover:border-[#3E3E44] rounded-[16px] overflow-hidden flex flex-col transition-all duration-200"
                >
                  {/* photo header — a job's own attached photo */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={IMAGES.job}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16161A] via-[#16161A]/60 to-transparent" />
                    <span className="absolute top-4 left-4 px-2 py-0.5 bg-[#0B0B0D]/70 backdrop-blur-sm text-[#F4A340] text-[10px] font-mono uppercase tracking-widest rounded">
                      {featuredJob.name}
                    </span>
                    <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-[10px] font-mono text-[#F7F6F2]/90">
                      <span className="flex items-center gap-1"><MapPin size={11} className="text-[#F4A340]" /> {featuredJob.area}, Pune</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {featuredJob.timing}</span>
                    </div>
                  </div>
                  {/* body */}
                  <div className="p-7 flex flex-col justify-between gap-8 flex-1">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-2xl text-[#F7F6F2] leading-snug max-w-md">
                        {featuredJob.desc}
                      </h3>
                      <div className="flex items-center flex-wrap gap-4 text-xs text-[#A0A0AA]">
                        {featuredJob.photos > 0 && (
                          <span className="flex items-center gap-1"><Camera size={12} /> {featuredJob.photos} photos</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Star size={12} className="text-[#F4A340]" /> {featuredJob.picked} picked · you choose
                        </span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between pt-4 border-t border-[#27272A]">
                      <div>
                        <span className="text-[9px] font-mono text-[#57575E] block uppercase tracking-wide">Fixed price</span>
                        <span className="font-bold text-2xl text-[#F7F6F2]">₹{featuredJob.price}</span>
                      </div>
                      <button
                        onClick={() => navigate('/register?role=CUSTOMER')}
                        className="group/btn inline-flex items-center gap-1.5 bg-[#27272A] hover:bg-[#F4A340] hover:text-[#0B0B0D] text-[#F7F6F2] text-xs px-5 py-2.5 rounded-[8px] font-semibold transition-colors cursor-pointer"
                      >
                        View responses
                        <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Supporting jobs — compact stack */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {secondaryJobs.map((job, idx) => (
                  <motion.div
                    key={idx}
                    variants={childVariants}
                    className="bg-[#16161A] border border-[#27272A] hover:border-[#3E3E44] p-5 rounded-[14px] flex items-center justify-between gap-4 transition-all duration-200"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <span className="text-[10px] font-mono uppercase font-bold text-[#F4A340] tracking-widest">{job.name}</span>
                      <h4 className="font-medium text-sm text-[#F7F6F2] leading-snug truncate">{job.desc}</h4>
                      <span className="flex items-center gap-1 text-[11px] text-[#A0A0AA]"><MapPin size={11} /> {job.area}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-base text-[#F7F6F2] block">₹{job.price}</span>
                      <button
                        onClick={() => navigate('/register?role=CUSTOMER')}
                        className="text-[10px] text-[#A0A0AA] hover:text-[#F4A340] transition-colors cursor-pointer mt-1"
                      >
                        View →
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            WHY WORKERS DEN — dark full-width band
        ═══════════════════════════════════════ */}
        <section className="w-full py-24 px-6 bg-[#0F0F12] border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto space-y-14">
            <motion.div {...revealProps} className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F4A340]">What you get</span>
              <h2 className="text-4xl font-bold tracking-tight">Why Workers Den?</h2>
            </motion.div>

            <motion.div {...staggerProps} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Profiles you can read',
                  desc: 'See experience, ratings, and past jobs before you choose. ID verification is rolling out next.',
                },
                {
                  icon: Zap,
                  title: 'Fast pick-up',
                  desc: 'People nearby pick jobs that match their skills. No waiting around for quotes.',
                },
                {
                  icon: IndianRupee,
                  title: 'Fixed pricing',
                  desc: 'Know the price up front. No haggling and no surprise charges at the end.',
                },
                {
                  icon: MapPin,
                  title: 'Pune first',
                  desc: 'Built locally, on the ground in Pune — a tight network before we expand anywhere else.',
                },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={childVariants}
                    className="group bg-[#16161A] border border-[#27272A] hover:border-[#3E3E44] p-6 rounded-[14px] space-y-4 transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-[#0B0B0D] border border-[#27272A] group-hover:border-[#F4A340] rounded-[10px] flex items-center justify-center text-[#F4A340] transition-colors">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[15px] text-[#F7F6F2]">{item.title}</h3>
                      <p className="mt-1.5 text-xs text-[#A0A0AA] leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            WHICH SIDE ARE YOU ON? — image-backed intent split.
            Each side presets the role on the register page.
        ═══════════════════════════════════════ */}
        <section id="find-jobs" className="w-full py-24 px-6 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto space-y-12">
            <motion.div {...revealProps} className="space-y-3 text-center max-w-2xl mx-auto">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F4A340]">Two ways in</span>
              <h2 className="text-4xl sm:text-[2.75rem] font-bold tracking-tight leading-tight">
                Booking for yourself, or here to work?
              </h2>
              <p className="text-sm text-[#A0A0AA]">
                Pick the side you're on — it just sets up the right account. You can always switch later.
              </p>
            </motion.div>

            <motion.div {...staggerProps} className="grid grid-cols-1 lg:grid-cols-2 gap-5">

              {/* Customer side */}
              <motion.div
                variants={childVariants}
                className="group relative overflow-hidden rounded-[20px] border border-[#27272A] hover:border-[#3E3E44] min-h-[360px] flex flex-col justify-end transition-colors duration-200"
              >
                <img
                  src={IMAGES.customer}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/85 to-[#0B0B0D]/20" />
                <div className="relative p-8 space-y-5">
                  <div className="w-11 h-11 rounded-[12px] bg-[#F4A340] flex items-center justify-center text-[#0B0B0D] shadow-lg shadow-[#F4A340]/25">
                    <User size={20} strokeWidth={2.2} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#F4A340]">For customers</span>
                    <h3 className="text-2xl font-bold text-[#F7F6F2]">I need something done</h3>
                    <p className="text-sm text-[#A0A0AA] max-w-sm leading-relaxed">
                      Post a job for your home or event. Skilled people nearby pick it up — you choose who does it, at a fixed price.
                    </p>
                  </div>
                  <button
                    id="customer-cta-btn"
                    onClick={() => navigate('/register?role=CUSTOMER')}
                    className={BTN_PRIMARY}
                  >
                    Post a Job
                    <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>

              {/* Worker side */}
              <motion.div
                variants={childVariants}
                className="group relative overflow-hidden rounded-[20px] border border-[#27272A] hover:border-[#3E3E44] min-h-[360px] flex flex-col justify-end transition-colors duration-200"
              >
                <img
                  src={IMAGES.worker}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/85 to-[#0B0B0D]/20" />
                <div className="relative p-8 space-y-5">
                  <div className="w-11 h-11 rounded-[12px] bg-[#F7F6F2] flex items-center justify-center text-[#0B0B0D] shadow-lg shadow-black/30">
                    <Wrench size={20} strokeWidth={2.2} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#A0A0AA]">For professionals</span>
                    <h3 className="text-2xl font-bold text-[#F7F6F2]">I want to work</h3>
                    <p className="text-sm text-[#A0A0AA] max-w-sm leading-relaxed">
                      Find jobs around Pune that match your skills. Pick the ones you want, on your own time, and earn from what you know.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {PRO_ROLES.slice(0, 4).map((role) => (
                      <span
                        key={role}
                        className="px-2.5 py-1 bg-[#F7F6F2]/10 border border-[#F7F6F2]/10 text-[#F7F6F2] text-[11px] font-mono rounded-[6px]"
                      >
                        {role}
                      </span>
                    ))}
                    <span className="px-2.5 py-1 bg-[#F7F6F2]/10 border border-[#F7F6F2]/10 text-[#A0A0AA] text-[11px] font-mono rounded-[6px]">
                      + more
                    </span>
                  </div>
                  <button
                    id="worker-cta-btn"
                    onClick={() => navigate('/register?role=WORKER')}
                    className={BTN_LIGHT}
                  >
                    Find Work
                    <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>

            </motion.div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            FINAL CTA
        ═══════════════════════════════════════ */}
        <section className="w-full py-28 px-6">
          <motion.div {...revealProps} className="max-w-3xl mx-auto text-center space-y-8">
            <div className="space-y-1">
              <h2 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] text-[#F7F6F2]">
                Whatever needs doing.
              </h2>
              <p className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] text-[#57575E]">
                Someone nearby can do it.
              </p>
            </div>
            <p className="text-sm text-[#A0A0AA] max-w-md mx-auto">
              Workers Den connects people who have something to do with people who can do it. Pune-first, growing locally.
            </p>
            <div className="flex justify-center flex-wrap gap-3 pt-2">
              <button
                id="final-post-job-btn"
                onClick={() => navigate('/register?role=CUSTOMER')}
                className={BTN_PRIMARY}
              >
                Post a Job
                <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                id="final-find-jobs-btn"
                onClick={() => navigate('/register?role=WORKER')}
                className={BTN_OUTLINE}
              >
                Find Work
                <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0B0B0D] border-t border-[#27272A] py-10 px-6 text-xs text-[#57575E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-bold text-[#F7F6F2] text-sm">
            WORKERS<span className="text-[#F4A340]"> DEN</span>
            <span className="ml-2 font-mono text-[10px] text-[#57575E] border border-[#27272A] px-1.5 py-0.5 rounded-sm">PUNE</span>
          </div>
          <div>© 2026 Workers Den. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
