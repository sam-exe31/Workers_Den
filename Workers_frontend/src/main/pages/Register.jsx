import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useTheme } from '../../theme/ThemeContext';
import { Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

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
      setErrorMsg('Phone number must be exactly 10 digits.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
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
        'Registration failed. Please check your details or try another email.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const heroImage = formData.role === 'WORKER'
    ? 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=1200&auto=format&fit=crop&q=80'
    : 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=1200&auto=format&fit=crop&q=80';

  return (
    <div className="min-h-screen w-full flex" style={{ background: t.bg }}>
      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        <img
          key={heroImage}
          src={heroImage}
          alt="Workers Den"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{ filter: mode === 'dark' ? 'brightness(0.55) contrast(1.1)' : 'brightness(0.8) contrast(1.05)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,18,25,0.92) 0%, rgba(15,18,25,0.25) 55%, rgba(15,18,25,0.1) 100%)' }} />
        <div className="relative z-10 h-full flex flex-col justify-end p-10 space-y-3">
          <span className="wd-mono text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-white/30 text-white/90 self-start">
            {formData.role === 'WORKER' ? 'JOIN AS TECHNICIAN' : 'JOIN AS CUSTOMER'}
          </span>
          <h2 className="wd-display font-black text-3xl text-white uppercase tracking-tight leading-tight">
            {formData.role === 'WORKER' ? 'Claim jobs, get paid on completion.' : 'Book trusted help in minutes.'}
          </h2>
          <p className="text-sm text-white/75 max-w-sm leading-relaxed">
            {formData.role === 'WORKER'
              ? 'Set your locality, pick your trade categories, and start claiming matched work orders today.'
              : 'Standardized pricing, verified operators, and a 30-day resolution warranty on every job.'}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-7 sm:p-8 border shadow-xs" style={{ background: t.surface, borderColor: t.border }}>
          <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: t.border }}>
            <button type="button" onClick={() => navigate('/')} className="wd-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-75" style={{ color: t.muted }}>
              <ArrowLeft size={14} /> BACK TO HOME
            </button>
          </div>

          <div className="mb-6">
            <h1 className="wd-display font-black text-2xl uppercase tracking-tight" style={{ color: t.text }}>Create Account</h1>
            <p className="text-xs mt-1 wd-mono" style={{ color: t.muted }}>Join the Workers Den network.</p>
          </div>

          <div className="mb-5 grid grid-cols-2 p-1 border gap-1" style={{ background: t.cardHover, borderColor: t.border }}>
            <button
              type="button" onClick={() => handleRoleSelect('CUSTOMER')}
              className="py-2 text-xs wd-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer active:scale-[0.98]"
              style={{
                background: formData.role === 'CUSTOMER' ? t.surface : 'transparent',
                color: formData.role === 'CUSTOMER' ? t.accent : t.muted,
                border: formData.role === 'CUSTOMER' ? `1px solid ${t.accent}` : '1px solid transparent',
              }}
            >
              Customer
            </button>
            <button
              type="button" onClick={() => handleRoleSelect('WORKER')}
              className="py-2 text-xs wd-mono font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer active:scale-[0.98]"
              style={{
                background: formData.role === 'WORKER' ? t.surface : 'transparent',
                color: formData.role === 'WORKER' ? t.accent : t.muted,
                border: formData.role === 'WORKER' ? `1px solid ${t.accent}` : '1px solid transparent',
              }}
            >
              Worker
            </button>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 text-xs wd-mono border flex items-start gap-2" style={{
              background: mode === 'light' ? '#FEE2E2' : '#451A1A',
              borderColor: mode === 'light' ? '#F87171' : '#7F2323',
              color: mode === 'light' ? '#B91C1C' : '#FCA5A5',
            }}>
              <AlertCircle size={14} className="shrink-0 mt-0.5" /> <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>Full Name</label>
              <input
                type="text" name="user_name" required value={formData.user_name} onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                className="w-full px-3 py-2.5 text-xs wd-mono bg-transparent border outline-none transition-colors"
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
                className="w-full px-3 py-2.5 text-xs wd-mono bg-transparent border outline-none transition-colors"
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
                className="w-full px-3 py-2.5 text-xs wd-mono bg-transparent border outline-none transition-colors"
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
                  className="w-full px-3 py-2.5 pr-10 text-xs wd-mono bg-transparent border outline-none transition-colors"
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
              className="w-full wd-mono wd-btn text-xs font-bold py-3 flex items-center justify-center gap-2 mt-3 cursor-pointer disabled:opacity-50"
              style={{ background: t.accent, color: t.accentText, border: 'none' }}
            >
              {loading ? 'CREATING ACCOUNT...' : `SIGN UP AS ${formData.role}`} <ArrowRight size={14} />
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
