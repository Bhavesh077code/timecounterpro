// src/components/FullScreenTimer.jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import { TimerContext } from '../context/TimerContext';

function FullScreenTimer({ timer, onClose }) {
  const { updateTimer, resetTimer, completeTimer } = useContext(TimerContext);
  
  // ✅ State - Proper initialization with fallbacks
  const [remaining, setRemaining] = useState(timer?.remaining ?? 0);
  const [isPaused, setIsPaused] = useState(timer?.isPaused || false);
  const [isComplete, setIsComplete] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // ✅ Refs - Safe initialization
  const intervalRef = useRef(null);
  const confettiTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const startTimeRef = useRef(timer?.startTime || Date.now());
  const durationRef = useRef(timer?.duration || 0);
  const timerIdRef = useRef(timer?.id || null);
  const isCompletedRef = useRef(false);
  const isMountedRef = useRef(true); // ✅ Prevent state update after unmount

  // ✅ Format Time - Safe
  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, seconds || 0);
    const h = Math.floor(safeSeconds / 3600);
    const m = Math.floor((safeSeconds % 3600) / 60);
    const s = safeSeconds % 60;
    return {
      hours: String(h).padStart(2, '0'),
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
    };
  };

  // ✅ Calculate remaining - Safe
  const calculateRemaining = () => {
    try {
      if (isPaused) return remaining;
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newRemaining = Math.max(0, (durationRef.current || 0) - elapsed);
      return newRemaining;
    } catch (error) {
      return remaining || 0;
    }
  };

  // ✅ Handle Timer Complete - Safe with mounted check
  const handleTimerComplete = () => {
    if (!isMountedRef.current) return;
    if (isCompletedRef.current) return;
    if (!timerIdRef.current) return;
    
    isCompletedRef.current = true;

    setIsComplete(true);
    setShowConfetti(true);
    
    try {
      completeTimer(timerIdRef.current);
    } catch (error) {
      console.warn('Timer complete error:', error);
    }
    
    // ✅ Clear existing timers
    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    
    // ✅ Show confetti for 3 seconds
    confettiTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setShowConfetti(false);
      }
      confettiTimerRef.current = null;
    }, 3000);

    // ✅ Auto close after 4 seconds
    closeTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        handleClose();
      }
      closeTimerRef.current = null;
    }, 4000);
  };

  // ✅ Timer Logic
  useEffect(() => {
    // ✅ Cleanup function
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (isPaused || isComplete || !timerIdRef.current) {
      cleanup();
      return;
    }

    // ✅ Handle page visibility change
    const handleVisibilityChange = () => {
      if (!isMountedRef.current) return;
      
      if (document.hidden) {
        cleanup();
      } else {
        const newRemaining = calculateRemaining();
        setRemaining(newRemaining);
        if (newRemaining <= 0) {
          handleTimerComplete();
        } else {
          try {
            updateTimer(timerIdRef.current, newRemaining);
          } catch (error) {
            console.warn('Update timer error:', error);
          }
          if (!isPaused && !isComplete) {
            cleanup();
            startInterval();
          }
        }
      }
    };

    const startInterval = () => {
      if (!isMountedRef.current) return;
      
      cleanup();
      
      intervalRef.current = setInterval(() => {
        if (!isMountedRef.current) {
          cleanup();
          return;
        }
        if (timerIdRef.current !== timer?.id) {
          cleanup();
          return;
        }
        
        const newRemaining = calculateRemaining();
        setRemaining(newRemaining);
        
        if (newRemaining <= 0) {
          cleanup();
          handleTimerComplete();
        } else {
          try {
            updateTimer(timerIdRef.current, newRemaining);
          } catch (error) {
            console.warn('Update timer error:', error);
          }
        }
      }, 1000);
    };

    startInterval();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cleanup();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPaused, isComplete, timer?.id, updateTimer]);

  // ✅ Auto Full Screen on mount
  useEffect(() => {
    isMountedRef.current = true;
    
    const enterFullScreen = () => {
      try {
        const el = document.documentElement;
        if (el.requestFullscreen) {
          el.requestFullscreen();
          setIsFullScreen(true);
        }
      } catch (error) {
        console.warn('Fullscreen error:', error);
      }
    };

    // ✅ Small delay to ensure DOM is ready
    const timer = setTimeout(enterFullScreen, 100);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      } catch (error) {
        // Ignore fullscreen exit error
      }
      
      // Cleanup all timers
      if (confettiTimerRef.current) {
        clearTimeout(confettiTimerRef.current);
        confettiTimerRef.current = null;
      }
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // ✅ Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isMountedRef.current) return;
      
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
      if (e.key === ' ' || e.key === 'Space') {
        e.preventDefault();
        togglePause();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPaused]);

  // ✅ Full Screen Functions
  const toggleFullScreen = () => {
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullScreen(false);
      } else {
        const el = document.documentElement;
        if (el.requestFullscreen) {
          el.requestFullscreen();
          setIsFullScreen(true);
        }
      }
    } catch (error) {
      console.warn('Toggle fullscreen error:', error);
    }
  };

  // ✅ Toggle Pause - Safe
  const togglePause = () => {
    if (!isMountedRef.current) return;
    if (!timerIdRef.current) return;
    
    const newPaused = !isPaused;
    setIsPaused(newPaused);
    
    try {
      if (newPaused) {
        const currentRemaining = calculateRemaining();
        setRemaining(currentRemaining);
        updateTimer(timerIdRef.current, currentRemaining, false, true);
      } else {
        const currentRemaining = remaining;
        startTimeRef.current = Date.now() - (durationRef.current - currentRemaining) * 1000;
        updateTimer(timerIdRef.current, currentRemaining, false, false);
      }
    } catch (error) {
      console.warn('Pause toggle error:', error);
    }
  };

  // ✅ Reset Timer - Safe
  const handleReset = () => {
    if (!isMountedRef.current) return;
    if (!timerIdRef.current) return;
    
    isCompletedRef.current = false;
    
    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    
    setShowConfetti(false);
    setRemaining(durationRef.current || 0);
    setIsPaused(false);
    setIsComplete(false);
    startTimeRef.current = Date.now();
    
    try {
      resetTimer(timerIdRef.current);
    } catch (error) {
      console.warn('Reset timer error:', error);
    }
  };

  // ✅ Close Handler - Safe
  const handleClose = () => {
    if (!isMountedRef.current) return;
    
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    } catch (error) {
      // Ignore
    }
    
    // Cleanup timers
    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (onClose) {
      onClose();
    }
  };

  // ✅ Safe values
  const currentRemaining = isPaused ? remaining : calculateRemaining();
  const safeRemaining = Math.max(0, currentRemaining || 0);
  const time = formatTime(safeRemaining);
  const progress = ((durationRef.current || 1) - safeRemaining) / (durationRef.current || 1) * 100;
  const isRunning = !isPaused && !isComplete && safeRemaining > 0;

  // ✅ If no timer, show nothing
  if (!timer || !timer.id) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex flex-col items-center justify-center">
      
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* ✅ Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDuration: `${Math.random() * 2 + 1}s`,
              }}
            >
              {['🎉', '⭐', '🎊', '✨', '🌟', '💫', '🎈', '🎆'][Math.floor(Math.random() * 8)]}
            </div>
          ))}
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            aria-label="Close timer"
          >
            ✕ Close
          </button>
          <span className="text-white/50 text-sm hidden sm:inline">|</span>
          <span className="text-white/70 text-sm font-medium hidden sm:inline">{timer?.name || 'Timer'}</span>
          <span className="text-purple-400/50 text-xs bg-purple-500/10 px-2 py-0.5 rounded-full hidden sm:inline">
            {timer?.type || 'custom'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/50 text-xs hidden md:inline">
            ␣ Pause • Esc Exit
          </span>
          <button
            onClick={toggleFullScreen}
            className="text-white/70 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
            aria-label="Toggle fullscreen"
          >
            {isFullScreen ? '⛶ Minimize' : '⛶ Full Screen'}
          </button>
        </div>
      </div>

      {/* Timer Display - Center */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full px-4">
        
        {/* Event Name */}
        <div className="text-center mb-4 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-white/80">
            {isComplete ? '🎉 Timer Complete!' : timer?.name || 'Timer'}
          </h2>
          <p className="text-purple-400/60 text-xs md:text-sm mt-1">
            {isComplete ? 'Congratulations! 🎊' : (timer?.type === 'preset' ? '⚡ Preset Timer' : '🎨 Custom Timer')}
          </p>
        </div>

        {/* ✅ Large Timer */}
        <div className="text-center">
          <div className="font-mono font-bold text-white tracking-wider flex flex-wrap justify-center items-center">
            <span className={`text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] inline-block min-w-[1ch] ${
              isComplete ? 'text-green-400' : ''
            }`}>
              {isComplete ? '00' : time.hours}
            </span>
            <span className={`text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] mx-1 md:mx-2 ${
              isComplete ? 'text-green-400/50' : 'text-purple-500/50'
            }`}>:</span>
            <span className={`text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] inline-block min-w-[1ch] ${
              isComplete ? 'text-green-400' : ''
            }`}>
              {isComplete ? '00' : time.minutes}
            </span>
            <span className={`text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] mx-1 md:mx-2 ${
              isComplete ? 'text-green-400/50' : 'text-purple-500/50'
            }`}>:</span>
            <span className={`text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] inline-block min-w-[1ch] ${
              isComplete ? 'text-green-400' : (isRunning ? 'animate-pulse text-purple-400' : '')
            }`}>
              {isComplete ? '00' : time.seconds}
            </span>
          </div>
        </div>

        {/* ✅ Progress Bar */}
        <div className="w-full max-w-2xl mt-6 md:mt-8">
          <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                progress < 30 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                progress < 70 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
              style={{ width: `${isComplete ? 100 : Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-gray-500 text-xs md:text-sm mt-2">
            <span>{Math.floor((durationRef.current || 0) / 60)}m</span>
            <span className={isComplete ? 'text-green-400' : 'text-purple-400'}>
              {isComplete ? '100% Complete ✅' : `${Math.round(Math.min(100, Math.max(0, progress)))}% Complete`}
            </span>
            <span>{isComplete ? '00:00:00' : `${time.hours}:${time.minutes}:${time.seconds}`}</span>
          </div>
        </div>

        {/* ✅ Status */}
        <div className="mt-4 md:mt-6 text-center">
          <span className={`text-sm md:text-base font-medium ${
            isComplete ? 'text-green-400' : isPaused ? 'text-yellow-400' : 'text-purple-400'
          }`}>
            {isComplete ? '✅ Timer Complete!' : isPaused ? '⏸️ Paused' : '▶️ Running'}
          </span>
          {isComplete && (
            <p className="text-gray-400 text-sm mt-1">Closing in 4 seconds... ⏳</p>
          )}
        </div>

        {/* ✅ Controls */}
        {!isComplete ? (
          <div className="flex flex-wrap gap-3 md:gap-4 mt-4 md:mt-6 justify-center">
            <button
              onClick={togglePause}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-base md:text-lg transition-all duration-300 ${
                isPaused
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:shadow-2xl hover:shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-2xl hover:shadow-amber-500/30'
              }`}
            >
              {isPaused ? '▶️ Resume' : '⏸️ Pause'}
            </button>
            <button
              onClick={() => {
                if (isMountedRef.current) {
                  setRemaining(0);
                  handleTimerComplete();
                }
              }}
              className="px-6 md:px-8 py-3 md:py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300"
            >
              ⏹ Stop
            </button>
            <button
              onClick={handleReset}
              className="px-6 md:px-8 py-3 md:py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300"
            >
              🔄 Reset
            </button>
          </div>
        ) : (
          <div className="mt-6 md:mt-8 text-center">
            <div className="text-6xl md:text-8xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">Timer Complete!</h3>
            <p className="text-gray-400 text-base md:text-lg">Great job! 🎯</p>
            <p className="text-purple-300 text-sm mt-2">⏳ Returning to dashboard...</p>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-600 text-xs">
        <span className="hidden sm:inline">
          Press <kbd className="px-2 py-0.5 bg-white/5 rounded text-white/50 border border-white/10">Esc</kbd> to exit • 
          <kbd className="px-2 py-0.5 bg-white/5 rounded text-white/50 border border-white/10 ml-1">Space</kbd> to pause/resume
        </span>
        <span className="sm:hidden">
          <kbd className="px-2 py-0.5 bg-white/5 rounded text-white/50 border border-white/10">Esc</kbd> to exit
        </span>
      </div>
    </div>
  );
}

export default FullScreenTimer;