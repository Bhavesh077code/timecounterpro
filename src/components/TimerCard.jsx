// src/components/TimerCard.jsx
/*
import React, { useState, useEffect, useRef, useContext } from 'react';
import { TimerContext } from '../context/TimerContext';

function TimerCard({ timer, onFullScreen }) {
  const { updateTimer, completeTimer, removeTimer, resetTimer } = useContext(TimerContext);
  
  // ✅ State
  const [remaining, setRemaining] = useState(timer.remaining);
  const [isPaused, setIsPaused] = useState(timer.isPaused || false);
  const [isComplete, setIsComplete] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationShown, setCelebrationShown] = useState(false);
  
  // ✅ Refs
  const intervalRef = useRef(null);
  const celebrationTimerRef = useRef(null);
  const startTimeRef = useRef(timer.startTime || Date.now());
  const durationRef = useRef(timer.duration);
  const timerIdRef = useRef(timer.id);

  // ✅ Format Time
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return {
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
    };
  };

  // ✅ Calculate remaining based on elapsed time
  const calculateRemaining = () => {
    if (isPaused) return remaining;
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    const newRemaining = Math.max(0, durationRef.current - elapsed);
    return newRemaining;
  };

  // ✅ Timer Logic
  useEffect(() => {
    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current);
      celebrationTimerRef.current = null;
    }

    if (isPaused || isComplete) {
      clearInterval(intervalRef.current);
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(intervalRef.current);
      } else {
        const newRemaining = calculateRemaining();
        setRemaining(newRemaining);
        if (newRemaining <= 0 && !celebrationShown) {
          setCelebrationShown(true);
          setIsComplete(true);
          setShowCelebration(true);
          updateTimer(timer.id, 0, true);
          celebrationTimerRef.current = setTimeout(() => {
            setShowCelebration(false);
            celebrationTimerRef.current = null;
          }, 3000);
        } else {
          updateTimer(timer.id, newRemaining);
          if (!isPaused && !isComplete) {
            clearInterval(intervalRef.current);
            startInterval();
          }
        }
      }
    };

    const startInterval = () => {
      intervalRef.current = setInterval(() => {
        if (timerIdRef.current !== timer.id) return;
        
        const newRemaining = calculateRemaining();
        setRemaining(newRemaining);
        
        if (newRemaining <= 0 && !celebrationShown) {
          setCelebrationShown(true);
          clearInterval(intervalRef.current);
          setIsComplete(true);
          setShowCelebration(true);
          updateTimer(timer.id, 0, true);
          celebrationTimerRef.current = setTimeout(() => {
            setShowCelebration(false);
            celebrationTimerRef.current = null;
          }, 3000);
        } else {
          updateTimer(timer.id, newRemaining);
        }
      }, 1000);
    };

    startInterval();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (celebrationTimerRef.current) {
        clearTimeout(celebrationTimerRef.current);
        celebrationTimerRef.current = null;
      }
    };
  }, [isPaused, isComplete, timer.id, updateTimer, celebrationShown]);

  // ✅ Toggle Pause
  const togglePause = () => {
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    
    if (newPaused) {
      const currentRemaining = calculateRemaining();
      setRemaining(currentRemaining);
      updateTimer(timer.id, currentRemaining, false, true);
    } else {
      const currentRemaining = remaining;
      startTimeRef.current = Date.now() - (durationRef.current - currentRemaining) * 1000;
      updateTimer(timer.id, currentRemaining, false, false);
    }
  };

  // ✅ Reset Timer
  const handleReset = () => {
    setCelebrationShown(false);
    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current);
      celebrationTimerRef.current = null;
    }
    setShowCelebration(false);
    setRemaining(timer.duration);
    setIsPaused(false);
    setIsComplete(false);
    startTimeRef.current = Date.now();
    resetTimer(timer.id);
  };

  // ✅ Remove Timer
  const handleRemove = () => {
    removeTimer(timer.id);
  };

  // ✅ Stop Timer
  const handleStop = () => {
    setCelebrationShown(true);
    setRemaining(0);
    setIsComplete(true);
    setShowCelebration(true);
    updateTimer(timer.id, 0, true);
    celebrationTimerRef.current = setTimeout(() => {
      setShowCelebration(false);
      celebrationTimerRef.current = null;
    }, 3000);
  };

  // ✅ Current values
  const currentRemaining = isPaused ? remaining : calculateRemaining();
  const progress = ((timer.duration - currentRemaining) / timer.duration) * 100;
  const time = formatTime(Math.max(0, currentRemaining));
  const isRunning = !isPaused && !isComplete && currentRemaining > 0;

  // ✅ Handle Full Screen
  const handleFullScreen = () => {
    const currentTimer = {
      ...timer,
      remaining: Math.max(0, currentRemaining),
      isPaused: isPaused,
      startTime: startTimeRef.current,
    };
    onFullScreen(currentTimer);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 p-4 sm:p-5 md:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20">
      
     
      {showCelebration && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10 rounded-xl sm:rounded-2xl animate-fade-in">
          <div className="text-center p-3 sm:p-4">
            <div className="text-4xl sm:text-5xl md:text-6xl animate-bounce">🎉</div>
            <p className="text-white font-bold mt-1 sm:mt-2 text-base sm:text-lg">Timer Complete!</p>
            <p className="text-purple-300 text-xs sm:text-sm mt-0.5 sm:mt-1">{timer.name} ✅</p>
          </div>
        </div>
      )}

    
      <div className="flex items-start justify-between mb-2 sm:mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm sm:text-base md:text-lg truncate">
            {timer.name}
          </h3>
          <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
            <span className={`text-[8px] sm:text-[10px] md:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${
              isComplete ? 'bg-green-500/20 text-green-400' :
              isPaused ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {isComplete ? '✅ Done' : isPaused ? '⏸️ Paused' : '▶️ Running'}
            </span>
            <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 bg-white/5 px-1.5 sm:px-2 py-0.5 rounded-full">
              {timer.type}
            </span>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="text-gray-500 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded-lg text-sm sm:text-base"
        >
          ✕
        </button>
      </div>

      
      <div className="text-center py-2 sm:py-3">
        <div className="font-mono font-bold text-white text-3xl sm:text-4xl md:text-5xl tracking-wider">
          <span className="inline-block min-w-[2ch] sm:min-w-[3ch]">{time.hours}</span>
          <span className="text-purple-400 mx-0.5 sm:mx-1">:</span>
          <span className="inline-block min-w-[2ch] sm:min-w-[3ch]">{time.minutes}</span>
          <span className="text-purple-400 mx-0.5 sm:mx-1">:</span>
          <span className={`inline-block min-w-[2ch] sm:min-w-[3ch] ${isRunning ? 'animate-pulse' : ''}`}>
            {time.seconds}
          </span>
        </div>
      </div>

      
      <div className="mb-3 sm:mb-4">
        <div className="w-full bg-white/10 rounded-full h-1 sm:h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              progress < 30 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
              progress < 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
              'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
            style={{ width: `${Math.min(100, progress)}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[8px] sm:text-[10px] md:text-xs text-gray-500 mt-0.5 sm:mt-1">
          <span>{Math.floor(timer.duration / 60)}m</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      
      <div className="flex gap-1.5 sm:gap-2">
        {!isComplete ? (
          <>
            <button
              onClick={togglePause}
              className={`flex-1 py-1.5 sm:py-2 md:py-2.5 rounded-xl font-medium text-[10px] sm:text-xs md:text-sm transition-all duration-300 ${
                isPaused
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-lg hover:shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg hover:shadow-amber-500/25'
              }`}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button
              onClick={handleStop}
              className="flex-1 py-1.5 sm:py-2 md:py-2.5 bg-white/5 hover:bg-red-500/20 border border-white/5 text-white font-medium rounded-xl text-[10px] sm:text-xs md:text-sm transition-all duration-300"
            >
              ⏹ Stop
            </button>
          </>
        ) : (
          <button
            onClick={handleRemove}
            className="w-full py-1.5 sm:py-2 md:py-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white font-medium rounded-xl text-[10px] sm:text-xs md:text-sm transition-all duration-300"
          >
            🗑️ Remove
          </button>
        )}
      </div>

      
      {!isComplete && (
        <button
          onClick={handleReset}
          className="w-full mt-1.5 sm:mt-2 py-1.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white font-medium rounded-xl text-[10px] sm:text-xs md:text-sm transition-all duration-300"
        >
          🔄 Reset Timer
        </button>
      )}

      
      {isRunning && (
        <button
          onClick={handleFullScreen}
          className="w-full mt-1.5 sm:mt-2 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-[10px] sm:text-xs md:text-sm transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] flex items-center justify-center gap-1.5 sm:gap-2"
        >
          <span className="text-base sm:text-lg md:text-xl">⛶</span> 
          <span className="hidden xs:inline">Full Screen Study Mode</span>
          <span className="xs:hidden">Full Screen</span>
          <span className="text-[8px] sm:text-[10px] bg-white/20 px-1.5 sm:px-2 py-0.5 rounded-full hidden xs:inline">FOCUS</span>
        </button>
      )}

      
      <div className="mt-2 sm:mt-3 text-[8px] sm:text-[10px] text-gray-600 text-center">
        Started {new Date(timer.createdAt).toLocaleTimeString()}
      </div>
    </div>
  );
}

export default TimerCard;

*/


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
