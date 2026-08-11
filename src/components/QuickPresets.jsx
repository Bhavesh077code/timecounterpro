// src/components/QuickPresets.jsx
import React, { useContext } from 'react';
import { TimerContext } from '../context/TimerContext';
import { TIMER_PRESETS } from '../utils/constants';
import toast from 'react-hot-toast';

function QuickPresets() {
  const { addTimer } = useContext(TimerContext);

  const handleAddTimer = (name, duration, type) => {
    try {
      addTimer(name, duration, type);
      toast.success(`✅ ${name} started!`);
    } catch (error) {
      toast.error('Failed to start timer');
      console.error('Timer error:', error);
    }
  };

  return (
    <div className="mb-2 sm:mb-3 md:mb-4">
      {/* Header - Mobile Responsive */}
      <div className="flex items-center justify-between mb-2 sm:mb-3 md:mb-4">
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-white flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-xl md:text-2xl">⚡</span>
          <span>Quick Start</span>
          <span className="text-[10px] sm:text-xs font-normal text-gray-500 ml-1 sm:ml-2 hidden xs:inline">
            Click to start
          </span>
        </h2>
        <span className="text-[10px] sm:text-xs text-gray-500 bg-white/5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full xs:hidden">
          Tap
        </span>
      </div>

      {/* Presets Grid - Mobile Optimized */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2 md:gap-3">
        {TIMER_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => handleAddTimer(preset.name, preset.duration, 'preset')}
            className="group relative overflow-hidden rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 p-2 sm:p-3 md:p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 active:scale-95 touch-manipulation"
            aria-label={`Start ${preset.name}`}
          >
            {/* Background Gradient on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${preset.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            <div className="relative z-10">
              {/* Icon - Responsive */}
              <div className="text-xl xs:text-2xl sm:text-3xl mb-0.5 sm:mb-1 group-hover:scale-110 transition-transform duration-300">
                {preset.icon}
              </div>
              
              {/* Name - Responsive */}
              <div className="text-white text-[8px] xs:text-[10px] sm:text-xs font-medium leading-tight">
                {preset.name}
              </div>
              
              {/* Duration - Responsive */}
              <div className="text-purple-400 text-[6px] xs:text-[8px] sm:text-[10px] font-mono mt-0.5">
                {preset.duration >= 3600 
                  ? `${Math.floor(preset.duration / 3600)}h ${Math.floor((preset.duration % 3600) / 60)}m`
                  : `${Math.floor(preset.duration / 60)}m`
                }
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickPresets;