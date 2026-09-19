import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

// ============================================
// FASTING PROTOCOLS
// ============================================
const PROTOCOLS = [
  {
    id: '16:8',
    label: '16:8',
    fastHours: 16,
    eatHours: 8,
    name: 'Leangains',
    description: 'Most popular · beginner friendly',
  },
  {
    id: '18:6',
    label: '18:6',
    fastHours: 18,
    eatHours: 6,
    name: 'Advanced',
    description: 'Deeper ketosis · faster results',
  },
  {
    id: '20:4',
    label: '20:4',
    fastHours: 20,
    eatHours: 4,
    name: 'Warrior',
    description: 'Intense · for experienced fasters',
  },
];

// ============================================
// METABOLIC PHASES
// ============================================
const METABOLIC_PHASES = [
  { max: 4, name: 'Anabolic', desc: 'Digesting · blood sugar rising', color: '#a8a29e' },
  { max: 8, name: 'Catabolic', desc: 'Glycogen depleting', color: '#c9a36a' },
  { max: 12, name: 'Fat Burning Begins', desc: 'Lipolysis starts', color: '#d97757' },
  { max: 16, name: 'Ketosis', desc: 'Fat → ketones for fuel', color: '#b8562f' },
  { max: 20, name: 'Deep Ketosis', desc: 'Peak fat oxidation', color: '#8b3a1f' },
  { max: 24, name: 'Autophagy', desc: 'Cellular cleanup', color: '#5c2410' },
];

// ============================================
// ACHIEVEMENT BADGES
// ============================================
const BADGES = [
  { id: 'first', label: 'First Fast', icon: '🌱', req: (f) => f.length >= 1, desc: 'Completed your first fast' },
  { id: 'streak3', label: '3-Day Streak', icon: '🔥', req: (f) => getStreak(f) >= 3, desc: '3 consecutive days' },
  { id: 'streak7', label: 'Week Warrior', icon: '⚔️', req: (f) => getStreak(f) >= 7, desc: '7 consecutive days' },
  { id: 'ten', label: 'Ten Fasts', icon: '💪', req: (f) => f.length >= 10, desc: '10 total fasts' },
  { id: 'thirty', label: 'Thirty Fasts', icon: '🏆', req: (f) => f.length >= 30, desc: '30 total fasts' },
  { id: 'marathon', label: 'Marathon', icon: '👑', req: (f) => f.some((x) => parseFloat(x.durationHours) >= 20), desc: 'A 20h+ fast' },
];

// Helper: calculate streak from history
function getStreak(fasts) {
  if (fasts.length === 0) return 0;
  const days = new Set(
    fasts.map((f) => new Date(f.completedAtDate).toDateString())
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (days.has(d.toDateString())) {
      streak++;
    } else if (i > 0) break;
  }
  return streak;
}

