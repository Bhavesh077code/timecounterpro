import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Layout/Footer";

const Animation = () => {
  const SESSION_SECONDS = 10 * 60;

  const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState("seed");
  const [showGiveUpModal, setShowGiveUpModal] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [withering, setWithering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const audioRef = useRef(null);
  const timerRef = useRef(null);
  const heroRef = useRef(null);

  const elapsed = SESSION_SECONDS - timeLeft;
  const progress = Math.min(1, Math.max(0, elapsed / SESSION_SECONDS));

  /* =========================================================
     🖥️ FULLSCREEN
     ========================================================= */
  const toggleFullscreen = () => {
    const el = heroRef.current || document.documentElement;
    if (!document.fullscreenElement) {
      (
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.msRequestFullscreen
      )?.call(el);
    } else {
      (
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen
      )?.call(document);
    }
  };

  useEffect(() => {
    const handler = () =>
      setIsFullscreen(
        !!(document.fullscreenElement || document.webkitFullscreenElement)
      );
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  /* -----------------------------------------
     Timer
  ----------------------------------------- */
  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          setStage("tree");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (stage === "dead") return;
    if (progress === 0) setStage("seed");
    else setStage("tree");
  }, [progress, stage]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [musicOn]);

  useEffect(() => {
    const handler = (e) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue = "If you leave now, your tree will wither and die! 🌱💔";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isRunning]);

  /* -----------------------------------------
     Handlers
  ----------------------------------------- */
  const handleStart = () => {
    if (stage === "dead") {
      setStage("seed");
      setTimeLeft(SESSION_SECONDS);
    }
    setIsRunning(true);
  };
  const handlePause = () => setIsRunning(false);
  const handleGiveUpClick = () => {
    if (!isRunning && elapsed === 0) return;
    setIsRunning(false);
    setShowGiveUpModal(true);
  };
  const confirmGiveUp = () => {
    setShowGiveUpModal(false);
    setWithering(true);
    setTimeout(() => {
      setStage("dead");
      setWithering(false);
    }, 1600);
  };
  const cancelGiveUp = () => {
    setShowGiveUpModal(false);
    if (timeLeft > 0 && stage !== "dead") setIsRunning(true);
  };
  const handleReset = () => {
    setIsRunning(false);
    setStage("seed");
    setTimeLeft(SESSION_SECONDS);
  };

  const formatTime = useCallback((s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }, []);

  return (
    <div className="w-full bg-[#020c07] text-emerald-50">
      {/* =========================================================
          🧭 NAVBAR
         ========================================================= */}
      <Navbar />

      {/* =========================================================
          🌲 HERO — MYSTICAL FOREST TIMER
         ========================================================= */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden"
      >
        {/* ============ MYSTICAL FOREST BACKGROUND ============ */}
        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, #0f3520 0%, #08210f 30%, #041008 65%, #010604 100%)",
          }}
        />

        <svg
          className="pointer-events-none absolute inset-0 h-full w-full z-0"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          style={{ filter: "blur(3px)" }}
        >
          <g opacity="0.55" fill="#021a0d">
            {[...Array(20)].map((_, i) => {
              const x = (i / 20) * 1300 - 50;
              const w = 60 + (i % 4) * 30;
              const h = 400 + (i % 5) * 90;
              return (
                <path
                  key={`t1-${i}`}
                  d={`M${x} 800 L${x + w / 2} ${800 - h} L${x + w} 800 Z`}
                />
              );
            })}
          </g>
          <g opacity="0.75" fill="#031408">
            {[...Array(12)].map((_, i) => {
              const x = (i / 12) * 1300 - 100;
              const w = 90 + (i % 3) * 40;
              const h = 550 + (i % 4) * 80;
              return (
                <path
                  key={`t2-${i}`}
                  d={`M${x} 800 L${x + w / 2} ${800 - h} L${x + w} 800 Z`}
                />
              );
            })}
          </g>
        </svg>

        <div
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(16,80,40,.35) 0%, rgba(4,20,10,.7) 40%, rgba(1,6,3,1) 85%)",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.09] z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(52,211,153,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,.5) 1px, transparent 1px)",
            backgroundSize: "52px 52px",
          }}
        />

        <div
          className="pointer-events-none absolute z-0"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 720,
            height: 720,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(74,222,128,.35) 0%, rgba(34,197,94,.18) 25%, rgba(16,185,129,.05) 55%, transparent 75%)",
            filter: "blur(50px)",
          }}
        />

        {[...Array(22)].map((_, i) => (
          <span
            key={`bgff-${i}`}
            className="pointer-events-none absolute rounded-full z-0"
            style={{
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              background: "#a7f3d0",
              boxShadow: "0 0 8px #34d399, 0 0 16px #34d399",
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animation: `firefly ${4 + (i % 4)}s ease-in-out infinite`,
              animationDelay: `${(i % 5) * 0.6}s`,
              opacity: 0.35 + (i % 3) * 0.2,
            }}
          />
        ))}

        {/* ============ TOP BAR ============ */}
        <div className="absolute top-5 left-0 right-0 flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-2 text-emerald-300/90 text-xs tracking-[0.3em] uppercase">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
            Focus Forest
          </div>
          <button
            onClick={() => setMusicOn((m) => !m)}
            className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-900/30 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-emerald-200 backdrop-blur hover:bg-emerald-800/40 transition"
          >
            {musicOn ? "🔊 Lo-Fi On" : "🔈 Lo-Fi Off"}
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative h-[360px] w-[360px] sm:h-[420px] sm:w-[420px] flex items-center justify-center">
            {/* HUGE GLOWING NEON RING */}
            <svg
              viewBox="0 0 400 400"
              className="absolute inset-0 h-full w-full"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="ringCore" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#bbf7d0" />
                  <stop offset="40%" stopColor="#4ade80" />
                  <stop offset="70%" stopColor="#a3e635" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <radialGradient id="ringHalo" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stopColor="rgba(74,222,128,0)" />
                  <stop offset="78%" stopColor="rgba(74,222,128,.45)" />
                  <stop offset="88%" stopColor="rgba(134,239,172,.65)" />
                  <stop offset="100%" stopColor="rgba(74,222,128,0)" />
                </radialGradient>
                <filter
                  id="ringGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="8" result="blur1" />
                  <feGaussianBlur stdDeviation="20" result="blur2" />
                  <feGaussianBlur stdDeviation="40" result="blur3" />
                  <feMerge>
                    <feMergeNode in="blur3" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <circle
                cx="200"
                cy="200"
                r="180"
                fill="url(#ringHalo)"
                opacity="0.9"
              />

              <g filter="url(#ringGlow)">
                <circle
                  cx="200"
                  cy="200"
                  r="150"
                  fill="none"
                  stroke="url(#ringCore)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  opacity="0.95"
                />
              </g>

              <circle
                cx="200"
                cy="200"
                r="150"
                fill="none"
                stroke="#e7ffd0"
                strokeWidth="2"
                opacity="0.9"
              />
            </svg>

            {/* TREE + TIME */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <PlantVisual
                stage={stage}
                withering={withering}
                progress={progress}
              />
              <div className="mt-1 text-4xl sm:text-5xl font-light tabular-nums text-emerald-50 tracking-[0.15em] drop-shadow-[0_0_20px_rgba(52,211,153,.7)]">
                {formatTime(timeLeft)}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.4em] text-emerald-400/80">
                {isRunning
                  ? "growing"
                  : stage === "dead"
                    ? "withered"
                    : "paused"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-emerald-300/70 text-xs tracking-[0.2em]">
            <span className="h-1.5 w-40 rounded-full bg-emerald-900/60 overflow-hidden">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-300 transition-all duration-700 shadow-[0_0_10px_rgba(163,230,53,.7)]"
                style={{ width: `${progress * 100}%` }}
              />
            </span>
            {Math.round(progress * 100)}%
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                disabled={stage === "dead"}
                className="rounded-full bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400 px-9 py-3.5 font-medium text-emerald-950 shadow-[0_0_30px_rgba(52,211,153,.5)] transition hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {elapsed === 0 ? "🌱 Plant a Seed" : "▶ Resume Growth"}
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="rounded-full border border-emerald-400/30 bg-emerald-900/40 px-9 py-3.5 font-medium text-emerald-100 backdrop-blur transition hover:bg-emerald-800/50 active:scale-95"
              >
                ⏸ Pause
              </button>
            )}

            <button
              onClick={handleGiveUpClick}
              className="rounded-full border border-rose-400/20 bg-rose-950/30 px-6 py-3.5 text-sm font-medium text-rose-200/80 backdrop-blur transition hover:bg-rose-900/40 active:scale-95"
            >
              🥀 Give Up
            </button>

            {stage === "dead" && (
              <button
                onClick={handleReset}
                className="rounded-full border border-emerald-400/30 px-6 py-3.5 text-sm text-emerald-200 transition hover:bg-emerald-900/40"
              >
                ↻ New Seed
              </button>
            )}
          </div>

          {/* 🖥️ FULLSCREEN BUTTON — BELOW CONTROLS */}
          <div className="flex items-center justify-center">
            <button
              onClick={toggleFullscreen}
              className="group flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-950/40 px-5 py-2.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-emerald-200 backdrop-blur hover:bg-emerald-900/60 hover:border-emerald-300 transition"
            >
              {isFullscreen ? (
                <>
                  <span className="text-emerald-300">⤡</span>
                  EXIT FULLSCREEN
                </>
              ) : (
                <>
                  <span className="text-emerald-300">⤢</span>
                  ENTER FULLSCREEN
                </>
              )}
            </button>
          </div>
        </div>

        {showGiveUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_.3s_ease]">
            <div className="w-[90%] max-w-md rounded-3xl border border-rose-400/20 bg-gradient-to-b from-[#1a1214] to-[#0f0a0b] p-8 text-center shadow-2xl">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-4xl">
                🥀
              </div>
              <h3 className="mb-2 text-xl font-semibold text-rose-100">
                Don't leave now…
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-rose-200/70">
                If you leave now, your tree will{" "}
                <span className="font-semibold text-rose-300">
                  wither and die
                </span>
                . All that growth will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={cancelGiveUp}
                  className="flex-1 rounded-full bg-gradient-to-r from-emerald-400 to-lime-400 py-3 font-medium text-emerald-950 transition hover:scale-105 active:scale-95"
                >
                  Keep Growing 🌿
                </button>
                <button
                  onClick={confirmGiveUp}
                  className="flex-1 rounded-full border border-rose-400/30 py-3 text-sm text-rose-200 transition hover:bg-rose-900/30"
                >
                  Give Up
                </button>
              </div>
            </div>
          </div>
        )}

        <audio ref={audioRef} loop preload="none">
          <source src="/sounds/animation.mp3" type="audio/mpeg" />
        </audio>
      </section>

      {/* =========================================================
          📖 ABOUT SECTION
         ========================================================= */}
      <section className="bg-white text-neutral-800 px-6 sm:px-10 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.4em] text-emerald-600 font-semibold mb-4">
            About This Timer
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-900 leading-tight mb-8">
            A Focus Timer That Grows With You — Literally.
          </h2>
          <p className="text-base sm:text-lg leading-relaxed text-neutral-700 mb-5">
            We all know the feeling. You sit down to work, promising yourself
            twenty-five focused minutes, and ten seconds later your phone buzzes,
            a notification slides in, and suddenly you're three tabs deep into
            something you didn't even mean to open. Focus isn't hard because we
            lack discipline — it's hard because nothing is at stake. That's the
            simple idea behind Focus Forest: we give you something to lose.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-neutral-700 mb-5">
            Every session begins the same way. A tiny seed sits in a clay pot,
            small and quiet, waiting for you to begin. The moment you tap{" "}
            <em>Plant a Seed</em>, the clock starts ticking and a gentle circle
            of light begins its slow journey around the edge of the screen.
            Nothing dramatic. Nothing demanding. Just a seed, a countdown, and
            the promise that if you stay, something beautiful will happen.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-neutral-700 mb-5">
            And then something quietly magical happens. A green stem pushes
            through the soil and rises up out of the pot, growing taller with
            every passing minute. Leaves begin to sprout one by one along the
            branches — a tiny bud near the trunk opens first, then another, then
            a small cluster at the top. As the timer counts down, more and more
            leaves quietly unfurl, and glowing fruit begins to appear at the
            tips. By the time you reach the final stretch, the tree is full,
            lush, and glowing with soft particles drifting up around it like
            tiny fireflies celebrating your focus.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-neutral-700 mb-5">
            The entire animation is built with lightweight SVG and smooth CSS
            transitions, so every leaf pops into place with a gentle scale and
            fade — never jarring, never noisy, just calm, organic growth. The
            tree sways softly. The glow breathes. Nothing fights for your
            attention, but everything invites you to stay just one more minute.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-neutral-700 mb-5">
            But here's the accountability part — the bit that makes it work. The
            moment you try to close the tab, navigate away, or hit{" "}
            <em>Give Up</em>, the app stops you with a quiet but firm warning:{" "}
            <em>"If you leave now, your tree will wither and die."</em> If you
            confirm, the tree shudders, its leaves curl inward, and what was
            once growing becomes a dry, lifeless stick. It's a small sting, but
            it's real. And strangely, it's exactly the sting that keeps you
            seated.
          </p>
          <p className="text-base sm:text-lg leading-relaxed text-neutral-700">
            Optional lo-fi music hums softly in the background. The dark, earthy
            palette keeps your eyes comfortable. Everything is designed to
            disappear — except the one thing that matters: your tree. Stay, and
            it thrives. Leave, and it dies. Simple. Human. Effective.
          </p>
        </div>
      </section>

      {/* =========================================================
          🦶 FOOTER
         ========================================================= */}
      <Footer />

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes swayTree {
          0%,100% { transform: rotate(-0.8deg) }
          50% { transform: rotate(0.8deg) }
        }
        @keyframes leafPop {
          0%   { transform: scale(0) rotate(-25deg); opacity: 0 }
          60%  { transform: scale(1.25) rotate(6deg); opacity: 1 }
          100% { transform: scale(1) rotate(0deg); opacity: 1 }
        }
        @keyframes fruitPop {
          0%   { transform: scale(0); opacity: 0 }
          60%  { transform: scale(1.3); opacity: 1 }
          100% { transform: scale(1); opacity: 1 }
        }
        @keyframes particleFloat {
          0% { transform: translateY(0) scale(1); opacity: 0.9 }
          100% { transform: translateY(-70px) scale(0.2); opacity: 0 }
        }
        @keyframes leafDrift {
          0%   { transform: translate(0,0) rotate(0deg); opacity: 0 }
          20%  { opacity: 1 }
          100% { transform: translate(-60px, 90px) rotate(220deg); opacity: 0 }
        }
        @keyframes witherShake {
          0%,100% { transform: rotate(0) }
          25% { transform: rotate(-4deg) }
          75% { transform: rotate(4deg) }
        }
        @keyframes firefly {
          0%, 100% { transform: translate(0,0); opacity: 0.3 }
          25% { transform: translate(8px, -12px); opacity: 0.9 }
          50% { transform: translate(-6px, -20px); opacity: 0.6 }
          75% { transform: translate(12px, -8px); opacity: 0.8 }
        }
      `}</style>
    </div>
  );
};

/* ============================================================
   TREE DATA
   ============================================================ */
function seededRand(seed) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const BRANCHES = [
  [0.08, -1, 32, 18, "orange"],
  [0.09,  1, 30, 22, "red"],
  [0.12, -1, 38, 8,  "yellow"],
  [0.13,  1, 36, 12, "orange"],
  [0.22, -1, 44, -2, "red"],
  [0.23,  1, 42, -6, "orange"],
  [0.26, -1, 48, -14, "yellow"],
  [0.27,  1, 46, -10, "orange"],
  [0.36, -1, 52, -22, "orange"],
  [0.37,  1, 50, -18, "red"],
  [0.40, -1, 52, -30, "orange"],
  [0.41,  1, 50, -26, "yellow"],
  [0.50, -1, 48, -38, "red"],
  [0.51,  1, 46, -34, "orange"],
  [0.54, -1, 44, -46, "orange"],
  [0.55,  1, 42, -42, "red"],
  [0.64, -1, 36, -56, "orange"],
  [0.65,  1, 34, -52, "yellow"],
  [0.68, -1, 30, -66, "red"],
  [0.69,  1, 28, -62, "orange"],
  [0.78, -1, 22, -76, "orange"],
  [0.79,  1, 20, -72, "red"],
  [0.84, -1, 16, -86, "yellow"],
  [0.85,  1, 14, -82, "orange"],
];

const LEAVES_PER_BRANCH = 4;

function buildLeaves() {
  const out = [];
  const cx = 100, cy = 148, stemTop = 62;
  let idx = 0;
  BRANCHES.forEach(([startT, dir, len, ang], bi) => {
    const stemY = cy - (cy - stemTop) * startT;
    const rad = (ang * Math.PI) / 180;
    const endX = cx + dir * Math.cos(rad) * len;
    const endY = stemY + Math.sin(rad) * len;
    for (let li = 0; li < LEAVES_PER_BRANCH; li++) {
      const t = 0.25 + (li / (LEAVES_PER_BRANCH - 1)) * 0.7;
      const px = cx + (endX - cx) * t;
      const py = stemY + (endY - stemY) * t;
      const perp = ang - 90 * dir;
      const r = seededRand(bi * 13 + li * 7);
      const rot = perp + (r - 0.5) * 60;
      const size = 0.6 + r * 0.5;
      const threshold =
        0.03 + (idx / (BRANCHES.length * LEAVES_PER_BRANCH)) * 0.72;
      out.push({
        cx: px,
        cy: py,
        rot,
        rx: 3.2 * size,
        ry: 2.4 * size,
        at: threshold,
        id: idx,
      });
      idx++;
    }
  });
  return out;
}

function buildFruits() {
  const out = [];
  const cx = 100, cy = 148, stemTop = 62;
  BRANCHES.forEach(([startT, dir, len, ang, tipType], i) => {
    if (!tipType) return;
    const stemY = cy - (cy - stemTop) * startT;
    const rad = (ang * Math.PI) / 180;
    const endX = cx + dir * Math.cos(rad) * len;
    const endY = stemY + Math.sin(rad) * len;
    const r = seededRand(i * 5.7);
    out.push({
      cx: endX,
      cy: endY,
      type: tipType,
      scale: 0.9 + r * 0.5,
      at: 0.78 + (i / BRANCHES.length) * 0.2,
      id: i * 2,
    });
    if (r > 0.4) {
      out.push({
        cx: endX + (r - 0.5) * 10,
        cy: endY + (r - 0.7) * 8,
        type: tipType === "orange" ? "red" : "orange",
        scale: 0.75 + r * 0.4,
        at: 0.82 + (i / BRANCHES.length) * 0.16,
        id: i * 2 + 1,
      });
    }
  });
  return out;
}

const LEAVES = buildLeaves();
const FRUITS = buildFruits();

/* ============================================================
   FRUIT
   ============================================================ */
const Fruit = ({ type }) => {
  const colors =
    type === "orange"
      ? { fill: "url(#orangeGrad)", hi: "#FEF3C7", edge: "#7C2D12" }
      : type === "red"
        ? { fill: "url(#redGrad)", hi: "#FEE2E2", edge: "#7F1D1D" }
        : { fill: "url(#yellowGrad)", hi: "#FEF9C3", edge: "#713F12" };
  return (
    <g>
      <circle
        cx="0"
        cy="0"
        r="2.6"
        fill={colors.fill}
        stroke={colors.edge}
        strokeWidth="0.25"
      />
      <circle cx="-0.8" cy="-0.8" r="0.7" fill={colors.hi} opacity="0.85" />
    </g>
  );
};

/* ============================================================
   PLANT VISUAL
   ============================================================ */
const PlantVisual = ({ stage, withering, progress }) => {
  const stemHeight = progress * 80;
  const stemTopY = 148 - stemHeight;

  return (
    <div
      className="relative"
      style={{
        width: 200,
        height: 200,
        animation: withering ? "witherShake .35s infinite" : "none",
        transition: "all .6s ease",
        filter: "drop-shadow(0 4px 20px rgba(0,0,0,.5))",
      }}
    >
      {stage === "tree" && progress > 0.55 && (
        <>
          {[...Array(8)].map((_, i) => (
            <span
              key={`lfall-${i}`}
              className="pointer-events-none absolute"
              style={{
                left: `${10 + ((i * 11) % 80)}%`,
                top: `${5 + ((i * 13) % 70)}%`,
                width: 7,
                height: 4,
                borderRadius: "60% 40% 60% 40%",
                background: "linear-gradient(135deg, #86efac, #22c55e)",
                boxShadow: "0 0 6px #22c55e",
                animation: `leafDrift ${4 + i * 0.6}s ease-in infinite`,
                animationDelay: `${i * 0.9}s`,
                opacity: 0.8,
              }}
            />
          ))}
        </>
      )}

      <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="potBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b3410" />
            <stop offset="30%" stopColor="#a16207" />
            <stop offset="50%" stopColor="#c2810c" />
            <stop offset="70%" stopColor="#a16207" />
            <stop offset="100%" stopColor="#5c2d0a" />
          </linearGradient>
          <linearGradient id="potRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d18b15" />
            <stop offset="100%" stopColor="#7c3f0a" />
          </linearGradient>
          <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1a0a" />
            <stop offset="100%" stopColor="#1a0f05" />
          </linearGradient>
          <linearGradient id="trunk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#3d2817" />
            <stop offset="50%" stopColor="#6b4423" />
            <stop offset="100%" stopColor="#3d2817" />
          </linearGradient>
          <linearGradient id="branchGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4a2f17" />
            <stop offset="100%" stopColor="#7c5428" />
          </linearGradient>
          <radialGradient id="leafGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="35%" stopColor="#22c55e" />
            <stop offset="75%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#052e16" />
          </radialGradient>
          <radialGradient id="treeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4ade80" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#4ade80" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="orangeGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="35%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#9A3412" />
          </radialGradient>
          <radialGradient id="redGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#FEE2E2" />
            <stop offset="35%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>
          <radialGradient id="yellowGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="35%" stopColor="#FACC15" />
            <stop offset="100%" stopColor="#854D0E" />
          </radialGradient>
        </defs>

        <circle
          cx="100"
          cy="110"
          r="70"
          fill="url(#treeGlow)"
          opacity={0.5 + progress * 0.4}
        />

        {stage === "seed" && (
          <g>
            <ellipse cx="100" cy="150" rx="5" ry="3.5" fill="#a16207" />
            <ellipse cx="100" cy="150" rx="5" ry="3.5" fill="#facc15" opacity="0.35" />
            <circle cx="100" cy="150" r="12" fill="url(#treeGlow)" opacity="0.7">
              <animate
                attributeName="opacity"
                values="0.2;0.9;0.2"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {(stage === "tree" || stage === "dead") && (
          <g
            style={{
              animation:
                stage === "tree" ? "swayTree 6s ease-in-out infinite" : "none",
              transformOrigin: "100px 148px",
            }}
          >
            {stemHeight > 2 && (
              <path
                d={`M100 148 L 100 ${stemTopY}`}
                stroke="url(#trunk)"
                strokeWidth={4 + progress * 2.5}
                strokeLinecap="round"
                fill="none"
                style={{ transition: "all 0.8s ease" }}
              />
            )}

            {progress > 0.04 &&
              BRANCHES.map(([startT, dir, len, ang], i) => {
                const stemY = 148 - 80 * startT;
                const rad = (ang * Math.PI) / 180;
                const endX = 100 + dir * Math.cos(rad) * len;
                const endY = stemY + Math.sin(rad) * len;
                const cpX = 100 + (endX - 100) * 0.5 + dir * 4;
                const cpY = stemY + (endY - stemY) * 0.5 + 3;
                const vis = progress >= startT;
                return (
                  <path
                    key={`br-${i}`}
                    d={`M100 ${stemY} Q${cpX} ${cpY} ${endX} ${endY}`}
                    stroke="url(#branchGrad)"
                    strokeWidth={1.6 + progress * 1}
                    strokeLinecap="round"
                    fill="none"
                    style={{
                      opacity: vis ? 1 : 0,
                      transition: "opacity .5s ease",
                    }}
                  />
                );
              })}

            {stage === "tree" &&
              LEAVES.map((leaf) => {
                const visible = progress >= leaf.at;
                return (
                  <ellipse
                    key={leaf.id}
                    cx={leaf.cx}
                    cy={leaf.cy}
                    rx={leaf.rx}
                    ry={leaf.ry}
                    fill="url(#leafGrad)"
                    transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
                    style={{
                      opacity: visible ? 1 : 0,
                      transformOrigin: `${leaf.cx}px ${leaf.cy}px`,
                      animation: visible ? "leafPop .5s ease" : "none",
                      transition: "opacity .3s ease",
                    }}
                  />
                );
              })}

            {stage === "tree" &&
              FRUITS.map((f) => {
                const visible = progress >= f.at;
                return (
                  <g
                    key={`fr-${f.id}`}
                    transform={`translate(${f.cx} ${f.cy}) scale(${f.scale})`}
                    style={{
                      opacity: visible ? 1 : 0,
                      transformOrigin: `${f.cx}px ${f.cy}px`,
                      animation: visible
                        ? "fruitPop .7s cubic-bezier(.34,1.6,.4,1)"
                        : "none",
                      transition: "opacity .4s ease",
                      filter: "drop-shadow(0 0 3px rgba(251,146,60,.9))",
                    }}
                  >
                    <Fruit type={f.type} />
                  </g>
                );
              })}

            {progress > 0.65 && (
              <>
                {[...Array(12)].map((_, i) => (
                  <circle
                    key={`fp-${i}`}
                    cx={60 + ((i * 13) % 80)}
                    cy={60 + ((i * 17) % 60)}
                    r={0.9 + ((i * 7) % 12) / 14}
                    fill="#ecfccb"
                    style={{
                      animation: `particleFloat ${2 + (i % 3) * 0.5}s ease-out infinite`,
                      animationDelay: `${(i % 4) * 0.4}s`,
                      transformOrigin: "center",
                      opacity: progress > 0.9 ? 1 : 0.6,
                    }}
                  />
                ))}
              </>
            )}
          </g>
        )}

        {/* POT */}
        <path
          d="M68 152 L74 190 Q100 196 126 190 L132 152 Z"
          fill="url(#potBody)"
          stroke="#4a2606"
          strokeWidth="0.6"
        />
        <rect
          x="62"
          y="146"
          width="76"
          height="12"
          rx="2"
          fill="url(#potRim)"
          stroke="#4a2606"
          strokeWidth="0.5"
        />
        <ellipse cx="100" cy="148" rx="30" ry="4" fill="url(#soil)" />
        <ellipse cx="100" cy="148" rx="24" ry="2.4" fill="#3a2410" opacity="0.7" />
        <ellipse cx="100" cy="194" rx="34" ry="3" fill="rgba(0,0,0,.5)" />

        {stage === "dead" && (
          <g style={{ transformOrigin: "100px 148px" }}>
            <path
              d="M100 148 C 104 128, 96 110, 100 88"
              stroke="#57534e"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M100 118 L 88 108 M100 106 L 112 96"
              stroke="#57534e"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text
              x="100"
              y="72"
              textAnchor="middle"
              fill="#78716c"
              fontSize="14"
              opacity="0.6"
            >
              ✕
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export default Animation;