import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import WorkerNavbar from './WorkerNavbar';
import { LOCALITIES } from '../../../constants/localities';
import { CheckCircle2, AlertCircle, Star, ShieldCheck } from 'lucide-react';

export default function WorkerProfilePage() {
  const navigate     = useNavigate();
  const { theme: t } = useTheme();

  const [profile, setProfile]       = useState(null);
  const [categories, setCategories] = useState([]);
  const [mySkillIds, setMySkillIds] = useState([]);

  const [bio, setBio]               = useState('');
  const [experience, setExperience] = useState(0);
  const [locality, setLocality]     = useState(LOCALITIES[0]);
  const [maxCapacity, setMaxCapacity] = useState(2);
  const [isAvailable, setIsAvailable] = useState(true);

  const [saving, setSaving]       = useState(false);
  const [skillBusy, setSkillBusy] = useState(null);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

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
        setLocality(p.locality || LOCALITIES[0]);
        setMaxCapacity(p.maxCapacity || 2);
        setIsAvailable(p.isAvailable ?? true);
        setCategories(resCat.data || []);
        setMySkillIds((resSkills.data || []).map(s => s.categoryId));
      })
      .catch(() => setError('Could not load your profile. Please refresh.'));
  };

  useEffect(() => { loadAll(); }, []);

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
        profileImage: profile?.profileImage || '',
        locality,
        isAvailable,
        maxCapacity: Number(maxCapacity),
      };
      const res = await api.post('/workers/profile', payload);
      setProfile(res.data);
      setSuccess('Your profile has been updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans">
      <WorkerNavbar />

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
                const busy       = skillBusy === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => !busy && toggleCategory(c.id)}
                    className="p-4 border flex items-center justify-between cursor-pointer transition-all"
                    style={{
                      background:   isSelected ? t.accentSoft : t.surface,
                      borderColor:  isSelected ? t.accent : t.border,
                      opacity:      busy ? 0.5 : 1,
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
      </main>
    </div>
  );
}
