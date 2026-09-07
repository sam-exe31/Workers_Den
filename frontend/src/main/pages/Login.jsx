import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { useTheme } from '../../theme/ThemeContext';
import Logo from '../Component/Logo';
import { Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle, CheckCircle2, X } from 'lucide-react';

const FLOW = [
    { n: '01', t: 'Post the job', d: 'Pick a service and a fixed price. No haggling.' },
    { n: '02', t: 'A nearby pro accepts', d: 'A skilled worker in your area picks it up.' },
    { n: '03', t: 'Done & rated', d: 'They finish on-site; you rate the work.' },
];

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme: t } = useTheme();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);

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

            setToast({ type: 'success', title: "You're in", message: `Taking you to your ${role?.toLowerCase() || 'account'} dashboard.` });

            setTimeout(() => {
                const fromPath = location.state?.from?.pathname;
                const isLogoutPath = fromPath && (fromPath.includes('/logout') || fromPath.includes('/login'));
                const targetPath = (!isLogoutPath && fromPath)
                    ? fromPath
                    : (role === 'WORKER' ? '/worker/dashboard' : '/customer/dashboard');
                navigate(targetPath, { replace: true });
            }, 700);
        } catch (err) {
            // Backend returns 500 (not 401) for bad credentials, message "Invalid email or password".
            const message =
                err.response?.data?.message ||
                'Check your email and password, or the server may be offline.';
            setToast({ type: 'error', title: "Couldn't log in", message });
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { borderColor: t.border, color: t.text, background: t.cardHover };
    const focusIn = (e) => (e.target.style.borderColor = t.accent);
    const focusOut = (e) => (e.target.style.borderColor = t.border);

    return (
        <div className="min-h-screen w-full flex" style={{ background: t.bg }}>
            {/* Toast */}
            {toast && (
                <div
                    className="fixed top-5 right-5 z-50 flex items-start gap-3 p-4 border max-w-sm w-full shadow-lg"
                    style={{ background: t.surface, borderColor: toast.type === 'error' ? t.stamp : t.success, color: t.text }}
                >
                    {toast.type === 'error' ? (
                        <AlertCircle size={18} className="shrink-0 mt-0.5" style={{ color: t.stamp }} />
                    ) : (
                        <CheckCircle2 size={18} className="shrink-0 mt-0.5" style={{ color: t.success }} />
                    )}
                    <div className="flex-1">
                        <div className="wd-mono text-xs font-bold uppercase tracking-wider" style={{ color: toast.type === 'error' ? t.stamp : t.success }}>
                            {toast.title}
                        </div>
                        <p className="text-xs mt-1 leading-relaxed" style={{ color: t.muted }}>{toast.message}</p>
                    </div>
                    <button type="button" onClick={() => setToast(null)} className="p-1 cursor-pointer hover:opacity-70" style={{ color: t.muted }}>
                        <X size={14} />
                    </button>
                </div>
            )}

            {/* ── Left: inked docket panel ── */}
            <div
                className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-11 overflow-hidden"
                style={{ background: t.accent, color: t.accentText }}
            >
                {/* ruled paper texture */}
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

                <div className="relative space-y-8">
                    <div>
                        <div className="wd-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-3" style={{ opacity: 0.7 }}>
                            Pune service register
                        </div>
                        <h2 className="wd-display font-black text-[2.6rem] leading-[1.05] tracking-tight">
                            Skilled help,<br />at a fixed price.
                        </h2>
                    </div>

                    <div className="space-y-4 max-w-sm">
                        {FLOW.map((s) => (
                            <div key={s.n} className="flex items-start gap-3.5">
                                <span className="wd-mono text-sm font-bold tabular-nums pt-0.5" style={{ opacity: 0.65 }}>{s.n}</span>
                                <div className="border-l pl-3.5" style={{ borderColor: 'rgba(252,251,247,0.28)' }}>
                                    <div className="wd-display font-bold text-base">{s.t}</div>
                                    <div className="text-xs mt-0.5 leading-relaxed" style={{ opacity: 0.72 }}>{s.d}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative flex items-center justify-between">
                    <span className="wd-mono text-[10px] uppercase tracking-widest" style={{ opacity: 0.6 }}>
                        Est. 2026 · Pune, MH
                    </span>
                    <span className="wd-stamp wd-stamp--tilt text-[11px]" style={{ color: t.accentText, opacity: 0.85 }}>
                        Now live
                    </span>
                </div>
            </div>

            {/* ── Right: the form ── */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md border shadow-sm" style={{ background: t.surface, borderColor: t.borderStrong }}>
                    {/* docket header strip */}
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
                        <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.faint }}>Form · Sign in</span>
                    </div>

                    <div className="p-7 sm:p-8">
                        <div className="mb-6">
                            <h1 className="wd-display font-black text-[1.7rem] tracking-tight" style={{ color: t.text }}>Welcome back</h1>
                            <p className="text-xs mt-1 wd-mono" style={{ color: t.muted }}>Log in to your Workers Den account.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <label className="block text-[11px] wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>Password</label>
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
                                {loading ? 'Signing in…' : 'Sign in'} <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </form>

                        <div className="mt-6 pt-4 border-t text-center wd-mono text-xs" style={{ borderColor: t.border }}>
                            <span style={{ color: t.muted }}>New here? </span>
                            <Link to="/register" className="font-bold" style={{ color: t.accent }}>Create an account</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
