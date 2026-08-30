import React from 'react';

export function AudienceSections() {
  const workerTypes = [
    'Students',
    'Caterers',
    'Cleaners',
    'Photographers',
    'Electricians',
    'Plumbers',
    'Freelancers',
  ];

  return (
    <div className="w-full">
      
      {/* 1. CUSTOMER SECTION (Light Surface) */}
      <section className="w-full bg-[#F7F6F2] py-20 px-6 border-b border-[#E5E4DE]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-dark font-semibold">
              For Customers
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl text-canvas-dark tracking-tight leading-tight">
              Something needs doing?
            </h2>
            <p className="font-body text-base text-muted-dark max-w-lg leading-relaxed">
              Describe the job once. Let verified professionals come to you, review their profiles, and pick the right person with total confidence.
            </p>
            <button className="bg-canvas-dark hover:bg-[#27272A] text-canvas-light font-body font-semibold text-sm px-6 py-3 rounded-btn transition-colors">
              Post a Job →
            </button>
          </div>

          {/* Customer Visual Journey */}
          <div className="lg:col-span-6 bg-white border border-[#E5E4DE] rounded-card p-6 shadow-sm">
            <div className="text-xs font-mono text-muted-dark uppercase tracking-wider mb-6 pb-2 border-b border-[#F0EFEB]">
              The Customer Journey
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-body">
              <div className="p-3 bg-[#F7F6F2] rounded-btn border border-[#E5E4DE]">
                <span className="font-mono text-xs text-accent font-bold block mb-1">01</span>
                <span className="text-xs font-semibold text-canvas-dark">You post</span>
              </div>
              <div className="p-3 bg-[#F7F6F2] rounded-btn border border-[#E5E4DE]">
                <span className="font-mono text-xs text-accent font-bold block mb-1">02</span>
                <span className="text-xs font-semibold text-canvas-dark">Workers pick</span>
              </div>
              <div className="p-3 bg-[#F7F6F2] rounded-btn border border-[#E5E4DE]">
                <span className="font-mono text-xs text-accent font-bold block mb-1">03</span>
                <span className="text-xs font-semibold text-canvas-dark">You compare</span>
              </div>
              <div className="p-3 bg-canvas-dark rounded-btn border border-canvas-dark text-canvas-light">
                <span className="font-mono text-xs text-accent font-bold block mb-1">04</span>
                <span className="text-xs font-semibold text-canvas-light">You choose</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. WORKER SECTION (Dark Surface) */}
      <section id="find-jobs" className="w-full bg-canvas-dark text-canvas-light py-20 px-6 border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
              For Independent Professionals & Students
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-5xl tracking-tight leading-tight">
              Got a skill? <br />
              <span className="text-canvas-light">Get paid for it.</span>
            </h2>
            <p className="font-body text-base text-muted-light max-w-lg leading-relaxed">
              Find flexible jobs around Pune, choose the tasks you want, and keep more of what you earn. You are your own boss.
            </p>
            <button className="bg-accent hover:bg-accent-hover text-canvas-dark font-body font-semibold text-sm px-6 py-3 rounded-btn transition-colors">
              Find Jobs in Pune →
            </button>
          </div>

          {/* Worker Categories Badges */}
          <div className="lg:col-span-6 bg-[#16161A] border border-[#27272A] rounded-card p-6 space-y-4">
            <div className="text-xs font-mono text-muted-light uppercase tracking-wider pb-2 border-b border-[#27272A]">
              Open for professionals & side-earners across Pune
            </div>
            
            <div className="flex flex-wrap gap-2.5 pt-2">
              {workerTypes.map((type) => (
                <span 
                  key={type}
                  className="px-3.5 py-1.5 bg-[#27272A] text-canvas-light border border-[#3E3E44] rounded-btn text-xs font-body font-medium hover:border-accent transition-colors"
                >
                  {type}
                </span>
              ))}
            </div>

            <p className="text-xs text-muted-light pt-3 leading-relaxed font-body">
              Whether you are an established technician or a college student picking up weekend event gigs, pick only what fits your schedule.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}