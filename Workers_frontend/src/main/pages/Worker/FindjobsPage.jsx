import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import WorkerNavbar from './WorkerNavbar';
import { MapPin, Clock, ArrowRight, AlertCircle, Compass } from 'lucide-react';

export default function FindJobsPage() {
  const navigate = useNavigate();
  const { mode, theme: t } = useTheme();

  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [error, setError] = useState('');

  const loadData = () => {
    Promise.all([
      api.get('/workers/me'),
      api.get('/jobs/worker/available'),
    ])
      .then(([resProf, resJobs]) => {
        setProfile(resProf.data);
        setJobs(resJobs.data || []);
      })
      .catch(() => setError('Could not load the open work order queue.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClaim = async (jobId) => {
    setError('');
    setClaimingId(jobId);
    try {
      await api.post(`/jobs/${jobId}/accept`);
      navigate(`/jobs/${jobId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'This job was just claimed by another worker.');
      loadData();
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans transition-colors duration-150">
      <WorkerNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 border-b pb-4" style={{ borderColor: t.border }}>
          <div>
            <div className="wd-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accent }}>
              SECTOR FEED // MATCHED OPEN QUEUE
            </div>
            <h1 className="wd-display font-black text-2xl uppercase tracking-tight mt-0.5" style={{ color: t.text }}>
              Available Work Orders
            </h1>
          </div>
          <div className="wd-mono text-xs" style={{ color: t.muted }}>
            FILTERED BY <strong style={{ color: t.text }}>{profile?.locality?.toUpperCase() || 'PUNE'}</strong> · {jobs.length} OPEN
          </div>
        </div>

        {error && (
          <div className="p-3 text-xs wd-mono border flex items-start gap-2" style={{
            background: mode === 'light' ? '#FEE2E2' : '#3B1818',
            borderColor: mode === 'light' ? '#F87171' : '#7F2323',
            color: mode === 'light' ? '#B91C1C' : '#FCA5A5',
          }}>
            <AlertCircle size={14} className="shrink-0 mt-0.5" /> <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center wd-mono text-xs animate-pulse" style={{ color: t.muted }}>
            QUERYING DISPATCH QUEUE...
          </div>
        ) : jobs.length === 0 ? (
          <div className="border p-12 text-center space-y-3" style={{ background: t.surface, borderColor: t.border }}>
            <div className="w-12 h-12 mx-auto flex items-center justify-center border" style={{ borderColor: t.border, background: t.accentSoft, color: t.accent }}>
              <Compass size={20} />
            </div>
            <div className="wd-display font-black text-lg uppercase" style={{ color: t.text }}>
              No open jobs in your sector right now
            </div>
            <p className="text-xs max-w-md mx-auto leading-relaxed" style={{ color: t.muted }}>
              New work orders matching your trade skills and locality appear here automatically as customers post them.
            </p>
            <button
              type="button"
              onClick={() => navigate('/worker/dashboard')}
              className="wd-mono text-xs font-bold px-5 py-2.5 border cursor-pointer"
              style={{ borderColor: t.border, color: t.text }}
            >
              ← RETURN TO DASHBOARD
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.requestId}
                className="border p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                style={{ background: t.surface, borderColor: t.border }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="wd-mono text-[10px] font-bold" style={{ color: t.accent }}>
                      #{job.requestId} // {job.categoryName?.toUpperCase()}
                    </span>
                    <span
                      className="wd-mono text-[10px] font-bold px-1.5 py-0.5 border"
                      style={{
                        background: job.urgency === 'HIGH' ? (mode === 'light' ? '#FEE2E2' : '#451A1A') : t.accentSoft,
                        borderColor: job.urgency === 'HIGH' ? '#DC2626' : t.border,
                        color: job.urgency === 'HIGH' ? '#DC2626' : t.accent,
                      }}
                    >
                      {job.urgency}
                    </span>
                  </div>

                  <div className="wd-display font-black text-base uppercase" style={{ color: t.text }}>
                    {job.title}
                  </div>
                  <p className="text-xs mt-1 leading-relaxed line-clamp-2" style={{ color: t.muted }}>
                    {job.description || 'No additional scope of work provided.'}
                  </p>

                  <div className="wd-mono text-xs flex flex-wrap items-center gap-x-4 gap-y-1 mt-3" style={{ color: t.muted }}>
                    <span className="flex items-center gap-1.5"><MapPin size={12} style={{ color: t.accent }} /> {job.locality}, {job.address}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} style={{ color: t.accent }} /> {job.preferredDate} ({job.preferredTime || 'Anytime'})</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                  <div className="text-right">
                    <div className="wd-mono text-[10px]" style={{ color: t.muted }}>GUARANTEED PAYOUT</div>
                    <div className="wd-display font-black text-xl" style={{ color: t.accent }}>₹{job.workerPayout}</div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/jobs/${job.requestId}`)}
                      className="wd-mono text-xs font-bold px-3 py-2 border cursor-pointer"
                      style={{ borderColor: t.border, color: t.text }}
                    >
                      INSPECT
                    </button>
                    <button
                      type="button"
                      disabled={claimingId === job.requestId}
                      onClick={() => handleClaim(job.requestId)}
                      className="wd-mono text-xs font-bold px-4 py-2 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      style={{ background: t.accent, color: t.accentText, border: 'none' }}
                    >
                      {claimingId === job.requestId ? 'CLAIMING...' : 'ACCEPT'} <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
