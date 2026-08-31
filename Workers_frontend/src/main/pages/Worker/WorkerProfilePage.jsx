import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../Theme/ThemeContext';
import api from '../../../api/axiosClient';
import WorkerNavbar from './WorkerNavbar';
import { LOCALITIES } from '../../../constants/localities';
import { CheckCircle2, AlertCircle, Star, ShieldCheck, Camera, Trash2, AlertTriangle, X, Upload } from 'lucide-react';

export default function WorkerProfilePage() {
  const navigate = useNavigate();
  const { theme: t } = useTheme();

  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [mySkillIds, setMySkillIds] = useState([]);

  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState(0);
  const [locality, setLocality] = useState(LOCALITIES[0]);
  const [maxCapacity, setMaxCapacity] = useState(2);
  const [isAvailable, setIsAvailable] = useState(true);
  const [profileImage, setProfileImage] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [saving, setSaving] = useState(false);
  const [skillBusy, setSkillBusy] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const loadAll = () => {
    Promise.all([
      api.get('/workers/me'),
      api.get('/Categories'),
      api.get('/worker/skills'),
    ])
      .then(([resProf, resCat, resSkills]) => {
        const p = resProf.data;
        setProfile(p);
        setBio(p.bio || '');
        setExperience(p.experience || 0);
        setLocality(p.locality || 'Kothrud');
        setMaxCapacity(p.maxCapacity || 2);
        setIsAvailable(p.isAvailable ?? true);
        setProfileImage(p.profileImage || p.profile_image || '');
        setCategories(resCat.data || []);
        setMySkillIds((resSkills.data || []).map(s => s.categoryId || s.catId || s.cat_id));
      })
      .catch(() => setError('Could not load your profile. Please refresh.'));
  };

  useEffect(() => { loadAll(); }, []);

  // Image upload to Spring Boot /api/uploads/photo
  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    setUploadingPhoto(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/uploads/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        setProfileImage(res.data.url);
        setSuccess('Photo uploaded. Click "Save changes" to update your profile.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photo to server. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const toggleCategory = async (catId) => {
    setSkillBusy(catId);
    setError('');
    try {
      if (mySkillIds.includes(catId)) {
        await api.delete(`/worker/skills/${catId}`);
        setMySkillIds(prev => prev.filter(id => id !== catId));
      } else {
        await api.post('/worker/skills', { categoryId: catId });
        setMySkillIds(prev => [...prev, catId]);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update your trade categories.');
    } finally {
      setSkillBusy(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const payload = {
        bio,
        experience: Number(experience),
        profileImage: profileImage,
        locality,
        isAvailable,
        maxCapacity: Number(maxCapacity),
      };
      const res = await api.post('/workers/profile', payload);
      setProfile(res.data);
      setSuccess('Your profile and photo have been saved successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      // Try worker delete first, then user delete if provided by API
      try {
        await api.delete('/workers/me');
      } catch {
        await api.delete('/users/me');
      }
      localStorage.clear();
      navigate('/login', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not delete account at this time. Please try again.';
      setDeleteError(msg);
      setDeleting(false);
    }
  };

  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const userName = user?.fullName || profile?.userName || 'Worker';
  const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'W';

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans">
      <WorkerNavbar />

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
            <div className="flex items-start justify-between border-b pb-3" style={{ borderColor: t.border }}>
              <div className="flex items-center gap-2" style={{ color: t.stamp }}>
                <AlertTriangle size={18} />
                <span className="wd-display font-black text-lg uppercase">Delete Worker Account</span>
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
                Are you sure you want to permanently delete your worker profile?
              </p>
              <p>
                This action is <strong style={{ color: t.stamp }}>permanent and irreversible</strong>. Your worker profile, trade qualifications, and dashboard access will be completely deleted.
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

            {deleteError && (
              <div className="p-3 text-xs wd-mono border" style={{ background: 'rgba(194,59,30,0.08)', borderColor: t.stamp, color: t.stamp }}>
                {deleteError}
              </div>
            )}

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
                {deleting ? 'Deleting…' : 'Permanently Delete'}
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
          {profile && (
            <div className="flex items-center gap-4 mt-2 wd-mono text-xs" style={{ color: t.muted }}>
              {profile.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={12} style={{ color: '#D97706' }} className="fill-current" />
                  {profile.rating} rating
                </span>
              )}
              <span>{profile.completedJobs || 0} jobs completed</span>
            </div>
          )}
        </div>

        {/* Verification status */}
        <div
          className="flex items-center gap-3 p-4 border"
          style={{ background: t.accentSoft, borderColor: t.border }}
        >
          <ShieldCheck size={18} style={{ color: t.accent }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: t.text }}>Verification pending</div>
            <div className="wd-mono text-xs mt-0.5" style={{ color: t.muted }}>
              Your profile is being reviewed. You'll be able to accept jobs once verified.
            </div>
          </div>
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

          {/* Profile Photo Section */}
          <div className="border p-5 space-y-4" style={{ borderColor: t.border, background: t.surface }}>
            <label className="block text-xs wd-mono uppercase tracking-wider font-semibold" style={{ color: t.muted }}>
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              {/* Photo / Avatar Preview */}
              <div className="relative shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={userName}
                    className="w-20 h-20 rounded-full object-cover border-2 shadow-sm"
                    style={{ borderColor: t.accent }}
                  />
                ) : (
                  <div
                    className="w-20 h-20 rounded-full border-2 flex items-center justify-center wd-display font-black text-xl"
                    style={{ borderColor: t.border, background: t.accentSoft, color: t.accent }}
                  >
                    {initials}
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="flex-1 space-y-3 w-full">
                <div className="flex flex-wrap gap-2">
                  <label
                    className={`wd-mono text-xs font-bold px-4 py-2 border cursor-pointer inline-flex items-center gap-1.5 transition-colors ${uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ borderColor: t.accent, color: t.accent, background: t.accentSoft }}
                  >
                    <Upload size={13} />
                    {uploadingPhoto ? 'Uploading image file…' : 'Choose image file'}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingPhoto}
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>

                  {profileImage && (
                    <button
                      type="button"
                      onClick={() => setProfileImage('')}
                      disabled={uploadingPhoto}
                      className="wd-mono text-xs font-bold px-3 py-2 border cursor-pointer hover:opacity-75"
                      style={{ borderColor: t.border, color: t.stamp }}
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div>
                  <span className="wd-mono text-[10px] block mb-1" style={{ color: t.muted }}>
                    Or enter image URL:
                  </span>
                  <input
                    type="url"
                    value={profileImage.startsWith('data:') ? '' : profileImage}
                    onChange={e => setProfileImage(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-3 py-2 text-xs border outline-none wd-mono"
                    style={{ borderColor: t.border, color: t.text, background: t.cardHover }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Availability toggle */}
          <div
            className="border p-5 flex items-center justify-between gap-4"
            style={{ borderColor: t.border, background: t.surface }}
          >
            <div>
              <div className="font-semibold text-sm" style={{ color: t.text }}>Availability</div>
              <div className="wd-mono text-xs mt-0.5" style={{ color: t.muted }}>
                {isAvailable
                  ? 'You\'re visible to customers and receiving job requests'
                  : 'You\'re hidden from new job requests'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className="wd-mono text-xs font-bold px-4 py-2 cursor-pointer border shrink-0"
              style={{
                borderColor: isAvailable ? t.success : t.border,
                color: isAvailable ? t.success : t.muted,
                background: isAvailable ? 'rgba(47,125,79,0.08)' : 'transparent',
              }}
            >
              {isAvailable ? '● Available' : '○ Offline'}
            </button>
          </div>

          {/* Grid: locality + capacity + experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>
                Main work area
              </label>
              <select
                value={locality}
                onChange={e => setLocality(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border outline-none"
                style={{ borderColor: t.border, color: t.text, background: t.surface }}
              >
                {LOCALITIES.map(loc => (
                  <option key={loc} value={loc} style={{ background: t.surface }}>{loc}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>
                Max active jobs at once
              </label>
              <select
                value={maxCapacity}
                onChange={e => setMaxCapacity(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-sm border outline-none"
                style={{ borderColor: t.border, color: t.text, background: t.surface }}
              >
                <option value={1}>1 job at a time</option>
                <option value={2}>2 jobs at a time</option>
                <option value={3}>3 jobs at a time</option>
                <option value={5}>5 jobs at a time</option>
              </select>
            </div>

            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>
                Years of experience
              </label>
              <input
                type="number"
                min={0}
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border outline-none"
                style={{ borderColor: t.border, color: t.text, background: t.surface }}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>
              About you <span style={{ color: t.faint }}>(optional)</span>
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              maxLength={220}
              placeholder="A short intro customers see on your profile."
              className="w-full px-3 py-2.5 text-sm border outline-none resize-none"
              style={{ borderColor: t.border, color: t.text, background: t.surface }}
            />
            <div className="wd-mono text-[10px] text-right mt-0.5" style={{ color: t.faint }}>
              {bio.length} / 220
            </div>
          </div>

          {/* Trade categories */}
          <div>
            <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-2" style={{ color: t.muted }}>
              Your trade skills
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {categories.map(c => {
                const isSelected = mySkillIds.includes(c.id);
                const busy = skillBusy === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => !busy && toggleCategory(c.id)}
                    className="p-4 border flex items-center justify-between cursor-pointer transition-all"
                    style={{
                      background: isSelected ? t.accentSoft : t.surface,
                      borderColor: isSelected ? t.accent : t.border,
                      opacity: busy ? 0.5 : 1,
                    }}
                  >
                    <div>
                      <div className="font-semibold text-sm" style={{ color: isSelected ? t.accent : t.text }}>
                        {c.catName}
                      </div>
                      <div className="wd-mono text-[11px]" style={{ color: t.muted }}>
                        ₹{c.workerPayout} per job
                      </div>
                    </div>
                    <span className="wd-mono text-sm font-bold" style={{ color: isSelected ? t.accent : t.muted }}>
                      {busy ? '…' : isSelected ? '✓' : '+'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 wd-mono wd-btn text-xs font-bold py-3.5 cursor-pointer disabled:opacity-40"
              style={{ background: t.accent, color: t.accentText, border: 'none' }}
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/worker/dashboard')}
              className="wd-mono text-xs font-bold px-6 py-3.5 border cursor-pointer"
              style={{ borderColor: t.border, color: t.text, background: 'transparent' }}
            >
              Dashboard
            </button>
          </div>
        </form>

        {/* Danger Zone: Account Deletion */}
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
                Once deleted, your profile and application access will be permanently removed.
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setDeleteConfirmText(''); setDeleteError(''); setShowDeleteModal(true); }}
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
