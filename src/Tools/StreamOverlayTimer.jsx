import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

const StreamOverlayTimer = () => {
  // --- State ---
  const [duration, setDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [bgMode, setBgMode] = useState('green');
  const [isFinished, setIsFinished] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedPreviewMode, setEmbedPreviewMode] = useState('obs');
  const [copiedField, setCopiedField] = useState(null);
  const [guideTab, setGuideTab] = useState('guide');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const overlayRef = useRef(null);

  // --- Audio ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const playBeep = useCallback((freq = 880, duration = 0.2) => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.2;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }, [initAudio]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  // --- Fullscreen toggle ---
  const toggleFullscreen = useCallback(() => {
    const el = overlayRef.current;
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

  // --- Fullscreen state listener ---
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
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setShowPanel((prev) => !prev);
      }
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setShowEmbed((prev) => !prev);
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === ' ' && !e.target.tagName.match(/INPUT|BUTTON/)) {
        e.preventDefault();
        setIsRunning((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleFullscreen]);

  // --- Timer ---
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next === 10 || next === 5) playBeep(660, 0.15);
        if (next > 0 && next <= 3) playBeep(880, 0.15);
        if (next <= 0) {
          setIsRunning(false);
          setIsFinished(true);
          playBeep(1200, 0.6);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, playBeep]);

  const handleStart = () => {
    initAudio();
    if (timeLeft <= 0) {
      setTimeLeft(duration * 60);
      setIsFinished(false);
    }
    setIsRunning(true);
  };
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(duration * 60);
  };
  const handleDurationChange = (mins) => {
    setDuration(mins);
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(mins * 60);
  };

  const getEmbedUrl = () => {
    if (typeof window === 'undefined') return 'https://your-app.com/stream-overlay';
    return window.location.href;
  };
  const getIframeCode = () => {
    return `<iframe src="${getEmbedUrl()}" width="1920" height="1080" frameborder="0" allowfullscreen></iframe>`;
  };
  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1800);
    });
  };

  const bgColor = bgMode === 'green' ? '#00FF00' : '#000000';
  const textColor = bgMode === 'green' ? '#000000' : '#FFFFFF';
  const subTextColor = bgMode === 'green' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)';
  const isUrgent = timeLeft > 0 && timeLeft <= 10 && isRunning;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* ===== OVERLAY WRAPPER (fullscreen target) ===== */}
      <div
        ref={overlayRef}
        className="relative w-full overflow-hidden flex items-center justify-center"
        style={{
          background: bgColor,
          minHeight: 'calc(100vh - 64px)',
          height: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
        }}
      >
        {/* ===== CLOCK ===== */}
        <div className="flex flex-col items-center justify-center select-none px-4">
          <p
            className="text-[10px] sm:text-xs md:text-sm tracking-[0.5em] uppercase mb-3 sm:mb-6 transition-all"
            style={{ color: subTextColor, fontFamily: 'monospace' }}
          >
            Stream starting in
          </p>
          <div
            className="text-[24vw] sm:text-[20vw] md:text-[14vw] leading-none font-black tabular-nums transition-all duration-200"
            style={{
              color: textColor,
              fontFamily:
                '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Courier New", monospace',
              letterSpacing: '-0.05em',
              textShadow: isUrgent
                ? bgMode === 'green'
                  ? '0 0 40px rgba(0,0,0,0.4)'
                  : '0 0 60px rgba(255,59,59,0.9)'
                : 'none',
            }}
          >
            {formatTime(timeLeft)}
          </div>
          {isFinished && (
            <p
              className="text-xl sm:text-3xl md:text-4xl tracking-[0.3em] uppercase mt-4 sm:mt-8 animate-pulse"
              style={{ color: textColor, fontFamily: 'monospace' }}
            >
              Live Now
            </p>
          )}
          {isRunning && !isFinished && (
            <div className="flex items-center gap-2 mt-4 sm:mt-8">
              <span
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse"
                style={{ background: textColor }}
              ></span>
              <p
                className="text-[10px] sm:text-xs md:text-sm tracking-[0.3em] uppercase"
                style={{ color: subTextColor, fontFamily: 'monospace' }}
              >
                Live
              </p>
            </div>
          )}
        </div>

        {/* ===== SMALL FULLSCREEN BUTTON (top-left) ===== */}
        <button
          onClick={toggleFullscreen}
          className="fixed top-20 left-3 md:top-24 md:left-4 z-50 w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(15, 15, 15, 0.75)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: bgMode === 'green' ? '#fff' : '#fff',
          }}
          title="Fullscreen (F)"
        >
          {isFullscreen ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
            </svg>
          )}
        </button>

        {/* ===== CONFIG PANEL (always visible when showPanel true) ===== */}
        <div
          className={`fixed z-50 transition-all duration-300 ${
            showPanel
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          } top-16 left-0 right-0 mx-auto w-[calc(100%-1.5rem)] max-w-sm
             md:top-24 md:right-6 md:left-auto md:mx-0 md:w-80`}
        >
          <div
            className="rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(15, 15, 15, 0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div
              className="px-5 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div>
                <p
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Overlay Control
                </p>
                <p className="text-white text-sm font-medium mt-0.5">
                  Stream Countdown
                </p>
              </div>
              <button
                onClick={() => setShowPanel(false)}
                className="text-white/40 hover:text-white/80 transition-colors text-lg leading-none px-2"
                title="Hide panel (press H)"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Duration presets */}
              <div>
                <p
                  className="text-[10px] tracking-[0.2em] uppercase mb-3"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Duration
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 10, 15].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleDurationChange(m)}
                      disabled={isRunning}
                      className="py-2.5 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background:
                          duration === m && !isRunning
                            ? '#ffffff'
                            : 'rgba(255,255,255,0.06)',
                        color:
                          duration === m && !isRunning
                            ? '#000000'
                            : 'rgba(255,255,255,0.7)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom slider */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <p
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Custom
                  </p>
                  <p className="text-white text-sm font-medium tabular-nums">
                    {duration} min
                  </p>
                </div>
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={duration}
                  onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                  disabled={isRunning}
                  className="w-full accent-white disabled:opacity-40"
                  style={{ accentColor: '#ffffff' }}
                />
              </div>

              {/* Background */}
              <div>
                <p
                  className="text-[10px] tracking-[0.2em] uppercase mb-3"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Background
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBgMode('green')}
                    className="py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      background:
                        bgMode === 'green' ? '#ffffff' : 'rgba(255,255,255,0.06)',
                      color: bgMode === 'green' ? '#000000' : 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-sm"
                      style={{ background: '#00FF00' }}
                    ></span>
                    Chroma
                  </button>
                  <button
                    onClick={() => setBgMode('black')}
                    className="py-2.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      background:
                        bgMode === 'black' ? '#ffffff' : 'rgba(255,255,255,0.06)',
                      color: bgMode === 'black' ? '#000000' : 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-sm border border-white/30"
                      style={{ background: '#000000' }}
                    ></span>
                    Black
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2 pt-1">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background: '#ffffff',
                      color: '#000000',
                    }}
                  >
                    {isFinished
                      ? 'Restart'
                      : timeLeft < duration * 60
                      ? 'Resume'
                      : 'Start Countdown'}
                  </button>
                ) : (
                  <button
                    onClick={handlePause}
                    className="flex-1 py-3 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    Pause
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 active:scale-[0.98]"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(255,255,255,0.6)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  Reset
                </button>
              </div>

              {/* Embed toggle */}
              <button
                onClick={() => setShowEmbed((prev) => !prev)}
                className="w-full py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: showEmbed
                    ? 'rgba(99, 102, 241, 0.2)'
                    : 'rgba(255,255,255,0.06)',
                  color: showEmbed ? '#a5b4fc' : 'rgba(255,255,255,0.7)',
                  border: showEmbed
                    ? '1px solid rgba(99, 102, 241, 0.5)'
                    : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {showEmbed ? 'Hide Embed Panel' : 'Get Embed Code'}
              </button>

              {/* Shortcuts */}
              <div
                className="pt-3 grid grid-cols-2 gap-2 text-[10px]"
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                <span>H — Hide</span>
                <span className="text-right">E — Embed</span>
                <span>F — Fullscreen</span>
                <span className="text-right">Space — Start</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== EMBED PANEL ===== */}
        {showPanel && showEmbed && (
          <div className="hidden lg:block fixed top-24 right-[360px] z-50 w-[400px] transition-all duration-300">
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(15, 15, 15, 0.97)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div
                className="px-5 py-4"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p
                  className="text-[10px] tracking-[0.2em] uppercase"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Embed Code
                </p>
                <p className="text-white text-sm font-medium mt-0.5">
                  OBS · iframe · Website
                </p>
              </div>

              <div className="p-5 space-y-4">
                {/* Live URL */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-[10px] tracking-[0.2em] uppercase"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      Live URL
                    </p>
                    <button
                      onClick={() => handleCopy(getEmbedUrl(), 'url')}
                      className="text-[10px] font-bold tracking-wider uppercase transition-colors"
                      style={{
                        color: copiedField === 'url' ? '#10b981' : '#a5b4fc',
                      }}
                    >
                      {copiedField === 'url' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div
                    className="px-3 py-2.5 rounded-lg text-[11px] break-all"
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#a5b4fc',
                      fontFamily: 'monospace',
                    }}
                  >
                    {getEmbedUrl()}
                  </div>
                </div>

                {/* iframe */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p
                      className="text-[10px] tracking-[0.2em] uppercase"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      iframe Code
                    </p>
                    <button
                      onClick={() => handleCopy(getIframeCode(), 'iframe')}
                      className="text-[10px] font-bold tracking-wider uppercase transition-colors"
                      style={{
                        color: copiedField === 'iframe' ? '#10b981' : '#a5b4fc',
                      }}
                    >
                      {copiedField === 'iframe' ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div
                    className="px-3 py-2.5 rounded-lg text-[10px] break-all"
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {getIframeCode()}
                  </div>
                </div>

                {/* Live Preview */}
                <div
                  className="pt-3"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p
                      className="text-[10px] tracking-[0.2em] uppercase"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      Live Preview
                    </p>
                    <div
                      className="flex rounded-md overflow-hidden"
                      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <button
                        onClick={() => setEmbedPreviewMode('obs')}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                        style={{
                          background:
                            embedPreviewMode === 'obs'
                              ? 'rgba(255,255,255,0.15)'
                              : 'transparent',
                          color:
                            embedPreviewMode === 'obs'
                              ? '#ffffff'
                              : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        OBS
                      </button>
                      <button
                        onClick={() => setEmbedPreviewMode('site')}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                        style={{
                          background:
                            embedPreviewMode === 'site'
                              ? 'rgba(255,255,255,0.15)'
                              : 'transparent',
                          color:
                            embedPreviewMode === 'site'
                              ? '#ffffff'
                              : 'rgba(255,255,255,0.4)',
                        }}
                      >
                        Website
                      </button>
                    </div>
                  </div>

                  <div
                    className="rounded-lg overflow-hidden relative"
                    style={{
                      border: '1px solid rgba(255,255,255,0.1)',
                      background:
                        embedPreviewMode === 'obs' ? '#1a1a1a' : '#ffffff',
                      aspectRatio: '16 / 9',
                    }}
                  >
                    {embedPreviewMode === 'obs' ? (
                      <div className="relative w-full h-full">
                        <div
                          className="absolute top-0 left-0 right-0 h-6 flex items-center px-2 gap-1.5 z-20"
                          style={{
                            background: 'rgba(0,0,0,0.85)',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <span
                            className="ml-2 text-[8px] tracking-wider uppercase"
                            style={{ color: 'rgba(255,255,255,0.5)' }}
                          >
                            OBS Studio · Starting Soon
                          </span>
                        </div>
                        <div className="absolute top-6 left-0 right-0 bottom-0 bg-black flex items-center justify-center">
                          <div
                            className="w-full h-full flex flex-col items-center justify-center"
                            style={{
                              background: bgMode === 'green' ? '#00FF00' : '#000000',
                            }}
                          >
                            <p
                              className="text-[8px] tracking-[0.4em] uppercase mb-1"
                              style={{
                                color:
                                  bgMode === 'green'
                                    ? 'rgba(0,0,0,0.5)'
                                    : 'rgba(255,255,255,0.4)',
                                fontFamily: 'monospace',
                              }}
                            >
                              Stream starting in
                            </p>
                            <div
                              className="text-[42px] leading-none font-black tabular-nums"
                              style={{
                                color: bgMode === 'green' ? '#000000' : '#ffffff',
                                fontFamily: 'monospace',
                                letterSpacing: '-0.05em',
                              }}
                            >
                              {formatTime(timeLeft)}
                            </div>
                          </div>
                        </div>
                        <div
                          className="absolute bottom-2 right-2 px-2 py-1 rounded text-[8px] font-bold tracking-wider uppercase flex items-center gap-1"
                          style={{
                            background: 'rgba(16, 185, 129, 0.9)',
                            color: '#ffffff',
                          }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Capturing
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <div
                          className="absolute top-0 left-0 right-0 h-6 flex items-center px-2 gap-1.5 z-20"
                          style={{
                            background: '#e5e7eb',
                            borderBottom: '1px solid #d1d5db',
                          }}
                        >
                          <span className="w-2 h-2 rounded-full bg-red-400"></span>
                          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <div
                            className="ml-2 flex-1 rounded-sm px-2 py-0.5 text-[8px] truncate"
                            style={{
                              background: '#ffffff',
                              color: '#6b7280',
                              border: '1px solid #d1d5db',
                            }}
                          >
                            yoursite.com
                          </div>
                        </div>
                        <div className="absolute top-6 left-0 right-0 bottom-0 bg-white p-3">
                          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                            <div
                              className="text-[9px] font-bold text-gray-800"
                              style={{ letterSpacing: '-0.02em' }}
                            >
                              My Website
                            </div>
                            <div className="flex gap-2">
                              <div className="w-8 h-1.5 rounded-full bg-gray-200"></div>
                              <div className="w-8 h-1.5 rounded-full bg-gray-200"></div>
                              <div className="w-8 h-1.5 rounded-full bg-gray-200"></div>
                            </div>
                          </div>
                          <div
                            className="rounded overflow-hidden"
                            style={{
                              border: '1px solid #e5e7eb',
                              aspectRatio: '16 / 9',
                              background:
                                bgMode === 'green' ? '#00FF00' : '#000000',
                            }}
                          >
                            <div className="w-full h-full flex flex-col items-center justify-center">
                              <p
                                className="text-[6px] tracking-[0.4em] uppercase mb-1"
                                style={{
                                  color:
                                    bgMode === 'green'
                                      ? 'rgba(0,0,0,0.5)'
                                      : 'rgba(255,255,255,0.4)',
                                  fontFamily: 'monospace',
                                }}
                              >
                                Stream starting in
                              </p>
                              <div
                                className="text-[22px] leading-none font-black tabular-nums"
                                style={{
                                  color:
                                    bgMode === 'green' ? '#000000' : '#ffffff',
                                  fontFamily: 'monospace',
                                  letterSpacing: '-0.05em',
                                }}
                              >
                                {formatTime(timeLeft)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <p
                    className="mt-2 text-[10px] leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {embedPreviewMode === 'obs'
                      ? 'This is how your overlay appears inside OBS Studio — a clean countdown on top of your scene.'
                      : 'This is how it looks when embedded on your website via iframe.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== HINT WHEN PANEL HIDDEN ===== */}
        {!showPanel && (
          <div
            className="fixed bottom-4 left-4 z-40 text-[10px] tracking-widest uppercase opacity-30 hover:opacity-100 transition-opacity cursor-pointer"
            style={{ color: textColor, fontFamily: 'monospace' }}
            onClick={() => setShowPanel(true)}
          >
            Press H for controls
          </div>
        )}

        {/* ===== QUICK GUIDE CARD ===== */}
        {showPanel && (
          <div
            className="hidden lg:block fixed bottom-6 left-6 z-40 w-[420px] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(15, 15, 15, 0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              maxHeight: '70vh',
            }}
          >
            {/* Header with tabs */}
            <div
              className="px-5 pt-4 pb-0"
              style={{
                background: 'rgba(20, 20, 22, 0.98)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p
                    className="text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Streamer's Guide
                  </p>
                  <p className="text-white text-sm font-semibold mt-0.5 tracking-wide">
                    Countdown Overlay 101
                  </p>
                </div>
                <span
                  className="text-[9px] font-bold tracking-widest uppercase px-2 py-1 rounded"
                  style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#a5b4fc',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                  }}
                >
                  ~300 words
                </span>
              </div>

              {/* Tabs */}
              <div className="flex gap-1">
                {[
                  { key: 'guide', label: 'Why & How' },
                  { key: 'obs', label: 'OBS Steps' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setGuideTab(tab.key)}
                    className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-all relative"
                    style={{
                      color:
                        guideTab === tab.key
                          ? '#ffffff'
                          : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {tab.label}
                    {guideTab === tab.key && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: '#a5b4fc' }}
                      ></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Body — scrollable */}
            <div
              className="px-5 py-4 overflow-y-auto text-[12px] leading-relaxed"
              style={{
                maxHeight: 'calc(70vh - 100px)',
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              {guideTab === 'guide' ? (
                <div className="space-y-3.5">
                  <p>
                    <span className="text-white font-semibold">
                      What is this overlay?
                    </span>{' '}
                    It's a clean, full-screen countdown clock designed to sit on top
                    of your stream before you go live. Streamers use it during the
                    "starting soon" screen so viewers know exactly when the show                    begins — no more awkward silence or guessing.
                  </p>

                  <p>
                    <span className="text-white font-semibold">
                      Why use a countdown at all?
                    </span>{' '}
                    When viewers click your stream, they want to know how long
                    they'll be waiting. A visible timer keeps them on the page
                    instead of bouncing off. It also gives you a professional edge
                    — the same tool big Twitch and YouTube channels use. Studies
                    show that streams with a clear "starting soon" timer retain
                    up to 40% more viewers during the pre-show window.
                  </p>

                  <p>
                    <span className="text-white font-semibold">
                      How do I set it up?
                    </span>{' '}
                    First, choose your countdown length — 1, 5, 10, or 15 minutes,
                    or drag the slider for anything up to an hour. Then pick your
                    background: chroma-green if you want to key it out in OBS, or
                    pitch-black for a dark theme. Hit{' '}
                    <span className="text-white font-mono">Start Countdown</span>,
                    then press{' '}
                    <span className="text-white font-mono">H</span> to hide the
                    config panel. Only the clean clock remains visible.
                  </p>

                  <p>
                    <span className="text-white font-semibold">
                      Adding it to OBS.
                    </span>{' '}
                    Open OBS, add a Browser Source, and paste the Live URL from the
                    Embed panel. Set the size to 1920×1080, and enable "Shutdown
                    source when not visible". If you picked chroma-green, add a
                    Chroma Key filter and the green vanishes instantly. That's it
                    — your timer is now a permanent overlay.
                  </p>

                  <p>
                    <span className="text-white font-semibold">
                      Live shortcuts you'll actually use.
                    </span>{' '}
                    Press <span className="text-white font-mono">H</span> to
                    hide or show the config panel mid-stream.{' '}
                    <span className="text-white font-mono">Space</span> pauses and
                    resumes the timer.{' '}
                    <span className="text-white font-mono">F</span> toggles
                    fullscreen mode.{' '}
                    <span className="text-white font-mono">E</span> opens the embed
                    panel. All work instantly — no clicking around, no
                    breaking the visual flow while you're live.
                  </p>

                  <p>
                    <span className="text-white font-semibold">
                      Pro tip for regulars.
                    </span>{' '}
                    Save the browser source in OBS once, then just reuse it every
                    stream. Change the duration from the panel each time, and
                    you're set. It takes 10 seconds, looks professional, and turns
                    your pre-show dead air into anticipation.
                  </p>
                </div>
              ) : (
                <ol className="space-y-3">
                  {[
                    {
                      t: 'Add a Browser Source',
                      d: 'In OBS, open your scene. Click the + under Sources and select Browser. Name it "Countdown Overlay".',
                    },
                    {
                      t: 'Paste the Live URL',
                      d: 'Copy the URL from the Embed panel (press E) and paste it into the Browser Source URL field.',
                    },
                    {
                      t: 'Set resolution',
                      d: 'Width 1920, Height 1080. Leave FPS at 30 — plenty smooth and light on CPU.',
                    },
                    {
                      t: 'Enable browser options',
                      d: 'Tick "Shutdown source when not visible" and "Refresh browser when scene becomes active".',
                    },
                    {
                      t: 'Chroma Key (green only)',
                      d: 'Right-click the source → Filters → + → Chroma Key. Set the key color to pure green. The background disappears.',
                    },
                    {
                      t: 'Position & resize',
                      d: 'Drag the source to center or top-center of your scene. Resize with the red handles if needed.',
                    },
                    {
                      t: 'Test it live',
                      d: 'Click Start Countdown, press H to hide the panel, and watch the timer tick live inside OBS.',
                    },
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className="text-[10px] font-bold tabular-nums flex-shrink-0 w-5 pt-0.5"
                        style={{ color: '#a5b4fc', fontFamily: 'monospace' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <p className="text-white text-[12px] font-semibold tracking-wide mb-0.5">
                          {step.t}
                        </p>
                        <p
                          className="text-[11px] leading-snug"
                          style={{ color: 'rgba(255,255,255,0.5)' }}
                        >
                          {step.d}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamOverlayTimer;