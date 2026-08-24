import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import WorkerNavbar from '../Worker/WorkerNavbar';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Layers, 
  Play, 
  CheckSquare, 
  Phone, 
  ArrowRight, 
  Radio, 
  AlertCircle 
} from 'lucide-react';

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { mode, theme: t } = useTheme();

  const [profile, setProfile] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;

  const loadDashboardData = () => {
    Promise.all([
      api.get('/workers/me'),
      api.get('/jobs/worker/available'),
      api.get('/jobs/worker/my-jobs'),
    ])
      .then(([profRes, availRes, myRes]) => {
        setProfile(profRes.data);
        setAvailableJobs(availRes.data || []);
        setMyJobs(myRes.data || []);
      })
      .catch((err) => {
        console.error('Data sync failed', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleJobAction = async (jobId, action) => {
    setActionLoading(jobId);
    try {
      await api.post(`/jobs/${jobId}/${action}`);
      loadDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} job.`);
    } finally {
      setActionLoading(null);
    }
  };

  // In-flight active orders: ACCEPTED or IN_PROGRESS
  const activeTasks = myJobs.filter((j) => j.status === 'ACCEPTED' || j.status === 'IN_PROGRESS');
  const completedJobs = myJobs.filter((j) => j.status === 'COMPLETED');

  return (
    <div
      style={{ background: t.bg, color: t.text }}
      className="min-h-screen flex flex-col font-sans transition-colors duration-150"
    >
      <WorkerNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        
        {/* ─── 1. Header Telemetry & Capacity Strip ─── */}
        <section
          className="border p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
          style={{ background: t.surface, borderColor: t.border }}
        >
          <div>
            <div className="wd-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 mb-1" style={{ color: t.accent }}>
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: t.accent }} />
              OPERATOR TELEMETRY // ACTIVE WORKSTATION
            </div>
            <h1 className="wd-display font-black text-2xl sm:text-3xl uppercase tracking-tight" style={{ color: t.text }}>
              Foreman Console: {user?.fullName || profile?.userName || 'Operator'}
            </h1>
            <p className="text-xs wd-mono mt-1" style={{ color: t.muted }}>
              Assigned Sector: <strong style={{ color: t.text }}>{profile?.locality || 'Pune (Unassigned)'}</strong> • 
              Status: <span style={{ color: profile?.isAvailable ? '#10B981' : '#EF4444' }}>{profile?.isAvailable ? 'STANDBY_READY' : 'PAUSED'}</span>
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="flex flex-wrap items-center gap-3 wd-mono text-xs">
            <div className="border p-3 min-w-[100px] text-center" style={{ borderColor: t.border, background: t.cardHover }}>
              <span className="text-[10px] block" style={{ color: t.muted }}>CAPACITY</span>
              <strong className="text-sm" style={{ color: t.text }}>
                {activeTasks.length} / {profile?.maxCapacity || 3}
              </strong>
            </div>

            <div className="border p-3 min-w-[100px] text-center" style={{ borderColor: t.border, background: t.cardHover }}>
              <span className="text-[10px] block" style={{ color: t.muted }}>RATING</span>
              <strong className="text-sm flex items-center justify-center gap-1" style={{ color: '#F59E0B' }}>
                <Star size={12} className="fill-current" /> {profile?.rating || '0.0'}
              </strong>
            </div>

            <div className="border p-3 min-w-[100px] text-center" style={{ borderColor: t.border, background: t.cardHover }}>
              <span className="text-[10px] block" style={{ color: t.muted }}>CLOSED</span>
              <strong className="text-sm" style={{ color: t.text }}>
                {profile?.completedJobs || completedJobs.length} JOBS
              </strong>
            </div>
          </div>
        </section>

        {/* ─── 2. Discovery Hero Banner (Direct Action) ─── */}
        <section
          onClick={() => navigate('/worker/find-jobs')}
          className="border p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 group shadow-xs select-none"
          style={{
            background: t.surface,
            borderColor: availableJobs.length > 0 ? t.accent : t.border,
          }}
        >
          <div className="space-y-1">
            <span
              className="wd-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border inline-block"
              style={{ borderColor: t.border, color: t.accent, background: t.accentSoft }}
            >
              SECTOR FEED
            </span>
            <h2 className="wd-display font-black text-xl sm:text-2xl uppercase tracking-tight" style={{ color: t.text }}>
              🔥 {availableJobs.length} Work Orders Available Near You
            </h2>
            <p className="text-xs wd-mono" style={{ color: t.muted }}>
              Matching trade skills in {profile?.locality || 'your assigned area'}. Direct claim with guaranteed payout.
            </p>
          </div>

          <button
            type="button"
            className="wd-mono wd-btn text-xs font-bold px-5 py-3 flex items-center gap-2 cursor-pointer whitespace-nowrap"
            style={{
              background: t.accent,
              color: t.accentText,
              border: 'none',
            }}
          >
            INSPECT OPEN JOBS <ArrowRight size={14} />
          </button>
        </section>

        {/* ─── 3. In-Flight Assigned Tasks ─── */}
        <section className="space-y-4">
          <div className="flex justify-between items-baseline border-b pb-3" style={{ borderColor: t.border }}>
            <div className="flex items-center gap-2">
              <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}>01 //</span>
              <h2 className="wd-display font-black text-lg uppercase tracking-tight" style={{ color: t.text }}>
                Active Claimed Tickets ({activeTasks.length})
              </h2>
            </div>
            <span className="wd-mono text-xs" style={{ color: t.muted }}>LIFECYCLE CONTROLS</span>
          </div>

          {activeTasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTasks.map((job) => (
                <div
                  key={job.requestId}
                  className="border p-5 flex flex-col justify-between space-y-4"
                  style={{ background: t.surface, borderColor: t.border }}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className="wd-mono text-[10px] font-bold px-2 py-0.5 border"
                        style={{
                          background: job.status === 'IN_PROGRESS' ? '#FEF3C7' : t.accentSoft,
                          borderColor: job.status === 'IN_PROGRESS' ? '#F59E0B' : t.border,
                          color: job.status === 'IN_PROGRESS' ? '#D97706' : t.accent,
                        }}
                      >
                        [{job.status}]
                      </span>
                      <strong className="wd-mono text-sm font-bold" style={{ color: '#10B981' }}>
                        ₹{job.workerPayout} Payout
                      </strong>
                    </div>

                    <h3 className="wd-display font-black text-base uppercase" style={{ color: t.text }}>
                      {job.title}
                    </h3>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: t.muted }}>
                      {job.description || 'Standard task description.'}
                    </p>

                    <div className="space-y-1.5 wd-mono text-xs mt-4 pt-3 border-t" style={{ borderColor: t.border, color: t.muted }}>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} style={{ color: t.accent }} />
                        <span>{job.locality}, {job.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={13} style={{ color: t.accent }} />
                        <span>{job.preferredDate} ({job.preferredTime || 'Standard Slot'})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={13} style={{ color: t.accent }} />
                        <span>Customer: {job.customerName} ({job.customerPhone})</span>
                      </div>
                    </div>
                  </div>

                  {/* State Machine Transition Triggers */}
                  <div className="pt-2">
                    {job.status === 'ACCEPTED' && (
                      <button
                        type="button"
                        disabled={actionLoading === job.requestId}
                        onClick={() => handleJobAction(job.requestId, 'start')}
                        className="w-full wd-mono wd-btn text-xs font-bold py-2.5 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                        style={{ background: t.accent, color: t.accentText, border: 'none' }}
                      >
                        <Play size={13} /> {actionLoading === job.requestId ? 'STARTING...' : 'START ON-SITE WORK'}
                      </button>
                    )}

                    {job.status === 'IN_PROGRESS' && (
                      <button
                        type="button"
                        disabled={actionLoading === job.requestId}
                        onClick={() => handleJobAction(job.requestId, 'complete')}
                        className="w-full wd-mono wd-btn text-xs font-bold py-2.5 flex items-center justify-center gap-2 cursor-pointer text-white shadow-xs"
                        style={{ background: '#10B981', border: 'none' }}
                      >
                        <CheckSquare size={13} /> {actionLoading === job.requestId ? 'VERIFYING...' : 'MARK TASK COMPLETED'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-8 border text-center wd-mono text-xs"
              style={{ background: t.surface, borderColor: t.border, color: t.muted }}
            >
              No active tasks claimed. Check the sector feed above to accept open jobs.
            </div>
          )}
        </section>

        {/* ─── 4. Archived History / Completed Payouts ─── */}
        <section className="space-y-4">
          <div className="flex justify-between items-baseline border-b pb-3" style={{ borderColor: t.border }}>
            <div className="flex items-center gap-2">
              <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}>02 //</span>
              <h2 className="wd-display font-black text-lg uppercase tracking-tight" style={{ color: t.text }}>
                Closed Work Orders ({completedJobs.length})
              </h2>
            </div>
            <span className="wd-mono text-xs" style={{ color: t.muted }}>PAYOUTS SETTLED</span>
          </div>

          {completedJobs.length > 0 ? (
            <div className="space-y-2">
              {completedJobs.map((job) => (
                <div
                  key={job.requestId}
                  className="p-4 border flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                  style={{ background: t.surface, borderColor: t.border }}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}>#{job.requestId}</span>
                      <strong className="wd-display text-sm uppercase" style={{ color: t.text }}>{job.title}</strong>
                    </div>
                    <div className="wd-mono text-xs mt-1" style={{ color: t.muted }}>
                      Completed on {job.preferredDate} • Sector: {job.locality}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="wd-mono text-xs font-bold" style={{ color: '#10B981' }}>
                      + ₹{job.workerPayout} Paid
                    </span>
                    <span className="wd-mono text-[10px] font-bold px-2 py-0.5 border border-emerald-500 text-emerald-500">
                      RESOLVED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-6 border text-center wd-mono text-xs"
              style={{ background: t.surface, borderColor: t.border, color: t.muted }}
            >
              No closed work orders recorded yet.
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
