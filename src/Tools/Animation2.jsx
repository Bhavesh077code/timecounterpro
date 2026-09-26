import React, { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Layout/Footer";

const DEFAULT_SESSION_SECONDS = 25 * 60;
const MAX_ASCENT = 620;
const GRAVITY = 0.35;
const CLIMB_EASE = 0.06;
const PRESET_MINUTES = [5, 15, 25, 45, 60, 90];

const Animation2 = () => {
  const [sessionSeconds, setSessionSeconds] = useState(DEFAULT_SESSION_SECONDS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SESSION_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [showAbortModal, setShowAbortModal] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [customMin, setCustomMin] = useState("");
  const [showTimerPanel, setShowTimerPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const audioRef = useRef(null);
  const rocketAudioRef = useRef(null);
  const timerRef = useRef(null);
  const starRef = useRef(null);
  const particleRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rumbleRef = useRef(null);
  const rumbleGainRef = useRef(null);
  const heroRef = useRef(null);

  const rocketYRef = useRef(0);
  const rocketYTargetRef = useRef(0);
  const rocketVelRef = useRef(0);
  const phaseRef = useRef("idle");
  const [rocketY, setRocketY] = useState(0);

  const elapsed = sessionSeconds - timeLeft;
  const progress = Math.min(1, Math.max(0, elapsed / sessionSeconds));
  const secondsLeft = timeLeft;

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

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
        !!(document.fullscreenElement || document.webkitFullscreenElement),
      );
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, []);

  /* =========================================================
     🔊 ROCKET SOUND — Web Audio (no file needed)
     ========================================================= */
  useEffect(() => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    audioCtxRef.current = ctx;

    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (last + 0.02 * white) / 1.02;
      last = data[i];
      data[i] *= 3.5;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 180;
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    noise.connect(filter).connect(gain).connect(ctx.destination);
    noise.start();

    rumbleRef.current = { noise, filter };
    rumbleGainRef.current = gain;

    return () => {
      try {
        noise.stop();
        ctx.close();
      } catch (e) {}
    };
  }, []);

  const updateRumble = (level) => {
    const gain = rumbleGainRef.current;
    const ctx = audioCtxRef.current;
    if (!gain || !ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const target = Math.max(0, Math.min(0.4, level));
    gain.gain.setTargetAtTime(target, ctx.currentTime, 0.15);
  };

  useEffect(() => {
    let level = 0;
    if (phase === "countdown" || phase === "hot") {
      level = 0.05 + progress * 0.18;
    } else if (phase === "launch") {
      level = 0.4;
    } else if (phase === "complete") {
      level = 0.05;
    } else if (phase === "aborted") {
      level = 0;
    }
    updateRumble(level);
  }, [phase, progress]);

  const updateRocketAudio = (level) => {
    const audio = rocketAudioRef.current;
    if (!audio) return;
    const vol = Math.max(0, Math.min(1, level));
    audio.volume = vol;
    if (vol > 0.02) {
      if (audio.paused) audio.play().catch(() => {});
    } else if (!audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  useEffect(() => {
    let level = 0;
    if (phase === "countdown") level = 0.12 + progress * 0.35;
    else if (phase === "hot") level = 0.5 + (1 - secondsLeft / 10) * 0.35;
    else if (phase === "launch") level = 1;
    else if (phase === "complete") level = 0.3;
    updateRocketAudio(level);
  }, [phase, progress, secondsLeft]);

  /* -----------------------------------------
     Timer tick
  ----------------------------------------- */
  useEffect(() => {
    if (!isRunning) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setIsRunning(false);
          setPhase("launch");
          setTimeout(() => setPhase("complete"), 3500);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (["aborted", "launch", "complete"].includes(phase)) return;
    if (!isRunning && elapsed === 0) setPhase("idle");
    else if (secondsLeft <= 10) setPhase("hot");
    else if (isRunning) setPhase("countdown");
  }, [isRunning, secondsLeft, elapsed, phase]);

  /* -----------------------------------------
     Rocket physics
  ----------------------------------------- */
  useEffect(() => {
    let raf;
    const loop = () => {
      const curPhase = phaseRef.current;

      if (curPhase === "launch") rocketYTargetRef.current = -1600;
      else if (curPhase === "complete") rocketYTargetRef.current = -1800;
      else if (curPhase === "aborted") rocketYTargetRef.current = 0;
      else if (isRunning) rocketYTargetRef.current = -(progress * MAX_ASCENT);
      else rocketYTargetRef.current = 0;

      if (isRunning || curPhase === "launch" || curPhase === "complete") {
        rocketYRef.current +=
          (rocketYTargetRef.current - rocketYRef.current) * CLIMB_EASE;
        rocketVelRef.current = 0;
      } else {
        rocketVelRef.current += GRAVITY;
        rocketYRef.current += rocketVelRef.current;
        if (rocketYRef.current >= 0) {
          rocketYRef.current = 0;
          rocketVelRef.current = 0;
        }
      }

      setRocketY(rocketYRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isRunning, progress]);

  /* -----------------------------------------
     Music
  ----------------------------------------- */
  useEffect(() => {
    if (!audioRef.current) return;
    if (musicOn) {
      audioRef.current.volume = 0.28;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [musicOn]);

  /* -----------------------------------------
     Tab close warning
  ----------------------------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (isRunning) {
        e.preventDefault();
        e.returnValue =
          "⚠ WARNING: Core Meltdown — abandoning launch will destroy the rocket.";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isRunning]);

  /* =========================================================
     🌌 GALAXY STARFIELD — with realistic twinkling stars
     ========================================================= */
  useEffect(() => {
    const canvas = starRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const STAR_COUNT = 520;
    const stars = Array.from({ length: STAR_COUNT }, () => {
      const r = Math.random();
      let hue;
      if (r < 0.5) hue = 212;
      else if (r < 0.75) hue = 196;
      else if (r < 0.92) hue = 45;
      else if (r < 0.98) hue = 18;
      else hue = 280;
      return {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: Math.random(),
        size: 0.35 + Math.random() * 1.8,
        hue,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.01 + Math.random() * 0.035,
        baseAlpha: 0.45 + Math.random() * 0.55,
        bright: Math.random() < 0.08,
      };
    });

    let shootingStars = [];
    const spawnShootingStar = () => {
      const curPhase = phaseRef.current;
      if (curPhase === "launch" || curPhase === "complete") return;
      if (shootingStars.length < 2 && Math.random() < 0.0025) {
        const angle = Math.PI * 0.22 + (Math.random() - 0.5) * 0.25;
        shootingStars.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.35,
          vx: Math.cos(angle) * (7 + Math.random() * 4),
          vy: Math.sin(angle) * (7 + Math.random() * 4),
          life: 1,
        });
      }
    };

    let warp = 0;
    let raf;
    const FOCAL = 300;

    const draw = () => {
      const curPhase = phaseRef.current;
      const targetWarp =
        curPhase === "launch" || curPhase === "complete" ? 1 : 0;
      warp += (targetWarp - warp) * 0.05;

      ctx.clearRect(0, 0, w, h);

      // Milky Way band
      if (warp < 0.15) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        const mw = ctx.createLinearGradient(0, 0, w, h);
        mw.addColorStop(0, "rgba(139,92,246,0)");
        mw.addColorStop(0.42, "rgba(180,195,255,0.045)");
        mw.addColorStop(0.5, "rgba(210,220,255,0.09)");
        mw.addColorStop(0.58, "rgba(180,195,255,0.045)");
        mw.addColorStop(1, "rgba(139,92,246,0)");
        ctx.fillStyle = mw;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      const cx = w / 2;
      const cy = h / 2;
      const drift = curPhase === "launch" ? 6 : 0.2;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinkle += s.twinkleSpeed;

        const shimmer = 0.5 + Math.sin(s.twinkle) * 0.4;
        const noise = (Math.random() - 0.5) * 0.08;
        let twinkle = Math.max(0.1, Math.min(1, shimmer + noise)) * s.baseAlpha;

        if (s.bright) {
          twinkle = Math.min(1, twinkle * 1.35);
        }

        s.z -= 0.0025 + warp * 0.02 + drift * 0.001;
        if (s.z <= 0.02) {
          s.x = (Math.random() - 0.5) * 2;
          s.y = (Math.random() - 0.5) * 2;
          s.z = 1;
        }
        const scale = FOCAL / (s.z * FOCAL + 1);
        const px = cx + s.x * scale * 3;
        const py = cy + s.y * scale * 3;
        if (px < -50 || px > w + 50 || py < -50 || py > h + 50) continue;

        const depthAlpha = Math.min(1, (1 - s.z) * 1.4) * twinkle;

        if (warp > 0.08) {
          const prevScale = FOCAL / ((s.z + 0.03) * FOCAL + 1);
          const prevPx = cx + s.x * prevScale * 3;
          const prevPy = cy + s.y * prevScale * 3;
          const dx = px - prevPx;
          const dy = py - prevPy;
          const len = 3 + warp * 36;
          const grad = ctx.createLinearGradient(
            px,
            py,
            px - dx * len,
            py - dy * len,
          );
          grad.addColorStop(0, `hsla(${s.hue},100%,85%,${depthAlpha})`);
          grad.addColorStop(1, `hsla(${s.hue},100%,60%,0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = s.size * (0.6 + (1 - s.z) * 1.6);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - dx * len, py - dy * len);
          ctx.stroke();
        } else {
          const r = s.size * (0.5 + (1 - s.z) * 1.5);
          const glowR = s.bright ? r * 5 : r * 3.6;

          const grd = ctx.createRadialGradient(px, py, 0, px, py, glowR);
          grd.addColorStop(0, `hsla(${s.hue},100%,92%,${depthAlpha})`);
          grd.addColorStop(0.3, `hsla(${s.hue},100%,78%,${depthAlpha * 0.45})`);
          grd.addColorStop(1, `hsla(${s.hue},100%,60%,0)`);
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(px, py, glowR, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.arc(px, py, r * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${s.hue},100%,98%,${depthAlpha})`;
          ctx.fill();

          if (s.bright && depthAlpha > 0.4) {
            ctx.strokeStyle = `hsla(${s.hue},100%,95%,${depthAlpha * 0.55})`;
            ctx.lineWidth = 0.7;
            const len = r * 5.5;
            ctx.beginPath();
            ctx.moveTo(px - len, py);
            ctx.lineTo(px + len, py);
            ctx.moveTo(px, py - len);
            ctx.lineTo(px, py + len);
            ctx.stroke();
          }
        }
      }

      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const m = shootingStars[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.02;
        if (m.life <= 0 || m.x > w + 60 || m.y > h + 60) {
          shootingStars.splice(i, 1);
          continue;
        }
        const tailX = m.x - m.vx * 6;
        const tailY = m.y - m.vy * 6;
        const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255,255,255,${m.life})`);
        grad.addColorStop(1, "rgba(180,210,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* =========================================================
     🔥 PLASMA EXHAUST
     ========================================================= */
  useEffect(() => {
    const canvas = particleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0,
      h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const embers = [];
    const spawn = (intensity, baseY) => {
      const count = Math.floor(1 + intensity * 10);
      const cx = w / 2;
      for (let i = 0; i < count; i++) {
        const angle = (Math.random() - 0.5) * (0.6 + intensity * 0.9);
        const speed = 1 + Math.random() * 3.5 + intensity * 5;
        embers.push({
          x: cx + (Math.random() - 0.5) * 40,
          y: baseY + Math.random() * 10,
          vx: Math.sin(angle) * speed * 0.4,
          vy: Math.cos(angle) * speed,
          life: 1,
          decay: 0.014 + Math.random() * 0.014,
          size: 1.4 + Math.random() * 3.2,
          hue: 178 + Math.random() * 40,
        });
      }
    };

    let raf;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      const curPhase = phaseRef.current;
      const baseY = h * 0.78 + rocketYRef.current;

      let intensity = 0;
      if (curPhase === "hot") intensity = 0.55 + (1 - secondsLeft / 10) * 0.45;
      else if (curPhase === "launch" || curPhase === "complete")
        intensity = 1.2;
      else if (curPhase === "countdown") intensity = 0.14 + progress * 0.42;

      if (intensity > 0.04 && baseY > -100) spawn(intensity, baseY);

      if (intensity > 0.1 && baseY > -80) {
        const nx = w / 2;
        const radius = 34 + intensity * 80;
        const g = ctx.createRadialGradient(nx, baseY, 0, nx, baseY, radius);
        g.addColorStop(0, `rgba(224,251,255,${0.85 * intensity})`);
        g.addColorStop(0.25, `rgba(34,211,238,${0.55 * intensity})`);
        g.addColorStop(0.6, `rgba(14,165,233,${0.28 * intensity})`);
        g.addColorStop(1, "rgba(14,165,233,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(nx, baseY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        const p = embers[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy *= 1.018;
        p.life -= p.decay;
        if (p.life <= 0) {
          embers.splice(i, 1);
          continue;
        }
        const a = p.life * 0.9;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3.2);
        g.addColorStop(0, `hsla(${p.hue},100%,85%,${a})`);
        g.addColorStop(0.5, `hsla(${p.hue},100%,62%,${a * 0.55})`);
        g.addColorStop(1, `hsla(${p.hue},100%,45%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [secondsLeft, progress]);

  /* -----------------------------------------
     Timer setter
  ----------------------------------------- */
  const applyDuration = (mins) => {
    if (isRunning) return;
    const secs = Math.max(60, Math.min(180 * 60, Math.round(mins * 60)));
    setSessionSeconds(secs);
    setTimeLeft(secs);
    setPhase("idle");
    rocketYRef.current = 0;
    rocketVelRef.current = 0;
    setShowTimerPanel(false);
  };

  const handleCustomApply = () => {
    const val = parseFloat(customMin);
    if (!isNaN(val) && val > 0) {
      applyDuration(val);
      setCustomMin("");
    }
  };

  /* -----------------------------------------
     Handlers
  ----------------------------------------- */
  const handleStart = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
    if (rocketAudioRef.current) {
      rocketAudioRef.current.play().catch(() => {});
    }
    if (phase === "aborted" || phase === "complete") {
      setPhase("countdown");
      setTimeLeft(sessionSeconds);
      rocketYRef.current = 0;
      rocketVelRef.current = 0;
    }
    setIsRunning(true);
  };
  const handlePause = () => setIsRunning(false);
  const handleAbortClick = () => {
    if (!isRunning && elapsed === 0) return;
    setIsRunning(false);
    setShowAbortModal(true);
  };
  const confirmAbort = () => {
    setShowAbortModal(false);
    setPhase("aborted");
    rocketYRef.current = 0;
    rocketVelRef.current = 0;
    if (rocketAudioRef.current) {
      rocketAudioRef.current.pause();
      rocketAudioRef.current.currentTime = 0;
    }
  };
  const cancelAbort = () => {
    setShowAbortModal(false);
    if (timeLeft > 0 && phase !== "aborted") setIsRunning(true);
  };
  const handleReset = () => {
    setIsRunning(false);
    setPhase("idle");
    setTimeLeft(sessionSeconds);
    rocketYRef.current = 0;
    rocketVelRef.current = 0;
    if (rocketAudioRef.current) {
      rocketAudioRef.current.pause();
      rocketAudioRef.current.currentTime = 0;
    }
  };

  const formatTime = useCallback((s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }, []);

  const gantryLeftOpen = progress >= 0.25;
  const gantryRightOpen = progress >= 0.5;
  const gantryTopOpen = progress >= 0.75;

  const shakeClass =
    phase === "hot" && isRunning
      ? "shake-soft"
      : phase === "launch"
        ? "shake-medium"
        : phase === "aborted"
          ? "shake-hard"
          : "";

  const trailIntensity =
    phase === "hot"
      ? 0.65
      : phase === "launch" || phase === "complete"
        ? 1.3
        : phase === "countdown"
          ? 0.25 + progress * 0.55
          : 0;

  const altitudeKm = Math.round(progress * 408);
  const velocityKms = (progress * 7.8).toFixed(2);
  const sessionMinutes = Math.round(sessionSeconds / 60);

  return (
    <div className="w-full bg-black text-cyan-50 overflow-hidden">
      <Navbar />

      {/* =========================================================
          🚀 HERO — ROCKET LAUNCH SCENE
         ========================================================= */}
      <section
        id="timer"
        ref={heroRef}
        className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden galaxy-bg ${shakeClass}`}
      >
        <div className="pointer-events-none absolute inset-0 galaxy-gas-1" />
        <div className="pointer-events-none absolute inset-0 galaxy-gas-2" />
        <div className="pointer-events-none absolute inset-0 galaxy-gas-3" />
        <div className="pointer-events-none absolute inset-0 galaxy-gas-4" />

        <div className="pointer-events-none absolute inset-0 nebula-core" />
        <div className="pointer-events-none absolute inset-0 dust-lane" />
        <div className="pointer-events-none absolute inset-0 galaxy-vignette" />

        <canvas ref={starRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute bottom-0 left-0 right-0 h-[42%] perspective-floor" />
        <canvas
          ref={particleRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {phase === "aborted" && (
          <div className="absolute inset-0 alert-red pointer-events-none" />
        )}

        {/* ============ TOP BAR ============ */}
        <div className="absolute top-3 sm:top-4 left-0 right-0 flex items-center justify-between px-3 sm:px-5 z-30">
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-cyan-300/90 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_12px_#f43f5e]" />
            </span>
            <span className="hidden sm:inline">ORBITAL LAUNCH · SYS v8.0</span>
            <span className="sm:hidden">SYS v8.0</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTimerPanel((s) => !s)}
              disabled={isRunning}
              className={`rounded-md border px-2.5 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-mono transition ${
                isRunning
                  ? "border-cyan-400/10 bg-cyan-950/20 text-cyan-300/30 cursor-not-allowed"
                  : "border-cyan-400/40 bg-cyan-950/40 text-cyan-200 hover:bg-cyan-900/50"
              }`}
            >
              ⏱ {sessionMinutes}M
            </button>
            <button
              onClick={() => setMusicOn((m) => !m)}
              className="rounded-md border border-cyan-400/30 bg-cyan-950/40 px-2.5 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-cyan-200 backdrop-blur hover:bg-cyan-900/50 transition font-mono"
            >
              {musicOn ? "◉ ON" : "○ OFF"}
            </button>
          </div>
        </div>

        {/* ============ TIMER SETTER MODAL ============ */}
        {showTimerPanel && !isRunning && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_.2s_ease]">
            <div className="w-full max-w-md rounded-2xl border border-cyan-400/40 bg-gradient-to-b from-[#071321] to-[#050b14] p-5 sm:p-6 shadow-[0_0_80px_rgba(34,211,238,0.45)] animate-[panelRise_.3s_ease-out]">
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-cyan-200 font-mono">
                  <span className="inline-block h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
                  SET MISSION DURATION
                </div>
                <button
                  onClick={() => setShowTimerPanel(false)}
                  className="text-cyan-400/60 hover:text-cyan-100 text-lg leading-none transition"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4 sm:mb-5">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-cyan-400/60 font-mono mb-2 sm:mb-3">
                  QUICK PRESETS
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_MINUTES.map((m) => (
                    <button
                      key={m}
                      onClick={() => applyDuration(m)}
                      className={`rounded-lg border-2 py-2.5 sm:py-3 text-[12px] sm:text-[13px] font-mono tracking-widest transition ${
                        sessionMinutes === m
                          ? "border-cyan-300 bg-cyan-500/25 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.7)] scale-[1.03]"
                          : "border-cyan-400/20 bg-cyan-950/40 text-cyan-300/80 hover:bg-cyan-900/50 hover:text-cyan-100 hover:border-cyan-400/50"
                      }`}
                    >
                      {m}M
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4 sm:mb-5">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-cyan-400/60 font-mono mb-2 sm:mb-3">
                  CUSTOM (1 – 180 MIN)
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={customMin}
                    onChange={(e) => setCustomMin(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCustomApply()}
                    placeholder="Minutes…"
                    className="flex-1 rounded-lg border-2 border-cyan-400/30 bg-cyan-950/40 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base font-mono text-cyan-100 placeholder:text-cyan-500/40 focus:outline-none focus:border-cyan-300 focus:bg-cyan-950/60 transition"
                  />
                  <button
                    onClick={handleCustomApply}
                    className="rounded-lg bg-gradient-to-r from-cyan-400 to-sky-400 px-4 sm:px-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-slate-950 hover:scale-[1.04] active:scale-95 transition font-mono shadow-[0_0_25px_rgba(34,211,238,0.6)]"
                  >
                    SET
                  </button>
                </div>
              </div>

              <div className="pt-3 sm:pt-4 border-t border-cyan-400/15 flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-widest">
                <span className="text-cyan-400/60">CURRENT:</span>
                <span className="text-cyan-100 text-base sm:text-lg">
                  {formatTime(sessionSeconds)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============ HUD SIDES ============ */}
        <div className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-5 text-[11px] tracking-[0.3em] uppercase text-cyan-400/60 font-mono">
          <HUDReadout
            label="FUEL"
            value={`${Math.round((1 - progress) * 100)}%`}
            bar={1 - progress}
          />
          <HUDReadout
            label="THRUST"
            value={`${Math.round(progress * 100)}%`}
            bar={progress}
          />
          <HUDReadout
            label="CORE"
            value={
              phase === "aborted"
                ? "CRITICAL"
                : phase === "complete"
                  ? "ORBIT"
                  : isRunning
                    ? "STABLE"
                    : "IDLE"
            }
            danger={phase === "aborted"}
          />
          <HUDReadout
            label="GRAV"
            value={`${(1 - progress * 0.98).toFixed(2)}g`}
          />
        </div>

        <div className="hidden lg:flex absolute right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-5 text-right text-[11px] tracking-[0.3em] uppercase text-cyan-400/60 font-mono">
          <HUDReadout label="PHASE" value={phase.toUpperCase()} align="right" />
          <HUDReadout label="ALT" value={`${altitudeKm}km`} align="right" />
          <HUDReadout label="VEL" value={`${velocityKms}km/s`} align="right" />
          <HUDReadout
            label="STATUS"
            value={
              isRunning ? "ASCENT" : phase === "complete" ? "DOCKED" : "HOLD"
            }
            align="right"
          />
        </div>

        {/* ============ MISSION COMPLETE ============ */}
        {phase === "complete" && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pointer-events-none px-4">
            <div className="mission-complete-glow absolute inset-0" />
            <div className="relative flex flex-col items-center animate-[completeRise_1.2s_ease-out] text-center">
              <div className="text-6xl sm:text-7xl mb-3 sm:mb-4 complete-icon">
                🛰️
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.5em] sm:tracking-[0.7em] text-cyan-300/80 font-mono mb-2 sm:mb-3">
                MISSION STATUS
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-light uppercase tracking-[0.15em] sm:tracking-[0.3em] text-cyan-50 font-mono drop-shadow-[0_0_35px_rgba(34,211,238,1)]">
                MISSION COMPLETE
              </h2>
              <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-cyan-300/70 font-mono mt-3 sm:mt-4">
                {sessionMinutes} MIN · ORBIT ACHIEVED · 408KM
              </div>
              <div className="mt-6 sm:mt-8 h-[2px] w-32 sm:w-40 bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
            </div>
          </div>
        )}

        {/* ============ MAIN ============ */}
        <div className="relative z-20 flex flex-col items-center w-full max-w-3xl px-3 sm:px-4 py-16 sm:py-20">
          <div className="relative text-center mb-2 sm:mb-3 px-6 sm:px-10 py-4 sm:py-6 hud-frame">
            <span className="hud-corner hud-corner-tl" />
            <span className="hud-corner hud-corner-tr" />
            <span className="hud-corner hud-corner-bl" />
            <span className="hud-corner hud-corner-br" />

            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.7em] text-cyan-300/70 font-mono mb-1 sm:mb-2">
              {phase === "idle"
                ? `${sessionMinutes} MIN MISSION READY`
                : phase === "aborted"
                  ? "MISSION ABORTED"
                  : phase === "complete"
                    ? "ORBIT ACHIEVED"
                    : phase === "launch"
                      ? "LIFTOFF"
                      : "T · MINUS"}
            </div>
            <div className="relative inline-block">
              <div className="text-[56px] xs:text-[64px] sm:text-[96px] md:text-[124px] leading-none font-light tabular-nums text-cyan-50 tracking-tight font-mono drop-shadow-[0_0_40px_rgba(34,211,238,0.9)]">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mb-4 sm:mb-6">
            <div className="flex items-center justify-between text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.3em] uppercase text-cyan-300/70 font-mono mb-1.5 sm:mb-2">
              <span>ORBITAL INSERTION</span>
              <span>
                {String(Math.round(progress * 100)).padStart(3, "0")}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-cyan-950/70 overflow-hidden border border-cyan-400/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-fuchsia-400 shadow-[0_0_14px_rgba(34,211,238,0.9)]"
                style={{
                  width: `${progress * 100}%`,
                  transition: "width 0.4s linear",
                }}
              />
            </div>
          </div>

          {/* ROCKET SCENE */}
          <div
            className="relative w-[260px] h-[420px] xs:w-[290px] xs:h-[470px] sm:w-[320px] sm:h-[540px]"
            style={{ perspective: "900px", perspectiveOrigin: "50% 40%" }}
          >
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[240px] xs:w-[270px] sm:w-[300px] h-[40px] sm:h-[46px] pad-3d" />
            <div className="absolute bottom-[32px] sm:bottom-[38px] left-1/2 -translate-x-1/2 w-[210px] xs:w-[240px] sm:w-[260px] h-[8px] sm:h-[10px] pad-top-3d" />

            {trailIntensity > 0.1 && (
              <div
                className="thrust-trail absolute left-1/2 -translate-x-1/2 pointer-events-none"
                style={{
                  width: (90 + trailIntensity * 40) * 0.85,
                  bottom: 34,
                  height: Math.max(60, -rocketY + 100),
                  opacity: Math.min(1, trailIntensity * 0.85),
                  transition: "height 0.25s linear",
                }}
              />
            )}

            <div
              className="absolute inset-0"
              style={{ opacity: Math.max(0, 1 - progress * 2) }}
            >
              <Gantry3D position="left" open={gantryLeftOpen} />
              <Gantry3D position="right" open={gantryRightOpen} />
              <Gantry3D position="top" open={gantryTopOpen} />
            </div>

            <div
              className="absolute bottom-[40px] sm:bottom-[46px] left-1/2 -translate-x-1/2 z-10"
              style={{
                transform: `translate3d(-50%, ${rocketY}px, 0) scale(${
                  1 - Math.min(0.5, progress * 0.35)
                })`,
                willChange: "transform",
              }}
            >
              <Rocket3D
                phase={phase}
                progress={progress}
                aborted={phase === "aborted"}
              />
            </div>

            {phase === "aborted" && (
              <div className="absolute bottom-[25px] left-1/2 -translate-x-1/2 w-[220px] sm:w-[260px] h-[120px] sm:h-[140px] pointer-events-none">
                <SmokeCloud />
              </div>
            )}
          </div>

          {/* CONTROLS */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full max-w-md">
            <button
              onClick={() => setShowTimerPanel((s) => !s)}
              disabled={isRunning}
              className={`btn-secondary flex-1 min-w-[130px] sm:min-w-[150px] ${
                isRunning ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                ⏱ <span className="hidden xs:inline">SET</span> TIMER
                <span className="rounded bg-cyan-400/25 px-1.5 py-0.5 text-[9px] sm:text-[10px] text-cyan-100">
                  {sessionMinutes}M
                </span>
              </span>
            </button>

            {!isRunning ? (
              <button
                onClick={handleStart}
                disabled={phase === "aborted"}
                className="btn-primary flex-1 min-w-[130px] sm:min-w-[150px]"
              >
                <span className="relative z-10">
                  {elapsed === 0
                    ? `▲ IGNITE`
                    : phase === "complete"
                      ? "▲ NEW"
                      : "▲ RESUME"}
                </span>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="btn-secondary flex-1 min-w-[130px] sm:min-w-[150px]"
              >
                <span className="relative z-10">⏸ HOLD</span>
              </button>
            )}

            <button
              onClick={handleAbortClick}
              className="btn-danger flex-1 min-w-[100px] sm:min-w-[120px]"
            >
              <span className="relative z-10">✕ ABORT</span>
            </button>

            {phase === "aborted" && (
              <button
                onClick={handleReset}
                className="btn-secondary flex-1 min-w-[110px]"
              >
                <span className="relative z-10">↻ REBUILD</span>
              </button>
            )}
          </div>

          {/* 🖥️ Fullscreen button — BELOW CONTROLS */}
          <div className="mt-5 sm:mt-6 flex items-center justify-center">
            <button
              onClick={toggleFullscreen}
              className="group flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-950/40 px-5 py-2.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.3em] text-cyan-200 backdrop-blur hover:bg-cyan-900/60 hover:border-cyan-300 transition"
            >
              {isFullscreen ? (
                <>
                  <span className="text-cyan-300">⤡</span>
                  EXIT FULLSCREEN
                </>
              ) : (
                <>
                  <span className="text-cyan-300">⤢</span>
                  ENTER FULLSCREEN
                </>
              )}
            </button>
          </div>
        </div>

        {/* ABORT MODAL */}
        {showAbortModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-gradient-to-b from-[#1a0508] to-[#0a0203] p-6 sm:p-8 text-center shadow-[0_0_60px_rgba(244,63,94,0.4)]">
              <div className="mx-auto mb-3 sm:mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-rose-500/10 text-3xl sm:text-4xl animate-pulse">
                ⚠
              </div>
              <h3 className="glitch-text mb-2 sm:mb-3 text-base sm:text-lg font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-rose-300 font-mono">
                CORE MELTDOWN
              </h3>
              <p className="mb-5 sm:mb-6 text-xs sm:text-sm leading-relaxed text-rose-200/70 font-mono">
                Aborting will destroy the vessel. All mission progress will be
                lost. Confirm abort?
              </p>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={cancelAbort}
                  className="flex-1 rounded-md bg-gradient-to-r from-cyan-400 to-sky-400 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-slate-950 transition hover:scale-[1.03] active:scale-95 font-mono"
                >
                  Continue
                </button>
                <button
                  onClick={confirmAbort}
                  className="flex-1 rounded-md border border-rose-400/40 py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] text-rose-200 transition hover:bg-rose-900/40 font-mono"
                >
                  Abort
                </button>
              </div>
            </div>
          </div>
        )}

        <audio ref={audioRef} loop preload="none">
          <source src="/sounds/animation.mp3" type="audio/mpeg" />
        </audio>
        <audio ref={rocketAudioRef} loop preload="auto">
          <source src="/sounds/rocket.mp3" type="audio/mpeg" />
        </audio>
      </section>


      {/* =========================================================
    📖 ABOUT SECTION — WHITE BACKGROUND
   ========================================================= */}
      <section
        id="about"
        className="relative bg-white text-neutral-800 px-5 sm:px-10 py-16 sm:py-24 border-t border-neutral-200"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/5 to-transparent" />

        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-cyan-600 font-semibold mb-3 sm:mb-4">
            About This Launch Timer
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-neutral-900 leading-tight mb-6 sm:mb-8">
            Set Your Mission Duration. Watch the Rocket Reach Orbit.
          </h2>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-neutral-600 mb-4 sm:mb-5">
            Focus sessions are not all the same. Sometimes you need a quick
            five-minute sprint. Sometimes you need a full ninety-minute deep
            work dive. This launch timer was built to adapt to both. Before you
            start, you set your mission duration — five, fifteen, twenty-five,
            forty-five, sixty, ninety minutes, or any custom length up to three
            hours. Whatever you choose, the entire animation rewrites itself
            around your number.
          </p>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-neutral-600 mb-4 sm:mb-5">
            The scene opens in deep cosmic silence. A soft galaxy of purple and
            cyan gas drifts behind hundreds of twinkling stars scattered at
            different depths inside a real three-dimensional field. At the
            center of everything sits a glowing nebula cloud, quietly breathing
            light into the void. A sleek matte-black rocket rests between three
            mechanical gantry arms, its red beacon lights pulsing in slow
            rhythm. You press{" "}
            <em className="text-cyan-700 not-italic font-medium">
              Ignite Sequence
            </em>
            , and the mission begins.
          </p>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-neutral-600 mb-4 sm:mb-5">
            And here is where the real magic happens. The rocket does not sit
            still while the timer ticks. The moment you start, it begins to
            climb. Slowly at first, then faster. Every second that passes, every
            minute of focus you give, the ship rises a little higher in the
            frame. The altitude readout climbs from zero to four hundred and
            eight kilometers. The velocity indicator accelerates from zero to
            seven point eight kilometers per second. The gantry arms release one
            by one at twenty-five, fifty, and seventy-five percent of your
            session. A soft rocket rumble begins to hum in the background,
            growing louder as liftoff approaches.
          </p>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-neutral-600 mb-4 sm:mb-5">
            If you press pause, the rocket slows, then begins to fall — pulled
            back toward the pad by a gentle gravity, the exhaust flickering
            lower, the thrust trail shrinking. It settles back onto the launch
            platform and waits. Press resume, and it rises again from exactly
            where it fell. Focus earns height. Distraction loses it.
          </p>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-neutral-600 mb-4 sm:mb-5">
            When the countdown hits zero, the rocket continues its ascent and
            disappears completely off the top of the screen, leaving behind a
            single beautiful message:{" "}
            <em className="text-cyan-700 not-italic font-medium">
              Mission Complete · Orbit Achieved
            </em>
            . The stars stretch into warp-speed streaks, and the HUD confirms
            your final insertion parameters — including the exact mission
            duration you selected at the start.
          </p>

          <p className="text-sm sm:text-base md:text-lg leading-relaxed text-neutral-600">
            Every animation runs on{" "}
            <code className="px-1.5 py-0.5 rounded bg-neutral-100 text-cyan-700 text-xs sm:text-sm font-mono">
              requestAnimationFrame
            </code>{" "}
            at a locked sixty frames per second, the starfield now layers in a
            soft Milky Way band and occasional shooting stars for depth, and the
            rocket's roar plays from a real recorded engine sample layered over
            a synthesized sub-bass rumble from the Web Audio API. The result is
            a focus timer that does not just track time — it makes time feel
            worth spending, however long you choose.
          </p>
        </div>
      </section>

      {/* =========================================================
          🦶 FOOTER
         ========================================================= */}
      <Footer />

      {/* STYLES */}
      <style>{`
        .galaxy-bg { background: #000207; }

        .galaxy-gas-1 {
          background: radial-gradient(ellipse 55% 45% at 20% 25%, rgba(88,28,135,0.35), transparent 65%);
          animation: gasDrift1 55s ease-in-out infinite;
          mix-blend-mode: screen;
          filter: blur(40px);
        }
        .galaxy-gas-2 {
          background: radial-gradient(ellipse 60% 50% at 80% 75%, rgba(30,64,175,0.32), transparent 65%);
          animation: gasDrift2 70s ease-in-out infinite;
          mix-blend-mode: screen;
          filter: blur(50px);
        }
        .galaxy-gas-3 {
          background: radial-gradient(ellipse 45% 40% at 60% 40%, rgba(8,145,178,0.22), transparent 65%);
          animation: gasDrift3 85s ease-in-out infinite;
          mix-blend-mode: screen;
          filter: blur(60px);
        }
        .galaxy-gas-4 {
          background: radial-gradient(ellipse 50% 40% at 35% 62%, rgba(219,39,119,0.16), transparent 70%);
          animation: gasDrift4 95s ease-in-out infinite;
          mix-blend-mode: screen;
          filter: blur(55px);
        }

        .nebula-core {
          background:
            radial-gradient(ellipse 40% 30% at 50% 45%, rgba(139,92,246,0.18), transparent 70%),
            radial-gradient(ellipse 55% 35% at 50% 50%, rgba(59,130,246,0.15), transparent 75%),
            radial-gradient(ellipse 30% 22% at 50% 42%, rgba(6,182,212,0.14), transparent 70%);
          animation: nebulaBreathe 12s ease-in-out infinite;
          mix-blend-mode: screen;
          filter: blur(35px);
        }
        @keyframes nebulaBreathe {
          0%,100% { opacity: 0.85; transform: scale(1); }
          50%     { opacity: 1; transform: scale(1.06); }
        }

        .dust-lane {
          background: linear-gradient(115deg, transparent 32%, rgba(0,0,0,0.32) 48%, rgba(0,0,0,0.46) 52%, transparent 68%);
          mix-blend-mode: multiply;
          opacity: 0.6;
        }

        .galaxy-vignette {
          background: radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.78) 100%);
        }

        @keyframes gasDrift1 { 0%,100% { transform: translate3d(0,0,0) scale(1);} 50% { transform: translate3d(60px,-40px,0) scale(1.15);} }
        @keyframes gasDrift2 { 0%,100% { transform: translate3d(0,0,0) scale(1);} 50% { transform: translate3d(-70px,50px,0) scale(1.2);} }
        @keyframes gasDrift3 { 0%,100% { transform: translate3d(0,0,0) scale(1);} 50% { transform: translate3d(40px,30px,0) scale(0.92);} }
        @keyframes gasDrift4 { 0%,100% { transform: translate3d(0,0,0) scale(1);} 50% { transform: translate3d(-50px,-30px,0) scale(1.1);} }

        @keyframes shakeSoft { 0%,100%{transform:translate3d(0,0,0)} 25%{transform:translate3d(-1.5px,1px,0)} 50%{transform:translate3d(1.5px,-1px,0)} 75%{transform:translate3d(-1px,1.5px,0)} }
        .shake-soft { animation: shakeSoft 0.22s linear infinite; }
        @keyframes shakeMedium { 0%,100%{transform:translate3d(0,0,0)} 25%{transform:translate3d(-3px,2px,0)} 50%{transform:translate3d(3px,-2px,0)} 75%{transform:translate3d(-2px,3px,0)} }
        .shake-medium { animation: shakeMedium 0.16s linear infinite; }
        @keyframes shakeHard { 0%,100%{transform:translate3d(0,0,0)} 20%{transform:translate3d(-5px,4px,0)} 40%{transform:translate3d(5px,-4px,0)} 60%{transform:translate3d(-4px,-5px,0)} 80%{transform:translate3d(4px,5px,0)} }
        .shake-hard { animation: shakeHard 0.12s linear infinite; }

        .pad-3d { background: linear-gradient(to bottom, #131b28, #020409); border: 1px solid rgba(34,211,238,0.22); border-radius: 6px; transform: perspective(500px) rotateX(38deg); box-shadow: 0 0 50px rgba(34,211,238,0.12), inset 0 -12px 30px rgba(0,0,0,0.95); }
        .pad-top-3d { background: linear-gradient(to bottom, rgba(34,211,238,0.28), rgba(34,211,238,0.01)); border-radius: 6px; filter: blur(1.5px); transform: perspective(500px) rotateX(28deg); }
        .perspective-floor {
          background:
            linear-gradient(to top, rgba(34,211,238,0.10), transparent 85%),
            repeating-linear-gradient(90deg, rgba(34,211,238,0.07) 0 1px, transparent 1px 60px);
          transform: perspective(400px) rotateX(72deg);
          transform-origin: bottom center;
          mask-image: linear-gradient(to top, black, transparent 92%);
          -webkit-mask-image: linear-gradient(to top, black, transparent 92%);
          pointer-events: none;
        }
        .thrust-trail {
          background: linear-gradient(to top,
            rgba(224,251,255,0.95) 0%,
            rgba(34,211,238,0.85) 18%,
            rgba(14,165,233,0.55) 45%,
            rgba(14,165,233,0.15) 75%,
            rgba(14,165,233,0) 100%);
          border-radius: 50px; filter: blur(14px); mix-blend-mode: screen;
          animation: trailPulse 0.5s ease-in-out infinite;
        }
        @keyframes trailPulse { 0%,100%{filter:blur(14px) brightness(1);} 50%{filter:blur(18px) brightness(1.25);} }

        @keyframes alertPulse { 0%,100%{background:rgba(244,63,94,0.05)} 50%{background:rgba(244,63,94,0.22)} }
        .alert-red { animation: alertPulse 0.6s ease-in-out infinite; }

        @keyframes smokeRise { 0% { transform: scale(0.6) translate3d(0,0,0); opacity: 0.9; } 100% { transform: scale(1.7) translate3d(0,-36px,0); opacity: 0; } }
        @keyframes glitch {
          0%,100% { transform: translate3d(0,0,0); text-shadow: 0 0 0 transparent; }
          20%     { transform: translate3d(-2px,0,0); text-shadow: 2px 0 #f43f5e, -2px 0 #22d3ee; }
          40%     { transform: translate3d(2px,0,0); text-shadow: -2px 0 #f43f5e, 2px 0 #22d3ee; }
          60%     { transform: translate3d(-1px,0,0); text-shadow: 1px 0 #f43f5e, -1px 0 #22d3ee; }
        }
        .glitch-text { animation: glitch 0.6s linear infinite; }

        @keyframes completeRise { 0% { transform: translate3d(0, 20px, 0); opacity: 0; } 100% { transform: translate3d(0, 0, 0); opacity: 1; } }
        .mission-complete-glow { background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,211,238,0.22), transparent 70%); animation: completeGlow 3s ease-in-out infinite; }
        @keyframes completeGlow { 0%,100% { opacity: 0.6; } 50% { opacity: 1; } }
        @keyframes completeIconFloat { 0%,100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-10px) scale(1.06); } }
        .complete-icon { animation: completeIconFloat 3s ease-in-out infinite; }

        @keyframes panelRise { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes flameFlicker { 0%,100% { transform: scaleY(1) translate3d(0,0,0); opacity: 0.95; } 50% { transform: scaleY(1.15) translate3d(0,-2px,0); opacity: 1; } }

        .hud-frame { position: relative; }
        .hud-corner { position: absolute; width: 16px; height: 16px; border: 2px solid rgba(34,211,238,0.6); pointer-events: none; }
        @media (min-width: 640px) { .hud-corner { width: 20px; height: 20px; } }
        .hud-corner-tl { top: 0; left: 0; border-right: none; border-bottom: none; }
        .hud-corner-tr { top: 0; right: 0; border-left: none; border-bottom: none; }
        .hud-corner-bl { bottom: 0; left: 0; border-right: none; border-top: none; }
        .hud-corner-br { bottom: 0; right: 0; border-left: none; border-top: none; }

        .btn-primary {
          position: relative;
          border-radius: 8px;
          padding: 12px 20px;
          font-family: ui-monospace, monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: #0b1320;
          background: linear-gradient(180deg, #67e8f9 0%, #22d3ee 45%, #0ea5e9 100%);
          box-shadow:
            0 0 0 1px rgba(103,232,249,0.6) inset,
            0 1px 0 rgba(255,255,255,0.55) inset,
            0 12px 26px rgba(34,211,238,0.35),
            0 0 40px rgba(34,211,238,0.5);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          overflow: hidden;
        }
        @media (min-width: 640px) {
          .btn-primary { padding: 14px 34px; font-size: 11px; letter-spacing: 0.28em; }
        }
        .btn-primary::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.35), transparent 45%);
          pointer-events: none;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow:
            0 0 0 1px rgba(103,232,249,0.8) inset,
            0 1px 0 rgba(255,255,255,0.6) inset,
            0 16px 34px rgba(34,211,238,0.5),
            0 0 60px rgba(34,211,238,0.7);
        }
        .btn-primary:active:not(:disabled) { transform: translateY(0) scale(0.98); }
        .btn-primary:disabled { opacity: 0.3; cursor: not-allowed; transform: none; }

        .btn-secondary {
          position: relative;
          border-radius: 8px;
          padding: 12px 16px;
          font-family: ui-monospace, monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: #a5f3fc;
          background: linear-gradient(180deg, rgba(8,47,73,0.85), rgba(3,20,32,0.9));
          border: 1px solid rgba(34,211,238,0.45);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 6px 20px rgba(0,0,0,0.5);
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        @media (min-width: 640px) {
          .btn-secondary { padding: 14px 24px; font-size: 11px; letter-spacing: 0.28em; }
        }
        .btn-secondary:hover:not(:disabled) {
          transform: translateY(-1px);
          background: linear-gradient(180deg, rgba(8,47,73,1), rgba(3,20,32,1));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 26px rgba(34,211,238,0.35), 0 0 30px rgba(34,211,238,0.35);
        }
        .btn-secondary:active:not(:disabled) { transform: translateY(0) scale(0.98); }

        .btn-danger {
          position: relative;
          border-radius: 8px;
          padding: 12px 16px;
          font-family: ui-monospace, monospace;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.22em;
          color: #fecdd3;
          background: linear-gradient(180deg, rgba(76,5,25,0.85), rgba(20,2,8,0.9));
          border: 1px solid rgba(244,63,94,0.45);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 20px rgba(0,0,0,0.5);
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        }
        @media (min-width: 640px) {
          .btn-danger { padding: 14px 24px; font-size: 11px; letter-spacing: 0.28em; }
        }
        .btn-danger:hover:not(:disabled) {
          transform: translateY(-1px);
          background: linear-gradient(180deg, rgba(76,5,25,1), rgba(20,2,8,1));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 10px 26px rgba(244,63,94,0.4), 0 0 30px rgba(244,63,94,0.45);
        }
        .btn-danger:active:not(:disabled) { transform: translateY(0) scale(0.98); }

        @media (min-width: 400px) {
          .xs\\:text-\\[64px\\] { font-size: 64px; }
          .xs\\:w-\\[290px\\] { width: 290px; }
          .xs\\:h-\\[470px\\] { height: 470px; }
          .xs\\:w-\\[270px\\] { width: 270px; }
          .xs\\:w-\\[240px\\] { width: 240px; }
          .xs\\:inline { display: inline; }
        }
      `}</style>
    </div>
  );
};

/* =========================================================
   HUD READOUT
   ========================================================= */
const HUDReadout = ({ label, value, bar, danger, align }) => (
  <div className={align === "right" ? "text-right" : ""}>
    <div className="text-cyan-400/50 mb-1">{label}</div>
    <div
      className={`text-sm ${
        danger ? "text-rose-400" : "text-cyan-100"
      } tracking-widest`}
    >
      {value}
    </div>
    {typeof bar === "number" && (
      <div
        className={`mt-1 h-[3px] w-24 rounded-full bg-cyan-950/70 overflow-hidden ${
          align === "right" ? "ml-auto" : ""
        }`}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 transition-all duration-700"
          style={{ width: `${bar * 100}%` }}
        />
      </div>
    )}
  </div>
);

/* =========================================================
   GANTRY 3D
   ========================================================= */
const Gantry3D = ({ position, open }) => {
  const base = {
    transition:
      "transform 1.2s cubic-bezier(0.34,1.56,0.64,1), opacity 1s ease",
    willChange: "transform",
  };
  const gantrySVG = (
    <svg viewBox="0 0 46 86" className="w-full h-full">
      <rect
        x="6"
        y="0"
        width="34"
        height="16"
        rx="3"
        fill="#1e293b"
        stroke="#22d3ee"
        strokeWidth="1"
        opacity="0.9"
      />
      <rect
        x="12"
        y="16"
        width="22"
        height="46"
        rx="2"
        fill="#0f172a"
        stroke="#334155"
        strokeWidth="1"
      />
      <circle cx="23" cy="40" r="3.5" fill="#f43f5e">
        <animate
          attributeName="opacity"
          values="0.25;1;0.25"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="23" cy="40" r="7" fill="#f43f5e" opacity="0.25">
        <animate
          attributeName="opacity"
          values="0.05;0.35;0.05"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </circle>
      <rect x="8" y="62" width="30" height="14" rx="2" fill="#334155" />
    </svg>
  );

  if (position === "left") {
    return (
      <div
        className="absolute bottom-[90px] sm:bottom-[110px] left-1/2 -translate-x-[130px] sm:-translate-x-[150px] w-[40px] sm:w-[46px] h-[74px] sm:h-[86px] z-10"
        style={{
          ...base,
          transform: open
            ? "translate3d(-60px, 40px, 0) rotate(-40deg)"
            : "translate3d(0,0,0)",
          opacity: open ? 0.15 : 1,
        }}
      >
        {gantrySVG}
      </div>
    );
  }
  if (position === "right") {
    return (
      <div
        className="absolute bottom-[90px] sm:bottom-[110px] left-1/2 translate-x-[86px] sm:translate-x-[104px] w-[40px] sm:w-[46px] h-[74px] sm:h-[86px] z-10"
        style={{
          ...base,
          transform: open
            ? "translate3d(60px, 40px, 0) rotate(40deg)"
            : "translate3d(0,0,0)",
          opacity: open ? 0.15 : 1,
        }}
      >
        {gantrySVG}
      </div>
    );
  }
  return (
    <div
      className="absolute top-[16px] sm:top-[20px] left-1/2 -translate-x-1/2 w-[56px] sm:w-[64px] h-[36px] sm:h-[42px] z-10"
      style={{
        ...base,
        transform: open
          ? "translate3d(0,-60px,0) rotate(22deg)"
          : "translate3d(0,0,0)",
        opacity: open ? 0 : 1,
      }}
    >
      <svg viewBox="0 0 64 42" className="w-full h-full">
        <rect
          x="10"
          y="10"
          width="44"
          height="16"
          rx="3"
          fill="#1e293b"
          stroke="#22d3ee"
          strokeWidth="1"
          opacity="0.9"
        />
        <rect
          x="26"
          y="26"
          width="12"
          height="14"
          rx="2"
          fill="#0f172a"
          stroke="#334155"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

/* =========================================================
   ROCKET 3D
   ========================================================= */
const Rocket3D = ({ phase, progress, aborted }) => {
  const flameIntensity =
    phase === "hot"
      ? 0.65 + (1 - Math.min(1, progress)) * 0.1
      : phase === "launch" || phase === "complete"
        ? 1.15
        : phase === "countdown"
          ? 0.25
          : 0;

  return (
    <div
      className="relative"
      style={{
        width: 130,
        height: 300,
        willChange: "transform",
        transform: aborted
          ? "rotate(9deg) translate3d(6px,14px,0)"
          : "rotate(0deg)",
        transition: "transform 1.4s cubic-bezier(0.6,0.05,0.9,0.4)",
        filter: "drop-shadow(0 12px 24px rgba(34,211,238,0.15))",
      }}
    >
      <svg viewBox="0 0 150 340" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="bodyGrad3D" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#050810" />
            <stop offset="18%" stopColor="#0f1826" />
            <stop offset="42%" stopColor="#2a3648" />
            <stop offset="58%" stopColor="#334155" />
            <stop offset="80%" stopColor="#0f1826" />
            <stop offset="100%" stopColor="#020409" />
          </linearGradient>
          <linearGradient id="noseGrad3D" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#020409" />
            <stop offset="40%" stopColor="#475569" />
            <stop offset="60%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#020409" />
          </linearGradient>
          <linearGradient id="flameGrad3D" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0fbff" />
            <stop offset="25%" stopColor="#22d3ee" />
            <stop offset="65%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="rgba(14,165,233,0)" />
          </linearGradient>
          <radialGradient id="coreGlow3D" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="45%" stopColor="#22d3ee" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="redGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4d6d" stopOpacity="1" />
            <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {flameIntensity > 0.05 && (
          <g
            style={{
              transformOrigin: "75px 280px",
              animation: "flameFlicker 0.16s ease-in-out infinite",
            }}
          >
            <ellipse
              cx="75"
              cy="310"
              rx={26 + flameIntensity * 10}
              ry={64 + flameIntensity * 80}
              fill="url(#flameGrad3D)"
              opacity={0.85 * flameIntensity}
            />
            <ellipse
              cx="75"
              cy="295"
              rx={16 + flameIntensity * 5}
              ry={38 + flameIntensity * 36}
              fill="#e0fbff"
              opacity={0.85 * flameIntensity}
            />
            <circle
              cx="75"
              cy="282"
              r={22 + flameIntensity * 14}
              fill="url(#coreGlow3D)"
              opacity={flameIntensity}
            />
          </g>
        )}

        <path
          d="M 30 250 L 6 300 L 30 290 Z"
          fill="#0a0f18"
          stroke="rgba(34,211,238,0.5)"
          strokeWidth="1"
        />
        <path
          d="M 120 250 L 144 300 L 120 290 Z"
          fill="#0a0f18"
          stroke="rgba(34,211,238,0.5)"
          strokeWidth="1"
        />

        <path
          d="M 75 30 C 108 62, 120 130, 120 210 L 120 268 Q 120 282, 106 282 L 44 282 Q 30 282, 30 268 L 30 210 C 30 130, 42 62, 75 30 Z"
          fill="url(#bodyGrad3D)"
          stroke="rgba(34,211,238,0.45)"
          strokeWidth="1.2"
        />

        <path
          d="M 75 30 C 98 52, 110 90, 114 130 L 36 130 C 40 90, 52 52, 75 30 Z"
          fill="url(#noseGrad3D)"
          opacity="0.9"
        />

        <ellipse
          cx="75"
          cy="100"
          rx="17"
          ry="26"
          fill="#020610"
          stroke="rgba(34,211,238,0.7)"
          strokeWidth="1.3"
        />
        <ellipse
          cx="75"
          cy="100"
          rx="11"
          ry="17"
          fill="rgba(34,211,238,0.18)"
        />
        <ellipse
          cx="70"
          cy="92"
          rx="3.5"
          ry="6"
          fill="rgba(224,251,255,0.55)"
        />

        <line
          x1="40"
          y1="160"
          x2="110"
          y2="160"
          stroke="rgba(34,211,238,0.22)"
          strokeWidth="0.9"
        />
        <line
          x1="36"
          y1="205"
          x2="114"
          y2="205"
          stroke="rgba(34,211,238,0.22)"
          strokeWidth="0.9"
        />
        <line
          x1="36"
          y1="240"
          x2="114"
          y2="240"
          stroke="rgba(34,211,238,0.22)"
          strokeWidth="0.9"
        />
        <line
          x1="36"
          y1="262"
          x2="114"
          y2="262"
          stroke="rgba(34,211,238,0.22)"
          strokeWidth="0.9"
        />
        <line
          x1="75"
          y1="45"
          x2="75"
          y2="270"
          stroke="rgba(224,251,255,0.06)"
          strokeWidth="6"
        />

        <circle cx="46" cy="150" r="10" fill="url(#redGlow)" opacity="0.9">
          <animate
            attributeName="opacity"
            values="0.15;0.9;0.15"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="46" cy="150" r="3" fill="#ff4d6d">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="104" cy="150" r="10" fill="url(#redGlow)" opacity="0.9">
          <animate
            attributeName="opacity"
            values="0.9;0.15;0.9"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="104" cy="150" r="3" fill="#ff4d6d">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="42" cy="200" r="9" fill="url(#redGlow)" opacity="0.9">
          <animate
            attributeName="opacity"
            values="0.15;0.9;0.15"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="42" cy="200" r="2.6" fill="#ff4d6d">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="108" cy="200" r="9" fill="url(#redGlow)" opacity="0.9">
          <animate
            attributeName="opacity"
            values="0.9;0.15;0.9"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="108" cy="200" r="2.6" fill="#ff4d6d">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        <circle cx="75" cy="256" r="8" fill="url(#redGlow)" opacity="0.9">
          <animate
            attributeName="opacity"
            values="0.15;0.9;0.15"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="75" cy="256" r="2.4" fill="#ff4d6d">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1.2s"
            repeatCount="indefinite"
          />
        </circle>

        <rect
          x="42"
          y="282"
          width="18"
          height="12"
          rx="2.5"
          fill="#0a0f18"
          stroke="rgba(244,63,94,0.5)"
          strokeWidth="1.1"
        />
        <rect
          x="90"
          y="282"
          width="18"
          height="12"
          rx="2.5"
          fill="#0a0f18"
          stroke="rgba(244,63,94,0.5)"
          strokeWidth="1.1"
        />
        <rect
          x="63"
          y="282"
          width="24"
          height="14"
          rx="3"
          fill="#0a0f18"
          stroke="rgba(244,63,94,0.8)"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
};

/* =========================================================
   SMOKE
   ========================================================= */
const SmokeCloud = () => {
  const puffs = [
    { cx: 44, cy: 78, r: 30, delay: 0 },
    { cx: 88, cy: 66, r: 36, delay: 0.1 },
    { cx: 132, cy: 78, r: 32, delay: 0.2 },
    { cx: 66, cy: 100, r: 38, delay: 0.05 },
    { cx: 110, cy: 98, r: 34, delay: 0.15 },
    { cx: 154, cy: 100, r: 24, delay: 0.25 },
    { cx: 32, cy: 102, r: 24, delay: 0.2 },
  ];
  return (
    <svg viewBox="0 0 190 130" className="w-full h-full">
      {puffs.map((p, i) => (
        <circle
          key={i}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill="rgba(100,116,139,0.55)"
          style={{
            filter: "blur(7px)",
            animation: `smokeRise 1.9s ease-out ${p.delay}s infinite`,
            transformOrigin: `${p.cx}px ${p.cy}px`,
          }}
        />
      ))}
    </svg>
  );
};

export default Animation2;
