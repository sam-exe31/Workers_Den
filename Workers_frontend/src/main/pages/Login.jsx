import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useTheme } from '../../theme/ThemeContext';
import { Eye, EyeOff, ArrowLeft, ArrowRight, ShieldCheck, AlertCircle, X, Tag } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, theme: t } = useTheme();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (toast) setToast(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const response = await axiosClient.post('/auth/login', formData);
      const { token, role, email } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ email, role }));

      setToast({ type: 'success', title: "You're in", message: `Welcome back — taking you to your ${role?.toLowerCase() || 'account'} dashboard.` });

      setTimeout(() => {
        const targetPath = location.state?.from?.pathname ||
          (role === 'WORKER' ? '/worker/dashboard' : role === 'ADMIN' ? '/admin/categories' : '/customer/dashboard');
        navigate(targetPath, { replace: true });
      }, 800);
    } catch (err) {
      const message = err.response?.data?.message || "Check your email and password, or the server may be offline.";
      setToast({ type: 'error', title: "Couldn't log in", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: t.bg }}>
      {toast && (
        <div
          className="fixed top-6 right-6 z-50 flex items-start gap-3 p-4 border rounded-[12px] max-w-sm w-full shadow-lg animate-in fade-in slide-in-from-top-3"
          style={{ background: t.surface, borderColor: toast.type === 'error' ? '#EF4444' : t.success, color: t.text }}
        >
          {toast.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /> : <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
          <div className="flex-1">
            <div className="wd-mono text-xs font-bold uppercase tracking-wider" style={{ color: toast.type === 'error' ? '#EF4444' : t.success }}>
              {toast.title}
            </div>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: t.muted }}>{toast.message}</p>
          </div>
          <button type="button" onClick={() => setToast(null)} className="text-xs p-1 hover:opacity-70 cursor-pointer" style={{ color: t.muted }}>
            <X size={14} />
          </button>
        </div>
      )}

      <div className="hidden lg:block lg:w-[45%] relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=1200&auto=format&fit=crop&q=80"
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: mode === 'dark' ? 'brightness(0.5) contrast(1.1)' : 'brightness(0.8) contrast(1.05)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(11,11,13,0.94) 0%, rgba(11,11,13,0.35) 55%, rgba(11,11,13,0.15) 100%)' }}
        />
        <div className="relative z-10 h-full flex flex-col justify-end p-10 space-y-4">
          <span className="wd-mono text-[10px] font-bold uppercase tracking-wider px-2 py-1 border border-white/30 text-white/90 self-start rounded-full">
            Pune · Now live
          </span>
          <h2 className="wd-display font-black text-3xl text-white tracking-tight leading-tight">
            Skilled help, at a fixed price.
          </h2>
          <p className="text-sm text-white/75 max-w-sm leading-relaxed">
            Post a job, see who's available nearby, and choose who gets it done. No bidding wars, no surprise fees.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-white/80 wd-mono">
            <Tag size={13} className="text-[#F4A340]" />
            <span>Fixed prices up front — you choose who does the job.</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="relative z-10 w-full max-w-md p-7 sm:p-8 border rounded-[16px] shadow-xs" style={{ background: t.surface, borderColor: t.border }}>
          <div className="flex items-center justify-between border-b pb-4 mb-6" style={{ borderColor: t.border }}>
            <button type="button" onClick={() => navigate('/')} className="wd-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-75" style={{ color: t.muted }}>
              <ArrowLeft size={14} /> Back to home
            </button>
          </div>

          <div className="mb-6">
            <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>Welcome back</h1>
            <p className="text-xs mt-1 wd-mono" style={{ color: t.muted }}>Log in to your Workers Den account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>Password</label>
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
              {loading ? 'Logging in…' : 'Log in'} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t text-center wd-mono text-xs" style={{ borderColor: t.border }}>
            <span style={{ color: t.muted }}>New here? </span>
            <Link to="/register" className="font-bold underline" style={{ color: t.accent }}>Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
