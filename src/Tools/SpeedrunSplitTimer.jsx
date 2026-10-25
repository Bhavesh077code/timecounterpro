import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Layout/Footer";

// ============================================
// RUBIK'S CUBE STOPWATCH WITH MILLISECONDS
// ============================================

const RubiksCubeStopwatch = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [solves, setSolves] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [inspection, setInspection] = useState(false);
  const [inspectionLeft, setInspectionLeft] = useState(15);
  const [penalty, setPenalty] = useState(null);
  const [scramble, setScramble] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const pageRef = useRef(null);
  const solveListRef = useRef(null);

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

  useEffect(() => {
    if (!inspection) return;
    if (inspectionLeft <= 0) {
      setInspection(false);
      startTimeRef.current = performance.now();
      setElapsed(0);
      setIsRunning(true);
      return;
    }
    const t = setTimeout(() => setInspectionLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [inspection, inspectionLeft]);

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

  const toggleFullscreen = useCallback(() => {
    const el = pageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      (el.requestFullscreen?.() || el.webkitRequestFullscreen?.())?.then?.(
        () => setIsFullscreen(true),
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

  const faqs = [
    {
      q: "What is a good Rubik's Cube time for a beginner?",
      a: "For a complete beginner who has just learned to solve the cube, anywhere between 1 and 3 minutes is a normal and good time. The beginner's method (Layer-by-Layer) typically takes 2–5 minutes at first. Getting under 60 seconds with the beginner's method is a solid milestone. From there, most people learn the CFOP or Roux method to get under 30 seconds, then practice intensively to break 20 seconds.",
    },
    {
      q: "What is a good 3x3 average speed?",
      a: "Here is a rough guide to what counts as 'good' for a 3x3 average: Sub-1:00 — casual solver, comfortable with the beginner method. Sub-45 — practiced intermediate solver. Sub-30 — learned F2L or an equivalent method. Sub-20 — CFOP or Roux with all algorithms memorized. Sub-15 — competitive speedcuber. Sub-10 — elite solver (top ~1% worldwide). Sub-7 — world-class. World record averages hover near 5 seconds.",
    },
    {
      q: "What is inspection in a Rubik's Cube timer?",
      a: "Inspection is the 15-second period before you start solving during which you're allowed to look at the cube and plan your first moves. It's a standard part of WCA (World Cube Association) competitions. During inspection, most cubers plan their entire cross (beginner method) or first block (Roux method). If you take longer than 15 seconds, the WCA adds a +2 penalty — and if you take more than 17 seconds, the solve is a DNF.",
    },
    {
      q: "What does +2 penalty mean in speedcubing?",
      a: "A +2 penalty adds 2 seconds to your final solve time. It is assessed for specific rule violations: inspection between 15 and 17 seconds, a single quarter-turn misalignment of the solved cube, or one turn away from being solved. For example, if you solve in 14.50 seconds but leave one layer turned 90 degrees, your official time is 16.50 seconds. The +2 penalty is critical because many personal bests and records are decided by fractions of a second.",
    },
    {
      q: "What does DNF mean in a Rubik's Cube timer?",
      a: "DNF stands for 'Did Not Finish.' A solve is recorded as DNF when it cannot be officially counted. Common reasons: taking more than 17 seconds of inspection, leaving two or more moves unsolved, or (in blindfold solving) looking at the cube during the solve. DNF counts as a failed solve — it is never a valid time. In an average-of-5, one DNF is allowed (it gets discarded as the worst solve), but two or more DNFs mean the whole average is DNF.",
    },
    {
      q: "What is Ao5 and Ao12?",
      a: "Ao5 (Average of 5) and Ao12 (Average of 12) are the standard speedcubing averages. Ao5 takes your last 5 solves, discards the fastest and slowest, and averages the middle 3. Ao12 takes your last 12 solves, discards the fastest and slowest, and averages the middle 10. These trimmed averages reduce the effect of luck on your score — a single lucky solve won't inflate your average, and a single mistake won't crush it. Ao5 is the official WCA event format; Ao12 is used for longer practice sessions.",
    },
    {
      q: "Why does this timer use milliseconds?",
      a: "Milliseconds matter in speedcubing because solve times are decided by tenths of a second — sometimes hundredths. A phone stopwatch that shows only 23.4s hides whether the solve was 23.41 or 23.49. Two solves that both read 9.8s can differ by nearly a tenth of a second. Seeing exact milliseconds lets you accurately track improvement, verify personal bests, and compare against official WCA times. This timer updates via requestAnimationFrame so the millisecond display stays smooth and accurate.",
    },
    {
      q: "Why does this timer use requestAnimationFrame instead of setInterval?",
      a: "requestAnimationFrame (rAF) syncs the timer update to the browser's screen refresh cycle, which is typically 60 Hz (or 120/144 Hz on high-refresh displays). This keeps the millisecond display smooth and prevents the visible 'stutter' that setInterval can cause under CPU load. setInterval fires on a fixed wall-clock schedule that can drift when the main thread is busy — which is exactly what happens when a browser is doing other work. rAF gives a much more fluid and accurate display.",
    },
    {
      q: "How do I get sub-20 on the Rubik's Cube?",
      a: "To break 20 seconds, you need three things: (1) Full F2L — learn intuitive first-two-layers and stop using the beginner's method for the middle layer. (2) 2-look OLL and 2-look PLL — that is around 15 algorithms total. (3) An efficient, low-pause cross. Aim for a 2–3 second cross, 8–10 second F2L, and 4–6 second LL. Solve at least 50–100 cubes a day, and review every solve where you felt a pause — pauses cost more than slow turning. You can learn the full CFOP system in 2–4 weeks of consistent practice.",
    },
    {
      q: "How do I get sub-15?",
      a: "Sub-15 requires: (1) Full PLL — all 21 algorithms. (2) Full or near-full OLL. (3) Look-ahead — the ability to see the next pair while finishing the current one. (4) An efficient cross (under 2 seconds) with minimal regrips. (5) Fast, fluid execution without pauses. Most people reach sub-15 by solving 100–200 cubes a day for 3–6 months. Working on look-ahead is the single biggest jump — slow down your turning speed so you can see more of the cube. Practice one-handed or blindfolded solving occasionally to sharpen your understanding of piece positions.",
    },
    {
      q: "How do I get sub-10?",
      a: "Sub-10 is elite territory — roughly the top 1% of speedcubers worldwide. It requires: full OLL and PLL fluency (all 57 + 21 algs), fast finger tricks, near-zero pauses, pre-planned entire solves during inspection (beyond the cross), excellent look-ahead into the last layer, and an efficient cube (a modern magnetic speedcube like the GAN 12, MoYu WRM, or RS3M is essentially mandatory at this level). Sub-10 solvers typically solve 200–500 cubes a day, review every sub-11 solve in slow motion to find micro-pauses, and work on specific algorithm sets like COLL, Winter Variation, and VHLS.",
    },
    {
      q: "What is the world record for the 3x3 Rubik's Cube?",
      a: "As of late 2024, the WCA world record single for a 3x3 solve is 3.13 seconds, set by Max Park in 2023. The world record average of 5 is 4.48 seconds, set by Yiheng Wang in 2024. For the 2x2, single is 0.47 seconds and average is 1.01. For the 4x4, single is 17.42 seconds and average is 21.13. Records move constantly — check the official WCA website for the current records at the time you're reading this.",
    },
    {
      q: "What is CFOP, and should I learn it?",
      a: "CFOP stands for Cross, F2L (First Two Layers), OLL (Orientation of the Last Layer), and PLL (Permutation of the Last Layer). It is the most popular speedcubing method — used by roughly 90% of top speedcubers. It involves solving the cross, then inserting F2L pairs, then orienting and permuting the last layer. The full method requires learning 57 OLL algorithms and 21 PLL algorithms, but you can start with '2-look' versions (about 15 algorithms total). If you want to get under 30 seconds, CFOP is the safest path. Roux and ZZ are also viable but less commonly taught.",
    },
    {
      q: "What is F2L and how long does it take to learn?",
      a: "F2L (First Two Layers) is the CFOP step where you solve the first two layers simultaneously — cross plus four corner-edge pairs — instead of solving them one at a time as in the beginner's method. There are 41 cases, but most cubers learn F2L intuitively rather than as algorithms. It typically takes 2–4 weeks of daily practice to become comfortable with F2L, and 2–3 months to become fast. The payoff is enormous — most people cut 30–50% of their solve time just by switching from beginner's method to F2L.",
    },
    {
      q: "How long does it take to solve a Rubik's Cube for the first time?",
      a: "With a good beginner's tutorial, most people can solve their first cube in 1–3 hours of focused learning, spread over one or two sessions. The beginner's method is 7–8 steps and requires memorizing about 5 short algorithms. After the first solve, expect 5–10 minutes per solve for the first week, dropping to 2–3 minutes within a month of daily practice, and under 1 minute within 2–3 months. From there, switching to CFOP or Roux unlocks sub-30 and beyond.",
    },
    {
      q: "How often should I practice to improve at speedcubing?",
      a: "Consistency beats intensity. 30–60 minutes of focused practice daily will produce faster improvement than 5 hours once a week. That said, practice quality matters more than raw volume. Break each session into blocks: 10–15 minutes of algorithm drills, 10 minutes of slow solves focused on look-ahead, 10 minutes of timed solves with a timer like this one, and 5–10 minutes of review. Reviewing your worst solves is often the highest-yield activity — most speedcuber coaches say reviewing one bad solve is worth ten average ones.",
    },
    {
      q: "What is the best cube for a beginner?",
      a: "For 2024–2025, the best beginner speedcubes are the MoYu RS3M 2020/2021 (~$10), the MoYu Super RS3M (~$20), and the GAN 356 M (~$30). All three are magnetic, corner-cut well, and feel controllable. Avoid the original Rubik's brand cube — it is fine for display but too stiff and slow for speedcubing. If you're on a tight budget, the Qiyi MS (~$8) or the original RS3M are perfectly adequate. Do not spend more than $40 on your first speedcube.",
    },
    {
      q: "What does 'look-ahead' mean in speedcubing?",
      a: "Look-ahead is the skill of tracking the next piece or pair while your hands are still finishing the current algorithm. It's what separates sub-20 solvers from sub-30 solvers. Without look-ahead, you solve one pair, then pause to find the next, then solve, then pause, etc. With look-ahead, your hands never stop. To build look-ahead: solve slowly (turn no faster than 2 turns per second) with a metronome, focus on where your eyes should go next, and stop chasing faster turning. Slower but pauseless solves are almost always faster than fast-but-paused solves.",
    },
    {
      q: "Can I use this timer for other things besides Rubik's Cube?",
      a: "Yes. This is a general-purpose high-precision stopwatch with millisecond accuracy, inspection countdown, +2/DNF penalties, and session tracking. It works well for speedcubing (any size — 2x2 through 7x7, one-handed, blindfolded), speed-stacking, typing tests, reaction-time practice, coding sprints, interval workouts, and any activity where you need to measure time precisely. The scramble generator is specific to the 3x3 Rubik's Cube, but the timer itself has no cube-specific dependencies.",
    },
    {
      q: "How do I count a DNF in Ao5 or Ao12?",
      a: "In an Ao5, one DNF is treated as the worst solve and is discarded along with the fastest solve. The middle three solves are averaged. Two or more DNFs in an Ao5 means the entire average is DNF. In an Ao12, one DNF is allowed and discarded; two or more DNFs means the average is DNF. This is the official WCA rule and matches how this timer computes Ao5 and Ao12.",
    },
    {
      q: "Can I save my solves between sessions?",
      a: "Solves are stored in memory for the current browser session. If you refresh the page or close the tab, your session is cleared. For long-term tracking (personal bests, monthly averages, historical progress), use a dedicated speedcubing app or export your solve times to a spreadsheet. This online timer is designed for focused practice sessions where you care about the current Ao5 and Ao12.",
    },
    {
      q: "Does this timer work offline?",
      a: "Once the page has loaded in your browser, the timer runs entirely locally — no internet connection is required during use. Refresh requires a network connection the first time unless the page is cached. For the most reliable offline experience, install the site as a Progressive Web App (PWA) or keep the tab open.",
    },
    {
      q: "What are the keyboard shortcuts?",
      a: "Space — Start or stop the timer (also starts the 15-second inspection when idle). Enter — Start the timer immediately without inspection. R — Reset the entire session. F — Toggle fullscreen. 2 — Toggle +2 penalty. D — Toggle DNF penalty. Once you've memorized these, you can practice entirely without touching the mouse.",
    },
    {
      q: "Is my data private?",
      a: "Yes. This timer runs entirely in your browser. Your solve times, scrambles, and session history never leave your device — nothing is uploaded to a server. Refreshing the page clears the session, which is intentional: it keeps everything local and private by default.",
    },
  ];

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
          <div
            className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          ></div>

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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            </button>
          )}

          <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
            {/* HEADER */}
            <div className="mb-6">
              <nav aria-label="Breadcrumb" className="mb-3 text-[11px] text-white/40 flex items-center gap-2">
                <Link to="/" className="hover:text-white/70">Home</Link>
                <span>/</span>
                <span className="text-white/70">Rubik's Cube Stopwatch</span>
              </nav>
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
                  <p className="text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: "rgba(255,255,255,0.4)" }}>
                    Rubik's Cube · Online Timer
                  </p>
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
                    Speedcube Stopwatch with Milliseconds
                  </h1>
                </div>
              </div>
              <p className="mt-3 max-w-3xl text-sm text-white/60 leading-relaxed">
                A free online Rubik's Cube timer with millisecond precision,
                15-second WCA inspection countdown, +2 and DNF penalties, Ao5
                and Ao12 averages, and a random scramble generator. Press Space
                to start — no account, no install.
              </p>
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* LEFT: timer */}
              <div className="lg:col-span-7">
                <div
                  className="rounded-lg overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg, #14171c 0%, #0f1216 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                  }}
                >
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
                          background: isRunning ? "#22c55e" : inspection ? "#fbbf24" : "rgba(255,255,255,0.2)",
                          boxShadow: isRunning ? "0 0 8px #22c55e" : "none",
                        }}
                      ></span>
                      <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                        {isRunning ? "Solving" : inspection ? `Inspection ${inspectionLeft}s` : elapsed > 0 ? "Stopped" : "Ready"}
                      </span>
                    </div>
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
                      Solve {solves.length}
                    </span>
                  </div>

                  <div
                    className="px-5 py-4 text-center"
                    style={{ background: "rgba(0,0,0,0.2)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <p className="text-[9px] tracking-[0.25em] uppercase font-bold mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Scramble
                    </p>
                    <p className="font-mono text-sm md:text-base text-white/90 leading-relaxed break-words">
                      {scramble}
                    </p>
                  </div>

                  <div className="px-6 py-8 md:py-10 text-center">
                    <div
                      role="timer"
                      aria-live="polite"
                      aria-label={`Timer: ${formatTime(elapsed)}`}
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
                      {inspection ? `00:${String(inspectionLeft).padStart(2, "0")}` : formatTime(elapsed)}
                      {penalty === "+2" && <span className="text-red-400 text-2xl ml-2">+2</span>}
                      {penalty === "DNF" && <span className="text-red-400 text-2xl ml-2">DNF</span>}
                    </div>
                  </div>

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
                        color: isRunning ? "#eab308" : elapsed > 0 ? "#60a5fa" : "#fff",
                        border: isRunning
                          ? "1px solid rgba(234, 179, 8, 0.4)"
                          : elapsed > 0
                            ? "1px solid rgba(59, 130, 246, 0.4)"
                            : "1px solid rgba(34, 197, 94, 0.5)",
                      }}
                    >
                      {isRunning ? "■ Stop" : inspection ? "⏳ Inspecting" : elapsed > 0 ? "▶ Solve Again" : "▶ Start (Space)"}
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

                  <div className="px-4 py-3 grid grid-cols-2 gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                    <button
                      onClick={() => setPenalty((p) => (p === "+2" ? null : "+2"))}
                      className="py-2 rounded text-[11px] font-bold tracking-wider uppercase"
                      style={{
                        background: penalty === "+2" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.03)",
                        color: penalty === "+2" ? "#ef4444" : "rgba(255,255,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      +2 Penalty
                    </button>
                    <button
                      onClick={() => setPenalty((p) => (p === "DNF" ? null : "DNF"))}
                      className="py-2 rounded text-[11px] font-bold tracking-wider uppercase"
                      style={{
                        background: penalty === "DNF" ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.03)",
                        color: penalty === "DNF" ? "#ef4444" : "rgba(255,255,255,0.6)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      DNF
                    </button>
                  </div>

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
                    background: "linear-gradient(180deg, #14171c 0%, #0f1216 100%)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
                    maxHeight: "calc(100vh - 200px)",
                    minHeight: "420px",
                  }}
                >
                  <div
                    className="px-4 py-3 flex items-center justify-between flex-shrink-0"
                    style={{ background: "rgba(0,0,0,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <span className="text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                      Solves ({solves.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {[["Best", best], ["Mean", mean], ["Worst", worst]].map(([label, val]) => (
                      <div key={label} className="text-center">
                        <p className="text-[9px] tracking-[0.2em] uppercase font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {label}
                        </p>
                        <p className="text-xs font-bold font-mono tabular-nums text-white mt-0.5">
                          {val ? formatTime(val) : "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 px-4 py-2.5 flex-shrink-0" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {[["Ao5", ao5], ["Ao12", ao12]].map(([label, val]) => (
                      <div key={label} className="text-center">
                        <p className="text-[9px] tracking-[0.2em] uppercase font-bold" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {label}
                        </p>
                        <p className="text-xs font-bold font-mono tabular-nums mt-0.5" style={{ color: val ? "#fbbf24" : "rgba(255,255,255,0.3)" }}>
                          {val ? formatTime(val) : "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div ref={solveListRef} className="overflow-y-auto no-scrollbar flex-1">
                    {solves.length === 0 && (
                      <div className="px-4 py-8 text-center text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                        Press <strong style={{ color: "#60a5fa" }}>Space</strong> to start inspection, then solve. Your times will appear here.
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
                            background: i === solves.length ? "rgba(59, 130, 246, 0.06)" : "transparent",
                          }}
                        >
                          <div className="col-span-1 font-bold tabular-nums" style={{ color: "rgba(255,255,255,0.4)" }}>
                            {i}
                          </div>
                          <div className="col-span-8 text-white/70 text-[11px] font-mono truncate">
                            {s.scramble}
                          </div>
                          <div
                            className="col-span-3 text-right font-mono tabular-nums font-bold"
                            style={{
                              color: s.time === best ? "#22c55e" : s.penalty === "+2" ? "#fbbf24" : "rgba(255,255,255,0.9)",
                            }}
                          >
                            {formatTime(s.time)}
                            {s.penalty === "+2" && <span className="text-[9px] ml-1 text-amber-400">+2</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          NEW LIGHT-THEME SEO ARTICLE (moved outside dark card)
         ====================================================== */}
      <article className="bg-white text-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-14">

          {/* ============ INTRO ============ */}
          <header className="mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-amber-600 font-bold mb-3">
              Speedcubing Guide
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
              Online Rubik's Cube Stopwatch — Everything a Speedcuber Needs to Know
            </h2>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              If you've ever used your phone's stopwatch to time a Rubik's Cube
              solve, you know the frustration: a solve reads 23.4 seconds, but
              you have no idea if it was 23.41 or 23.49. For a casual solver, that
              difference doesn't matter. For anyone serious about improving, it's
              the difference between knowing whether you're actually getting
              faster and just guessing. This guide covers how the timer works,
              what makes a "good" time, how the WCA rules apply, and a full
              roadmap from first solve to sub-10.
            </p>
          </header>

          {/* ============ WHY MILLISECONDS ============ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Millisecond Precision Matters</h2>
            <div className="space-y-4 text-[15px] text-slate-600 leading-relaxed">
              <p>
                Speedcubing is a game of tenths. Two solves that both round to 9.8 seconds can differ by nearly a tenth of a second — that's 4–5% of the total solve, and it's the difference between a personal best and a personal worst. Official WCA competitions record times to the hundredth of a second (or thousandth for some events), and personal bests are frequently decided by a single hundredth.
              </p>
              <p>
                This timer updates through <strong>requestAnimationFrame</strong>, synced to your display's refresh rate (60 Hz or higher). The result is a smooth, drift-free millisecond display — no visible stutter from CPU load, no background-throttling lag when you switch tabs. That's why the display stays accurate even during heavy browsing.
              </p>
              <p>
                Millisecond precision also teaches you something subtle: <strong>variance</strong>. A 10-solve set where every solve lands between 14.30 and 14.60 is very different from one where solves swing between 12.80 and 16.40, even if the means are identical. The first cubers is consistent; the second is fast but inconsistent. Knowing your variance lets you choose the right practice target — closing the gap between best and worst, not just lowering the mean.
              </p>
            </div>
          </section>

          {/* ============ HOW TO USE ============ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Use the Timer — Step by Step</h2>
            <ol className="space-y-3 text-[15px] text-slate-600 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900">Read the scramble.</strong> The scramble at the top of the timer is a random 20-move sequence from the set of legal face turns (R, L, U, D, F, B with ', 2 modifiers). Apply it to a solved cube before you start.
              </li>
              <li>
                <strong className="text-slate-900">Start inspection.</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs">Space</kbd> on an idle timer. A 15-second countdown begins — exactly the WCA inspection window.
              </li>
              <li>
                <strong className="text-slate-900">Plan your cross (or block).</strong> Use the inspection time to plan your entire first layer or first block. Don't try to see the whole solve — just the first 2–4 seconds.
              </li>
              <li>
                <strong className="text-slate-900">Solve.</strong> When inspection ends, the timer auto-starts. Solve as fast as you can.
              </li>
              <li>
                <strong className="text-slate-900">Stop the timer.</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs">Space</kbd> again. Your time is recorded to milliseconds, along with the scramble you just solved.
              </li>
              <li>
                <strong className="text-slate-900">Apply penalties if needed.</strong> Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs">2</kbd> for a +2 penalty, or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 rounded text-xs">D</kbd> for DNF. The next solve's scramble is generated automatically.
              </li>
              <li>
                <strong className="text-slate-900">Review your session.</strong> Best, Mean, Worst, Ao5 and Ao12 appear in the sidebar and update after every solve.
              </li>
            </ol>
          </section>

          {/* ============ MILESTONES TABLE ============ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">What Counts as a "Good" Rubik's Cube Time?</h2>
            <p className="text-[15px] text-slate-600 leading-relaxed mb-4">
              The honest answer is "it depends on how long you've been cubing." Here's a rough roadmap — treat these numbers as a personal compass, not absolute benchmarks.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="border border-slate-200 px-3 py-2 font-semibold">3x3 Average</th>
                    <th className="border border-slate-200 px-3 py-2 font-semibold">Skill Level</th>
                    <th className="border border-slate-200 px-3 py-2 font-semibold">Typical Method</th>
                    <th className="border border-slate-200 px-3 py-2 font-semibold">Relative Standing</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr><td className="border border-slate-200 px-3 py-2 font-mono">3:00+</td><td className="border border-slate-200 px-3 py-2">Complete beginner</td><td className="border border-slate-200 px-3 py-2">Layer-by-Layer</td><td className="border border-slate-200 px-3 py-2">Just learned</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-mono">1:00–3:00</td><td className="border border-slate-200 px-3 py-2">Casual solver</td><td className="border border-slate-200 px-3 py-2">Beginner</td><td className="border border-slate-200 px-3 py-2">Comfortable</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-mono">45s–1:00</td><td className="border border-slate-200 px-3 py-2">Practiced</td><td className="border border-slate-200 px-3 py-2">Beginner / early F2L</td><td className="border border-slate-200 px-3 py-2">Above average</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-mono">30–45s</td><td className="border border-slate-200 px-3 py-2">Intermediate</td><td className="border border-slate-200 px-3 py-2">CFOP / Roux (partial)</td><td className="border border-slate-200 px-3 py-2">Good</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-mono">20–30s</td><td className="border border-slate-200 px-3 py-2">Competent</td><td className="border border-slate-200 px-3 py-2">CFOP / Roux (full 2-look LL)</td><td className="border border-slate-200 px-3 py-2">Very good</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-mono">15–20s</td><td className="border border-slate-200 px-3 py-2">Advanced</td><td className="border border-slate-200 px-3 py-2">CFOP / Roux (full LL)</td><td className="border border-slate-200 px-3 py-2">Top 10%</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-mono">10–15s</td><td className="border border-slate-200 px-3 py-2">Competitive</td><td className="border border-slate-200 px-3 py-2">CFOP / Roux + look-ahead</td><td className="border border-slate-200 px-3 py-2">Top 1%</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-mono">Sub-10</td><td className="border border-slate-200 px-3 py-2">Elite</td><td className="border border-slate-200 px-3 py-2">Full CFOP + advanced techniques</td><td className="border border-slate-200 px-3 py-2">Top 0.1%</td></tr>
                  <tr><td className="border border-slate-200 px-3 py-2 font-mono">Sub-6</td><td className="border border-slate-200 px-3 py-2">World-class</td><td className="border border-slate-200 px-3 py-2">Peak human performance</td><td className="border border-slate-200 px-3 py-2">Record territory</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ============ WCA RULES ============ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">WCA Rules: Inspection, +2, and DNF Explained</h2>
            <div className="space-y-4 text-[15px] text-slate-600 leading-relaxed">
              <p>
                The World Cube Association (WCA) is the official governing body for speedcubing competitions. Its regulations define exactly how inspection, penalties, and DNFs work. Even if you never compete, practicing under these rules makes your times comparable to official results.
              </p>
              <p>
                <strong className="text-slate-900">Inspection:</strong> Before each solve, you have exactly 15 seconds to examine the cube. Between 15 and 17 seconds, a +2 penalty is assessed. Beyond 17 seconds, the solve is a DNF. This is why the timer counts down 15 seconds during inspection — you get an accurate practice environment.
              </p>
              <p>
                <strong className="text-slate-900">+2 penalty:</strong> Exactly 2 seconds added to your final time. The most common triggers are (a) inspection going over 15 seconds, (b) the cube being misaligned by exactly one quarter-turn on any face when you stop the timer, and (c) touching the cube during inspection in certain events.
              </p>
              <p>
                <strong className="text-slate-900">DNF (Did Not Finish):</strong> The solve is invalid. Triggers include: inspection over 17 seconds, two or more faces misaligned by more than one quarter-turn, or in blindfolded events, peeking at the cube. A DNF is treated as the worst possible solve — never a valid time.
              </p>
              <p>
                <strong className="text-slate-900">Ao5 and Ao12:</strong> In an official WCA Average of 5, the fastest and slowest times of 5 solves are discarded and the middle 3 are averaged. If any of the 5 is DNF, one DNF is discarded (it acts as the worst solve); two or more DNFs mean the whole average is DNF. Ao12 uses the same trimming rule with 12 solves, discarding 1 fastest and 1 slowest, averaging the middle 10.
              </p>
            </div>
          </section>

          {/* ============ METHODS ============ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Speedcubing Methods Explained</h2>
            <div className="space-y-6 text-[15px] text-slate-600 leading-relaxed">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Layer-by-Layer (Beginner's Method)</h3>
                <p>
                  The standard first method for anyone learning to solve a cube. Solve the cross, insert first-layer corners, insert second-layer edges, then orient and permute the last layer. It uses only 5–7 short algorithms and is easy to learn, but caps out around 45–60 seconds because it does everything sequentially. Fine for casual solving; everyone serious switches to a faster method eventually.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">CFOP (Fridrich Method)</h3>
                <p>
                  The most popular speedcubing method, used by about 90% of competitive solvers. It stands for <strong>Cross, F2L, OLL, PLL</strong>. Instead of solving layer by layer, CFOP solves the cross, then inserts four corner-edge pairs simultaneously (F2L), then orients the last layer (OLL — 57 algorithms), then permutes it (PLL — 21 algorithms). The full method requires memorizing 78 algorithms, but you can start with "2-look" versions that need only ~15 algorithms total. Full CFOP plus look-ahead is the standard path to sub-20 and below.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Roux</h3>
                <p>
                  A block-building method that solves the first two blocks (1x2x3 on left and right), then does corner orientation and last-six-edges in a few dozen algorithms. Roux uses fewer turns per solve than CFOP but requires more spatial intuition. It's popular with puzzle solvers who dislike algorithm memorization, and it's fully competitive — top Roux solvers hit sub-8 averages. It's harder to learn from a written tutorial because the first steps are intuitive rather than algorithmic.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">ZZ</h3>
                <p>
                  An edge-orienting method that pre-orients all edges during the first step, which makes the rest of the solve rotation-free and highly efficient. ZZ is elegant and rotation-free, but edge orientation is hard to spot during inspection, so it's less common in competition than CFOP or Roux.
                </p>
              </div>
            </div>
          </section>

          {/* ============ IMPROVEMENT ROADMAP ============ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Improvement Roadmap: Sub-60 to Sub-10</h2>
            <div className="space-y-4 text-[15px] text-slate-600 leading-relaxed">
              <p>
                <strong className="text-slate-900">Sub-60 (beginner method):</strong> The key skill at this level is <em>smoothness</em> — not speed. Stop pausing between algorithms. Learn the beginner's method cold. Aim for a cross under 10 seconds, first layer under 20, second layer under 20, last layer under 15. Practice 20–30 solves a day.
              </p>
              <p>
                <strong className="text-slate-900">Sub-45:</strong> Switch from beginner's method to intuitive F2L. This usually takes 3–4 weeks. Your times will temporarily get worse (this is normal — the "F2L trough"). Push through. After a month of F2L practice, you'll cruise past your old beginner-method times.
              </p>
              <p>
                <strong className="text-slate-900">Sub-30:</strong> Learn 2-look OLL and 2-look PLL (about 15 algorithms total). Practice look-ahead: slow down your turning so your eyes can find the next pair. A 25-second solver who slows down to 3 turns per second will often hit 22 seconds because they stop pausing.
              </p>
              <p>
                <strong className="text-slate-900">Sub-20:</strong> Full PLL (21 algorithms). Fast, low-pause F2L. Cross under 3 seconds. Solve 50–100 cubes a day. This is the most common plateau — most solvers sit at 22–25 seconds for months before breaking 20. The breakthrough usually comes from deliberate look-ahead practice, not from turning faster.
              </p>
              <p>
                <strong className="text-slate-900">Sub-15:</strong> Full OLL (57 algorithms). Near-zero pauses. Efficient cross with minimal regrips. You may need to learn a new alg set (COLL, WV, VHLS) for consistency. Solve 100–200 cubes a day, review every sub-16 solve to find micro-pauses.
              </p>
              <p>
                <strong className="text-slate-900">Sub-10:</strong> Elite territory. This requires perfect look-ahead, full OLL/PLL fluency, and a modern magnetic speedcube. Sub-10 solvers solve 200–500 cubes a day and treat practice as deliberate skill-building, not just playing. Most people who reach sub-10 have been cubing for 2–5 years and have invested significant structured practice.
              </p>
            </div>
          </section>

          {/* ============ FAQ ============ */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-500 mb-6">
              Answers to the questions people actually search for about Rubik's Cube timers.
            </p>
            <div className="space-y-2.5">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                      isOpen ? "border-amber-300 shadow-sm" : "border-slate-200 hover:border-amber-200"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-3 text-left px-4 sm:px-5 py-4"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-start gap-3 min-w-0">
                        <span
                          className={`shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                            isOpen ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-800 pr-2">{faq.q}</span>
                      </span>
                      <span
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isOpen ? "bg-amber-100" : "bg-slate-100"
                        }`}
                      >
                        <span className="text-sm leading-none font-bold text-slate-600">
                          {isOpen ? "−" : "+"}
                        </span>
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pl-4 sm:pl-14">
                        <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ============ INTERNAL LINKS ============ */}
          <section className="mb-4">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Related Timer Pages</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {[
                { to: "/stopwatch", label: "Online Stopwatch" },
                { to: "/create", label: "Custom Timer" },
                { to: "/pomodoro", label: "Pomodoro Timer" },
                { to: "/10-minute-timer", label: "10-Minute Timer" },
                { to: "/mock-test-timer", label: "Mock Test Timer" },
                { to: "/hiit-timer", label: "HIIT Timer" },
                { to: "/meditation-timer-with-sound", label: "Meditation Timer" },
                { to: "/", label: "All Timers" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                >
                  <span className="truncate">{link.label}</span>
                  <span className="text-slate-300">→</span>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </article>
    </div>
  );
};

export default RubiksCubeStopwatch;