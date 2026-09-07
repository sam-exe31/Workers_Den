import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useTheme } from '../../theme/ThemeContext';
import Logo from '../Component/Logo';
import { Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme: t } = useTheme();

  const initialRole = searchParams.get('role') === 'WORKER' ? 'WORKER' : 'CUSTOMER';

  const [formData, setFormData] = useState({
    user_name: '',
    email: '',
    phone: '',
    password: '',
    role: initialRole,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const u = JSON.parse(userStr);
        const role = u?.role ? u.role.replace('ROLE_', '') : '';
        const targetPath = role === 'WORKER' ? '/worker/dashboard' : '/customer/dashboard';
        navigate(targetPath, { replace: true });
      } catch { }
    }
  }, [navigate]);

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
      navigate(`/login`, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        (err.response?.data?.errors && Object.values(err.response.data.errors)[0]) ||
        'Could not create your account. Try a different email, or the server may be offline.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const isWorker = formData.role === 'WORKER';

  const panelCopy = isWorker
    ? { tag: 'Join as a pro', head: ['Pick up work', 'near you.'], sub: 'Set your area, choose your trades, and claim jobs that fit your schedule — at a fixed payout you see up front.' }
    : { tag: 'Join as a customer', head: ['Get it done,', 'at a fixed price.'], sub: 'Post what you need. A skilled pro nearby picks it up. No bidding wars, no surprise fees.' };

  const inputStyle = { borderColor: t.border, color: t.text, background: t.cardHover };
  const focusIn = (e) => (e.target.style.borderColor = t.accent);
  const focusOut = (e) => (e.target.style.borderColor = t.border);

  return (
    <div className="min-h-screen w-full flex" style={{ background: t.bg }}>
      {/* ── Left: inked docket panel ── */}
      <div
        className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-11 overflow-hidden"
        style={{ background: t.accent, color: t.accentText }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0, transparent 37px, rgba(252,251,247,0.10) 37px, rgba(252,251,247,0.10) 38px)',
          }}
        />
        <div className="relative flex items-center gap-3">
          <Logo size={40} variant="ink" color={t.accentText} />
          <span className="wd-display text-xl font-black tracking-tight">
            WORKERS<span style={{ opacity: 0.75 }}>DEN</span>
          </span>
        </div>

        <div className="relative space-y-6">
          <span className="wd-stamp wd-stamp--tilt text-[11px] inline-block" style={{ color: t.accentText, opacity: 0.9 }}>
            {panelCopy.tag}
          </span>
          <h2 className="wd-display font-black text-[2.6rem] leading-[1.05] tracking-tight">
            {panelCopy.head[0]}<br />{panelCopy.head[1]}
          </h2>
          <p className="text-sm max-w-sm leading-relaxed" style={{ opacity: 0.78 }}>
            {panelCopy.sub}
          </p>
        </div>

        <div className="relative">
          <span className="wd-mono text-[10px] uppercase tracking-widest" style={{ opacity: 0.6 }}>
            Pune, Maharashtra · fixed prices
          </span>
        </div>
      </div>

      {/* ── Right: the form ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md border shadow-sm" style={{ background: t.surface, borderColor: t.borderStrong }}>
          <div className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: t.border, background: t.cardHover }}>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate(-1)} className="wd-mono text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:opacity-70" style={{ color: t.muted }}>
                <ArrowLeft size={13} /> Back
              </button>
              <span style={{ color: t.border }}>|</span>
              <button type="button" onClick={() => navigate('/')} className="wd-mono text-[11px] font-bold flex items-center gap-1 cursor-pointer hover:opacity-70" style={{ color: t.muted }}>
                Home
              </button>
            </div>
            <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.faint }}>Form · Register</span>
          </div>

          <div className="p-7 sm:p-8">
            <div className="mb-5">
              <h1 className="wd-display font-black text-[1.7rem] tracking-tight" style={{ color: t.text }}>Create your account</h1>
              <p className="text-xs mt-1 wd-mono" style={{ color: t.muted }}>Pune's local marketplace for skilled work.</p>
            </div>

            {/* role tabs */}
            <div className="mb-1.5 text-[11px] wd-mono uppercase tracking-wider font-semibold" style={{ color: t.muted }}>I want to…</div>
            <div className="mb-5 grid grid-cols-2 gap-0 border rounded-[4px] overflow-hidden" style={{ borderColor: t.border }}>
              {[
                { role: 'CUSTOMER', label: 'Book help' },
                { role: 'WORKER', label: 'Find work' },
              ].map((opt, i) => {
                const active = formData.role === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => handleRoleSelect(opt.role)}
                    className="py-2.5 text-xs wd-mono font-bold uppercase tracking-wider cursor-pointer transition-colors"
                    style={{
                      background: active ? t.accent : 'transparent',
                      color: active ? t.accentText : t.muted,
                      borderLeft: i === 1 ? `1px solid ${t.border}` : 'none',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {errorMsg && (
              <div className="mb-5 p-3 text-xs wd-mono border rounded-[4px] flex items-start gap-2" style={{ background: t.errorSoft, borderColor: t.error, color: t.error }}>
                <AlertCircle size={14} className="shrink-0 mt-0.5" /> <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>Full name</label>
                <input
                  type="text" name="user_name" required value={formData.user_name} onChange={handleChange}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3 py-2.5 text-sm wd-mono border rounded-[4px] outline-none transition-colors"
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                />
              </div>

              <div>
                <label className="block text-[11px] wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>Email</label>
                <input
                  type="email" name="email" required value={formData.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2.5 text-sm wd-mono border rounded-[4px] outline-none transition-colors"
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                />
              </div>

              <div>
                <label className="block text-[11px] wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>Phone (10 digits)</label>
                <input
                  type="tel" name="phone" required maxLength={10} value={formData.phone} onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-3 py-2.5 text-sm wd-mono border rounded-[4px] outline-none transition-colors"
                  style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                />
              </div>

              <div>
                <label className="block text-[11px] wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>Password (min. 6 characters)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full px-3 py-2.5 pr-10 text-sm wd-mono border rounded-[4px] outline-none transition-colors"
                    style={inputStyle} onFocus={focusIn} onBlur={focusOut}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1" style={{ color: t.muted }}>
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="group w-full wd-mono wd-btn text-xs font-bold uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50 rounded-[4px]"
                style={{ background: t.accent, color: t.accentText, border: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = t.accentHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = t.accent)}
              >
                {loading ? 'Creating account…' : `Create ${isWorker ? 'pro' : 'customer'} account`} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t text-center wd-mono text-xs" style={{ borderColor: t.border }}>
              <span style={{ color: t.muted }}>Already have an account? </span>
              <Link to="/login" className="font-bold" style={{ color: t.accent }}>Log in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
