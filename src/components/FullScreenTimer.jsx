// src/components/FullScreenTimer.jsx
/*
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
  
  // ✅ Sound State - Fast Response
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [showVolume, setShowVolume] = useState(false);
  
  // ✅ Refs - Safe initialization
  const intervalRef = useRef(null);
  const confettiTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const startTimeRef = useRef(timer?.startTime || Date.now());
  const durationRef = useRef(timer?.duration || 0);
  const timerIdRef = useRef(timer?.id || null);
  const isCompletedRef = useRef(false);
  const isMountedRef = useRef(true);
  const tickAudioRef = useRef(null);
  const completeAudioRef = useRef(null);

  // ✅ Load sounds
  useEffect(() => {
    try {
      tickAudioRef.current = new Audio('/sounds/tick.mp3');
      completeAudioRef.current = new Audio('/sounds/complete.mp3');
      tickAudioRef.current?.load();
      completeAudioRef.current?.load();
    } catch (error) {
      console.warn('Sound loading error:', error);
    }
    
    return () => {
      if (tickAudioRef.current) {
        tickAudioRef.current.pause();
        tickAudioRef.current = null;
      }
      if (completeAudioRef.current) {
        completeAudioRef.current.pause();
        completeAudioRef.current = null;
      }
    };
  }, []);

  // ✅ Play Tick Sound - Fast Response
  const playTickSound = () => {
    if (!soundEnabled) return;
    if (!tickAudioRef.current) return;
    try {
      const audio = tickAudioRef.current;
      audio.currentTime = 0;
      audio.volume = volume / 100;
      // ✅ Fast play with catch
      audio.play().catch(() => {});
    } catch (error) {
      // Silent fail
    }
  };

  // ✅ Play Completion Sound - Fast Response
  const playCompletionSound = () => {
    if (!soundEnabled) return;
    if (!completeAudioRef.current) return;
    try {
      const audio = completeAudioRef.current;
      audio.currentTime = 0;
      audio.volume = volume / 100;
      audio.play().catch(() => {});
    } catch (error) {
      // Silent fail
    }
  };

  // ✅ Toggle Sound - Instant Response
  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    
    // ✅ If turning off, immediately stop all sounds
    if (!newState) {
      try {
        if (tickAudioRef.current) {
          tickAudioRef.current.pause();
          tickAudioRef.current.currentTime = 0;
        }
        if (completeAudioRef.current) {
          completeAudioRef.current.pause();
          completeAudioRef.current.currentTime = 0;
        }
      } catch (error) {
        // Silent fail
      }
    }
  };

  // ✅ Volume Change - Instant
  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
    // ✅ Test sound on volume change
    if (soundEnabled) {
      playTickSound();
    }
  };

  // ✅ Get Volume Icon - Instant Update
  const getVolumeIcon = () => {
    if (!soundEnabled || volume === 0) return '🔇';
    if (volume < 30) return '🔈';
    if (volume < 70) return '🔉';
    return '🔊';
  };

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
    playCompletionSound();
    
    try {
      completeTimer(timerIdRef.current);
    } catch (error) {
      console.warn('Timer complete error:', error);
    }
    
    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
      confettiTimerRef.current = null;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    
    confettiTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setShowConfetti(false);
      }
      confettiTimerRef.current = null;
    }, 3000);

    closeTimerRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        handleClose();
      }
      closeTimerRef.current = null;
    }, 4000);
  };

  // ✅ Timer Logic
  useEffect(() => {
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
        
        // ✅ Fast tick sound - every 5 seconds
        if (!isPaused && !isComplete && newRemaining > 3 && newRemaining % 5 === 0) {
          playTickSound();
        }
        
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
  }, [isPaused, isComplete, timer?.id, updateTimer, volume, soundEnabled]);

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

    const timer = setTimeout(enterFullScreen, 100);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      } catch (error) {}
      
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
      // ✅ S for Sound toggle
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        toggleSound();
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
    } catch (error) {}
    
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

  if (!timer || !timer.id) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] flex flex-col items-center justify-center">
      
     
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      
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
        <div className="flex items-center gap-3 flex-wrap">
          
          
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1">
            <button
              onClick={toggleSound}
              className={`px-2.5 py-1.5 rounded-lg transition-all duration-150 text-sm font-medium ${
                soundEnabled 
                  ? 'bg-purple-500/40 text-purple-300 hover:bg-purple-500/50' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
              aria-label="Toggle sound"
              title={soundEnabled ? 'Sound ON (Press S)' : 'Sound OFF (Press S)'}
            >
              {soundEnabled ? '🔊 ON' : '🔇 OFF'}
            </button>
            
            {soundEnabled && (
              <button
                onClick={() => setShowVolume(!showVolume)}
                className="p-1.5 rounded-lg transition-all duration-150 text-gray-400 hover:text-white"
                aria-label="Volume"
              >
                {getVolumeIcon()}
              </button>
            )}
          </div>
          
         
          {showVolume && soundEnabled && (
            <div className="absolute right-0 top-full mt-2 bg-[#1a0a2e] border border-white/10 rounded-xl p-4 z-20 min-w-[180px] shadow-2xl shadow-purple-500/10 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">🔈</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 ${volume}%, rgba(255,255,255,0.15) ${volume}%)`
                  }}
                />
                <span className="text-xs text-gray-500">🔊</span>
              </div>
              <div className="flex justify-between mt-2 text-[10px]">
                <button
                  onClick={() => { setVolume(0); }}
                  className="text-gray-500 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-white/5"
                >
                  Mute
                </button>
                <span className="text-purple-400 font-medium">{volume}%</span>
                <button
                  onClick={() => { setVolume(100); }}
                  className="text-gray-500 hover:text-white transition-colors px-2 py-0.5 rounded hover:bg-white/5"
                >
                  Max
                </button>
              </div>
            </div>
          )}

          <span className="text-white/50 text-xs hidden md:inline">
            S: Sound • Space: Pause
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

      
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 w-full px-4">
        
        
        <div className="text-center mb-4 md:mb-8">
          <h2 className="text-2xl md:text-4xl font-bold text-white/80">
            {isComplete ? '🎉 Timer Complete!' : timer?.name || 'Timer'}
          </h2>
          <p className="text-purple-400/60 text-xs md:text-sm mt-1">
            {isComplete ? 'Congratulations! 🎊' : (timer?.type === 'preset' ? '⚡ Preset Timer' : '🎨 Custom Timer')}
          </p>
        </div>

        
        <div className="text-center w-full px-2">
          <div className="font-mono font-bold text-white tracking-wider flex flex-wrap justify-center items-center">
            <span className={`text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] inline-block min-w-[1ch] ${
              isComplete ? 'text-green-400' : ''
            }`}>
              {isComplete ? '00' : time.hours}
            </span>
            <span className={`text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] mx-0.5 sm:mx-1 md:mx-2 ${
              isComplete ? 'text-green-400/50' : 'text-purple-500/50'
            }`}>:</span>
            <span className={`text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] inline-block min-w-[1ch] ${
              isComplete ? 'text-green-400' : ''
            }`}>
              {isComplete ? '00' : time.minutes}
            </span>
            <span className={`text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] mx-0.5 sm:mx-1 md:mx-2 ${
              isComplete ? 'text-green-400/50' : 'text-purple-500/50'
            }`}>:</span>
            <span className={`text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-[10rem] xl:text-[12rem] inline-block min-w-[1ch] ${
              isComplete ? 'text-green-400' : (isRunning ? 'animate-pulse text-purple-400' : '')
            }`}>
              {isComplete ? '00' : time.seconds}
            </span>
          </div>
        </div>

        
        <div className="w-full max-w-2xl mt-6 md:mt-8 px-2">
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
          <div className="flex justify-between text-gray-500 text-[10px] xs:text-xs md:text-sm mt-2">
            <span>{Math.floor((durationRef.current || 0) / 60)}m</span>
            <span className={isComplete ? 'text-green-400' : 'text-purple-400'}>
              {isComplete ? '100% Complete ✅' : `${Math.round(Math.min(100, Math.max(0, progress)))}% Complete`}
            </span>
            <span>{isComplete ? '00:00:00' : `${time.hours}:${time.minutes}:${time.seconds}`}</span>
          </div>
        </div>

        
        <div className="mt-4 md:mt-6 text-center">
          <span className={`text-xs sm:text-sm md:text-base font-medium ${
            isComplete ? 'text-green-400' : isPaused ? 'text-yellow-400' : 'text-purple-400'
          }`}>
            {isComplete ? '✅ Timer Complete!' : isPaused ? '⏸️ Paused' : '▶️ Running'}
          </span>
          {isComplete && (
            <p className="text-gray-400 text-[10px] sm:text-sm mt-1">Closing in 4 seconds... ⏳</p>
          )}
        </div>

        
        {!isComplete ? (
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 mt-4 md:mt-6 justify-center px-2">
            <button
              onClick={togglePause}
              className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-2xl font-bold text-sm sm:text-base md:text-lg transition-all duration-300 ${
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
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 text-sm sm:text-base md:text-lg"
            >
              ⏹ Stop
            </button>
            <button
              onClick={handleReset}
              className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300 text-sm sm:text-base md:text-lg"
            >
              🔄 Reset
            </button>
          </div>
        ) : (
          <div className="mt-6 md:mt-8 text-center px-4">
            <div className="text-5xl sm:text-6xl md:text-8xl mb-4 animate-bounce">🎉</div>
            <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2">Timer Complete!</h3>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">Great job! 🎯</p>
            <p className="text-purple-300 text-xs sm:text-sm mt-2">⏳ Returning to dashboard...</p>
          </div>
        )}
      </div>

     
      <div className="absolute bottom-4 left-0 right-0 text-center text-gray-600 text-[8px] xs:text-[10px] sm:text-xs">
        <span className="hidden sm:inline">
          Press <kbd className="px-2 py-0.5 bg-white/5 rounded text-white/50 border border-white/10">Esc</kbd> to exit • 
          <kbd className="px-2 py-0.5 bg-white/5 rounded text-white/50 border border-white/10 ml-1">Space</kbd> to pause • 
          <kbd className="px-2 py-0.5 bg-white/5 rounded text-white/50 border border-white/10 ml-1">S</kbd> for Sound
        </span>
        <span className="sm:hidden">
          <kbd className="px-2 py-0.5 bg-white/5 rounded text-white/50 border border-white/10">Esc</kbd> Exit • 
          <kbd className="px-2 py-0.5 bg-white/5 rounded text-white/50 border border-white/10 ml-1">S</kbd> Sound
        </span>
      </div>
    </div>
  );
}

export default FullScreenTimer;

*/

