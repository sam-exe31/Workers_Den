import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosClient';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

const FALLBACK_JOBS = [
  {
    id: 'ex-1',
    category: 'AC REPAIR',
    title: "Keeps running but isn't cooling.",
    location: 'Kothrud, Pune',
    timing: 'Today',
    price: 700,
  },
  {
    id: 'ex-2',
    category: 'HOME CLEANING',
    title: '2BHK deep cleaning before moving in.',
    location: 'Baner, Pune',
    timing: 'Tomorrow',
    price: 1200,
  },
  {
    id: 'ex-3',
    category: 'CATERING',
    title: 'Traditional snacks & food setup for 40 people.',
    location: 'Wakad, Pune',
    timing: 'Saturday',
    price: 8500,
  },
  {
    id: 'ex-4',
    category: 'ELECTRICAL',
    title: 'Assemble and install 3 ceiling fans.',
    location: 'Hadapsar, Pune',
    timing: 'Today',
    price: 600,
  },
];

export function ExampleJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(FALLBACK_JOBS);

  useEffect(() => {
    api.get('/Categories')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const areas = ['Kothrud, Pune', 'Baner, Pune', 'Wakad, Pune', 'Hadapsar, Pune', 'Aundh, Pune', 'Hinjawadi, Pune'];
          const timings = ['Today', 'Tomorrow', 'Saturday', 'Today'];
          setJobs(res.data.slice(0, 4).map((cat, idx) => ({
            id: cat.id || `cat-${idx}`,
            category: (cat.catName || cat.cat_name || 'Service').toUpperCase(),
            title: cat.description || `${cat.catName || cat.cat_name} service request in Pune.`,
            location: areas[idx % areas.length],
            timing: timings[idx % timings.length],
            price: cat.customerPrice || cat.customer_price || 499,
          })));
        }
      })
      .catch(() => { });
  }, []);

  const handleBook = (catName) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (token && user?.role?.includes('CUSTOMER')) {
      navigate(`/customer/create-job?category=${encodeURIComponent(catName || '')}`);
    } else {
      navigate(`/register?role=CUSTOMER&category=${encodeURIComponent(catName || '')}`);
    }
  };

  return (
    <section id="services" className="w-full bg-[#F7F6F2] py-20 px-6 border-b border-[#E5E4DE]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-[#6B7280] font-semibold">
              Live Opportunities
            </span>
            <h2 className="font-bold text-3xl sm:text-4xl text-[#18202E] tracking-tight">
              What needs doing?
            </h2>
            <p className="text-base text-[#4B5563]">
              Real categories and services available across Pune right now.
            </p>
          </div>

          <button
            onClick={() => handleBook('')}
            className="text-sm font-semibold text-[#18202E] hover:text-[#1D4E89] transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            Browse All Categories →
          </button>
        </div>

        {/* Example Job Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-[#E5E4DE] rounded-md p-5 flex flex-col justify-between gap-4 shadow-sm hover:border-[#1D4E89] transition-all"
            >
              <div className="space-y-2.5">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#1D4E89] bg-[#EBF1F8] px-2 py-0.5 rounded">
                  {job.category}
                </span>
                <h3 className="font-bold text-sm text-[#18202E] leading-snug line-clamp-2">
                  {job.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-[#6B7280] font-mono pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {job.timing}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#F0EFEB]">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#9CA3AF] block">Price</span>
                  <span className="font-black text-lg text-[#18202E]">₹{job.price}</span>
                </div>
                <button
                  onClick={() => handleBook(job.category)}
                  className="text-xs font-semibold text-[#1D4E89] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Book <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default ExampleJobs;