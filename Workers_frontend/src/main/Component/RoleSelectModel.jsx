import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../theme/ThemeContext';
import { User, Wrench, X, ArrowRight } from 'lucide-react';

export default function RoleSelectModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { theme: t } = useTheme();

  if (!isOpen) return null;

  const handleSelectRole = (role) => {
    onClose();
    navigate(`/register?role=${role}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-xs bg-black/40 animate-in fade-in duration-150 select-none">
      <div
        className="relative w-full max-w-md p-6 sm:p-8 border shadow-xl animate-in zoom-in-95 duration-150"
        style={{
          background: t.surface,
          borderColor: t.border,
          color: t.text,
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border hover:opacity-70 cursor-pointer"
          style={{ borderColor: t.border, color: t.muted }}
        >
          <X size={15} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <span
            className="wd-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border"
            style={{ borderColor: t.border, color: t.accent, background: t.accentSoft }}
          >
            ONBOARDING PROTOCOL // ROLE ASSIGNMENT
          </span>
          <h2 className="wd-display font-black text-2xl uppercase tracking-tight mt-2" style={{ color: t.text }}>
            Join Workers Den
          </h2>
          <p className="text-xs wd-mono mt-1" style={{ color: t.muted }}>
            Choose your platform operational capacity to continue.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="space-y-3">
          {/* Customer Choice */}
          <div
            onClick={() => handleSelectRole('CUSTOMER')}
            className="p-4 border cursor-pointer transition-all duration-150 hover:-translate-y-0.5 group flex items-start gap-4"
            style={{
              borderColor: t.border,
              background: t.cardHover,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
          >
            <div
              className="w-10 h-10 border flex items-center justify-center shrink-0"
              style={{ borderColor: t.border, background: t.accentSoft, color: t.accent }}
            >
              <User size={20} strokeWidth={2.2} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="wd-display font-black text-sm uppercase" style={{ color: t.text }}>
                  I Want to Hire / Customer
                </span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.accent }} />
              </div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: t.muted }}>
                Book domestic services, lock standardized flat pricing, and track technicians live.
              </p>
            </div>
          </div>

          {/* Worker Choice */}
          <div
            onClick={() => handleSelectRole('WORKER')}
            className="p-4 border cursor-pointer transition-all duration-150 hover:-translate-y-0.5 group flex items-start gap-4"
            style={{
              borderColor: t.border,
              background: t.cardHover,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = t.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = t.border)}
          >
            <div
              className="w-10 h-10 border flex items-center justify-center shrink-0"
              style={{ borderColor: t.border, background: t.accentSoft, color: t.accent }}
            >
              <Wrench size={20} strokeWidth={2.2} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="wd-display font-black text-sm uppercase" style={{ color: t.text }}>
                  I Want to Work / Technician
                </span>
                <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.accent }} />
              </div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: t.muted }}>
                Discover local work orders, claim eligible trade tickets, and receive guaranteed payouts.
              </p>
            </div>
          </div>
        </div>

        {/* Existing Account Footer Link */}
        <div className="mt-6 pt-4 border-t text-center wd-mono text-xs" style={{ borderColor: t.border }}>
          <span style={{ color: t.muted }}>Already registered on platform? </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/login');
            }}
            className="font-bold underline cursor-pointer"
            style={{ color: t.accent }}
          >
            Log In Directly
          </button>
        </div>
      </div>
    </div>
  );
}
