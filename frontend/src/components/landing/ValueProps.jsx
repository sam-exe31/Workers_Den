import React from 'react';

export function ValueProps() {
  const values = [
    {
      badge: '✓',
      title: 'Verified professionals',
      description: 'Identity and skill-checked workers. Know exactly who you are welcoming into your home or venue.',
    },
    {
      badge: '⚡',
      title: 'Fast responses',
      description: 'Jobs are broadcast directly to local pros in your area who pick up tasks within minutes.',
    },
    {
      badge: '₹',
      title: 'Fair, upfront pricing',
      description: 'Platform-set transparent rates. Zero awkward price haggling or hidden last-minute surprises.',
    },
    {
      badge: '→',
      title: 'Simple booking',
      description: 'Post once, compare worker profiles, choose your pro, and confirm. Clean and distraction-free.',
    },
  ];

  return (
    <section className="w-full bg-canvas-dark text-canvas-light py-20 px-6 border-b border-[#27272A]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="max-w-xl space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
            Built On Trust
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl tracking-tight text-canvas-light">
            Why Workers Den
          </h2>
          <p className="font-body text-base text-muted-light">
            A reliable marketplace designed specifically for Pune residents and local independent workers.
          </p>
        </div>

        {/* 4 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((item, index) => (
            <div 
              key={index}
              className="bg-[#16161A] border border-[#27272A] rounded-card p-6 flex flex-col justify-between space-y-4 hover:border-[#3E3E44] transition-colors"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-btn bg-[#27272A] flex items-center justify-center font-mono font-bold text-accent text-base">
                  {item.badge}
                </div>
                <h3 className="font-heading font-semibold text-lg text-canvas-light">
                  {item.title}
                </h3>
                <p className="font-body text-sm text-muted-light leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2 text-[11px] font-mono text-muted-dark">
                PUNE VERIFIED
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}