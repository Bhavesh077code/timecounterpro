import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import { FiPlay, FiPause, FiFlag, FiRotateCcw, FiMaximize, FiMinimize, FiClock, FiTrendingUp, FiTrendingDown, FiX } from 'react-icons/fi';

// Picture-in-Picture floating timer canvas size
const PIP_WIDTH = 320;
const PIP_HEIGHT = 180;

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  
  // Floating/PiP state
  const [pipWindow, setPipWindow] = useState(null);
  const [isVideoPipActive, setIsVideoPipActive] = useState(false);
  const [videoPipSupported, setVideoPipSupported] = useState(false);

  const startedAtRef = useRef(null);
  const accumulatedRef = useRef(0);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);
  
  // PiP refs
  const pipCanvasRef = useRef(null);
  const pipVideoRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (!isRunning) return undefined;
    const update = () => {
      const startedAt = startedAtRef.current;
      if (startedAt == null) return;
      setElapsed(accumulatedRef.current + (Date.now() - startedAt));
    };
    update();
    intervalRef.current = window.setInterval(update, 50);
    return () => window.clearInterval(intervalRef.current);
  }, [isRunning]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // --- PiP Canvas Drawing ---
  const drawPipFrame = (currentElapsed, currentIsRunning, currentLaps) => {
    const canvas = pipCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    // Light theme for PiP
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, w, h);

    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, '#4f46e5');
    gradient.addColorStop(1, '#2563eb');

    // Small centered label at the top
    ctx.fillStyle = 'rgba(15,23,42,0.6)';
    ctx.font = '600 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('⏱ STOPWATCH', w / 2, 30);

    const safeTime = Math.max(0, Math.floor(currentElapsed));
    const mins = Math.floor(safeTime / 60000);
    const secs = Math.floor((safeTime % 60000) / 1000);
    const ms = Math.floor((safeTime % 1000) / 10);
    const timeText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 52px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(timeText, w / 2, h / 2 + 8);

    // Lap count indicator
    if (currentLaps.length > 0) {
      ctx.fillStyle = 'rgba(15,23,42,0.4)';
      ctx.font = '500 13px sans-serif';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(`🏁 ${currentLaps.length} laps`, w / 2, h - 14);
    }

    if (!currentIsRunning && currentElapsed > 0) {
      ctx.fillStyle = 'rgba(15,23,42,0.5)';
      ctx.font = '600 12px sans-serif';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('⏸ PAUSED', w / 2, 52);
    } else if (currentIsRunning) {
      ctx.beginPath();
      ctx.fillStyle = '#4f46e5';
      ctx.arc(w - 16, 16, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  // --- PiP Setup ---
  const supportsDocumentPiP =
    typeof window !== 'undefined' &&
    'documentPictureInPicture' in window;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const canvas = pipCanvasRef.current;
    const video = pipVideoRef.current;
    if (!canvas || !video || typeof canvas.captureStream !== 'function') return undefined;

    drawPipFrame(elapsed, isRunning, laps);

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

  // Redraw canvas on state change
  useEffect(() => {
    drawPipFrame(elapsed, isRunning, laps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, isRunning, laps]);

  // Keep isVideoPipActive in sync
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

  // Native Play/Pause from video PiP
  useEffect(() => {
    const video = pipVideoRef.current;
    if (!video) return undefined;

    const handleVideoPlay = () => {
      if (isVideoPipActive && !isRunning) handleStart();
    };
    const handleVideoPause = () => {
      if (isVideoPipActive && isRunning) handlePause();
    };

    video.addEventListener('play', handleVideoPlay);
    video.addEventListener('pause', handleVideoPause);

    return () => {
      video.removeEventListener('play', handleVideoPlay);
      video.removeEventListener('pause', handleVideoPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVideoPipActive, isRunning]);

  // --- Controls ---
  const formatTime = (ms) => {
    const safe = Math.max(0, Math.floor(ms));
    const minutes = Math.floor(safe / 60000);
    const seconds = Math.floor((safe % 60000) / 1000);
    const milliseconds = Math.floor((safe % 1000) / 10);
    return {
      formatted: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`,
    };
  };

  const handleStart = () => {
    if (isRunning) return;
    startedAtRef.current = Date.now();
    setIsRunning(true);
    toast.success('Stopwatch started');
  };

  const handlePause = () => {
    if (!isRunning) return;
    const now = Date.now();
    accumulatedRef.current += now - startedAtRef.current;
    startedAtRef.current = null;
    setElapsed(accumulatedRef.current);
    setIsRunning(false);
    toast('Paused');
  };

  const handleLap = () => {
    if (!isRunning) return;
    const current = startedAtRef.current == null
      ? accumulatedRef.current
      : accumulatedRef.current + (Date.now() - startedAtRef.current);
    setElapsed(current);
    setLaps((prev) => [...prev, current]);
    toast.success('Lap recorded');
  };

  const handleReset = () => {
    setIsRunning(false);
    startedAtRef.current = null;
    accumulatedRef.current = 0;
    setElapsed(0);
    setLaps([]);
    toast('Reset complete');
  };

  const toggleFullScreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current?.requestFullscreen?.();
      }
    } catch (error) {
      console.warn('Fullscreen request failed:', error);
      toast.error('Fullscreen is not available on this device');
    }
  };

  // --- Floating Timer (PiP) ---
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
            background: #f8fafc;
            color: #0f172a;
          }
          button { font: inherit; cursor: pointer; }
          .pip-btn { border: 0; border-radius: 9px; padding: 6px 12px; font-weight: 700; font-size: 12px; transition: opacity 0.2s; }
          .pip-btn:hover { opacity: 0.85; }
          .pip-btn-primary { color: #fff; background: #4f46e5; }
          .pip-btn-primary.pip-running { background: #d97706; }
          .pip-btn-secondary { border: 1px solid #e2e8f0; color: #0f172a; background: #fff; }
          .pip-btn-danger { border: 1px solid #e2e8f0; color: #0f172a; background: #fff; }
          .pip-btn-danger:hover { background: #fee2e2; border-color: #fca5a5; }
        `;
        nextWindow.document.head.appendChild(style);
        nextWindow.document.title = 'Stopwatch • TimeCounterPro';

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
  // --- End Floating Timer ---

  const timeDisplay = formatTime(elapsed);
  const formattedLaps = laps.map((lap, index) => ({
    index: index + 1,
    time: formatTime(lap),
    split: index > 0 ? lap - laps[index - 1] : lap,
  }));

  const splits = formattedLaps.map((lap) => lap.split);
  const bestSplitIndex = splits.length ? splits.indexOf(Math.min(...splits)) : -1;
  const worstSplitIndex = splits.length ? splits.indexOf(Math.max(...splits)) : -1;
  const averageSplit = splits.length ? splits.reduce((sum, value) => sum + value, 0) / splits.length : 0;

  const getStatusColor = () => {
    if (isRunning) return 'text-emerald-600';
    return elapsed > 0 ? 'text-amber-600' : 'text-slate-400';
  };

  return (
    <div
      ref={containerRef}
      className={`bg-gray-100  border border-slate-200 p-3 xs:p-4 sm:p-6 md:p-8 min-h-[300px] xs:min-h-[350px] sm:min-h-[400px] md:min-h-[500px] w-full max-w-full overflow-x-hidden ${
        isFullscreen ? 'flex flex-col items-center justify-center' : 'shadow-sm'
      }`}
    >
      {/* Hidden canvas + video for PiP */}
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

      {!isFullscreen && (
        <div className="flex items-center justify-between mb-3 xs:mb-4 sm:mb-6 flex-wrap gap-2">
          <h2 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FiClock className="text-indigo-600" size={20} />
            <span className="hidden xs:inline">Digital Stopwatch</span>
            <span className="xs:hidden">Stopwatch</span>
          </h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Floating button */}
            {floatingSupported && (
              <button
                onClick={isFloating ? closeFloatingTimer : openFloatingTimer}
                className={`p-2 rounded-lg text-xs sm:text-base transition-all min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation active:scale-95 ${
                  isFloating 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'bg-slate-100 text-slate-500 hover:text-slate-700'
                }`}
                title="Float timer (Picture-in-Picture)"
                aria-label="Toggle floating timer"
              >
                🪟
              </button>
            )}
            <button
              onClick={toggleFullScreen}
              className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-all touch-manipulation min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Toggle fullscreen"
              title="Fullscreen"
            >
              <FiMaximize size={16} />
            </button>
          </div>
        </div>
      )}

      {isFullscreen && (
        <button
          onClick={toggleFullScreen}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs sm:text-sm text-slate-600 font-medium transition-all flex items-center gap-1.5"
          aria-label="Exit fullscreen"
        >
          <FiMinimize size={14} />
          Exit fullscreen
        </button>
      )}

      <div className={`text-center ${isFullscreen ? 'py-4' : 'py-3 xs:py-4 sm:py-6 md:py-8'}`}>
        <div
          className={`font-mono font-bold text-slate-900 tracking-wider leading-none tabular-nums break-all ${
            isFullscreen
              ? 'text-7xl sm:text-8xl md:text-[10rem]'
              : 'text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
          }`}
        >
          {timeDisplay.formatted}
        </div>
        <div className="mt-1 xs:mt-2 sm:mt-4 text-[10px] xs:text-xs sm:text-sm font-medium">
          <span className={getStatusColor()}>
            {isRunning ? 'Running' : elapsed > 0 ? 'Paused' : 'Stopped'}
          </span>
          {isRunning && <span className="ml-2 text-emerald-600 animate-pulse">●</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5 xs:gap-2 sm:flex sm:flex-wrap sm:gap-2 md:gap-3 justify-center">
        <button
          onClick={handleStart}
          disabled={isRunning}
          className="px-2 xs:px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-[10px] xs:text-xs sm:text-sm md:text-base shadow-sm hover:shadow-md transition-all touch-manipulation active:scale-95 flex items-center justify-center gap-1.5"
        >
          <FiPlay size={14} /> Start
        </button>
        <button
          onClick={handlePause}
          disabled={!isRunning}
          className="px-2 xs:px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-[10px] xs:text-xs sm:text-sm md:text-base shadow-sm hover:shadow-md transition-all touch-manipulation active:scale-95 flex items-center justify-center gap-1.5"
        >
          <FiPause size={14} /> Pause
        </button>
        <button
          onClick={handleLap}
          disabled={!isRunning}
          className="px-2 xs:px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-[10px] xs:text-xs sm:text-sm md:text-base shadow-sm hover:shadow-md transition-all touch-manipulation active:scale-95 flex items-center justify-center gap-1.5"
        >
          <FiFlag size={14} /> Lap
        </button>
        <button
          onClick={handleReset}
          className="px-2 xs:px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl text-[10px] xs:text-xs sm:text-sm md:text-base shadow-sm hover:shadow-md transition-all touch-manipulation active:scale-95 flex items-center justify-center gap-1.5"
        >
          <FiRotateCcw size={14} /> Reset
        </button>
      </div>

      {laps.length > 0 && !isFullscreen && (
        <div className="mt-3 xs:mt-4 sm:mt-6 max-h-32 xs:max-h-36 sm:max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-600 text-[10px] xs:text-xs sm:text-sm font-medium flex items-center gap-1.5">
              <FiFlag size={12} /> Lap Times
            </h3>
            <span className="text-slate-400 text-[8px] xs:text-[10px] sm:text-xs bg-slate-100 px-2 py-0.5">{laps.length} laps</span>
          </div>
          <div className="space-y-1">
            {formattedLaps.map((lap) => (
              <div
                key={lap.index}
                className={`flex justify-between items-center py-1 px-1.5 xs:py-1.5 xs:px-2 sm:px-3  transition-all border ${
                  lap.index - 1 === bestSplitIndex && splits.length > 1
                    ? 'bg-emerald-50 border-emerald-100'
                    : lap.index - 1 === worstSplitIndex && splits.length > 1
                    ? 'bg-rose-50 border-rose-100'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-100'
                }`}
              >
                <span className="text-slate-500 text-[10px] xs:text-xs sm:text-sm font-medium">Lap {lap.index}</span>
                <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
                  <span className="text-slate-900 font-mono text-[10px] xs:text-xs sm:text-sm font-semibold">{lap.time.formatted}</span>
                  <span className="text-[8px] xs:text-[10px] sm:text-xs text-slate-500 font-mono font-medium">
                    +{formatTime(lap.split).formatted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {laps.length > 1 && !isFullscreen && (
        <div className="mt-3 xs:mt-4 grid grid-cols-3 gap-2">
          <div className="bg-emerald-50 border-emerald-100 p-2 text-center">
            <FiTrendingDown className="text-emerald-600 mx-auto" size={14} />
            <div className="text-[10px] xs:text-xs font-mono font-semibold text-emerald-700 mt-1">
              {formatTime(Math.min(...splits)).formatted}
            </div>
            <div className="text-[8px] xs:text-[9px] text-slate-500 mt-0.5">Fastest split</div>
          </div>
          <div className="bg-slate-50 border-slate-200 p-2 text-center">
            <FiClock className="text-slate-500 mx-auto" size={14} />
            <div className="text-[10px] xs:text-xs font-mono font-semibold text-slate-700 mt-1">
              {formatTime(averageSplit).formatted}
            </div>
            <div className="text-[8px] xs:text-[9px] text-slate-500 mt-0.5">Average split</div>
          </div>
          <div className="bg-rose-50  border-rose-100 p-2 text-center">
            <FiTrendingUp className="text-rose-600 mx-auto" size={14} />
            <div className="text-[10px] xs:text-xs font-mono font-semibold text-rose-700 mt-1">
              {formatTime(Math.max(...splits)).formatted}
            </div>
            <div className="text-[8px] xs:text-[9px] text-slate-500 mt-0.5">Slowest split</div>
          </div>
        </div>
      )}

      {laps.length > 0 && !isFullscreen && (
        <div className="mt-2 xs:mt-3 text-center text-[8px] xs:text-[10px] sm:text-xs text-slate-400 border-t border-slate-100 pt-2 xs:pt-3">
          Total elapsed: <span className="text-slate-600 font-mono font-medium">{formatTime(elapsed).formatted}</span>
        </div>
      )}

      {!isFullscreen && (
        <div className="mt-5 sm:mt-6 border-t border-slate-100 pt-4 sm:pt-5">
          <button
            onClick={() => setShowAbout((value) => !value)}
            className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
          >
            {showAbout ? '▾' : '▸'} How to read your splits
          </button>

          {showAbout && (
            <div className="mt-3 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                A "split" is the time for one individual lap, not the running
                total shown next to it. The stopwatch above records both: the
                cumulative time when you tap Lap, and the difference from the
                previous lap, which is the number that actually tells you
                whether you're speeding up or slowing down.
              </p>
              <p>
                For interval training, comparing your fastest and slowest
                splits is usually more useful than the total time — a shrinking
                gap between them across a session is a sign of pacing that's
                holding steady rather than fading.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>Recording at least 3 laps gives an average worth trusting.</li>
                <li>The green-highlighted lap is your fastest split; red is your slowest.</li>
                <li>Use Reset between separate sessions — laps carry over otherwise.</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Interactive floating window content (Chrome/Edge desktop only) */}
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
            color: '#4f46e5',
            textAlign: 'center',
            marginBottom: '4px',
          }}>
            ⏱ STOPWATCH
          </div>

          <div style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '42px',
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: '1px',
            textAlign: 'center',
            color: '#0f172a',
          }}>
            {timeDisplay.formatted}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <button
              onClick={isRunning ? handlePause : handleStart}
              className="pip-btn"
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
              onClick={handleLap}
              disabled={!isRunning}
              className="pip-btn"
              style={{
                border: 0,
                borderRadius: '9px',
                padding: '6px 10px',
                color: '#fff',
                background: isRunning ? '#4f46e5' : '#94a3b8',
                cursor: isRunning ? 'pointer' : 'default',
                fontWeight: 700,
                fontSize: '12px',
                opacity: isRunning ? 1 : 0.5,
              }}
            >
              🏁
            </button>
            <button
              onClick={handleReset}
              className="pip-btn"
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '9px',
                padding: '6px 10px',
                color: '#0f172a',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              ⟳
            </button>
            <button
              onClick={closeFloatingTimer}
              className="pip-btn"
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: '9px',
                padding: '6px 10px',
                color: '#0f172a',
                background: '#fff',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              ✕
            </button>
          </div>

          {laps.length > 0 && (
            <div style={{
              fontSize: '10px',
              color: '#64748b',
              marginTop: '6px',
              fontFamily: 'monospace',
            }}>
              🏁 {laps.length} laps
            </div>
          )}
        </div>,
        pipWindow.document.body
      )}
    </div>
  );
}

export default Stopwatch;