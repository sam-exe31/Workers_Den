import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import CustomerNavbar from '../../pages/Customer/CustomerNavbar';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  CheckCircle2,
  Wrench,
  Sparkles,
  Zap
} from 'lucide-react';

const CATEGORY_SERVICES = {
  Plumbing: {
    price: 499,
    tasks: ['Leaking Pipe / Tap Repair', 'Drainage Blockage Unclogging', 'Flush Tank / Valve Fix', 'Water Meter / Pump Fitment'],
    guarantee: '30-day leak-free warranty on all pipe replacements.',
  },
  Electrical: {
    price: 399,
    tasks: ['Breaker / MCB Tripping Fix', 'Switchboard / Socket Wiring', 'Fan / Chandelier Installation', 'Appliance Load Inspection'],
    guarantee: 'Standardized certified component & surge inspection.',
  },
  Carpentry: {
    price: 599,
    tasks: ['Door Lock / Latch Replacement', 'Furniture Assembly / Tightening', 'Hinges & Handle Fittings', 'Wooden Shelf Alignment'],
    guarantee: 'Zero-wobble guaranteed alignment on hardware fittings.',
  },
  Painting: {
    price: 799,
    tasks: ['Waterproof Patch Coating', 'Wall Stain Priming & Touch-Up', 'Door / Window Grille Enamel', 'Ceiling Dampness Sealing'],
    guarantee: 'Smooth uniform finish with scrape-proof sealers.',
  },
  Cleaning: {
    price: 349,
    tasks: ['Deep Kitchen Scrub & Degrease', 'Bathroom Tile & Grout Scaling', 'Balcony / Window Wash', 'Full Surface Sanitation'],
    guarantee: 'Medical-grade antibacterial disinfectants utilized.',
  },
  'AC Repair': {
    price: 449,
    tasks: ['Filter Foam Cleaning & Wash', 'Cooling Gas Diagnostic Check', 'Drain Pipe Leak Clearance', 'Compressor Noise Inspection'],
    guarantee: 'Optimal cooling airflow calibration guaranteed.',
  },
};

const SECTORS = ['Kothrud', 'Baner', 'Wakad', 'Viman Nagar', 'Hinjawadi', 'Aundh', 'Hadapsar'];

const ALL_TIME_SLOTS = [
  { label: '09:00 AM - 11:00 AM', timeValue: '09:00:00', startHour: 9 },
  { label: '11:00 AM - 01:00 PM', timeValue: '11:00:00', startHour: 11 },
  { label: '02:00 PM - 04:00 PM', timeValue: '14:00:00', startHour: 14 },
  { label: '04:00 PM - 06:00 PM', timeValue: '16:00:00', startHour: 16 },
  { label: '06:00 PM - 08:00 PM', timeValue: '18:00:00', startHour: 18 },
];

const URGENCY_LEVELS = [
  { level: 'LOW', label: 'Low Urgency', desc: 'Flexible schedule within 24-48 hrs' },
  { level: 'MEDIUM', label: 'Medium Urgency', desc: 'Standard same-day resolution' },
  { level: 'HIGH', label: 'High Urgency', desc: 'Immediate dispatch / Priority slot' },
];

