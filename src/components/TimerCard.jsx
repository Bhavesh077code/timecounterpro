


import React, { useContext } from 'react';
import { TimerContext } from '../context/TimerContext';

function formatTime(totalSeconds) {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  return {
    hours: String(Math.floor(safe / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((safe % 3600) / 60)).padStart(2, '0'),
    seconds: String(safe % 60).padStart(2, '0'),
  };
}

function TimerCard({ timer, onFullScreen }) {
  const { updateTimer, removeTimer, resetTimer } = useContext(TimerContext);
  const remaining = Math.max(0, Number(timer.remaining) || 0);
  const isPaused = timer.isPaused || timer.status === 'paused';
  const isComplete = timer.status === 'completed' || remaining <= 0;
  const isRunning = !isPaused && !isComplete;
  const progress = timer.duration > 0 ? ((timer.duration - remaining) / timer.duration) * 100 : 0;
  const time = formatTime(remaining);

  const togglePause = () => {
    if (isComplete) return;
    updateTimer(timer.id, remaining, false, !isPaused);
  };

  const handleReset = () => {
    resetTimer(timer.id);
  };

  const handleStop = () => {
    updateTimer(timer.id, 0, true, false);
  };

  const handleFullScreen = () => {
    onFullScreen?.({ ...timer, remaining, isPaused });
  };

  return (
    <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
      <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm sm:text-base md:text-lg truncate">{timer.name}</h3>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
            <span className={`text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
              isComplete ? 'bg-green-500/20 text-green-400' :
              isPaused ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {isComplete ? '✅ Done' : isPaused ? '⏸️ Paused' : '▶️ Running'}
            </span>
            <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 bg-white/5 px-1.5 sm:px-2 py-0.5 rounded-full">{timer.type}</span>
          </div>
        </div>
        <button onClick={() => removeTimer(timer.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded-lg" aria-label={`Remove ${timer.name}`}>✕</button>
      </div>

      <div className="text-center py-2 sm:py-3">
        <div className="font-mono font-bold text-white text-3xl sm:text-4xl md:text-5xl tracking-wider">
          <span>{time.hours}</span><span className="text-purple-400 mx-1">:</span>
          <span>{time.minutes}</span><span className="text-purple-400 mx-1">:</span>
          <span className={isRunning ? 'animate-pulse' : ''}>{time.seconds}</span>
        </div>
      </div>

      <div className="mb-3 sm:mb-4">
        <div className="w-full bg-white/10 rounded-full h-1 sm:h-1.5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-[width] duration-300" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
        </div>
        <div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs text-gray-500 mt-1">
          <span>{Math.floor(timer.duration / 60)}m</span><span>{Math.round(progress)}%</span>
        </div>
      </div>

      {!isComplete ? (
        <div className="flex gap-1.5 sm:gap-2">
          <button onClick={togglePause} className={`flex-1 py-2 md:py-2.5 rounded-xl font-medium text-xs sm:text-sm ${isPaused ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-amber-500 to-orange-500'} text-white`}>
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          <button onClick={handleStop} className="flex-1 py-2 md:py-2.5 bg-white/5 hover:bg-red-500/20 border border-white/5 text-white rounded-xl text-xs sm:text-sm">⏹ Stop</button>
        </div>
      ) : (
        <button onClick={() => removeTimer(timer.id)} className="w-full py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-xl text-xs sm:text-sm">🗑️ Remove</button>
      )}

      {!isComplete && (
        <button onClick={handleReset} className="w-full mt-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white rounded-xl text-xs sm:text-sm">🔄 Reset Timer</button>
      )}

      {isRunning && (
        <button onClick={handleFullScreen} className="w-full mt-2 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-xs sm:text-sm hover:shadow-xl hover:shadow-purple-500/20">
          ⛶ Full Screen Study Mode
        </button>
      )}

      <div className="mt-2 sm:mt-3 text-[8px] sm:text-[10px] text-gray-600 text-center">
        Started {timer.createdAt ? new Date(timer.createdAt).toLocaleTimeString() : 'now'}
      </div>
    </div>
  );
}

export default TimerCard;
