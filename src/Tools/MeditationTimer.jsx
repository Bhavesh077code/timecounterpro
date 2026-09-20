// src/pages/MeditationPage.jsx
//
// 5-Minute Meditation Timer — premium mindfulness experience
//
// Design notes (senior-dev pass):
//   • Deep indigo → spiritual violet layered gradient with soft grain
//   • Central breathing circle pulses at 4s cycles (15 breaths/min)
//   • Elegant tabular-nums timer with subtle letter-spacing
//   • Minimal control bar: Start / Pause / Reset
//   • Ambient audio mixer: Zen Bells + Tibetan Bowls (Web Audio API synthesized)
//   • Fullscreen mode (F key) hides navbar for immersive meditation
//   • Below-the-fold SEO guide on white background
//   • Fully mobile responsive; tap targets ≥ 44px
//   • Respects prefers-reduced-motion (breathing animation pauses)
//   • Zero external audio files — all sounds synthesized in the browser
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Seo from "../components/Seo";

const SITE_URL = "https://timecounterpro.com";
const SESSION_SECONDS = 5 * 60;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const relatedTools = [
  { path: "/pomodoro", label: "Pomodoro Timer", desc: "Focused work intervals" },
  { path: "/stopwatch", label: "Stopwatch", desc: "Millisecond lap timing" },
  { path: "/world-clock", label: "World Clock", desc: "Global time zones" },
  { path: "/mock-test-timer", label: "Mock Test Timer", desc: "Sectional exam mode" },
];

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function MeditationPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "5-Minute Meditation Timer",
        url: `${SITE_URL}/meditation`,
        applicationCategory: "HealthApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };

  return (
    <>
      <Seo
        title="5-Minute Meditation Timer - Free Mindfulness Breathing Guide"
        description="A free 5-minute guided meditation timer with a breathing circle, Zen bells and Tibetan bowl ambience. Calm your mind in five quiet minutes."
        path="/meditation"
        schema={schema}
      />

      {/* ═══════════════ TIMER + NAVBAR (dark, immersive) ═══════════════ */}
      <MeditationTimer />

      {/* ═══════════════ GUIDE (white, readable) ═══════════════ */}
      <section className="bg-white text-slate-800">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-8 py-16 sm:py-20">

          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-600 mb-3">
            The Practice
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-950 leading-tight">
            Why Five Minutes Is Enough
          </h2>

          <div className="mt-6 space-y-5 text-[15px] sm:text-base leading-7 sm:leading-8 text-slate-600">
            <p>
              Most people believe meditation requires thirty minutes, a cushion,
              and a monk's worth of discipline. It doesn't. Five minutes, done
              consistently, rewires more than an hour done once a week. This
              timer exists for that exact reason — not for the person who
              already has a practice, but for the person who keeps meaning to
              start one.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
              The brain shifts faster than you think
            </h3>
            <p className="text-[15px] sm:text-base leading-7 sm:leading-8 text-slate-600">
              Within ninety seconds of slow, even breathing, your
              parasympathetic nervous system starts to engage. Heart rate drops.
              Cortisol levels soften. Blood pressure settles. By minute five,
              most people notice a quiet they didn't have when they sat down.
              The trick isn't duration — it's showing up. A short session done
              daily beats a long one done occasionally, every single time.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
              Follow the circle, not the clock
            </h3>
            <p className="text-[15px] sm:text-base leading-7 sm:leading-8 text-slate-600">
              The glowing circle on this page breathes with you — expanding for
              four seconds, contracting for four. That's roughly fifteen breaths
              per minute, the rhythm most commonly associated with calm,
              focused states. Inhale as the circle grows. Exhale as it shrinks.
              Don't force it. Your breath will find the rhythm on its own, and
              once it does, the timer quietly disappears from your awareness.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
              Use the sound, or don't
            </h3>
            <p className="text-[15px] sm:text-base leading-7 sm:leading-8 text-slate-600">
              The <strong className="text-slate-900">Zen Bells</strong> option
              drops a soft chime every twelve seconds — a gentle anchor for
              when your thoughts drift into planning next week's dinner. The{" "}
              <strong className="text-slate-900">Tibetan Bowls</strong> option
              adds a low, sustained drone at 136.1 Hz, the frequency traditionally
              associated with the "Om" chant. Both are synthesized in your
              browser — no downloads, no streaming, no delays. Neither is
              required. Both help.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
              A note on distractions
            </h3>
            <p className="text-[15px] sm:text-base leading-7 sm:leading-8 text-slate-600">
              You will think about your inbox. You will plan dinner. You will
              suddenly remember an embarrassing thing you said in 2014. This is
              not failure — this is the practice. Notice the thought, let it
              pass, and return to the breath. Every return is a repetition, and
              repetition is what builds the muscle. The goal is not to have a
              quiet mind. The goal is to notice, without judgment, when your
              mind has wandered — and come back.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
              When to use this timer
            </h3>
            <p className="text-[15px] sm:text-base leading-7 sm:leading-8 text-slate-600">
              Before a difficult conversation. After a long meeting. In the two
              minutes between finishing work and starting dinner. On a lunch
              break. Before bed, when the day is still rattling around in your
              head. The best meditation timer is the one you actually open — so
              keep this page bookmarked, and use it the moment you feel the day
              tightening. Five minutes is not a compromise. It's a deliberate
              choice.
            </p>
          </div>

          <div className="mt-10">
            <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">
              What changes if you keep going
            </h3>
            <p className="text-[15px] sm:text-base leading-7 sm:leading-8 text-slate-600">
              After a week: you'll notice you can sit still without reaching for
              your phone. After a month: small frustrations will feel
              smaller — traffic, emails, difficult people. After three months:
              you'll have a tool you can use anywhere, in any situation, without
              anyone knowing. No app subscription. No retreat. Just five minutes,
              once a day. That's the entire instruction. If you can do that,
              you've already done the hardest part.
            </p>
          </div>

          <div className="mt-10 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 sm:p-6">
            <p className="text-[15px] sm:text-base leading-7 text-slate-800 italic">
              Five minutes. Once a day. Start the timer, follow the circle, and
              let the breath do the rest. Everything else is optional.
            </p>
          </div>

          <div className="mt-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-indigo-600 mb-3">
              Continue
            </p>
            <h3 className="text-xl font-bold text-slate-950 tracking-tight mb-5">
              Other timers on TimeCounterPro
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTools.map((t) => (
                <Link
                  key={t.path}
                  to={t.path}
                  className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                      {t.label}
                    </p>
                    <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all">
                      →
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{t.desc}</p>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MEDITATION TIMER — dark immersive block WITH NAVBAR
// ═════════════════════════════════════════════════════════════════════════════
function MeditationTimer() {
  const [totalSeconds] = useState(SESSION_SECONDS);
  const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [zenBellsOn, setZenBellsOn] = useState(false);
  const [tibetanBowlsOn, setTibetanBowlsOn] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const zenNodesRef = useRef(null);
  const bowlNodesRef = useRef(null);
  const completionPlayedRef = useRef(false);
  const pageRef = useRef(null);

  // ── Reduced-motion detection ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // ── Fullscreen toggle ────────────────────────────────────────────────────
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
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  // ── Keyboard: F for fullscreen, Space for play/pause ─────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.code === "Space") {
        e.preventDefault();
        if (isRunning) setIsRunning(false);
        else {
          if (isComplete) {
            setTimeLeft(totalSeconds);
            setIsComplete(false);
            completionPlayedRef.current = false;
          }
          getAudioCtx();
          setIsRunning(true);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isRunning, isComplete, totalSeconds, toggleFullscreen]);

  // ── Main timer tick ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRunning) return;
    if (timeLeft <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setIsRunning(false);
          setIsComplete(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  // ── Audio context helper ─────────────────────────────────────────────────
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  // ── Bell synth ───────────────────────────────────────────────────────────
  const playBell = useCallback(
    (freq = 528, duration = 1.8, volume = 0.15) => {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + duration);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    },
    [getAudioCtx]
  );

  // ── Completion bell ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isComplete || completionPlayedRef.current) return;
    completionPlayedRef.current = true;
    playBell(528, 1.8, 0.15);
    setTimeout(() => playBell(396, 2.5, 0.1), 800);
  }, [isComplete, playBell]);

  // ── Zen Bells ambience ───────────────────────────────────────────────────
  useEffect(() => {
    if (!zenBellsOn || !isRunning) {
      if (zenNodesRef.current) {
        clearInterval(zenNodesRef.current);
        zenNodesRef.current = null;
      }
      return;
    }
    playBell(660, 2.0, 0.08);
    zenNodesRef.current = setInterval(() => {
      playBell(660, 2.0, 0.08);
    }, 12000);
    return () => {
      if (zenNodesRef.current) {
        clearInterval(zenNodesRef.current);
        zenNodesRef.current = null;
      }
    };
  }, [zenBellsOn, isRunning, playBell]);

  // ── Tibetan Bowls ambience ───────────────────────────────────────────────
  useEffect(() => {
    if (!tibetanBowlsOn || !isRunning) {
      if (bowlNodesRef.current) {
        const { osc, osc2, gain, lfo } = bowlNodesRef.current;
        try {
          const ctx = getAudioCtx();
          const now = ctx ? ctx.currentTime : 0;
          gain?.gain.cancelScheduledValues(now);
          gain?.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
          setTimeout(() => {
            try {
              osc?.stop();
              osc2?.stop();
              lfo?.stop();
            } catch (e) {}
          }, 600);
        } catch (e) {}
        bowlNodesRef.current = null;
      }
      return;
    }
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 136.1;
    osc2.type = "sine";
    osc2.frequency.value = 136.6;

    lfo.type = "sine";
    lfo.frequency.value = 0.15;
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 1.5);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    lfo.start(now);

    bowlNodesRef.current = { osc, osc2, gain, lfo, lfoGain };

    return () => {
      try {
        const t = ctx.currentTime;
        gain.gain.cancelScheduledValues(t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
        setTimeout(() => {
          try {
            osc.stop();
            osc2.stop();
            lfo.stop();
          } catch (e) {}
        }, 600);
      } catch (e) {}
      bowlNodesRef.current = null;
    };
  }, [tibetanBowlsOn, isRunning, getAudioCtx]);

  // ── Cleanup ──────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (zenNodesRef.current) clearInterval(zenNodesRef.current);
      try {
        const ctx = audioCtxRef.current;
        if (ctx && ctx.state !== "closed") ctx.close().catch(() => {});
      } catch (e) {}
    };
  }, []);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleStart = () => {
    if (isComplete) {
      setTimeLeft(totalSeconds);
      setIsComplete(false);
      completionPlayedRef.current = false;
    }
    getAudioCtx();
    setIsRunning(true);
  };
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(totalSeconds);
    completionPlayedRef.current = false;
  };

  const progress = 1 - timeLeft / totalSeconds;
  const breathing = isRunning && !reduceMotion;

  return (
    <div
      ref={pageRef}
      className="min-h-screen w-full relative overflow-hidden bg-[#0b0f19] text-white selection:bg-violet-500/30"
    >
      {/* Layered background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 25%, rgba(99, 102, 241, 0.22) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 50% 100%, rgba(139, 92, 246, 0.18) 0%, transparent 65%), radial-gradient(ellipse 60% 40% at 20% 80%, rgba(167, 139, 250, 0.08) 0%, transparent 60%), linear-gradient(180deg, #0b0f19 0%, #121227 45%, #1e1b4b 100%)",
        }}
      />

      {/* Grain overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 35%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* ═══════════════ NAVBAR (hidden in fullscreen) ═══════════════ */}
      {!isFullscreen && (
        <div className="relative z-30">
          <Navbar />
        </div>
      )}

      {/* ═══════════════ FULLSCREEN BUTTON — below navbar ═══════════════ */}
      <button
        type="button"
        onClick={toggleFullscreen}
        className="fixed z-50 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          top: isFullscreen ? "1rem" : "5rem",
          right: "1rem",
          background: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          color: "rgba(255, 255, 255, 0.85)",
        }}
        title="Fullscreen (F)"
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        )}
      </button>

      {/* Main content */}
      <div
        className="relative z-10 mx-auto w-full max-w-3xl px-5 sm:px-6 lg:px-8 flex flex-col"
        style={{
          minHeight: isFullscreen
            ? "100vh"
            : "calc(100vh - 64px)",
        }}
      >
        {/* Header */}
        <header className="pt-10 sm:pt-14 text-center">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.32em] text-violet-300/70">
            Mindfulness · Presence
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-extralight tracking-tight text-white/95">
            Breathe
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300/70 max-w-md mx-auto leading-relaxed">
            Five quiet minutes. Follow the circle. Let the breath lead.
          </p>
        </header>

        {/* Breathing circle */}
        <div className="flex-1 flex items-center justify-center py-8 sm:py-14">
          <div className="relative flex items-center justify-center w-[290px] h-[290px] sm:w-[380px] sm:h-[380px] md:w-[440px] md:h-[440px]">

            {/* Outer breathing glow */}
            <div
              aria-hidden="true"
              className={`absolute inset-0 rounded-full ${breathing ? "meditate-breathe" : ""}`}
              style={{
                background:
                  "radial-gradient(circle, rgba(139, 92, 246, 0.32) 0%, rgba(99, 102, 241, 0.1) 45%, transparent 72%)",
                filter: "blur(24px)",
              }}
            />

            {/* Ambient halo */}
            <div
              aria-hidden="true"
              className="absolute inset-6 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(167, 139, 250, 0.14) 0%, transparent 68%)",
                filter: "blur(32px)",
              }}
            />

            {/* Progress ring */}
            <svg
              viewBox="0 0 200 200"
              className="absolute inset-0 w-full h-full -rotate-90"
              aria-hidden="true"
            >
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="0.6"
              />
              <circle
                cx="100"
                cy="100"
                r="94"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 94}
                strokeDashoffset={2 * Math.PI * 94 * (1 - progress)}
                style={{
                  transition: "stroke-dashoffset 1s linear",
                  filter: "drop-shadow(0 0 8px rgba(167, 139, 250, 0.7))",
                }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#c4b5fd" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner disc */}
            <div
              className={`relative w-[64%] h-[64%] rounded-full flex items-center justify-center transition-transform duration-1000 ease-out ${
                breathing ? "meditate-breathe-inner" : ""
              }`}
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(196, 181, 253, 0.32) 0%, rgba(99, 102, 241, 0.18) 40%, rgba(30, 27, 75, 0.7) 100%)",
                boxShadow:
                  "inset 0 0 50px rgba(167, 139, 250, 0.28), 0 0 80px rgba(139, 92, 246, 0.22)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(196, 181, 253, 0.2)",
              }}
            >
              <div className="text-center pointer-events-none">
                <div
                  className="font-extralight tabular-nums tracking-[0.06em] text-white"
                  style={{
                    fontSize: "clamp(2.8rem, 10vw, 5rem)",
                    lineHeight: 1,
                    textShadow: "0 0 30px rgba(196,181,253,0.35)",
                  }}
                >
                  {formatTime(timeLeft)}
                </div>
                <div className="mt-3 text-[10px] sm:text-xs font-medium uppercase tracking-[0.32em] text-violet-200/70">
                  {isComplete ? "Complete" : isRunning ? "Breathe" : "Ready"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          {!isRunning ? (
            <button
              type="button"
              onClick={handleStart}
              className="inline-flex items-center gap-2.5 px-8 sm:px-10 h-14 rounded-full text-sm font-medium tracking-wide text-[#0b0f19] bg-gradient-to-br from-violet-200 via-violet-100 to-indigo-100 hover:from-white hover:to-violet-50 transition-all duration-300 shadow-[0_8px_32px_rgba(167,139,250,0.4)] hover:shadow-[0_8px_44px_rgba(167,139,250,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0f19] active:scale-[0.98]"
              aria-label={isComplete ? "Restart session" : "Start meditation"}
            >
              <PlayIcon />
              <span className="uppercase tracking-[0.14em] text-xs font-semibold">
                {isComplete ? "Restart" : "Begin"}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center gap-2.5 px-8 sm:px-10 h-14 rounded-full text-sm font-medium tracking-wide text-white/90 bg-white/5 border border-white/15 backdrop-blur-md hover:bg-white/10 hover:border-white/25 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/40 active:scale-[0.98]"
              aria-label="Pause meditation"
            >
              <PauseIcon />
              <span className="uppercase tracking-[0.14em] text-xs font-semibold">
                Pause
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center justify-center w-14 h-14 rounded-full text-white/60 bg-white/5 border border-white/10 backdrop-blur-md hover:text-white/90 hover:bg-white/10 hover:border-white/20 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/40 active:scale-[0.98]"
            aria-label="Reset timer"
            title="Reset"
          >
            <ResetIcon />
          </button>
        </div>

        {/* Ambient mixer */}
        <div className="mt-10 sm:mt-12 pb-12">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.32em] text-violet-200/55 mb-4">
            Ambient Sound
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
            <AmbientToggle
              label="Zen Bells"
              active={zenBellsOn}
              onToggle={() => setZenBellsOn((v) => !v)}
              icon={<BellIcon />}
            />
            <AmbientToggle
              label="Tibetan Bowls"
              active={tibetanBowlsOn}
              onToggle={() => setTibetanBowlsOn((v) => !v)}
              icon={<BowlIcon />}
            />
          </div>
          <p className="mt-4 text-center text-[10px] sm:text-[11px] text-slate-400/55 max-w-sm mx-auto leading-relaxed">
            Sound plays only while the session runs. Headphones recommended.
            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/70 text-[10px] font-mono">F</kbd> for fullscreen.
          </p>
        </div>
      </div>

      {/* Breathing keyframes */}
      <style>{`
        @keyframes meditateBreath {
          0%, 100% { transform: scale(1); opacity: 0.75; }
          50%      { transform: scale(1.14); opacity: 1; }
        }
        @keyframes meditateBreathInner {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.07); }
        }
        .meditate-breathe {
          animation: meditateBreath 4s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .meditate-breathe-inner {
          animation: meditateBreathInner 4s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .meditate-breathe,
          .meditate-breathe-inner {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Ambient toggle
// ─────────────────────────────────────────────────────────────────────────────
function AmbientToggle({ label, active, onToggle, icon }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className={`group inline-flex items-center gap-2.5 h-11 px-4 sm:px-5 rounded-full text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300 border backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/40 active:scale-[0.98] ${
        active
          ? "bg-violet-400/15 border-violet-300/40 text-violet-100 shadow-[0_0_28px_rgba(167,139,250,0.3)]"
          : "bg-white/[0.04] border-white/10 text-white/60 hover:bg-white/[0.07] hover:text-white/85 hover:border-white/20"
      }`}
    >
      <span
        className={`inline-flex transition-transform duration-300 ${
          active ? "text-violet-200" : "text-white/55 group-hover:text-white/80"
        }`}
      >
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sm:hidden">{label.split(" ")[0]}</span>
      <span
        aria-hidden="true"
        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          active
            ? "bg-violet-200 shadow-[0_0_8px_rgba(196,181,253,0.9)]"
            : "bg-white/15"
        }`}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────
function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
function BellIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
function BowlIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12a8 8 0 0 0 16 0" />
      <path d="M2 12h20" />
      <path d="M9 4l3 2 3-2" />
    </svg>
  );
}