export default function CreateJobPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mode, theme: t } = useTheme();

  const brandAccent = mode === 'dark' ? '#A78BFA' : '#6247AA';
  const brandAccentSoft = mode === 'dark' ? 'rgba(167, 139, 250, 0.15)' : '#EDE9F6';

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  const getAvailableSlots = (dateString) => {
    if (dateString === todayStr) {
      return ALL_TIME_SLOTS.filter((s) => s.startHour > currentHour);
    }
    return ALL_TIME_SLOTS;
  };

  const initialSlots = getAvailableSlots(todayStr);
  const defaultDate = initialSlots.length === 0 
    ? new Date(Date.now() + 86400000).toISOString().split('T')[0] 
    : todayStr;

  const validInitialSlots = getAvailableSlots(defaultDate);
  const defaultSlot = validInitialSlots.length > 0 ? validInitialSlots[0] : ALL_TIME_SLOTS[0];

  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    catId: searchParams.get('catId') || '',
    catName: 'Electrical',
    selectedTask: '',
    title: '',
    description: '',
    locality: searchParams.get('locality') || 'Kothrud',
    address: '',
    preferredDate: defaultDate,
    preferredTime: defaultSlot.timeValue,
    preferredTimeLabel: defaultSlot.label,
    urgency: 'MEDIUM',
  });

  const availableTimeSlots = getAvailableSlots(formData.preferredDate);

  useEffect(() => {
    api.get('/Categories')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setCategories(res.data);
          const initialCat = res.data.find((c) => String(c.id || c.catId) === String(formData.catId)) || res.data[0];
          const initialId = initialCat.id || initialCat.catId || 1;
          const initialName = initialCat.catName || 'Electrical';
          
          setFormData((prev) => ({
            ...prev,
            catId: initialId,
            catName: initialName,
            selectedTask: CATEGORY_SERVICES[initialName]?.tasks[0] || '',
            title: `${initialName}: ${CATEGORY_SERVICES[initialName]?.tasks[0] || 'Inspection & Fix'}`,
          }));
        }
      })
      .catch(() => {
        setCategories(Object.keys(CATEGORY_SERVICES).map((name, idx) => ({ id: idx + 1, catName: name, customerPrice: CATEGORY_SERVICES[name].price })));
        setFormData((prev) => ({ ...prev, catId: 1 }));
      });
  }, []);

  const activeServiceMeta = CATEGORY_SERVICES[formData.catName] || CATEGORY_SERVICES['Electrical'];
  const fixedPrice = activeServiceMeta.price;

  const handleCategorySelect = (cat) => {
    const selectedId = cat.id || cat.catId || 1;
    const selectedName = cat.catName || 'Electrical';
    const firstTask = CATEGORY_SERVICES[selectedName]?.tasks[0] || '';

    setFormData((prev) => ({
      ...prev,
      catId: selectedId,
      catName: selectedName,
      selectedTask: firstTask,
      title: `${selectedName}: ${firstTask || 'Standard Service'}`,
    }));
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    if (selectedDate < todayStr) {
      setErrorMsg('Cannot select a past date.');
      return;
    }

    const nextAvailableSlots = getAvailableSlots(selectedDate);
    if (nextAvailableSlots.length === 0) {
      setErrorMsg('All dispatch windows for today have elapsed. Please select tomorrow.');
      return;
    }

    setErrorMsg('');
    const matchingSlot = nextAvailableSlots.find((s) => s.label === formData.preferredTimeLabel) || nextAvailableSlots[0];

    setFormData((prev) => ({
      ...prev,
      preferredDate: selectedDate,
      preferredTime: matchingSlot.timeValue,
      preferredTimeLabel: matchingSlot.label,
    }));
  };

  const handleTimeSlotChange = (e) => {
    const selected = ALL_TIME_SLOTS.find((s) => s.label === e.target.value) || ALL_TIME_SLOTS[0];

    if (formData.preferredDate === todayStr && selected.startHour <= currentHour) {
      setErrorMsg('This time window has already elapsed for today. Please choose an upcoming slot.');
      return;
    }

    setErrorMsg('');
    setFormData((prev) => ({
      ...prev,
      preferredTime: selected.timeValue,
      preferredTimeLabel: selected.label,
    }));
  };

  const validateSchedule = () => {
    if (!formData.catId) {
      setErrorMsg('Please select a valid service category.');
      return false;
    }

    if (!formData.preferredDate) {
      setErrorMsg('Please select a valid service date.');
      return false;
    }

    if (formData.preferredDate < todayStr) {
      setErrorMsg('Cannot schedule work orders in the past.');
      return false;
    }

    if (!formData.address || formData.address.trim().length < 5) {
      setErrorMsg('Please enter a complete address (minimum 5 characters).');
      return false;
    }

    if (!formData.locality) {
      setErrorMsg('Please select an assigned Pune sector.');
      return false;
    }

    if (!formData.urgency) {
      setErrorMsg('Please select an urgency level.');
      return false;
    }

    setErrorMsg('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateSchedule()) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const payload = {
        categoryId: Number(formData.catId),
        title: formData.selectedTask ? `${formData.catName}: ${formData.selectedTask}` : formData.title,
        description: formData.description ? `${formData.selectedTask ? `Task: ${formData.selectedTask}. ` : ''}${formData.description}` : `Standard ${formData.catName} work order.`,
        locality: formData.locality,
        address: formData.address.trim(),
        preferredDate: formData.preferredDate,
        preferredTime: formData.preferredTime,
        urgency: formData.urgency,
      };

      const res = await api.post('/jobs', payload);
      const createdId = res.data.requestId || res.data.id || res.data.serviceId;
      navigate(`/jobs/${createdId}`, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        'Could not dispatch work order. Please verify parameters.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ background: t.bg, color: t.text }}
      className="min-h-screen flex flex-col font-sans transition-colors duration-150 select-none"
    >
      <CustomerNavbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8 animate-in fade-in duration-200">
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: t.border }}>
          <button
            type="button"
            onClick={() => (step > 1 ? setStep(step - 1) : navigate('/customer/dashboard'))}
            className="wd-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-70 transition-opacity"
            style={{ color: t.muted }}
          >
            <ArrowLeft size={14} /> {step > 1 ? 'PREVIOUS STEP' : 'BACK TO DASHBOARD'}
          </button>

          <span
            className="wd-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border"
            style={{ borderColor: brandAccent, color: brandAccent, background: brandAccentSoft }}
          >
            STEP 0{step} OF 03 // DISPATCH FLOW
          </span>
        </div>

        {errorMsg && (
          <div
            className="p-3 text-xs wd-mono border flex items-start gap-2 animate-in zoom-in-95 duration-150"
            style={{
              background: mode === 'light' ? '#FEE2E2' : '#451A03',
              borderColor: mode === 'light' ? '#F87171' : '#F59E0B',
              color: mode === 'light' ? '#B91C1C' : '#FCD34D',
            }}
          >
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <span>[VALIDATION_ERR]: {errorMsg}</span>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
            <div>
              <h1 className="wd-display font-black text-2xl uppercase tracking-tight" style={{ color: t.text }}>
                Choose Service & Task
              </h1>
              <p className="text-xs wd-mono mt-1" style={{ color: t.muted }}>
                Guided trade specifications with locked standard pricing.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {categories.map((cat) => {
                const isSelected = Number(formData.catId) === Number(cat.id || cat.catId);
                return (
                  <button
                    key={cat.id || cat.catName}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className="p-3 border text-center cursor-pointer transition-all duration-150 hover:-translate-y-0.5 active:scale-95"
                    style={{
                      borderColor: isSelected ? brandAccent : t.border,
                      background: isSelected ? brandAccentSoft : t.surface,
                      color: isSelected ? brandAccent : t.text,
                    }}
                  >
                    <div className="wd-mono text-[10px] font-bold">TR-0{cat.id || '1'}</div>
                    <div className="wd-display font-black text-xs uppercase mt-0.5">{cat.catName}</div>
                  </button>
                );
              })}
            </div>

            <div
              className="border p-6 space-y-4"
              style={{ background: t.surface, borderColor: t.border }}
            >
              <div className="flex justify-between items-center border-b pb-3" style={{ borderColor: t.border }}>
                <span className="wd-mono text-xs font-bold" style={{ color: brandAccent }}>
                  INCLUDED {formData.catName.toUpperCase()} PROTOCOLS
                </span>
                <span className="wd-mono text-xs font-bold" style={{ color: t.text }}>
                  Standard Fee: ₹{fixedPrice}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeServiceMeta.tasks.map((task) => {
                  const isChecked = formData.selectedTask === task;
                  return (
                    <div
                      key={task}
                      onClick={() => setFormData((prev) => ({ ...prev, selectedTask: task }))}
                      className="p-3.5 border flex items-center justify-between cursor-pointer transition-all hover:border-current active:scale-98"
                      style={{
                        borderColor: isChecked ? brandAccent : t.border,
                        background: isChecked ? brandAccentSoft : t.cardHover,
                      }}
                    >
                      <span className="text-xs font-semibold" style={{ color: isChecked ? brandAccent : t.text }}>
                        {task}
                      </span>
                      <CheckCircle2 size={16} style={{ color: isChecked ? brandAccent : 'transparent' }} />
                    </div>
                  );
                })}
              </div>

              <div
                className="p-3 border flex items-start gap-2.5 text-xs wd-mono mt-2"
                style={{ borderColor: brandAccent, background: brandAccentSoft, color: brandAccent }}
              >
                <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                <span>{activeServiceMeta.guarantee}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full wd-mono wd-btn text-xs font-bold py-3.5 flex items-center justify-center gap-2 text-white shadow-xs cursor-pointer transition-all hover:opacity-90 active:scale-95"
              style={{ background: brandAccent, border: 'none' }}
            >
              CONTINUE TO LOCATION & URGENCY <ArrowRight size={14} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
            <div>
              <h1 className="wd-display font-black text-2xl uppercase tracking-tight" style={{ color: t.text }}>
                Location, Schedule & Urgency
              </h1>
              <p className="text-xs wd-mono mt-1" style={{ color: t.muted }}>
                Specify your Pune sector, upcoming arrival window, and dispatch priority.
              </p>
            </div>

            <div className="border p-6 space-y-5" style={{ background: t.surface, borderColor: t.border }}>
              <div>
                <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>
                  Assigned Sector (Pune Metro)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SECTORS.map((sec) => {
                    const isSec = formData.locality === sec;
                    return (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, locality: sec }))}
                        className="py-2.5 px-3 border text-xs wd-mono font-bold cursor-pointer transition-all active:scale-95"
                        style={{
                          borderColor: isSec ? brandAccent : t.border,
                          background: isSec ? brandAccentSoft : 'transparent',
                          color: isSec ? brandAccent : t.text,
                        }}
                      >
                        {sec}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>
                  Apartment Unit / Street Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="e.g. Flat 402, Sunshine Heights, Paud Road"
                  className="w-full px-3 py-2.5 text-xs wd-mono bg-transparent border outline-none font-mono transition-colors focus:border-current"
                  style={{ borderColor: t.border, color: t.text }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={formData.preferredDate}
                    onChange={handleDateChange}
                    className="w-full px-3 py-2 text-xs wd-mono bg-transparent border outline-none cursor-pointer"
                    style={{ borderColor: t.border, color: t.text }}
                  />
                </div>

                <div>
                  <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>
                    Arrival Window {formData.preferredDate === todayStr ? '(Real-Time Valid Slots)' : ''}
                  </label>
                  <select
                    value={formData.preferredTimeLabel}
                    onChange={handleTimeSlotChange}
                    className="w-full px-3 py-2.5 text-xs wd-mono border outline-none cursor-pointer"
                    style={{ borderColor: t.border, background: t.surface, color: t.text }}
                  >
                    {availableTimeSlots.map((slot) => (
                      <option key={slot.label} value={slot.label}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-2" style={{ color: t.muted }}>
                  Dispatch Urgency Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {URGENCY_LEVELS.map(({ level, label, desc }) => {
                    const isSelected = formData.urgency === level;
                    return (
                      <div
                        key={level}
                        onClick={() => setFormData((prev) => ({ ...prev, urgency: level }))}
                        className="p-3 border cursor-pointer transition-all flex flex-col justify-between active:scale-98"
                        style={{
                          borderColor: isSelected ? brandAccent : t.border,
                          background: isSelected ? brandAccentSoft : t.cardHover,
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="wd-mono text-xs font-bold" style={{ color: isSelected ? brandAccent : t.text }}>
                            {label}
                          </span>
                          <span
                            className="w-2 h-2 rounded-full inline-block"
                            style={{
                              background: level === 'HIGH' ? '#EF4444' : level === 'MEDIUM' ? '#F59E0B' : '#10B981',
                            }}
                          />
                        </div>
                        <p className="text-[10px] wd-mono leading-tight" style={{ color: t.muted }}>
                          {desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (validateSchedule()) {
                  setStep(3);
                }
              }}
              className="w-full wd-mono wd-btn text-xs font-bold py-3.5 flex items-center justify-center gap-2 text-white shadow-xs cursor-pointer transition-all hover:opacity-90 active:scale-95"
              style={{ background: brandAccent, border: 'none' }}
            >
              REVIEW ORDER SUMMARY <ArrowRight size={14} />
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
            <div>
              <h1 className="wd-display font-black text-2xl uppercase tracking-tight" style={{ color: t.text }}>
                Confirm Work Order
              </h1>
              <p className="text-xs wd-mono mt-1" style={{ color: t.muted }}>
                Review locked platform parameters before broadcast.
              </p>
            </div>

            <div className="border p-6 space-y-4" style={{ background: t.surface, borderColor: t.border }}>
              <div className="space-y-2 text-xs wd-mono">
                <div className="flex justify-between border-b pb-2" style={{ borderColor: t.border }}>
                  <span style={{ color: t.muted }}>Service Protocol</span>
                  <strong style={{ color: brandAccent }}>{formData.catName} ({formData.selectedTask || 'General'})</strong>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: t.border }}>
                  <span style={{ color: t.muted }}>Assigned Sector</span>
                  <strong style={{ color: t.text }}>{formData.locality}, Pune</strong>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: t.border }}>
                  <span style={{ color: t.muted }}>Arrival Schedule</span>
                  <strong style={{ color: t.text }}>{formData.preferredDate} ({formData.preferredTimeLabel})</strong>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: t.border }}>
                  <span style={{ color: t.muted }}>Urgency Level</span>
                  <strong style={{ color: formData.urgency === 'HIGH' ? '#EF4444' : brandAccent }}>{formData.urgency} PRIORITY</strong>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: t.border }}>
                  <span style={{ color: t.muted }}>Destination Unit</span>
                  <strong style={{ color: t.text }}>{formData.address}</strong>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold">
                  <span style={{ color: t.text }}>Standard Platform Fee</span>
                  <span style={{ color: brandAccent }}>₹{fixedPrice} (Cash on closeout)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1" style={{ color: t.muted }}>
                  Additional Notes for Technician (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Please bring an extension ladder; parking available in basement."
                  className="w-full px-3 py-2 text-xs wd-mono bg-transparent border outline-none"
                  style={{ borderColor: t.border, color: t.text }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full wd-mono wd-btn text-xs font-bold py-3.5 flex items-center justify-center gap-2 text-white shadow-xs cursor-pointer disabled:opacity-50 transition-all hover:opacity-90 active:scale-95"
              style={{ background: brandAccent, border: 'none' }}
            >
              {loading ? 'BROADCASTING DISPATCH...' : 'CONFIRM & DISPATCH ORDER →'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