// ============================================
// MAIN COMPONENT
// ============================================
const FastingTrackerClock = () => {
  // --- State ---
  const [selectedProtocol, setSelectedProtocol] = useState('16:8');
  const [customFast, setCustomFast] = useState(16);
  const [customEat, setCustomEat] = useState(8);
  const [isCustom, setIsCustom] = useState(false);
  const [isFasting, setIsFasting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [completedFasts, setCompletedFasts] = useState(() => {
    try {
      const saved = localStorage.getItem('fasting_history_v2');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [waterHistory, setWaterHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('water_history');
      const data = saved ? JSON.parse(saved) : {};
      const today = new Date().toDateString();
      return data[today] || 0;
    } catch (e) {
      return 0;
    }
  });

  const rafRef = useRef(null);
  const audioCtxRef = useRef(null);
  const pageRef = useRef(null);
  const completionBeepPlayedRef = useRef(false);

  // --- Audio ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const playBeep = useCallback((freq = 660, dur = 0.2, type = 'sine') => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = 0.15;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  }, [initAudio]);

  // --- Protocol helper ---
  const getActiveProtocol = useCallback(() => {
    if (isCustom) {
      return {
        id: 'custom',
        label: `${customFast}:${customEat}`,
        fastHours: customFast,
        eatHours: customEat,
        name: 'Custom',
        description: 'Your personalized schedule',
      };
    }
    return PROTOCOLS.find((p) => p.id === selectedProtocol) || PROTOCOLS[0];
  }, [isCustom, customFast, customEat, selectedProtocol]);

  const protocol = getActiveProtocol();
  const totalMs = protocol.fastHours * 3600 * 1000;

  // --- Request notification permission ---
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setNotificationsEnabled(perm === 'granted');
      if (perm === 'granted') {
        playBeep(880, 0.1);
      }
    }
  };

  const sendNotification = useCallback((title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, { body, icon: '/favicon.ico' });
      } catch (e) {}
    }
  }, []);

  // --- Log completed fast ---
  const logCompletedFast = useCallback((protocolId, start, end) => {
    const p = protocolId === 'custom'
      ? { label: `${customFast}:${customEat}` }
      : PROTOCOLS.find((x) => x.id === protocolId);
    if (!p) return;
    const durationMs = end - start;
    const entry = {
      id: Date.now(),
      protocol: p.label || p.id,
      durationHours: (durationMs / 3600000).toFixed(1),
      completedAt: new Date(end).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      completedAtDate: end,
    };
    setCompletedFasts((prev) => [entry, ...prev].slice(0, 100));
  }, [customFast, customEat]);

  // --- Load from localStorage on mount ---
  useEffect(() => {
    try {
      const active = localStorage.getItem('fasting_active_v2');
      if (active) {
        const data = JSON.parse(active);
        if (data.isFasting && data.startTime) {
          const now = Date.now();
          const elapsedMs = now - data.startTime;
          const p = data.isCustom
            ? { fastHours: data.customFast, id: 'custom' }
            : PROTOCOLS.find((x) => x.id === data.protocolId);
          if (p) {
            const totalMsLocal = p.fastHours * 3600 * 1000;
            if (elapsedMs < totalMsLocal) {
              setSelectedProtocol(data.protocolId || '16:8');
              setIsCustom(data.isCustom || false);
              setCustomFast(data.customFast || 16);
              setCustomEat(data.customEat || 8);
              setStartTime(data.startTime);
              setIsFasting(true);
              setElapsed(elapsedMs);
            } else {
              logCompletedFast(data.protocolId, data.startTime, now);
            }
          }
        }
      }
      // Load dark mode preference
      const dm = localStorage.getItem('fasting_darkmode');
      if (dm === 'true') setDarkMode(true);
      // Check notification permission
      if ('Notification' in window) {
        setNotificationsEnabled(Notification.permission === 'granted');
      }
    } catch (e) {}
  }, [logCompletedFast]);

  // --- Save active fast ---
  useEffect(() => {
    try {
      if (isFasting && startTime) {
        localStorage.setItem(
          'fasting_active_v2',
          JSON.stringify({
            isFasting: true,
            startTime,
            protocolId: selectedProtocol,
            isCustom,
            customFast,
            customEat,
          })
        );
      } else {
        localStorage.removeItem('fasting_active_v2');
      }
    } catch (e) {}
  }, [isFasting, startTime, selectedProtocol, isCustom, customFast, customEat]);

  // --- Save history ---
  useEffect(() => {
    try {
      localStorage.setItem('fasting_history_v2', JSON.stringify(completedFasts));
    } catch (e) {}
  }, [completedFasts]);

  // --- Save dark mode ---
  useEffect(() => {
    try {
      localStorage.setItem('fasting_darkmode', String(darkMode));
    } catch (e) {}
  }, [darkMode]);

  // --- Save water ---
  useEffect(() => {
    try {
      const today = new Date().toDateString();
      const existing = localStorage.getItem('water_history');
      const data = existing ? JSON.parse(existing) : {};
      data[today] = waterGlasses;
      // Keep only last 30 days
      const keys = Object.keys(data);
      if (keys.length > 30) {
        keys.sort().slice(0, keys.length - 30).forEach((k) => delete data[k]);
      }
      localStorage.setItem('water_history', JSON.stringify(data));
    } catch (e) {}
  }, [waterGlasses]);

  // --- Tick ---
  useEffect(() => {
    if (!isFasting || !startTime) return;
    const tick = () => {
      const now = Date.now();
      const newElapsed = now - startTime;
      setElapsed(newElapsed);
      const totalMsLocal = protocol.fastHours * 3600 * 1000;
      if (newElapsed >= totalMsLocal && !completionBeepPlayedRef.current) {
        completionBeepPlayedRef.current = true;
        setIsFasting(false);
        setIsFinished(true);
        logCompletedFast(protocol.id, startTime, now);
        playBeep(660, 0.15);
        setTimeout(() => playBeep(880, 0.15), 200);
        setTimeout(() => playBeep(1100, 0.4), 400);
        sendNotification(
          '🎉 Fast Complete!',
          `Your ${protocol.fastHours}h fast has finished. Time to refuel.`
        );
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isFasting, startTime, protocol, playBeep, logCompletedFast, sendNotification]);

  // --- Fullscreen ---
  const toggleFullscreen = useCallback(() => {
    const el = pageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  // --- Keyboard ---
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleFullscreen]);

  // --- Actions ---
  const startFast = () => {
    initAudio();
    const now = Date.now();
    setStartTime(now);
    setElapsed(0);
    setIsFasting(true);
    setIsFinished(false);
    completionBeepPlayedRef.current = false;
    playBeep(440, 0.1);
    // Set notification for when fast completes
    if (notificationsEnabled) {
      sendNotification(
        '⏳ Fast Started',
        `Your ${protocol.fastHours}h fast has begun. Good luck!`
      );
    }
  };

  const endFast = () => {
    if (startTime) logCompletedFast(protocol.id, startTime, Date.now());
    setIsFasting(false);
    setStartTime(null);
    setElapsed(0);
    setIsFinished(false);
    playBeep(330, 0.2);
  };

  const resetAll = () => {
    setIsFasting(false);
    setStartTime(null);
    setElapsed(0);
    setIsFinished(false);
    completionBeepPlayedRef.current = false;
  };

  const clearHistory = () => {
    if (window.confirm('Clear all fasting history?')) setCompletedFasts([]);
  };

  // --- Export CSV ---
  const exportCSV = () => {
    if (completedFasts.length === 0) {
      alert('No history to export');
      return;
    }
    const headers = ['Protocol', 'Duration (hours)', 'Completed At'];
    const rows = completedFasts.map((f) => [f.protocol, f.durationHours, f.completedAt]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fasting-history-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --- Share ---
  const shareCard = async () => {
    const text = `I've completed ${completedFasts.length} fasts! Current streak: ${getStreak(
      completedFasts
    )} days 🔥 Tracked with TimeCounterPro`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Fasting Journey',
          text,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href);
      alert('Copied to clipboard!');
    }
  };

  // --- Format helpers ---
  const formatCountUp = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    return {
      h: Math.floor(totalSec / 3600),
      m: Math.floor((totalSec % 3600) / 60),
      s: totalSec % 60,
    };
  };
  const formatCountDown = (ms) => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    return {
      h: Math.floor(totalSec / 3600),
      m: Math.floor((totalSec % 3600) / 60),
      s: totalSec % 60,
    };
  };

  // --- Computed ---
  const remainingMs = Math.max(0, totalMs - elapsed);
  const progress = Math.min(1, elapsed / totalMs);
  const elapsedTime = formatCountUp(elapsed);
  const remainingTime = formatCountDown(remainingMs);
  const hoursElapsed = elapsed / 3600000;
  const currentPhase =
    METABOLIC_PHASES.find((p) => hoursElapsed < p.max) ||
    METABOLIC_PHASES[METABOLIC_PHASES.length - 1];

  // Weekly stats
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const count = completedFasts.filter(
      (f) => new Date(f.completedAtDate).toDateString() === dayStr
    ).length;
    return { day: d.toLocaleDateString('en-US', { weekday: 'short' }), count };
  });
  const maxCount = Math.max(1, ...last7Days.map((d) => d.count));

  const streak = getStreak(completedFasts);
  const earnedBadges = BADGES.filter((b) => b.req(completedFasts));

  // Ring
  const SIZE = 260;
  const STROKE = 14;
  const RADIUS = (SIZE - STROKE) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const DASH_OFFSET = CIRCUMFERENCE * (1 - progress);

  // Theme
  const theme = darkMode
    ? {
        bg: '#1a1410',
        bg2: '#221a14',
        card: 'rgba(40, 30, 22, 0.75)',
        cardBorder: 'rgba(201, 111, 74, 0.25)',
        text: '#f5f0e8',
        textMuted: '#b09779',
        sand: '#2a1f18',
        terracotta: '#d98b6a',
        terracottaDeep: '#c96f4a',
        wood: '#8b5a3d',
        inputBg: 'rgba(0,0,0,0.3)',
      }
    : {
        bg: '#f5f0e8',
        bg2: '#e8dfd1',
        card: 'rgba(255, 255, 255, 0.75)',
        cardBorder: 'rgba(201, 111, 74, 0.15)',
        text: '#3d2c1f',
        textMuted: '#8b7355',
        sand: '#f5f0e8',
        sandDeep: '#e8dfd1',
        terracotta: '#c96f4a',
        terracottaDeep: '#a8552f',
        wood: '#7c4a2d',
        inputBg: 'rgba(255, 255, 255, 0.6)',
      };

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ background: theme.bg, color: theme.text }}
    >
      <style>{`
        html, body { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes pulseSoft {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .pulse-soft { animation: pulseSoft 2.5s ease-in-out infinite; }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .float-in { animation: floatIn 0.4s ease-out; }
        @keyframes barGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        .bar-grow { animation: barGrow 0.6s ease-out forwards; transform-origin: bottom; }
      `}</style>

      {!isFullscreen && <Navbar />}

      <div
        ref={pageRef}
        className="relative w-full no-scrollbar"
        style={{
          minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
          overflowY: 'auto',
          background: darkMode
            ? `radial-gradient(circle at 20% 0%, ${theme.bg2} 0%, ${theme.bg} 40%, ${theme.bg2} 100%)`
            : `radial-gradient(circle at 20% 0%, #f9f4ec 0%, ${theme.bg} 40%, ${theme.bg2} 100%)`,
        }}
      >
        {/* Top-right buttons */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode((v) => !v)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: theme.card,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${theme.cardBorder}`,
              color: theme.terracottaDeep,
            }}
            title="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          {/* Notification bell */}
          <button
            onClick={requestNotificationPermission}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: theme.card,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${theme.cardBorder}`,
              color: notificationsEnabled ? '#7fa567' : theme.terracottaDeep,
            }}
            title={notificationsEnabled ? 'Notifications on' : 'Enable notifications'}
          >
            🔔
          </button>
          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: theme.card,
              backdropFilter: 'blur(16px)',
              border: `1px solid ${theme.cardBorder}`,
              color: theme.terracottaDeep,
            }}
            title="Fullscreen (F)"
          >
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">

          {/* ===== HEADER ===== */}
          <div className="mb-6 md:mb-10">
            <p
              className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2"
              style={{ color: theme.terracotta }}
            >
              Wellness · Metabolic Rhythm
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold tracking-tight"
              style={{ color: theme.text }}
            >
              Intermittent Fasting
            </h1>
            <p
              className="mt-2 text-sm md:text-base max-w-xl leading-relaxed"
              style={{ color: theme.textMuted }}
            >
              Track your fasts, monitor metabolic phases, and build a streak.
            </p>

            {/* Streak strip */}
            {streak > 0 && (
              <div className="flex items-center gap-3 mt-4 flex-wrap">
                <div
                  className="px-4 py-2 rounded-full flex items-center gap-2"
                  style={{
                    background: `${theme.terracotta}18`,
                    border: `1px solid ${theme.terracotta}55`,
                  }}
                >
                  <span className="text-base">🔥</span>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: theme.terracottaDeep }}
                  >
                    {streak} Day Streak
                  </span>
                </div>
                <div
                  className="px-4 py-2 rounded-full flex items-center gap-2"
                  style={{
                    background: `${theme.terracotta}10`,
                    border: `1px solid ${theme.terracotta}33`,
                  }}
                >
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: theme.textMuted }}
                  >
                    {completedFasts.length} Total Fasts
                  </span>
                </div>
                {earnedBadges.length > 0 && (
                  <button
                    onClick={() => setShowStats(true)}
                    className="px-4 py-2 rounded-full flex items-center gap-2 transition-all hover:scale-105"
                    style={{
                      background: `${theme.terracotta}10`,
                      border: `1px solid ${theme.terracotta}33`,
                    }}
                  >
                    <span className="text-sm">{earnedBadges.length} 🏆</span>
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: theme.textMuted }}
                    >
                      Badges
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ===== MAIN GRID ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">

            {/* LEFT: MAIN CLOCK */}
            <div className="lg:col-span-3">
              <div
                className="rounded-3xl p-6 md:p-8"
                style={{
                  background: theme.card,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.cardBorder}`,
                  boxShadow: darkMode
                    ? '0 12px 40px rgba(0,0,0,0.4)'
                    : '0 12px 40px rgba(124, 74, 45, 0.08)',
                }}
              >
                {/* Phase pill */}
                <div className="flex justify-center mb-5">
                  <div
                    className="px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-500"
                    style={{
                      background: `${currentPhase.color}18`,
                      border: `1px solid ${currentPhase.color}55`,
                      color: currentPhase.color,
                    }}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${isFasting ? 'pulse-soft' : ''}`}
                      style={{ background: currentPhase.color }}
                    ></span>
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      {isFasting ? currentPhase.name : 'Awaiting Fast'}
                    </span>
                  </div>
                </div>

                {/* Clock */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="relative" style={{ width: SIZE, height: SIZE }}>
                    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="-rotate-90">
                      <circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} fill="none" stroke={theme.sandDeep || theme.sand} strokeWidth={STROKE} />
                      <circle
                        cx={SIZE / 2}
                        cy={SIZE / 2}
                        r={RADIUS}
                        fill="none"
                        stroke={currentPhase.color}
                        strokeWidth={STROKE}
                        strokeLinecap="round"
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={DASH_OFFSET}
                        style={{ transition: 'stroke-dashoffset 0.4s linear, stroke 0.6s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                      <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-1" style={{ color: theme.textMuted }}>
                        Fasted
                      </p>
                      <div className="flex items-baseline gap-1 font-bold tabular-nums" style={{ color: theme.text }}>
                        <span className="text-4xl md:text-5xl">{String(elapsedTime.h).padStart(2, '0')}</span>
                        <span className="text-xl md:text-2xl" style={{ color: theme.textMuted }}>h</span>
                        <span className="text-4xl md:text-5xl">{String(elapsedTime.m).padStart(2, '0')}</span>
                        <span className="text-xl md:text-2xl" style={{ color: theme.textMuted }}>m</span>
                        <span className="text-2xl md:text-3xl">{String(elapsedTime.s).padStart(2, '0')}</span>
                        <span className="text-sm md:text-base" style={{ color: theme.textMuted }}>s</span>
                      </div>
                      <div className="mt-3 pt-3 w-3/4 border-t" style={{ borderColor: `${theme.terracotta}33` }}>
                        <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-1" style={{ color: theme.terracotta }}>
                          Remaining
                        </p>
                        <div className="text-xl md:text-2xl font-bold tabular-nums" style={{ color: theme.terracottaDeep }}>
                          {String(remainingTime.h).padStart(2, '0')}:
                          {String(remainingTime.m).padStart(2, '0')}:
                          {String(remainingTime.s).padStart(2, '0')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-xs font-semibold" style={{ color: theme.textMuted }}>
                    Goal: <span style={{ color: theme.terracottaDeep }}>{protocol.fastHours}h 00m</span> fast · {protocol.eatHours}h eating window
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  {!isFasting && !isFinished && (
                    <button
                      onClick={startFast}
                      className="flex-1 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase text-white transition-all duration-200 active:scale-[0.98] hover:scale-[1.01]"
                      style={{
                        background: `linear-gradient(135deg, ${theme.terracotta}, ${theme.terracottaDeep})`,
                        boxShadow: `0 8px 24px ${theme.terracotta}55`,
                      }}
                    >
                      ▶ Start Fast
                    </button>
                  )}
                  {isFasting && (
                    <button
                      onClick={endFast}
                      className="flex-1 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-200 active:scale-[0.98]"
                      style={{
                        background: theme.inputBg,
                        color: theme.terracottaDeep,
                        border: `1px solid ${theme.terracotta}66`,
                      }}
                    >
                      ⏹ End Fast
                    </button>
                  )}
                  {isFinished && (
                    <button
                      onClick={() => {
                        setShowShareCard(true);
                      }}
                      className="flex-1 py-4 rounded-2xl font-bold text-sm tracking-widest uppercase text-white transition-all duration-200 active:scale-[0.98] float-in"
                      style={{
                        background: `linear-gradient(135deg, #7fa567, #5f8a4a)`,
                        boxShadow: '0 8px 24px rgba(95, 138, 74, 0.35)',
                      }}
                    >
                      📸 Share Your Fast
                    </button>
                  )}
                  {(isFasting || isFinished) && (
                    <button
                      onClick={resetAll}
                      className="py-4 px-5 rounded-2xl font-semibold text-xs tracking-widest uppercase transition-all duration-200 active:scale-[0.98]"
                      style={{
                        background: theme.inputBg,
                        color: theme.textMuted,
                        border: `1px solid ${theme.cardBorder}`,
                      }}
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Water Tracker */}
              <div
                className="mt-5 rounded-3xl p-5"
                style={{
                  background: theme.card,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.cardBorder}`,
                  boxShadow: darkMode
                    ? '0 12px 40px rgba(0,0,0,0.4)'
                    : '0 12px 40px rgba(124, 74, 45, 0.08)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: theme.textMuted }}>
                      Hydration
                    </p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: theme.text }}>
                      {waterGlasses} / 8 glasses
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setWaterGlasses((w) => Math.max(0, w - 1))}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold transition-all hover:scale-110 active:scale-95"
                      style={{
                        background: theme.inputBg,
                        color: theme.textMuted,
                        border: `1px solid ${theme.cardBorder}`,
                      }}
                    >
                      −
                    </button>
                    <button
                      onClick={() => {
                        setWaterGlasses((w) => Math.min(16, w + 1));
                        playBeep(880, 0.05);
                      }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white transition-all hover:scale-110 active:scale-95"
                      style={{
                        background: `linear-gradient(135deg, #7bb3d9, #4a90c9)`,
                        boxShadow: '0 4px 12px rgba(74, 144, 201, 0.3)',
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Water glasses row */}
                <div className="flex gap-1.5 flex-wrap">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 h-8 rounded-md transition-all duration-300 relative overflow-hidden"
                      style={{
                        background: i < waterGlasses ? 'transparent' : theme.inputBg,
                        border: `1px solid ${i < waterGlasses ? '#4a90c9' : theme.cardBorder}`,
                        minWidth: '24px',
                      }}
                    >
                      {i < waterGlasses && (
                        <div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(180deg, #7bb3d9, #4a90c9)',
                          }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Protocol Picker */}
              <div
                className="rounded-3xl p-6"
                style={{
                  background: theme.card,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.cardBorder}`,
                  boxShadow: darkMode
                    ? '0 12px 40px rgba(0,0,0,0.4)'
                    : '0 12px 40px rgba(124, 74, 45, 0.08)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: theme.textMuted }}>
                    Fasting Protocol
                  </p>
                  <button
                    onClick={() => {
                      if (isFasting) return;
                      setIsCustom((v) => !v);
                    }}
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: isCustom ? theme.terracottaDeep : theme.textMuted }}
                  >
                    {isCustom ? 'Preset' : 'Custom'}
                  </button>
                </div>

                {!isCustom ? (
                  <div className="space-y-2.5">
                    {PROTOCOLS.map((p) => {
                      const active = selectedProtocol === p.id && !isCustom;
                      return (
                        <button
                          key={p.id}
                          onClick={() => !isFasting && setSelectedProtocol(p.id)}
                          disabled={isFasting}
                          className="w-full text-left rounded-2xl p-4 transition-all duration-200 active:scale-[0.99] disabled:cursor-not-allowed"
                          style={{
                            background: active
                              ? `linear-gradient(135deg, ${theme.terracotta}15, ${theme.terracottaDeep}15)`
                              : theme.inputBg,
                            border: active
                              ? `2px solid ${theme.terracotta}`
                              : `1px solid ${theme.cardBorder}`,
                            boxShadow: active ? `0 4px 16px ${theme.terracotta}25` : 'none',
                            opacity: isFasting && !active ? 0.4 : 1,
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold tabular-nums text-sm"
                                style={{
                                  background: active ? theme.terracotta : theme.inputBg,
                                  color: active ? '#fff' : theme.terracottaDeep,
                                  border: active ? 'none' : `1px solid ${theme.terracotta}44`,
                                }}
                              >
                                {p.label}
                              </div>
                              <div>
                                <p className="text-sm font-bold" style={{ color: theme.text }}>
                                  {p.name}
                                </p>
                                <p className="text-[11px]" style={{ color: theme.textMuted }}>
                                  {p.fastHours}h fast · {p.eatHours}h eat
                                </p>
                              </div>
                            </div>
                            {active && (
                              <span className="text-[10px] font-black tracking-widest uppercase" style={{ color: theme.terracotta }}>
                                ●
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.textMuted }}>
                          Fast Hours
                        </span>
                        <span className="text-lg font-bold tabular-nums" style={{ color: theme.terracottaDeep }}>
                          {customFast}h
                        </span>
                      </div>
                      <input
                        type="range"
                        min="12"
                        max="23"
                        value={customFast}
                        onChange={(e) => {
                          const v = parseInt(e.target.value);
                          setCustomFast(v);
                          setCustomEat(24 - v);
                        }}
                        disabled={isFasting}
                        className="w-full"
                        style={{ accentColor: theme.terracotta }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-xs" style={{ color: theme.textMuted }}>
                        {customFast}h fast · {customEat}h eat window
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Metabolic Timeline */}
              <div
                className="rounded-3xl p-6"
                style={{
                  background: theme.card,
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${theme.cardBorder}`,
                  boxShadow: darkMode
                    ? '0 12px 40px rgba(0,0,0,0.4)'
                    : '0 12px 40px rgba(124, 74, 45, 0.08)',
                }}
              >
                <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-4" style={{ color: theme.textMuted }}>
                  Metabolic Timeline
                </p>
                <div className="space-y-3">
                  {METABOLIC_PHASES.map((phase, i) => {
                    const rangeEnd = phase.max;
                    const rangeStart = i === 0 ? 0 : METABOLIC_PHASES[i - 1].max;
                    const isActive = isFasting && hoursElapsed >= rangeStart && hoursElapsed < rangeEnd;
                    const isPast = isFasting && hoursElapsed >= rangeEnd;
                    return (
                      <div key={phase.name} className="flex items-center gap-3 transition-all duration-300" style={{ opacity: !isFasting ? 0.55 : isPast ? 0.5 : 1 }}>
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 transition-all duration-300 ${isActive ? 'pulse-soft' : ''}`}
                          style={{
                            background: isActive || isPast ? phase.color : theme.sandDeep || '#ddd',
                            boxShadow: isActive ? `0 0 12px ${phase.color}` : 'none',
                            border: `2px solid ${isActive || isPast ? phase.color : theme.cardBorder}`,
                          }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-xs font-bold truncate" style={{ color: isActive || isPast ? phase.color : theme.textMuted }}>
                              {phase.name}
                            </p>
                            <span className="text-[10px] font-mono tabular-nums flex-shrink-0" style={{ color: theme.textMuted }}>
                              {rangeStart}–{rangeEnd}h
                            </span>
                          </div>
                          <p className="text-[10px] truncate" style={{ color: theme.textMuted }}>
                            {phase.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 h-1.5 rounded-full overflow-hidden" style={{ background: theme.sandDeep || '#ddd' }}>
                  <div className="h-full transition-all duration-500" style={{ width: `${progress * 100}%`, background: `linear-gradient(90deg, ${theme.terracotta}, ${currentPhase.color})` }}></div>
                </div>
              </div>

              {/* Quick actions row */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setShowStats(true)}
                  className="py-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: theme.card,
                    border: `1px solid ${theme.cardBorder}`,
                    color: theme.terracottaDeep,
                    boxShadow: darkMode ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(124, 74, 45, 0.08)',
                  }}
                >
                  <span className="text-lg">📊</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.textMuted }}>Stats</span>
                </button>
                <button
                  onClick={shareCard}
                  className="py-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: theme.card,
                    border: `1px solid ${theme.cardBorder}`,
                    color: theme.terracottaDeep,
                    boxShadow: darkMode ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(124, 74, 45, 0.08)',
                  }}
                >
                  <span className="text-lg">📸</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.textMuted }}>Share</span>
                </button>
                <button
                  onClick={exportCSV}
                  className="py-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: theme.card,
                    border: `1px solid ${theme.cardBorder}`,
                    color: theme.terracottaDeep,
                    boxShadow: darkMode ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(124, 74, 45, 0.08)',
                  }}
                >
                  <span className="text-lg">📤</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: theme.textMuted }}>Export</span>
                </button>
              </div>

              {/* History */}
              {completedFasts.length > 0 && (
                <div
                  className="rounded-3xl p-6"
                  style={{
                    background: theme.card,
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${theme.cardBorder}`,
                    boxShadow: darkMode ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(124, 74, 45, 0.08)',
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: theme.textMuted }}>Recent Fasts</p>
                    <button onClick={clearHistory} className="text-[10px] font-bold tracking-widest uppercase" style={{ color: theme.terracotta }}>Clear</button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
                    {completedFasts.slice(0, 10).map((f) => (
                      <div key={f.id} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ background: theme.inputBg }}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 text-white" style={{ background: '#7fa567' }}>✓</span>
                          <div className="min-w-0">
                            <p className="text-xs font-bold" style={{ color: theme.text }}>{f.protocol} · {f.durationHours}h</p>
                            <p className="text-[10px] truncate" style={{ color: theme.textMuted }}>{f.completedAt}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ===== SEO SECTION ===== */}
          <div
            className="mt-12 rounded-3xl p-6 md:p-10"
            style={{
              background: theme.card,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: darkMode ? '0 12px 40px rgba(0,0,0,0.4)' : '0 12px 40px rgba(124, 74, 45, 0.06)',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-bold px-3 py-1.5 rounded-full"
                style={{ background: `${theme.terracotta}18`, color: theme.terracottaDeep, border: `1px solid ${theme.terracotta}44` }}
              >
                Health Guide
              </span>
            </div>

            <h2 className="text-xl md:text-3xl font-bold tracking-tight mb-6 max-w-3xl" style={{ color: theme.text }}>
              Understanding Metabolic Phases During Your Intermittent Fasting Window
            </h2>

            <div className="space-y-4 text-sm md:text-[15px] leading-relaxed max-w-4xl" style={{ color: darkMode ? '#c9b8a4' : '#5c4a3a' }}>
              <p>Intermittent fasting is not just about skipping meals — it is about giving your body enough uninterrupted time to move through distinct metabolic phases. Understanding these phases helps you fast with intention rather than simply starving yourself.</p>
              <p><span style={{ color: theme.text, fontWeight: 700 }}>0–4 hours: The Anabolic Phase.</span> Right after your last meal, your body is in a fed state. Blood sugar and insulin are elevated, and your body is busy storing energy. This is not a "fasting" window in the metabolic sense — it's still digestion. Aim to finish your last meal 2–3 hours before bed to give this phase time to complete overnight.</p>
              <p><span style={{ color: theme.text, fontWeight: 700 }}>4–8 hours: The Catabolic Phase.</span> Blood sugar begins to drop and glycogen stores start depleting. Your body looks for alternative fuel. This is when many people feel their first hunger pangs — a signal that the shift is happening. Drinking water, black coffee, or plain tea can help bridge this phase without breaking the fast.</p>
              <p><span style={{ color: theme.text, fontWeight: 700 }}>8–12 hours: Fat Burning Begins.</span> Once glycogen is largely depleted, your body starts breaking down stored fat into free fatty acids for fuel — a process called lipolysis. This is the phase where intermittent fasting starts delivering its famous fat-loss benefits. Most 16:8 fasters spend the majority of their fast here.</p>
              <p><span style={{ color: theme.text, fontWeight: 700 }}>12–16 hours: Ketosis.</span> The liver begins converting fatty acids into ketone bodies, an efficient alternative fuel for the brain and muscles. Mental clarity, reduced hunger, and stable energy are common. For 16:8 fasters, this is the peak window — the final 4 hours deliver the deepest benefits of the protocol.</p>
              <p><span style={{ color: theme.text, fontWeight: 700 }}>16–20 hours: Deep Ketosis.</span> If you extend to 18:6 or 20:4, you push further into ketosis. Fat oxidation accelerates, inflammation markers can drop, and some studies suggest enhanced cellular repair. Many experienced fasters report their clearest thinking in this window.</p>
              <p><span style={{ color: theme.text, fontWeight: 700 }}>20–24 hours: Autophagy.</span> Extended fasts activate autophagy — the body's cellular cleanup process where damaged proteins and organelles are recycled. This is one of the most-studied benefits of longer fasts, but it requires careful planning and should not be attempted without experience.</p>
              <p>The best protocol is the one you can sustain. Start with 16:8, listen to your body, and extend gradually. Track every fast to see your personal patterns — consistency always beats intensity.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STATS MODAL ===== */}
      {showStats && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowStats(false)}
        >
          <div
            className="w-full max-w-lg rounded-3xl p-6 md:p-8 float-in max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
            style={{ background: theme.card, backdropFilter: 'blur(24px)', border: `2px solid ${theme.terracotta}44` }}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold" style={{ color: theme.text }}>Your Progress</h3>
              <button onClick={() => setShowStats(false)} className="text-xl" style={{ color: theme.textMuted }}>×</button>
            </div>

            {/* Top stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="rounded-2xl p-4 text-center" style={{ background: theme.inputBg }}>
                <p className="text-2xl font-bold" style={{ color: theme.terracottaDeep }}>{completedFasts.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: theme.textMuted }}>Total</p>
              </div>
              <div className="rounded-2xl p-4 text-center" style={{ background: theme.inputBg }}>
                <p className="text-2xl font-bold" style={{ color: theme.terracottaDeep }}>🔥 {streak}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: theme.textMuted }}>Streak</p>
              </div>
              <div className="rounded-2xl p-4 text-center" style={{ background: theme.inputBg }}>
                <p className="text-2xl font-bold" style={{ color: theme.terracottaDeep }}>
                  {completedFasts.length > 0
                    ? (completedFasts.reduce((a, f) => a + parseFloat(f.durationHours), 0) / completedFasts.length).toFixed(1)
                    : '0'}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: theme.textMuted }}>Avg h</p>
              </div>
            </div>

            {/* Weekly chart */}
            <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-3" style={{ color: theme.textMuted }}>Last 7 Days</p>
            <div className="flex items-end gap-2 h-32 mb-6">
              {last7Days.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full rounded-t-md bar-grow"
                      style={{
                        height: `${(d.count / maxCount) * 100}%`,
                        minHeight: d.count > 0 ? '8px' : '2px',
                        background: d.count > 0
                          ? `linear-gradient(180deg, ${theme.terracotta}, ${theme.terracottaDeep})`
                          : theme.cardBorder,
                      }}
                    ></div>
                  </div>
                  <span className="text-[9px] font-bold uppercase" style={{ color: theme.textMuted }}>{d.day}</span>
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: theme.text }}>{d.count}</span>
                </div>
              ))}
            </div>

            {/* Badges */}
            <p className="text-[10px] tracking-[0.25em] uppercase font-bold mb-3" style={{ color: theme.textMuted }}>Achievements</p>
            <div className="grid grid-cols-3 gap-2">
              {BADGES.map((b) => {
                const earned = b.req(completedFasts);
                return (
                  <div
                    key={b.id}
                    className="rounded-2xl p-3 text-center"
                    style={{
                      background: earned ? `${theme.terracotta}15` : theme.inputBg,
                      border: `1px solid ${earned ? theme.terracotta + '55' : theme.cardBorder}`,
                      opacity: earned ? 1 : 0.4,
                    }}
                  >
                    <p className="text-2xl mb-1">{b.icon}</p>
                    <p className="text-[10px] font-bold" style={{ color: earned ? theme.terracottaDeep : theme.textMuted }}>
                      {b.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== SHARE CARD MODAL ===== */}
      {showShareCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowShareCard(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-6 float-in"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: `linear-gradient(135deg, ${theme.terracotta}, ${theme.terracottaDeep})`,
              boxShadow: '0 24px 64px rgba(201, 111, 74, 0.4)',
            }}
          >
            <div className="text-center text-white">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold opacity-80 mb-2">
                TimeCounterPro
              </p>
              <p className="text-5xl font-black mb-2">🎉</p>
              <p className="text-2xl font-bold mb-1">Fast Complete!</p>
              <p className="text-sm opacity-90 mb-6">{protocol.fastHours} hours successfully fasted</p>

              <div className="bg-white/20 rounded-2xl p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-70">Total Fasts</p>
                    <p className="text-2xl font-bold">{completedFasts.length}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-70">Streak</p>
                    <p className="text-2xl font-bold">🔥 {streak}d</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  shareCard();
                  setShowShareCard(false);
                }}
                className="w-full py-3 rounded-2xl font-bold text-sm tracking-widest uppercase bg-white transition-all active:scale-95"
                style={{ color: theme.terracottaDeep }}
              >
                📸 Share
              </button>
              <button
                onClick={() => {
                  resetAll();
                  setShowShareCard(false);
                }}
                className="w-full mt-2 py-3 rounded-2xl font-semibold text-xs tracking-widest uppercase text-white transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                Start New Fast
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FastingTrackerClock;