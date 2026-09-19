import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

// ============================================
// OBJECTIVE DATA
// ============================================
const OBJECTIVES = [
  {
    id: 'baron',
    name: 'Baron Nashor',
    short: 'BARON',
    respawn: 6 * 60,
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.7)',
    icon: '♛',
    category: 'Epic',
    note: "Team-wide buff · Nashor's Tooth",
  },
  {
    id: 'dragon',
    name: 'Elemental Dragon',
    short: 'DRAGON',
    respawn: 5 * 60,
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.7)',
    icon: '🐉',
    category: 'Epic',
    note: 'Stacking elemental drakes',
  },
  {
    id: 'herald',
    name: 'Rift Herald',
    short: 'HERALD',
    respawn: 6 * 60,
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.7)',
    icon: '👁',
    category: 'Epic',
    note: 'Shelly · turret siege',
  },
  {
    id: 'blue',
    name: 'Blue Buff',
    short: 'BLUE',
    respawn: 5 * 60,
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.7)',
    icon: '◆',
    category: 'Buff',
    note: 'Crest of Insight · mana regen',
  },
  {
    id: 'red',
    name: 'Red Buff',
    short: 'RED',
    respawn: 5 * 60,
    color: '#dc2626',
    glow: 'rgba(220, 38, 38, 0.7)',
    icon: '▲',
    category: 'Buff',
    note: 'Crest of Cinders · slow & burn',
  },
  {
    id: 'scuttle-top',
    name: 'Scuttle (Top)',
    short: 'SCUTTLE',
    respawn: 2 * 60 + 30,
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.7)',
    icon: '◉',
    category: 'River',
    note: 'Vision + gold · topside',
  },
  {
    id: 'scuttle-bot',
    name: 'Scuttle (Bot)',
    short: 'SCUTTLE',
    respawn: 2 * 60 + 30,
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.7)',
    icon: '◉',
    category: 'River',
    note: 'Vision + gold · botside',
  },
  {
    id: 'void-grub',
    name: 'Void Grubs',
    short: 'GRUBS',
    respawn: 4 * 60,
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.7)',
    icon: '⬢',
    category: 'Epic',
    note: 'Tower shredding stacks',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
