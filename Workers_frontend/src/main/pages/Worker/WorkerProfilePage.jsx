import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import WorkerNavbar from './WorkerNavbar';
import { CheckCircle2, AlertCircle, Star } from 'lucide-react';

const LOCALITIES = ['Kothrud', 'Karve Nagar', 'Warje', 'Baner', 'Wakad', 'Viman Nagar', 'Hinjawadi', 'Aundh', 'Hadapsar'];

export default function WorkerProfilePage() {
  const navigate = useNavigate();
  const { mode, theme: t } = useTheme();

  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [mySkillIds, setMySkillIds] = useState([]);

  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState(0);
  const [locality, setLocality] = useState('Kothrud');
  const [maxCapacity, setMaxCapacity] = useState(3);
  const [isAvailable, setIsAvailable] = useState(true);

  const [saving, setSaving] = useState(false);
  const [skillBusy, setSkillBusy] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        setMaxCapacity(p.maxCapacity || 3);
        setIsAvailable(p.isAvailable ?? true);
        setCategories(resCat.data || []);
        setMySkillIds((resSkills.data || []).map((s) => s.categoryId));
      })
      .catch(() => setError('Could not load your operator profile.'));
  };

  useEffect(() => {
    loadAll();
  }, []);

  const toggleCategory = async (catId) => {
    setSkillBusy(catId);
    setError('');
    try {
      if (mySkillIds.includes(catId)) {
        await api.delete(`/worker/skills/${catId}`);
        setMySkillIds((prev) => prev.filter((id) => id !== catId));
      } else {
        await api.post('/worker/skills', { categoryId: catId });
        setMySkillIds((prev) => [...prev, catId]);
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
      const payload = { bio, experience: Number(experience), profileImage: profile?.profileImage || '', locality, isAvailable, maxCapacity: Number(maxCapacity) };
      const res = await api.post('/workers/profile', payload);
      setProfile(res.data);
      setSuccess('Profile and dispatch settings updated.');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans transition-colors duration-150">
      <WorkerNavbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="border-b pb-4" style={{ borderColor: t.border }}>
          <div className="wd-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accent }}>
            OPERATOR SETTINGS // SERVICE CONFIGURATION
          </div>
          <h1 className="wd-display font-black text-2xl uppercase tracking-tight mt-0.5" style={{ color: t.text }}>
            Worker Operations Profile
          </h1>
          {profile && (
            <div className="flex items-center gap-3 mt-2 wd-mono text-xs" style={{ color: t.muted }}>
              <span className="flex items-center gap-1"><Star size={12} style={{ color: '#F59E0B' }} className="fill-current" /> {profile.rating || '0.0'} rating</span>
              <span>·</span>
              <span>{profile.completedJobs || 0} jobs completed</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 text-xs wd-mono border flex items-start gap-2" style={{
            background: mode === 'light' ? '#FEE2E2' : '#3B1818',
            borderColor: mode === 'light' ? '#F87171' : '#7F2323',
            color: mode === 'light' ? '#B91C1C' : '#FCA5A5',
          }}>
            <AlertCircle size={14} className="shrink-0 mt-0.5" /> <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 text-xs wd-mono border flex items-start gap-2" style={{
            background: mode === 'light' ? '#DCFCE7' : '#143823',
            borderColor: mode === 'light' ? '#86EFAC' : '#1E6B3C',
            color: mode === 'light' ? '#15803D' : '#4ADE80',
          }}>
            <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="border p-5 flex items-center justify-between gap-4" style={{ background: t.accentSoft, borderColor: t.border }}>
            <div>
              <div className="text-sm font-bold" style={{ color: t.text }}>Availability Dispatch Status</div>
              <div className="wd-mono text-xs mt-0.5" style={{ color: t.muted }}>
                {isAvailable ? 'Actively receiving matched open orders' : 'Paused — hidden from new dispatch leads'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAvailable(!isAvailable)}
              className="wd-mono text-xs font-bold px-4 py-2 cursor-pointer text-white"
              style={{ background: isAvailable ? t.success : t.muted, border: 'none' }}
            >
              {isAvailable ? 'AVAILABLE' : 'PAUSED'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>
                Primary Service Locality
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-transparent border outline-none"
                style={{ borderColor: t.border, color: t.text, background: t.surface }}
              >
                {LOCALITIES.map((loc) => <option key={loc} value={loc} style={{ background: t.surface, color: t.text }}>{loc}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>
                Max Concurrent Capacity
              </label>
              <select
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-xs bg-transparent border outline-none"
                style={{ borderColor: t.border, color: t.text, background: t.surface }}
              >
                <option value={1}>1 task at a time</option>
                <option value={2}>2 concurrent tasks</option>
                <option value={3}>3 concurrent tasks (standard)</option>
                <option value={5}>5 concurrent tasks (high capacity)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>
                Years of Experience
              </label>
              <input
                type="number"
                min={0}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-transparent border outline-none"
                style={{ borderColor: t.border, color: t.text }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>
              Bio / Introduction
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="A short introduction customers see on your profile."
              className="w-full px-3 py-2.5 text-xs bg-transparent border outline-none resize-none"
              style={{ borderColor: t.border, color: t.text }}
            />
          </div>

          <div>
            <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-2" style={{ color: t.muted }}>
              Qualified Trade Categories
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {categories.map((c) => {
                const isSelected = mySkillIds.includes(c.id);
                const busy = skillBusy === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => !busy && toggleCategory(c.id)}
                    className="p-3.5 border flex items-center justify-between cursor-pointer transition-all"
                    style={{
                      background: isSelected ? t.accentSoft : 'transparent',
                      borderColor: isSelected ? t.accent : t.border,
                      opacity: busy ? 0.5 : 1,
                    }}
                  >
                    <div>
                      <div className="text-sm font-bold" style={{ color: isSelected ? t.accent : t.text }}>{c.catName}</div>
                      <div className="wd-mono text-[11px]" style={{ color: t.muted }}>Earn ₹{c.workerPayout} / job</div>
                    </div>
                    <span className="wd-mono text-xs" style={{ color: isSelected ? t.accent : t.muted }}>
                      {busy ? '...' : isSelected ? '✓' : '+'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 wd-mono text-xs font-bold py-3.5 cursor-pointer disabled:opacity-50"
              style={{ background: t.accent, color: t.accentText, border: 'none' }}
            >
              {saving ? 'UPDATING PROFILE...' : 'SAVE SETTINGS'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/worker/dashboard')}
              className="wd-mono text-xs font-bold px-6 py-3.5 border cursor-pointer"
              style={{ background: 'transparent', borderColor: t.border, color: t.text }}
            >
              DASHBOARD
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
