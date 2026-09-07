import React, { useState, useEffect } from 'react';
import { Sun, Moon, MapPin, Clock, Star } from 'lucide-react';

export default function ThemePractice() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('workers_theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('workers_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('workers_theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 p-6 sm:p-10 transition-colors duration-200">
      <div className="max-w-xl mx-auto space-y-6">

        {/* Header & Toggle Bar */}
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl shadow-sm">
          <div>
            <h1 className="font-bold text-base text-slate-800 dark:text-slate-100">Theme Preview</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Active mode: <span className="font-semibold text-blue-600 dark:text-blue-400">{darkMode ? 'Midnight Navy' : 'Eye-Care Slate'}</span>
            </p>
          </div>
          
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-lg bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        {/* Sample Service Request Card */}
        <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Plumbing
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">₹499.00</span>
          </div>

          <div>
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Kitchen Sink Drain Repair</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" /> Kothrud, Pune
              <span className="mx-1">•</span>
              <Clock className="w-3.5 h-3.5 text-blue-500" /> Today, 5:00 PM
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            The lower PVC drain pipe is leaking continuously under the sink basin. Needs replacement of washer joint.
          </p>

          <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex gap-2">
            <button className="flex-1 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white text-xs font-semibold py-2 rounded-lg transition">
              Accept Job
            </button>
            <button className="px-3 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700 transition">
              View Details
            </button>
          </div>
        </div>

        {/* Sample Metrics Widget */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
            <p className="text-xs text-slate-500 dark:text-slate-400">Completed Tasks</p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">48</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
            <p className="text-xs text-slate-500 dark:text-slate-400">Worker Rating</p>
            <p className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1 mt-0.5">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
