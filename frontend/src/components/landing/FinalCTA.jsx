import React from 'react';

export function FinalCTA() {
  return (
    <section className="w-full bg-[#F7F6F2] py-24 px-6 border-b border-[#E5E4DE]">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-dark font-semibold">
            Ready to get started?
          </span>
          <h2 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-canvas-dark tracking-tight leading-tight">
            Whatever needs doing. <br />
            <span className="text-muted-dark">Someone can do it.</span>
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button className="w-full sm:w-auto bg-canvas-dark hover:bg-[#27272A] text-canvas-light font-body font-semibold text-sm px-8 py-3.5 rounded-btn transition-colors">
            Post a Job →
          </button>
          <button className="w-full sm:w-auto bg-white border border-[#E5E4DE] hover:border-canvas-dark text-canvas-dark font-body font-semibold text-sm px-8 py-3.5 rounded-btn transition-colors">
            Find Jobs in Pune
          </button>
        </div>
      </div>
    </section>
  );
}