const EsportsJungleTimer = () => {
  const [timers, setTimers] = useState(() =>
    OBJECTIVES.reduce((acc, obj) => {
      acc[obj.id] = { status: 'idle', timeLeft: 0, startedAt: null };
      return acc;
    }, {})
  );
  const [isFullscreen, setIsFullscreen] = useState(false);

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const pageRef = useRef(null);

  // --- Audio ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const playBeep = useCallback((freq = 880, dur = 0.15) => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.value = 0.12;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  }, [initAudio]);

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

  // --- Keyboard shortcut F for fullscreen ---
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

  // --- Global tick ---
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimers((prev) => {
        let changed = false;
        const next = { ...prev };
        Object.keys(next).forEach((id) => {
          const t = next[id];
          if (t.status === 'running' && t.timeLeft > 0) {
            const newTime = t.timeLeft - 1;
            next[id] = { ...t, timeLeft: newTime };
            if (newTime <= 3 && newTime > 0) playBeep(880, 0.1);
            if (newTime === 0) {
              next[id] = { status: 'done', timeLeft: 0, startedAt: t.startedAt };
              playBeep(1200, 0.35);
            }
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playBeep]);

  const startTimer = (id) => {
    initAudio();
    const obj = OBJECTIVES.find((o) => o.id === id);
    if (!obj) return;
    setTimers((prev) => ({
      ...prev,
      [id]: { status: 'running', timeLeft: obj.respawn, startedAt: Date.now() },
    }));
    playBeep(660, 0.08);
  };

  const resetTimer = (id) => {
    setTimers((prev) => ({
      ...prev,
      [id]: { status: 'idle', timeLeft: 0, startedAt: null },
    }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const runningCount = Object.values(timers).filter((t) => t.status === 'running').length;
  const doneCount = Object.values(timers).filter((t) => t.status === 'done').length;

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      {/* ===== HIDE SCROLLBAR GLOBALLY ===== */}
      <style>{`
        /* Hide scrollbar for the whole app but keep scroll functionality */
        html, body {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE/Edge */
          overflow-x: hidden;
        }
        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        .no-scrollbar::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
        .no-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        /* Smooth scrolling still works with mouse wheel */
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Navbar hidden in fullscreen */}
      {!isFullscreen && <Navbar />}

      {/* ===== PAGE WRAPPER (fullscreen target) ===== */}
      <div
        ref={pageRef}
        className="relative w-full no-scrollbar"
        style={{
          minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
          background: '#08080c',
          overflowY: 'auto',
        }}
      >
        {/* ===== GRID BACKGROUND ===== */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.06] z-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0, 229, 255, 0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(168, 85, 247, 0.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        ></div>

        {/* Radial glows */}
        <div
          className="fixed -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-20"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        ></div>
        <div
          className="fixed -bottom-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none z-0 opacity-20"
          style={{
            background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        ></div>

        {/* ===== FULLSCREEN BUTTON (small, top-right corner) ===== */}
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50 w-9 h-9 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(15, 15, 22, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(168, 85, 247, 0.4)',
            color: '#06b6d4',
            boxShadow: '0 0 16px rgba(168, 85, 247, 0.3)',
          }}
          title="Fullscreen (F)"
        >
          {isFullscreen ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          )}
        </button>

        <div
          className={`relative z-10 max-w-7xl mx-auto ${
            isFullscreen ? 'px-4 md:px-6 py-6 md:py-8' : 'px-4 md:px-8 py-6 md:py-10'
          }`}
        >
          {/* ===== HEADER ===== */}
          <div className="mb-6 md:mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-lg font-black"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                  boxShadow: '0 0 24px rgba(168, 85, 247, 0.5)',
                  clipPath:
                    'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                }}
              >
                ⚔
              </div>
              <div>
                <p
                  className="text-[10px] tracking-[0.3em] uppercase font-bold"
                  style={{ color: '#a855f7' }}
                >
                  Esports · Jungle Control
                </p>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white">
                  Multi-Objective Timer
                </h1>
              </div>
            </div>
            <p
              className="text-xs md:text-sm max-w-2xl leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Track every jungle objective independently. Click any card to start
              its respawn countdown. Multiple timers run in parallel — no conflicts,
              no interference.
            </p>

            {/* Stats strip */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider uppercase"
                style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  color: '#06b6d4',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: '#06b6d4', boxShadow: '0 0 10px #06b6d4' }}
                ></span>
                {runningCount} Active
              </div>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-bold tracking-wider uppercase"
                style={{
                  background: 'rgba(168, 85, 247, 0.1)',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  color: '#a855f7',
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: '#a855f7', boxShadow: '0 0 10px #a855f7' }}
                ></span>
                {doneCount} Ready
              </div>
              <div
                className="text-[10px] tracking-widest uppercase font-bold ml-auto"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                {OBJECTIVES.length} Objectives Tracked
              </div>
            </div>
          </div>

          {/* ===== CARDS GRID ===== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {OBJECTIVES.map((obj) => {
              const timer = timers[obj.id];
              const isRunning = timer.status === 'running';
              const isDone = timer.status === 'done';
              const isIdle = timer.status === 'idle';
              const progress = isRunning
                ? 1 - timer.timeLeft / obj.respawn
                : isDone
                ? 1
                : 0;

              return (
                <button
                  key={obj.id}
                  onClick={() =>
                    isIdle || isDone ? startTimer(obj.id) : resetTimer(obj.id)
                  }
                  className="group relative text-left rounded-xl overflow-hidden transition-all duration-300 active:scale-[0.98] hover:scale-[1.01]"
                  style={{
                    background: 'rgba(15, 15, 22, 0.9)',
                    border: isRunning || isDone
                      ? `1px solid ${obj.color}`
                      : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isRunning
                      ? `0 0 24px ${obj.glow}, inset 0 0 24px ${obj.glow.replace('0.7', '0.08')}`
                      : isDone
                      ? `0 0 20px ${obj.glow}, inset 0 0 24px ${obj.glow.replace('0.7', '0.1')}`
                      : 'none',
                    clipPath:
                      'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-4 h-4 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(225deg, transparent 50%, ${obj.color} 50%)`,
                      opacity: isRunning || isDone ? 1 : 0.3,
                    }}
                  ></div>

                  <div className="p-4 md:p-5 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-md flex items-center justify-center text-base font-black transition-all"
                          style={{
                            background:
                              isRunning || isDone
                                ? `${obj.color}22`
                                : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${obj.color}${
                              isRunning || isDone ? '80' : '30'
                            }`,
                            color: obj.color,
                            textShadow:
                              isRunning || isDone ? `0 0 12px ${obj.color}` : 'none',
                          }}
                        >
                          {obj.icon}
                        </div>
                        <div>
                          <p
                            className="text-[9px] tracking-[0.2em] uppercase font-bold"
                            style={{ color: obj.color, opacity: 0.85 }}
                          >
                            {obj.category}
                          </p>
                          <p className="text-white text-sm font-bold tracking-tight leading-tight">
                            {obj.short}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isRunning && (
                          <span
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{
                              background: obj.color,
                              boxShadow: `0 0 8px ${obj.color}`,
                            }}
                          ></span>
                        )}
                        {isDone && (
                          <span
                            className="text-[9px] font-black tracking-widest uppercase"
                            style={{ color: obj.color }}
                          >
                            UP
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 mb-3">
                      <p
                        className="text-[9px] tracking-[0.25em] uppercase font-bold mb-1"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                      >
                        {isIdle
                          ? 'Respawn Time'
                          : isRunning
                          ? 'Respawning in'
                          : 'Objective Ready'}
                      </p>
                      <div
                        className="text-3xl md:text-4xl font-black tabular-nums tracking-tighter leading-none transition-all"
                        style={{
                          color:
                            isRunning || isDone
                              ? obj.color
                              : 'rgba(255,255,255,0.9)',
                          fontFamily:
                            '"Rajdhani", "Orbitron", "SF Mono", "Monaco", monospace',
                          textShadow:
                            isRunning || isDone
                              ? `0 0 20px ${obj.glow}`
                              : 'none',
                          letterSpacing: '-0.03em',
                        }}
                      >
                        {isIdle
                          ? formatTime(obj.respawn)
                          : isDone
                          ? 'READY'
                          : formatTime(timer.timeLeft)}
                      </div>
                    </div>

                    <div
                      className="w-full h-[3px] rounded-full overflow-hidden mb-3"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${progress * 100}%`,
                          background: obj.color,
                          boxShadow:
                            isRunning || isDone ? `0 0 12px ${obj.color}` : 'none',
                        }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <p
                        className="text-[10px] leading-tight truncate pr-2"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        {obj.note}
                      </p>
                      <span
                        className="text-[9px] font-bold tracking-widest uppercase flex-shrink-0"
                        style={{
                          color: isIdle
                            ? 'rgba(255,255,255,0.3)'
                            : isRunning
                            ? obj.color
                            : '#10b981',
                        }}
                      >
                        {isIdle ? 'TAP' : isRunning ? 'RESET' : 'TAP'}
                      </span>
                    </div>
                  </div>

                  {isRunning && (
                    <div
                      className="absolute inset-0 pointer-events-none animate-pulse"
                      style={{
                        background: `radial-gradient(circle at top right, ${obj.glow.replace(
                          '0.7',
                          '0.08'
                        )}, transparent 60%)`,
                      }}
                    ></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* ===== GLOBAL CONTROLS ===== */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                initAudio();
                setTimers((prev) => {
                  const next = { ...prev };
                  OBJECTIVES.forEach((obj) => {
                    next[obj.id] = {
                      status: 'running',
                      timeLeft: obj.respawn,
                      startedAt: Date.now(),
                    };
                  });
                  return next;
                });
                playBeep(660, 0.1);
              }}
              className="px-5 py-3 text-xs font-black tracking-widest uppercase transition-all duration-200 active:scale-95 hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #a855f7, #06b6d4)',
                color: '#000',
                clipPath:
                  'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
                boxShadow: '0 0 24px rgba(168, 85, 247, 0.5)',
              }}
            >
              ▶ Start All Timers
            </button>

            <button
              onClick={() => {
                setTimers((prev) => {
                  const next = { ...prev };
                  Object.keys(next).forEach((id) => {
                    next[id] = { status: 'idle', timeLeft: 0, startedAt: null };
                  });
                  return next;
                });
              }}
              className="px-5 py-3 text-xs font-black tracking-widest uppercase transition-all duration-200 active:scale-95 hover:scale-105"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                clipPath:
                  'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))',
              }}
            >
              ↺ Reset All
            </button>

            <p
              className="text-[10px] tracking-widest uppercase font-bold ml-auto"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              Click a card to start · click again to reset · F for fullscreen
            </p>
          </div>

          {/* ===== SEO SECTION ===== */}
          <div
            className="mt-12 md:mt-16 rounded-2xl p-6 md:p-10 relative overflow-hidden"
            style={{
              background: 'rgba(15, 15, 22, 0.9)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              clipPath:
                'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))',
            }}
          >
            <div
              className="absolute top-0 right-0 w-5 h-5"
              style={{
                background:
                  'linear-gradient(225deg, transparent 50%, rgba(168, 85, 247, 0.6) 50%)',
              }}
            ></div>

            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-black px-3 py-1.5"
                style={{
                  background: 'rgba(6, 182, 212, 0.15)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                  color: '#06b6d4',
                  clipPath:
                    'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
                }}
              >
                Strategy Guide
              </span>
            </div>

            <h2 className="text-xl md:text-3xl font-black tracking-tight text-white mb-6 max-w-3xl">
              How Strategic Buff Tracking Improves Win Rates in Competitive MOBAs
            </h2>

            <div
              className="space-y-4 text-sm md:text-[15px] leading-relaxed max-w-4xl"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <p>
                In competitive MOBAs like League of Legends, Dota 2, and Wild Rift,
                the jungle is not just a farming ground — it is a psychological
                battlefield. Every buff, dragon, and epic monster dictates tempo,
                map pressure, and ultimately the outcome of a match. Top-tier
                junglers don't rely on memory alone. They track respawn windows
                with precision, because a five-second timing mistake can hand the
                enemy a free Baron and tilt an entire game.
              </p>
              <p>
                <span style={{ color: '#a855f7' }} className="font-bold">
                  Timing is advantage.
                </span>{' '}
                When you know exactly when Blue Buff spawns, you can path your
                clear to arrive three seconds early, secure vision, and set up a
                gank right after. When you know Dragon respawns at 5:00 and your
                enemy jungler just died top lane, you know the objective is free.
                This is not luck — it's information asymmetry that compounds over
                every minute of the match.
              </p>
              <p>
                <span style={{ color: '#06b6d4' }} className="font-bold">
                  Multi-objective awareness wins teamfights.
                </span>{' '}
                The best junglers track four to six objectives simultaneously:
                both scuttle crabs, Blue, Red, Dragon, and Baron. When a timer is
                running on every one of these, the map becomes a chess board. You
                always know what your team should be doing next, and you can
                communicate it to your laners before the enemy even realizes the
                objective is up.
              </p>
              <p>
                <span className="text-white font-bold">
                  Consistency builds rank.
                </span>{' '}
                A professional jungler's win rate isn't determined by flashy
                outplays — it's determined by consistency. Tracking buffs and
                objectives every single game, without fail, is one of the highest
                ROI habits you can build. Statistical analysis of high-elo
                matches shows junglers who consistently control two or more epic
                objectives per game win over 68% of their matches, regardless of
                kill participation.
              </p>
              <p>
                <span className="text-white font-bold">
                  Tools amplify skill.
                </span>{' '}
                A dedicated multi-objective timer like this one removes mental
                overhead so you can focus on macro decisions. Instead of
                forgetting the Baron window because a teamfight broke out, the
                timer reminds you. Instead of guessing Dragon timings, you see
                them at a glance. That clarity translates directly into cleaner
                pathing, better ganks, and higher win rates.
              </p>
              <p>
                Whether you're climbing Solo Queue or shot-calling in a
                competitive five-stack, precise objective tracking is the
                difference between reacting to the game and controlling it. Track
                everything. Win more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EsportsJungleTimer;