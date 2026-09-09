
// src/components/CustomTimer.jsx
import React, { useState, useContext } from 'react';
import { TimerContext } from '../context/TimerContext';
import toast from 'react-hot-toast';
import { FiClock, FiPlus, FiMinus, FiZap, FiChevronDown, FiChevronUp, FiInfo } from 'react-icons/fi';

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
      toast.error('Please set a valid time');
      return;
    }

    if (totalSeconds > 86400) {
      toast.error('Maximum time is 24 hours');
      return;
    }

    setIsLoading(true);

    try {
      addTimer(name || 'Custom Timer', totalSeconds, 'custom');
      toast.success(`${name || 'Custom Timer'} started`);
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
      toast.success(`${mins} minute timer started`);
    } catch (error) {
      toast.error('Failed to start timer');
    }
  };

  const quickMins = [1, 2, 5, 10, 15, 30, 45, 60];

  // Calculate total seconds for display
  const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
  const hasTime = totalSeconds > 0;

  return (
    <div className="bg-gray-100  border-slate-200 p-4 sm:p-5 transition-all hover:border-indigo-200 hover:shadow-sm mt-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50  border border-indigo-100">
            <FiClock size={16} className="text-indigo-600" />
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-slate-800">
            Custom Timer
          </h2>
          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
            Create your own
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors text-xs font-medium"
        >
          {isExpanded ? (
            <>
              <FiChevronUp size={14} />
              <span className="hidden xs:inline">Close</span>
            </>
          ) : (
            <>
              <FiChevronDown size={14} />
              <span className="hidden xs:inline">Expand</span>
            </>
          )}
        </button>
      </div>

      {!isExpanded ? (
        // Quick Add Buttons
        <div className="mt-3">
          <div className="flex flex-wrap gap-1.5">
            {quickMins.map((mins) => (
              <button
                key={mins}
                onClick={() => handleQuickAdd(mins)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700  text-xs font-medium transition-all border border-slate-200 hover:border-slate-300 hover:shadow-sm active:scale-95"
              >
                {mins}m
              </button>
            ))}
            <button
              onClick={() => setIsExpanded(true)}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white  text-xs font-medium transition-all shadow-sm hover:shadow active:scale-95"
            >
              <span className="flex items-center gap-1">
                <FiPlus size={12} />
                Custom
              </span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5">
            Quick presets or create your own custom timer
          </p>
        </div>
      ) : (
        // Expanded Form
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          {/* Timer Name */}
          <div>
            <label className="text-xs text-slate-600 font-medium block mb-1">
              Timer Name <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Project Work, Meeting, Break"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200  text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
          
          {/* Time Inputs */}
          <div>
            <label className="text-xs text-slate-600 font-medium block mb-1">
              Set Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">Hours</label>
                <input
                  type="number"
                  value={hours}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setHours(Math.max(0, Math.min(24, val)));
                  }}
                  min="0"
                  max="24"
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200  text-slate-800 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Minutes</label>
                <input
                  type="number"
                  value={minutes}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setMinutes(Math.max(0, Math.min(59, val)));
                  }}
                  min="0"
                  max="59"
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200  text-slate-800 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Seconds</label>
                <input
                  type="number"
                  value={seconds}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setSeconds(Math.max(0, Math.min(59, val)));
                  }}
                  min="0"
                  max="59"
                  className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Total Summary */}
          {hasTime && (
            <div className="flex items-center justify-between bg-indigo-50  px-3 py-2 border border-indigo-100">
              <span className="text-xs text-indigo-700 font-medium">Total Duration</span>
              <span className="text-sm font-mono font-semibold text-indigo-700">
                {hours > 0 && `${hours}h `}
                {minutes > 0 && `${minutes}m `}
                {seconds > 0 && `${seconds}s`}
                <span className="text-[10px] text-indigo-400 font-normal ml-1">
                  ({totalSeconds}s)
                </span>
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium  transition-all text-sm ${
                isLoading ? 'opacity-60 cursor-not-allowed' : 'shadow-sm hover:shadow'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent  animate-spin" />
                  Starting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <FiZap size={14} />
                  Start Timer
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium  transition-all text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Helpful Info for AdSense */}
      <div className="mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-start gap-2">
          <FiInfo size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Create custom timers for any task. Perfect for <span className="text-slate-500">work sessions</span>, 
            <span className="text-slate-500"> study blocks</span>, or <span className="text-slate-500">personal goals</span>. 
            Max 24 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CustomTimer;