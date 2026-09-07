import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import getMediaUrl from '../../../utils/mediaUrl';
import CustomerNavbar from '../Customer/CustomerNavbar';
import WorkerNavbar from '../Worker/WorkerNavbar';
import { ReviewForm, StarRating } from '../../Component/Reviews';
import { markRequestAsDeleted } from '../../../utils/deletedRequests';
import { MapPin, Calendar, Phone, ArrowLeft, CheckCircle2, Star, ShieldCheck, IndianRupee, Trash2, X } from 'lucide-react';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mode, theme: t } = useTheme();

  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [acting, setActing] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  const [reviewSubmitted, setReviewSubmitted] = useState(null);
  const [zoomPhoto, setZoomPhoto] = useState(null);

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const userRole = user?.role ? user.role.replace('ROLE_', '') : null;

  const isWorker = userRole === 'WORKER';
  const isCustomer = userRole === 'CUSTOMER';

  const fetchJob = useCallback(() => {
    api.get(`/jobs/${id}`)
      .then((res) => {
        const jData = res.data;
        setJob(jData);

        if (jData.status === 'COMPLETED' && jData.workerId) {
          api.get(`/reviews/worker/${jData.workerId}`)
            .then((r) => {
              const reqId = jData.requestId || Number(id);
              const found = (r.data || []).find((rv) => (rv.requestId || rv.request_id) === reqId);
              setExistingReview(found || null);
            })
            .catch(() => { });
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
      <div style={{ background: t.bg, color: t.muted }} className="min-h-screen flex flex-col font-sans">
        {isWorker ? <WorkerNavbar /> : <CustomerNavbar />}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="wd-mono text-xs text-center space-y-3">
            {error ? (
              <div className="p-4 border" style={{ borderColor: t.stamp, color: t.stamp, background: 'rgba(194,59,30,0.06)' }}>
                {error}
              </div>
            ) : (
              <div className="animate-pulse" style={{ color: t.muted }}>
                READING WORK ORDER DATA...
              </div>
            )}
            <div>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="wd-mono text-xs font-bold px-4 py-2 border cursor-pointer mt-4"
                style={{ borderColor: t.border, color: t.text }}
              >
                ← Return
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const categoryName = job.categoryName || job.catName || job.cat_name || 'SERVICE';

  const statusColors = {
    OPEN: { border: t.accent, color: t.accent, bg: t.accentSoft },
    ACCEPTED: { border: '#F59E0B', color: '#D97706', bg: mode === 'light' ? '#FEF3C7' : '#451A03' },
    IN_PROGRESS: { border: '#F59E0B', color: '#D97706', bg: mode === 'light' ? '#FEF3C7' : '#451A03' },
    COMPLETED: { border: '#10B981', color: '#10B981', bg: mode === 'light' ? '#DCFCE7' : '#064E3B' },
    CANCELLED: { border: t.border, color: t.muted, bg: t.cardHover },
  };
  const statusStyle = statusColors[job.status] || statusColors.CANCELLED;

  const reviewToShow = reviewSubmitted || existingReview;

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans transition-colors duration-150">
      {isWorker ? <WorkerNavbar /> : <CustomerNavbar />}

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="wd-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-70"
          style={{ color: t.muted }}
        >
          <ArrowLeft size={14} /> BACK
        </button>

        {/* Main Work Order Card */}
        <div className="border p-6 sm:p-8 space-y-6" style={{ background: t.surface, borderColor: t.border }}>
          <div className="flex items-center justify-between border-b pb-4 flex-wrap gap-2" style={{ borderColor: t.border }}>
            <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}>
              WORK ORDER #{job.requestId || id} // {categoryName.toUpperCase()}
            </span>
            <span className="wd-mono text-xs font-bold px-2.5 py-1 border" style={{ borderColor: statusStyle.border, color: statusStyle.color, background: statusStyle.bg }}>
              {job.status}
            </span>
          </div>

          <div>
            <h1 className="wd-display font-black text-2xl uppercase tracking-tight" style={{ color: t.text }}>
              {job.title}
            </h1>
            <p className="text-sm leading-relaxed mt-2" style={{ color: t.muted }}>
              {job.description || 'No additional scope of work specified.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t wd-mono text-xs" style={{ borderColor: t.border }}>
            <div className="flex items-start gap-2.5">
              <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: t.accent }} />
              <div>
                <div style={{ color: t.muted }}>SERVICE LOCATION</div>
                <div className="font-semibold mt-0.5" style={{ color: t.text }}>
                  {job.locality}{job.address ? `, ${job.address}` : ''}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar size={14} className="mt-0.5 shrink-0" style={{ color: t.accent }} />
              <div>
                <div style={{ color: t.muted }}>DISPATCH SCHEDULE</div>
                <div className="font-semibold mt-0.5" style={{ color: t.text }}>
                  {job.preferredDate || 'Scheduled'} {job.preferredTime ? `· ${job.preferredTime}` : ''}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <IndianRupee size={14} className="mt-0.5 shrink-0" style={{ color: t.success }} />
              <div>
                <div style={{ color: t.muted }}>{isWorker ? 'GUARANTEED PAYOUT' : 'STANDARD PRICE'}</div>
                <div className="font-bold text-sm mt-0.5" style={{ color: t.success }}>
                  ₹{isWorker ? (job.workerPayout || job.customerPrice) : (job.customerPrice || job.workerPayout)}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              {!isWorker && job.workerProfileImage ? (
                <img
                  src={getMediaUrl(job.workerProfileImage)}
                  alt={job.workerName || 'Worker'}
                  className="w-8 h-8 rounded-full object-cover border shrink-0 mt-0.5"
                  style={{ borderColor: t.border }}
                />
              ) : (
                <Phone size={14} className="mt-0.5 shrink-0" style={{ color: t.accent }} />
              )}
              <div>
                <div style={{ color: t.muted }}>{isWorker ? 'CUSTOMER' : 'ASSIGNED WORKER'}</div>
                <div className="font-semibold mt-0.5" style={{ color: t.text }}>
                  {isWorker
                    ? `${job.customerName || 'Customer'} ${job.customerPhone ? `(${job.customerPhone})` : ''}`
                    : (job.workerName ? `${job.workerName} ${job.workerPhone ? `(${job.workerPhone})` : ''}` : 'Awaiting assignment')}
                </div>
              </div>
            </div>
          </div>

          {/* Attached Issue Photos directly from API */}
          {((job.photos && job.photos.length > 0) || (job.imageUrls && job.imageUrls.length > 0)) && (
            <div className="pt-4 border-t space-y-2.5" style={{ borderColor: t.border }}>
              <div className="wd-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accent }}>
                Attached Issue Photos ({(job.photos || job.imageUrls).length})
              </div>
              <div className="flex flex-wrap gap-2.5">
                {(job.photos || job.imageUrls).map((imgSrc, idx) => (
                  <div
                    key={idx}
                    onClick={() => setZoomPhoto(getMediaUrl(imgSrc))}
                    className="w-24 h-24 border overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group"
                    style={{ borderColor: t.border }}
                  >
                    <img src={getMediaUrl(imgSrc)} alt={`Attachment ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white wd-mono text-[10px] font-bold transition-opacity">
                      Zoom 🔍
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 text-xs wd-mono border" style={{
              background: 'rgba(194,59,30,0.06)',
              borderColor: t.stamp,
              color: t.stamp,
            }}>
              {error}
            </div>
          )}

          {/* Action Triggers */}
          {job.status !== 'COMPLETED' && job.status !== 'CANCELLED' && (
            <div className="flex flex-wrap gap-2.5 pt-5 border-t" style={{ borderColor: t.border }}>
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
                  style={{ background: t.warning, color: '#fff', border: 'none' }}>
                  {acting ? 'UPDATING...' : 'START JOB'}
                </button>
              )}

              {isWorker && job.status === 'IN_PROGRESS' && (
                <button type="button" disabled={acting} onClick={() => handleAction('complete')}
                  className="wd-mono text-xs font-bold px-6 py-3 cursor-pointer disabled:opacity-50 text-white"
                  style={{ background: t.success, border: 'none' }}>
                  {acting ? 'CLOSING OUT...' : 'MARK COMPLETED'}
                </button>
              )}

              <button type="button" disabled={acting} onClick={() => handleAction('cancel')}
                className="wd-mono text-xs font-bold px-5 py-3 border cursor-pointer disabled:opacity-50"
                style={{ borderColor: t.border, color: t.muted, background: 'transparent' }}>
                CANCEL ORDER
              </button>
            </div>
          )}
        </div>

        {/* Completed Job Summary Banner */}
        {job.status === 'COMPLETED' && (
          <div
            className="border p-6 space-y-4"
            style={{ background: 'rgba(47,125,79,0.06)', borderColor: t.success }}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 size={22} style={{ color: t.success }} />
              <div>
                <div className="font-bold text-base" style={{ color: t.text }}>
                  Work Order Completed & Settled
                </div>
                <div className="wd-mono text-xs mt-0.5" style={{ color: t.muted }}>
                  {isWorker
                    ? `Payout of ₹${job.workerPayout || job.customerPrice} recorded in your earnings.`
                    : `Service completed by ${job.workerName || 'assigned worker'}.`}
                </div>
              </div>
            </div>

            {/* Customer Review Section */}
            {reviewToShow ? (
              <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: t.border }}>
                <div className="wd-mono text-xs font-bold uppercase tracking-wider" style={{ color: t.accent }}>
                  Customer Review
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={reviewToShow.rating || 5} size={15} />
                  <span className="wd-mono text-xs font-bold" style={{ color: t.text }}>
                    {reviewToShow.rating}.0 / 5.0
                  </span>
                </div>
                {reviewToShow.reviewText && (
                  <p className="text-xs leading-relaxed italic p-3 border" style={{ background: t.surface, borderColor: t.border, color: t.text }}>
                    "{reviewToShow.reviewText}"
                  </p>
                )}
              </div>
            ) : isCustomer ? (
              <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: t.border }}>
                <div className="wd-mono text-xs font-bold uppercase tracking-wider" style={{ color: t.accent }}>
                  Leave Feedback
                </div>
                <ReviewForm requestId={job.requestId || id} onSubmitted={(data) => setReviewSubmitted(data)} />
              </div>
            ) : null}
          </div>
        )}
        {/* Cancelled Job Summary & Record Deletion */}
        {job.status === 'CANCELLED' && (
          <div
            className="border p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: 'rgba(194,59,30,0.04)', borderColor: t.stamp }}
          >
            <div>
              <div className="font-bold text-sm" style={{ color: t.text }}>
                Request Cancelled
              </div>
              <div className="wd-mono text-xs mt-0.5" style={{ color: t.muted }}>
                This work order was cancelled. You can permanently delete this record.
              </div>
            </div>

            <button
              type="button"
              disabled={acting}
              onClick={async () => {
                setActing(true);
                const reqId = job.requestId || id;
                markRequestAsDeleted(reqId);
                try {
                  await api.delete(`/jobs/${reqId}`).catch(() => { });
                } catch { }
                navigate('/customer/requests', { replace: true });
              }}
              className="wd-mono text-xs font-bold px-4 py-2.5 border cursor-pointer shrink-0 flex items-center gap-1.5 hover:bg-red-600 hover:text-white transition-colors"
              style={{ borderColor: t.stamp, color: t.stamp }}
            >
              <Trash2 size={13} /> {acting ? 'Deleting…' : 'Delete Request Record'}
            </button>
          </div>
        )}
      </main>

      {/* Fullscreen Photo Lightbox Zoom Modal */}
      {zoomPhoto && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-200 animate-in fade-in"
          onClick={() => setZoomPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center bg-zinc-900 border border-zinc-700 p-3 shadow-2xl rounded-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between px-3 py-2 border-b border-zinc-800 mb-2">
              <span className="wd-mono text-xs font-bold text-zinc-300">
                📷 Attached Issue Photo Zoom
              </span>
              <button
                type="button"
                onClick={() => setZoomPhoto(null)}
                className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-full transition-colors cursor-pointer"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="w-full flex items-center justify-center overflow-auto max-h-[75vh]">
              <img
                src={zoomPhoto}
                alt="Enlarged Attachment"
                className="max-w-full max-h-[75vh] object-contain rounded shadow-lg transition-transform hover:scale-[1.02]"
              />
            </div>
            <div className="mt-3 text-center wd-mono text-[11px] text-zinc-400 flex items-center gap-2">
              <span>Click anywhere outside or press ✕ to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
