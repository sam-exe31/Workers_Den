import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import api from '../../api/axiosClient';

export function StarRating({ value = 0, size = 14, interactive = false, onChange }) {
  const { theme: t } = useTheme();
  const [hoverValue, setHoverValue] = useState(0);
  const display = interactive ? (hoverValue || value) : value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          strokeWidth={1.5}
          className={interactive ? 'cursor-pointer' : ''}
          style={{
            color: star <= display ? '#F59E0B' : t.border,
            fill: star <= display ? '#F59E0B' : 'transparent',
          }}
          onMouseEnter={() => interactive && setHoverValue(star)}
          onMouseLeave={() => interactive && setHoverValue(0)}
          onClick={() => interactive && onChange && onChange(star)}
        />
      ))}
    </div>
  );
}

export function ReviewForm({ requestId, onSubmitted }) {
  const { mode, theme: t } = useTheme();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/reviews', { requestId, rating, reviewText });
      onSubmitted && onSubmitted(res.data);
    } catch (err) {
      const message = err.response?.data?.message ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        'Could not submit the review right now.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-5 space-y-4" style={{ background: t.surface, borderColor: t.border }}>
      <div>
        <div className="wd-mono text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: t.accent }}>
          RATE THIS TECHNICIAN
        </div>
        <StarRating value={rating} size={22} interactive onChange={setRating} />
      </div>

      <div>
        <label className="block text-xs wd-mono uppercase tracking-wider font-semibold mb-1.5" style={{ color: t.muted }}>
          Notes for other customers (optional)
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={3}
          placeholder="How was the work quality, punctuality, and communication?"
          className="w-full px-3 py-2.5 text-xs bg-transparent border outline-none resize-none"
          style={{ borderColor: t.border, color: t.text }}
          onFocus={(e) => (e.target.style.borderColor = t.accent)}
          onBlur={(e) => (e.target.style.borderColor = t.border)}
        />
      </div>

      {error && (
        <div className="text-xs wd-mono p-2.5 border" style={{
          background: mode === 'light' ? '#FEE2E2' : '#3B1818',
          borderColor: mode === 'light' ? '#F87171' : '#7F2323',
          color: mode === 'light' ? '#B91C1C' : '#FCA5A5',
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="wd-mono text-xs font-bold px-5 py-2.5 flex items-center gap-2 cursor-pointer disabled:opacity-50"
        style={{ background: t.accent, color: t.accentText, border: 'none' }}
      >
        <Send size={13} /> {submitting ? 'SUBMITTING...' : 'SUBMIT REVIEW'}
      </button>
    </form>
  );
}

export function ReviewList({ reviews }) {
  const { theme: t } = useTheme();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="border p-6 text-center wd-mono text-xs" style={{ background: t.surface, borderColor: t.border, color: t.muted }}>
        No reviews logged yet.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {reviews.map((r) => (
        <div key={r.reviewId} className="border p-4" style={{ background: t.surface, borderColor: t.border }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="wd-display font-bold text-sm" style={{ color: t.text }}>{r.customerName || 'Verified Customer'}</span>
            <StarRating value={r.rating} size={13} />
          </div>
          {r.reviewText && (
            <p className="text-xs leading-relaxed" style={{ color: t.muted }}>{r.reviewText}</p>
          )}
        </div>
      ))}
    </div>
  );
}