/*

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TimerContext } from '../context/TimerContext';

const formatTime = (seconds) => {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  return {
    hours: String(Math.floor(safe / 3600)).padStart(2, '0'),
    minutes: String(Math.floor((safe % 3600) / 60)).padStart(2, '0'),
    seconds: String(safe % 60).padStart(2, '0'),
  };
};

function FullScreenTimer({ timer, onClose }) {
  const { activeTimers, addTimer, resetTimer, updateTimer } = useContext(TimerContext);
  const liveTimer = activeTimers.find((item) => item.id === timer?.id);
  const currentTimer = liveTimer || timer;
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [isFullScreen, setIsFullScreen] = useState(Boolean(document.fullscreenElement));
  const [showComplete, setShowComplete] = useState(false);

  const remaining = Math.max(0, Number(currentTimer?.remaining) || 0);
  const isPaused = Boolean(currentTimer?.isPaused || currentTimer?.status === 'paused');
  const isComplete = !liveTimer || currentTimer?.status === 'completed' || remaining <= 0;
  const time = useMemo(() => formatTime(remaining), [remaining]);
  const progress = currentTimer?.duration ? ((currentTimer.duration - remaining) / currentTimer.duration) * 100 : 0;

  useEffect(() => {
    if (isComplete) setShowComplete(true);
  }, [isComplete]);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      } else if (event.code === 'Space') {
        event.preventDefault();
        if (!isComplete) togglePause();
      } else if (event.key.toLowerCase() === 's') {
        event.preventDefault();
        setSoundEnabled((value) => !value);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isComplete, isPaused, remaining]);

  const playCompletionSound = () => {
    if (!soundEnabled) return;
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain);
      gain.connect(context.destination);
      gain.gain.value = Math.max(0.01, volume / 1000);
      oscillator.frequency.value = 880;
      oscillator.start();
      oscillator.stop(context.currentTime + 0.25);
    } catch {
      // Audio is optional and can be blocked by the browser.
    }
  };

  useEffect(() => {
    if (isComplete && showComplete) playCompletionSound();
    // Play only when the timer transitions into completion.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showComplete]);

  const togglePause = () => {
    if (!currentTimer?.id || isComplete) return;
    updateTimer(currentTimer.id, remaining, false, !isPaused);
  };

  const handleReset = () => {
    if (!currentTimer?.id) return;
    setShowComplete(false);

    if (liveTimer) {
      resetTimer(currentTimer.id);
      return;
    }

    // Completed timers are removed from activeTimers. Re-create the same timer when
    // the user presses Reset from the completion screen.
    addTimer({
      name: currentTimer.name,
      duration: currentTimer.duration,
      type: currentTimer.type,
      targetDate: currentTimer.targetDate,
      theme: currentTimer.theme,
    });
  };

  const toggleFullScreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen?.();
      }
    } catch (error) {
      console.warn('Fullscreen request was blocked by the browser:', error);
    }
  };

  const handleClose = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {
      // Ignore fullscreen cleanup errors.
    }
    onClose?.();
  };

  if (!currentTimer?.id) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#070707] via-[#180a29] to-[#070707] text-white flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" />
      </div>

      <header className="relative z-10 flex items-center justify-between gap-3 p-4 sm:p-6 bg-black/30 backdrop-blur-md border-b border-white/10">
        <div className="min-w-0">
          <h1 className="font-bold text-base sm:text-xl truncate">{currentTimer.name || 'Timer'}</h1>
          <p className="text-xs sm:text-sm text-white/50">{currentTimer.type || 'custom'} · {isPaused ? 'Paused' : isComplete ? 'Completed' : 'Running'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSoundEnabled((value) => !value)} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm" aria-label="Toggle sound">
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button onClick={toggleFullScreen} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-sm" aria-label="Toggle fullscreen">
            {isFullScreen ? '⛶ Exit' : '⛶ Fullscreen'}
          </button>
          <button onClick={handleClose} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm">✕ Close</button>
        </div>
      </header>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {showComplete ? (
          <div className="text-center mb-8">
            <div className="text-7xl sm:text-9xl mb-4">🎉</div>
            <h2 className="text-3xl sm:text-5xl font-bold">Timer Complete!</h2>
            <p className="text-purple-300 mt-2">{currentTimer.name}</p>
          </div>
        ) : (
          <>
            <div className="text-[clamp(4rem,16vw,11rem)] leading-none font-mono font-bold tracking-tight text-center tabular-nums">
              {time.hours}<span className="text-purple-400">:</span>{time.minutes}<span className="text-purple-400">:</span>{time.seconds}
            </div>
            <div className="w-full max-w-3xl mt-8">
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-[width] duration-300" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-white/40">
                <span>{Math.round(progress)}% complete</span>
                <span>Space: {isPaused ? 'Resume' : 'Pause'}</span>
              </div>
            </div>
          </>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {!showComplete && (
            <button onClick={togglePause} className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold">
              {isPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
          )}
          <button onClick={handleReset} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold">🔄 Reset</button>
          <button onClick={handleClose} className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold">✕ Close</button>
        </div>

        <div className="mt-8 flex items-center gap-3 text-xs text-white/40">
          <label htmlFor="fullscreen-volume">Volume</label>
          <input id="fullscreen-volume" type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} disabled={!soundEnabled} />
          <span>{volume}%</span>
        </div>
      </main>
    </div>
  );
}

export default FullScreenTimer;


*/



