import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import getMediaUrl from '../../../utils/mediaUrl';
import Logo from '../../Component/Logo';
import { LOCALITIES } from '../../../constants/localities';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Clock,
  MapPin,
  Zap,
  ArrowRight,
  Star,
  Briefcase,
  User,
  Camera,
} from 'lucide-react';

// ── Experience options ──────────────────────────────────────────────────────
const EXPERIENCE_OPTIONS = [
  { label: 'Less than 1 year', value: 0 },
  { label: '1–3 years', value: 1 },
  { label: '3–5 years', value: 3 },
  { label: '5–10 years', value: 5 },
  { label: '10+ years', value: 10 },
];

const TOTAL_DATA_STEPS = 7; // steps 1-7 (trade → photo)

// ── Step progress bar ───────────────────────────────────────────────────────
function ProgressBar({ step, total, t }) {
  if (step === 0 || step === 8) return null;
  return (
    <div className="w-full mb-7">
      <div className="flex items-center justify-between wd-mono text-[10px] mb-2" style={{ color: t.muted }}>
        <span>Step {step} of {total}</span>
        <span style={{ color: t.warning }}>{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="w-full h-1" style={{ background: t.border }}>
        <div
          className="h-1 transition-all duration-300"
          style={{ width: `${(step / total) * 100}%`, background: t.warning }}
        />
      </div>
    </div>
  );
}

// ── Navigation buttons ──────────────────────────────────────────────────────
function NavButtons({ onBack, onNext, onSkip, step, nextLabel = 'Continue', loading = false, nextDisabled = false, t }) {
  return (
    <div className="flex items-center justify-between pt-5 mt-5 border-t" style={{ borderColor: t.border }}>
      {step > 1 ? (
        <button
          type="button"
          onClick={onBack}
          className="wd-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer px-4 py-2.5 border"
          style={{ borderColor: t.border, color: t.muted }}
        >
          <ChevronLeft size={14} /> Back
        </button>
      ) : <div />}

      <div className="flex items-center gap-3">
        {onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="wd-mono text-xs cursor-pointer underline-offset-2 hover:underline"
            style={{ color: t.muted }}
          >
            Skip for now
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={loading || nextDisabled}
          className="wd-mono wd-btn text-xs font-bold px-5 py-2.5 flex items-center gap-2 cursor-pointer disabled:opacity-40"
          style={{ background: t.accent, color: t.accentText, border: 'none' }}
        >
          {loading ? 'Saving…' : nextLabel} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function WorkerSetupFlow() {
  const navigate = useNavigate();
  const { theme: t } = useTheme();

  // step: 0=welcome, 1=trade, 2=experience, 3=workArea, 4=travel, 5=availability, 6=bio, 7=photo, 8=review
  const [step, setStep] = useState(0);

  // Form data
  const [categories, setCategories] = useState([]);
  const [selectedCatIds, setSelectedCatIds] = useState([]);
  const [experience, setExperience] = useState(null);
  const [experienceLabel, setExperienceLabel] = useState('');
  const [locality, setLocality] = useState(LOCALITIES[0]);
  const [travelRadius, setTravelRadius] = useState(8);
  const [showAllPune, setShowAllPune] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Handle Photo selection & upload to Spring Boot /api/uploads/photo
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }
    setUploadingPhoto(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/uploads/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.url) {
        setProfileImage(res.data.url);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload photo to server. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // User info
  const rawUser = localStorage.getItem('user');
  const user = rawUser ? JSON.parse(rawUser) : null;
  const firstName = user?.fullName?.split(' ')[0] || 'there';

  // Load categories
  useEffect(() => {
    api.get('/Categories')
      .then(res => setCategories(res.data || []))
      .catch(() => { });
  }, []);

  const toggleCategory = (catId) => {
    setSelectedCatIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  const selectedCategoryNames = categories
    .filter(c => selectedCatIds.includes(c.id))
    .map(c => c.catName);

  // Save skills after trade step
  const saveSkills = async () => {
    if (selectedCatIds.length === 0) return;
    await Promise.all(selectedCatIds.map(id =>
      api.post('/worker/skills', { categoryId: id }).catch(() => { })
    ));
  };

  const goNext = async () => {
    setError('');
    setLoading(true);
    try {
      if (step === 1) await saveSkills();
      setStep(s => s + 1);
    } catch {
      // Non-blocking errors
      setStep(s => s + 1);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => setStep(s => s - 1);
  const skip = () => setStep(s => s + 1);

  const handleFinish = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/workers/profile', {
        bio,
        experience: experience ?? 0,
        locality,
        isAvailable,
        maxCapacity: 2,
        profileImage,
      });
      localStorage.setItem('worker_setup_complete', 'true');
      navigate('/worker/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save your profile. Please try again.');
      setLoading(false);
    }
  };

  // ── Outer shell ────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{ background: t.bg }}
    >
      {/* Card */}
      <div
        className="w-full max-w-lg border shadow-sm"
        style={{ background: t.surface, borderColor: t.borderStrong }}
      >
        {/* Card header */}
        <div
          className="flex items-center justify-between px-7 py-4 border-b"
          style={{ borderColor: t.border, background: t.cardHover }}
        >
          <Logo size={24} accentColor={t.accent} textColor={t.text} />
          {step > 0 && step < 8 && (
            <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>
              Worker setup
            </span>
          )}
          {step === 8 && (
            <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.success }}>
              ✓ Profile ready
            </span>
          )}
        </div>

        {/* Card body */}
        <div className="px-7 py-8">
          <ProgressBar step={step} total={TOTAL_DATA_STEPS} t={t} />

          {/* ── Step 0: Welcome ── */}
          {step === 0 && (
            <div className="space-y-6 text-center">
              <div
                className="w-14 h-14 mx-auto flex items-center justify-center border"
                style={{ borderColor: t.warning, background: 'rgba(183,121,31,0.10)', color: t.warning }}
              >
                <Briefcase size={24} />
              </div>
              <div>
                <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
                  Become a Workers Den worker
                </h1>
                <p className="text-sm mt-2 leading-relaxed" style={{ color: t.muted }}>
                  Let's set up your work profile. This helps us show you jobs that match your skills and location.
                </p>
              </div>
              <div
                className="flex items-center justify-center gap-2 wd-mono text-xs py-2.5 border"
                style={{ borderColor: t.border, color: t.muted }}
              >
                <Clock size={13} style={{ color: t.warning }} />
                About 2 minutes
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full wd-mono wd-btn text-xs font-bold py-3.5 flex items-center justify-center gap-2 cursor-pointer"
                style={{ background: t.accent, color: t.accentText, border: 'none' }}
              >
                Get started <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* ── Step 1: Trade ── */}
          {step === 1 && (
            <div>
              <h2 className="wd-display font-black text-xl tracking-tight mb-1" style={{ color: t.text }}>
                What kind of work do you do?
              </h2>
              <p className="wd-mono text-xs mb-5" style={{ color: t.muted }}>
                Select all that apply.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {categories.length === 0 ? (
                  <div className="col-span-2 wd-mono text-xs text-center py-4" style={{ color: t.muted }}>
                    Loading categories…
                  </div>
                ) : categories.map(c => {
                  const selected = selectedCatIds.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleCategory(c.id)}
                      className="flex items-center gap-3 p-3.5 border text-left cursor-pointer transition-all"
                      style={{
                        background: selected ? t.accentSoft : 'transparent',
                        borderColor: selected ? t.accent : t.border,
                      }}
                    >
                      <span
                        className="w-4 h-4 shrink-0 border flex items-center justify-center"
                        style={{
                          borderColor: selected ? t.accent : t.border,
                          background: selected ? t.accent : 'transparent',
                        }}
                      >
                        {selected && <Check size={10} color={t.accentText} strokeWidth={3} />}
                      </span>
                      <span className="text-sm font-medium" style={{ color: selected ? t.accent : t.text }}>
                        {c.catName}
                      </span>
                    </button>
                  );
                })}
              </div>
              <NavButtons step={step} onBack={goBack} onNext={goNext} onSkip={skip} loading={loading} t={t} />
            </div>
          )}

          {/* ── Step 2: Experience ── */}
          {step === 2 && (
            <div>
              <h2 className="wd-display font-black text-xl tracking-tight mb-1" style={{ color: t.text }}>
                How long have you been doing this work?
              </h2>
              <p className="wd-mono text-xs mb-5" style={{ color: t.muted }}>
                This helps customers understand your background.
              </p>
              <div className="space-y-2">
                {EXPERIENCE_OPTIONS.map(opt => {
                  const selected = experience === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setExperience(opt.value); setExperienceLabel(opt.label); }}
                      className="w-full flex items-center gap-3.5 px-4 py-3.5 border text-left cursor-pointer transition-all"
                      style={{
                        background: selected ? t.accentSoft : 'transparent',
                        borderColor: selected ? t.accent : t.border,
                      }}
                    >
                      <span
                        className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                        style={{ borderColor: selected ? t.accent : t.border }}
                      >
                        {selected && (
                          <span className="w-2 h-2 rounded-full" style={{ background: t.accent }} />
                        )}
                      </span>
                      <span className="text-sm font-medium" style={{ color: selected ? t.accent : t.text }}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <NavButtons step={step} onBack={goBack} onNext={goNext} nextDisabled={experience === null} loading={loading} t={t} />
            </div>
          )}

          {/* ── Step 3: Work Area ── */}
          {step === 3 && (
            <div>
              <h2 className="wd-display font-black text-xl tracking-tight mb-1" style={{ color: t.text }}>
                Where do you usually work?
              </h2>
              <p className="wd-mono text-xs mb-6" style={{ color: t.muted }}>
                We'll use this to show you nearby jobs first.
              </p>
              <div>
                <label className="block wd-mono text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: t.muted }}>
                  Your main work area
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.accent }} />
                  <select
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border text-sm outline-none appearance-none cursor-pointer"
                    style={{ borderColor: t.border, color: t.text, background: t.cardHover }}
                  >
                    {LOCALITIES.map(loc => (
                      <option key={loc} value={loc} style={{ background: t.surface }}>{loc}</option>
                    ))}
                  </select>
                </div>
              </div>
              <NavButtons step={step} onBack={goBack} onNext={goNext} loading={loading} t={t} />
            </div>
          )}

          {/* ── Step 4: Travel Range ── */}
          {step === 4 && (
            <div>
              <h2 className="wd-display font-black text-xl tracking-tight mb-1" style={{ color: t.text }}>
                How far are you willing to travel?
              </h2>
              <p className="wd-mono text-xs mb-7" style={{ color: t.muted }}>
                Jobs beyond this range won't appear unless you opt in.
              </p>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between wd-mono text-xs mb-3" style={{ color: t.muted }}>
                    <span>2 km</span>
                    <span className="font-bold text-sm" style={{ color: t.warning }}>Up to {travelRadius} km</span>
                    <span>15 km</span>
                  </div>
                  <input
                    type="range"
                    min={2} max={15} step={1}
                    value={travelRadius}
                    onChange={e => setTravelRadius(Number(e.target.value))}
                    className="w-full cursor-pointer"
                    style={{ accentColor: t.warning }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllPune(!showAllPune)}
                  className="w-full flex items-start gap-3 p-4 border cursor-pointer transition-all"
                  style={{
                    background: showAllPune ? 'rgba(183,121,31,0.08)' : 'transparent',
                    borderColor: showAllPune ? t.warning : t.border,
                  }}
                >
                  <span
                    className="w-4 h-4 shrink-0 mt-0.5 border flex items-center justify-center"
                    style={{
                      borderColor: showAllPune ? t.warning : t.border,
                      background: showAllPune ? t.warning : 'transparent',
                    }}
                  >
                    {showAllPune && <Check size={10} color="#fff" strokeWidth={3} />}
                  </span>
                  <div className="text-left">
                    <div className="text-sm font-medium" style={{ color: showAllPune ? t.warning : t.text }}>
                      Show me jobs across Pune
                    </div>
                    <div className="wd-mono text-[11px] mt-0.5" style={{ color: t.muted }}>
                      You'll see all available jobs, not just those near {locality}.
                    </div>
                  </div>
                </button>

                <p className="wd-mono text-[11px]" style={{ color: t.faint }}>
                  You can change this anytime from your dashboard.
                </p>
              </div>
              <NavButtons step={step} onBack={goBack} onNext={goNext} loading={loading} t={t} />
            </div>
          )}

          {/* ── Step 5: Availability ── */}
          {step === 5 && (
            <div>
              <h2 className="wd-display font-black text-xl tracking-tight mb-1" style={{ color: t.text }}>
                Are you available for work?
              </h2>
              <p className="wd-mono text-xs mb-6" style={{ color: t.muted }}>
                You can change your availability anytime from your dashboard.
              </p>
              <div className="space-y-3">
                {[
                  { label: 'Available', sub: 'Ready to receive job requests', value: true },
                  { label: 'Not available right now', sub: "I'll turn this on later", value: false },
                ].map(opt => {
                  const selected = isAvailable === opt.value;
                  return (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setIsAvailable(opt.value)}
                      className="w-full flex items-center gap-4 px-4 py-4 border text-left cursor-pointer transition-all"
                      style={{
                        background: selected
                          ? (opt.value ? 'rgba(47,125,79,0.08)' : t.accentSoft)
                          : 'transparent',
                        borderColor: selected
                          ? (opt.value ? t.success : t.accent)
                          : t.border,
                      }}
                    >
                      <span
                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                        style={{ borderColor: selected ? (opt.value ? t.success : t.accent) : t.border }}
                      >
                        {selected && (
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: opt.value ? t.success : t.accent }}
                          />
                        )}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          {opt.value && (
                            <span className="w-2 h-2 rounded-full" style={{ background: t.success }} />
                          )}
                          <span className="font-semibold text-sm" style={{ color: t.text }}>{opt.label}</span>
                        </div>
                        <span className="wd-mono text-[11px]" style={{ color: t.muted }}>{opt.sub}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <NavButtons step={step} onBack={goBack} onNext={goNext} loading={loading} t={t} />
            </div>
          )}

          {/* ── Step 6: Bio ── */}
          {step === 6 && (
            <div>
              <h2 className="wd-display font-black text-xl tracking-tight mb-1" style={{ color: t.text }}>
                Tell customers about yourself
              </h2>
              <p className="wd-mono text-xs mb-2" style={{ color: t.muted }}>
                A short note that appears on your profile. Optional.
              </p>
              <div
                className="px-3.5 py-2.5 border mb-1.5 wd-mono text-[11px] italic"
                style={{ borderColor: t.border, color: t.faint, background: t.cardHover }}
              >
                e.g. "AC technician with 5 years of experience, serving Wakad and Baner."
              </div>
              <textarea
                value={bio}
                onChange={e => { if (e.target.value.length <= 220) setBio(e.target.value); }}
                rows={4}
                placeholder="Write a short introduction…"
                className="w-full px-3.5 py-3 border outline-none resize-none text-sm"
                style={{ borderColor: t.border, color: t.text, background: t.surface }}
              />
              <div className="flex justify-between wd-mono text-[10px] mt-1" style={{ color: t.faint }}>
                <span>Optional — you can add this later</span>
                <span>{bio.length} / 220</span>
              </div>
              <NavButtons step={step} onBack={goBack} onNext={goNext} onSkip={skip} loading={loading} t={t} />
            </div>
          )}

          {/* ── Step 7: Photo ── */}
          {step === 7 && (
            <div>
              <h2 className="wd-display font-black text-xl tracking-tight mb-1" style={{ color: t.text }}>
                Add a profile photo
              </h2>
              <p className="wd-mono text-xs mb-6" style={{ color: t.muted }}>
                A clear photo helps customers recognize you when you arrive.
              </p>
              <div
                className="flex flex-col items-center gap-4 py-8 px-4 border-2 border-dashed text-center"
                style={{ borderColor: t.border, background: t.cardHover }}
              >
                {profileImage ? (
                  <img
                    src={getMediaUrl(profileImage)}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border-2 shadow-sm"
                    style={{ borderColor: t.accent }}
                  />
                ) : (
                  <div
                    className="w-16 h-16 flex items-center justify-center border rounded-full"
                    style={{ borderColor: t.border, background: t.surface, color: t.muted }}
                  >
                    <Camera size={24} />
                  </div>
                )}

                <div>
                  <div className="text-sm font-medium" style={{ color: t.text }}>
                    {profileImage ? 'Photo attached' : 'Upload your photo'}
                  </div>
                  <div className="wd-mono text-[11px] mt-1" style={{ color: t.muted }}>
                    JPG or PNG, max 5 MB
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <label
                    className={`wd-mono text-xs font-bold px-5 py-2.5 border cursor-pointer inline-flex items-center gap-1.5 ${uploadingPhoto ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ borderColor: t.accent, color: t.accent, background: t.accentSoft }}
                  >
                    {uploadingPhoto ? 'Uploading photo…' : 'Choose photo'}
                    <input
                      type="file"
                      accept="image/*"
                      disabled={uploadingPhoto}
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {profileImage && (
                    <button
                      type="button"
                      onClick={() => setProfileImage('')}
                      disabled={uploadingPhoto}
                      className="wd-mono text-xs font-bold px-3 py-2.5 border cursor-pointer hover:opacity-70"
                      style={{ borderColor: t.border, color: t.stamp }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <NavButtons step={step} onBack={goBack} onNext={() => setStep(8)} onSkip={() => setStep(8)} loading={loading} nextLabel="Continue" t={t} />
            </div>
          )}

          {/* ── Step 8: Review ── */}
          {step === 8 && (
            <div>
              <div className="text-center mb-6">
                <div
                  className="w-12 h-12 mx-auto flex items-center justify-center border mb-3"
                  style={{ borderColor: t.success, background: 'rgba(47,125,79,0.10)', color: t.success }}
                >
                  <Check size={22} />
                </div>
                <h2 className="wd-display font-black text-xl tracking-tight" style={{ color: t.text }}>
                  Your worker profile is ready
                </h2>
                <p className="wd-mono text-xs mt-1" style={{ color: t.muted }}>
                  Review your details, then start finding work.
                </p>
              </div>

              {/* Profile card */}
              <div className="border p-5 space-y-4" style={{ borderColor: t.border, background: t.cardHover }}>
                {/* Name & trades */}
                <div className="flex items-start justify-between gap-3 pb-4 border-b" style={{ borderColor: t.border }}>
                  <div>
                    <div className="font-bold text-base" style={{ color: t.text }}>
                      {user?.fullName || 'Your account'}
                    </div>
                    {selectedCategoryNames.length > 0 ? (
                      <div className="wd-mono text-xs mt-1" style={{ color: t.warning }}>
                        {selectedCategoryNames.join(' · ')}
                      </div>
                    ) : (
                      <div className="wd-mono text-xs mt-1" style={{ color: t.faint }}>No trade selected</div>
                    )}
                  </div>
                  <span
                    className="flex items-center gap-1.5 wd-mono text-[11px] font-bold px-2.5 py-1 border shrink-0"
                    style={{
                      borderColor: isAvailable ? t.success : t.border,
                      color: isAvailable ? t.success : t.muted,
                      background: isAvailable ? 'rgba(47,125,79,0.08)' : 'transparent',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: isAvailable ? t.success : t.muted }} />
                    {isAvailable ? 'Available' : 'Offline'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 wd-mono text-xs">
                  <div>
                    <span style={{ color: t.muted }}>Location</span>
                    <div className="flex items-center gap-1 mt-0.5 font-bold" style={{ color: t.text }}>
                      <MapPin size={11} style={{ color: t.accent }} /> {locality}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: t.muted }}>Travel range</span>
                    <div className="font-bold mt-0.5" style={{ color: t.text }}>Up to {travelRadius} km</div>
                  </div>
                  <div>
                    <span style={{ color: t.muted }}>Experience</span>
                    <div className="font-bold mt-0.5" style={{ color: t.text }}>
                      {experienceLabel || 'Not set'}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: t.muted }}>Max active jobs</span>
                    <div className="font-bold mt-0.5" style={{ color: t.text }}>0 / 2</div>
                  </div>
                </div>

                {bio && (
                  <div className="pt-3 border-t" style={{ borderColor: t.border }}>
                    <span className="wd-mono text-[10px]" style={{ color: t.muted }}>About</span>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: t.text }}>{bio}</p>
                  </div>
                )}
              </div>

              {error && (
                <div
                  className="mt-4 p-3 border wd-mono text-xs"
                  style={{ background: 'rgba(194,59,30,0.08)', borderColor: t.stamp, color: t.stamp }}
                >
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="w-full mt-5 wd-mono wd-btn text-xs font-bold py-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                style={{ background: t.accent, color: t.accentText, border: 'none' }}
              >
                {loading ? 'Setting up your account…' : 'Find available work'} <ArrowRight size={14} />
              </button>

              <button
                type="button"
                onClick={goBack}
                className="w-full mt-2 wd-mono text-xs py-2 cursor-pointer hover:opacity-70"
                style={{ color: t.muted }}
              >
                ← Make changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="wd-mono text-[10px] mt-5" style={{ color: t.faint }}>
        Workers Den · Est. 2026 · Pune, MH
      </p>
    </div>
  );
}
