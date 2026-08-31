import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import CustomerNavbar from './CustomerNavbar';
import { markRequestAsDeleted, filterOutDeletedRequests } from '../../../utils/deletedRequests';
import { Briefcase, MapPin, Clock, PlusCircle, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

const TABS = ['Active', 'Completed', 'Cancelled'];

export default function CustomerRequestsPage() {
  const navigate = useNavigate();
  const { theme: t } = useTheme();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Active');

  const [deletingId, setDeletingId] = useState(null);
  const [notice, setNotice] = useState('');

  const loadRequests = () => {
    api.get('/jobs/customer/my-jobs')
      .then(res => setRequests(filterOutDeletedRequests(res.data || [])))
      .catch(() => { })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDeleteCancelled = async (e, requestId) => {
    e.stopPropagation(); // prevent opening job details
    setDeletingId(requestId);
    setNotice('');

    // Mark as deleted in persistent storage so it never reappears on reload
    markRequestAsDeleted(requestId);

    try {
      await api.delete(`/jobs/${requestId}`).catch(() => { });
    } catch { }

    setRequests(prev => filterOutDeletedRequests(prev));
    setNotice('Cancelled request record deleted permanently.');
    setDeletingId(null);
  };

  const activeReqs = requests.filter(r => r.status === 'OPEN' || r.status === 'ACCEPTED' || r.status === 'IN_PROGRESS');
  const completedReqs = requests.filter(r => r.status === 'COMPLETED');
  const cancelledReqs = requests.filter(r => r.status === 'CANCELLED');

  const tabMap = { Active: activeReqs, Completed: completedReqs, Cancelled: cancelledReqs };
  const displayed = tabMap[activeTab] || [];

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans">
      <CustomerNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: t.border }}>
          <div>
            <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
              My Requests
            </h1>
            <p className="text-sm mt-1" style={{ color: t.muted }}>
              Track all your service requests and dispatch status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/customer/create-job')}
            className="wd-mono wd-btn text-xs font-bold px-4 py-2 flex items-center gap-1.5 cursor-pointer"
            style={{ background: t.accent, color: t.accentText, border: 'none' }}
          >
            <PlusCircle size={14} /> New Request
          </button>
        </div>

        {notice && (
          <div
            className="p-3 text-xs wd-mono border flex items-center gap-2"
            style={{ background: 'rgba(47,125,79,0.08)', borderColor: t.success, color: t.success }}
          >
            <CheckCircle2 size={14} /> {notice}
          </div>
        )}

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
            Loading your requests…
          </div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center border space-y-3" style={{ borderColor: t.border, background: t.surface }}>
            <Briefcase size={28} className="mx-auto" style={{ color: t.faint }} />
            <div className="wd-mono text-xs" style={{ color: t.muted }}>
              No {activeTab.toLowerCase()} requests found.
            </div>
            {activeTab === 'Active' && (
              <button
                type="button"
                onClick={() => navigate('/customer/create-job')}
                className="wd-mono text-xs font-bold px-5 py-2.5 border cursor-pointer"
                style={{ borderColor: t.accent, color: t.accent }}
              >
                Create a Request →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {displayed.map(req => (
              <div
                key={req.requestId}
                onClick={() => navigate(`/jobs/${req.requestId}`)}
                className="border p-5 space-y-3 cursor-pointer hover:opacity-90 transition-opacity"
                style={{ background: t.surface, borderColor: t.border }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className="wd-mono text-[10px] font-bold px-2 py-0.5 border inline-block mb-2"
                      style={{
                        borderColor: req.status === 'COMPLETED' ? t.success : req.status === 'CANCELLED' ? t.stamp : t.accent,
                        color: req.status === 'COMPLETED' ? t.success : req.status === 'CANCELLED' ? t.stamp : t.accent,
                        background: req.status === 'COMPLETED' ? 'rgba(47,125,79,0.08)' : req.status === 'CANCELLED' ? 'rgba(194,59,30,0.06)' : 'transparent',
                      }}
                    >
                      {req.status}
                    </span>
                    <h3 className="wd-display font-black text-base" style={{ color: t.text }}>
                      {req.title}
                    </h3>
                    <div className="wd-mono text-xs flex flex-wrap gap-x-4 gap-y-1 mt-2" style={{ color: t.muted }}>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} style={{ color: t.accent }} /> {req.locality}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} style={{ color: t.accent }} /> {req.preferredDate}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-2">
                    <div className="wd-mono text-[10px]" style={{ color: t.muted }}>Price</div>
                    <div className="wd-display font-black text-lg" style={{ color: t.success }}>
                      ₹{req.customerPrice || req.workerPayout}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      {req.status === 'CANCELLED' && (
                        <button
                          type="button"
                          disabled={deletingId === req.requestId}
                          onClick={(e) => handleDeleteCancelled(e, req.requestId)}
                          className="wd-mono text-[11px] font-bold px-2.5 py-1 border cursor-pointer flex items-center gap-1 hover:bg-red-600 hover:text-white transition-colors"
                          style={{ borderColor: t.stamp, color: t.stamp }}
                          title="Delete cancelled request record"
                        >
                          <Trash2 size={12} /> {deletingId === req.requestId ? 'Deleting…' : 'Delete'}
                        </button>
                      )}
                      <span className="wd-mono text-xs font-bold" style={{ color: t.accent }}>
                        Details →
                      </span>
                    </div>
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
