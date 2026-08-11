// src/components/CustomTimer.jsx
import React, { useState, useContext } from 'react';
import { TimerContext } from '../context/TimerContext';
import toast from 'react-hot-toast';

function CustomTimer() {
  const { addTimer } = useContext(TimerContext);
  const [name, setName] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
    
    if (totalSeconds === 0) {
      toast.error('⏰ Please set a valid time!');
      return;
    }

    if (totalSeconds > 86400) {
      toast.error('⏰ Maximum time is 24 hours!');
      return;
    }

    setIsLoading(true);

    try {
      addTimer(name || 'Custom Timer', totalSeconds, 'custom');
      toast.success('✅ Timer started!');
      setName('');
      setHours(0);
      setMinutes(0);
      setSeconds(0);
      setIsExpanded(false);
    } catch (error) {
      toast.error('Failed to start timer');
      console.error('Timer error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAdd = (mins) => {
    try {
      addTimer(`${mins} Minute Timer`, mins * 60, 'custom');
      toast.success(`✅ ${mins} minute timer started!`);
    } catch (error) {
      toast.error('Failed to start timer');
    }
  };

  const quickMins = [1, 2, 5, 10, 15, 30, 45, 60];

  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 mt-2 sm:mt-3 md:mt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🎨</span>
          <span className="hidden xs:inline">Custom Timer</span>
          <span className="xs:hidden">Custom</span>
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-white transition-colors text-xs sm:text-sm"
        >
          {isExpanded ? '✕ Close' : '▼ Expand'}
        </button>
      </div>

      {!isExpanded ? (
        // ✅ Quick Add Buttons - Mobile Optimized
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {quickMins.map((mins) => (
            <button
              key={mins}
              onClick={() => handleQuickAdd(mins)}
              className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-white text-xs sm:text-sm transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {mins}m
            </button>
          ))}
          <button
            onClick={() => setIsExpanded(true)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
          >
            Custom ➜
          </button>
        </div>
      ) : (
        // ✅ Expanded Form - Mobile Responsive
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Timer name (optional)"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          
          {/* Time Inputs */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div>
              <label className="text-[10px] sm:text-xs text-gray-500">Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setHours(Math.max(0, Math.min(24, val)));
                }}
                min="0"
                max="24"
                className="w-full px-2 sm:px-3 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] sm:text-xs text-gray-500">Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setMinutes(Math.max(0, Math.min(59, val)));
                }}
                min="0"
                max="59"
                className="w-full px-2 sm:px-3 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] sm:text-xs text-gray-500">Seconds</label>
              <input
                type="number"
                value={seconds}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 0;
                  setSeconds(Math.max(0, Math.min(59, val)));
                }}
                min="0"
                max="59"
                className="w-full px-2 sm:px-3 py-2 sm:py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Total Summary */}
          {(hours > 0 || minutes > 0 || seconds > 0) && (
            <div className="text-center text-purple-300 text-xs sm:text-sm bg-purple-500/10 py-1.5 sm:py-2 rounded-lg">
              Total: {hours}h {minutes}m {seconds}s
              <span className="text-gray-500 ml-2 text-[10px] sm:text-xs">
                ({hours * 3600 + minutes * 60 + seconds}s)
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg transition-all duration-300 text-sm sm:text-base ${
                isLoading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-95'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Starting...
                </span>
              ) : (
                '🚀 Start Timer'
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 border border-white/10 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300 text-sm sm:text-base"
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