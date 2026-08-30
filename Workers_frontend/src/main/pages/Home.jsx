import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosClient';
import { Navbar } from '../Component/Navbar';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Clock, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Briefcase 
} from 'lucide-react';

const STATIC_JOBS = [
  { name: 'AC Repair', price: 700, area: 'Kothrud', timing: 'Today', photos: 2, picked: 3, desc: "Keeps running but isn't cooling properly." },
  { name: 'Home Cleaning', price: 1200, area: 'Baner', timing: 'Tomorrow', photos: 4, picked: 2, desc: '2BHK deep cleaning before moving in.' },
  { name: 'Catering', price: 8500, area: 'Wakad', timing: 'Saturday', photos: 0, picked: 4, desc: 'Traditional snacks & setup for 40 guests.' },
  { name: 'Electrical', price: 600, area: 'Hadapsar', timing: 'Today', photos: 1, picked: 2, desc: 'Assemble and install 3 ceiling fans.' },
];

const PRO_ROLES = [
  'Students', 'Electricians', 'Plumbers', 'Cleaners', 'Caterers', 'Photographers', 'Carpenters', 'Freelancers'
];

export default function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/Categories')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((cat, idx) => ({
            name: cat.catName,
            price: cat.customerPrice || 500,
            area: ['Kothrud', 'Baner', 'Wakad', 'Hadapsar'][idx % 4],
            timing: 'Available Today',
            photos: 1,
            picked: (idx % 3) + 1,
            desc: `Verified on-demand ${cat.catName.toLowerCase()} support across Pune.`,
          }));
          setJobs(mapped);
        } else {
          setJobs(STATIC_JOBS);
        }
      })
      .catch(() => setJobs(STATIC_JOBS));
  }, []);

  const displayJobs = jobs.length > 0 ? jobs : STATIC_JOBS;

  return (
    <div className="min-h-screen bg-[#0B0B0D] text-[#F7F6F2] flex flex-col font-sans selection:bg-[#F4A340] selection:text-[#0B0B0D]">
      <Navbar />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="w-full pt-12 pb-20 px-6 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#16161A] border border-[#27272A] rounded-full text-xs text-[#F4A340]">
                <Sparkles size={14} />
                <span className="font-mono uppercase tracking-wider text-[11px]">Pune-First Marketplace</span>
              </div>

              <h1 className="font-bold text-4xl sm:text-6xl tracking-tight leading-[1.08]">
                Got a job? <br />
                <span className="text-[#A0A0AA]">Post it. Let someone pick it up.</span>
              </h1>

              <p className="text-base text-[#A0A0AA] max-w-lg leading-relaxed">
                Describe the task, timeline, and Pune location. Local verified tradespeople and independent pros pick your job, and you choose who gets it done.
              </p>

              <div className="bg-[#16161A] border border-[#27272A] p-4 rounded-[16px] max-w-lg space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-[#A0A0AA] uppercase">WHAT NEEDS TO BE DONE?</span>
                  <input 
                    type="text" 
                    readOnly 
                    value="My AC isn't cooling..." 
                    className="w-full bg-[#0B0B0D] border border-[#27272A] text-[#F7F6F2] px-3.5 py-2.5 rounded-[10px] text-xs focus:outline-none cursor-default"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-[#A0A0AA] flex items-center gap-1">
                    <MapPin size={13} className="text-[#F4A340]" /> Pune (Kothrud, Baner, Wakad & more)
                  </span>
                  <button 
                    onClick={() => navigate('/register')}
                    className="bg-[#F4A340] hover:bg-[#E09230] text-[#0B0B0D] font-semibold text-xs px-4 py-2 rounded-[8px] transition-colors"
                  >
                    Post a Job →
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-[#16161A] border border-[#27272A] p-6 rounded-[16px] space-y-5 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-[#27272A] text-xs font-mono">
                  <span className="flex items-center gap-2 text-[#F4A340]">
                    <span className="w-2 h-2 rounded-full bg-[#F4A340] animate-ping" />
                    LIVE JOB POSTED
                  </span>
                  <span className="text-[#57575E]">Just now</span>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-[#A0A0AA] uppercase">AC REPAIR</span>
                  <h3 className="font-semibold text-lg text-[#F7F6F2]">
                    Keeps running but isn't cooling properly.
                  </h3>
                  <div className="flex items-center justify-between text-xs text-[#A0A0AA]">
                    <span className="flex items-center gap-1"><MapPin size={13} /> Kothrud, Pune</span>
                    <span className="font-bold text-base text-[#F7F6F2]">₹700</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#27272A] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#F7F6F2]">● POSTED</span>
                  <span className="text-[#57575E]">───</span>
                  <span className="text-[#F4A340]">● 3 PICKED</span>
                  <span className="text-[#57575E]">───</span>
                  <span className="text-[#57575E]">○ CHOOSE</span>
                </div>

                <button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#27272A] hover:bg-[#323238] text-[#F7F6F2] text-xs py-2.5 rounded-[8px] font-medium transition-colors"
                >
                  View Responses →
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="w-full py-20 px-6 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#F4A340]">Simple Flow</span>
              <h2 className="text-3xl font-bold tracking-tight text-[#F7F6F2]">Post. Pick. Choose. Done.</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: 'Post', desc: 'Describe what needs doing, your timing, and location in Pune.', icon: Briefcase },
                { num: '02', title: 'Pick', desc: 'Nearby verified workers claim the job from their feed.', icon: Zap },
                { num: '03', title: 'Choose', desc: 'Review responder profiles, ratings, and choose your pro.', icon: Layers },
                { num: '04', title: 'Done', desc: 'Task gets completed at the fixed transparent rate. Done.', icon: CheckCircle2 },
              ].map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.num} className="bg-[#16161A] border border-[#27272A] p-6 rounded-[14px] flex flex-col justify-between space-y-6 hover:border-[#3E3E44] transition-all">
                    <div className="space-y-3">
                      <div className="w-8 h-8 rounded-[8px] bg-[#0B0B0D] border border-[#27272A] flex items-center justify-center text-[#F4A340]">
                        <Icon size={16} />
                      </div>
                      <h3 className="font-semibold text-lg text-[#F7F6F2]">{step.title}</h3>
                      <p className="text-xs text-[#A0A0AA] leading-relaxed">{step.desc}</p>
                    </div>
                    <span className="text-[10px] font-mono text-[#57575E]">STEP {step.num}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* LIVE EXAMPLES */}
        <section id="services" className="w-full py-20 px-6 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-[#F4A340]">Pune Tasks</span>
                <h2 className="text-3xl font-bold tracking-tight text-[#F7F6F2]">What needs doing?</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayJobs.slice(0, 4).map((job, idx) => (
                <div key={idx} className="bg-[#16161A] border border-[#27272A] p-5 rounded-[14px] flex flex-col justify-between space-y-4 hover:border-[#3E3E44] transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#A0A0AA]">
                      <span className="uppercase font-semibold text-[#F4A340]">{job.name}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {job.timing}</span>
                    </div>
                    <h4 className="font-semibold text-sm text-[#F7F6F2] leading-snug">{job.desc}</h4>
                  </div>

                  <div className="pt-3 border-t border-[#27272A] flex items-baseline justify-between text-xs text-[#A0A0AA]">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1 text-[#F7F6F2]"><MapPin size={12} /> {job.area}</span>
                      {job.photos > 0 && <span className="flex items-center gap-1 text-[11px]"><Camera size={11} /> {job.photos} photos</span>}
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] font-mono text-[#57575E] block">FIXED</span>
                      <span className="font-bold text-base text-[#F7F6F2]">₹{job.price}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate('/register')}
                    className="w-full bg-[#27272A] hover:bg-[#F4A340] hover:text-[#0B0B0D] text-[#F7F6F2] text-xs py-2 rounded-[8px] font-medium transition-colors"
                  >
                    View Responses →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUE PROPS */}
        <section className="w-full py-20 px-6 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#F4A340]">Platform Standard</span>
              <h2 className="text-3xl font-bold tracking-tight text-[#F7F6F2]">Why Workers Den</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Verified Pros', desc: 'Government & skill-checked independent technicians and gig workers.' },
                { title: 'Fast Responses', desc: 'Broadcasted to active nearby workers who claim jobs in minutes.' },
                { title: 'Fair Fixed Rates', desc: 'Standardized rate cards. No awkward bidding wars or surprise quotes.' },
                { title: 'Simple Workflow', desc: 'Post once, compare worker cards, confirm, and verify completion.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#16161A] border border-[#27272A] p-6 rounded-[14px] space-y-3">
                  <ShieldCheck size={20} className="text-[#F4A340]" />
                  <h3 className="font-semibold text-base text-[#F7F6F2]">{item.title}</h3>
                  <p className="text-xs text-[#A0A0AA] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKER OPPORTUNITY */}
        <section id="find-jobs" className="w-full py-20 px-6 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-mono uppercase text-[#F4A340]">For Trade Pros & Students</span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F7F6F2]">
                Got a skill? Get paid for it.
              </h2>
              <p className="text-sm text-[#A0A0AA] leading-relaxed">
                Claim local jobs matching your schedule, work independently across Pune, and earn direct payouts.
              </p>
              <button 
                onClick={() => navigate('/register')}
                className="bg-[#F4A340] hover:bg-[#E09230] text-[#0B0B0D] font-semibold text-xs px-5 py-2.5 rounded-[8px] transition-colors"
              >
                Find Jobs in Pune →
              </button>
            </div>

            <div className="lg:col-span-6 bg-[#16161A] border border-[#27272A] p-6 rounded-[14px] space-y-3">
              <span className="text-xs font-mono text-[#A0A0AA] uppercase block">Open roles across Pune</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {PRO_ROLES.map((role) => (
                  <span key={role} className="px-3 py-1 bg-[#0B0B0D] border border-[#27272A] text-xs rounded-[6px] text-[#F7F6F2]">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="w-full py-24 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#F7F6F2]">
              Whatever needs doing. <br />
              <span className="text-[#57575E]">Someone can do it.</span>
            </h2>
            <div className="flex justify-center gap-3 pt-2">
              <button 
                onClick={() => navigate('/register')}
                className="bg-[#F4A340] hover:bg-[#E09230] text-[#0B0B0D] font-semibold text-xs px-6 py-3 rounded-[8px] transition-colors"
              >
                Post a Job
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="bg-[#16161A] border border-[#27272A] hover:border-[#F7F6F2] text-[#F7F6F2] font-semibold text-xs px-6 py-3 rounded-[8px] transition-colors"
              >
                Find Jobs
              </button>
            </div>
          </div>
        </section>

      </main>

      <footer className="w-full bg-[#0B0B0D] border-t border-[#27272A] py-12 px-6 text-xs text-[#57575E]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="font-bold text-[#F7F6F2]">
            WORKERS<span className="text-[#F4A340]"> DEN</span> · Pune
          </div>
          <div>© 2026 Workers Den. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}