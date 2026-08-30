import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useTheme } from '../../theme/ThemeContext';
import { Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mode, theme: t } = useTheme();

  const initialRole = searchParams.get('role') === 'WORKER' ? 'WORKER' : 'CUSTOMER';

  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone: '',
    password: '',
    role: initialRole,
  });

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'WORKER' || roleParam === 'CUSTOMER') {
      setFormData((prev) => ({ ...prev, role: roleParam }));
    }
  }, [searchParams]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleRoleSelect = (role) => setFormData((prev) => ({ ...prev, role }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      setErrorMsg('Enter a 10-digit phone number.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Use a password with at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      await axiosClient.post('/auth/register', formData);
      navigate('/login', { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        'Could not create your account. Try a different email, or the server may be offline.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const isWorker = formData.role === 'WORKER';

  const heroImage = isWorker
    ? 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen w-full flex" style={{ background: t.bg }}>
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        <img
          key={heroImage}
          src={heroImage}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ filter: mode === 'dark' ? 'brightness(0.5) contrast(1.1)' : 'brightness(0.8) contrast(1.05)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(11,11,13,0.94) 0%, rgba(11,11,13,0.35) 55%, rgba(11,11,13,0.15) 100%)' }} />
        <div className="relative z-10 h-full flex flex-col justify-end p-10 space-y-3">
          <span className="wd-mono text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-white/30 text-white/90 self-start rounded-full">
            {isWorker ? 'Join as a pro' : 'Join as a customer'}
          </span>
          <h2 className="wd-display font-black text-3xl text-white tracking-tight leading-tight">
            {isWorker ? 'Pick up work near you.' : 'Get it done, at a fixed price.'}
          </h2>
          <p className="text-sm text-white/75 max-w-sm leading-relaxed">
            {isWorker
              ? 'Set your area, choose your trades, and start picking jobs that fit your schedule.'
              : 'Post what you need, see who\'s available nearby, and choose who does it.'}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-7 sm:p-8 border rounded-[16px] shadow-xs" style={{ background: t.surface, borderColor: t.border }}>
          <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: t.border }}>
            <button type="button" onClick={() => navigate('/')} className="wd-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-75" style={{ color: t.muted }}>
              <ArrowLeft size={14} /> Back to home
            </button>
          </div>

          <div className="mb-6">
            <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>Create your account</h1>
            <p className="text-xs mt-1 wd-mono" style={{ color: t.muted }}>Join Workers Den — Pune's local job marketplace.</p>
          </div>

          <div className="mb-2 text-xs wd-mono uppercase tracking-wider font-semibold" style={{ color: t.muted }}>I want to…</div>
          <div className="mb-5 grid grid-cols-2 p-1 border rounded-[10px] gap-1" style={{ background: t.bg, borderColor: t.border }}>
            <button
              type="button" onClick={() => handleRoleSelect('CUSTOMER')}
              className="py-2 text-xs wd-mono font-bold uppercase tracking-wider rounded-[8px] transition-all duration-150 cursor-pointer active:scale-[0.98]"
              style={{
                background: !isWorker ? t.surface : 'transparent',
                color: !isWorker ? t.accent : t.muted,
                border: !isWorker ? `1px solid ${t.accent}` : '1px solid transparent',
              }}
            >
              Book help
            </button>
            <button
              type="button" onClick={() => handleRoleSelect('WORKER')}
              className="py-2 text-xs wd-mono font-bold uppercase tracking-wider rounded-[8px] transition-all duration-150 cursor-pointer active:scale-[0.98]"
              style={{
                background: isWorker ? t.surface : 'transparent',
                color: isWorker ? t.accent : t.muted,
                border: isWorker ? `1px solid ${t.accent}` : '1px solid transparent',
              }}
            >
              Find work
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 text-xs wd-mono border rounded-[10px] flex items-start gap-2" style={{
              background: mode === 'light' ? '#FEE2E2' : '#451A1A',
              borderColor: mode === 'light' ? '#F87171' : '#7F2323',
              color: mode === 'light' ? '#B91C1C' : '#FCA5A5',
            }}>
              <AlertCircle size={14} className="shrink-0 mt-0.5" /> <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>Full name</label>
              <input
                type="text" name="user_name" required value={formData.user_name} onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3 py-2.5 text-xs wd-mono bg-transparent border rounded-[10px] outline-none transition-colors"
                style={{ borderColor: t.border, color: t.text }}
                onFocus={(e) => (e.target.style.borderColor = t.accent)}
                onBlur={(e) => (e.target.style.borderColor = t.border)}
              />
            </div>

            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>Email</label>
              <input
                type="email" name="email" required value={formData.email} onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-xs wd-mono bg-transparent border rounded-[10px] outline-none transition-colors"
                style={{ borderColor: t.border, color: t.text }}
                onFocus={(e) => (e.target.style.borderColor = t.accent)}
                onBlur={(e) => (e.target.style.borderColor = t.border)}
              />
            </div>

            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>Phone (10 digits)</label>
              <input
                type="tel" name="phone" required maxLength={10} value={formData.phone} onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-3 py-2.5 text-xs wd-mono bg-transparent border rounded-[10px] outline-none transition-colors"
                style={{ borderColor: t.border, color: t.text }}
                onFocus={(e) => (e.target.style.borderColor = t.accent)}
                onBlur={(e) => (e.target.style.borderColor = t.border)}
              />
            </div>

            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>Password (min. 6 characters)</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2.5 pr-10 text-xs wd-mono bg-transparent border rounded-[10px] outline-none transition-colors"
                  style={{ borderColor: t.border, color: t.text }}
                  onFocus={(e) => (e.target.style.borderColor = t.accent)}
                  onBlur={(e) => (e.target.style.borderColor = t.border)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1" style={{ color: t.muted }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="group w-full wd-mono text-xs font-bold py-3 flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-50 rounded-[10px] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: t.accent, color: t.accentText, boxShadow: '0 10px 25px -6px rgba(244,163,64,0.4)' }}
            >
              {loading ? 'Creating account…' : `Create ${isWorker ? 'pro' : 'customer'} account`} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t text-center wd-mono text-xs" style={{ borderColor: t.border }}>
            <span style={{ color: t.muted }}>Already have an account? </span>
            <Link to="/login" className="font-bold underline" style={{ color: t.accent }}>Log in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
