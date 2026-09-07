import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import WorkerNavbar from './WorkerNavbar';
import { MapPin, Clock, Phone, Play, CheckSquare, Briefcase } from 'lucide-react';

const TABS = ['Upcoming', 'Active', 'Completed'];

export default function WorkerMyJobsPage() {
  const navigate = useNavigate();
  const { theme: t } = useTheme();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active');
  const [actionLoading, setActionLoading] = useState(null);

  const loadJobs = () => {
    api
      .get('/jobs/worker/my-jobs')
      .then(res => setJobs(res.data || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadJobs(); }, []);

  const handleAction = async (jobId, action) => {
    setActionLoading(jobId);
    try {
      await api.post(`/jobs/${jobId}/${action}`);
      loadJobs();
    } catch (err) {
      alert(err.response?.data?.message || `Could not ${action} job.`);
    } finally {
      setActionLoading(null);
    }
  };

  const upcomingJobs = jobs.filter(j => j.status === 'ACCEPTED');
  const activeJobs = jobs.filter(j => j.status === 'IN_PROGRESS');
  const completedJobs = jobs.filter(j => j.status === 'COMPLETED');

  const tabMap = { Upcoming: upcomingJobs, Active: activeJobs, Completed: completedJobs };
  const displayed = tabMap[activeTab] || [];

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans">
      <WorkerNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">

        {/* Header */}
        <div className="border-b pb-4" style={{ borderColor: t.border }}>
          <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
            My Jobs
          </h1>
          <p className="text-sm mt-1" style={{ color: t.muted }}>
            Track all your work — accepted, in progress, and completed.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border" style={{ borderColor: t.border }}>
          {TABS.map(tab => {
            const count = (tabMap[tab] || []).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className="flex-1 flex items-center justify-center gap-2 py-3 wd-mono text-xs font-bold cursor-pointer transition-colors border-r last:border-r-0"
                style={{
                  borderColor: t.border,
                  background: isActive ? t.accent : 'transparent',
                  color: isActive ? t.accentText : t.muted,
                }}
              >
                {tab}
                {count > 0 && (
                  <span
                    className="px-1.5 py-0.5 text-[10px] font-bold"
                    style={{
                      background: isActive ? 'rgba(255,255,255,0.25)' : t.accentSoft,
                      color: isActive ? t.accentText : t.accent,
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-16 text-center wd-mono text-xs animate-pulse" style={{ color: t.muted }}>
            Loading your jobs…
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center border" style={{ borderColor: t.border, background: t.surface }}>
            <Briefcase size={28} className="mx-auto mb-3" style={{ color: t.faint }} />
            <div className="wd-mono text-xs" style={{ color: t.muted }}>
              No {activeTab.toLowerCase()} jobs right now.
            </div>
            {activeTab === 'Upcoming' && (
              <button
                type="button"
                onClick={() => navigate('/worker/find-jobs')}
                className="mt-4 wd-mono text-xs font-bold px-5 py-2.5 border cursor-pointer"
                style={{ borderColor: t.accent, color: t.accent }}
              >
                Browse available work →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(job => (
              <div
                key={job.requestId}
                className="border p-5 space-y-4"
                style={{ background: t.surface, borderColor: t.border }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Status badge */}
                    <span
                      className="wd-mono text-[10px] font-bold px-2 py-0.5 border inline-block mb-2"
                      style={{
                        background:
                          job.status === 'IN_PROGRESS' ? 'rgba(183,121,31,0.10)' :
                            job.status === 'COMPLETED' ? 'rgba(47,125,79,0.08)' :
                              t.accentSoft,
                        borderColor:
                          job.status === 'IN_PROGRESS' ? t.warning :
                            job.status === 'COMPLETED' ? t.success :
                              t.accent,
                        color:
                          job.status === 'IN_PROGRESS' ? t.warning :
                            job.status === 'COMPLETED' ? t.success :
                              t.accent,
                      }}
                    >
                      {job.status === 'ACCEPTED' ? 'Accepted — starting soon' :
                        job.status === 'IN_PROGRESS' ? 'In progress' :
                          job.status === 'COMPLETED' ? 'Completed' : job.status}
                    </span>

                    <h3 className="wd-display font-black text-base" style={{ color: t.text }}>
                      {job.title}
                    </h3>

                    <div className="wd-mono text-xs flex flex-wrap gap-x-4 gap-y-1 mt-2" style={{ color: t.muted }}>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={11} style={{ color: t.accent }} /> {job.locality}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={11} style={{ color: t.accent }} /> {job.preferredDate}
                        {job.preferredTime ? ` · ${job.preferredTime}` : ''}
                      </span>
                      {job.customerPhone && (
                        <span className="flex items-center gap-1.5">
                          <Phone size={11} style={{ color: t.accent }} /> {job.customerName}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="wd-mono text-[10px]" style={{ color: t.muted }}>Payout</div>
                    <div className="wd-display font-black text-lg" style={{ color: t.success }}>
                      ₹{job.workerPayout}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => navigate(`/jobs/${job.requestId}`)}
                    className="wd-mono text-xs font-bold px-4 py-2 border cursor-pointer"
                    style={{ borderColor: t.border, color: t.text }}
                  >
                    View details
                  </button>

                  {job.status === 'ACCEPTED' && (
                    <button
                      type="button"
                      disabled={actionLoading === job.requestId}
                      onClick={() => handleAction(job.requestId, 'start')}
                      className="wd-mono text-xs font-bold px-4 py-2 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                      style={{ background: t.warning, color: '#fff', border: 'none' }}
                    >
                      <Play size={12} />
                      {actionLoading === job.requestId ? 'Starting…' : 'Start work'}
                    </button>
                  )}

                  {job.status === 'IN_PROGRESS' && (
                    <button
                      type="button"
                      disabled={actionLoading === job.requestId}
                      onClick={() => handleAction(job.requestId, 'complete')}
                      className="wd-mono text-xs font-bold px-4 py-2 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                      style={{ background: t.success, color: '#fff', border: 'none' }}
                    >
                      <CheckSquare size={12} />
                      {actionLoading === job.requestId ? 'Completing…' : 'Mark complete'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
