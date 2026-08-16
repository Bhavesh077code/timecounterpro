

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
  const [showControls, setShowControls] = useState(false);
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
    <div className="fixed inset-0 z-40 bg-gradient-to-br from-[#070707] via-[#180a29] to-[#070707] text-white flex flex-col overflow-y-auto">
      
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

        {/* ✅ Clean UI - Timer Name & Status */}
        <div className="relative z-10 mx-auto mt-4 sm:mt-6 md:mt-8 w-full max-w-xl px-3 sm:px-4">
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-lg sm:text-xl text-white text-center">
              {currentTimer.name || "Timer"}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 capitalize mt-5.5">
              {currentTimer.type || "custom"} ·{" "}
              {isPaused ? "Paused" : isComplete ? "Completed" : "Running"}
            </p>
          </div>
        </div>

        {/* ✅ Timer - Big & Center */}
        <main className="relative mt-20 mb-20 text-5xl z-10 flex-1 flex flex-col items-center justify-center px-4 py-2">
          {showComplete ? (
           <div className="text-center mb-4 sm:mb-6 pt-8 sm:pt-12 md:pt-16">
              <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] mb-3 sm:mb-4 animate-bounce">
                🎉
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-2 sm:mt-3 text-white">
                Timer Complete!
              </h2>
              <p className="text-purple-300 mt-2 text-base sm:text-lg md:text-xl">
                {currentTimer.name}
              </p>
              <p className="text-gray-400 text-sm sm:text-base mt-1">
                Great job! 🎯
              </p>
            </div>
          ) : (
            <>
              {/* ✅ BIG TIMER - CENTER */}
              <div className="text-[clamp(5rem,20vw,14rem)] leading-none font-mono font-bold tracking-tight text-center tabular-nums">
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

          {/* ✅ Controls Buttons */}
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

        {/* ✅ Collapsible Controls */}
        <div className="relative z-10 mx-auto w-full max-w-xl px-3 sm:px-4 pb-4">
          <button
            onClick={() => setShowControls(!showControls)}
            className="w-full py-2 text-xs sm:text-sm text-white/40 hover:text-white/80 transition-colors border-t border-white/5 mt-2"
          >
            {showControls ? "▲ Hide Controls" : "▼ Show Controls"}
          </button>

          {showControls && (
            <div className="mt-2 space-y-2 animate-fade-in">
              {/* Sound & Ambient */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-xs sm:text-sm text-white/80">
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

              {/* Extra Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
                <button
                  onClick={() => setSoundEnabled((value) => !value)}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-xs sm:text-sm transition-all flex items-center gap-1"
                >
                  {soundEnabled ? "🔊" : "🔇"}
                  <span className="hidden xs:inline">{soundEnabled ? "Sound ON" : "Sound OFF"}</span>
                </button>

                <button
                  onClick={toggleFullScreen}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-xs sm:text-sm transition-all flex items-center gap-1"
                >
                  ⛶ <span className="hidden xs:inline">Fullscreen</span>
                </button>

                <button
                  onClick={isFloating ? closeFloatingTimer : openFloatingTimer}
                  disabled={!floatingSupported}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg active:scale-95 text-xs sm:text-sm transition-all flex items-center gap-1 ${
                    isFloating
                      ? "bg-purple-500/30 text-purple-300"
                      : "bg-white/10 hover:bg-white/20"
                  } ${!floatingSupported ? "opacity-40 cursor-not-allowed active:scale-100" : ""}`}
                >
                  🪟 <span className="hidden xs:inline">{isFloating ? "Floating" : "Float"}</span>
                </button>

                <button
                  onClick={handleClose}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 active:scale-95 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1"
                >
                  ✕ <span className="hidden xs:inline">Close</span>
                </button>
              </div>
            </div>
          )}
        </div>

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