// src/components/Timer/PomodoroTimer.jsx
/*
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

      
      <div className="text-center py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1 sm:mb-2">
          {mode === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
        </div>
        
       
        <div className="text-7xl xs:text-8xl sm:text-9xl md:text-[8rem] lg:text-[10rem] font-mono font-bold text-white tracking-wider leading-none">
          {formatTime(timeLeft)}
        </div>
        
        <div className="mt-2 sm:mt-3 text-[10px] sm:text-sm text-gray-400">
          Sessions: <span className="text-purple-400 font-bold">{sessions}</span>
        </div>
      </div>

      
      <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 mb-3 sm:mb-4 md:mb-6">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            mode === 'focus' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      
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

*/


// src/components/Timer/PomodoroTimer.jsx
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import {
  disableNotifications,
  enableNotifications,
  getNotificationEnabled,
  isNotificationSupported,
  notifyTimerComplete,
} from '../../utils/notifications';

const STORAGE_KEY = 'timecounter_pomodoro_v2';
const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

const DEFAULT_STATE = {
  mode: 'focus',
  timeLeft: FOCUS_TIME,
  isRunning: false,
  targetAt: null,
  sessions: 0,
  soundEnabled: true,
  volume: 50,
  ambient: 'none',
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function loadState() {
  if (typeof window === 'undefined') return DEFAULT_STATE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;

    const saved = JSON.parse(raw);
    const mode = saved.mode === 'break' ? 'break' : 'focus';
    const duration = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
    const sessions = Number.isFinite(Number(saved.sessions)) ? Math.max(0, Number(saved.sessions)) : 0;

    let timeLeft = clamp(Number(saved.timeLeft), 0, duration);
    let isRunning = Boolean(saved.isRunning);
    let targetAt = Number.isFinite(Number(saved.targetAt)) ? Number(saved.targetAt) : null;

    if (isRunning && targetAt) {
      timeLeft = Math.max(0, Math.ceil((targetAt - Date.now()) / 1000));
      if (timeLeft <= 0) {
        // Do not auto-complete during initialization. Start at the current phase.
        isRunning = false;
        targetAt = null;
        timeLeft = duration;
      }
    }

    return {
      ...DEFAULT_STATE,
      ...saved,
      mode,
      timeLeft,
      isRunning,
      targetAt,
      sessions,
      soundEnabled: saved.soundEnabled !== false,
      volume: clamp(Number(saved.volume ?? 50), 0, 100),
      ambient: ['none', 'rain', 'lofi', 'white'].includes(saved.ambient) ? saved.ambient : 'none',
    };
  } catch (error) {
    console.warn('Failed to restore Pomodoro state:', error);
    return DEFAULT_STATE;
  }
}

function playCompletionBeep(volume) {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, context.currentTime);
    oscillator.frequency.setValueAtTime(660, context.currentTime + 0.16);

    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      Math.max(0.02, (volume / 100) * 0.18),
      context.currentTime + 0.02
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.5);

    oscillator.connect(gain);
    gain.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + 0.55);
    oscillator.addEventListener('ended', () => context.close().catch(() => {}));
  } catch (error) {
    // Sound is optional. Never break the timer because audio is unavailable.
  }
}

