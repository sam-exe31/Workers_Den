import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import WorkerNavbar from './WorkerNavbar';
import { MapPin, Clock, ArrowRight, AlertCircle, Compass, ChevronDown, SlidersHorizontal } from 'lucide-react';

// ── Sort helpers ─────────────────────────────────────────────────────────────
function sortJobs(jobs, key) {
  switch (key) {
    case 'payout':  return [...jobs].sort((a, b) => (b.workerPayout || 0) - (a.workerPayout || 0));
    case 'newest':  return [...jobs].sort((a, b) => (b.requestId || 0) - (a.requestId || 0));
    case 'nearest': return jobs; // would need coordinates — preserve server order
    default:        return jobs;
  }
}

const SORT_LABELS = {
  recommended: 'Recommended',
  payout:      'Highest payout',
  newest:      'Newest first',
  nearest:     'Nearest first',
};

export default function FindJobsPage() {
  const navigate     = useNavigate();
  const { theme: t } = useTheme();

  const [jobs, setJobs]         = useState([]);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [claimingId, setClaimId]= useState(null);
  const [error, setError]       = useState('');

  // Controls
  const [areaTab, setAreaTab] = useState('myArea');
  const [sortKey, setSortKey] = useState('recommended');
  const [showSort, setShowSort] = useState(false);

  const load = () => {
    Promise.all([
      api.get('/workers/me'),
      api.get('/jobs/worker/available'),
    ])
      .then(([resProf, resJobs]) => {
        setProfile(resProf.data);
        setJobs(resJobs.data || []);
      })
      .catch(() => setError('Could not load available work right now.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Area filter + sort
  const displayed = useMemo(() => {
    let base = jobs;
    if (areaTab === 'myArea' && profile?.locality) {
      base = base.filter(j => j.locality === profile.locality);
    }
    return sortJobs(base, sortKey);
  }, [jobs, areaTab, sortKey, profile]);

  const handleClaim = async (jobId) => {
    setError('');
    setClaimId(jobId);
    try {
      await api.post(`/jobs/${jobId}/accept`);
      navigate(`/jobs/${jobId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'This job was just claimed by another worker.');
      load();
    } finally {
      setClaimId(null);
    }
  };

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans">
      <WorkerNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="border-b pb-4" style={{ borderColor: t.border }}>
          <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
            Available Work
          </h1>
          <p className="wd-mono text-xs mt-1" style={{ color: t.muted }}>
            Jobs matching your trade skills and location.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="p-3 text-xs wd-mono border flex items-start gap-2"
            style={{ background: 'rgba(194,59,30,0.06)', borderColor: t.stamp, color: t.stamp }}
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" /> {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Area toggle */}
          <div className="flex border" style={{ borderColor: t.border }}>
            {[
              { key: 'myArea',  label: 'My Area' },
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

          {/* Sort */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSort(!showSort)}
              className="wd-mono text-xs font-bold px-4 py-2.5 border flex items-center gap-2 cursor-pointer whitespace-nowrap"
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

          {/* Count */}
          <div className="flex items-center wd-mono text-xs ml-auto" style={{ color: t.muted }}>
            {displayed.length} job{displayed.length !== 1 ? 's' : ''} found
          </div>
        </div>

        {/* Job list */}
        {loading ? (
          <div className="py-16 text-center wd-mono text-xs animate-pulse" style={{ color: t.muted }}>
            Loading available work…
          </div>
        ) : displayed.length === 0 ? (
          <div
            className="border p-14 text-center space-y-3"
            style={{ background: t.surface, borderColor: t.border }}
          >
            <Compass size={28} className="mx-auto" style={{ color: t.faint }} />
            <div className="wd-display font-black text-lg" style={{ color: t.text }}>
              No open jobs {areaTab === 'myArea' ? `in ${profile?.locality || 'your area'}` : 'right now'}
            </div>
            <p className="wd-mono text-xs max-w-sm mx-auto" style={{ color: t.muted }}>
              Jobs matching your skills appear here as customers post them.
            </p>
            {areaTab === 'myArea' && (
              <button
                type="button"
                onClick={() => setAreaTab('allPune')}
                className="wd-mono text-xs font-bold px-5 py-2.5 border cursor-pointer"
                style={{ borderColor: t.accent, color: t.accent }}
              >
                Browse all Pune →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(job => {
              const isUrgent = job.urgency === 'HIGH';
              const catName = job.categoryName || job.catName || job.cat_name;
              return (
                <div
                  key={job.requestId}
                  className="border p-5 flex flex-col sm:flex-row gap-4 sm:items-start"
                  style={{ background: t.surface, borderColor: t.border }}
                >
                  {/* Left info */}
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {isUrgent && (
                        <span
                          className="wd-mono text-[10px] font-bold px-2 py-0.5 border"
                          style={{ borderColor: '#DC2626', color: '#DC2626', background: 'rgba(220,38,38,0.06)' }}
                        >
                          Urgent
                        </span>
                      )}
                      {catName && (
                        <span className="wd-mono text-[10px] font-bold px-2 py-0.5 border" style={{ borderColor: t.border, color: t.muted }}>
                          {catName}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <div className="wd-display font-black text-base" style={{ color: t.text }}>
                      {job.title}
                    </div>

                    {/* Description */}
                    {job.description && (
                      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: t.muted }}>
                        {job.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="wd-mono text-xs flex flex-wrap gap-x-4 gap-y-1" style={{ color: t.muted }}>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} style={{ color: t.accent }} />
                        {job.locality}{job.address ? `, ${job.address}` : ''}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} style={{ color: t.accent }} />
                        {job.preferredDate}{job.preferredTime ? ` · ${job.preferredTime}` : ''}
                      </span>
                    </div>

                    {/* Matches your skills badge */}
                    {profile?.categoryName && job.categoryName === profile.categoryName && (
                      <span
                        className="wd-mono text-[10px] font-bold px-2 py-0.5 border inline-block"
                        style={{ borderColor: t.warning, color: t.warning, background: 'rgba(183,121,31,0.08)' }}
                      >
                        ✓ Matches your skills
                      </span>
                    )}
                  </div>

                  {/* Right: payout + actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                    <div className="text-right">
                      <div className="wd-mono text-[10px]" style={{ color: t.muted }}>Payout</div>
                      <div className="wd-display font-black text-xl" style={{ color: t.success }}>
                        ₹{job.workerPayout}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/jobs/${job.requestId}`)}
                        className="wd-mono text-xs font-bold px-3 py-2.5 border cursor-pointer"
                        style={{ borderColor: t.border, color: t.text, background: 'transparent' }}
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        disabled={claimingId === job.requestId}
                        onClick={() => handleClaim(job.requestId)}
                        className="wd-mono wd-btn text-xs font-bold px-4 py-2.5 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                        style={{ background: t.accent, color: t.accentText, border: 'none' }}
                      >
                        {claimingId === job.requestId ? 'Accepting…' : 'Accept'} <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
