import React from 'react';
import { JobCard } from '../common/JobCard';

export function ExampleJobs() {
  const exampleData = [
    {
      id: 'ex-1',
      category: 'AC REPAIR',
      title: 'Keeps running but isn\'t cooling.',
      location: 'Kothrud, Pune',
      timing: 'Today',
      price: 700,
      photosCount: 2,
      pickedCount: 3,
      step: 2,
    },
    {
      id: 'ex-2',
      category: 'HOME CLEANING',
      title: '2BHK deep cleaning before moving in.',
      location: 'Baner, Pune',
      timing: 'Tomorrow',
      price: 1200,
      photosCount: 4,
      pickedCount: 2,
      step: 2,
    },
    {
      id: 'ex-3',
      category: 'CATERING',
      title: 'Traditional snacks & food setup for 40 people.',
      location: 'Wakad, Pune',
      timing: 'Saturday',
      price: 8500,
      photosCount: 0,
      pickedCount: 4,
      step: 2,
    },
    {
      id: 'ex-4',
      category: 'ELECTRICAL',
      title: 'Assemble and install 3 ceiling fans.',
      location: 'Hadapsar, Pune',
      timing: 'Today',
      price: 600,
      photosCount: 1,
      pickedCount: 2,
      step: 2,
    },
  ];

  return (
    <section id="services" className="w-full bg-[#F7F6F2] py-20 px-6 border-b border-[#E5E4DE]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-muted-dark font-semibold">
              Live Opportunities
            </span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-canvas-dark tracking-tight">
              What needs doing?
            </h2>
            <p className="font-body text-base text-muted-dark">
              Real jobs posted by residents across Pune right now.
            </p>
          </div>

          <button className="text-sm font-body font-semibold text-canvas-dark hover:text-accent transition-colors flex items-center gap-1.5 self-start sm:self-auto">
            Browse All Categories →
          </button>
        </div>

        {/* 4 Example Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exampleData.map((job) => (
            <JobCard
              key={job.id}
              category={job.category}
              title={job.title}
              location={job.location}
              timing={job.timing}
              price={job.price}
              photosCount={job.photosCount}
              pickedCount={job.pickedCount}
              step={job.step}
              variant="showcase"
              actionLabel="View Responses →"
              onAction={() => {}}
            />
          ))}
        </div>

      </div>
    </section>
  );
}