// src/components/FullScreenTimer.jsx
import React, { useContext, useEffect, useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { TimerContext } from "../context/TimerContext";

const formatTime = (seconds) => {
  const safe = Math.max(0, Math.floor(Number(seconds) || 0));
  return {
    hours: String(Math.floor(safe / 3600)).padStart(2, "0"),
    minutes: String(Math.floor((safe % 3600) / 60)).padStart(2, "0"),
    seconds: String(safe % 60).padStart(2, "0"),
  };
};

const PIP_WIDTH = 320;
const PIP_HEIGHT = 180;

function FullScreenTimer({ timer, onClose }) {
  const { activeTimers, addTimer, resetTimer, updateTimer } =
    useContext(TimerContext);
  const liveTimer = activeTimers.find((item) => item.id === timer?.id);
  const currentTimer = liveTimer || timer;
  const hasLiveContextTimer = Boolean(liveTimer);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [ambient, setAmbientState] = useState("none");
  const [isFullScreen, setIsFullScreen] = useState(
    Boolean(document.fullscreenElement),
  );
  const [showComplete, setShowComplete] = useState(false);
  const [pipWindow, setPipWindow] = useState(null);
  const [isVideoPipActive, setIsVideoPipActive] = useState(false);
  const [videoPipSupported, setVideoPipSupported] = useState(false);
  const audioContextRef = useRef(null);
  const tickAudioRef = useRef(null);
  const ambientContextRef = useRef(null);
  const ambientSourceRef = useRef(null);
  const pipCanvasRef = useRef(null);
  const pipVideoRef = useRef(null);

  const remaining = Math.max(0, Number(currentTimer?.remaining) || 0);
  const isPaused = Boolean(
    currentTimer?.isPaused || currentTimer?.status === "paused",
  );
  const isSeoTimer = timer?.type === "seo";
  const isComplete = hasLiveContextTimer
    ? currentTimer?.status === "completed" || remaining <= 0
    : !isSeoTimer &&
      Boolean(currentTimer?.status === "completed" || remaining <= 0);
  const time = useMemo(() => formatTime(remaining), [remaining]);
  const progress = currentTimer?.duration
    ? ((currentTimer.duration - remaining) / currentTimer.duration) * 100
    : 0;
  const isActive = !isPaused && !isComplete;

  // Load tick sound from public folder
  useEffect(() => {
    if (typeof window !== "undefined") {
      tickAudioRef.current = new Audio("/sounds/tick.mp3");
      tickAudioRef.current.preload = "auto";
      tickAudioRef.current.addEventListener("error", () => {
        console.warn(
          "[FullScreenTimer] /sounds/tick.mp3 could not be loaded — using a synthesized tick instead.",
        );
      });
    }
    return () => {
      if (tickAudioRef.current) {
        tickAudioRef.current.pause();
        tickAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isComplete) setShowComplete(true);
  }, [isComplete]);

  useEffect(() => {
    const handleFullscreenChange = () =>
      setIsFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
      } else if (event.code === "Space") {
        event.preventDefault();
        if (!isComplete) togglePause();
      } else if (event.key.toLowerCase() === "s") {
        event.preventDefault();
        setSoundEnabled((value) => !value);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isComplete, isPaused, remaining]);

  const playCompletionSound = () => {
    if (!soundEnabled) return;
    try {
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain);
      gain.connect(context.destination);
      gain.gain.value = Math.max(0.01, volume / 1000);
      oscillator.frequency.value = 880;
      oscillator.start();
      oscillator.stop(context.currentTime + 0.25);
    } catch {
      // Audio is optional and can be blocked by the browser.
    }
  };

  useEffect(() => {
    if (isComplete && showComplete) playCompletionSound();
  }, [showComplete]);

  const playTickSound = () => {
    if (!soundEnabled || volume <= 0 || !tickAudioRef.current) return;

    try {
      const audio = tickAudioRef.current;
      audio.volume = Math.max(0.01, volume / 100);
      audio.currentTime = 0;
      audio.play().catch(() => {
        tryFallbackTick();
      });
    } catch {
      tryFallbackTick();
    }
  };

  const tryFallbackTick = () => {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContextClass();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume().catch(() => {});

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(1400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        700,
        ctx.currentTime + 0.05,
      );

      const level = Math.max(0.03, (volume / 100) * 0.25);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(level, ctx.currentTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09);

      oscillator.connect(gain);
      gain.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.1);
    } catch {
      // Audio is optional and must never break the timer.
    }
  };

  const setAmbient = (value) => {
    setAmbientState(value);
  };

  useEffect(() => {
    const stopAmbient = () => {
      try {
        ambientSourceRef.current?.stop();
      } catch {}
      ambientSourceRef.current = null;
    };

    if (!isActive || ambient === "none" || !soundEnabled) {
      stopAmbient();
      return undefined;
    }

    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return undefined;

      if (!ambientContextRef.current) {
        ambientContextRef.current = new AudioContextClass();
      }

      const context = ambientContextRef.current;
      if (context.state === "suspended") context.resume().catch(() => {});

      stopAmbient();

      const bufferSize = context.sampleRate * 2;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;

      for (let i = 0; i < bufferSize; i += 1) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;

        let sample = last * (ambient === "rain" ? 3.2 : 2);

        if (ambient === "waves") {
          const t = i / context.sampleRate;
          const swell = Math.sin(t * 2 * Math.PI * 0.12) * 0.5 + 0.5;
          sample *= 0.25 + swell * 0.95;
        }

        data[i] = sample;
      }

      const source = context.createBufferSource();
      const gain = context.createGain();

      source.buffer = buffer;
      source.loop = true;

      const gainByAmbient = { lofi: 0.06, waves: 0.11, rain: 0.1 };
      gain.gain.value = (volume / 100) * (gainByAmbient[ambient] ?? 0.1);

      source.connect(gain);
      gain.connect(context.destination);
      source.start();

      ambientSourceRef.current = source;
    } catch (error) {
      console.warn("Ambient sound unavailable:", error);
    }

    return () => {
      stopAmbient();
    };
  }, [ambient, isActive, volume, soundEnabled]);

  // ---------------- FLOATING TIMER (Mobile + Desktop) ----------------
  const supportsDocumentPiP =
    typeof window !== "undefined" && "documentPictureInPicture" in window;

  const drawPipFrame = () => {
    const canvas = pipCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#0b0b14";
    ctx.fillRect(0, 0, w, h);

    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, "#a855f7");
    gradient.addColorStop(1, "#ec4899");

    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = "600 15px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    const label = (currentTimer?.name || "Timer").slice(0, 26);
    ctx.fillText(label, w / 2, 30);

    const showHours = time.hours !== "00";
    const timeText = showHours
      ? `${time.hours}:${time.minutes}:${time.seconds}`
      : `${time.minutes}:${time.seconds}`;

    ctx.fillStyle = "#ffffff";
    ctx.font = `bold ${showHours ? 48 : 62}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(timeText, w / 2, h / 2 + 8);

    const barHeight = 6;
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.fillRect(0, h - barHeight, w, barHeight);
    ctx.fillStyle = gradient;
    ctx.fillRect(
      0,
      h - barHeight,
      w * Math.min(1, Math.max(0, progress / 100)),
      barHeight,
    );

    if (isActive) {
      ctx.beginPath();
      ctx.fillStyle = "#c084fc";
      ctx.arc(w - 16, 16, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // One-time setup: hook the canvas into the hidden video via captureStream.
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const canvas = pipCanvasRef.current;
    const video = pipVideoRef.current;
    if (!canvas || !video || typeof canvas.captureStream !== "function")
      return undefined;

    drawPipFrame();

    try {
      if (!video.srcObject) {
        const stream = canvas.captureStream(30);
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        video.play().catch(() => {});
      }
    } catch (error) {
      console.warn("Floating timer preview unavailable:", error);
    }

    const standardSupported =
      typeof document !== "undefined" &&
      "pictureInPictureEnabled" in document &&
      document.pictureInPictureEnabled;
    const safariSupported =
      typeof video.webkitSupportsPresentationMode === "function";
    const iosPipSupported =
      typeof video.webkitSetPresentationMode === "function" &&
      typeof video.webkitPresentationMode !== "undefined";

    setVideoPipSupported(Boolean(standardSupported || safariSupported || iosPipSupported));

    return undefined;
  }, []);

  useEffect(() => {
    drawPipFrame();
  }, [remaining, isActive, progress, currentTimer?.name]);

  useEffect(() => {
    const video = pipVideoRef.current;
    if (!video) return undefined;

    const handleEnter = () => setIsVideoPipActive(true);
    const handleLeave = () => setIsVideoPipActive(false);
    const handleSafariModeChange = () => {
      setIsVideoPipActive(
        video.webkitPresentationMode === "picture-in-picture",
      );
    };

    video.addEventListener("enterpictureinpicture", handleEnter);
    video.addEventListener("leavepictureinpicture", handleLeave);
    video.addEventListener(
      "webkitpresentationmodechanged",
      handleSafariModeChange,
    );

    return () => {
      video.removeEventListener("enterpictureinpicture", handleEnter);
      video.removeEventListener("leavepictureinpicture", handleLeave);
      video.removeEventListener(
        "webkitpresentationmodechanged",
        handleSafariModeChange,
      );
    };
  }, []);

  const openVideoPip = async () => {
    const video = pipVideoRef.current;
    if (!video) return;

    try {
      if (typeof video.webkitSetPresentationMode === "function") {
        const next = video.webkitPresentationMode === "picture-in-picture"
          ? "inline"
          : "picture-in-picture";
        video.webkitSetPresentationMode(next);
        setIsVideoPipActive(next === "picture-in-picture");
        return;
      }

      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsVideoPipActive(false);
        return;
      }

      if (video.readyState < 2) {
        await new Promise((resolve) => {
          video.onloadedmetadata = resolve;
        });
      }

      await video.requestPictureInPicture();
      setIsVideoPipActive(true);
    } catch (error) {
      console.warn("Floating timer (video PiP) failed:", error);
      if (typeof window !== "undefined") {
        alert("Floating Timer is not supported in this browser. Please use Chrome or Safari.");
      }
    }
  };

  const closeVideoPip = async () => {
    try {
      const video = pipVideoRef.current;
      if (
        typeof video?.webkitSetPresentationMode === "function" &&
        video.webkitPresentationMode === "picture-in-picture"
      ) {
        video.webkitSetPresentationMode("inline");
      } else if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      }
    } catch {}
    setIsVideoPipActive(false);
  };

  const openFloatingTimer = async () => {
    if (supportsDocumentPiP) {
      if (pipWindow) {
        pipWindow.focus?.();
        return;
      }

      try {
        const nextWindow = await window.documentPictureInPicture.requestWindow({
          width: 340,
          height: 210,
        });

        const style = nextWindow.document.createElement("style");
        style.textContent = `
          * { box-sizing: border-box; }
          html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
          body {
            font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: radial-gradient(circle at top, #241044, #08080d 72%);
            color: white;
          }
          button { font: inherit; }
        `;
        nextWindow.document.head.appendChild(style);
        nextWindow.document.title = `${currentTimer?.name || "Timer"} • TimeCounterPro`;

        nextWindow.addEventListener("pagehide", () => setPipWindow(null));
        setPipWindow(nextWindow);
      } catch (error) {
        console.warn("Floating Timer could not be opened:", error);
        if (videoPipSupported) {
          openVideoPip();
        }
      }
      return;
    }

    if (videoPipSupported) {
      await openVideoPip();
      return;
    }

    if (typeof window !== "undefined") {
      alert("Floating Timer needs Chrome, Edge, or Safari (recent version) to work.");
    }
  };

  const closeFloatingTimer = () => {
    if (pipWindow) {
      try {
        pipWindow?.close();
      } catch {}
      setPipWindow(null);
      return;
    }
    closeVideoPip();
  };

  const isFloating = Boolean(pipWindow) || isVideoPipActive;
  const floatingSupported = supportsDocumentPiP || videoPipSupported;

  useEffect(() => {
    return () => {
      try {
        pipWindow?.close();
      } catch {}
      audioContextRef.current?.close?.().catch?.(() => {});
    };
  }, [pipWindow]);

  const togglePause = () => {
    if (!currentTimer?.id || isComplete) return;
    updateTimer(currentTimer.id, remaining, false, !isPaused);
  };

  useEffect(() => {
    if (isPaused || isComplete || remaining <= 0 || !soundEnabled) return;
    playTickSound();
  }, [remaining]);

  const handleReset = () => {
    if (!currentTimer?.id) return;
    setShowComplete(false);

    if (liveTimer) {
      resetTimer(currentTimer.id);
      return;
    }

    addTimer({
      name: currentTimer.name,
      duration: currentTimer.duration,
      type: currentTimer.type,
      targetDate: currentTimer.targetDate,
      theme: currentTimer.theme,
    });
  };

  const toggleFullScreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen?.();
      }
    } catch (error) {
      console.warn("Fullscreen request was blocked by the browser:", error);
    }
  };

  const handleClose = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch {}
    onClose?.();
  };

  if (!currentTimer?.id) return null;

  return (
    // ✅ FIX: Mobile UI - Top padding for navbar, overflow scroll
    <div className="fixed inset-0 z-40 bg-gradient-to-br from-[#070707] via-[#180a29] to-[#070707] text-white flex flex-col overflow-y-auto">
      
      {/* ✅ Mobile Top Padding */}
      <div className="pt-14 sm:pt-4 md:pt-6 flex-1 flex flex-col">
        
        <canvas
          ref={pipCanvasRef}
          width={PIP_WIDTH}
          height={PIP_HEIGHT}
          style={{ position: "fixed", left: "-9999px", top: "-9999px" }}
          aria-hidden="true"
        />
        <video
          ref={pipVideoRef}
          muted
          playsInline
          style={{
            position: "fixed",
            left: "-9999px",
            top: "-9999px",
            width: 1,
            height: 1,
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* ✅ Centered Floating Bar */}
        <div className="relative z-10 mx-auto mt-6 sm:mt-8 md:mt-12 w-full max-w-xl px-3 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
            <div className="min-w-0 flex-1">
              <h1 className="font-bold text-sm sm:text-base text-white truncate max-w-[100px] sm:max-w-[180px] md:max-w-[220px]">
                {currentTimer.name || "Timer"}
              </h1>
              <p className="text-[10px] sm:text-xs text-white/60 capitalize mt-0.5">
                {currentTimer.type || "custom"} ·{" "}
                {isPaused ? "Paused" : isComplete ? "Completed" : "Running"}
              </p>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                onClick={() => setSoundEnabled((value) => !value)}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-sm sm:text-base transition-all flex items-center justify-center"
              >
                {soundEnabled ? "🔊" : "🔇"}
              </button>

              <button
                onClick={toggleFullScreen}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-sm sm:text-base transition-all flex items-center justify-center"
              >
                ⛶
              </button>

              <button
                onClick={isFloating ? closeFloatingTimer : openFloatingTimer}
                disabled={!floatingSupported}
                className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl active:scale-95 text-sm sm:text-base transition-all flex items-center justify-center ${
                  isFloating
                    ? "bg-purple-500/30 text-purple-300"
                    : "bg-white/10 hover:bg-white/20"
                } ${!floatingSupported ? "opacity-40 cursor-not-allowed active:scale-100" : ""}`}
              >
                🪟
              </button>

              <button
                onClick={handleClose}
                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 active:scale-95 text-sm sm:text-base font-semibold transition-all flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Ambient Sound & Volume Bar */}
        <div className="relative z-10 mx-auto mt-3 sm:mt-4 md:mt-6 w-full max-w-xl px-3 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-xs sm:text-sm text-white/80">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs whitespace-nowrap">🎧 Focus:</span>
              <select
                value={ambient}
                onChange={(e) => setAmbient(e.target.value)}
                className="bg-black/50 text-white border border-white/20 rounded-lg px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs focus:outline-none focus:border-white/50 cursor-pointer max-w-[80px] sm:max-w-none"
              >
                <option value="none">Off 🔇</option>
                <option value="rain">Rain 🌧️</option>
                <option value="lofi">Lofi ☕</option>
                <option value="waves">Ocean 🌊</option>
              </select>
              {ambient !== "none" && isActive && (
                <span className="text-emerald-400 animate-pulse text-xs">●</span>
              )}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs hidden xs:inline">Volume:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-16 sm:w-20 md:w-28 accent-purple-500 cursor-pointer h-1"
              />
              <span className="text-[10px] sm:text-xs min-w-[28px] sm:min-w-[32px]">{volume}%</span>
            </div>
          </div>
        </div>

        {/* ✅ Main Timer - Bigger Text & Moved Up */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-3 sm:py-4">
          {showComplete ? (
            <div className="text-center mb-2 sm:mb-4">
              <div className="text-5xl sm:text-7xl md:text-9xl mb-2 sm:mb-3">🎉</div>
              <h2 className="text-xl sm:text-3xl md:text-5xl font-bold">Timer Complete!</h2>
              <p className="text-purple-300 mt-1 text-sm sm:text-base">{currentTimer.name}</p>
            </div>
          ) : (
            <>
              {/* ✅ TIMER - BIGGER TEXT & MOVED UP */}
              <div className="text-[clamp(5rem,20vw,14rem)] leading-none font-mono font-bold tracking-tight text-center tabular-nums -mt-4 sm:-mt-6 md:-mt-8">
                {time.hours}
                <span className="text-purple-400">:</span>
                {time.minutes}
                <span className="text-purple-400">:</span>
                {time.seconds}
              </div>
              
              <div className="w-full max-w-3xl mt-3 sm:mt-4">
                <div className="h-1.5 sm:h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-[width] duration-300"
                    style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-[8px] sm:text-xs text-white/40">
                  <span>{Math.round(progress)}% complete</span>
                  <span>Space: {isPaused ? "Resume" : "Pause"}</span>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {!showComplete && (
              <button
                onClick={togglePause}
                className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-xs sm:text-sm md:text-base hover:shadow-lg hover:shadow-orange-500/25 transition-all active:scale-95"
              >
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold text-xs sm:text-sm md:text-base transition-all active:scale-95 border border-white/5"
            >
              🔄 Reset
            </button>
            <button
              onClick={handleClose}
              className="px-4 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold text-xs sm:text-sm md:text-base transition-all active:scale-95 border border-white/5"
            >
              ✕ Close
            </button>
          </div>
        </main>

        {pipWindow &&
          createPortal(
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "14px",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#c4b5fd",
                  fontSize: "12px",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    maxWidth: "220px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  ⏱ {currentTimer?.name || "Timer"}
                </span>
                <span>{isPaused ? "Paused" : isComplete ? "Done" : "Live"}</span>
              </div>

              <div
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: "48px",
                  lineHeight: 1,
                  fontWeight: 800,
                  letterSpacing: "1px",
                }}
              >
                {time.hours !== "00" ? (
                  <span>{time.hours}:{time.minutes}:{time.seconds}</span>
                ) : (
                  <span>{time.minutes}:{time.seconds}</span>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                <button
                  onClick={togglePause}
                  disabled={isComplete}
                  style={{
                    border: 0,
                    borderRadius: "9px",
                    padding: "7px 12px",
                    color: "#fff",
                    background: isPaused ? "#059669" : "#d97706",
                    cursor: isComplete ? "not-allowed" : "pointer",
                    fontWeight: 700,
                    opacity: isComplete ? 0.5 : 1,
                  }}
                >
                  {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
                <button
                  onClick={() => setSoundEnabled((v) => !v)}
                  style={{
                    border: "1px solid rgba(255,255,255,.15)",
                    borderRadius: "9px",
                    padding: "7px 10px",
                    color: "#fff",
                    background: "rgba(255,255,255,.08)",
                    cursor: "pointer",
                  }}
                >
                  {soundEnabled ? "🔊" : "🔇"}
                </button>
                <button
                  onClick={closeFloatingTimer}
                  style={{
                    border: "1px solid rgba(255,255,255,.15)",
                    borderRadius: "9px",
                    padding: "7px 10px",
                    color: "#fff",
                    background: "rgba(255,255,255,.08)",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  width: "100%",
                  height: "4px",
                  marginTop: "12px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,.12)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${isComplete ? 100 : Math.min(100, Math.max(0, progress))}%`,
                    background: "linear-gradient(90deg,#8b5cf6,#ec4899)",
                    transition: "width .4s linear",
                  }}
                />
              </div>
            </div>,
            pipWindow.document.body,
          )}
      </div>
    </div>
  );
}

export default FullScreenTimer;