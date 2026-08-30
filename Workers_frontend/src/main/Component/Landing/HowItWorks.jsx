import React from 'react';

export function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Post',
      description: 'Describe what needs doing, your location in Pune, and your preferred timing.',
    },
    {
      num: '02',
      title: 'Pick',
      description: 'Verified professionals nearby see your post and pick the jobs they want to handle.',
    },
    {
      num: '03',
      title: 'Choose',
      description: 'Compare profiles, completed jobs, and ratings to select the right person for the task.',
    },
    {
      num: '04',
      title: 'Done',
      description: 'The job gets completed at the transparent fixed price. Confirm and leave a review.',
    },
  ];

  return (
    <section id="how-it-works" className="w-full bg-[#F7F6F2] py-20 px-6 border-b border-[#E5E4DE]">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="max-w-xl space-y-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-dark font-semibold">
            Simple Process
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-canvas-dark tracking-tight">
            Post. Pick. Choose. Done.
          </h2>
          <p className="font-body text-base text-muted-dark">
            No endless price negotiations or spam calls. Just straightforward booking.
          </p>
        </div>

        {/* 4-Step Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div 
              key={step.num}
              className="bg-white border border-[#E5E4DE] rounded-card p-6 flex flex-col justify-between space-y-6 hover:border-[#D0CFC9] transition-all"
            >
              <div className="space-y-4">
                <span className="font-mono font-bold text-2xl text-accent block">
                  {step.num}
                </span>
                <h3 className="font-heading font-semibold text-xl text-canvas-dark">
                  {step.title}
                </h3>
                <p className="font-body text-sm text-muted-dark leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F0EFEB] text-[11px] font-mono text-muted-dark uppercase tracking-wider">
                Step {step.num} of 04
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}