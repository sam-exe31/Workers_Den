import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import CustomerNavbar from './CustomerNavbar';
import { LOCALITIES } from '../../../constants/localities';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Camera,
  Trash2,
  AlertCircle,
  Clock,
  Briefcase,
  Zap,
  ArrowRight,
  Upload,
  IndianRupee,
  TrendingUp,
  Sparkles,
  RotateCcw
} from 'lucide-react';

const URGENCY_OPTIONS = [
  { id: 'LOW', label: 'Low Urgency (Flexible Timeline)', sub: 'Can be scheduled within 24 hours or on a flexible timeline' },
  { id: 'MEDIUM', label: 'Medium Urgency (Standard Pickup)', sub: 'Standard dispatch queue — worker needed today' },
  { id: 'HIGH', label: 'High Urgency (Emergency / Immediate)', sub: 'Urgent priority dispatch — worker needed right away' },
];

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme: t } = useTheme();

  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);

  // Form state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState([]); // array of base64/URL image strings
  const [locality, setLocality] = useState(LOCALITIES[0]);
  const [address, setAddress] = useState('');
  const [preferredDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [preferredTime] = useState('10:00:00');
  const [urgency, setUrgency] = useState('HIGH');

  // Custom Pricing & Wage Offering State
  const [offeredPrice, setOfferedPrice] = useState(0);

  const [loading, setLoading] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories from DB
  useEffect(() => {
    api.get('/Categories')
      .then(res => {
        const list = res.data || [];
        setCategories(list);
        const urlCatName = searchParams.get('category');
        if (urlCatName) {
          const match = list.find(c => (c.catName || c.cat_name)?.toLowerCase() === urlCatName.toLowerCase());
          if (match) {
            setSelectedCategory(match);
            const basePrice = match.customerPrice || match.customer_price || 499;
            setOfferedPrice(basePrice);
          }
        }
      })
      .catch(() => { });
  }, [searchParams]);

  // When selected category changes, set default price
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    const basePrice = cat.customerPrice || cat.customer_price || 499;
    setOfferedPrice(basePrice);
    setError('');
  };

  // Base price parameters
  const standardPrice = selectedCategory
    ? (selectedCategory.customerPrice || selectedCategory.customer_price || 499)
    : 499;

  const standardPayout = selectedCategory
    ? (selectedCategory.workerPayout || selectedCategory.worker_payout || 399)
    : 399;

  // Minimum floor price: 70% of standard price
  const minPriceFloor = Math.round(standardPrice * 0.70);

  // Payout share ratio (worker receives ~80% of customer price)
  const payoutRatio = standardPayout / standardPrice || 0.80;
  const calculatedWorkerPayout = Math.max(1, Math.round(offeredPrice * payoutRatio));

  // Match Speed Feedback
  const priceDifference = offeredPrice - standardPrice;

  // Handle Photo selection & upload to Spring Boot /api/uploads/photo
  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      setError('You can attach up to 5 photos per request.');
      return;
    }

    setUploadingPhotos(true);
    setError('');

    try {
      const uploadedUrls = [];
      for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
          setError('Each photo must be under 10 MB.');
          continue;
        }
        const formData = new FormData();
        formData.append('file', file);

        const res = await api.post('/uploads/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.data?.url) {
          uploadedUrls.push(res.data.url);
        }
      }

      setPhotos(prev => [...prev, ...uploadedUrls]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload image to server. Please try again.');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    setError('');
    if (step === 1 && !selectedCategory) {
      setError('Please select a service category to continue.');
      return;
    }
    if (offeredPrice < minPriceFloor) {
      setError(`Offered price cannot be lower than the base minimum floor of ₹${minPriceFloor}.`);
      return;
    }
    if (step === 2 && !title.trim()) {
      setError('Please provide a short title for your request.');
      return;
    }
    if (step === 4 && !address.trim()) {
      setError('Please provide your street or apartment address.');
      return;
    }
    setStep(s => Math.min(s + 1, 6));
  };

  const handlePrevStep = () => {
    setError('');
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmitRequest = async () => {
    if (!selectedCategory) return;
    if (offeredPrice < minPriceFloor) {
      setError(`Price cannot be below minimum floor of ₹${minPriceFloor}.`);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const catIdValue = selectedCategory.id || selectedCategory.catId || selectedCategory.cat_id;
      const payload = {
        categoryId: Number(catIdValue),
        title,
        description: description || title,
        address,
        locality,
        preferredDate,
        preferredTime,
        urgency: urgency, // "LOW", "MEDIUM", or "HIGH"
        customerPrice: offeredPrice,
        workerPayout: calculatedWorkerPayout,
        photos: photos || [],
      };

      await api.post('/jobs', payload);

      // Save matching initiation timestamp for Uber-style live searching screen on dashboard
      localStorage.setItem('recent_request_time', Date.now().toString());
      navigate('/customer/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit request. Please check your network and try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans">
      <CustomerNavbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Wizard Card Header */}
        <div className="border p-6 space-y-4" style={{ background: t.surface, borderColor: t.border }}>
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
            <span className="wd-mono text-[10px] font-bold uppercase tracking-widest" style={{ color: t.accent }}>
              Create Service Request · Step {step} of 6
            </span>
            <span className="wd-mono text-[10px] font-bold" style={{ color: t.muted }}>
              {Math.round((step / 6) * 100)}% complete
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1" style={{ background: t.border }}>
            <div
              className="h-1 transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%`, background: t.accent }}
            />
          </div>

          {/* Error Banner */}
          {error && (
            <div
              className="p-3 text-xs wd-mono border flex items-start gap-2"
              style={{ background: 'rgba(194,59,30,0.06)', borderColor: t.stamp, color: t.stamp }}
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" /> {error}
            </div>
          )}

          {/* ── Step 1: Select Service Category & Custom Price ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
                  What do you need help with?
                </h1>
                <p className="wd-mono text-xs mt-1" style={{ color: t.muted }}>
                  Select the trade category for your request and customize your wage offer.
                </p>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {categories.map((c) => {
                  const catId = c.id || c.catId || c.cat_id;
                  const catName = c.catName || c.cat_name;
                  const price = c.customerPrice || c.customer_price || 499;
                  const isSelected = selectedCategory && (selectedCategory.id || selectedCategory.catId || selectedCategory.cat_id) === catId;

                  return (
                    <button
                      key={catId}
                      type="button"
                      onClick={() => handleSelectCategory(c)}
                      className="p-4 border text-left cursor-pointer transition-all flex items-start justify-between gap-3"
                      style={{
                        background: isSelected ? t.accentSoft : 'transparent',
                        borderColor: isSelected ? t.accent : t.border,
                      }}
                    >
                      <div>
                        <div className="font-bold text-sm" style={{ color: isSelected ? t.accent : t.text }}>
                          {catName}
                        </div>
                        <div className="wd-mono text-[11px] mt-1" style={{ color: t.muted }}>
                          {c.description || `Fixed price service in Pune`}
                        </div>
                        <div className="wd-mono font-bold text-xs mt-2" style={{ color: t.success }}>
                          Standard: ₹{price}
                        </div>
                      </div>
                      <span
                        className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          borderColor: isSelected ? t.accent : t.border,
                          background: isSelected ? t.accent : 'transparent',
                        }}
                      >
                        {isSelected && <Check size={12} color={t.accentText} strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* ── Custom Price & Wage Offering Control ── */}
              {selectedCategory && (
                <div
                  className="p-5 border space-y-4 mt-4 transition-all"
                  style={{ background: t.cardHover, borderColor: t.border }}
                >
                  <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: t.border }}>
                    <div>
                      <div className="wd-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accent }}>
                        Custom Price & Worker Wage Offer
                      </div>
                      <div className="text-xs font-semibold mt-0.5" style={{ color: t.text }}>
                        Offer more for extra work or faster worker dispatch
                      </div>
                    </div>
                    {offeredPrice !== standardPrice && (
                      <button
                        type="button"
                        onClick={() => setOfferedPrice(standardPrice)}
                        className="wd-mono text-[11px] flex items-center gap-1 cursor-pointer hover:opacity-75"
                        style={{ color: t.muted }}
                      >
                        <RotateCcw size={12} /> Reset to ₹{standardPrice}
                      </button>
                    )}
                  </div>

                  {/* Price input slider & numerical box */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="wd-mono text-xs" style={{ color: t.muted }}>
                        Min floor: ₹{minPriceFloor}
                      </span>
                      <div className="flex items-center gap-1 font-bold text-lg" style={{ color: t.success }}>
                        <span>Your Offer: ₹</span>
                        <input
                          type="number"
                          min={minPriceFloor}
                          step={50}
                          value={offeredPrice}
                          onChange={e => setOfferedPrice(Math.max(0, Number(e.target.value)))}
                          className="w-24 px-2 py-1 text-right border text-lg font-black outline-none wd-mono"
                          style={{ borderColor: t.border, color: t.text, background: t.surface }}
                        />
                      </div>
                    </div>

                    <input
                      type="range"
                      min={minPriceFloor}
                      max={standardPrice * 2.5}
                      step={50}
                      value={offeredPrice}
                      onChange={e => setOfferedPrice(Number(e.target.value))}
                      className="w-full cursor-pointer"
                      style={{ accentColor: t.accent }}
                    />

                    {/* Quick Boost Chips */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="wd-mono text-[10px]" style={{ color: t.muted }}>Quick add:</span>
                      {[
                        { label: '+₹100 (Faster match)', bump: 100 },
                        { label: '+₹200 (Urgent work)', bump: 200 },
                        { label: '+₹500 (Priority surge)', bump: 500 },
                      ].map(chip => (
                        <button
                          key={chip.bump}
                          type="button"
                          onClick={() => setOfferedPrice(standardPrice + chip.bump)}
                          className="wd-mono text-[11px] font-bold px-2.5 py-1 border cursor-pointer hover:opacity-85 transition-opacity"
                          style={{
                            borderColor: offeredPrice === standardPrice + chip.bump ? t.accent : t.border,
                            background: offeredPrice === standardPrice + chip.bump ? t.accentSoft : t.surface,
                            color: offeredPrice === standardPrice + chip.bump ? t.accent : t.text,
                          }}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Worker Payout & Dispatch Speed Indicator */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t text-xs wd-mono" style={{ borderColor: t.border }}>
                    <div>
                      <span style={{ color: t.muted }}>Worker Net Payout Share:</span>
                      <div className="font-bold text-sm mt-0.5" style={{ color: t.success }}>
                        ₹{calculatedWorkerPayout} payout
                      </div>
                    </div>

                    <div>
                      <span style={{ color: t.muted }}>Estimated Dispatch Speed:</span>
                      <div className="font-bold text-xs mt-0.5 flex items-center gap-1.5" style={{
                        color: priceDifference > 0 ? t.warning : priceDifference < 0 ? t.stamp : t.accent
                      }}>
                        {priceDifference > 0 ? (
                          <>
                            <Zap size={13} className="fill-current" />
                            <span>⚡ Priority Dispatch (~15s match)</span>
                          </>
                        ) : priceDifference < 0 ? (
                          <>
                            <AlertCircle size={13} />
                            <span>Slower Match (Below standard rate)</span>
                          </>
                        ) : (
                          <>
                            <Clock size={13} />
                            <span>Standard Queue (~45s match)</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {offeredPrice < minPriceFloor && (
                    <div className="p-2.5 border text-xs wd-mono" style={{ background: 'rgba(194,59,30,0.08)', borderColor: t.stamp, color: t.stamp }}>
                      ⚠️ Price cannot be lower than ₹{minPriceFloor} minimum floor threshold.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── Step 2: Work Description ── */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
                  Tell us about the work
                </h1>
                <p className="wd-mono text-xs mt-1" style={{ color: t.muted }}>
                  Describe the problem so nearby workers can understand the job before matching.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs wd-mono font-bold uppercase tracking-wider mb-1.5" style={{ color: t.muted }}>
                    Request Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Kitchen sink pipe leaking from underneath"
                    className="w-full px-3.5 py-3 border text-sm outline-none"
                    style={{ borderColor: t.border, color: t.text, background: t.surface }}
                  />
                </div>

                <div>
                  <label className="block text-xs wd-mono font-bold uppercase tracking-wider mb-1.5" style={{ color: t.muted }}>
                    Detailed Problem Description
                  </label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe what needs to be fixed, installed, moved, or cleaned…"
                    className="w-full px-3.5 py-3 border text-sm outline-none resize-none"
                    style={{ borderColor: t.border, color: t.text, background: t.surface }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Photos ── */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
                  Add photos of the work
                </h1>
                <p className="wd-mono text-xs mt-1" style={{ color: t.muted }}>
                  Photos help workers evaluate the scope before accepting. Optional.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Thumbnails */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {photos.map((src, i) => (
                      <div key={i} className="relative aspect-square border overflow-hidden group" style={{ borderColor: t.border }}>
                        <img src={src} alt={`Attachment ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-80 group-hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="flex flex-col items-center justify-center gap-3 py-8 px-4 border-2 border-dashed text-center"
                  style={{ borderColor: t.border, background: t.cardHover }}
                >
                  <Camera size={26} style={{ color: t.muted }} />
                  <div>
                    <div className="text-sm font-medium" style={{ color: t.text }}>
                      {photos.length > 0 ? `${photos.length} photo(s) attached` : 'Attach photos of the issue'}
                    </div>
                    <div className="wd-mono text-[11px] mt-0.5" style={{ color: t.muted }}>
                      Upload up to 5 photos (max 5 MB each)
                    </div>
                  </div>

                  {photos.length < 5 && (
                    <label
                      className="wd-mono text-xs font-bold px-4 py-2 border cursor-pointer inline-flex items-center gap-1.5"
                      style={{ borderColor: t.accent, color: t.accent, background: t.accentSoft }}
                    >
                      <Upload size={13} />
                      {uploadingPhotos ? 'Uploading photo…' : 'Choose photos'}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={uploadingPhotos}
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 4: Location ── */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
                  Where is the work?
                </h1>
                <p className="wd-mono text-xs mt-1" style={{ color: t.muted }}>
                  Provide your location so we can notify available workers in your area.
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs wd-mono font-bold uppercase tracking-wider mb-1.5" style={{ color: t.muted }}>
                    Locality / Sector
                  </label>
                  <select
                    value={locality}
                    onChange={e => setLocality(e.target.value)}
                    className="w-full px-3.5 py-3 border text-sm outline-none"
                    style={{ borderColor: t.border, color: t.text, background: t.surface }}
                  >
                    {LOCALITIES.map(loc => (
                      <option key={loc} value={loc} style={{ background: t.surface }}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs wd-mono font-bold uppercase tracking-wider mb-1.5" style={{ color: t.muted }}>
                    Street Address / House & Apartment No.
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Flat 402, Building A, Sunrise Apartments"
                    className="w-full px-3.5 py-3 border text-sm outline-none"
                    style={{ borderColor: t.border, color: t.text, background: t.surface }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 5: Urgency Selection ── */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
                  Dispatch Urgency
                </h1>
                <p className="wd-mono text-xs mt-1" style={{ color: t.muted }}>
                  How quickly do you need a worker dispatched to your location?
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                {URGENCY_OPTIONS.map(opt => {
                  const isSelected = urgency === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setUrgency(opt.id)}
                      className="w-full flex items-center gap-3.5 px-4 py-3.5 border text-left cursor-pointer transition-all"
                      style={{
                        background: isSelected ? t.accentSoft : 'transparent',
                        borderColor: isSelected ? t.accent : t.border,
                      }}
                    >
                      <span
                        className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0"
                        style={{ borderColor: isSelected ? t.accent : t.border }}
                      >
                        {isSelected && <span className="w-2 h-2 rounded-full" style={{ background: t.accent }} />}
                      </span>
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2" style={{ color: isSelected ? t.accent : t.text }}>
                          {opt.label}
                          {opt.id === 'HIGH' && (
                            <span className="wd-mono text-[10px] font-bold px-1.5 py-0.5 border" style={{ borderColor: '#DC2626', color: '#DC2626', background: 'rgba(220,38,38,0.06)' }}>
                              Urgent
                            </span>
                          )}
                        </div>
                        <div className="wd-mono text-[11px]" style={{ color: t.muted }}>
                          {opt.sub}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 6: Review & Send ── */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <h1 className="wd-display font-black text-2xl tracking-tight" style={{ color: t.text }}>
                  Review your request & offer
                </h1>
                <p className="wd-mono text-xs mt-1" style={{ color: t.muted }}>
                  Everything look good? Click "Send Request" to start dispatch matching.
                </p>
              </div>

              <div className="border p-5 space-y-4" style={{ borderColor: t.border, background: t.cardHover }}>
                <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: t.border }}>
                  <div>
                    <span className="wd-mono text-[10px] font-bold uppercase" style={{ color: t.accent }}>
                      {selectedCategory?.catName || selectedCategory?.cat_name}
                    </span>
                    <h3 className="font-bold text-base mt-0.5" style={{ color: t.text }}>{title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="wd-mono text-[10px]" style={{ color: t.muted }}>Customer Price</div>
                    <div className="wd-display font-black text-xl" style={{ color: t.success }}>
                      ₹{offeredPrice}
                    </div>
                  </div>
                </div>

                {description && (
                  <div>
                    <span className="wd-mono text-[10px]" style={{ color: t.muted }}>Description</span>
                    <p className="text-xs mt-0.5 leading-relaxed" style={{ color: t.text }}>{description}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3 wd-mono text-xs pt-2 border-t" style={{ borderColor: t.border }}>
                  <div>
                    <span style={{ color: t.muted }}>Location</span>
                    <div className="font-semibold mt-0.5" style={{ color: t.text }}>{locality}, {address}</div>
                  </div>
                  <div>
                    <span style={{ color: t.muted }}>Photos</span>
                    <div className="font-semibold mt-0.5" style={{ color: t.text }}>{photos.length} attached</div>
                  </div>
                  <div>
                    <span style={{ color: t.muted }}>Worker Payout</span>
                    <div className="font-bold mt-0.5" style={{ color: t.success }}>₹{calculatedWorkerPayout}</div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={loading || offeredPrice < minPriceFloor}
                onClick={handleSubmitRequest}
                className="w-full wd-mono wd-btn text-xs font-bold py-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
                style={{ background: t.accent, color: t.accentText, border: 'none' }}
              >
                {loading ? 'Submitting & Dispatching…' : 'Send Request & Match Worker'} <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t mt-4" style={{ borderColor: t.border }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="wd-mono text-xs font-bold flex items-center gap-1.5 px-4 py-2 border cursor-pointer"
                style={{ borderColor: t.border, color: t.muted }}
              >
                <ChevronLeft size={14} /> Back
              </button>
            ) : <div />}

            {step < 6 && (
              <button
                type="button"
                disabled={offeredPrice < minPriceFloor}
                onClick={handleNextStep}
                className="wd-mono wd-btn text-xs font-bold px-5 py-2.5 flex items-center gap-1.5 cursor-pointer ml-auto disabled:opacity-40"
                style={{ background: t.accent, color: t.accentText, border: 'none' }}
              >
                Continue <ChevronRight size={14} />
              </button>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
