import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Layout/Footer";

// ============================================
// RUBIK'S CUBE STOPWATCH WITH MILLISECONDS
// ============================================

const RubiksCubeStopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0); // ms
  const [solves, setSolves] = useState([]); // { id, time, scramble }
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inspection, setInspection] = useState(false);
  const [inspectionLeft, setInspectionLeft] = useState(15); // seconds
  const [penalty, setPenalty] = useState(null); // null | '+2' | 'DNF'
  const [scramble, setScramble] = useState("");

  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const pageRef = useRef(null);
  const solveListRef = useRef(null);

  // ---------- Scramble generator (3x3 WCA-ish) ----------
  const FACES = ["R", "L", "U", "D", "F", "B"];
  const MODS = ["", "'", "2"];

  const generateScramble = useCallback(() => {
    const moves = [];
    let lastFace = "";
    let secondLastFace = "";
    for (let i = 0; i < 20; i++) {
      let face;
      do {
        face = FACES[Math.floor(Math.random() * FACES.length)];
      } while (
        face === lastFace ||
        (face === secondLastFace && isOpposite(face, lastFace))
      );
      const mod = MODS[Math.floor(Math.random() * MODS.length)];
      moves.push(face + mod);
      secondLastFace = lastFace;
      lastFace = face;
    }
    return moves.join(" ");
  }, []);

  const isOpposite = (a, b) => {
    const pairs = { R: "L", L: "R", U: "D", D: "U", F: "B", B: "F" };
    return pairs[a] === b;
  };

  useEffect(() => {
    setScramble(generateScramble());
  }, [generateScramble]);

  // ---------- Format ----------
  const formatTime = useCallback((ms) => {
    if (ms < 0) ms = 0;
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const millis = Math.floor(ms % 1000);
    if (minutes > 0) {
      return `${minutes}:${String(seconds).padStart(2, "0")}.${String(
        millis,
      ).padStart(3, "0")}`;
    }
    return `${seconds}.${String(millis).padStart(3, "0")}`;
  }, []);

  // ---------- RAF tick ----------
  useEffect(() => {
    if (!isRunning) return;
    const tick = () => {
      if (startTimeRef.current !== null) {
        setElapsed(performance.now() - startTimeRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [isRunning]);

  // ---------- Inspection countdown ----------
  useEffect(() => {
    if (!inspection) return;
    if (inspectionLeft <= 0) {
      setInspection(false);
      // auto-start
      startTimeRef.current = performance.now();
      setElapsed(0);
      setIsRunning(true);
      return;
    }
    const t = setTimeout(() => setInspectionLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [inspection, inspectionLeft]);

  // ---------- Start / Stop ----------
  const startTimer = useCallback(() => {
    startTimeRef.current = performance.now();
    setElapsed(0);
    setPenalty(null);
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    if (!isRunning) return;
    const finalTime = performance.now() - (startTimeRef.current || 0);
    setElapsed(finalTime);
    setIsRunning(false);

    const effective = penalty === "+2" ? finalTime + 2000 : finalTime;
    if (penalty !== "DNF") {
      const newSolve = {
        id: Date.now(),
        time: effective,
        raw: finalTime,
        penalty,
        scramble,
      };
      setSolves((prev) => [...prev, newSolve]);
    }
    setPenalty(null);
    setScramble(generateScramble());
    setTimeout(() => {
      if (solveListRef.current) {
        solveListRef.current.scrollTop = solveListRef.current.scrollHeight;
      }
    }, 50);
  }, [isRunning, penalty, scramble, generateScramble]);

  // ---------- Reset ----------
  const handleReset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    setSolves([]);
    setPenalty(null);
    setInspection(false);
    setInspectionLeft(15);
    startTimeRef.current = null;
    setScramble(generateScramble());
  }, [generateScramble]);

  // ---------- Fullscreen ----------
  const toggleFullscreen = useCallback(() => {
    const el = pageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      (el.requestFullscreen?.() || el.webkitRequestFullscreen?.())?.then?.(() =>
        setIsFullscreen(true),
      );
      setIsFullscreen(true);
    } else {
      (
        document.exitFullscreen?.() || document.webkitExitFullscreen?.()
      )?.then?.(() => setIsFullscreen(false));
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  // ---------- Keyboard ----------
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      if (e.code === "Space") {
        e.preventDefault();
        if (isRunning) {
          stopTimer();
        } else if (elapsed > 0) {
          startTimer();
        } else {
          // start inspection
          setInspection(true);
          setInspectionLeft(15);
        }
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (isRunning) stopTimer();
        else startTimer();
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handleReset();
      }
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === "2" && !isRunning) {
        setPenalty((p) => (p === "+2" ? null : "+2"));
      }
      if (e.key === "d" || e.key === "D") {
        if (!isRunning) setPenalty((p) => (p === "DNF" ? null : "DNF"));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    isRunning,
    elapsed,
    startTimer,
    stopTimer,
    handleReset,
    toggleFullscreen,
  ]);

  // ---------- Stats ----------
  const validSolves = solves.filter((s) => s.penalty !== "DNF");
  const best = validSolves.length
    ? Math.min(...validSolves.map((s) => s.time))
    : 0;
  const worst = validSolves.length
    ? Math.max(...validSolves.map((s) => s.time))
    : 0;
  const mean = validSolves.length
    ? validSolves.reduce((a, s) => a + s.time, 0) / validSolves.length
    : 0;

  const ao5 = (() => {
    if (validSolves.length < 5) return null;
    const last5 = validSolves.slice(-5).map((s) => s.time);
    const sorted = [...last5].sort((a, b) => a - b);
    const trimmed = sorted.slice(1, 4);
    return trimmed.reduce((a, b) => a + b, 0) / 3;
  })();

  const ao12 = (() => {
    if (validSolves.length < 12) return null;
    const last12 = validSolves.slice(-12).map((s) => s.time);
    const sorted = [...last12].sort((a, b) => a - b);
    const trimmed = sorted.slice(1, 11);
    return trimmed.reduce((a, b) => a + b, 0) / 10;
  })();

  return (
    <div>
      <div className="min-h-screen bg-[#0d0f12] text-white">
        <style>{`
          html, body { scrollbar-width: none; -ms-overflow-style: none; }
          html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
          .no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
          .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        `}</style>

        {!isFullscreen && <Navbar />}

        <div
          ref={pageRef}
          className="relative w-full no-scrollbar"
          style={{
            minHeight: isFullscreen ? "100vh" : "calc(100vh - 64px)",
            overflowY: "auto",
            background: "#0d0f12",
          }}
        >
          {/* grid bg */}
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          ></div>

          {/* Fullscreen btn */}
          {!isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="fixed top-20 right-4 md:right-8 z-50 w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: "#000",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.9)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
              }}
              title="Fullscreen (F)"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            </button>
          )}
          {isFullscreen && (
            <button
              onClick={toggleFullscreen}
              className="fixed top-4 right-4 z-50 w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                background: "#000",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "rgba(255,255,255,0.9)",
              }}
              title="Exit Fullscreen (F)"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            </button>
          )}

          <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
            {/* HEADER */}
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center text-base font-black"
                  style={{
                    background: "linear-gradient(135deg, #475569, #1e293b)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#fbbf24",
                  }}
                >
                  ⏱
                </div>
                <div>
                  <p
                    className="text-[10px] tracking-[0.3em] uppercase font-bold"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    Rubik's Cube · Online Timer
                  </p>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                    Speedcube Stopwatch with Milliseconds
                  </h1>
                </div>
              </div>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* LEFT: timer */}
              <div className="lg:col-span-7">
                <div
                  className="rounded-lg overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, #14171c 0%, #0f1216 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* top strip */}
                  <div
                    className="px-4 py-2.5 flex items-center justify-between"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${isRunning ? "animate-pulse" : ""}`}
                        style={{
                          background: isRunning
                            ? "#22c55e"
                            : inspection
                              ? "#fbbf24"
                              : "rgba(255,255,255,0.2)",
                          boxShadow: isRunning ? "0 0 8px #22c55e" : "none",
                        }}
                      ></span>
                      <span
                        className="text-[10px] tracking-[0.2em] uppercase font-bold"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {isRunning
                          ? "Solving"
                          : inspection
                            ? `Inspection ${inspectionLeft}s`
                            : elapsed > 0
                              ? "Stopped"
                              : "Ready"}
                      </span>
                    </div>
                    <span
                      className="text-[10px] tracking-[0.2em] uppercase font-bold"
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      Solve {solves.length}
                    </span>
                  </div>

                  {/* Scramble */}
                  <div
                    className="px-5 py-4 text-center"
                    style={{
                      background: "rgba(0,0,0,0.2)",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p
                      className="text-[9px] tracking-[0.25em] uppercase font-bold mb-1.5"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      Scramble
                    </p>
                    <p className="font-mono text-sm md:text-base text-white/90 leading-relaxed break-words">
                      {scramble}
                    </p>
                  </div>

                  {/* Timer */}
                  <div className="px-6 py-8 md:py-10 text-center">
                    <div
                      className="font-mono font-bold tabular-nums leading-none"
                      style={{
                        fontSize: "clamp(2.5rem, 9vw, 5.5rem)",
                        color: penalty === "DNF" ? "#ef4444" : "#ffffff",
                        letterSpacing: "-0.03em",
                        textShadow: isRunning
                          ? "0 0 30px rgba(34, 197, 94, 0.3)"
                          : inspection
                            ? "0 0 30px rgba(251, 191, 36, 0.3)"
                            : "none",
                      }}
                    >
                      {inspection
                        ? `00:${String(inspectionLeft).padStart(2, "0")}`
                        : formatTime(elapsed)}
                      {penalty === "+2" && (
                        <span className="text-red-400 text-2xl ml-2">+2</span>
                      )}
                      {penalty === "DNF" && (
                        <span className="text-red-400 text-2xl ml-2">DNF</span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="p-4 md:p-5 grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        if (isRunning) stopTimer();
                        else if (elapsed > 0) startTimer();
                        else {
                          setInspection(true);
                          setInspectionLeft(15);
                        }
                      }}
                      className="py-4 rounded-md font-bold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98]"
                      style={{
                        background: isRunning
                          ? "rgba(234, 179, 8, 0.15)"
                          : elapsed > 0
                            ? "rgba(59, 130, 246, 0.15)"
                            : "linear-gradient(135deg, #22c55e, #16a34a)",
                        color: isRunning
                          ? "#eab308"
                          : elapsed > 0
                            ? "#60a5fa"
                            : "#fff",
                        border: isRunning
                          ? "1px solid rgba(234, 179, 8, 0.4)"
                          : elapsed > 0
                            ? "1px solid rgba(59, 130, 246, 0.4)"
                            : "1px solid rgba(34, 197, 94, 0.5)",
                      }}
                    >
                      {isRunning
                        ? "■ Stop"
                        : inspection
                          ? "⏳ Inspecting"
                          : elapsed > 0
                            ? "▶ Solve Again"
                            : "▶ Start (Space)"}
                    </button>
                    <button
                      onClick={() => setScramble(generateScramble())}
                      disabled={isRunning || inspection}
                      className="py-4 rounded-md font-bold text-sm tracking-widest uppercase transition-all duration-150 active:scale-[0.98] disabled:opacity-30"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                        color: "#fff",
                        border: "1px solid rgba(59, 130, 246, 0.5)",
                      }}
                    >
                      ⟳ New Scramble
                    </button>
                    <button
                      onClick={handleReset}
                      className="col-span-2 py-3 rounded-md font-semibold text-xs tracking-widest uppercase"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        color: "rgba(255,255,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      ↺ Reset All
                    </button>
                  </div>

                  {/* Penalty buttons */}
                  <div
                    className="px-4 py-3 grid grid-cols-2 gap-2"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <button
                      onClick={() =>
                        setPenalty((p) => (p === "+2" ? null : "+2"))
                      }
                      className="py-2 rounded text-[11px] font-bold tracking-wider uppercase"
                      style={{
                        background:
                          penalty === "+2"
                            ? "rgba(239,68,68,0.2)"
                            : "rgba(255,255,255,0.03)",
                        color:
                          penalty === "+2"
                            ? "#ef4444"
                            : "rgba(255,255,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      +2 Penalty
                    </button>
                    <button
                      onClick={() =>
                        setPenalty((p) => (p === "DNF" ? null : "DNF"))
                      }
                      className="py-2 rounded text-[11px] font-bold tracking-wider uppercase"
                      style={{
                        background:
                          penalty === "DNF"
                            ? "rgba(239,68,68,0.2)"
                            : "rgba(255,255,255,0.03)",
                        color:
                          penalty === "DNF"
                            ? "#ef4444"
                            : "rgba(255,255,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      DNF
                    </button>
                  </div>

                  {/* Hints */}
                  <div
                    className="px-4 py-3 flex items-center justify-between flex-wrap gap-2 text-[10px]"
                    style={{
                      background: "rgba(0,0,0,0.25)",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.4)",
                    }}
                  >
                    <div className="flex items-center gap-3 flex-wrap">
                      {[
                        ["Space", "Start/Stop"],
                        ["Enter", "Start"],
                        ["2", "+2"],
                        ["D", "DNF"],
                        ["R", "Reset"],
                        ["F", "Fullscreen"],
                      ].map(([k, label]) => (
                        <span key={k}>
                          <kbd
                            className="px-1.5 py-0.5 rounded"
                            style={{
                              background: "rgba(255,255,255,0.08)",
                              color: "rgba(255,255,255,0.7)",
                              fontFamily: "monospace",
                            }}
                          >
                            {k}
                          </kbd>{" "}
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: solves list */}
              <div className="lg:col-span-5">
                <div
                  className="rounded-lg overflow-hidden h-full flex flex-col"
                  style={{
                    background:
                      "linear-gradient(180deg, #14171c 0%, #0f1216 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                    maxHeight: "calc(100vh - 200px)",
                    minHeight: "420px",
                  }}
                >
                  <div
                    className="px-4 py-3 flex items-center justify-between flex-shrink-0"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span
                      className="text-[10px] tracking-[0.2em] uppercase font-bold"
                      style={{ color: "rgba(255,255,255,0.5)" }}
                    >
                      Solves ({solves.length})
                    </span>
                  </div>

                  {/* Stats */}
                  <div
                    className="grid grid-cols-3 gap-2 px-4 py-3 flex-shrink-0"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {[
                      ["Best", best],
                      ["Mean", mean],
                      ["Worst", worst],
                    ].map(([label, val]) => (
                      <div key={label} className="text-center">
                        <p
                          className="text-[9px] tracking-[0.2em] uppercase font-bold"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          {label}
                        </p>
                        <p className="text-xs font-bold font-mono tabular-nums text-white mt-0.5">
                          {val ? formatTime(val) : "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div
                    className="grid grid-cols-2 gap-2 px-4 py-2.5 flex-shrink-0"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {[
                      ["Ao5", ao5],
                      ["Ao12", ao12],
                    ].map(([label, val]) => (
                      <div key={label} className="text-center">
                        <p
                          className="text-[9px] tracking-[0.2em] uppercase font-bold"
                          style={{ color: "rgba(255,255,255,0.35)" }}
                        >
                          {label}
                        </p>
                        <p
                          className="text-xs font-bold font-mono tabular-nums mt-0.5"
                          style={{
                            color: val ? "#fbbf24" : "rgba(255,255,255,0.3)",
                          }}
                        >
                          {val ? formatTime(val) : "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* List */}
                  <div
                    ref={solveListRef}
                    className="overflow-y-auto no-scrollbar flex-1"
                  >
                    {solves.length === 0 && (
                      <div
                        className="px-4 py-8 text-center text-xs"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        Press{" "}
                        <strong style={{ color: "#60a5fa" }}>Space</strong> to
                        start inspection, then solve. Your times will appear
                        here.
                      </div>
                    )}
                    {[...solves].reverse().map((s, idx) => {
                      const i = solves.length - idx;
                      return (
                        <div
                          key={s.id}
                          className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center text-[13px] border-b"
                          style={{
                            borderColor: "rgba(255,255,255,0.04)",
                            background:
                              i === solves.length
                                ? "rgba(59, 130, 246, 0.06)"
                                : "transparent",
                          }}
                        >
                          <div
                            className="col-span-1 font-bold tabular-nums"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                          >
                            {i}
                          </div>
                          <div className="col-span-8 text-white/70 text-[11px] font-mono truncate">
                            {s.scramble}
                          </div>
                          <div
                            className="col-span-3 text-right font-mono tabular-nums font-bold"
                            style={{
                              color:
                                s.time === best
                                  ? "#22c55e"
                                  : s.penalty === "+2"
                                    ? "#fbbf24"
                                    : "rgba(255,255,255,0.9)",
                            }}
                          >
                            {formatTime(s.time)}
                            {s.penalty === "+2" && (
                              <span className="text-[9px] ml-1 text-amber-400">
                                +2
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* SEO SECTION */}
            <div
              className="mt-12 md:mt-16 rounded-lg p-6 md:p-10"
              style={{
                background: "linear-gradient(180deg, #14171c 0%, #0f1216 100%)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="text-[10px] tracking-[0.3em] uppercase font-black px-3 py-1.5 rounded"
                  style={{
                    background: "rgba(251, 191, 36, 0.12)",
                    border: "1px solid rgba(251, 191, 36, 0.35)",
                    color: "#fbbf24",
                  }}
                >
                  Guide
                </span>
              </div>

              <h2 className="text-xl md:text-3xl font-bold tracking-tight text-white mb-6 max-w-3xl">
                Online Rubik's Cube Stopwatch with Milliseconds — Why It Helps
                You Improve
              </h2>

              <div
                className="space-y-4 text-sm md:text-[15px] leading-relaxed max-w-4xl"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                <p>
                  If you have ever used your phone's stopwatch to time a Rubik's
                  Cube solve, you probably know how limited it can feel. You
                  might see a time like 23.4 seconds, but you don't know whether
                  the actual solve was 23.41 or 23.49. That small difference may
                  not seem important at first, but when you're trying to improve
                  your speed, those extra milliseconds can tell you a lot about
                  your performance.
                </p>

                <p>
                  <span className="text-white font-bold">
                    Milliseconds give you a clearer picture.
                  </span>{" "}
                  A timer that only shows tenths of a second can hide small
                  differences between your solves. For example, two solves might
                  both appear as 9.8 seconds, even though one was 9.847 and the
                  other was 9.912. Seeing the exact time helps you understand
                  which solve was actually faster and can make it easier to
                  notice small improvements over time.
                </p>

                <p>
                  <span className="text-white font-bold">
                    Why we use requestAnimationFrame.
                  </span>{" "}
                  Many simple browser timers rely on setInterval to update the
                  display. Depending on what your computer or browser is doing,
                  those updates can sometimes become less consistent. This timer
                  uses requestAnimationFrame, which is designed to update
                  content along with the browser's screen refresh. This helps
                  keep the timer display smooth and responsive while you're
                  solving.
                </p>

                <p>
                  <span className="text-white font-bold">
                    Practice with 15-second inspection.
                  </span>{" "}
                  Inspection is an important part of speedcubing. Before
                  starting a solve, you normally have up to 15 seconds to look
                  at the cube and plan your first moves. Using an inspection
                  countdown during practice can help you get comfortable making
                  decisions within that limited time. You can use the inspection
                  period to plan your cross and think about your first pair
                  before starting the solve.
                </p>

                <p>
                  <span className="text-white font-bold">
                    Ao5 and Ao12 help you track consistency.
                  </span>{" "}
                  One very fast solve does not always mean that your overall
                  speed has improved. Looking at an average of several solves
                  gives you a better idea of how consistently you are
                  performing. Ao5 and Ao12 are useful ways to review a session
                  because they reduce the effect of one unusually fast or slow
                  solve. If your averages gradually improve, that is a useful
                  sign that your practice is paying off.
                </p>

                <p>
                  <span className="text-white font-bold">
                    Keyboard controls keep things simple.
                  </span>{" "}
                  When you're solving a cube, you don't want to keep reaching
                  for your mouse. That's why the timer is designed around
                  keyboard controls. Use Space to start or stop the timer, 2 to
                  add a +2 penalty, D to mark a solve as DNF, R to reset, and F
                  to enter fullscreen mode. Once you get used to the shortcuts,
                  you can focus more on solving and less on controlling the
                  timer.
                </p>

                <p>
                  <span className="text-white font-bold">
                    Keep your solves and scrambles together.
                  </span>{" "}
                  Each solve can be saved along with its scramble, making it
                  easier to look back at your previous sessions. The scramble is
                  generated for each new solve so you can practice with
                  different cube positions instead of repeatedly solving the
                  same pattern. Reviewing your times and scrambles can also help
                  you notice where you tend to make mistakes or lose time.
                </p>

                <p>
                  Whether you're currently around 30 seconds and trying to reach
                  25, or you're already working toward sub-10 solves, having a
                  precise and easy timer can make practice more useful. You
                  don't need to install an app or create an account. Open the
                  timer, start your inspection, solve the cube, and review your
                  results. Over time, those small improvements can add up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RubiksCubeStopwatch;
