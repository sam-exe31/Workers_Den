import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../Theme/ThemeContext';
import api from '../../../api/axiosClient';
import CustomerNavbar from './CustomerNavbar';
import { filterOutDeletedRequests } from '../../../utils/deletedRequests';
import {
  PlusCircle,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  MessageSquare,
  ArrowRight,
  X,
  Compass,
  Star,
  ShieldCheck,
  ChevronRight,
  Zap,
  Wrench,
  Sparkles,
  Hammer,
  Paintbrush,
  Utensils,
  Snowflake,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const FAQ_ITEMS = [
  {
    q: 'How fast will a worker accept my request?',
    a: 'Most requests in Pune are matched within 60 to 120 seconds. Workers in your locality are immediately notified when you create a request.'
  },
  {
    q: 'Are rates fixed or do I need to negotiate?',
    a: 'All Workers Den jobs have fixed, transparent pricing upfront based on the trade category. There is no quote chasing or bargaining required.'
  },
  {
    q: 'What if I need to cancel my request?',
    a: 'You can cancel any open request anytime directly from your dashboard before a worker arrives.'
  },
  {
    q: 'How are workers verified?',
    a: 'Workers must complete identity verification, trade category onboarding, and maintain customer satisfaction ratings to accept jobs.'
  }
];

const getCategoryMeta = (name = '') => {
  const lower = name.toLowerCase();
  if (lower.includes('electric')) {
    return {
      icon: Zap,
      img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    };
  }
  if (lower.includes('plumb')) {
    return {
      icon: Wrench,
      img: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=600&auto=format&fit=crop&q=80',
    };
  }
  if (lower.includes('clean')) {
    return {
      icon: Sparkles,
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    };
  }
  if (lower.includes('carpen')) {
    return {
      icon: Hammer,
      img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80',
    };
  }
  if (lower.includes('paint')) {
    return {
      icon: Paintbrush,
      img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=600&auto=format&fit=crop&q=80',
    };
  }
  if (lower.includes('ac') || lower.includes('air') || lower.includes('cool')) {
    return {
      icon: Snowflake,
      img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80',
    };
  }
  if (lower.includes('cater') || lower.includes('food') || lower.includes('cook')) {
    return {
      icon: Utensils,
      img: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80',
    };
  }
  return {
    icon: Compass,
    img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  };
};

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { theme: t } = useTheme();

  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [actingJobId, setActingJobId] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  // Cancellation modal
  const [cancelModalJob, setCancelModalJob] = useState(null);
  const [cancelReason, setCancelReason] = useState('No longer need the service');
  const [cancelling, setCancelling] = useState(false);

  // Simulated 60-second multi-worker matching timer state
  const [matchingTimer, setMatchingTimer] = useState(60);

  const [currentUser, setCurrentUser] = useState(() => {
    const rawUser = localStorage.getItem('user');
    return rawUser ? JSON.parse(rawUser) : null;
  });

  useEffect(() => {
    api.get('/users/me')
      .then(res => {
        if (res.data) {
          const u = res.data;
          const updated = {
            ...currentUser,
            fullName: u.user_name || u.fullName || currentUser?.fullName,
            email: u.email || currentUser?.email,
            phone: u.phone || currentUser?.phone,
            role: u.role || currentUser?.role
          };
          setCurrentUser(updated);
          localStorage.setItem('user', JSON.stringify(updated));
        }
      })
      .catch(() => { });
  }, []);

  const displayName = currentUser?.fullName || currentUser?.user_name || currentUser?.email || 'there';
  const firstName = displayName.split(' ')[0] || 'there';

  const loadRequests = () => {
    api.get('/jobs/customer/my-jobs')
      .then(res => setMyJobs(filterOutDeletedRequests(res.data || [])))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 8000); // Polling status updates
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    api.get('/Categories')
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoadingCategories(false));
  }, []);

  // All active open or assigned jobs
  const activeJobs = useMemo(() => {
    return myJobs.filter(j => j.status === 'OPEN' || j.status === 'ACCEPTED' || j.status === 'IN_PROGRESS');
  }, [myJobs]);

  useEffect(() => {
    if (activeJobs.some(j => j.status === 'OPEN')) {
      const timer = setInterval(() => {
        setMatchingTimer(prev => (prev > 1 ? prev - 1 : 60));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeJobs]);

  const handleConfirmCancel = async () => {
    if (!cancelModalJob) return;
    setCancelling(true);
    try {
      await api.post(`/jobs/${cancelModalJob.requestId}/cancel`);
      setCancelModalJob(null);
      loadRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel request.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans">
      <CustomerNavbar />

      {/* Cancellation Modal */}
      {cancelModalJob && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          style={{ background: 'rgba(24, 32, 46, 0.65)', backdropFilter: 'blur(3px)' }}
          onClick={() => !cancelling && setCancelModalJob(null)}
        >
          <div
            className="w-full max-w-md border shadow-xl p-6 space-y-5"
            style={{ background: t.surface, borderColor: t.borderStrong }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
              <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.stamp }}>
                Cancel Request
              </span>
              <button
                type="button"
                onClick={() => !cancelling && setCancelModalJob(null)}
                className="cursor-pointer hover:opacity-60"
                style={{ color: t.muted }}
              >
                <X size={15} />
              </button>
            </div>

            <div>
              <h3 className="font-bold text-base" style={{ color: t.text }}>
                Why are you cancelling?
              </h3>
              <p className="wd-mono text-xs mt-1" style={{ color: t.muted }}>
                Please select a reason to help us improve dispatching.
              </p>
            </div>

            <div className="space-y-2">
              {[
                'No longer need the service',
                'Worker is taking too long',
                'Found someone else',
                'Incorrect request details',
                'Other reason',
              ].map(reason => {
                const isSelected = cancelReason === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setCancelReason(reason)}
                    className="w-full flex items-center gap-3 p-3 border text-left cursor-pointer transition-all"
                    style={{
                      background: isSelected ? t.accentSoft : 'transparent',
                      borderColor: isSelected ? t.accent : t.border,
                    }}
                  >
                    <span
                      className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                      style={{ borderColor: isSelected ? t.accent : t.border }}
                    >
                      {isSelected && <span className="w-2 h-2 rounded-full" style={{ background: t.accent }} />}
                    </span>
                    <span className="text-xs font-medium" style={{ color: isSelected ? t.accent : t.text }}>
                      {reason}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                disabled={cancelling}
                onClick={() => setCancelModalJob(null)}
                className="flex-1 wd-mono text-xs font-bold py-3 border cursor-pointer"
                style={{ borderColor: t.border, color: t.text, background: 'transparent' }}
              >
                Keep Request
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="flex-1 wd-mono wd-btn text-xs font-bold py-3 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                style={{ background: t.stamp, color: '#fff', border: 'none' }}
              >
                {cancelling ? 'Cancelling…' : 'Cancel Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* ── 1. Greeting & Primary Action ── */}
        <section
          className="border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          style={{ background: t.surface, borderColor: t.border }}
        >
          <div>
            <div className="wd-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: t.muted }}>
              {timeGreeting()}
            </div>
            <h1 className="wd-display font-black text-2xl sm:text-3xl tracking-tight" style={{ color: t.text }}>
              {firstName}
            </h1>
            <p className="text-sm mt-1" style={{ color: t.muted }}>
              What would you like to get done today?
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/customer/create-job')}
            className="wd-mono wd-btn text-xs font-bold px-6 py-3.5 flex items-center gap-2 cursor-pointer self-start sm:self-auto shadow-sm"
            style={{ background: t.accent, color: t.accentText, border: 'none' }}
          >
            <PlusCircle size={16} /> Create Request
          </button>
        </section>

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border p-4" style={{ background: t.surface, borderColor: t.border }}>
            <div className="wd-mono text-[10px] uppercase font-bold" style={{ color: t.muted }}>Active Jobs</div>
            <div className="wd-display font-black text-xl mt-1" style={{ color: activeJobs.length > 0 ? t.accent : t.text }}>
              {activeJobs.length} Active
            </div>
          </div>
          <div className="border p-4" style={{ background: t.surface, borderColor: t.border }}>
            <div className="wd-mono text-[10px] uppercase font-bold" style={{ color: t.muted }}>Total Requests</div>
            <div className="wd-display font-black text-xl mt-1" style={{ color: t.text }}>
              {myJobs.length}
            </div>
          </div>
          <div className="border p-4" style={{ background: t.surface, borderColor: t.border }}>
            <div className="wd-mono text-[10px] uppercase font-bold" style={{ color: t.muted }}>Completed</div>
            <div className="wd-display font-black text-xl mt-1" style={{ color: t.success }}>
              {myJobs.filter(j => j.status === 'COMPLETED').length}
            </div>
          </div>
          <div className="border p-4" style={{ background: t.surface, borderColor: t.border }}>
            <div className="wd-mono text-[10px] uppercase font-bold" style={{ color: t.muted }}>Customer Badge</div>
            <div className="wd-mono text-xs font-bold mt-1 flex items-center gap-1" style={{ color: t.accent }}>
              <ShieldCheck size={14} /> Verified Pune
            </div>
          </div>
        </div>

        {/* ── 2. Current Active Request Lifecycle ── */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: t.border }}>
            <h2 className="wd-display font-black text-lg tracking-tight" style={{ color: t.text }}>
              Active Requests
            </h2>
            {activeJobs.length > 0 && (
              <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}>
                {activeJobs.length} Active
              </span>
            )}
          </div>

          {loading ? (
            <div className="py-12 text-center wd-mono text-xs animate-pulse" style={{ color: t.muted }}>
              Checking active requests…
            </div>
          ) : activeJobs.length === 0 ? (
            <div
              className="border p-10 text-center space-y-3"
              style={{ background: t.surface, borderColor: t.border }}
            >
              <Compass size={32} className="mx-auto" style={{ color: t.faint }} />
              <div className="wd-display font-black text-lg" style={{ color: t.text }}>
                No active request right now
              </div>
              <p className="wd-mono text-xs max-w-sm mx-auto" style={{ color: t.muted }}>
                When you need help with plumbing, electrical work, cleaning, or repairs, post a request and we'll dispatch a nearby worker.
              </p>
              <button
                type="button"
                onClick={() => navigate('/customer/create-job')}
                className="mt-2 wd-mono text-xs font-bold px-5 py-2.5 border cursor-pointer inline-flex items-center gap-1.5"
                style={{ borderColor: t.accent, color: t.accent, background: t.accentSoft }}
              >
                <PlusCircle size={14} /> Create a Request
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {activeJobs.map(activeJob => (
                <div
                  key={activeJob.requestId}
                  className="border p-6 space-y-6"
                  style={{ background: t.surface, borderColor: t.border }}
                >
                  {/* Header & Status badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: t.border }}>
                    <div>
                      <div className="wd-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accent }}>
                        {activeJob.categoryName || activeJob.catName || 'Service Request'}
                      </div>
                      <h3 className="wd-display font-black text-xl tracking-tight mt-0.5" style={{ color: t.text }}>
                        {activeJob.title}
                      </h3>
                    </div>

                    <span
                      className="wd-mono text-xs font-bold px-3 py-1 border self-start sm:self-auto"
                      style={{
                        borderColor: activeJob.status === 'OPEN' ? t.warning : t.success,
                        color: activeJob.status === 'OPEN' ? t.warning : t.success,
                        background: activeJob.status === 'OPEN' ? 'rgba(183,121,31,0.08)' : 'rgba(47,125,79,0.08)',
                      }}
                    >
                      {activeJob.status === 'OPEN' ? 'Finding a worker…' :
                        activeJob.status === 'ACCEPTED' ? 'Worker assigned' :
                          activeJob.status === 'IN_PROGRESS' ? 'Work started' : activeJob.status}
                    </span>
                  </div>

                  {/* Lifecycle Progress Steps */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 gap-2 text-center wd-mono text-[10px] uppercase font-bold" style={{ color: t.muted }}>
                      <span style={{ color: t.accent }}>Submitted</span>
                      <span style={{ color: activeJob.status === 'OPEN' ? t.warning : t.accent }}>Matching</span>
                      <span style={{ color: activeJob.status !== 'OPEN' ? t.accent : t.border }}>Assigned</span>
                      <span style={{ color: activeJob.status === 'IN_PROGRESS' ? t.accent : t.border }}>Started</span>
                      <span style={{ color: t.border }}>Completed</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden flex" style={{ background: t.border }}>
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: activeJob.status === 'OPEN' ? '40%' :
                            activeJob.status === 'ACCEPTED' ? '60%' :
                              activeJob.status === 'IN_PROGRESS' ? '80%' : '100%',
                          background: activeJob.status === 'OPEN' ? t.warning : t.accent,
                        }}
                      />
                    </div>
                  </div>

                  {/* Matching state sub-card */}
                  {activeJob.status === 'OPEN' && (
                    <div
                      className="p-5 border space-y-3"
                      style={{ background: 'rgba(183,121,31,0.06)', borderColor: t.warning }}
                    >
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-2 wd-mono text-xs font-bold" style={{ color: t.warning }}>
                          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ background: t.warning }} />
                          Searching nearby workers in {activeJob.locality || 'Pune'}… (~{matchingTimer}s)
                        </div>
                        <div className="wd-mono text-xs font-bold" style={{ color: t.text }}>
                          Offered: <span className="text-sm font-black" style={{ color: t.accent }}>₹{activeJob.customerPrice || activeJob.workerPayout}</span>
                        </div>
                      </div>

                      <p className="wd-mono text-xs leading-relaxed" style={{ color: t.muted }}>
                        We are notifying eligible workers in {activeJob.locality || 'your area'}. Want to attract nearby workers faster? You can boost your wage offer below.
                      </p>

                      <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: 'rgba(183,121,31,0.2)' }}>
                        <div className="wd-mono text-xs" style={{ color: t.muted }}>
                          Worker payout share: <span className="font-bold text-xs" style={{ color: t.text }}>₹{activeJob.workerPayout || activeJob.customerPrice}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => navigate(`/jobs/${activeJob.requestId}`)}
                          className="wd-mono text-xs font-bold px-4 py-2 border cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                          style={{ borderColor: t.warning, color: t.warning, background: 'transparent' }}
                        >
                          ⚡ Boost Offer by +₹100
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Assigned worker card */}
                  {(activeJob.status === 'ACCEPTED' || activeJob.status === 'IN_PROGRESS') && (
                    <div
                      className="p-5 border space-y-4"
                      style={{ background: t.accentSoft, borderColor: t.accent }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {activeJob.workerProfileImage ? (
                            <img
                              src={activeJob.workerProfileImage}
                              alt={activeJob.workerName || 'Worker'}
                              className="w-14 h-14 rounded-full object-cover border-2 shrink-0"
                              style={{ borderColor: t.accent }}
                            />
                          ) : (
                            <div
                              className="w-14 h-14 rounded-full border-2 flex items-center justify-center font-bold text-lg shrink-0"
                              style={{ borderColor: t.accent, background: t.surface, color: t.accent }}
                            >
                              {activeJob.workerName ? activeJob.workerName.substring(0, 2).toUpperCase() : 'W'}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-base" style={{ color: t.text }}>
                                {activeJob.workerName || 'Assigned Worker'}
                              </span>
                              <span className="wd-mono text-[10px] font-bold px-2 py-0.5 border" style={{ borderColor: t.success, color: t.success }}>
                                ✓ Verified
                              </span>
                            </div>

                            <div className="wd-mono text-xs flex items-center gap-3 mt-1" style={{ color: t.muted }}>
                              <span className="flex items-center gap-1">
                                <Star size={12} style={{ color: '#D97706' }} className="fill-current" />
                                4.8 rating
                              </span>
                              <span>· Verified Pro</span>
                              {activeJob.workerPhone && (
                                <span>· {activeJob.workerPhone}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="wd-display font-black text-xl self-start sm:self-auto" style={{ color: t.success }}>
                          ₹{activeJob.customerPrice || activeJob.workerPayout}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/jobs/${activeJob.requestId}`)}
                      className="wd-mono text-xs font-bold px-4 py-2.5 border cursor-pointer flex items-center gap-1.5"
                      style={{ borderColor: t.border, color: t.text, background: t.surface }}
                    >
                      View Details <ChevronRight size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCancelModalJob(activeJob)}
                      className="wd-mono text-xs font-bold px-4 py-2.5 border cursor-pointer transition-colors"
                      style={{ borderColor: t.border, color: t.stamp, background: 'transparent' }}
                    >
                      Cancel Request
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── 3. Quick Trade Booking Grid ── */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: t.border }}>
            <h2 className="wd-display font-black text-lg tracking-tight" style={{ color: t.text }}>
              Quick Book a Trade
            </h2>
            <span className="wd-mono text-xs" style={{ color: t.muted }}>
              {loadingCategories ? 'Loading categories…' : `${categories.length} trade categories`}
            </span>
          </div>

          {loadingCategories ? (
            <div className="py-12 text-center wd-mono text-xs animate-pulse" style={{ color: t.muted }}>
              Loading database categories…
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 border text-center space-y-2" style={{ background: t.surface, borderColor: t.border }}>
              <Compass size={28} className="mx-auto" style={{ color: t.faint }} />
              <div className="wd-mono text-xs font-bold" style={{ color: t.text }}>
                No active categories found in database
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {categories.map(cat => {
                const name = cat.catName || cat.cat_name || 'Service';
                const meta = getCategoryMeta(name);
                const Icon = meta.icon;
                const price = cat.customerPrice || cat.customer_price || 0;
                const desc = cat.description || `${name} services in Pune with verified workers.`;

                return (
                  <div
                    key={cat.id || name}
                    onClick={() => navigate(`/customer/create-job?category=${encodeURIComponent(name)}`)}
                    className="relative group border overflow-hidden cursor-pointer rounded-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                    style={{ borderColor: t.border, background: t.surface }}
                  >
                    {/* Photo Cover with Gradient Overlay */}
                    <div className="h-28 w-full relative overflow-hidden bg-slate-900">
                      <img
                        src={meta.img}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 text-white">
                        <div className="w-7 h-7 rounded flex items-center justify-center text-white backdrop-blur-sm">
                          <Icon size={14} />
                        </div>
                        <div className="font-bold text-sm tracking-tight text-white drop-shadow">
                          {name}
                        </div>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="wd-mono text-[11px] font-medium line-clamp-2" style={{ color: t.muted }}>
                        {desc}
                      </div>
                      <div className="mt-2 wd-mono text-[11px] font-bold flex items-center justify-between">
                        <span style={{ color: t.accent }}>From ₹{price}</span>
                        <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform" style={{ color: t.accent }}>
                          Book <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── 4. Platform Guarantees ── */}
        <section className="border p-6 space-y-4" style={{ background: t.surface, borderColor: t.border }}>
          <div className="wd-mono text-xs font-bold uppercase tracking-wider" style={{ color: t.accent }}>
            Why Workers Den?
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="font-bold text-sm flex items-center gap-1.5" style={{ color: t.text }}>
                ⚡ 60s Fast Dispatch
              </div>
              <p className="wd-mono text-xs leading-relaxed" style={{ color: t.muted }}>
                Requests are immediately broadcasted to verified nearby tradespeople in Pune.
              </p>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-sm flex items-center gap-1.5" style={{ color: t.text }}>
                💰 100% Fixed Rates
              </div>
              <p className="wd-mono text-xs leading-relaxed" style={{ color: t.muted }}>
                No quote chasing or hidden fees. Standardized pricing upfront before you book.
              </p>
            </div>
            <div className="space-y-1">
              <div className="font-bold text-sm flex items-center gap-1.5" style={{ color: t.text }}>
                🛡️ Verified Pros
              </div>
              <p className="wd-mono text-xs leading-relaxed" style={{ color: t.muted }}>
                Every worker profile is identity-checked with community ratings & reviews.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. Customer FAQ Accordion ── */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: t.border }}>
            <h2 className="wd-display font-black text-lg tracking-tight" style={{ color: t.text }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div className="border space-y-2 p-4" style={{ background: t.surface, borderColor: t.border }}>
            {FAQ_ITEMS.map((faq, index) => (
              <div key={index} className="border-b last:border-b-0 pb-3 pt-2" style={{ borderColor: t.border }}>
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between text-left font-bold text-xs cursor-pointer"
                  style={{ color: t.text }}
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle size={14} style={{ color: t.accent }} /> {faq.q}
                  </span>
                  <ChevronDown size={14} className={`transition-transform ${openFaq === index ? 'rotate-180' : ''}`} style={{ color: t.muted }} />
                </button>
                {openFaq === index && (
                  <p className="wd-mono text-xs mt-2 pl-6 leading-relaxed" style={{ color: t.muted }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. All Requests History ── */}
        {myJobs.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: t.border }}>
              <h2 className="wd-display font-black text-lg tracking-tight" style={{ color: t.text }}>
                All Requests ({myJobs.length})
              </h2>
              <button
                type="button"
                onClick={() => navigate('/customer/requests')}
                className="wd-mono text-xs cursor-pointer hover:opacity-70"
                style={{ color: t.accent }}
              >
                View all →
              </button>
            </div>

            <div className="border" style={{ borderColor: t.border }}>
              {myJobs.map((job, idx) => (
                <div
                  key={job.requestId || idx}
                  onClick={() => navigate(`/jobs/${job.requestId}`)}
                  className="flex items-center justify-between px-5 py-4 border-b last:border-b-0 gap-4 cursor-pointer hover:opacity-85 transition-opacity"
                  style={{ borderColor: t.border, background: idx % 2 === 0 ? t.surface : t.cardHover }}
                >
                  <div>
                    <div className="font-semibold text-sm" style={{ color: t.text }}>{job.title}</div>
                    <div className="wd-mono text-[11px] mt-0.5" style={{ color: t.muted }}>
                      {job.locality} · {job.preferredDate || 'Recent'} · <span className="font-bold">{job.categoryName || job.catName || 'Service'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className="wd-mono text-[10px] font-bold px-2.5 py-1 border uppercase tracking-wider"
                      style={{
                        borderColor: job.status === 'COMPLETED' ? t.success : job.status === 'OPEN' ? t.warning : t.border,
                        color: job.status === 'COMPLETED' ? t.success : job.status === 'OPEN' ? t.warning : t.text,
                        background: job.status === 'COMPLETED' ? 'rgba(47,125,79,0.08)' : job.status === 'OPEN' ? 'rgba(183,121,31,0.08)' : 'transparent',
                      }}
                    >
                      {job.status}
                    </span>
                    <span className="wd-mono text-xs font-bold" style={{ color: t.text }}>
                      View →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}
