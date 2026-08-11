// src/components/Timer/PomodoroTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

function PomodoroTimer() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(() => Number(localStorage.getItem('pomo_sessions') || 0));
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [showVolume, setShowVolume] = useState(false);

  // ✅ BG Sound - 3 Options
  const [ambient, setAmbient] = useState('none');
  const [showSettings, setShowSettings] = useState(false);

  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  // ✅ Audio refs for MP3 files
  const tickAudioRef = useRef(null);
  const completeAudioRef = useRef(null);
  const bgAudioRef = useRef(null);

  // ✅ No file wale sound ke liye
  const audioContextRef = useRef(null);
  const ambientNodesRef = useRef([]);

  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  // ✅ Load MP3 sounds on mount
  useEffect(() => {
    tickAudioRef.current = new Audio('/sounds/tick.mp3');
    completeAudioRef.current = new Audio('/sounds/complete.mp3');
    bgAudioRef.current = new Audio('/sounds/background.mp3');

    tickAudioRef.current.load();
    completeAudioRef.current.load();
    bgAudioRef.current.load();

    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = volume / 100 * 0.3;

    return () => {
      if (tickAudioRef.current) {
        tickAudioRef.current.pause();
        tickAudioRef.current = null;
      }
      if (completeAudioRef.current) {
        completeAudioRef.current.pause();
        completeAudioRef.current = null;
      }
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
      stopAmbient();
    };
  }, []);

  // ✅ Update volume when changed
  useEffect(() => {
    if (tickAudioRef.current) {
      tickAudioRef.current.volume = volume / 100;
    }
    if (completeAudioRef.current) {
      completeAudioRef.current.volume = volume / 100;
    }
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = (volume / 100) * 0.3;
    }
    ambientNodesRef.current.forEach(n => {
      if(n.gain) n.gain.gain.value = (volume / 100) * (n.type === 'lofi'? 0.08 : 0.15);
    });
  }, [volume]);

  // ✅ Bina mp3 wala BG Sound Logic
  const stopAmbient = () => {
    ambientNodesRef.current.forEach(n => { try{ n.source?.stop(); }catch{} });
    ambientNodesRef.current = [];
  };

  const startAmbient = (type) => {
    stopAmbient();
    if (type === 'none') return;
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioContextRef.current;
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') { lastOut = (lastOut + 0.02 * white) / 1.02; data[i] = lastOut * 3.5; }
        else { lastOut = (lastOut + 0.02 * white) / 1.02; data[i] = lastOut * 2; }
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = (volume / 100) * (type === 'lofi'? 0.08 : 0.15);
      source.connect(gain);
      gain.connect(ctx.destination);
      source.start();
      ambientNodesRef.current.push({ source, gain, type });
    } catch {}
  };

  // ✅ BG Sound control
  useEffect(() => {
    if (ambient!== 'none' && isRunning) {
      startAmbient(ambient);
      bgAudioRef.current?.pause();
    } else {
      stopAmbient();
      bgAudioRef.current?.pause();
    }
  }, [ambient, isRunning]);

  // ✅ Play Tick Sound (MP3)
  const playTickSound = () => {
    if (!soundEnabled) return;
    if (!tickAudioRef.current) return;
    try {
      const audio = tickAudioRef.current;
      audio.currentTime = 0;
      audio.volume = volume / 100;
      audio.play().catch(() => {});
    } catch (error) {
      console.warn('Tick sound error:', error);
    }
  };

  // ✅ Play Completion Sound (MP3)
  const playCompletionSound = () => {
    if (!soundEnabled) return;
    if (!completeAudioRef.current) return;
    try {
      const audio = completeAudioRef.current;
      audio.currentTime = 0;
      audio.volume = volume / 100;
      audio.play().catch(() => {});
    } catch (error) {
      console.warn('Completion sound error:', error);
    }
  };

  // --- Timer Logic ---
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            playCompletionSound();
            toast.success(`${mode === 'focus'? '🎯 Focus' : '☕ Break'} complete!`);
            if (mode === 'focus') {
              const ns = sessions + 1;
              setSessions(ns);
              localStorage.setItem('pomo_sessions', ns);
              setMode('break');
              setTimeLeft(BREAK_TIME);
            } else {
              setMode('focus');
              setTimeLeft(FOCUS_TIME);
            }
            return 0;
          }
          if (prev > 2) playTickSound();
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode, sessions]);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = mode === 'focus'? ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100 : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  const getVolumeIcon = () => {
    if (!soundEnabled || volume === 0) return '🔇';
    if (volume < 30) return '🔈';
    if (volume < 70) return '🔉';
    return '🔊';
  };

  return (
    <div ref={containerRef} className="glass rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 animate-fade-in min-h-[400px] sm:min-h-[500px]">
      {/* Header - Mobile Optimized */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 flex-wrap gap-2">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center gap-1 sm:gap-2">
          <span className="text-xl sm:text-2xl md:text-3xl">🍅</span>
          <span className="hidden xs:inline">Pomodoro Timer</span>
          <span className="xs:hidden">Timer</span>
        </h2>
        
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm text-gray-400 hover:text-white transition-all"
          >
            ⚙️
          </button>
          <button 
            onClick={() => document.fullscreenElement ? document.exitFullscreen() : containerRef.current?.requestFullscreen()} 
            className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm text-gray-400 hover:text-white transition-all"
          >
            ⛶
          </button>
          <button
            onClick={() => { setSoundEnabled(!soundEnabled); toast(soundEnabled ? '🔇 Sound Off' : '🔊 Sound On'); }}
            className={`p-1.5 sm:p-2 rounded-lg transition-all text-xs sm:text-base ${
              soundEnabled ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-white/5 text-gray-500 hover:text-gray-400'
            }`}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            onClick={() => { const levels = [0, 30, 50, 70, 100]; const currentIndex = levels.indexOf(volume); const nextIndex = (currentIndex + 1) % levels.length; setVolume(levels[nextIndex]); toast(`Volume: ${levels[nextIndex]}%`); }}
            className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm text-gray-400 hover:text-white transition-all"
          >
            {getVolumeIcon()}
          </button>
        </div>
      </div>

      {/* Settings Panel - Mobile Responsive */}
      {showSettings && (
        <div className="mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 bg-white/5 rounded-xl">
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
            <span className="text-xs sm:text-sm text-gray-400">🎵 BG:</span>
            <button onClick={() => setAmbient('none')} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm transition-all ${ambient === 'none' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}>None</button>
            <button onClick={() => setAmbient('rain')} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm transition-all ${ambient === 'rain' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}>🌧 Rain</button>
            <button onClick={() => setAmbient('lofi')} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm transition-all ${ambient === 'lofi' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}>🎵 LoFi</button>
            <button onClick={() => setAmbient('white')} className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm transition-all ${ambient === 'white' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}>🤍 White</button>
            {ambient !== 'none' && isRunning && (<span className="text-[10px] sm:text-xs text-emerald-400 animate-pulse">●</span>)}
          </div>
          <div className="mt-1.5 sm:mt-2 text-[8px] sm:text-xs text-gray-500">💡 Plays when running</div>
        </div>
      )}

      {/* Timer Display - BIG & FULL SCREEN on mobile */}
      <div className="text-center py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1 sm:mb-2">
          {mode === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
        </div>
        
        {/* ✅ BIG TIMER - Mobile pe bhi bada */}
        <div className="text-7xl xs:text-8xl sm:text-9xl md:text-[8rem] lg:text-[10rem] font-mono font-bold text-white tracking-wider leading-none">
          {formatTime(timeLeft)}
        </div>
        
        <div className="mt-2 sm:mt-3 text-[10px] sm:text-sm text-gray-400">
          Sessions: <span className="text-purple-400 font-bold">{sessions}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 mb-3 sm:mb-4 md:mb-6">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            mode === 'focus' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      {/* Controls - Mobile Optimized */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-white font-semibold rounded-xl transition-all text-sm sm:text-base ${
            isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        <button
          onClick={() => { setIsRunning(false); setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME); }}
          className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-sm sm:text-base"
        >
          🔄 Reset
        </button>
      </div>

      {/* Status - Mobile Friendly */}
      <div className="mt-3 sm:mt-4 text-center text-[8px] sm:text-[10px] md:text-xs text-gray-500 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
        <span className={soundEnabled ? 'text-purple-400' : 'text-gray-500'}>
          {soundEnabled ? '🔊 ON' : '🔇 OFF'}
        </span>
        <span className="text-gray-500">| Vol: {volume}%</span>
        {ambient !== 'none' && (
          <span className="text-emerald-400">| 🎵 {ambient}</span>
        )}
        {isRunning && (
          <span className="flex items-center gap-1 text-purple-400">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
            <span className="hidden xs:inline">Live</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default PomodoroTimer;