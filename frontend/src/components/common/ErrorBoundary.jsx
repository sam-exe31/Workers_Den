import React from 'react';
import { PALETTE } from '../../theme/palette';
import Logo from './Logo';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex flex-col items-center justify-center p-6 text-center font-sans"
          style={{ background: PALETTE.bg, color: PALETTE.text }}
        >
          <div
            className="w-full max-w-md border p-8 space-y-5 shadow-lg"
            style={{ background: PALETTE.surface, borderColor: PALETTE.border }}
          >
            <div className="flex justify-center">
              <Logo size={32} accentColor={PALETTE.accent} textColor={PALETTE.text} />
            </div>

            <div
              className="w-12 h-12 mx-auto rounded-full border flex items-center justify-center"
              style={{ borderColor: PALETTE.stamp, color: PALETTE.stamp, background: 'rgba(194,59,30,0.06)' }}
            >
              <AlertTriangle size={24} />
            </div>

            <div>
              <h2 className="wd-display font-black text-xl tracking-tight" style={{ color: PALETTE.text }}>
                Something went wrong
              </h2>
              <p className="wd-mono text-xs mt-1.5 leading-relaxed" style={{ color: PALETTE.muted }}>
                An unexpected component error occurred. Don't worry, your data is safe.
              </p>
            </div>

            {this.state.error?.message && (
              <div
                className="p-3 text-[11px] wd-mono border text-left overflow-auto max-h-28"
                style={{ background: 'rgba(194,59,30,0.04)', borderColor: PALETTE.stamp, color: PALETTE.stamp }}
              >
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 wd-mono wd-btn text-xs font-bold py-3 flex items-center justify-center gap-2 cursor-pointer"
                style={{ background: PALETTE.accent, color: PALETTE.accentText, border: 'none' }}
              >
                <RotateCcw size={14} /> Refresh Page
              </button>
              <button
                type="button"
                onClick={() => { window.location.href = '/'; }}
                className="wd-mono text-xs font-bold px-4 py-3 border cursor-pointer"
                style={{ borderColor: PALETTE.border, color: PALETTE.text, background: 'transparent' }}
              >
                Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
