import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

// ============================================
// PRESET DURATIONS (minutes)
// ============================================
const PRESETS = [
  { label: 'Lightning Talk', value: 5, desc: 'Ignite · Pitch' },
  { label: 'Standard Slot', value: 10, desc: 'Demo · Standup' },
  { label: 'Conference Talk', value: 18, desc: 'TED-style' },
  { label: 'Keynote', value: 30, desc: 'Executive' },
  { label: 'Deep Dive', value: 45, desc: 'Workshop' },
  { label: 'Full Session', value: 60, desc: 'Masterclass' },
];

const PresentationAlertTimer = () => {
  // --- State ---
  const [totalMinutes, setTotalMinutes] = useState(18);
  const [customMinutes, setCustomMinutes] = useState(18);
  const [timeLeft, setTimeLeft] = useState(18 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stagePhase, setStagePhase] = useState('idle');
  const [flashOn, setFlashOn] = useState(true);
  const [showPresets, setShowPresets] = useState(false);

  const intervalRef = useRef(null);
  const flashRef = useRef(null);
  const audioCtxRef = useRef(null);
  const pageRef = useRef(null);
  const lastWarningRef = useRef(null);

  // --- Audio ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const playChime = useCallback((freq = 660, dur = 0.3, type = 'sine') => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = 0.18;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  }, [initAudio]);

  const playUrgentChime = useCallback(() => {
    playChime(880, 0.2);
    setTimeout(() => playChime(880, 0.2), 250);
    setTimeout(() => playChime(880, 0.2), 500);
  }, [playChime]);

  // --- Format ---
  const formatTime = useCallback((seconds) => {
    const s = Math.max(0, seconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }, []);

  // --- Flash effect ---
  useEffect(() => {
    if (stagePhase !== 'red') {
      setFlashOn(true);
      if (flashRef.current) clearInterval(flashRef.current);
      return;
    }
    flashRef.current = setInterval(() => {
      setFlashOn((v) => !v);
    }, 500);
    return () => {
      if (flashRef.current) clearInterval(flashRef.current);
    };
  }, [stagePhase]);

  // --- Timer tick ---
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        let newPhase = 'calm';
        if (next <= 0) newPhase = 'red';
        else if (next <= 120) newPhase = 'amber';

        setStagePhase((cur) => {
          if (cur !== newPhase) {
            if (newPhase === 'amber' && lastWarningRef.current !== 'amber') {
              playUrgentChime();
              lastWarningRef.current = 'amber';
            }
            if (newPhase === 'red' && lastWarningRef.current !== 'red') {
              playUrgentChime();
              lastWarningRef.current = 'red';
            }
            return newPhase;
          }
          return cur;
        });

        if (next > 0 && next <= 10) {
          playChime(1000, 0.08, 'square');
        }

        if (next <= 0) {
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, playChime, playUrgentChime]);

  // --- Actions ---
  const handleStart = () => {
    initAudio();
    lastWarningRef.current = null;
    if (timeLeft <= 0) {
      setTimeLeft(totalMinutes * 60);
      setIsFinished(false);
    }
    setStagePhase(timeLeft <= 120 ? 'amber' : 'calm');
    setIsRunning(true);
    playChime(660, 0.1);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setStagePhase('idle');
    setTimeLeft(totalMinutes * 60);
    lastWarningRef.current = null;
  };

  const handleDurationChange = (mins) => {
    setTotalMinutes(mins);
    setCustomMinutes(mins);
    setTimeLeft(mins * 60);
    setIsRunning(false);
    setIsFinished(false);
    setStagePhase('idle');
    setShowPresets(false);
    lastWarningRef.current = null;
  };

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

  // --- Keyboard shortcuts ---
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) handlePause();
        else handleStart();
      }
      if (e.key === 'r' || e.key === 'R') handleReset();
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 'h' || e.key === 'H') setShowControls((v) => !v);
      if (e.key === 'p' || e.key === 'P') setShowPresets((v) => !v);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isRunning, toggleFullscreen]);

  // --- Theme ---
  const getTheme = () => {
    if (stagePhase === 'red') {
      return {
        bg: flashOn ? '#b91c1c' : '#7f1d1d',
        text: '#ffffff',
        muted: 'rgba(255,255,255,0.6)',
        accent: '#fef3c7',
        border: 'rgba(255,255,255,0.2)',
        label: "TIME'S UP",
        sublabel: 'Wrap up immediately',
        dot: '#fbbf24',
      };
    }
    if (stagePhase === 'amber') {
      return {
        bg: '#d97706',
        text: '#ffffff',
        muted: 'rgba(255,255,255,0.7)',
        accent: '#fef3c7',
        border: 'rgba(255,255,255,0.2)',
        label: 'FINAL 2 MINUTES',
        sublabel: 'Begin conclusion',
        dot: '#fef3c7',
      };
    }
    if (stagePhase === 'calm') {
      return {
        bg: '#0f766e',
        text: '#ffffff',
        muted: 'rgba(255,255,255,0.6)',
        accent: '#a7f3d0',
        border: 'rgba(255,255,255,0.15)',
        label: 'IN PROGRESS',
        sublabel: 'Steady pace',
        dot: '#a7f3d0',
      };
    }
    return {
      bg: '#1e3a8a',
      text: '#ffffff',
      muted: 'rgba(255,255,255,0.6)',
      accent: '#bfdbfe',
      border: 'rgba(255,255,255,0.15)',
      label: 'READY',
      sublabel: 'Awaiting start',
      dot: '#bfdbfe',
    };
  };

  const theme = getTheme();
  const progress = totalMinutes > 0 ? 1 - timeLeft / (totalMinutes * 60) : 0;

  return (
    <div className="min-h-screen md-6" style={{ background: theme.bg }}>
      <style>{`
        html, body { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes pulseSoft {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .pulse-soft { animation: pulseSoft 1.5s ease-in-out infinite; }
        @keyframes floatUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .float-up { animation: floatUp 0.35s ease-out; }
      `}</style>

      {!isFullscreen}

      <Navbar />

      <div 
        ref={pageRef}
        className="relative w-full no-scrollbar "
        style={{
          minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
          overflowY: 'auto',
          background: theme.bg,
          transition: 'background 0.6s ease',
        }}
      >
        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(0,0,0,0.25)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${theme.border}`,
            color: theme.text,
          }}
          title="Fullscreen (F)"
        >
          {isFullscreen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          )}
        </button>

        {/* ===== MAIN STAGE ===== */}
        <div
          className="relative z-10 flex flex-col items-center justify-center px-4"
          style={{
            minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
            paddingTop: '20px',
            paddingBottom: '20px',
          }}
        >
          {/* Top status strip */}
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${isRunning ? 'pulse-soft' : ''}`}
                style={{
                  background: theme.dot,
                  boxShadow: isRunning ? `0 0 20px ${theme.dot}` : 'none',
                }}
              ></span>
              <span
                className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase"
                style={{ color: theme.accent }}
              >
                {theme.label}
              </span>
            </div>
            <span
              className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase"
              style={{ color: theme.muted }}
            >
              · {theme.sublabel}
            </span>
          </div>

          {/* GIANT TIMER */}
          <div
            className="font-black tabular-nums text-center leading-none select-none"
            style={{
              fontSize: 'clamp(6rem, 26vw, 22rem)',
              letterSpacing: '-0.04em',
              color: theme.text,
              fontFamily:
                '"SF Pro Display", "Inter", "Helvetica Neue", system-ui, sans-serif',
              fontWeight: 900,
              textShadow:
                stagePhase === 'red'
                  ? '0 0 80px rgba(0,0,0,0.4)'
                  : stagePhase === 'amber'
                  ? '0 0 60px rgba(0,0,0,0.25)'
                  : 'none',
              transition: 'color 0.4s ease',
            }}
          >
            {formatTime(timeLeft)}
          </div>

          {/* Bottom info strip */}
          <div className="mt-8 md:mt-12 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 text-xs md:text-sm tracking-[0.25em] uppercase font-semibold">
              <span style={{ color: theme.muted }}>Allotted</span>
              <span style={{ color: theme.accent }}>{totalMinutes} min</span>
              <span style={{ color: theme.muted }}>·</span>
              <span style={{ color: theme.muted }}>Elapsed</span>
              <span style={{ color: theme.accent }}>
                {Math.floor((totalMinutes * 60 - timeLeft) / 60)}m{' '}
                {(totalMinutes * 60 - timeLeft) % 60}s
              </span>
            </div>

            <div className="w-[80vw] max-w-2xl h-[3px] rounded-full overflow-hidden" style={{ background: theme.border }}>
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${progress * 100}%`,
                  background: theme.accent,
                }}
              ></div>
            </div>

            {!isRunning && !isFinished && (
              <p
                className="text-xs tracking-[0.3em] uppercase mt-2"
                style={{ color: theme.muted }}
              >
                Press{' '}
                <span
                  className="px-2 py-1 rounded"
                  style={{ background: 'rgba(0,0,0,0.2)', color: theme.text }}
                >
                  SPACE
                </span>{' '}
                to begin
              </p>
            )}

            {isFinished && (
              <p
                className="text-sm md:text-base tracking-[0.3em] uppercase mt-2 pulse-soft font-bold"
                style={{ color: theme.accent }}
              >
                Thank you — please wrap up
              </p>
            )}
          </div>
        </div>

        {/* ===== FLOATING CONTROL PANEL — POSITIONED BELOW NAVBAR ===== */}
        {showControls && (
          <div
            className="fixed left-4 z-40 w-[320px] float-up"
            style={{
              top: isFullscreen ? '1rem' : '5rem',
              transition: 'top 0.2s ease',
            }}
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(10, 10, 15, 0.85)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div>
                  <p
                    className="text-[9px] tracking-[0.3em] uppercase font-bold"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    Speaker Timer
                  </p>
                  <p className="text-white text-sm font-semibold mt-0.5">
                    Stage Control
                  </p>
                </div>
                <button
                  onClick={() => setShowControls(false)}
                  className="text-white/40 hover:text-white transition-colors text-lg leading-none px-1"
                  title="Hide (H)"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4">
                {/* Duration input */}
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <p
                      className="text-[10px] tracking-[0.25em] uppercase font-bold"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      Total Duration
                    </p>
                    <p className="text-white text-sm font-bold tabular-nums">
                      {customMinutes} min
                    </p>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={customMinutes}
                    onChange={(e) => {
                      const v = Math.max(1, Math.min(180, parseInt(e.target.value) || 1));
                      setCustomMinutes(v);
                    }}
                    onBlur={() => {
                      if (!isRunning) {
                        handleDurationChange(customMinutes);
                      }
                    }}
                    disabled={isRunning}
                    className="w-full bg-black/40 border border-white/15 rounded-lg px-3 py-2 text-white text-2xl font-bold tabular-nums focus:outline-none focus:border-blue-400 disabled:opacity-40 transition-all"
                  />
                  {!isRunning && customMinutes !== totalMinutes && (
                    <button
                      onClick={() => handleDurationChange(customMinutes)}
                      className="w-full mt-2 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all active:scale-[0.98]"
                      style={{
                        background: '#2563eb',
                        color: '#fff',
                      }}
                    >
                      Apply {customMinutes} min
                    </button>
                  )}
                </div>

                {/* Presets toggle */}
                <button
                  onClick={() => setShowPresets((v) => !v)}
                  className="w-full py-2 rounded-lg text-[10px] font-bold tracking-[0.2em] uppercase transition-all flex items-center justify-between px-3"
                  style={{
                    background: showPresets ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255,255,255,0.05)',
                    color: showPresets ? '#60a5fa' : 'rgba(255,255,255,0.6)',
                    border: `1px solid ${showPresets ? 'rgba(37, 99, 235, 0.5)' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <span>Quick Presets</span>
                  <span>{showPresets ? '▲' : '▼'}</span>
                </button>

                {showPresets && (
                  <div className="grid grid-cols-2 gap-2 float-up">
                    {PRESETS.map((p) => {
                      const active = totalMinutes === p.value;
                      return (
                        <button
                          key={p.value}
                          onClick={() => handleDurationChange(p.value)}
                          disabled={isRunning}
                          className="p-2.5 rounded-lg text-left transition-all active:scale-[0.98] disabled:opacity-40"
                          style={{
                            background: active ? 'rgba(37, 99, 235, 0.25)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${active ? 'rgba(37, 99, 235, 0.6)' : 'rgba(255,255,255,0.08)'}`,
                          }}
                        >
                          <p className="text-white text-xs font-bold">
                            {p.value} min
                          </p>
                          <p
                            className="text-[9px] uppercase tracking-wider mt-0.5 truncate"
                            style={{ color: 'rgba(255,255,255,0.5)' }}
                          >
                            {p.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Controls */}
                <div className="flex gap-2">
                  {!isRunning ? (
                    <button
                      onClick={handleStart}
                      className="flex-1 py-3 rounded-lg text-sm font-bold tracking-widest uppercase text-white transition-all active:scale-[0.98]"
                      style={{
                        background: '#2563eb',
                        boxShadow: '0 4px 16px rgba(37, 99, 235, 0.4)',
                      }}
                    >
                      {isFinished ? 'Restart' : timeLeft < totalMinutes * 60 ? 'Resume' : 'Start'}
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="flex-1 py-3 rounded-lg text-sm font-bold tracking-widest uppercase text-white transition-all active:scale-[0.98]"
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={handleReset}
                    className="px-4 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all active:scale-[0.98]"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.6)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    Reset
                  </button>
                </div>

                {/* Stage legend */}
                <div
                  className="pt-3 space-y-1.5"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <p
                    className="text-[9px] tracking-[0.25em] uppercase font-bold mb-2"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Stage Indicators
                  </p>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-3 h-3 rounded-sm" style={{ background: '#0f766e' }}></span>
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>Calm — over 2 min left</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-3 h-3 rounded-sm" style={{ background: '#d97706' }}></span>
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>Amber — final 2 minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="w-3 h-3 rounded-sm pulse-soft" style={{ background: '#b91c1c' }}></span>
                    <span style={{ color: 'rgba(255,255,255,0.65)' }}>Red — time is up</span>
                  </div>
                </div>

                {/* Shortcuts */}
                <div
                  className="pt-3 flex items-center justify-between text-[9px] tracking-[0.15em] uppercase font-bold"
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.35)',
                  }}
                >
                  <span>Space</span>
                  <span>R</span>
                  <span>F</span>
                  <span>H</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hidden panel hint */}
        {!showControls && (
          <button
            onClick={() => setShowControls(true)}
            className="fixed bottom-4 left-4 z-40 text-[10px] tracking-[0.3em] uppercase font-bold opacity-30 hover:opacity-100 transition-opacity"
            style={{ color: theme.text }}
          >
            [ H ] Controls
          </button>
        )}
      </div>

      {/* ===== SEO SECTION ===== */}
      {!isFullscreen && (
        <div style={{ background: '#f8fafc', color: '#1e293b' }}>
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-bold px-3 py-1.5 rounded"
                style={{
                  background: '#dbeafe',
                  color: '#1e40af',
                }}
              >
                Speaking Guide
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-6 max-w-3xl" style={{ color: '#0f172a' }}>
              Mastering Pacing, Delivery, and Timing Controls During Executive Keynotes
            </h2>

            <div className="space-y-5 text-sm md:text-base leading-relaxed text-slate-600">
              <p>
                The most prepared speaker in the room can lose an audience in the
                final five minutes — not because the content was weak, but
                because the timing was wrong. Executive keynotes live and die by
                pacing. A speaker who runs over by two minutes signals a lack of
                respect for the next session, while a speaker who finishes two
                minutes early leaves the audience feeling short-changed. The
                discipline of timing separates a good talk from a memorable one.
              </p>

              <p>
                <span className="text-slate-900 font-bold">
                  1. Know your three zones.
                </span>{' '}
                Every keynote has three psychological zones: the <em>setup</em>{' '}
                (first 20%), the <em>core argument</em> (middle 60%), and the{' '}
                <em>close</em> (final 20%). For an 18-minute talk, that means
                roughly 3.5 minutes of setup, 11 minutes of substance, and 3.5
                minutes of landing. Speakers who skip setup feel abrupt; those
                who spend too long on setup never reach the argument. Watch your
                timer's proportional progress bar — it tells you which zone
                you're in at a glance.
              </p>

              <p>
                <span className="text-slate-900 font-bold">
                  2. Treat the 2-minute warning as a hard signal.
                </span>{' '}
                The amber stage in this timer is not decorative — it's a
                commitment device. When the background turns amber, you should
                already be entering your closing statements. If you're still
                mid-argument, you're running behind. Effective speakers learn to
                deliver the same closing message in 30 seconds if needed. Have
                a "short close" rehearsed for exactly this situation.
              </p>

              <p>
                <span className="text-slate-900 font-bold">
                  3. The pause is your best tool.
                </span>{' '}
                When the timer turns red, don't panic. Take a full breath, look
                at the audience, and deliver your final sentence with
                intentional weight. Rushed closings undo entire talks. A
                controlled pause at the end signals confidence and gives the
                audience a moment to absorb your last idea.
              </p>

              <p>
                <span className="text-slate-900 font-bold">
                  4. Rehearse against the timer, not a stopwatch.
                </span>{' '}
                Before your keynote, run through the talk three times with this
                timer visible. First pass: content only. Second pass: content
                with transitions. Third pass: full delivery with pauses. You'll
                discover which sections always run long and can trim them in
                advance. Most speakers are shocked to find their "5-minute
                intro" actually takes eight.
              </p>

              <p>
                <span className="text-slate-900 font-bold">
                  5. Show the timer to the audience.
                </span>{' '}
                Advanced speakers place a stage timer at the back of the room,
                visible to them but not distracting for the audience. This
                component's full-screen mode is designed for exactly this use.
                Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">F</kbd>{' '}
                before your talk and the giant display becomes your silent
                co-pilot.
              </p>

              <p>
                <span className="text-slate-900 font-bold">
                  6. Debrief every talk.
                </span>{' '}
                After each keynote, note your actual ending time versus your
                allotted time. Over ten talks, a pattern emerges — most speakers
                consistently run over by a predictable margin. Fixing that
                margin is worth more than any new slide design.
              </p>

              <p>
                Executive presence is built on disciplined delivery. Timing is
                not an afterthought — it's a craft. Practice with this timer
                until your pacing feels instinctive, and you'll walk off stage
                not just on time, but exactly when the audience wants more.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PresentationAlertTimer;