function PomodoroTimer() {
  const [state, setState] = useState(loadState);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(getNotificationEnabled());

  const containerRef = useRef(null);
  const ambientSourceRef = useRef(null);
  const ambientContextRef = useRef(null);
  const lastSecondRef = useRef(null);
  const transitionLockRef = useRef(false);

  const { mode, timeLeft, isRunning, targetAt, sessions, soundEnabled, volume, ambient } = state;
  const duration = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;

  // Persist immediately whenever Pomodoro state changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save Pomodoro state:', error);
    }
  }, [state]);

  // Keep the visible countdown accurate using the absolute target timestamp.
  useEffect(() => {
    if (!isRunning || !targetAt) return undefined;

    const update = () => {
      setState((current) => {
        if (!current.isRunning || !current.targetAt) return current;

        const remaining = Math.max(0, Math.ceil((current.targetAt - Date.now()) / 1000));

        if (remaining <= 0) {
          return {
            ...current,
            timeLeft: 0,
            isRunning: false,
            targetAt: null,
          };
        }

        return current.timeLeft === remaining
          ? current
          : { ...current, timeLeft: remaining };
      });
    };

    update();
    const interval = window.setInterval(update, 250);
    return () => window.clearInterval(interval);
  }, [isRunning, targetAt]);

  // Handle phase completion in one place.
  useEffect(() => {
    if (timeLeft !== 0 || transitionLockRef.current) return;

    transitionLockRef.current = true;

    const finishedMode = mode;
    const nextMode = finishedMode === 'focus' ? 'break' : 'focus';
    const nextDuration = nextMode === 'focus' ? FOCUS_TIME : BREAK_TIME;
    const nextSessions = finishedMode === 'focus' ? sessions + 1 : sessions;

    if (soundEnabled) {
      playCompletionBeep(volume);
    }

    if (finishedMode === 'focus') {
      toast.success('🎯 Focus complete! Break time.');
    } else {
      toast.success('☕ Break complete! Focus time.');
    }

    if (notificationsEnabled) {
      notifyTimerComplete(
        finishedMode === 'focus' ? '🎯 Focus complete' : '☕ Break complete',
        finishedMode === 'focus' ? 'Your focus session is finished. Take a break.' : 'Your break is finished. Ready to focus?'
      );
    }

    setState((current) => ({
      ...current,
      mode: nextMode,
      timeLeft: nextDuration,
      isRunning: false,
      targetAt: null,
      sessions: nextSessions,
    }));

    transitionLockRef.current = false;
  }, [timeLeft, mode, sessions, soundEnabled, volume, notificationsEnabled]);

  // Ambient sound is opt-in and generated locally. It never requires missing MP3 files.
  useEffect(() => {
    const stopAmbient = () => {
      try {
        ambientSourceRef.current?.stop();
      } catch {}
      ambientSourceRef.current = null;
    };

    if (!isRunning || ambient === 'none') {
      stopAmbient();
      return undefined;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return undefined;

      if (!ambientContextRef.current) {
        ambientContextRef.current = new AudioContextClass();
      }

      const context = ambientContextRef.current;
      if (context.state === 'suspended') context.resume().catch(() => {});

      stopAmbient();

      const bufferSize = context.sampleRate * 2;
      const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;

      for (let i = 0; i < bufferSize; i += 1) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * (ambient === 'rain' ? 3.2 : 2);
      }

      const source = context.createBufferSource();
      const gain = context.createGain();

      source.buffer = buffer;
      source.loop = true;
      gain.gain.value = (volume / 100) * (ambient === 'lofi' ? 0.06 : 0.1);

      source.connect(gain);
      gain.connect(context.destination);
      source.start();

      ambientSourceRef.current = source;
    } catch (error) {
      console.warn('Ambient sound unavailable:', error);
    }

    return () => {
      stopAmbient();
    };
  }, [ambient, isRunning, volume]);

  useEffect(() => {
    return () => {
      try {
        ambientSourceRef.current?.stop();
      } catch {}
      ambientSourceRef.current = null;
      ambientContextRef.current?.close?.().catch?.(() => {});
    };
  }, []);

  // Only play sound when the user explicitly enables it; no per-second tick sound.
  useEffect(() => {
    lastSecondRef.current = timeLeft;
  }, [timeLeft]);

  const start = () => {
    if (isRunning) return;

    const safeTime = Math.max(1, timeLeft || duration);

    setState((current) => ({
      ...current,
      timeLeft: safeTime,
      isRunning: true,
      targetAt: Date.now() + safeTime * 1000,
    }));
  };

  const pause = () => {
    if (!isRunning) return;

    const remaining = targetAt
      ? Math.max(0, Math.ceil((targetAt - Date.now()) / 1000))
      : timeLeft;

    setState((current) => ({
      ...current,
      timeLeft: remaining,
      isRunning: false,
      targetAt: null,
    }));
  };

  const reset = () => {
    const nextDuration = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;

    setState((current) => ({
      ...current,
      timeLeft: nextDuration,
      isRunning: false,
      targetAt: null,
    }));

    toast('Pomodoro reset');
  };

  const toggleNotifications = async () => {
    if (!isNotificationSupported()) {
      toast.error('Browser notifications are not supported here.');
      return;
    }

    if (notificationsEnabled) {
      disableNotifications();
      setNotificationsEnabled(false);
      toast('🔕 Notifications disabled');
      return;
    }

    const enabled = await enableNotifications();

    if (enabled) {
      setNotificationsEnabled(true);
      toast.success('🔔 Notifications enabled');
    } else if (Notification.permission === 'denied') {
      toast.error('Notifications are blocked. Allow them in browser settings.');
    } else {
      toast.error('Notification permission was not granted.');
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current?.requestFullscreen?.();
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
    }
  };

  const toggleSound = () => {
    setState((current) => ({ ...current, soundEnabled: !current.soundEnabled }));
    toast(soundEnabled ? '🔇 Sound Off' : '🔊 Sound On');
  };

  const cycleVolume = () => {
    const levels = [0, 30, 50, 70, 100];
    const index = levels.indexOf(volume);
    setState((current) => ({
      ...current,
      volume: levels[(index < 0 ? 1 : index + 1) % levels.length],
    }));
  };

  const setAmbient = (value) => {
    setState((current) => ({ ...current, ambient: value }));
  };

  const formatTime = (seconds) => {
    const safe = Math.max(0, Math.floor(seconds));
    const mins = Math.floor(safe / 60);
    const secs = safe % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  const getVolumeIcon = () => {
    if (!soundEnabled || volume === 0) return '🔇';
    if (volume < 30) return '🔈';
    if (volume < 70) return '🔉';
    return '🔊';
  };

  return (
    <div ref={containerRef} className="glass rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 animate-fade-in min-h-[400px] sm:min-h-[500px]">
      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6 flex-wrap gap-2">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center gap-1 sm:gap-2">
          <span className="text-xl sm:text-2xl md:text-3xl">🍅</span>
          <span className="hidden xs:inline">Pomodoro Timer</span>
          <span className="xs:hidden">Timer</span>
        </h2>

        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <button
            onClick={() => setShowSettings((value) => !value)}
            className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm text-gray-400 hover:text-white transition-all"
            aria-label="Pomodoro settings"
          >
            ⚙️
          </button>

          {isNotificationSupported() && (
            <button
              onClick={toggleNotifications}
              className={`p-1.5 sm:p-2 rounded-lg text-xs sm:text-sm transition-all ${
                notificationsEnabled
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-white/5 text-gray-500 hover:text-gray-300'
              }`}
              title="Timer notifications"
              aria-label="Toggle timer notifications"
            >
              {notificationsEnabled ? '🔔' : '🔕'}
            </button>
          )}

          <button
            onClick={toggleFullscreen}
            className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm text-gray-400 hover:text-white transition-all"
            aria-label="Toggle fullscreen"
          >
            ⛶
          </button>

          <button
            onClick={toggleSound}
            className={`p-1.5 sm:p-2 rounded-lg transition-all text-xs sm:text-base ${
              soundEnabled ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' : 'bg-white/5 text-gray-500 hover:text-gray-400'
            }`}
            aria-label="Toggle completion sound"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>

          <button
            onClick={cycleVolume}
            className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm text-gray-400 hover:text-white transition-all"
            aria-label="Change volume"
          >
            {getVolumeIcon()}
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 bg-white/5 rounded-xl">
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
            <span className="text-xs sm:text-sm text-gray-400">🎵 BG:</span>

            {[
              ['none', 'None'],
              ['rain', '🌧 Rain'],
              ['lofi', '🎵 LoFi'],
              ['white', '🤍 White'],
            ].map(([value, label]) => (
              <button
                key={value}
                onClick={() => setAmbient(value)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-sm transition-all ${
                  ambient === value
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}

            {ambient !== 'none' && isRunning && (
              <span className="text-[10px] sm:text-xs text-emerald-400 animate-pulse">●</span>
            )}
          </div>

          <div className="mt-1.5 sm:mt-2 text-[8px] sm:text-xs text-gray-500">
            💡 Ambient sound plays only while the Pomodoro is running.
          </div>

          {isNotificationSupported() && (
            <button
              onClick={toggleNotifications}
              className="mt-3 text-xs text-gray-400 hover:text-white underline underline-offset-2"
            >
              {notificationsEnabled ? 'Disable timer notifications' : 'Enable timer notifications'}
            </button>
          )}
        </div>
      )}

      <div className="text-center py-3 sm:py-4 md:py-6 lg:py-8">
        <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-1 sm:mb-2">
          {mode === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
        </div>

        <div className="text-7xl xs:text-8xl sm:text-9xl md:text-[8rem] lg:text-[10rem] font-mono font-bold text-white tracking-wider leading-none tabular-nums">
          {formatTime(timeLeft)}
        </div>

        <div className="mt-2 sm:mt-3 text-[10px] sm:text-sm text-gray-400">
          Sessions: <span className="text-purple-400 font-bold">{sessions}</span>
        </div>
      </div>

      <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2 mb-3 sm:mb-4 md:mb-6">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            mode === 'focus'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
        <button
          onClick={isRunning ? pause : start}
          className={`px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-white font-semibold rounded-xl transition-all text-sm sm:text-base ${
            isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>

        <button
          onClick={reset}
          className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-sm sm:text-base"
        >
          🔄 Reset
        </button>
      </div>

      <div className="mt-3 sm:mt-4 text-center text-[8px] sm:text-[10px] md:text-xs text-gray-500 flex flex-wrap items-center justify-center gap-1.5 sm:gap-3">
        <span className={soundEnabled ? 'text-purple-400' : 'text-gray-500'}>
          {soundEnabled ? '🔊 ON' : '🔇 OFF'}
        </span>
        <span className="text-gray-500">| Vol: {volume}%</span>

        {ambient !== 'none' && (
          <span className="text-emerald-400">| 🎵 {ambient}</span>
        )}

        {notificationsEnabled && (
          <span className="text-purple-400">| 🔔 Notifications</span>
        )}

        {isRunning && (
          <span className="flex items-center gap-1 text-purple-400">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-400 rounded-full animate-pulse" />
            <span className="hidden xs:inline">Live</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default PomodoroTimer;
