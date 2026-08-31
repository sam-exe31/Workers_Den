import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import { useWorker } from '../../../context/WorkerContext';
import api from '../../../api/axiosClient';
import WorkerNavbar from './WorkerNavbar';
import {
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Play,
  CheckSquare,
  Phone,
  SlidersHorizontal,
  ChevronDown,
  Zap,
} from 'lucide-react';

// ── Helpers ─────────────────────────────────────────────────────────────────

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function sortJobs(jobs, sortKey) {
  switch (sortKey) {
    case 'payout':
      return [...jobs].sort((a, b) => (b.workerPayout || 0) - (a.workerPayout || 0));
    case 'newest':
      return [...jobs].sort((a, b) => (b.requestId || 0) - (a.requestId || 0));
    default:
      return jobs; // 'recommended' = server order
  }
}

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color, t }) {
  return (
    <div className="border p-5 flex flex-col gap-1" style={{ background: t.surface, borderColor: t.border }}>
      <span className="wd-mono text-[10px] uppercase tracking-wider" style={{ color: t.muted }}>{label}</span>
      <span className="wd-display font-black text-2xl" style={{ color: color || t.text }}>{value}</span>
      {sub && <span className="wd-mono text-[11px]" style={{ color: t.muted }}>{sub}</span>}
    </div>
  );
}

