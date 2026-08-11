// src/components/TimerDashboard.jsx
import React, { useContext, useState } from 'react';
import { TimerContext } from '../context/TimerContext';
import TimerCard from './TimerCard';
import FullScreenTimer from './FullScreenTimer';

function TimerDashboard() {
  const { activeTimers, completeTimer, removeTimer } = useContext(TimerContext);
  const [fullScreenTimer, setFullScreenTimer] = useState(null);

  const handleFullScreen = (timer) => {
    setFullScreenTimer(timer);
  };

  const handleCloseFullScreen = () => {
    setFullScreenTimer(null);
  };

  const runningCount = activeTimers.filter(t => t.status === 'running').length;

  // ✅ Empty State - Mobile Responsive
  if (activeTimers.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 md:py-20 lg:py-24 animate-fade-in px-4">
        <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 sm:mb-6 animate-float">⏰</div>
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          No Active Timers
        </h3>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md mx-auto">
          Start a timer using the <span className="text-purple-400 font-semibold">presets</span> or <span className="text-pink-400 font-semibold">custom options</span> above!
        </p>
        <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2">
          <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-[10px] sm:text-xs md:text-sm border border-purple-500/20">
            ☕ Quick Break
          </span>
          <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-[10px] sm:text-xs md:text-sm border border-purple-500/20">
            🎯 Focus
          </span>
          <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-[10px] sm:text-xs md:text-sm border border-purple-500/20">
            💪 Workout
          </span>
          <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-[10px] sm:text-xs md:text-sm border border-purple-500/20">
            📚 Study
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      {/* Full Screen Timer Modal */}
      {fullScreenTimer && (
        <FullScreenTimer timer={fullScreenTimer} onClose={handleCloseFullScreen} />
      )}

      {/* Header - Mobile Responsive */}
      <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-5 md:mb-6 gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="text-xl sm:text-2xl">🕐</div>
            {runningCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse"></span>
            )}
          </div>
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
            Active Timers
          </h2>
          <span className="text-[10px] sm:text-xs md:text-sm font-normal bg-purple-500/20 text-purple-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-purple-500/30">
            {activeTimers.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-gray-400">
              <span className="text-white font-medium">{runningCount}</span> 
              <span className="hidden xs:inline ml-1">running</span>
            </span>
          </div>
          {activeTimers.length > 1 && (
            <span className="text-gray-500 text-[8px] sm:text-[10px] hidden sm:inline">
              {activeTimers.length - runningCount} paused
            </span>
          )}
        </div>
      </div>

      {/* Timer Cards Grid - Mobile Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {activeTimers.map((timer, index) => (
          <div 
            key={timer.id} 
            className="animate-fade-in" 
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <TimerCard timer={timer} onFullScreen={handleFullScreen} />
          </div>
        ))}
      </div>

      {/* Footer Tip - Only when many timers */}
      {activeTimers.length > 2 && (
        <div className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-gray-500 border-t border-white/5 pt-4 sm:pt-6">
          💡 You have <span className="text-purple-400 font-medium">{activeTimers.length}</span> active timers. 
          Click <span className="text-purple-400">⛶ Full Screen</span> for focus mode!
        </div>
      )}
    </div>
  );
}

export default TimerDashboard;