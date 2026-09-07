import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import api from '../../api/axiosClient';
import { useTheme } from '../../theme/ThemeContext';
import Logo from '../Component/Logo';
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Clock,
  MapPin,
  Camera,
  Check,
  Briefcase,
  Star,
  Tag,
  IndianRupee,
  User,
  Wrench,
  Sparkles,
  Paintbrush,
  Hammer,
  X,
  ChevronRight,
  Quote,
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Static data — fallbacks when API is offline
───────────────────────────────────────────── */
const STATIC_JOBS = [
  { name: 'AC Repair', price: 700, area: 'Kothrud', timing: 'Today · 6:00 PM', photos: 2, picked: 3, desc: "AC isn't cooling properly." },
  { name: 'Home Cleaning', price: 1200, area: 'Baner', timing: 'Tomorrow · 10:00 AM', photos: 4, picked: 2, desc: '2BHK deep clean before moving in.' },
  { name: 'Catering', price: 8500, area: 'Wakad', timing: 'Saturday · 4:00 PM', photos: 0, picked: 4, desc: 'Traditional snacks & setup for 40 guests.' },
  { name: 'Electrical', price: 600, area: 'Hadapsar', timing: 'Today · 3:00 PM', photos: 1, picked: 2, desc: 'Install 3 ceiling fans.' },
];

const PRO_ROLES = ['Electricians', 'Plumbers', 'Cleaners', 'Caterers', 'Photographers', 'Carpenters', 'AC Technicians', 'Painters'];

const IMAGES = {
  customer: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1000&auto=format&fit=crop&q=80',
  worker: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1000&auto=format&fit=crop&q=80',
  job: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1000&auto=format&fit=crop&q=80',
};

/* Trades photo strip — falls back to icon tile if a URL can't load */
const TRADES = [
  { label: 'Electrical', icon: Zap, img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Plumbing', icon: Wrench, img: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80' },
  { label: 'Cleaning', icon: Sparkles, img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80' },
  { label: 'Carpentry', icon: Hammer, img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80' },
  { label: 'Painting', icon: Paintbrush, img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80' },
];

/* Reviews — each opens a dialog: job context + photos + full write-up */
const REVIEWS = [
  {
    id: 'R-1042',
    name: 'Rohan Deshpande', initials: 'RD', locality: 'Kothrud',
    service: 'AC Repair', jobTitle: 'Split AC not cooling',
    rating: 5, date: 'Aug 2026',
    short: 'Fixed my AC the same evening — no drama, no haggling.',
    full: 'Posted the job at 4pm and a technician picked it up within the hour. He was at my place by 6, found a gas leak and cleaned the coils, and showed me exactly what was wrong. The price was the fixed one from the app — not a rupee more. Cooling like new.',
    photos: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=700&auto=format&fit=crop&q=80',
    ],
  },
  {
    id: 'R-1039',
    name: 'Sneha Kulkarni', initials: 'SK', locality: 'Baner',
    service: 'Home Cleaning', jobTitle: '2BHK deep clean before move-in',
    rating: 5, date: 'Aug 2026',
    short: 'Two people, three hours, spotless. Worth every rupee.',
    full: 'We were moving into a flat that had been empty for months. The team came prepared with their own supplies, did the kitchen and bathrooms first like I asked, and sent photos before and after. Booking was one message and the price was set up front.',
    photos: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnfqZH880QzE7F4sGmDxU4LhBC6F0ojk1bmcxTHhTbrw&s=10',
    ],
  },
  {
    id: 'R-1027',
    name: 'Amit Patil', initials: 'AP', locality: 'Wakad',
    service: 'Catering', jobTitle: 'Snacks & setup for 40 guests',
    rating: 4, date: 'Jul 2026',
    short: 'Just the person was good and as a recruter he was deciplined well',
    full: 'we were short of people so i orderd one person to make us easy great to work with ',
    photos: [
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUrybvyamINedjcl5IHFPi-rpTgMafpUmOQiE_tS7xGg&s=10',
    ],
  },
  {
    id: 'R-1018',
    name: 'Priya Sharma', initials: 'PS', locality: 'Hadapsar',
    service: 'Electrical', jobTitle: 'Install 3 ceiling fans',
    rating: 5, date: 'Jul 2026',
    short: 'Clean wiring, tidy work, cleaned up after. Rare.',
    full: 'Needed three fans mounted and the old wiring looked dodgy. The electrician checked the points first, flagged one that was unsafe, and fixed it before mounting. Left the rooms cleaner than he found them. I have already posted a second job.',
    photos: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=700&auto=format&fit=crop&q=80',
    ],
  },
];

/* ─────────────────────────────────────────────
   Motion tokens
───────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1];
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* ─────────────────────────────────────────────
   Shared sub-components
───────────────────────────────────────────── */

/** Blue ink CTA — solid or ghost outline variant */
function CTA({ variant = 'solid', onClick, id, children, t, fullWidth = false }) {
  const base = `group inline-flex items-center justify-center gap-2 wd-mono text-[12px] font-bold uppercase tracking-wider px-6 py-3 rounded-[4px] cursor-pointer wd-btn${fullWidth ? ' w-full' : ''}`;
  if (variant === 'solid') {
    return (
      <button
        id={id}
        onClick={onClick}
        className={base}
        style={{ background: t.accent, color: t.accentText, border: 'none' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = t.accentHover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = t.accent)}
      >
        {children}
      </button>
    );
  }
  return (
    <button
      id={id}
      onClick={onClick}
      className={base}
      style={{ background: 'transparent', color: t.text, border: `1.5px solid ${t.borderStrong}` }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.text)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.borderStrong)}
    >
      {children}
    </button>
  );
}

