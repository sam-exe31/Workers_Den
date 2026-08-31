import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../Theme/ThemeContext';
import api from '../../../api/axiosClient';
import WorkerNavbar from './WorkerNavbar';
import { TrendingUp, CheckCircle2, IndianRupee } from 'lucide-react';

// Returns true if the given date string is in the current calendar month.
function isThisMonth(dateStr) {
  if (!dateStr) return false;
  try {
    const d = new Date(dateStr);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  } catch {
    return false;
  }
}

export default function WorkerEarningsPage() {
  const navigate = useNavigate();
  const { theme: t } = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/jobs/worker/my-jobs')
      .then(res => setJobs(res.data || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const completedJobs = jobs.filter(j => j.status === 'COMPLETED');

  const totalEarnings = completedJobs.reduce((sum, j) => sum + (j.workerPayout || 0), 0);
  const monthlyJobs = completedJobs.filter(j => isThisMonth(j.preferredDate));
  const monthlyEarnings = monthlyJobs.reduce((sum, j) => sum + (j.workerPayout || 0), 0);

  const now = new Date();
  const monthName = now.toLocaleString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans">
      <WorkerNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">

        {/* Header */}
        <div className="border-b pb-4" style={{ borderColor: t.border }}>
          <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
            Earnings
          </h1>
          <p className="text-sm mt-1" style={{ color: t.muted }}>
            A record of your completed work and payouts.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center wd-mono text-xs animate-pulse" style={{ color: t.muted }}>
            Loading your earnings…
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  label: `This month (${monthName})`,
                  value: `₹${monthlyEarnings.toLocaleString('en-IN')}`,
                  sub: `${monthlyJobs.length} job${monthlyJobs.length !== 1 ? 's' : ''} completed`,
                  icon: <TrendingUp size={18} />,
                  color: t.warning,
                },
                {
                  label: 'Total earnings',
                  value: `₹${totalEarnings.toLocaleString('en-IN')}`,
                  sub: `${completedJobs.length} job${completedJobs.length !== 1 ? 's' : ''} total`,
                  icon: <IndianRupee size={18} />,
                  color: t.success,
                },
                {
                  label: 'Average per job',
                  value: completedJobs.length > 0
                    ? `₹${Math.round(totalEarnings / completedJobs.length).toLocaleString('en-IN')}`
                    : '—',
                  sub: 'Based on completed work',
                  icon: <CheckCircle2 size={18} />,
                  color: t.accent,
                },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="border p-5"
                  style={{ background: t.surface, borderColor: t.border }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="wd-mono text-[11px] uppercase tracking-wider" style={{ color: t.muted }}>
                      {stat.label}
                    </span>
                    <span style={{ color: stat.color }}>{stat.icon}</span>
                  </div>
                  <div className="wd-display font-black text-2xl" style={{ color: t.text }}>
                    {stat.value}
                  </div>
                  <div className="wd-mono text-[11px] mt-1" style={{ color: t.muted }}>{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Payment history */}
            <div className="space-y-3">
              <div className="flex items-baseline justify-between border-b pb-3" style={{ borderColor: t.border }}>
                <h2 className="wd-display font-black text-base tracking-tight" style={{ color: t.text }}>
                  Payment history
                </h2>
                <span className="wd-mono text-xs" style={{ color: t.muted }}>
                  {completedJobs.length} records
                </span>
              </div>

              {completedJobs.length === 0 ? (
                <div
                  className="py-14 text-center border"
                  style={{ background: t.surface, borderColor: t.border }}
                >
                  <IndianRupee size={28} className="mx-auto mb-3" style={{ color: t.faint }} />
                  <div className="wd-mono text-xs" style={{ color: t.muted }}>
                    No completed jobs yet. Your earnings will appear here.
                  </div>
                </div>
              ) : (
                <div className="border" style={{ borderColor: t.border }}>
                  {/* Table header */}
                  <div
                    className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-2.5 wd-mono text-[10px] uppercase tracking-wider border-b"
                    style={{ borderColor: t.border, background: t.cardHover, color: t.muted }}
                  >
                    <span>Job</span>
                    <span className="hidden sm:block">Date</span>
                    <span>Amount</span>
                  </div>

                  {/* Rows */}
                  {[...completedJobs].reverse().map((job, idx) => (
                    <div
                      key={job.requestId || idx}
                      onClick={() => navigate(`/jobs/${job.requestId}`)}
                      className="grid grid-cols-[1fr_auto_auto] gap-4 px-5 py-4 border-b last:border-b-0 items-center cursor-pointer hover:opacity-85 transition-opacity"
                      style={{ borderColor: t.border, background: idx % 2 === 0 ? t.surface : t.cardHover }}
                    >
                      <div>
                        <div className="font-semibold text-sm" style={{ color: t.text }}>{job.title}</div>
                        <div className="wd-mono text-[11px] mt-0.5" style={{ color: t.muted }}>
                          {job.locality}
                        </div>
                      </div>
                      <div className="hidden sm:block wd-mono text-xs text-right" style={{ color: t.muted }}>
                        {job.preferredDate || '—'}
                      </div>
                      <div className="wd-mono font-bold text-sm text-right flex items-center justify-end gap-2" style={{ color: t.success }}>
                        +₹{(job.workerPayout || 0).toLocaleString('en-IN')}
                        <span className="wd-mono text-[10px] font-normal" style={{ color: t.accent }}>View →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

