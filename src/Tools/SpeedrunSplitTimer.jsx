import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

// ============================================
// DEFAULT BASELINE SPLITS (for comparison)
// Each segment has a baseline time in milliseconds
// ============================================
const DEFAULT_BASELINE = [
  { id: 1, name: 'Prologue', baseline: 45000 },
  { id: 2, name: 'Forest Temple', baseline: 132000 },
  { id: 3, name: 'Water Temple', baseline: 210000 },
  { id: 4, name: 'Fire Temple', baseline: 178000 },
  { id: 5, name: 'Shadow Temple', baseline: 165000 },
  { id: 6, name: 'Final Boss', baseline: 240000 },
];

const SpeedrunSplitTimer = () => {
  // --- State ---
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // milliseconds
  const [splits, setSplits] = useState([]); // { id, name, time, delta, splitTotal }
  const [currentSplitIndex, setCurrentSplitIndex] = useState(0);
  const [baseline, setBaseline] = useState(DEFAULT_BASELINE);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastSplitTimeRef = useRef(0);
  const pageRef = useRef(null);
  const splitListRef = useRef(null);

  // --- Format time as MM:SS.mmm ---
  const formatTime = useCallback((ms) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor(ms % 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0'
    )}.${String(millis).padStart(3, '0')}`;
  }, []);

  // --- Format delta as +SS.mmm or -SS.mmm ---
  const formatDelta = useCallback((ms) => {
    const sign = ms >= 0 ? '+' : '-';
    const abs = Math.abs(ms);
    const seconds = Math.floor(abs / 1000);
    const millis = Math.floor(abs % 1000);
    return `${sign}${seconds}.${String(millis).padStart(3, '0')}`;
  }, []);

  // --- High-precision tick using requestAnimationFrame ---
  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      if (startTimeRef.current !== null) {
        const now = performance.now();
        setElapsed(now - startTimeRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning]);

  // --- Start / Pause ---
  const handleStartPause = useCallback(() => {
    if (isRunning) {
      // Pause
      setIsRunning(false);
    } else {
      // Start or resume
      startTimeRef.current = performance.now() - elapsed;
      setIsRunning(true);
    }
  }, [isRunning, elapsed]);

  // --- Split ---
  const handleSplit = useCallback(() => {
    if (!isRunning && elapsed === 0) return;

    const currentTotal = elapsed;
    const segmentIndex = currentSplitIndex;
    const segment = baseline[segmentIndex];
    const prevTotal = lastSplitTimeRef.current;
    const segmentTime = currentTotal - prevTotal;

    // Delta = how much slower/faster than baseline segment
    const delta = segment ? segmentTime - segment.baseline : 0;

    const newSplit = {
      id: segment ? segment.id : splits.length + 1,
      name: segment ? segment.name : `Split ${splits.length + 1}`,
      time: segmentTime,
      total: currentTotal,
      delta: delta,
      isGold: delta < 0,
      timestamp: Date.now(),
    };

    setSplits((prev) => [...prev, newSplit]);
    lastSplitTimeRef.current = currentTotal;
    setCurrentSplitIndex((prev) => prev + 1);

    // Auto-scroll split list to bottom
    setTimeout(() => {
      if (splitListRef.current) {
        splitListRef.current.scrollTop = splitListRef.current.scrollHeight;
      }
    }, 50);
  }, [isRunning, elapsed, currentSplitIndex, baseline, splits.length]);

  // --- Reset ---
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    setSplits([]);
    setCurrentSplitIndex(0);
    startTimeRef.current = null;
    lastSplitTimeRef.current = 0;
  }, []);

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
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Space → Split (or Start if not running)
      if (e.code === 'Space') {
        e.preventDefault();
        if (elapsed === 0 && !isRunning) {
          handleStartPause();
        } else {
          handleSplit();
        }
      }

      // Enter → Start/Pause toggle
      if (e.key === 'Enter') {
        e.preventDefault();
        handleStartPause();
      }

      // R → Reset
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }

      // F → Fullscreen
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [elapsed, isRunning, handleStartPause, handleSplit, handleReset, toggleFullscreen]);

  // --- Computed ---
  const currentSegment = baseline[currentSplitIndex] || null;

  // Total time vs baseline total
  const baselineTotal = baseline.reduce((acc, s) => acc + s.baseline, 0);
  const cumulativeDelta =
    splits.length > 0 ? splits[splits.length - 1].total - baselineTotal : 0;

  // Best / worst split delta
  const bestDelta =
    splits.length > 0 ? Math.min(...splits.map((s) => s.delta)) : 0;
  const worstDelta =
    splits.length > 0 ? Math.max(...splits.map((s) => s.delta)) : 0;

  return (
    <div className="min-h-screen bg-[#0d0f12] text-white">
      {/* Global scrollbar hide */}
      <style>{`
        html, body {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        html::-webkit-scrollbar, body::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      {!isFullscreen && <Navbar />}

      <div
        ref={pageRef}
        className="relative w-full no-scrollbar"
        style={{
          minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
          overflowY: 'auto',
          background: '#0d0f12',
        }}
      >
        {/* ===== SUBTLE INDUSTRIAL GRID ===== */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        ></div>

        {/* ===== FULLSCREEN BUTTON ===== */}
        <button
          onClick={toggleFullscreen}
          className="fixed top-4 right-4 z-50 w-9 h-9 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(20, 22, 28, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.8)',
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

        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
          {/* ===== HEADER ===== */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center text-base font-black"
                style={{
                  background: 'linear-gradient(135deg, #475569, #1e293b)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fbbf24',
                }}
              >
                ⏱
              </div>
              <div>
                <p
                  className="text-[10px] tracking-[0.3em] uppercase font-bold"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Speedrun · Segment Timer
                </p>
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                  Split Stopwatch
                </h1>
              </div>
            </div>
          </div>

          {/* ===== MAIN LAYOUT: Sidebar + Content ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* ===== LEFT SIDEBAR (main timer + controls) ===== */}
            <div className="lg:col-span-7">
              {/* MAIN TIMER CARD */}
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, #14171c 0%, #0f1216 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
              >
                {/* Top strip */}
                <div
                  className="px-4 py-2.5 flex items-center justify-between"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isRunning ? 'animate-pulse' : ''
                      }`}
                      style={{
                        background: isRunning ? '#22c55e' : 'rgba(255,255,255,0.2)',
                        boxShadow: isRunning ? '0 0 8px #22c55e' : 'none',
                      }}
                    ></span>
                    <span
                      className="text-[10px] tracking-[0.2em] uppercase font-bold"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {isRunning ? 'Running' : elapsed > 0 ? 'Paused' : 'Ready'}
                    </span>
                  </div>
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase font-bold"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    Split {splits.length} / {baseline.length}
                  </span>
                </div>

                {/* Timer display */}
                <div className="px-6 py-8 md:py-10 text-center">
                  <div
                    className="font-mono font-bold tabular-nums leading-none"
                    style={{
                      fontSize: 'clamp(2.5rem, 9vw, 5.5rem)',
                      color: '#ffffff',
                      letterSpacing: '-0.03em',
                      textShadow: isRunning
                        ? '0 0 30px rgba(34, 197, 94, 0.3)'
                        : 'none',
                    }}
                  >
                    {formatTime(elapsed)}
                  </div>

                  {/* Cumulative delta below timer */}
                  {splits.length > 0 && (
                    <div className="mt-4 flex items-center justify-center gap-4">
                      <div className="text-center">
                        <p
                          className="text-[9px] tracking-[0.2em] uppercase font-bold mb-0.5"
                          style={{ color: 'rgba(255,255,255,0.35)' }}
                        >
                          vs Baseline
                        </p>
                        <p
                          className="text-lg md:text-xl font-bold tabular-nums"
                          style={{
                            color:
                              cumulativeDelta <= 0 ? '#22c55e' : '#ef4444',
                          }}
                        >
                          {formatDelta(cumulativeDelta)}
                        </p>
                      </div>
                      {bestDelta < 0 && (
                        <div className="text-center">
                          <p
                            className="text-[9px] tracking-[0.2em] uppercase font-bold mb-0.5"
                            style={{ color: 'rgba(255,255,255,0.35)' }}
                          >
                            Best
                          </p>
                          <p
                            className="text-lg md:text-xl font-bold tabular-nums"
                            style={{ color: '#22c55e' }}
                          >
                            {formatDelta(bestDelta)}
                          </p>
                        </div>
                      )}
                      {worstDelta > 0 && (
                        <div className="text-center">
                          <p
                            className="text-[9px] tracking-[0.2em] uppercase font-bold mb-0.5"
                            style={{ color: 'rgba(255,255,255,0.35)' }}
                          >
                            Worst
                          </p>
                          <p
                            className="text-lg md:text-xl font-bold tabular-nums"
                            style={{ color: '#ef4444' }}
                          >
                            {formatDelta(worstDelta)}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Next segment indicator */}
                {currentSegment && (
                  <div
                    className="px-6 py-3 flex items-center justify-between"
                    style={{
                      background: 'rgba(251, 191, 36, 0.05)',
                      borderTop: '1px solid rgba(251, 191, 36, 0.15)',
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] tracking-[0.2em] uppercase font-bold"
                        style={{ color: '#fbbf24' }}
                      >
                        ▸ Next
                      </span>
                      <span className="text-sm font-bold text-white">
                        {currentSegment.name}
                      </span>
                    </div>
                    <span
                      className="text-[11px] font-bold tabular-nums tracking-wide"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      Target {formatTime(currentSegment.baseline)}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="p-4 md:p-5 grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleStartPause}
                    className="py-4 rounded-md font-bold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98]"
                    style={{
                      background: isRunning
                        ? 'rgba(234, 179, 8, 0.15)'
                        : elapsed > 0
                        ? 'rgba(59, 130, 246, 0.15)'
                        : 'linear-gradient(135deg, #22c55e, #16a34a)',
                      color: isRunning ? '#eab308' : elapsed > 0 ? '#60a5fa' : '#ffffff',
                      border: isRunning
                        ? '1px solid rgba(234, 179, 8, 0.4)'
                        : elapsed > 0
                        ? '1px solid rgba(59, 130, 246, 0.4)'
                        : '1px solid rgba(34, 197, 94, 0.5)',
                      boxShadow:
                        !isRunning && elapsed === 0
                          ? '0 0 24px rgba(34, 197, 94, 0.3)'
                          : 'none',
                    }}
                  >
                    {isRunning ? '⏸ Pause' : elapsed > 0 ? '▶ Resume' : '▶ Start'}
                  </button>
                  <button
                    onClick={handleSplit}
                    disabled={elapsed === 0}
                    className="py-4 rounded-md font-bold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: '#ffffff',
                      border: '1px solid rgba(59, 130, 246, 0.5)',
                      boxShadow:
                        elapsed > 0 ? '0 0 24px rgba(59, 130, 246, 0.3)' : 'none',
                    }}
                  >
                    ⚑ Split
                  </button>
                  <button
                    onClick={handleReset}
                    className="col-span-2 py-3 rounded-md font-semibold text-xs tracking-widest uppercase transition-all duration-150 active:scale-[0.98]"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      color: 'rgba(255,255,255,0.6)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    ↺ Reset Run
                  </button>
                </div>

                {/* Keyboard hints */}
                <div
                  className="px-4 py-3 flex items-center justify-between flex-wrap gap-2 text-[10px]"
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span>
                      <kbd
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.7)',
                          fontFamily: 'monospace',
                        }}
                      >
                        Space
                      </kbd>{' '}
                      Split
                    </span>
                    <span>
                      <kbd
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.7)',
                          fontFamily: 'monospace',
                        }}
                      >
                        Enter
                      </kbd>{' '}
                      Start/Pause
                    </span>
                    <span>
                      <kbd
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.7)',
                          fontFamily: 'monospace',
                        }}
                      >
                        R
                      </kbd>{' '}
                      Reset
                    </span>
                    <span>
                      <kbd
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.7)',
                          fontFamily: 'monospace',
                        }}
                      >
                        F
                      </kbd>{' '}
                      Fullscreen
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== RIGHT SIDEBAR (splits table) ===== */}
            <div className="lg:col-span-5">
              <div
                className="rounded-lg overflow-hidden h-full flex flex-col"
                style={{
                  background: 'linear-gradient(180deg, #14171c 0%, #0f1216 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                  maxHeight: 'calc(100vh - 200px)',
                  minHeight: '420px',
                }}
              >
                {/* Table header */}
                <div
                  className="px-4 py-3 flex items-center justify-between flex-shrink-0"
                  style={{
                    background: 'rgba(0,0,0,0.3)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span
                    className="text-[10px] tracking-[0.2em] uppercase font-bold"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    Segments
                  </span>
                  <button
                    onClick={() => setShowEditor((v) => !v)}
                    className="text-[10px] tracking-wider uppercase font-bold transition-opacity"
                    style={{ color: showEditor ? '#fbbf24' : 'rgba(255,255,255,0.4)' }}
                  >
                    {showEditor ? 'Close Editor' : 'Edit'}
                  </button>
                </div>

                {/* Column headers */}
                <div
                  className="grid grid-cols-12 gap-2 px-4 py-2 text-[9px] tracking-[0.15em] uppercase font-bold flex-shrink-0"
                  style={{
                    color: 'rgba(255,255,255,0.35)',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="col-span-1">#</div>
                  <div className="col-span-5">Segment</div>
                  <div className="col-span-3 text-right">Split</div>
                  <div className="col-span-3 text-right">Delta</div>
                </div>

                {/* Splits list */}
                <div
                  ref={splitListRef}
                  className="overflow-y-auto no-scrollbar flex-1"
                >
                  {/* Completed splits */}
                  {splits.map((split, i) => (
                    <div
                      key={split.id + '-' + i}
                      className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center text-[13px] border-b"
                      style={{
                        borderColor: 'rgba(255,255,255,0.04)',
                        background:
                          i === splits.length - 1
                            ? 'rgba(59, 130, 246, 0.06)'
                            : 'transparent',
                      }}
                    >
                      <div
                        className="col-span-1 font-bold tabular-nums"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        {i + 1}
                      </div>
                      <div className="col-span-5 text-white font-medium truncate">
                        {split.name}
                      </div>
                      <div
                        className="col-span-3 text-right font-mono tabular-nums font-bold"
                        style={{ color: 'rgba(255,255,255,0.85)' }}
                      >
                        {formatTime(split.time)}
                      </div>
                      <div
                        className="col-span-3 text-right font-mono tabular-nums font-bold"
                        style={{
                          color: split.delta < 0 ? '#22c55e' : '#ef4444',
                          textShadow:
                            split.delta < 0
                              ? '0 0 12px rgba(34, 197, 94, 0.4)'
                              : '0 0 12px rgba(239, 68, 68, 0.4)',
                        }}
                      >
                        {split.delta < 0 ? '−' : '+'}
                        {formatDelta(Math.abs(split.delta)).slice(1)}
                      </div>
                    </div>
                  ))}

                  {/* Upcoming splits (grayed out) */}
                  {baseline
                    .slice(splits.length)
                    .map((seg, i) => (
                      <div
                        key={'upcoming-' + seg.id}
                        className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center text-[13px] border-b"
                        style={{
                          borderColor: 'rgba(255,255,255,0.04)',
                          opacity: i === 0 ? 0.85 : 0.4,
                        }}
                      >
                        <div
                          className="col-span-1 font-bold tabular-nums"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                          {splits.length + i + 1}
                        </div>
                        <div
                          className="col-span-5 font-medium truncate"
                          style={{
                            color:
                              i === 0
                                ? '#fbbf24'
                                : 'rgba(255,255,255,0.55)',
                          }}
                        >
                          {seg.name}
                        </div>
                        <div
                          className="col-span-3 text-right font-mono tabular-nums"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                        >
                          {formatTime(seg.baseline)}
                        </div>
                        <div
                          className="col-span-3 text-right font-mono tabular-nums"
                          style={{ color: 'rgba(255,255,255,0.25)' }}
                        >
                          —
                        </div>
                      </div>
                    ))}

                  {/* Empty state */}
                  {splits.length === 0 && (
                    <div
                      className="px-4 py-8 text-center text-xs"
                      style={{ color: 'rgba(255,255,255,0.35)' }}
                    >
                      Press <strong style={{ color: '#60a5fa' }}>Space</strong> or
                      click <strong style={{ color: '#60a5fa' }}>Split</strong> to
                      log your first segment.
                    </div>
                  )}
                </div>

                {/* Summary footer */}
                {splits.length > 0 && (
                  <div
                    className="px-4 py-3 flex items-center justify-between flex-shrink-0"
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div>
                      <p
                        className="text-[9px] tracking-[0.2em] uppercase font-bold"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                      >
                        Total
                      </p>
                      <p className="text-sm font-bold font-mono tabular-nums text-white">
                        {formatTime(splits[splits.length - 1].total)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-[9px] tracking-[0.2em] uppercase font-bold"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                      >
                        vs Baseline
                      </p>
                      <p
                        className="text-sm font-bold font-mono tabular-nums"
                        style={{
                          color: cumulativeDelta <= 0 ? '#22c55e' : '#ef4444',
                        }}
                      >
                        {formatDelta(cumulativeDelta)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Editor panel */}
              {showEditor && (
                <div
                  className="mt-4 rounded-lg p-4"
                  style={{
                    background: 'rgba(20, 22, 28, 0.9)',
                    border: '1px solid rgba(251, 191, 36, 0.2)',
                  }}
                >
                  <p
                    className="text-[10px] tracking-[0.2em] uppercase font-bold mb-3"
                    style={{ color: '#fbbf24' }}
                  >
                    Baseline Editor (seconds)
                  </p>
                  <div className="space-y-2 max-h-[240px] overflow-y-auto no-scrollbar">
                    {baseline.map((seg, i) => (
                      <div key={seg.id} className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-bold w-6 tabular-nums"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                        >
                          {i + 1}
                        </span>
                        <input
                          type="text"
                          value={seg.name}
                          onChange={(e) => {
                            const next = [...baseline];
                            next[i] = { ...next[i], name: e.target.value };
                            setBaseline(next);
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                        <input
                          type="number"
                          value={(seg.baseline / 1000).toFixed(2)}
                          step="0.1"
                          onChange={(e) => {
                            const next = [...baseline];
                            next[i] = {
                              ...next[i],
                              baseline: Math.max(0, parseFloat(e.target.value) * 1000 || 0),
                            };
                            setBaseline(next);
                          }}
                          className="w-20 bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white tabular-nums focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setBaseline(DEFAULT_BASELINE)}
                    className="mt-3 w-full py-2 rounded text-[10px] tracking-widest uppercase font-bold"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      color: 'rgba(255,255,255,0.6)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    Reset to Default
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ===== SEO SECTION ===== */}
          <div
            className="mt-12 md:mt-16 rounded-lg p-6 md:p-10"
            style={{
              background: 'linear-gradient(180deg, #14171c 0%, #0f1216 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] tracking-[0.3em] uppercase font-black px-3 py-1.5 rounded"
                style={{
                  background: 'rgba(251, 191, 36, 0.12)',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  color: '#fbbf24',
                }}
              >
                Manual
              </span>
            </div>

            <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white mb-6 max-w-3xl">
              An Introduction to Timing Segments and Splits in Online Speedrunning
            </h2>

            <div
              className="space-y-4 text-sm md:text-[15px] leading-relaxed max-w-4xl"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              <p>
                Speedrunning is the art of completing a video game as quickly as
                possible, and at its heart lies a simple but powerful tool: the
                split timer. Unlike a regular stopwatch, a speedrun timer breaks a
                full playthrough into segments called splits. Each split represents
                a milestone — a boss defeated, a level cleared, an item collected.
                By timing each segment independently, runners can see exactly where
                they gained or lost time, rather than just watching a total clock
                tick upward.
              </p>
              <p>
                <span className="text-white font-bold">What is a split?</span>{' '}
                A split is the moment you press the split key during a run, usually
                as you pass through a loading screen, defeat a boss, or collect a
                critical item. The timer records both your segment time (how long
                this section took) and your cumulative time (total elapsed since
                the run began). These two numbers form the backbone of speedrun
                analysis.
              </p>
              <p>
                <span className="text-white font-bold">
                  Why compare against a baseline?
                </span>{' '}
                Every runner has a personal best or a target time for each segment,
                called a baseline. When your timer shows a delta — the difference
                between your current segment and the baseline — it tells you in
                real time whether you're ahead (green) or behind (red). This
                instant feedback lets you adjust on the fly: play riskier if you're
                behind, or play safe if you're comfortably ahead.
              </p>
              <p>
                <span className="text-white font-bold">
                  The psychology of splits.
                </span>{' '}
                Research on competitive gaming shows that real-time feedback
                dramatically improves performance. Split timers create a rhythm
                that keeps runners focused and motivated. When a runner sees green
                numbers flashing, they push harder. When red appears, they
                refocus. Over hundreds of attempts, this feedback loop sharpens
                execution and builds muscle memory that's impossible to develop
                without precise timing data.
              </p>
              <p>
                <span className="text-white font-bold">
                  Precision matters.
                </span>{' '}
                At the top level of speedrunning, races are won by milliseconds.
                Professional timers like this one use
                high-precision <code>requestAnimationFrame</code> timing rather
                than a standard setInterval, ensuring millisecond accuracy that
                matches the standards set by communities like Speedrun.com.
              </p>
              <p>
                Whether you're chasing a world record or just trying to beat your
                own PB, a split timer transforms a casual playthrough into a
                measurable, improvable skill. Track every segment. Learn from
                every delta. Run faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeedrunSplitTimer;