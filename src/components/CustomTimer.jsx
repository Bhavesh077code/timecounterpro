// src/components/CustomTimer.jsx
import React, { useState, useContext } from 'react';
import { TimerContext } from '../context/TimerContext';

function CustomTimer() {
  const { addTimer } = useContext(TimerContext);
  const [name, setName] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    
    if (totalSeconds === 0) {
      alert('⏰ Please set a valid time!');
      return;
    }

    addTimer(name || 'Custom Timer', totalSeconds, 'custom');
    setName('');
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setIsExpanded(false);
  };

  const handleQuickAdd = (mins) => {
    addTimer(`${mins} Minute Timer`, mins * 60, 'custom');
  };

  const quickMins = [1, 2, 5, 10, 15, 30, 45, 60];

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 mt-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🎨</span> Custom Timer
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-white transition-colors text-sm"
        >
          {isExpanded ? '✕ Close' : '▼ Expand'}
        </button>
      </div>

      {!isExpanded ? (
        <div className="flex flex-wrap gap-2">
          {quickMins.map((mins) => (
            <button
              key={mins}
              onClick={() => handleQuickAdd(mins)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-white text-sm transition-all duration-300 hover:scale-105"
            >
              {mins}m
            </button>
          ))}
          <button
            onClick={() => setIsExpanded(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
          >
            Custom ➜
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Timer name (optional)"
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                max="24"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                min="0"
                max="59"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Seconds</label>
              <input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                min="0"
                max="59"
                className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {(hours > 0 || minutes > 0 || seconds > 0) && (
            <div className="text-center text-purple-300 text-sm bg-purple-500/10 py-2 rounded-lg">
              Total: {hours}h {minutes}m {seconds}s
              <span className="text-gray-500 ml-2">
                ({hours * 3600 + minutes * 60 + seconds}s)
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02]"
            >
              🚀 Start Timer
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-6 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CustomTimer;