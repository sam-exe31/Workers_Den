import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../Theme/ThemeContext';
import api from '../../../api/axiosClient';
import CustomerNavbar from './CustomerNavbar';
import { LOCALITIES } from '../../../constants/localities';
import { User, MapPin, CheckCircle2, AlertCircle, Trash2, AlertTriangle, X } from 'lucide-react';

export default function CustomerProfilePage() {
    const navigate = useNavigate();
    const { theme: t } = useTheme();

    const rawUser = localStorage.getItem('user');
    const initialUser = rawUser ? JSON.parse(rawUser) : null;
    const [user, setUser] = useState(initialUser);

    const [fullName, setFullName] = useState(initialUser?.fullName || initialUser?.user_name || '');
    const [email, setEmail] = useState(initialUser?.email || '');
    const [phone, setPhone] = useState(initialUser?.phone || '');
    const [defaultLocality, setDefaultLocality] = useState(initialUser?.locality || LOCALITIES[0]);

    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    // Fetch live user data from DB on mount
    useEffect(() => {
        api.get('/users/me')
            .then(res => {
                if (res.data) {
                    const u = res.data;
                    if (u.user_name) setFullName(u.user_name);
                    if (u.email) setEmail(u.email);
                    if (u.phone) setPhone(u.phone);
                    const updatedUser = {
                        ...user,
                        fullName: u.user_name || user?.fullName,
                        email: u.email || user?.email,
                        phone: u.phone || user?.phone
                    };
                    setUser(updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                }
            })
            .catch(() => { });
    }, []);

    // Account deletion modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess('');
        setError('');

        try {
            const response = await api.put('/users/me', { fullName, phone });
            const updatedFromDB = response.data;
            const updatedUser = {
                ...user,
                fullName: updatedFromDB?.user_name || fullName,
                phone: updatedFromDB?.phone || phone,
                locality: defaultLocality
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setSuccess('Profile updated successfully .');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not save changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            try {
                await api.delete('/users/me');
            } catch { }
            localStorage.clear();
            navigate('/login', { replace: true });
        } catch {
            setError('Could not delete account. Please try again.');
            setDeleting(false);
        }
    };

    return (
        <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans">
            <CustomerNavbar />

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center px-4"
                    style={{ background: 'rgba(24, 32, 46, 0.65)', backdropFilter: 'blur(3px)' }}
                    onClick={() => !deleting && setShowDeleteModal(false)}
                >
                    <div
                        className="w-full max-w-md border shadow-xl p-6 space-y-5"
                        style={{ background: t.surface, borderColor: t.stamp }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
                            <div className="flex items-center gap-2" style={{ color: t.stamp }}>
                                <AlertTriangle size={18} />
                                <span className="wd-display font-black text-lg uppercase">Delete Customer Account</span>
                            </div>
                            <button
                                type="button"
                                onClick={() => !deleting && setShowDeleteModal(false)}
                                className="cursor-pointer hover:opacity-60"
                                style={{ color: t.muted }}
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="space-y-3 text-xs leading-relaxed" style={{ color: t.muted }}>
                            <p className="font-bold text-sm" style={{ color: t.text }}>
                                Are you sure you want to permanently delete your account?
                            </p>
                            <p>
                                This will delete your customer profile and account access. This action <strong style={{ color: t.stamp }}>cannot be undone</strong>.
                            </p>
                            <div>
                                <label className="block wd-mono text-[10px] font-bold uppercase mb-1" style={{ color: t.muted }}>
                                    Type <span style={{ color: t.stamp }}>DELETE</span> to confirm
                                </label>
                                <input
                                    type="text"
                                    value={deleteConfirmText}
                                    onChange={e => setDeleteConfirmText(e.target.value)}
                                    placeholder="DELETE"
                                    className="w-full px-3 py-2 border outline-none wd-mono uppercase text-xs"
                                    style={{ borderColor: t.border, color: t.text, background: t.cardHover }}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="button"
                                disabled={deleting}
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 wd-mono text-xs font-bold py-3 border cursor-pointer"
                                style={{ borderColor: t.border, color: t.text, background: 'transparent' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={deleting || deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                                onClick={handleDeleteAccount}
                                className="flex-1 wd-mono wd-btn text-xs font-bold py-3 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                                style={{ background: t.stamp, color: '#fff', border: 'none' }}
                            >
                                <Trash2 size={13} />
                                {deleting ? 'Deleting…' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">

                {/* Header */}
                <div className="border-b pb-4" style={{ borderColor: t.border }}>
                    <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
                        My Profile
                    </h1>
                    <p className="text-sm mt-1" style={{ color: t.muted }}>
                        Manage your contact information and default location.
                    </p>
                </div>

                {/* Alerts */}
                {error && (
                    <div
                        className="p-3 text-xs wd-mono border flex items-start gap-2"
                        style={{ background: 'rgba(194,59,30,0.06)', borderColor: t.stamp, color: t.stamp }}
                    >
                        <AlertCircle size={14} className="shrink-0 mt-0.5" /> {error}
                    </div>
                )}
                {success && (
                    <div
                        className="p-3 text-xs wd-mono border flex items-start gap-2"
                        style={{ background: 'rgba(47,125,79,0.08)', borderColor: t.success, color: t.success }}
                    >
                        <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> {success}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="border p-6 space-y-4" style={{ background: t.surface, borderColor: t.border }}>
                        <div className="flex items-center gap-4 pb-4 border-b" style={{ borderColor: t.border }}>
                            <div
                                className="w-14 h-14 rounded-full border-2 flex items-center justify-center wd-display font-black text-lg"
                                style={{ borderColor: t.accent, background: t.accentSoft, color: t.accent }}
                            >
                                {fullName ? fullName.substring(0, 2).toUpperCase() : 'C'}
                            </div>
                            <div>
                                <div className="font-bold text-base" style={{ color: t.text }}>{fullName || 'Customer'}</div>
                                <div className="wd-mono text-xs" style={{ color: t.muted }}>{email}</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs wd-mono font-bold uppercase tracking-wider mb-1.5" style={{ color: t.muted }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={e => setFullName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border outline-none"
                                    style={{ borderColor: t.border, color: t.text, background: t.surface }}
                                />
                            </div>

                            <div>
                                <label className="block text-xs wd-mono font-bold uppercase tracking-wider mb-1.5" style={{ color: t.muted }}>
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border outline-none"
                                    style={{ borderColor: t.border, color: t.text, background: t.surface }}
                                />
                            </div>

                            <div>
                                <label className="block text-xs wd-mono font-bold uppercase tracking-wider mb-1.5" style={{ color: t.muted }}>
                                    Default Locality / Sector
                                </label>
                                <select
                                    value={defaultLocality}
                                    onChange={e => setDefaultLocality(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border outline-none"
                                    style={{ borderColor: t.border, color: t.text, background: t.surface }}
                                >
                                    {LOCALITIES.map(loc => (
                                        <option key={loc} value={loc} style={{ background: t.surface }}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 wd-mono wd-btn text-xs font-bold py-3.5 cursor-pointer disabled:opacity-40"
                            style={{ background: t.accent, color: t.accentText, border: 'none' }}
                        >
                            {saving ? 'Saving…' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/customer/dashboard')}
                            className="wd-mono text-xs font-bold px-6 py-3.5 border cursor-pointer"
                            style={{ borderColor: t.border, color: t.text, background: 'transparent' }}
                        >
                            Dashboard
                        </button>
                    </div>
                </form>

                {/* Danger Zone */}
                <div className="pt-8 border-t space-y-4" style={{ borderColor: t.border }}>
                    <div className="wd-mono text-xs font-bold uppercase tracking-wider" style={{ color: t.stamp }}>
                        Danger Zone
                    </div>
                    <div className="border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ background: 'rgba(194,59,30,0.04)', borderColor: t.stamp }}>
                        <div>
                            <div className="font-semibold text-sm" style={{ color: t.text }}>
                                Permanently Delete Account
                            </div>
                            <div className="wd-mono text-xs mt-0.5" style={{ color: t.muted }}>
                                Remove your customer profile and account credentials.
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowDeleteModal(true)}
                            className="wd-mono text-xs font-bold px-4 py-2.5 border cursor-pointer shrink-0 transition-colors"
                            style={{ borderColor: t.stamp, color: t.stamp, background: 'transparent' }}
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

            </main>
        </div>
    );
}
