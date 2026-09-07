import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-canvas-dark text-canvas-light py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand Info */}
        <div className="space-y-3 md:col-span-1">
          <div className="font-heading font-bold text-lg tracking-tight text-canvas-light">
            WORKERS<span className="text-accent"> DEN</span>
          </div>
          <p className="font-body text-xs text-muted-light leading-relaxed">
            Pune's local job marketplace. Direct booking for home services, events, and flexible tasks.
          </p>
          <span className="inline-block text-[11px] font-mono text-muted-dark">
            📍 Pune, Maharashtra
          </span>
        </div>

        {/* For Customers */}
        <div className="space-y-3 text-xs font-body">
          <div className="font-mono uppercase tracking-wider text-muted-dark font-semibold">
            For Customers
          </div>
          <ul className="space-y-2 text-muted-light">
            <li><a href="#services" className="hover:text-canvas-light transition-colors">Post a Job</a></li>
            <li><a href="#how-it-works" className="hover:text-canvas-light transition-colors">How it works</a></li>
            <li><a href="#services" className="hover:text-canvas-light transition-colors">Service Pricing</a></li>
          </ul>
        </div>

        {/* For Workers */}
        <div className="space-y-3 text-xs font-body">
          <div className="font-mono uppercase tracking-wider text-muted-dark font-semibold">
            For Professionals
          </div>
          <ul className="space-y-2 text-muted-light">
            <li><a href="#find-jobs" className="hover:text-canvas-light transition-colors">Find Jobs</a></li>
            <li><a href="#find-jobs" className="hover:text-canvas-light transition-colors">Student Side Income</a></li>
            <li><a href="#find-jobs" className="hover:text-canvas-light transition-colors">Verification Process</a></li>
          </ul>
        </div>

        {/* Company */}
        <div className="space-y-3 text-xs font-body">
          <div className="font-mono uppercase tracking-wider text-muted-dark font-semibold">
            Platform
          </div>
          <ul className="space-y-2 text-muted-light">
            <li><a href="#" className="hover:text-canvas-light transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-canvas-light transition-colors">Safety & Guidelines</a></li>
            <li><a href="#" className="hover:text-canvas-light transition-colors">Contact</a></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#27272A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-muted-dark">
        <span>© 2026 Workers Den. All rights reserved.</span>
        <span>Built for Pune.</span>
      </div>
    </footer>
  );
}
