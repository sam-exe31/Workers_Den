import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import CustomerNavbar from '../../pages/Customer/CustomerNavbar';
import { 
  ArrowRight, 
  PlusCircle, 
  Clock, 
  MapPin, 
  Radio, 
  Wrench, 
  ShieldCheck,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

const STATIC_CATEGORIES = [
  { 
    id: 1, 
    catName: 'Plumbing', 
    customerPrice: 499, 
    code: 'TR-01', 
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop&q=80',
    description: 'Line leakages, pipe blockages, taps, flush tanks & sanitary installations.' 
  },
  { 
    id: 2, 
    catName: 'Electrical', 
    customerPrice: 399, 
    code: 'TR-02', 
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80',
    description: 'Breaker issues, fuse replacements, wiring faults, switches & appliance safety.' 
  },
  { 
    id: 3, 
    catName: 'Carpentry', 
    customerPrice: 599, 
    code: 'TR-03', 
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    description: 'Door hinges, lock replacements, furniture repairs & custom fittings.' 
  },
  { 
    id: 4, 
    catName: 'Painting', 
    customerPrice: 799, 
    code: 'TR-04', 
    image: 'https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?w=800&auto=format&fit=crop&q=80',
    description: 'Wall patch repairs, waterproof coatings, trim touches & full surface work.' 
  },
  { 
    id: 5, 
    catName: 'Cleaning', 
    customerPrice: 349, 
    code: 'TR-05', 
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80',
    description: 'Deep kitchen/bathroom sanitation, scrub dusting & disinfection.' 
  },
  { 
    id: 6, 
    catName: 'AC Repair', 
    customerPrice: 449, 
    code: 'TR-06', 
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&auto=format&fit=crop&q=80',
    description: 'Cooling checks, gas level diagnostics, filter cleans & motor fixes.' 
  },
];

const SECTORS = ['All Sectors', 'Kothrud', 'Baner', 'Wakad', 'Viman Nagar', 'Hinjawadi', 'Aundh'];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { mode, theme: t } = useTheme();

  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState('All Sectors');
  const [loading, setLoading] = useState(true);

  const brandAccent = mode === 'dark' ? '#A78BFA' : '#6247AA';
  const brandAccentSoft = mode === 'dark' ? 'rgba(167, 139, 250, 0.15)' : '#EDE9F6';

  let user = null;
  try {
    const rawUser = localStorage.getItem('user');
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }

  const customerName = user?.fullName || user?.user_name || user?.email?.split('@')[0] || 'Customer';
  const customerInitials = customerName.substring(0, 2).toUpperCase();

  useEffect(() => {
    let isMounted = true;

    Promise.allSettled([
      api.get('/Categories'),
      api.get('/jobs/customer/my-jobs'),
    ])
      .then(([catResult, jobsResult]) => {
        if (!isMounted) return;

        if (catResult.status === 'fulfilled' && Array.isArray(catResult.value.data) && catResult.value.data.length > 0) {
          const merged = catResult.value.data.map((cat, idx) => {
            const meta = STATIC_CATEGORIES.find(
              (m) => m.catName.toLowerCase() === (cat.catName || '').toLowerCase()
            ) || STATIC_CATEGORIES[idx % STATIC_CATEGORIES.length];

            return {
              id: cat.id || cat.catId || idx + 1,
              catName: cat.catName || meta.catName,
              customerPrice: cat.customerPrice || meta.customerPrice,
              code: meta.code || `TR-0${idx + 1}`,
              image: meta.image,
              description: cat.description || meta.description,
            };
          });
          setCategories(merged);
        } else {
          setCategories(STATIC_CATEGORIES);
        }

        if (jobsResult.status === 'fulfilled' && Array.isArray(jobsResult.value.data)) {
          setJobs(jobsResult.value.data);
        } else {
          setJobs([]);
        }
      })
      .catch(() => {
        if (isMounted) setCategories(STATIC_CATEGORIES);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredJobs = selectedLocality === 'All Sectors' 
    ? jobs 
    : jobs.filter((j) => (j.locality || '').toLowerCase() === selectedLocality.toLowerCase());

  const activeJob = filteredJobs.find((j) => j?.status === 'ACCEPTED' || j?.status === 'IN_PROGRESS' || j?.status === 'OPEN');
  const recentJobs = filteredJobs.filter((j) => j?.requestId !== activeJob?.requestId);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'OPEN':
        return { bg: brandAccentSoft, border: brandAccent, color: brandAccent };
      case 'ACCEPTED':
      case 'IN_PROGRESS':
        return { bg: mode === 'light' ? '#FEF3C7' : '#451A03', border: '#F59E0B', color: '#D97706' };
      case 'COMPLETED':
        return { bg: mode === 'light' ? '#DCFCE7' : '#064E3B', border: '#10B981', color: '#10B981' };
      default:
        return { bg: t.cardHover, border: t.border, color: t.muted };
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center font-mono text-xs"
        style={{ background: t.bg, color: t.muted }}
      >
        <CustomerNavbar />
        <div className="flex-1 flex items-center justify-center animate-pulse">
          [SYS_INIT] Synchronizing customer dispatch console...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ background: t.bg, color: t.text }}
      className="relative min-h-screen flex flex-col font-sans transition-colors duration-150 overflow-x-hidden select-none"
    >
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${t.border} 1px, transparent 1px),
            linear-gradient(to bottom, ${t.border} 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <CustomerNavbar />

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-8 space-y-10">
        <section
          className="border p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-sm backdrop-blur-xs animate-in fade-in slide-in-from-top-2 duration-300"
          style={{
            background: mode === 'light' ? 'rgba(251, 250, 252, 0.95)' : 'rgba(23, 29, 42, 0.90)',
            borderColor: t.border,
          }}
        >
          <div className="flex items-center gap-4 sm:gap-5">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 border flex items-center justify-center font-black text-lg sm:text-xl tracking-wider shrink-0 shadow-xs"
              style={{
                borderColor: brandAccent,
                background: brandAccentSoft,
                color: brandAccent,
              }}
            >
              {customerInitials}
            </div>

            <div className="space-y-1">
              <div className="wd-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: brandAccent }}>
                <span className="w-2 h-2 rounded-full inline-block animate-ping" style={{ background: brandAccent }} />
                CLIENT CONSOLE // PUNE SECTOR
              </div>
              <h1 className="wd-display font-black text-2xl sm:text-3xl uppercase tracking-tight" style={{ color: t.text }}>
                {customerName}
              </h1>
              <p className="text-xs wd-mono" style={{ color: t.muted }}>
                Account: <strong style={{ color: t.text }}>{user?.email || 'customer@workersden.com'}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2 border px-3 py-2 text-xs wd-mono" style={{ borderColor: t.border, background: t.surface }}>
              <MapPin size={14} style={{ color: brandAccent }} />
              <select
                value={selectedLocality}
                onChange={(e) => setSelectedLocality(e.target.value)}
                className="bg-transparent outline-none cursor-pointer font-bold"
                style={{ color: t.text }}
              >
                {SECTORS.map((sec) => (
                  <option key={sec} value={sec} style={{ background: t.surface, color: t.text }}>
                    {sec}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => navigate('/customer/create-job')}
              className="wd-mono wd-btn text-xs font-bold px-5 py-3 flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: brandAccent,
                border: 'none',
              }}
            >
              <PlusCircle size={15} strokeWidth={2.5} /> BOOK SERVICE
            </button>
          </div>
        </section>

        {activeJob && (
          <section className="space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio size={14} className="animate-pulse text-amber-500" />
                <h2 className="wd-mono text-xs font-bold uppercase tracking-wider" style={{ color: brandAccent }}>
                  ACTIVE DISPATCH IN FLIGHT
                </h2>
              </div>
              <span className="wd-mono text-[10px] uppercase tracking-wider" style={{ color: t.muted }}>
                SECTOR: {activeJob.locality || 'PUNE'}
              </span>
            </div>

            <div
              className="border p-6 transition-all hover:border-current cursor-pointer shadow-sm backdrop-blur-xs group hover:-translate-y-0.5"
              style={{
                background: mode === 'light' ? 'rgba(251, 250, 252, 0.95)' : 'rgba(23, 29, 42, 0.90)',
                borderColor: t.border,
              }}
              onClick={() => navigate(`/jobs/${activeJob.requestId}`)}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b pb-4 mb-4" style={{ borderColor: t.border }}>
                <div>
                  <span className="wd-mono text-[10px] font-bold tracking-widest" style={{ color: brandAccent }}>
                    TICKET #{activeJob.requestId} // {activeJob.categoryName?.toUpperCase() || 'GENERAL'}
                  </span>
                  <h3 className="wd-display font-black text-lg sm:text-xl uppercase tracking-tight mt-0.5" style={{ color: t.text }}>
                    {activeJob.title}
                  </h3>
                </div>

                <span
                  className="wd-mono text-xs font-bold px-3 py-1 border self-start sm:self-auto"
                  style={getStatusBadgeStyle(activeJob.status)}
                >
                  [{activeJob.status}]
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 wd-mono text-xs mb-4" style={{ color: t.muted }}>
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: brandAccent }} />
                  <span>{activeJob.locality || 'Pune'}, {activeJob.address || 'Address on file'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={14} style={{ color: brandAccent }} />
                  <span>Scheduled: {activeJob.preferredDate} ({activeJob.preferredTime || 'Standard Slot'})</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wrench size={14} style={{ color: brandAccent }} />
                  <span>{activeJob.workerName ? `Technician: ${activeJob.workerName}` : 'Awaiting technician claim...'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: t.border }}>
                <span className="wd-mono text-xs font-bold" style={{ color: t.text }}>
                  Standard Fee: ₹{activeJob.customerPrice}
                </span>
                <span className="wd-mono text-xs font-bold flex items-center gap-1.5 group-hover:translate-x-1 transition-transform" style={{ color: brandAccent }}>
                  OPEN WORK ORDER DETAILS <ArrowRight size={13} strokeWidth={2.5} />
                </span>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex justify-between items-baseline border-b pb-3" style={{ borderColor: t.border }}>
            <div className="flex items-center gap-2">
              <span className="wd-mono text-xs font-bold" style={{ color: brandAccent }}>01 //</span>
              <h2 className="wd-display font-black text-xl uppercase tracking-tight" style={{ color: t.text }}>
                Service Catalog
              </h2>
            </div>
            <span className="wd-mono text-xs" style={{ color: t.muted }}>SELECT CARD TO BOOK GUIDED SPEC</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <div
                key={cat.id || cat.catName}
                onClick={() => navigate(`/customer/create-job?catId=${cat.id}&locality=${selectedLocality !== 'All Sectors' ? selectedLocality : 'Kothrud'}`)}
                className="group relative border overflow-hidden cursor-pointer flex flex-col justify-end transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg shadow-sm"
                style={{
                  background: t.surface,
                  borderColor: t.border,
                  minHeight: 250,
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.catName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  style={{
                    filter: mode === 'dark' ? 'brightness(0.60) contrast(1.15)' : 'brightness(0.85) contrast(1.05)',
                  }}
                />

                <div
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: mode === 'dark'
                      ? 'linear-gradient(to top, rgba(15, 18, 25, 0.98) 0%, rgba(15, 18, 25, 0.45) 60%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(28, 21, 40, 0.92) 0%, rgba(28, 21, 40, 0.30) 60%, transparent 100%)',
                  }}
                />

                <div className="relative z-10 p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="wd-mono text-[10px] font-bold tracking-widest uppercase" style={{ color: '#A78BFA' }}>
                      {cat.code}
                    </span>
                    <span className="wd-mono text-[10px] text-white/90 border border-white/30 px-1.5 py-0.5 backdrop-blur-xs">
                      DIRECT DISPATCH
                    </span>
                  </div>

                  <div className="wd-display font-black text-xl text-white uppercase tracking-tight">
                    {cat.catName}
                  </div>

                  <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/20">
                    <span className="wd-mono text-xs font-bold text-white">
                      from ₹{cat.customerPrice}
                    </span>
                    <span className="wd-mono text-xs font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform" style={{ color: '#DDD6FE' }}>
                      GUIDED BOOKING →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-baseline border-b pb-3" style={{ borderColor: t.border }}>
            <div className="flex items-center gap-2">
              <span className="wd-mono text-xs font-bold" style={{ color: brandAccent }}>02 //</span>
              <h2 className="wd-display font-black text-xl uppercase tracking-tight" style={{ color: t.text }}>
                Recent Work Orders
              </h2>
            </div>
            <span className="wd-mono text-xs" style={{ color: t.muted }}>{filteredJobs.length} LOGGED</span>
          </div>

          {recentJobs.length > 0 ? (
            <div className="space-y-2.5">
              {recentJobs.map((job) => (
                <div
                  key={job.requestId}
                  onClick={() => navigate(`/jobs/${job.requestId}`)}
                  className="p-4 border flex flex-col sm:flex-row justify-between sm:items-center gap-3 cursor-pointer hover:border-current transition-all hover:-translate-y-0.5 backdrop-blur-xs"
                  style={{
                    background: mode === 'light' ? 'rgba(251, 250, 252, 0.90)' : 'rgba(23, 29, 42, 0.85)',
                    borderColor: t.border,
                  }}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="wd-mono text-[10px] font-bold" style={{ color: brandAccent }}>
                        #{job.requestId}
                      </span>
                      <span className="wd-display font-bold text-sm" style={{ color: t.text }}>
                        {job.title}
                      </span>
                    </div>
                    <div className="wd-mono text-xs flex items-center gap-3" style={{ color: t.muted }}>
                      <span>{job.preferredDate}</span>
                      <span>•</span>
                      <span>₹{job.customerPrice}</span>
                      <span>•</span>
                      <span>Sector: {job.locality}</span>
                    </div>
                  </div>

                  <span
                    className="wd-mono text-xs font-bold px-2.5 py-1 border self-start sm:self-auto"
                    style={getStatusBadgeStyle(job.status)}
                  >
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-8 border text-center wd-mono text-xs backdrop-blur-xs"
              style={{
                background: mode === 'light' ? 'rgba(251, 250, 252, 0.8)' : 'rgba(23, 29, 42, 0.8)',
                borderColor: t.border,
                color: t.muted,
              }}
            >
              No archived service tickets in {selectedLocality}. Select a service category above to book your first request.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
