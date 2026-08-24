import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import CustomerNavbar from '../Customer/CustomerNavbar';
import WorkerNavbar from '../Worker/WorkerNavbar';
import { ReviewForm } from '../../Component/Reviews';
import { MapPin, Calendar, Phone, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mode, theme: t } = useTheme();

  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [acting, setActing] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(null);

  const token = localStorage.getItem('token');
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role ? payload.role.replace('ROLE_', '') : null;
    } catch {
      localStorage.clear();
    }
  }

  const isWorker = userRole === 'WORKER';
  const isCustomer = userRole === 'CUSTOMER';

  const fetchJob = useCallback(() => {
    api.get(`/jobs/${id}`)
      .then((res) => {
        setJob(res.data);
        if (res.data.status === 'COMPLETED' && res.data.workerId) {
          api.get(`/reviews/worker/${res.data.workerId}`)
            .then((r) => {
              const found = (r.data || []).find((rv) => rv.requestId === res.data.requestId);
              setExistingReview(found || null);
            })
            .catch(() => {});
        }
      })
      .catch(() => setError('Could not locate work order record.'));
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleAction = async (actionPath) => {
    setError('');
    setActing(true);
    try {
      await api.post(`/jobs/${id}/${actionPath}`);
      fetchJob();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update this work order.');
    } finally {
      setActing(false);
    }
  };

  if (!job) {
    return (
      <div style={{ background: t.bg, color: t.muted }} className="min-h-screen flex items-center justify-center wd-mono text-xs">
        {error || 'READING WORK ORDER DATA...'}
      </div>
    );
  }

  const statusColors = {
    OPEN: { border: t.accent, color: t.accent, bg: t.accentSoft },
    ACCEPTED: { border: '#F59E0B', color: '#D97706', bg: mode === 'light' ? '#FEF3C7' : '#451A03' },
    IN_PROGRESS: { border: '#F59E0B', color: '#D97706', bg: mode === 'light' ? '#FEF3C7' : '#451A03' },
    COMPLETED: { border: '#10B981', color: '#10B981', bg: mode === 'light' ? '#DCFCE7' : '#064E3B' },
    CANCELLED: { border: t.border, color: t.muted, bg: t.cardHover },
  };
  const statusStyle = statusColors[job.status] || statusColors.CANCELLED;

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans transition-colors duration-150">
      {isWorker ? <WorkerNavbar /> : <CustomerNavbar />}

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-8 space-y-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="wd-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-70"
          style={{ color: t.muted }}
        >
          <ArrowLeft size={14} /> BACK
        </button>

        <div className="border p-6 sm:p-8" style={{ background: t.surface, borderColor: t.border }}>
          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: t.border }}>
            <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}>
              WORK ORDER #{job.requestId} // {job.categoryName?.toUpperCase()}
            </span>
            <span className="wd-mono text-xs font-bold px-2.5 py-1 border" style={{ borderColor: statusStyle.border, color: statusStyle.color, background: statusStyle.bg }}>
              {job.status}
            </span>
          </div>

          <h1 className="wd-display font-black text-2xl uppercase tracking-tight mt-5" style={{ color: t.text }}>
            {job.title}
          </h1>
          <p className="text-sm leading-relaxed mt-2" style={{ color: t.muted }}>
            {job.description || 'No additional scope of work specified.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-5 border-t wd-mono text-xs" style={{ borderColor: t.border }}>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: t.accent }} />
              <div>
                <div style={{ color: t.muted }}>SERVICE LOCATION</div>
                <div className="font-semibold mt-0.5" style={{ color: t.text }}>{job.locality}, {job.address}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar size={14} className="mt-0.5 shrink-0" style={{ color: t.accent }} />
              <div>
                <div style={{ color: t.muted }}>DISPATCH SCHEDULE</div>
                <div className="font-semibold mt-0.5" style={{ color: t.text }}>{job.preferredDate} {job.preferredTime ? `· ${job.preferredTime}` : ''}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="w-3.5 h-3.5 mt-0.5 shrink-0 flex items-center justify-center font-bold" style={{ color: t.accent }}>₹</span>
              <div>
                <div style={{ color: t.muted }}>{isWorker ? 'WORKER PAYOUT' : 'STANDARD PRICE'}</div>
                <div className="font-bold mt-0.5" style={{ color: t.accent }}>₹{isWorker ? job.workerPayout : job.customerPrice}</div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone size={14} className="mt-0.5 shrink-0" style={{ color: t.accent }} />
              <div>
                <div style={{ color: t.muted }}>{isWorker ? 'POSTED BY' : 'ASSIGNED OPERATOR'}</div>
                <div className="font-semibold mt-0.5" style={{ color: t.text }}>
                  {isWorker
                    ? `${job.customerName} (${job.customerPhone || 'N/A'})`
                    : (job.workerName ? `${job.workerName} (${job.workerPhone || 'N/A'})` : 'Unassigned — awaiting claim')}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-5 p-3 text-xs wd-mono border" style={{
              background: mode === 'light' ? '#FEE2E2' : '#3B1818',
              borderColor: mode === 'light' ? '#F87171' : '#7F2323',
              color: mode === 'light' ? '#B91C1C' : '#FCA5A5',
            }}>
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2.5 mt-6 pt-5 border-t" style={{ borderColor: t.border }}>
            {isWorker && job.status === 'OPEN' && (
              <button type="button" disabled={acting} onClick={() => handleAction('accept')}
                className="wd-mono text-xs font-bold px-6 py-3 cursor-pointer disabled:opacity-50"
                style={{ background: t.accent, color: t.accentText, border: 'none' }}>
                {acting ? 'CLAIMING...' : 'ACCEPT WORK ORDER'}
              </button>
            )}

            {isWorker && job.status === 'ACCEPTED' && (
              <button type="button" disabled={acting} onClick={() => handleAction('start')}
                className="wd-mono text-xs font-bold px-6 py-3 cursor-pointer disabled:opacity-50"
                style={{ background: t.accent, color: t.accentText, border: 'none' }}>
                {acting ? 'UPDATING...' : 'START JOB'}
              </button>
            )}

            {isWorker && job.status === 'IN_PROGRESS' && (
              <button type="button" disabled={acting} onClick={() => handleAction('complete')}
                className="wd-mono text-xs font-bold px-6 py-3 cursor-pointer disabled:opacity-50 text-white"
                style={{ background: '#10B981', border: 'none' }}>
                {acting ? 'CLOSING OUT...' : 'MARK COMPLETED'}
              </button>
            )}

            {job.status !== 'COMPLETED' && job.status !== 'CANCELLED' && (
              <button type="button" disabled={acting} onClick={() => handleAction('cancel')}
                className="wd-mono text-xs font-bold px-5 py-3 border cursor-pointer disabled:opacity-50"
                style={{ borderColor: t.border, color: t.muted, background: 'transparent' }}>
                CANCEL ORDER
              </button>
            )}
          </div>
        </div>

        {isCustomer && job.status === 'COMPLETED' && (
          <div className="space-y-3">
            <h2 className="wd-display font-black text-lg uppercase tracking-tight" style={{ color: t.text }}>
              Rate This Job
            </h2>

            {reviewSubmitted || existingReview ? (
              <div className="border p-5 flex items-center gap-3" style={{ background: t.surface, borderColor: t.border }}>
                <CheckCircle2 size={18} style={{ color: t.success }} />
                <span className="text-xs wd-mono" style={{ color: t.muted }}>
                  You already reviewed this job. Thanks for the feedback.
                </span>
              </div>
            ) : (
              <ReviewForm requestId={job.requestId} onSubmitted={(data) => setReviewSubmitted(data)} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}
