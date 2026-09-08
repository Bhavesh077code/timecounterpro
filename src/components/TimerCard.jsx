
import React, { useContext } from 'react';
import { TimerContext } from '../context/TimerContext';
import { FiClock, FiPlay, FiPause, FiStopCircle, FiRefreshCw, FiX, FiMaximize2, FiCheckCircle } from 'react-icons/fi';

function formatTime(totalSeconds) {
  const safe = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  return {
    hours: String(Math.floor(safe / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((safe % 3600) / 60)).padStart(2, '0'),
    seconds: String(safe % 60).padStart(2, '0'),
  };
}

function TimerCard({ timer, onFullScreen, viewMode = 'grid' }) {
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

  // Determine status color
  const getStatusColor = () => {
    if (isComplete) return 'emerald';
    if (isPaused) return 'amber';
    return 'emerald';
  };

  const statusColor = getStatusColor();

  // Determine status label
  const getStatusLabel = () => {
    if (isComplete) return 'Completed';
    if (isPaused) return 'Paused';
    return 'Running';
  };

  // Get progress bar color
  const getProgressColor = () => {
    if (isComplete) return 'bg-emerald-500';
    if (isPaused) return 'bg-amber-500';
    return 'bg-gradient-to-r from-indigo-600 to-blue-600';
  };

  // Card classes based on view mode
  const cardClasses = viewMode === 'grid'
    ? 'group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-md hover:border-indigo-200'
    : 'group relative overflow-hidden rounded-xl bg-white border border-slate-200 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-md hover:border-indigo-200 flex flex-col sm:flex-row sm:items-center gap-4';

  return (
    <div className={cardClasses}>
      {/* Header */}
      <div className={`flex items-start justify-between ${viewMode === 'list' ? 'flex-1 min-w-0' : ''}`}>
        <div className="flex-1 min-w-0">
          <h3 className="text-slate-900 font-semibold text-sm sm:text-base md:text-lg truncate">
            {timer.name}
          </h3>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
            <span className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full border ${
              isComplete 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : isPaused 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {isComplete ? (
                <span className="flex items-center gap-1">
                  <FiCheckCircle size={10} />
                  Completed
                </span>
              ) : isPaused ? (
                <span className="flex items-center gap-1">
                  <FiPause size={10} />
                  Paused
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <FiPlay size={10} />
                  Running
                </span>
              )}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              {timer.type || 'Custom'}
            </span>
            {isRunning && (
              <span className="text-[10px] sm:text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                Live
              </span>
            )}
          </div>
        </div>
        <button 
          onClick={() => removeTimer(timer.id)} 
          className="text-slate-400 hover:text-rose-600 transition-colors p-1 hover:bg-rose-50 rounded-lg flex-shrink-0"
          aria-label={`Remove ${timer.name}`}
        >
          <FiX size={16} />
        </button>
      </div>

      {/* Time Display */}
      <div className={`text-center ${viewMode === 'list' ? 'flex-1' : 'py-2 sm:py-3'}`}>
        <div className={`font-mono font-bold text-slate-900 ${viewMode === 'list' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl md:text-5xl'} tracking-wider`}>
          <span>{time.hours}</span>
          <span className="text-slate-400 mx-1">:</span>
          <span>{time.minutes}</span>
          <span className="text-slate-400 mx-1">:</span>
          <span className={isRunning ? 'text-indigo-600' : ''}>{time.seconds}</span>
        </div>
        {viewMode === 'list' && (
          <div className="text-xs text-slate-500 mt-1">
            {Math.floor(timer.duration / 60)}m total • {Math.round(progress)}% complete
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full ${getProgressColor()} transition-[width] duration-300`} 
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
          />
        </div>
        {viewMode === 'grid' && (
          <div className="flex justify-between text-[10px] sm:text-xs text-slate-400 mt-1">
            <span>{Math.floor(timer.duration / 60)}m</span>
            <span>{Math.round(progress)}%</span>
          </div>
        )}
      </div>

      {/* Actions */}
      {!isComplete ? (
        <div className={`flex gap-2 ${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
          <button 
            onClick={togglePause} 
            className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all ${
              isPaused 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md' 
                : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow-md'
            }`}
          >
            {isPaused ? (
              <span className="flex items-center justify-center gap-1.5">
                <FiPlay size={14} />
                Resume
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1.5">
                <FiPause size={14} />
                Pause
              </span>
            )}
          </button>
          <button 
            onClick={handleStop} 
            className="flex-1 py-2 px-3 bg-slate-100 hover:bg-rose-100 text-slate-700 hover:text-rose-700 rounded-lg text-sm font-medium transition-all border border-slate-200 hover:border-rose-200"
          >
            <span className="flex items-center justify-center gap-1.5">
              <FiStopCircle size={14} />
              Stop
            </span>
          </button>
        </div>
      ) : (
        <button 
          onClick={() => removeTimer(timer.id)} 
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all border border-slate-200"
        >
          <span className="flex items-center justify-center gap-1.5">
            <FiX size={14} />
            Remove Timer
          </span>
        </button>
      )}

      {/* Secondary Actions */}
      {!isComplete && (
        <button 
          onClick={handleReset} 
          className={`w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? '' : ''}`}
        >
          <span className="flex items-center justify-center gap-1.5">
            <FiRefreshCw size={14} />
            Reset Timer
          </span>
        </button>
      )}

      {/* Full Screen Button */}
      {isRunning && (
        <button 
          onClick={handleFullScreen} 
          className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg text-sm shadow-sm hover:shadow-md transition-all"
        >
          <span className="flex items-center justify-center gap-2">
            <FiMaximize2 size={14} />
            Full Screen Focus
          </span>
        </button>
      )}

      {/* Footer */}
      <div className="text-[10px] text-slate-400 text-center border-t border-slate-100 pt-2 mt-2">
        <span className="flex items-center justify-center gap-1">
          <FiClock size={10} />
          Started {timer.createdAt ? new Date(timer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}
        </span>
      </div>
    </div>
  );
}

export default TimerCard;