// ── Job card ─────────────────────────────────────────────────────────────────
function JobCard({ job, profile, onView, t }) {
  const catName = job.categoryName || job.catName || job.cat_name;
  const photosList = job.photos || job.imageUrls || [];

  return (
    <div
      className="border p-5 flex flex-col sm:flex-row gap-4 sm:items-start transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md group rounded-sm"
      style={{ background: t.surface, borderColor: t.border }}
    >
      {/* Embedded Photo Preview or Trade Cover */}
      {photosList.length > 0 ? (
        <div className="flex sm:flex-col gap-1.5 shrink-0">
          <img
            src={photosList[0]}
            alt="Issue photo"
            className="w-20 h-20 rounded border object-cover group-hover:scale-105 transition-transform"
            style={{ borderColor: t.border }}
          />
          {photosList.length > 1 && (
            <span className="wd-mono text-[10px] font-bold text-center" style={{ color: t.accent }}>
              +{photosList.length - 1} photo(s)
            </span>
          )}
        </div>
      ) : (
        <div className="w-12 h-12 rounded border flex items-center justify-center font-bold shrink-0 text-sm" style={{ borderColor: t.border, background: t.accentSoft, color: t.accent }}>
          📷
        </div>
      )}

      {/* Left: job info */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {catName && (
            <span className="wd-mono text-[10px] font-bold px-2 py-0.5 border uppercase tracking-wider" style={{ borderColor: t.accent, color: t.accent, background: t.accentSoft }}>
              {catName}
            </span>
          )}
          {photosList.length > 0 && (
            <span className="wd-mono text-[10px] font-bold px-2 py-0.5 border" style={{ borderColor: t.success, color: t.success, background: 'rgba(47,125,79,0.08)' }}>
              📷 {photosList.length} Attached Photo(s)
            </span>
          )}
          {(job.workerPayout > 450 || job.urgency === 'URGENT') && (
            <span
              className="wd-mono text-[10px] font-bold px-2 py-0.5 border flex items-center gap-1 animate-pulse"
              style={{ borderColor: t.warning, color: t.warning, background: 'rgba(183,121,31,0.08)' }}
            >
              ⚡ High Wage Offer
            </span>
          )}
          {job.urgency === 'HIGH' && (
            <span
              className="wd-mono text-[10px] font-bold px-2 py-0.5 border"
              style={{ borderColor: '#DC2626', color: '#DC2626', background: 'rgba(220,38,38,0.06)' }}
            >
              Urgent
            </span>
          )}
        </div>

        <div className="wd-display font-black text-base group-hover:text-amber-600 transition-colors" style={{ color: t.text }}>
          {job.title}
        </div>

        {job.description && (
          <p className="text-sm leading-relaxed line-clamp-2" style={{ color: t.muted }}>
            {job.description}
          </p>
        )}

        <div className="wd-mono text-xs flex flex-wrap gap-x-4 gap-y-1" style={{ color: t.muted }}>
          <span className="flex items-center gap-1.5 font-bold">
            <MapPin size={12} style={{ color: t.accent }} />
            {job.locality}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} style={{ color: t.accent }} />
            {job.preferredDate}{job.preferredTime ? ` · ${job.preferredTime}` : ''}
          </span>
        </div>
      </div>

      {/* Right: payout + action */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
        <div className="text-right">
          <div className="wd-mono text-[10px] uppercase font-bold" style={{ color: t.muted }}>Worker Payout</div>
          <div className="wd-display font-black text-xl" style={{ color: t.success }}>
            ₹{job.workerPayout}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onView(job.requestId)}
          className="wd-mono wd-btn text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 cursor-pointer shadow-sm group-hover:scale-105 transition-transform"
          style={{ background: t.accent, color: t.accentText, border: 'none' }}
        >
          View & Claim <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
}

// ── Active job strip ─────────────────────────────────────────────────────────
function ActiveJobStrip({ job, onAction, actionLoading, t }) {
  const isInProgress = job.status === 'IN_PROGRESS';
  return (
    <div
      className="border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      style={{
        background: isInProgress ? 'rgba(183,121,31,0.06)' : t.accentSoft,
        borderColor: isInProgress ? t.warning : t.accent,
      }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="wd-mono text-[10px] font-bold px-2 py-0.5 border"
            style={{
              borderColor: isInProgress ? t.warning : t.accent,
              color: isInProgress ? t.warning : t.accent,
            }}
          >
            {isInProgress ? 'In progress' : 'Accepted'}
          </span>
          <span className="wd-mono text-[10px]" style={{ color: t.muted }}>Your current job</span>
        </div>
        <div className="wd-display font-black text-base" style={{ color: t.text }}>{job.title}</div>
        <div className="wd-mono text-xs flex gap-4 mt-1" style={{ color: t.muted }}>
          <span className="flex items-center gap-1.5">
            <MapPin size={11} style={{ color: t.accent }} /> {job.locality}
          </span>
          {job.customerName && (
            <span className="flex items-center gap-1.5">
              <Phone size={11} style={{ color: t.accent }} /> {job.customerName}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className="wd-display font-black text-lg" style={{ color: t.success }}>₹{job.workerPayout}</div>
        {!isInProgress ? (
          <button
            type="button"
            disabled={actionLoading === job.requestId}
            onClick={() => onAction(job.requestId, 'start')}
            className="wd-mono wd-btn text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            style={{ background: t.warning, color: '#fff', border: 'none' }}
          >
            <Play size={12} />
            {actionLoading === job.requestId ? 'Starting…' : 'Start work'}
          </button>
        ) : (
          <button
            type="button"
            disabled={actionLoading === job.requestId}
            onClick={() => onAction(job.requestId, 'complete')}
            className="wd-mono wd-btn text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
            style={{ background: t.success, color: '#fff', border: 'none' }}
          >
            <CheckSquare size={12} />
            {actionLoading === job.requestId ? 'Completing…' : 'Mark complete'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { theme: t } = useTheme();

  // ── shared profile from WorkerGuard context ────────────────────────────
  // toggleAvailability from context updates both the Navbar and the Dashboard.
  const { profile, toggleAvailability } = useWorker();

  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  // Filter / sort state
  const [areaTab, setAreaTab] = useState('myArea');
  const [sortKey, setSortKey] = useState('recommended');
  const [showSort, setShowSort] = useState(false);

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const firstName = user?.fullName?.split(' ')[0] || profile?.userName || 'there';

  const load = () => {
    Promise.all([
      api.get('/jobs/worker/available'),
      api.get('/jobs/worker/my-jobs'),
    ])
      .then(([availRes, myRes]) => {
        setAvailableJobs(availRes.data || []);
        setMyJobs(myRes.data || []);
      })
      .catch(err => console.error('Dashboard load failed', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // ── Derived state ──────────────────────────────────────────────────────────

  const activeTasks = myJobs.filter(j => j.status === 'ACCEPTED' || j.status === 'IN_PROGRESS');
  const completedJobs = myJobs.filter(j => j.status === 'COMPLETED');
  const recentWork = [...completedJobs].reverse().slice(0, 5);

  const totalEarnings = completedJobs.reduce((s, j) => s + (j.workerPayout || 0), 0);

  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Categories present in available jobs
  const categoryOptions = useMemo(() => {
    const set = new Set();
    availableJobs.forEach(j => {
      if (j.categoryName) set.add(j.categoryName);
    });
    return Array.from(set);
  }, [availableJobs]);

  // Area & Category filter
  const filteredJobs = useMemo(() => {
    let base = availableJobs;
    if (areaTab === 'myArea' && profile?.locality) {
      base = base.filter(j => j.locality === profile.locality);
    }
    if (selectedCategory !== 'ALL') {
      base = base.filter(j => (j.categoryName || '').toLowerCase() === selectedCategory.toLowerCase());
    }
    return sortJobs(base, sortKey);
  }, [availableJobs, areaTab, selectedCategory, sortKey, profile]);

  // ── Job action ─────────────────────────────────────────────────────────────
  const handleAction = async (jobId, action) => {
    setActionLoading(jobId);
    try {
      await api.post(`/jobs/${jobId}/${action}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || `Could not ${action} job.`);
    } finally {
      setActionLoading(null);
    }
  };

  // ── Availability toggle (delegates to context — updates Navbar too) ──────
  // toggleAvailability comes from useWorker() above — no separate impl needed.

  const SORT_LABELS = { recommended: 'Recommended', payout: 'Highest payout', newest: 'Newest first' };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans">
      <WorkerNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* ── 1. Header ── */}
        <section
          className="border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
          style={{ background: t.surface, borderColor: t.border }}
        >
          <div>
            <div className="wd-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: t.muted }}>
              {timeGreeting()}
            </div>
            <h1 className="wd-display font-black text-2xl sm:text-3xl tracking-tight" style={{ color: t.text }}>
              {firstName}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {/* Availability badge */}
              <span
                className="flex items-center gap-1.5 wd-mono text-xs font-bold"
                style={{ color: profile?.isAvailable ? t.success : t.muted }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: profile?.isAvailable ? t.success : t.muted }} />
                {profile?.isAvailable ? 'Available' : 'Offline'}
              </span>

              {profile?.locality && (
                <>
                  <span style={{ color: t.border }}>·</span>
                  <span className="wd-mono text-xs flex items-center gap-1" style={{ color: t.muted }}>
                    <MapPin size={11} style={{ color: t.accent }} />
                    {profile.locality}
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleAvailability}
            className="wd-mono wd-btn text-xs font-bold px-5 py-2.5 border cursor-pointer self-start sm:self-auto"
            style={{
              borderColor: profile?.isAvailable ? t.muted : t.success,
              color: profile?.isAvailable ? t.muted : t.success,
              background: 'transparent',
            }}
          >
            {profile?.isAvailable ? 'Go offline' : 'Go online'}
          </button>
        </section>

        {/* ── 2. Stats row ── */}
        {!loading && (
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Earnings"
              value={`₹${totalEarnings.toLocaleString('en-IN')}`}
              sub="From completed work"
              color={t.success}
              t={t}
            />
            <StatCard
              label="Jobs completed"
              value={profile?.completedJobs ?? completedJobs.length}
              sub="Total"
              t={t}
            />
            <StatCard
              label="Rating"
              value={
                profile?.rating && profile.rating > 0
                  ? `★ ${profile.rating}`
                  : 'New worker'
              }
              sub={profile?.rating > 0 ? 'Customer rating' : 'No ratings yet'}
              color={profile?.rating > 0 ? '#D97706' : t.muted}
              t={t}
            />
          </section>
        )}

        {/* ── 3. Active job strip ── */}
        {activeTasks.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-baseline gap-2 border-b pb-3" style={{ borderColor: t.border }}>
              <h2 className="wd-display font-black text-lg tracking-tight" style={{ color: t.text }}>
                Current job
              </h2>
              <span className="wd-mono text-xs" style={{ color: t.muted }}>
                {activeTasks.length} active
              </span>
            </div>
            {activeTasks.map(job => (
              <ActiveJobStrip
                key={job.requestId}
                job={job}
                onAction={handleAction}
                actionLoading={actionLoading}
                t={t}
              />
            ))}
          </section>
        )}

        {/* ── 4. Available Work ── */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3" style={{ borderColor: t.border }}>
            <div>
              <h2 className="wd-display font-black text-lg tracking-tight" style={{ color: t.text }}>
                Available Work
              </h2>
              <p className="wd-mono text-xs mt-0.5" style={{ color: t.muted }}>
                Jobs matching your skills and preferences.
              </p>
            </div>
            <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}>
              {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Category Wise Filter Strip */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none wd-mono text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider shrink-0 mr-1" style={{ color: t.muted }}>Trade Category:</span>
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className="px-3 py-1.5 border font-bold whitespace-nowrap cursor-pointer transition-all"
              style={{
                background: selectedCategory === 'ALL' ? t.accent : t.surface,
                color: selectedCategory === 'ALL' ? t.accentText : t.text,
                borderColor: selectedCategory === 'ALL' ? t.accent : t.border,
              }}
            >
              All Trades ({availableJobs.length})
            </button>
            {categoryOptions.map(cat => {
              const count = availableJobs.filter(j => (j.categoryName || '').toLowerCase() === cat.toLowerCase()).length;
              const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 border font-bold whitespace-nowrap cursor-pointer transition-all"
                  style={{
                    background: isSelected ? t.accent : t.surface,
                    color: isSelected ? t.accentText : t.text,
                    borderColor: isSelected ? t.accent : t.border,
                  }}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Area toggle */}
            <div className="flex border" style={{ borderColor: t.border }}>
              {[
                { key: 'myArea', label: 'My Area' },
                { key: 'allPune', label: 'All Pune' },
              ].map(tab => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setAreaTab(tab.key)}
                  className="flex-1 wd-mono text-xs font-bold px-5 py-2.5 cursor-pointer transition-colors border-r last:border-r-0"
                  style={{
                    borderColor: t.border,
                    background: areaTab === tab.key ? t.accent : 'transparent',
                    color: areaTab === tab.key ? t.accentText : t.muted,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSort(!showSort)}
                className="wd-mono text-xs font-bold px-4 py-2.5 border flex items-center gap-2 cursor-pointer"
                style={{ borderColor: t.border, color: t.text, background: t.surface }}
              >
                Sort: {SORT_LABELS[sortKey]} <ChevronDown size={13} />
              </button>
              {showSort && (
                <div
                  className="absolute top-full left-0 mt-1 border z-10 min-w-[180px] shadow-sm"
                  style={{ background: t.surface, borderColor: t.border }}
                >
                  {Object.entries(SORT_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setSortKey(key); setShowSort(false); }}
                      className="w-full text-left px-4 py-2.5 wd-mono text-xs cursor-pointer"
                      style={{
                        background: sortKey === key ? t.accentSoft : 'transparent',
                        color: sortKey === key ? t.accent : t.text,
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Job list */}
          {loading ? (
            <div className="py-12 text-center wd-mono text-xs animate-pulse" style={{ color: t.muted }}>
              Loading available work…
            </div>
          ) : filteredJobs.length === 0 ? (
            <div
              className="py-14 text-center border"
              style={{ background: t.surface, borderColor: t.border }}
            >
              <Zap size={28} className="mx-auto mb-3" style={{ color: t.faint }} />
              <div className="wd-display font-black text-base" style={{ color: t.text }}>
                No open jobs {areaTab === 'myArea' ? `in ${profile?.locality || 'your area'}` : 'in Pune'} right now
              </div>
              <p className="wd-mono text-xs mt-2" style={{ color: t.muted }}>
                New jobs appear here as customers post them.
              </p>
              {areaTab === 'myArea' && (
                <button
                  type="button"
                  onClick={() => setAreaTab('allPune')}
                  className="mt-4 wd-mono text-xs font-bold px-5 py-2.5 border cursor-pointer"
                  style={{ borderColor: t.accent, color: t.accent }}
                >
                  Browse all Pune →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredJobs.map(job => (
                <JobCard
                  key={job.requestId}
                  job={job}
                  profile={profile}
                  onView={id => navigate(`/jobs/${id}`)}
                  t={t}
                />
              ))}

              {filteredJobs.length >= 5 && (
                <button
                  type="button"
                  onClick={() => navigate('/worker/find-jobs')}
                  className="w-full wd-mono text-xs font-bold py-3.5 border cursor-pointer"
                  style={{ borderColor: t.border, color: t.accent, background: t.surface }}
                >
                  Browse all available work →
                </button>
              )}
            </div>
          )}
        </section>

        {/* ── 5. Recent work ── */}
        {recentWork.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: t.border }}>
              <h2 className="wd-display font-black text-lg tracking-tight" style={{ color: t.text }}>
                Recent work
              </h2>
              <button
                type="button"
                onClick={() => navigate('/worker/my-jobs')}
                className="wd-mono text-xs cursor-pointer hover:opacity-70"
                style={{ color: t.accent }}
              >
                View all →
              </button>
            </div>

            <div className="border" style={{ borderColor: t.border }}>
              {recentWork.map((job, idx) => (
                <div
                  key={job.requestId || idx}
                  onClick={() => navigate(`/jobs/${job.requestId}`)}
                  className="flex items-center justify-between px-5 py-3.5 border-b last:border-b-0 gap-4 cursor-pointer hover:opacity-85 transition-opacity"
                  style={{ borderColor: t.border, background: idx % 2 === 0 ? t.surface : t.cardHover }}
                >
                  <div>
                    <span className="font-semibold text-sm" style={{ color: t.text }}>{job.title}</span>
                    <div className="wd-mono text-[11px] mt-0.5" style={{ color: t.muted }}>
                      {job.locality} · {job.preferredDate || 'Completed'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="wd-mono font-bold text-sm" style={{ color: t.success }}>
                      +₹{job.workerPayout}
                    </span>
                    <span className="wd-mono text-[10px] font-bold px-2.5 py-1 border hover:bg-emerald-500 hover:text-white transition-colors" style={{ borderColor: t.success, color: t.success }}>
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
