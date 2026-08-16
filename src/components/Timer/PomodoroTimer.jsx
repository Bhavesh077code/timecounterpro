

// src/components/Timer/PomodoroTimer.jsx
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

// Ambient options: 'none' + 5 real background sounds
const AMBIENT_OPTIONS = ['none', 'rain', 'lofi', 'white', 'ocean', 'brown'];

// Picture-in-Picture floating timer canvas size (16:9-ish, small)
const PIP_WIDTH = 320;
const PIP_HEIGHT = 180;

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
      ambient: AMBIENT_OPTIONS.includes(saved.ambient) ? saved.ambient : 'none',
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
  const [isVideoPipActive, setIsVideoPipActive] = useState(false);
  const [videoPipSupported, setVideoPipSupported] = useState(false);
  const [pipWindow, setPipWindow] = useState(null);

  const containerRef = useRef(null);
  const ambientSourceRef = useRef(null);
  const ambientContextRef = useRef(null);
  const lastSecondRef = useRef(null);
  const transitionLockRef = useRef(false);
  const prevSecondRef = useRef(null);
  const tickAudioRef = useRef(null);
  const pipCanvasRef = useRef(null);
  const pipVideoRef = useRef(null);

  const { mode, timeLeft, isRunning, targetAt, sessions, soundEnabled, volume, ambient } = state;
  const duration = mode === 'focus' ? FOCUS_TIME : BREAK_TIME;
  const progress = ((duration - timeLeft) / duration) * 100;

  // Load tick sound once (same as FullScreenTimer)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('/sounds/tick.mp3');
      audio.preload = 'auto';

      audio.addEventListener('error', () => {
        console.warn(
          '[Pomodoro] /sounds/tick.mp3 could not be loaded — using a synthesized ' +
          'tick sound instead. Add a real tick.mp3 file under public/sounds/ to use a custom click.'
        );
      });

      tickAudioRef.current = audio;
    }
    return () => {
      if (tickAudioRef.current) {
        tickAudioRef.current.pause();
        tickAudioRef.current = null;
      }
    };
  }, []);

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

  // --- PLAY TICK SOUND (exactly like FullScreenTimer) ---
  useEffect(() => {
    if (isRunning && soundEnabled && timeLeft > 0) {
      if (prevSecondRef.current !== timeLeft) {
        playTickSound();
      }
    }
    prevSecondRef.current = timeLeft;
  }, [timeLeft, isRunning, soundEnabled]);

  // IMPORTANT FIX: the moment sound is turned off, cut any tick that is
  // currently mid-playback immediately instead of letting it finish on its
  // own (which could take a few seconds if tick.mp3 is a longer clip).
  useEffect(() => {
    if (soundEnabled) return;

    if (tickAudioRef.current) {
      try {
        tickAudioRef.current.pause();
        tickAudioRef.current.currentTime = 0;
      } catch {}
    }
  }, [soundEnabled]);

  const playTickSound = () => {
    if (!soundEnabled || volume <= 0 || !tickAudioRef.current) return;

    try {
      const audio = tickAudioRef.current;
      audio.volume = Math.max(0.01, volume / 100);
      audio.currentTime = 0;
      audio.play().catch((error) => {
        console.warn('[Pomodoro] tick.mp3 playback blocked/failed, using fallback:', error?.message);
        tryFallbackTick();
      });
    } catch {
      tryFallbackTick();
    }
  };

  const tryFallbackTick = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      if (!ambientContextRef.current) {
        ambientContextRef.current = new AudioContextClass();
      }

      const ctx = ambientContextRef.current;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(1400, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.05);

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
  // --- END TICK SOUND ---

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

  // Ambient sound is opt-in and generated locally — no MP3 files required.
  // FIX: now also respects the master sound toggle, and stops immediately
  // (same render) when sound is turned off, instead of playing on regardless.
  useEffect(() => {
    const stopAmbient = () => {
      try {
        ambientSourceRef.current?.stop();
      } catch {}
      ambientSourceRef.current = null;
    };

    if (!isRunning || ambient === 'none' || !soundEnabled) {
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

      const filterCoeff = ambient === 'brown' ? 0.005 : 0.02;

      for (let i = 0; i < bufferSize; i += 1) {
        const white = Math.random() * 2 - 1;
        last = (last + filterCoeff * white) / (1 + filterCoeff);

        let sample = last * (ambient === 'rain' ? 3.2 : ambient === 'brown' ? 6 : 2);

        if (ambient === 'ocean') {
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

      const gainByAmbient = {
        lofi: 0.06,
        brown: 0.14,
        ocean: 0.11,
      };
      gain.gain.value = (volume / 100) * (gainByAmbient[ambient] ?? 0.1);

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
  }, [ambient, isRunning, volume, soundEnabled]);

  useEffect(() => {
    return () => {
      try {
        ambientSourceRef.current?.stop();
      } catch {}
      ambientSourceRef.current = null;
      ambientContextRef.current?.close?.().catch?.(() => {});
      if (tickAudioRef.current) {
        tickAudioRef.current.pause();
        tickAudioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    lastSecondRef.current = timeLeft;
  }, [timeLeft]);

  const start = () => {
    setState((current) => {
      if (current.isRunning) return current;
      const safeTime = Math.max(1, current.timeLeft || (current.mode === 'focus' ? FOCUS_TIME : BREAK_TIME));
      return {
        ...current,
        timeLeft: safeTime,
        isRunning: true,
        targetAt: Date.now() + safeTime * 1000,
      };
    });
  };

  const pause = () => {
    setState((current) => {
      if (!current.isRunning) return current;
      const remaining = current.targetAt
        ? Math.max(0, Math.ceil((current.targetAt - Date.now()) / 1000))
        : current.timeLeft;
      return {
        ...current,
        timeLeft: remaining,
        isRunning: false,
        targetAt: null,
      };
    });
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

  const toggleSound = () => {
    setState((current) => ({ ...current, soundEnabled: !current.soundEnabled }));
    toast(soundEnabled ? '🔇 Sound Off' : '🔊 Sound On');
  };

  // ---------------- FLOATING TIMER ----------------
  // Two tiers, same pattern as FullScreenTimer:
  // 1) Chrome/Edge desktop → Document Picture-in-Picture: a real floating HTML
  //    window with its own small Start/Pause + Sound buttons (fully interactive,
  //    won't distract — just time + two tiny buttons).
  // 2) Everywhere else (mobile Chrome, Safari) → canvas→video Picture-in-Picture.
  //    The browser draws its own native Play/Pause overlay on this floating
  //    video, and we listen for those native play/pause events to drive the
  //    real timer. A custom "sound" button isn't possible here — mobile/Safari
  //    video PiP only exposes play/pause/close, that's a browser limitation,
  //    not something we can add a button for.

  const supportsDocumentPiP =
    typeof window !== 'undefined' &&
    'documentPictureInPicture' in window;

  const drawPipFrame = (currentTimeLeft, currentMode, currentIsRunning, currentProgress) => {
    const canvas = pipCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0b0b14';
    ctx.fillRect(0, 0, w, h);

    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    if (currentMode === 'focus') {
      gradient.addColorStop(0, '#a855f7');
      gradient.addColorStop(1, '#ec4899');
    } else {
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(1, '#14b8a6');
    }

    // Small centered label at the top
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = '600 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(currentMode === 'focus' ? 'FOCUS' : 'BREAK', w / 2, 34);

    const safeTime = Math.max(0, Math.floor(currentTimeLeft));
    const mins = Math.floor(safeTime / 60);
    const secs = safeTime % 60;
    const timeText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(timeText, w / 2, h / 2 + 6);

    const barHeight = 6;
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.fillRect(0, h - barHeight, w, barHeight);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, h - barHeight, w * Math.min(1, Math.max(0, currentProgress / 100)), barHeight);

    if (!currentIsRunning) {
      // Small paused indicator so it's obvious from the floating window
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '600 13px sans-serif';
      ctx.fillText('PAUSED', w / 2, h - 16);
    } else {
      ctx.beginPath();
      ctx.fillStyle = '#c084fc';
      ctx.arc(w - 16, 16, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // One-time setup: hook the canvas into the hidden video via captureStream.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const canvas = pipCanvasRef.current;
    const video = pipVideoRef.current;
    if (!canvas || !video || typeof canvas.captureStream !== 'function') return undefined;

    drawPipFrame(timeLeft, mode, isRunning, progress);

    try {
      if (!video.srcObject) {
        const stream = canvas.captureStream(30);
        video.srcObject = stream;
        video.muted = true;
        video.playsInline = true;
        video.play().catch(() => {});
      }
    } catch (error) {
      console.warn('Floating timer preview unavailable:', error);
    }

    const standardSupported = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document && document.pictureInPictureEnabled;
    const safariSupported = typeof video.webkitSupportsPresentationMode === 'function';
    setVideoPipSupported(Boolean(standardSupported || safariSupported));

    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw the floating canvas whenever the visible state changes.
  useEffect(() => {
    drawPipFrame(timeLeft, mode, isRunning, progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, mode, isRunning, progress]);

  // Keep isVideoPipActive in sync if the user closes the floating window themselves.
  useEffect(() => {
    const video = pipVideoRef.current;
    if (!video) return undefined;

    const handleEnter = () => setIsVideoPipActive(true);
    const handleLeave = () => setIsVideoPipActive(false);
    const handleSafariModeChange = () => {
      setIsVideoPipActive(video.webkitPresentationMode === 'picture-in-picture');
    };

    video.addEventListener('enterpictureinpicture', handleEnter);
    video.addEventListener('leavepictureinpicture', handleLeave);
    video.addEventListener('webkitpresentationmodechanged', handleSafariModeChange);

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnter);
      video.removeEventListener('leavepictureinpicture', handleLeave);
      video.removeEventListener('webkitpresentationmodechanged', handleSafariModeChange);
    };
  }, []);

  // Native Start/Pause: when the user taps the browser's own Play/Pause button
  // drawn on top of the floating video (mobile/Safari path), mirror it onto
  // the real Pomodoro state so the timer actually starts/stops.
  useEffect(() => {
    const video = pipVideoRef.current;
    if (!video) return undefined;

    const handleVideoPlay = () => {
      if (isVideoPipActive) start();
    };
    const handleVideoPause = () => {
      if (isVideoPipActive) pause();
    };

    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);

    return () => {
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoPipActive]);

  const openVideoPip = async () => {
    const video = pipVideoRef.current;
    if (!video) return;

    try {
      const hasStandardPip = typeof document !== 'undefined' && 'pictureInPictureEnabled' in document && document.pictureInPictureEnabled;
      const hasSafariPip = typeof video.webkitSetPresentationMode === 'function';

      if (!hasStandardPip && hasSafariPip) {
        const next = video.webkitPresentationMode === 'picture-in-picture' ? 'inline' : 'picture-in-picture';
        video.webkitSetPresentationMode(next);
        setIsVideoPipActive(next === 'picture-in-picture');
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
      console.warn('Floating timer (PiP) failed:', error);
      toast.error('Floating timer is not supported in this browser.');
    }
  };

  const closeVideoPip = async () => {
    try {
      const video = pipVideoRef.current;
      if (typeof video?.webkitSetPresentationMode === 'function' && video.webkitPresentationMode === 'picture-in-picture') {
        video.webkitSetPresentationMode('inline');
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
          width: 300,
          height: 170,
        });

        const style = nextWindow.document.createElement('style');
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
        nextWindow.document.title = 'Pomodoro • TimeCounterPro';

        nextWindow.addEventListener('pagehide', () => setPipWindow(null));
        setPipWindow(nextWindow);
      } catch (error) {
        console.warn('Floating Timer could not be opened:', error);
      }
      return;
    }

    if (videoPipSupported) {
      openVideoPip();
      return;
    }

    toast.error('Floating timer needs Chrome, Edge, or a recent Safari.');
  };

  const closeFloatingTimer = () => {
    if (pipWindow) {
      try { pipWindow.close(); } catch {}
      setPipWindow(null);
      return;
    }
    closeVideoPip();
  };

  useEffect(() => {
    return () => {
      try { pipWindow?.close(); } catch {}
    };
  }, [pipWindow]);

  const isFloating = Boolean(pipWindow) || isVideoPipActive;
  const floatingSupported = supportsDocumentPiP || videoPipSupported;
  // -------------- END FLOATING TIMER --------------

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

  const getVolumeIcon = () => {
    if (!soundEnabled || volume === 0) return '🔇';
    if (volume < 30) return '🔈';
    if (volume < 70) return '🔉';
    return '🔊';
  };

  return (
    <div ref={containerRef} className="glass rounded-2xl p-3 sm:p-4 md:p-6 lg:p-8 animate-fade-in min-h-[400px] sm:min-h-[500px]">
      {/* Hidden canvas + video that power the mobile/Safari floating-timer fallback. */}
      <canvas
        ref={pipCanvasRef}
        width={PIP_WIDTH}
        height={PIP_HEIGHT}
        style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}
        aria-hidden="true"
      />
      <video
        ref={pipVideoRef}
        muted
        playsInline
        style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: 1, height: 1 }}
        aria-hidden="true"
      />

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

          {floatingSupported && (
            <button
              onClick={isFloating ? closeFloatingTimer : openFloatingTimer}
              className={`p-1.5 sm:p-2 rounded-lg text-xs sm:text-base transition-all ${
                isFloating ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
              title="Float timer (Picture-in-Picture)"
              aria-label="Toggle floating timer"
            >
              🪟
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
              ['ocean', '🌊 Ocean'],
              ['brown', '🟤 Brown'],
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

            {ambient !== 'none' && isRunning && soundEnabled && (
              <span className="text-[10px] sm:text-xs text-emerald-400 animate-pulse">●</span>
            )}
          </div>

          <div className="mt-1.5 sm:mt-2 text-[8px] sm:text-xs text-gray-500">
            💡 Ambient sound plays only while the Pomodoro is running.
          </div>

          {floatingSupported && (
            <div className="mt-1.5 sm:mt-2 text-[8px] sm:text-xs text-gray-500">
              🪟 Tap the window icon to float the timer over other tabs/apps.
            </div>
          )}

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

        {isFloating && (
          <span className="text-purple-400">| 🪟 Floating</span>
        )}

        {isRunning && (
          <span className="flex items-center gap-1 text-purple-400">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-purple-400 rounded-full animate-pulse" />
            <span className="hidden xs:inline">Live</span>
          </span>
        )}
      </div>

      {/* Interactive floating window content (Chrome/Edge desktop only).
          Kept deliberately tiny: mode label, big time, 2 small buttons —
          nothing else, so it doesn't distract while studying. */}
      {pipWindow && createPortal(
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '12px',
          userSelect: 'none',
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            color: mode === 'focus' ? '#e9d5ff' : '#a7f3d0',
            textAlign: 'center',
            marginBottom: '6px',
          }}>
            {mode === 'focus' ? '🎯 FOCUS' : '☕ BREAK'}
          </div>

          <div style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '46px',
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: '1px',
            textAlign: 'center',
          }}>
            {formatTime(timeLeft)}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              onClick={isRunning ? pause : start}
              style={{
                border: 0,
                borderRadius: '9px',
                padding: '6px 12px',
                color: '#fff',
                background: isRunning ? '#d97706' : '#059669',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '12px',
              }}
            >
              {isRunning ? '⏸ Pause' : '▶ Start'}
            </button>
            <button
              onClick={toggleSound}
              style={{
                border: '1px solid rgba(255,255,255,.15)',
                borderRadius: '9px',
                padding: '6px 10px',
                color: '#fff',
                background: 'rgba(255,255,255,.08)',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {soundEnabled ? '🔊' : '🔇'}
            </button>
            <button
              onClick={closeFloatingTimer}
              style={{
                border: '1px solid rgba(255,255,255,.15)',
                borderRadius: '9px',
                padding: '6px 10px',
                color: '#fff',
                background: 'rgba(255,255,255,.08)',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{
            width: '100%',
            height: '4px',
            marginTop: '10px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,.12)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: mode === 'focus' ? 'linear-gradient(90deg,#a855f7,#ec4899)' : 'linear-gradient(90deg,#10b981,#14b8a6)',
              transition: 'width .4s linear',
            }} />
          </div>
        </div>,
        pipWindow.document.body
      )}
    </div>
  );
}

export default PomodoroTimer;