/** Gold star row */
function StarRow({ rating, t, size = 13 }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={2}
          style={{ color: n <= rating ? t.warning : t.border }}
          fill={n <= rating ? t.warning : 'none'}
        />
      ))}
    </div>
  );
}


function TopBar({ t, navigate }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let dashboardPath = '/customer/dashboard';
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      const r = u?.role ? u.role.replace('ROLE_', '') : '';
      if (r === 'WORKER') dashboardPath = '/worker/dashboard';
    } catch {}
  }

  const links = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Jobs', href: '#jobs' },
    { label: 'For workers', href: '#for-workers' },
    { label: 'Reviews', href: '#reviews' },
  ];
  return (
    <header className="sticky top-0 z-40 border-b" style={{ borderColor: t.border, background: t.bg }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer">
          <Logo size={30} variant="solid" color={t.accent} />
          <span className="wd-display font-black text-[17px] tracking-tight" style={{ color: t.text }}>
            WORKERS<span style={{ color: t.accent }}>DEN</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="wd-mono text-[11px] font-semibold uppercase tracking-wider transition-opacity hover:opacity-100"
              style={{ color: t.muted }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {token ? (
            <button
              onClick={() => navigate(dashboardPath)}
              className="wd-mono text-[11px] font-bold uppercase tracking-wider px-3.5 py-2 cursor-pointer border shadow-sm"
              style={{ background: t.accent, color: t.accentText, borderColor: t.accent }}
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="wd-mono text-[11px] font-bold uppercase tracking-wider px-2.5 sm:px-3 py-2 cursor-pointer hover:opacity-70"
                style={{ color: t.text }}
              >
                Log in
              </button>
              <CTA variant="solid" onClick={() => navigate('/register?role=CUSTOMER')} t={t}>
                Post a job
              </CTA>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────
   Hero order slip — animated paper docket
───────────────────────────────────────────── */
function OrderSlip({ t }) {
  const reduce = useReducedMotion();
  const steps = ['Post', 'Pick', 'Choose', 'Done'];
  const activeStep = 1;
  const pros = [
    { initials: 'RS', color: t.accent },
    { initials: 'AK', color: t.success },
    { initials: 'SP', color: t.stamp },
  ];

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 26, rotate: -1.4 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      className="relative w-full max-w-sm"
    >
      {/* stacked-carbon shadow layer */}
      <div
        aria-hidden
        className="absolute inset-0 translate-x-2 translate-y-2 rounded-[6px]"
        style={{ background: t.bgAlt, border: `1px solid ${t.border}` }}
      />

      <div className="relative rounded-[6px] overflow-hidden shadow-xl" style={{ background: t.surface, border: `1.5px solid ${t.borderStrong}` }}>
        {/* docket header */}
        <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: t.border, background: t.cardHover }}>
          <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>
            Job order · #A-2481
          </span>
          <span className="flex items-center gap-1.5 wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.accent }}>
            <span className="relative flex h-2 w-2">
              {!reduce && <span className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping" style={{ background: t.accent }} />}
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: t.accent }} />
            </span>
            Live
          </span>
        </div>

        {/* body */}
        <div className="px-5 py-5 space-y-4 wd-ruled">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.faint }}>AC Repair</span>
              <h3 className="wd-display font-black text-[20px] leading-tight mt-0.5" style={{ color: t.text }}>
                AC isn&apos;t cooling
              </h3>
            </div>
            <span className="wd-stamp wd-stamp--tilt text-[10px] shrink-0 mt-0.5" style={{ color: t.accent }}>Posted</span>
          </div>

          <div className="flex flex-col gap-1.5 wd-mono text-[11px]" style={{ color: t.muted }}>
            <span className="flex items-center gap-1.5"><MapPin size={12} style={{ color: t.accent }} /> Kothrud, Pune</span>
            <span className="flex items-center gap-1.5"><Clock size={12} /> Today · 6:00 PM</span>
          </div>

          <div className="flex items-end justify-between pt-1">
            <div>
              <span className="wd-mono text-[9px] uppercase tracking-widest block" style={{ color: t.faint }}>Fixed price</span>
              <span className="wd-display font-black text-[26px] wd-tnum" style={{ color: t.text }}>₹700</span>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex -space-x-2">
                {pros.map((p, i) => (
                  <motion.span
                    key={p.initials}
                    initial={reduce ? false : { opacity: 0, scale: 0.5, x: 8 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.65 + i * 0.14 }}
                    className="w-6 h-6 rounded-full flex items-center justify-center wd-mono text-[8px] font-bold"
                    style={{ background: p.color, color: t.accentText, border: `2px solid ${t.surface}` }}
                  >
                    {p.initials}
                  </motion.span>
                ))}
              </div>
              <span className="wd-mono text-[10px]" style={{ color: t.muted }}>
                3 picked · <span className="font-bold" style={{ color: t.accent }}>you choose</span>
              </span>
            </div>
          </div>
        </div>

        {/* progress tracker */}
        <div className="px-5 py-4 border-t" style={{ borderColor: t.border }}>
          <div className="flex items-center justify-between">
            {steps.map((step, i) => {
              const isDone = i < activeStep;
              const isActive = i === activeStep;
              const on = isDone || isActive;
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * 0.12 }}
                      className="relative w-6 h-6 rounded-full flex items-center justify-center wd-mono text-[9px] font-bold"
                      style={{
                        background: on ? t.accent : 'transparent',
                        color: on ? t.accentText : t.faint,
                        border: on ? 'none' : `1.5px solid ${t.border}`,
                      }}
                    >
                      {isActive && !reduce && (
                        <motion.span
                          className="absolute inset-0 rounded-full"
                          style={{ boxShadow: `0 0 0 2px ${t.accent}` }}
                          animate={{ scale: [1, 1.55], opacity: [0.6, 0] }}
                          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                        />
                      )}
                      {isDone ? <Check size={12} strokeWidth={3} /> : i + 1}
                    </motion.div>
                    <span className="wd-mono text-[9px] uppercase tracking-wide" style={{ color: on ? t.accent : t.faint }}>
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="relative flex-1 h-px mx-2" style={{ background: t.border }}>
                      <motion.div
                        className="absolute inset-y-0 left-0"
                        style={{ background: t.accent }}
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

        {/* footer action */}
        <div className="px-5 pb-5 pt-1">
          <div
            className="w-full wd-mono text-[11px] font-bold uppercase tracking-wider py-2.5 rounded-[4px] flex items-center justify-center gap-1.5"
            style={{ background: t.cardHover, color: t.text, border: `1px solid ${t.border}` }}
          >
            View responses <ArrowRight size={12} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Review detail dialog
───────────────────────────────────────────── */
function ReviewDialog({ review, onClose, navigate, t }) {
  const reduce = useReducedMotion();
  const dialogRef = useRef(null);

  /* Focus trap + Escape + scroll lock */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(24,32,46,0.62)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Review for ${review.service}`}
        tabIndex={-1}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[8px] shadow-2xl outline-none"
        style={{ background: t.surface, border: `1.5px solid ${t.borderStrong}` }}
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        {/* sticky docket header */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b"
          style={{ borderColor: t.border, background: t.cardHover }}
        >
          <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>
            Review · #{review.id}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[4px] cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: t.muted }}
            aria-label="Close review"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* what the job was */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.faint }}>
                {review.service}
              </span>
              <h3 className="wd-display font-black text-xl leading-tight" style={{ color: t.text }}>
                {review.jobTitle}
              </h3>
              <div className="flex items-center gap-3 wd-mono text-[11px] pt-0.5" style={{ color: t.muted }}>
                <span className="flex items-center gap-1"><MapPin size={11} style={{ color: t.accent }} /> {review.locality}, Pune</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {review.date}</span>
              </div>
            </div>
            <span
              className="wd-stamp wd-stamp--tilt text-[9px] shrink-0"
              style={{ color: review.rating >= 5 ? t.success : t.warning }}
            >
              Rated {review.rating}/5
            </span>
          </div>

          {/* stars */}
          <div className="flex items-center gap-2">
            <StarRow rating={review.rating} t={t} size={16} />
            <span className="wd-mono text-[11px]" style={{ color: t.muted }}>{review.rating}.0 out of 5</span>
          </div>

          {/* photos from the job */}
          <div>
            <span className="wd-mono text-[9px] font-bold uppercase tracking-widest block mb-2.5" style={{ color: t.faint }}>
              Photos from the job
            </span>
            <div className={`grid gap-2.5 ${review.photos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {review.photos.map((src, i) => (
                <div
                  key={i}
                  className="relative rounded-[6px] overflow-hidden aspect-[4/3]"
                  style={{ background: t.cardHover, border: `1px solid ${t.border}` }}
                >
                  <img
                    src={src}
                    alt={`${review.service} — photo ${i + 1}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* full review text */}
          <div className="wd-ruled rounded-[6px] p-4" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
            <Quote size={16} className="mb-2 opacity-30" style={{ color: t.accent }} />
            <p className="text-[14px] leading-relaxed" style={{ color: t.text }}>
              {review.full}
            </p>
          </div>

          {/* reviewer */}
          <div className="flex items-center gap-3">
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center wd-mono text-[11px] font-bold shrink-0"
              style={{ background: t.accent, color: t.accentText }}
            >
              {review.initials}
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold" style={{ color: t.text }}>{review.name}</div>
              <div className="wd-mono text-[10px]" style={{ color: t.muted }}>Customer · {review.locality}, Pune</div>
            </div>
          </div>

          {/* Book your own inside dialog */}
          <div className="pt-2 border-t" style={{ borderColor: t.border }}>
            <CTA
              id="dialog-book-own-btn"
              variant="solid"
              fullWidth
              t={t}
              onClick={() => { onClose(); navigate('/register?role=CUSTOMER'); }}
            >
              Book your own job <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </CTA>
            <p className="wd-mono text-[10px] text-center mt-2.5" style={{ color: t.faint }}>
              Fixed price · no haggling · choose your worker
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const { theme: t } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [activeReview, setActiveReview] = useState(null);

  useEffect(() => {
    // Fetch live categories from DB
    api.get('/Categories')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setJobs(res.data.map((cat, idx) => ({
            name: cat.catName || cat.cat_name,
            price: cat.customerPrice || cat.customer_price || 499,
            area: ['Kothrud', 'Baner', 'Wakad', 'Hadapsar', 'Aundh', 'Hinjawadi'][idx % 6],
            timing: ['Today · 2:00 PM', 'Tomorrow · 10:00 AM', 'Today · 5:00 PM', 'Saturday · 11:00 AM'][idx % 4],
            photos: (idx % 3) + 1,
            picked: (idx % 3) + 1,
            desc: cat.description || `${cat.catName || cat.cat_name} services in Pune. Fixed pricing with verified local workers.`,
          })));
        } else {
          setJobs(STATIC_JOBS);
        }
      })
      .catch(() => setJobs(STATIC_JOBS));
  }, []);

  const displayJobs = jobs.length > 0 ? jobs : STATIC_JOBS;
  const [featuredJob, ...restJobs] = displayJobs;
  const secondaryJobs = restJobs.slice(0, 3);

  const revealProps = reduce ? {} : { variants: fadeUp, initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-80px' } };
  const staggerProps = reduce ? {} : { variants: staggerContainer, initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-80px' } };
  const childVariants = reduce ? undefined : fadeUp;

  const HOW = [
    { num: '01', title: 'Post', desc: 'Tell us what needs doing — the job, the time, the place in Pune.', icon: Briefcase },
    { num: '02', title: 'Pick', desc: 'Workers nearby pick jobs that match their trade. No quote chasing.', icon: Zap },
    { num: '03', title: 'Choose', desc: "See who's interested, read their profile, and choose who gets it.", icon: Star },
    { num: '04', title: 'Done', desc: 'They finish on-site. You rate the work. That closes the order.', icon: Check },
  ];

  const WHY = [
    { icon: IndianRupee, title: 'Fixed pricing', desc: 'The price is set per service, up front. No haggling, no surprise charge at the end.' },
    { icon: Zap, title: 'Fast pick-up', desc: 'Workers nearby pick jobs that fit their skills — no waiting around for quotes.' },
    { icon: ShieldCheck, title: 'Profiles you read', desc: 'Experience, ratings and past jobs on every profile. ID checks rolling out next.' },
    { icon: MapPin, title: 'Pune first', desc: 'Built on the ground in Pune — a tight local network before we go anywhere else.' },
  ];

  const ELIGIBLE = [
    '18 years or older',
    'No degree needed — bring a skill',
    'Choose your own hours',
    'See the fixed payout before you accept',
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: t.bg, color: t.text }}>
      <TopBar t={t} navigate={navigate} />

      <main className="flex-1">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="relative w-full overflow-hidden border-b" style={{ borderColor: t.border }}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(24,32,46,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(24,32,46,0.05) 1px, transparent 1px)',
              backgroundSize: '30px 30px',
              maskImage: 'radial-gradient(ellipse 90% 70% at 30% 0%, #000 45%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 70% at 30% 0%, #000 45%, transparent 100%)',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
            <motion.div
              className="lg:col-span-6 space-y-7"
              variants={staggerContainer}
              initial={reduce ? false : 'hidden'}
              animate="show"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: t.surface, border: `1px solid ${t.border}` }}
              >
                <span className="relative flex h-2 w-2">
                  {!reduce && <span className="absolute inline-flex h-full w-full rounded-full opacity-70 animate-ping" style={{ background: t.accent }} />}
                  <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: t.accent }} />
                </span>
                <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>
                  Now live in Pune
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="wd-display font-black tracking-tight leading-[1.02] text-[3.1rem] sm:text-[4rem]"
                style={{ color: t.text }}
              >
                Got a job?<br />
                <span style={{ color: t.accent }}>Post it.</span> Get it done.
              </motion.h1>

              <motion.p variants={fadeUp} className="text-[15px] leading-relaxed max-w-md" style={{ color: t.muted }}>
                Describe what you need, when and where. Skilled people nearby pick up your job — you choose who gets it done, at a price fixed up front.
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-1">
                <CTA id="hero-post-job-btn" variant="solid" onClick={() => navigate('/register?role=CUSTOMER')} t={t}>
                  Post a job <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </CTA>
                <CTA id="hero-find-jobs-btn" variant="ghost" onClick={() => navigate('/register?role=WORKER')} t={t}>
                  Find work <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </CTA>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center flex-wrap gap-x-4 gap-y-2 wd-mono text-[11px]" style={{ color: t.faint }}>
                <span className="flex items-center gap-1.5"><Tag size={12} style={{ color: t.accent }} /> Fixed prices — no haggling</span>
                <span className="w-1 h-1 rounded-full" style={{ background: t.border }} />
                <span className="flex items-center gap-1.5"><ShieldCheck size={13} style={{ color: t.accent }} /> ID verification rolling out</span>
              </motion.div>
            </motion.div>

            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <OrderSlip t={t} />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            TRADES PHOTO STRIP
        ══════════════════════════════════════ */}
        <section className="w-full py-14 px-6 border-b" style={{ borderColor: t.border, background: t.bgAlt }}>
          <div className="max-w-7xl mx-auto space-y-6">
            <motion.div {...revealProps} className="flex items-end justify-between flex-wrap gap-3">
              <span className="wd-mono text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: t.muted }}>
                Real trades, working across Pune
              </span>
              <span className="wd-mono text-[10px] uppercase tracking-widest" style={{ color: t.faint }}>12+ services &amp; counting</span>
            </motion.div>

            <motion.div {...staggerProps} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TRADES.map((tr) => {
                const Icon = tr.icon;
                return (
                  <motion.div
                    key={tr.label}
                    variants={childVariants}
                    className="group relative aspect-[4/5] rounded-[6px] overflow-hidden"
                    style={{ background: t.cardHover, border: `1px solid ${t.border}` }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center" style={{ color: t.faint }}>
                      <Icon size={26} />
                    </div>
                    <img
                      src={tr.img}
                      alt={`${tr.label} work in Pune`}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(24,32,46,0.82), transparent 55%)' }} />
                    <span className="absolute bottom-2.5 left-3 wd-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accentText }}>
                      {tr.label}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            HOW IT WORKS
        ══════════════════════════════════════ */}
        <section id="how-it-works" className="w-full py-24 px-6 border-b" style={{ borderColor: t.border }}>
          <div className="max-w-7xl mx-auto space-y-14">
            <motion.div {...revealProps} className="space-y-2">
              <span className="wd-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.accent }}>The order flow</span>
              <h2 className="wd-display font-black text-4xl tracking-tight" style={{ color: t.text }}>Post. Pick. Choose. Done.</h2>
            </motion.div>

            <motion.div {...staggerProps} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {HOW.map((step) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.num}
                    variants={childVariants}
                    className="group p-6 rounded-[6px] flex flex-col justify-between gap-8 transition-colors"
                    style={{ background: t.surface, border: `1px solid ${t.border}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.text)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
                  >
                    <div className="space-y-4">
                      <div className="w-10 h-10 rounded-[6px] flex items-center justify-center" style={{ background: t.accentSoft, color: t.accent }}>
                        <Icon size={17} />
                      </div>
                      <div>
                        <h3 className="wd-display font-black text-lg" style={{ color: t.text }}>{step.title}</h3>
                        <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: t.muted }}>{step.desc}</p>
                      </div>
                    </div>
                    <span className="wd-mono text-[10px] font-bold uppercase tracking-widest wd-tnum" style={{ color: t.faint }}>Step {step.num}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            WHAT NEEDS DOING
        ══════════════════════════════════════ */}
        <section id="jobs" className="w-full py-24 px-6 border-b" style={{ borderColor: t.border }}>
          <div className="max-w-7xl mx-auto space-y-12">
            <motion.div {...revealProps} className="flex items-end justify-between flex-wrap gap-4">
              <div className="space-y-2">
                <span className="wd-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.accent }}>Open in Pune</span>
                <h2 className="wd-display font-black text-4xl tracking-tight" style={{ color: t.text }}>What needs doing?</h2>
              </div>
              <p className="text-[13px] max-w-xs leading-relaxed" style={{ color: t.muted }}>
                Example orders. Post yours and let workers come to you.
              </p>
            </motion.div>

            <motion.div {...staggerProps} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* featured */}
              {featuredJob && (
                <motion.div
                  variants={childVariants}
                  className="lg:col-span-7 group rounded-[6px] overflow-hidden flex flex-col transition-colors"
                  style={{ background: t.surface, border: `1px solid ${t.border}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.text)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
                >
                  <div className="relative h-48 overflow-hidden" style={{ background: t.cardHover }}>
                    <img
                      src={IMAGES.job}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(24,32,46,0.72), rgba(24,32,46,0.12))' }} />
                    <span className="absolute top-4 left-4 wd-stamp wd-stamp--tilt text-[10px]" style={{ color: t.accentText }}>{featuredJob.name}</span>
                    <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between wd-mono text-[10px]" style={{ color: t.accentText }}>
                      <span className="flex items-center gap-1"><MapPin size={11} /> {featuredJob.area}, Pune</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {featuredJob.timing}</span>
                    </div>
                  </div>
                  <div className="p-7 flex flex-col justify-between gap-8 flex-1">
                    <div className="space-y-3">
                      <h3 className="wd-display font-black text-2xl leading-snug max-w-md" style={{ color: t.text }}>{featuredJob.desc}</h3>
                      <div className="flex items-center flex-wrap gap-4 wd-mono text-[12px]" style={{ color: t.muted }}>
                        {featuredJob.photos > 0 && <span className="flex items-center gap-1"><Camera size={12} /> {featuredJob.photos} photos</span>}
                        <span className="flex items-center gap-1"><Star size={12} style={{ color: t.accent }} /> {featuredJob.picked} picked · you choose</span>
                      </div>
                    </div>
                    <div className="flex items-end justify-between pt-4 border-t" style={{ borderColor: t.border }}>
                      <div>
                        <span className="wd-mono text-[9px] uppercase tracking-widest block" style={{ color: t.faint }}>Fixed price</span>
                        <span className="wd-display font-black text-2xl wd-tnum" style={{ color: t.text }}>₹{featuredJob.price}</span>
                      </div>
                      <CTA variant="solid" onClick={() => navigate('/register?role=CUSTOMER')} t={t}>
                        View responses <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </CTA>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* supporting stack */}
              <div className="lg:col-span-5 flex flex-col gap-5">
                {secondaryJobs.map((job, idx) => (
                  <motion.div
                    key={idx}
                    variants={childVariants}
                    className="p-5 rounded-[6px] flex items-center justify-between gap-4 transition-colors"
                    style={{ background: t.surface, border: `1px solid ${t.border}` }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.text)}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
                  >
                    <div className="space-y-1.5 min-w-0">
                      <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.accent }}>{job.name}</span>
                      <h4 className="text-sm font-semibold leading-snug truncate" style={{ color: t.text }}>{job.desc}</h4>
                      <span className="flex items-center gap-1 wd-mono text-[11px]" style={{ color: t.muted }}><MapPin size={11} /> {job.area}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="wd-display font-black text-base wd-tnum block" style={{ color: t.text }}>₹{job.price}</span>
                      <button
                        onClick={() => navigate('/register?role=CUSTOMER')}
                        className="wd-mono text-[10px] mt-1 cursor-pointer hover:opacity-70"
                        style={{ color: t.accent }}
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

        {/* ══════════════════════════════════════
            WHY — inked blue register band
        ══════════════════════════════════════ */}
        <section className="relative w-full py-24 px-6 overflow-hidden" style={{ background: t.accent, color: t.accentText }}>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 37px, rgba(252,251,247,0.08) 37px, rgba(252,251,247,0.08) 38px)' }}
          />
          <div className="relative max-w-7xl mx-auto space-y-14">
            <motion.div {...revealProps} className="space-y-2">
              <span className="wd-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ opacity: 0.7 }}>What you get</span>
              <h2 className="wd-display font-black text-4xl tracking-tight">Why Workers Den?</h2>
            </motion.div>

            <motion.div {...staggerProps} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {WHY.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    variants={childVariants}
                    className="p-6 rounded-[6px] space-y-4"
                    style={{ background: 'rgba(252,251,247,0.06)', border: '1px solid rgba(252,251,247,0.16)' }}
                  >
                    <div className="w-10 h-10 rounded-[6px] flex items-center justify-center" style={{ background: 'rgba(252,251,247,0.12)', color: t.accentText }}>
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="wd-display font-black text-[15px]">{item.title}</h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed" style={{ opacity: 0.8 }}>{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            REVIEWS — click to inspect the work
        ══════════════════════════════════════ */}
        <section id="reviews" className="w-full py-24 px-6 border-b" style={{ borderColor: t.border, background: t.bgAlt }}>
          <div className="max-w-7xl mx-auto space-y-12">
            <motion.div {...revealProps} className="flex items-end justify-between flex-wrap gap-4">
              <div className="space-y-2">
                <span className="wd-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.accent }}>
                  Signed off by customers
                </span>
                <h2 className="wd-display font-black text-4xl tracking-tight" style={{ color: t.text }}>
                  See the work, not just the stars.
                </h2>
              </div>
              <p className="text-[13px] max-w-xs leading-relaxed" style={{ color: t.muted }}>
                Open any review to see what the job was, the photos from it, and exactly why they rated it that way.
              </p>
            </motion.div>

            {/* review cards */}
            <motion.div {...staggerProps} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {REVIEWS.map((r) => (
                <motion.button
                  key={r.id}
                  variants={childVariants}
                  onClick={() => setActiveReview(r)}
                  className="group text-left rounded-[6px] overflow-hidden flex flex-col cursor-pointer transition-colors"
                  style={{ background: t.surface, border: `1px solid ${t.border}` }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.text)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
                  aria-label={`Inspect review by ${r.name} for ${r.service}`}
                >
                  {/* photo thumbnail */}
                  <div className="relative h-36 overflow-hidden" style={{ background: t.cardHover }}>
                    <img
                      src={r.photos[0]}
                      alt=""
                      aria-hidden
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(24,32,46,0.55), transparent 60%)' }} />
                    <span className="absolute top-3 left-3 wd-stamp wd-stamp--tilt text-[9px]" style={{ color: t.accentText }}>
                      {r.service}
                    </span>
                    {r.photos.length > 1 && (
                      <span className="absolute bottom-2.5 right-3 flex items-center gap-1 wd-mono text-[9px] font-bold" style={{ color: t.accentText }}>
                        <Camera size={10} /> {r.photos.length}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex flex-col gap-3 flex-1">
                    <StarRow rating={r.rating} t={t} />
                    <p className="text-[13px] leading-relaxed flex-1" style={{ color: t.text }}>
                      &ldquo;{r.short}&rdquo;
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: t.border }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center wd-mono text-[8px] font-bold shrink-0" style={{ background: t.accentSoft, color: t.accent }}>
                          {r.initials}
                        </span>
                        <span className="wd-mono text-[10px] truncate" style={{ color: t.muted }}>
                          {r.name.split(' ')[0]} · {r.locality}
                        </span>
                      </div>
                      <span className="wd-mono text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 shrink-0" style={{ color: t.accent }}>
                        Inspect <ChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            {/* Book your own — prominent banner after the grid */}
            <motion.div
              {...revealProps}
              className="relative rounded-[8px] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden"
              style={{ background: t.surface, border: `1.5px solid ${t.borderStrong}` }}
            >
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(24,32,46,0.04) 31px, rgba(24,32,46,0.04) 32px)' }}
              />
              <div className="relative space-y-1.5">
                <span className="wd-stamp wd-stamp--tilt text-[10px]" style={{ color: t.accent }}>Your turn</span>
                <p className="wd-display font-black text-2xl sm:text-3xl tracking-tight leading-tight" style={{ color: t.text }}>
                  Like what you see?<br />
                  <span style={{ color: t.accent }}>Book your own.</span>
                </p>
                <p className="text-[13px]" style={{ color: t.muted }}>
                  Fixed price · choose your worker · no middleman fees
                </p>
              </div>
              <div className="relative shrink-0">
                <CTA
                  id="reviews-book-your-own-btn"
                  variant="solid"
                  onClick={() => navigate('/register?role=CUSTOMER')}
                  t={t}
                >
                  Book your own job <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </CTA>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            WORK IS FOR ANYONE — 18+
        ══════════════════════════════════════ */}
        <section id="for-workers" className="w-full py-24 px-6 border-b" style={{ borderColor: t.border }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <motion.div {...revealProps} className="lg:col-span-5">
              <div
                className="relative rounded-[6px] p-8 flex flex-col items-center text-center gap-4"
                style={{ background: t.surface, border: `1.5px solid ${t.borderStrong}` }}
              >
                <span className="wd-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.faint }}>Eligibility</span>
                <div
                  className="wd-display font-black leading-none wd-tnum select-none"
                  style={{ fontSize: '6.5rem', color: t.stamp, WebkitTextStroke: `2px ${t.stamp}`, letterSpacing: '-0.04em' }}
                >
                  18+
                </div>
                <span className="wd-stamp wd-stamp--tilt text-[11px]" style={{ color: t.stamp }}>Open to all</span>
                <p className="text-[13px] leading-relaxed max-w-xs" style={{ color: t.muted }}>
                  You bring a skill and a phone. That&apos;s the barrier. No résumé, no interview, no fees to start.
                </p>
              </div>
            </motion.div>

            <motion.div {...staggerProps} className="lg:col-span-7 space-y-6">
              <motion.div variants={childVariants} className="space-y-2">
                <span className="wd-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.accent }}>For workers</span>
                <h2 className="wd-display font-black text-4xl tracking-tight leading-tight" style={{ color: t.text }}>
                  Work is for anyone.
                </h2>
                <p className="text-[15px] leading-relaxed max-w-lg" style={{ color: t.muted }}>
                  Student, between jobs, or building a trade on the side — if you can do the work, you can earn from it. Pick the jobs that fit your day.
                </p>
              </motion.div>

              <motion.ul variants={childVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ELIGIBLE.map((line) => (
                  <li key={line} className="flex items-start gap-2.5 p-3 rounded-[6px]" style={{ background: t.surface, border: `1px solid ${t.border}` }}>
                    <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: t.accent, color: t.accentText }}>
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-[13px] font-medium" style={{ color: t.text }}>{line}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={childVariants} className="flex flex-wrap items-center gap-3 pt-1">
                <CTA id="eligibility-find-work-btn" variant="solid" onClick={() => navigate('/register?role=WORKER')} t={t}>
                  Start finding work <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                </CTA>
                <div className="flex flex-wrap gap-1.5">
                  {PRO_ROLES.slice(0, 3).map((role) => (
                    <span key={role} className="wd-mono text-[10px] px-2.5 py-1 rounded-[4px]" style={{ background: t.cardHover, color: t.muted, border: `1px solid ${t.border}` }}>
                      {role}
                    </span>
                  ))}
                  <span className="wd-mono text-[10px] px-2.5 py-1 rounded-[4px]" style={{ color: t.faint }}>+ more</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            WHICH SIDE ARE YOU ON — booking split
        ══════════════════════════════════════ */}
        <section className="w-full py-24 px-6 border-b" style={{ borderColor: t.border }}>
          <div className="max-w-7xl mx-auto space-y-12">
            <motion.div {...revealProps} className="space-y-3 text-center max-w-2xl mx-auto">
              <span className="wd-mono text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: t.accent }}>Two ways in</span>
              <h2 className="wd-display font-black text-4xl sm:text-[2.75rem] tracking-tight leading-tight" style={{ color: t.text }}>
                Booking for yourself, or here to work?
              </h2>
              <p className="text-sm" style={{ color: t.muted }}>
                Pick a side — it just sets up the right account. You can always switch later.
              </p>
            </motion.div>

            <motion.div {...staggerProps} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* customer */}
              <motion.div
                variants={childVariants}
                className="group rounded-[6px] overflow-hidden flex flex-col transition-colors"
                style={{ background: t.surface, border: `1px solid ${t.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.text)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
              >
                <div className="relative h-44 overflow-hidden" style={{ background: t.cardHover }}>
                  <img
                    src={IMAGES.customer}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(252,251,247,0.95), rgba(252,251,247,0.15))' }} />
                  <div className="absolute bottom-4 left-6 w-11 h-11 rounded-[8px] flex items-center justify-center" style={{ background: t.accent, color: t.accentText }}>
                    <User size={20} strokeWidth={2.2} />
                  </div>
                </div>
                <div className="p-7 space-y-4">
                  <div className="space-y-2">
                    <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.accent }}>For customers</span>
                    <h3 className="wd-display font-black text-2xl" style={{ color: t.text }}>I need something done</h3>
                    <p className="text-sm leading-relaxed max-w-sm" style={{ color: t.muted }}>
                      Post a job for your home or event. Skilled people nearby pick it up — you choose who does it, at a fixed price.
                    </p>
                  </div>
                  <CTA id="customer-cta-btn" variant="solid" onClick={() => navigate('/register?role=CUSTOMER')} t={t}>
                    Post a job <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </CTA>
                </div>
              </motion.div>

              {/* worker */}
              <motion.div
                variants={childVariants}
                className="group rounded-[6px] overflow-hidden flex flex-col transition-colors"
                style={{ background: t.surface, border: `1px solid ${t.border}` }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.text)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
              >
                <div className="relative h-44 overflow-hidden" style={{ background: t.cardHover }}>
                  <img
                    src={IMAGES.worker}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(252,251,247,0.95), rgba(252,251,247,0.15))' }} />
                  <div className="absolute bottom-4 left-6 w-11 h-11 rounded-[8px] flex items-center justify-center" style={{ background: t.text, color: t.accentText }}>
                    <Wrench size={20} strokeWidth={2.2} />
                  </div>
                </div>
                <div className="p-7 space-y-4">
                  <div className="space-y-2">
                    <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>For workers</span>
                    <h3 className="wd-display font-black text-2xl" style={{ color: t.text }}>I want to work</h3>
                    <p className="text-sm leading-relaxed max-w-sm" style={{ color: t.muted }}>
                      Find jobs around Pune that match your skills. Pick the ones you want, on your own time, and earn from what you know.
                    </p>
                  </div>
                  <CTA id="worker-cta-btn" variant="ghost" onClick={() => navigate('/register?role=WORKER')} t={t}>
                    Find work <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                  </CTA>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════ */}
        <section className="w-full py-28 px-6">
          <motion.div {...revealProps} className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="wd-display font-black text-5xl sm:text-6xl tracking-tight leading-[1.03]" style={{ color: t.text }}>
              Whatever needs doing,<br />
              <span style={{ color: t.accent }}>someone nearby can do it.</span>
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: t.muted }}>
              Workers Den connects people who have something to do with people who can do it. Pune-first, growing locally.
            </p>
            <div className="flex justify-center flex-wrap gap-3 pt-2">
              <CTA id="final-post-job-btn" variant="solid" onClick={() => navigate('/register?role=CUSTOMER')} t={t}>
                Post a job <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </CTA>
              <CTA id="final-find-jobs-btn" variant="ghost" onClick={() => navigate('/register?role=WORKER')} t={t}>
                Find work <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
              </CTA>
            </div>
          </motion.div>
        </section>
      </main>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ background: t.text, color: t.accentText }}>
        {/* ruled overlay — ledger feel on dark ink */}
        <div className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 37px, rgba(252,251,247,0.04) 37px, rgba(252,251,247,0.04) 38px)' }}
          />

          {/* main footer body */}
          <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

              {/* ── brand column ── */}
              <div className="md:col-span-4 space-y-5">
                <div className="flex items-center gap-3">
                  <Logo size={36} variant="solid" color={t.accent} />
                  <div>
                    <div className="wd-display font-black text-[18px] tracking-tight" style={{ color: t.accentText }}>
                      WORKERS<span style={{ color: t.accent }}>DEN</span>
                    </div>
                    <div className="wd-mono text-[9px] font-bold uppercase tracking-[0.2em]" style={{ opacity: 0.45 }}>
                      Pune, Maharashtra
                    </div>
                  </div>
                </div>

                <p className="text-[13px] leading-relaxed max-w-xs" style={{ opacity: 0.65 }}>
                  Post a job. Someone nearby picks it up. You choose who does it. Work — without the middleman, the haggling, or the mystery price.
                </p>

                {/* live badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: 'rgba(252,251,247,0.07)', border: '1px solid rgba(252,251,247,0.14)' }}>
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: t.accent }} />
                    <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: t.accent }} />
                  </span>
                  <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ opacity: 0.7 }}>
                    Live in Pune
                  </span>
                </div>
              </div>

              {/* ── nav columns ── */}
              <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">

                <div className="space-y-4">
                  <span className="wd-mono text-[9px] font-bold uppercase tracking-[0.2em] block" style={{ color: t.accent }}>
                    Platform
                  </span>
                  <ul className="space-y-2.5">
                    {[
                      { label: 'How it works', href: '#how-it-works' },
                      { label: 'Browse jobs', href: '#jobs' },
                      { label: 'Reviews', href: '#reviews' },
                      { label: 'Pricing', href: '#jobs' },
                    ].map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className="wd-mono text-[12px] transition-opacity hover:opacity-100"
                          style={{ opacity: 0.55 }}
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <span className="wd-mono text-[9px] font-bold uppercase tracking-[0.2em] block" style={{ color: t.accent }}>
                    Join
                  </span>
                  <ul className="space-y-2.5">
                    {[
                      { label: 'Post a job', href: '/register?role=CUSTOMER' },
                      { label: 'Find work', href: '/register?role=WORKER' },
                      { label: 'Log in', href: '/login' },
                      { label: 'For workers', href: '#for-workers' },
                    ].map((l) => (
                      <li key={l.label}>
                        <a
                          href={l.href}
                          className="wd-mono text-[12px] transition-opacity hover:opacity-100"
                          style={{ opacity: 0.55 }}
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <span className="wd-mono text-[9px] font-bold uppercase tracking-[0.2em] block" style={{ color: t.accent }}>
                    Trades
                  </span>
                  <ul className="space-y-2.5">
                    {['AC Repair', 'Home Cleaning', 'Electrical', 'Plumbing', 'Catering', 'Carpentry'].map((s) => (
                      <li key={s}>
                        <span className="wd-mono text-[12px]" style={{ opacity: 0.45 }}>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* ── divider ── */}
            <div className="mt-14 mb-8 h-px" style={{ background: 'rgba(252,251,247,0.1)' }} />

            {/* ── bottom bar ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="wd-mono text-[11px] flex items-center gap-3 flex-wrap justify-center sm:justify-start" style={{ opacity: 0.38 }}>
                <span>© 2026 Workers Den</span>
                <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(252,251,247,0.3)' }} />
                <span>Est. 2026, Pune MH</span>
                <span className="w-1 h-1 rounded-full" style={{ background: 'rgba(252,251,247,0.3)' }} />
                <span>All rights reserved</span>
              </div>

              <div className="flex items-center gap-4">
                {[
                  { label: 'Privacy', href: '#' },
                  { label: 'Terms', href: '#' },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    className="wd-mono text-[10px] uppercase tracking-wider transition-opacity hover:opacity-100"
                    style={{ opacity: 0.35 }}
                  >
                    {l.label}
                  </a>
                ))}

                {/* hand-stamp */}
                <span
                  className="wd-mono text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm"
                  style={{ border: '1px solid rgba(29,78,137,0.55)', color: t.accent, opacity: 0.9 }}
                >
                  v1
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          REVIEW DIALOG — rendered over everything
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {activeReview && (
          <ReviewDialog
            review={activeReview}
            onClose={() => setActiveReview(null)}
            navigate={navigate}
            t={t}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
