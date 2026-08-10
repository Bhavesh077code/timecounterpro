// src/components/QuickPresets.jsx
import React, { useContext } from 'react';
import { TimerContext } from '../context/TimerContext';
import { TIMER_PRESETS } from '../utils/constants';

function QuickPresets() {
  const { addTimer } = useContext(TimerContext);

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>⚡</span> Quick Start
          <span className="text-xs font-normal text-gray-500 ml-2 hidden sm:inline">Click to start</span>
        </h2>
        <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full sm:hidden">Tap to start</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3">
        {TIMER_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => addTimer(preset.name, preset.duration, 'preset')}
            className="group relative overflow-hidden rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 p-3 sm:p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20 active:scale-95 touch-manipulation"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${preset.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">{preset.icon}</div>
              <div className="text-white text-[10px] sm:text-xs font-medium leading-tight">{preset.name}</div>
              <div className="text-purple-400 text-[8px] sm:text-[10px] font-mono mt-0.5">
                {preset.duration >= 3600 ? `${Math.floor(preset.duration / 3600)}h` : `${Math.floor(preset.duration / 60)}m`}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickPresets;