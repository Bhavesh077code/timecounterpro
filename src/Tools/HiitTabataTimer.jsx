import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

const HiitTabataTimer = () => {
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(15);
  const [cycles, setCycles] = useState(8);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const audioCtxRef = useRef(null);
  const lastBeepSecondRef = useRef(-1);
  const intervalRef = useRef(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const playBeep = useCallback(() => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 880;
      gain.gain.value = 0.15;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }, [initAudio]);

  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPhase('idle');
    setCurrentCycle(0);
    setTimeLeft(workTime);
    setIsPaused(false);
    setIsRunning(false);
    lastBeepSecondRef.current = -1;
  }, [workTime]);

  const startTimer = useCallback(() => {
    initAudio();
    if (isPaused && phase !== 'idle') {
      setIsPaused(false);
      setIsRunning(true);
      return;
    }
    if (isRunning) return;
    if (phase === 'idle') {
      setCurrentCycle(0);
      setPhase('work');
      setTimeLeft(workTime);
      lastBeepSecondRef.current = -1;
      setIsRunning(true);
    } else {
      setIsRunning(true);
    }
  }, [isPaused, isRunning, phase, workTime, initAudio]);

  const pauseTimer = useCallback(() => {
    if (phase !== 'idle' && !isPaused) {
      setIsPaused(true);
      setIsRunning(false);
    }
  }, [phase, isPaused]);

  useEffect(() => {
    if (!isRunning || isPaused || phase === 'idle') return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 3 && prev > 0 && lastBeepSecondRef.current !== prev) {
          playBeep();
          lastBeepSecondRef.current = prev;
        }
        const next = prev - 1;
        if (next <= 0) {
          if (phase === 'work') {
            setPhase('rest');
            lastBeepSecondRef.current = -1;
            return restTime;
          } else if (phase === 'rest') {
            const nextCycle = currentCycle + 1;
            if (nextCycle >= cycles) {
              setPhase('idle');
              setCurrentCycle(0);
              setIsRunning(false);
              playBeep();
              return 0;
            } else {
              setCurrentCycle(nextCycle);
              setPhase('work');
              lastBeepSecondRef.current = -1;
              return workTime;
            }
          }
        }
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isPaused, phase, currentCycle, cycles, workTime, restTime, playBeep]);

  useEffect(() => {
    if (phase === 'idle') setTimeLeft(workTime);
  }, [workTime, phase]);

  const getProgress = () => {
    if (phase === 'work' && workTime > 0) return 1 - timeLeft / workTime;
    if (phase === 'rest' && restTime > 0) return 1 - timeLeft / restTime;
    return 0;
  };
  const progress = Math.min(1, Math.max(0, getProgress()));
  const circumference = 2 * Math.PI * 88;
  const dashOffset = circumference * (1 - progress);

  const isWork = phase === 'work';
  const isRest = phase === 'rest';

  const accentColor = isRest ? '#f59e0b' : isWork ? '#10b981' : '#6366f1';
  const phaseLabel = isWork ? 'Work' : isRest ? 'Rest' : 'Idle';
  const phaseSubLabel = isWork ? 'Give it everything' : isRest ? 'Breathe and recover' : 'Ready when you are';

  const handleWorkChange = (e) => setWorkTime(Math.max(1, Math.min(300, parseInt(e.target.value) || 1)));
  const handleRestChange = (e) => setRestTime(Math.max(1, Math.min(300, parseInt(e.target.value) || 1)));
  const handleCyclesChange = (e) => setCycles(Math.max(1, Math.min(99, parseInt(e.target.value) || 1)));

  return (
    <div>
        <Navbar />
    <div
      className="min-h-screen w-full py-4 px-4 md:py-7 md:px-7"
      style={{
        background: '#f7f7f5',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, sans-serif',
      }}
    >
      <div className="max-w-5xl mx-auto">

        {/* ===== HEADER ===== */}
        <div className="mb-10 md:mb-16">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-3"
            style={{ color: '#9ca3af' }}
          >
            Interval Training
          </p>
          <h1
            className="text-3xl md:text-5xl font-light tracking-tight"
            style={{ color: '#1a1a1a', letterSpacing: '-0.02em' }}
          >
            HIIT & Tabata Timer
          </h1>
          <p
            className="mt-3 text-sm md:text-base max-w-xl leading-relaxed"
            style={{ color: '#6b7280' }}
          >
            A simple, focused timer for high-intensity interval training. Set your
            work and rest periods, choose the number of cycles, and begin.
          </p>
        </div>

        {/* ===== MAIN GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">

          {/* ===== LEFT: TIMER ===== */}
          <div className="lg:col-span-3">
            <div
              className="rounded-3xl p-8 md:p-12"
              style={{
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.04)',
              }}
            >
              {/* Phase Label */}
              <div className="flex items-baseline justify-between mb-8">
                <div>
                  <p
                    className="text-xs tracking-[0.15em] uppercase mb-1 transition-colors duration-300"
                    style={{ color: accentColor }}
                  >
                    {phaseLabel}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: '#9ca3af' }}
                  >
                    {phaseSubLabel}
                  </p>
                </div>
                <p
                  className="text-xs tracking-wide tabular-nums"
                  style={{ color: '#9ca3af' }}
                >
                  {phase === 'idle' ? `0 / ${cycles}` : `${currentCycle + 1} / ${cycles}`}
                </p>
              </div>

              {/* Circular Ring + Timer */}
              <div className="flex flex-col items-center my-6">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="88"
                      fill="none"
                      stroke="#f1f1ef"
                      strokeWidth="6"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="88"
                      fill="none"
                      stroke={accentColor}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      style={{
                        transition:
                          'stroke-dashoffset 0.2s linear, stroke 0.4s ease',
                      }}
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-6xl sm:text-7xl md:text-8xl font-light tabular-nums"
                      style={{
                        color: '#1a1a1a',
                        letterSpacing: '-0.04em',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {formatTime(phase === 'idle' ? workTime : timeLeft)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thin progress line under timer */}
              <div
                className="w-full h-px mt-8 mb-8 overflow-hidden"
                style={{ background: '#f1f1ef' }}
              >
                <div
                  className="h-full"
                  style={{
                    width: `${progress * 100}%`,
                    backgroundColor: accentColor,
                    transition: 'width 0.2s linear, background-color 0.3s ease',
                  }}
                />
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={isRunning && !isPaused ? pauseTimer : startTimer}
                  className="flex-1 font-medium py-4 px-8 rounded-full text-white transition-all duration-200 active:scale-[0.98] hover:opacity-90"
                  style={{
                    background: '#1a1a1a',
                    fontSize: '15px',
                    letterSpacing: '0.02em',
                  }}
                >
                  {isRunning && !isPaused
                    ? 'Pause'
                    : isPaused
                    ? 'Resume'
                    : 'Start Session'}
                </button>

                <button
                  onClick={resetTimer}
                  className="font-medium py-4 px-8 rounded-full transition-all duration-200 active:scale-[0.98] hover:bg-black/[0.03]"
                  style={{
                    background: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #e5e5e3',
                    fontSize: '15px',
                    letterSpacing: '0.02em',
                  }}
                >
                  Reset
                </button>
              </div>

              <p
                className="text-center text-xs mt-6"
                style={{ color: '#b8b8b4' }}
              >
                Soft beep plays during the final 3 seconds of each interval.
              </p>
            </div>
          </div>

          {/* ===== RIGHT: SETTINGS ===== */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Settings Card */}
            <div
              className="rounded-3xl p-7 md:p-8"
              style={{
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-baseline justify-between mb-6">
                <h2
                  className="text-sm tracking-[0.15em] uppercase"
                  style={{ color: '#6b7280' }}
                >
                  Configuration
                </h2>
                {phase !== 'idle' && (
                  <span
                    className="text-[11px]"
                    style={{ color: '#b8b8b4' }}
                  >
                    locked
                  </span>
                )}
              </div>

              <div className="space-y-6">
                {/* Work */}
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <label
                      className="text-sm"
                      style={{ color: '#1a1a1a' }}
                    >
                      Work period
                    </label>
                    <span
                      className="text-xs"
                      style={{ color: '#9ca3af' }}
                    >
                      seconds
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={workTime}
                    onChange={handleWorkChange}
                    disabled={phase !== 'idle'}
                    className="w-full bg-transparent border-0 border-b py-2 text-3xl font-light tabular-nums focus:outline-none disabled:opacity-40 transition-all"
                    style={{
                      color: '#1a1a1a',
                      borderBottom: '1px solid #e5e5e3',
                      letterSpacing: '-0.02em',
                    }}
                  />
                </div>

                {/* Rest */}
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <label
                      className="text-sm"
                      style={{ color: '#1a1a1a' }}
                    >
                      Rest period
                    </label>
                    <span
                      className="text-xs"
                      style={{ color: '#9ca3af' }}
                    >
                      seconds
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={restTime}
                    onChange={handleRestChange}
                    disabled={phase !== 'idle'}
                    className="w-full bg-transparent border-0 border-b py-2 text-3xl font-light tabular-nums focus:outline-none disabled:opacity-40 transition-all"
                    style={{
                      color: '#1a1a1a',
                      borderBottom: '1px solid #e5e5e3',
                      letterSpacing: '-0.02em',
                    }}
                  />
                </div>

                {/* Cycles */}
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <label
                      className="text-sm"
                      style={{ color: '#1a1a1a' }}
                    >
                      Number of cycles
                    </label>
                    <span
                      className="text-xs"
                      style={{ color: '#9ca3af' }}
                    >
                      rounds
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={cycles}
                    onChange={handleCyclesChange}
                    disabled={phase !== 'idle'}
                    className="w-full bg-transparent border-0 border-b py-2 text-3xl font-light tabular-nums focus:outline-none disabled:opacity-40 transition-all"
                    style={{
                      color: '#1a1a1a',
                      borderBottom: '1px solid #e5e5e3',
                      letterSpacing: '-0.02em',
                    }}
                  />
                </div>
              </div>

              {/* Presets */}
              <div className="mt-8 pt-6" style={{ borderTop: '1px solid #f1f1ef' }}>
                <p
                  className="text-[11px] tracking-[0.15em] uppercase mb-3"
                  style={{ color: '#b8b8b4' }}
                >
                  Presets
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Tabata', w: 20, r: 10, c: 8 },
                    { label: 'Classic HIIT', w: 30, r: 15, c: 8 },
                    { label: 'Endurance', w: 45, r: 20, c: 10 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        if (phase === 'idle') {
                          setWorkTime(p.w);
                          setRestTime(p.r);
                          setCycles(p.c);
                          setTimeLeft(p.w);
                        }
                      }}
                      disabled={phase !== 'idle'}
                      className="text-xs py-2 px-4 rounded-full transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/[0.03]"
                      style={{
                        background: 'transparent',
                        color: '#4b5563',
                        border: '1px solid #e5e5e3',
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cycle Progress Card */}
            <div
              className="rounded-3xl p-7 md:p-8"
              style={{
                background: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex items-baseline justify-between mb-5">
                <h2
                  className="text-sm tracking-[0.15em] uppercase"
                  style={{ color: '#6b7280' }}
                >
                  Progress
                </h2>
                <span
                  className="text-xs tabular-nums"
                  style={{ color: '#9ca3af' }}
                >
                  {currentCycle} / {cycles}
                </span>
              </div>

              {/* Simple bar segments */}
              <div className="flex gap-1">
                {Array.from({ length: cycles }).map((_, i) => {
                  const isDone = i < currentCycle;
                  const isCurrent = i === currentCycle && phase !== 'idle';
                  return (
                    <div
                      key={i}
                      className="flex-1 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        background: isDone
                          ? '#1a1a1a'
                          : isCurrent
                          ? accentColor
                          : '#e5e5e3',
                      }}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between mt-4">
                <span
                  className="text-xs"
                  style={{ color: '#9ca3af' }}
                >
                  {currentCycle} completed
                </span>
                <span
                  className="text-xs"
                  style={{ color: '#9ca3af' }}
                >
                  {Math.max(0, cycles - currentCycle)} remaining
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== SEO GUIDE ===== */}
        <div
          className="mt-12 md:mt-20 rounded-3xl p-8 md:p-12"
          style={{
            background: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 12px 32px rgba(0,0,0,0.04)',
          }}
        >
          <p
            className="text-xs tracking-[0.2em] uppercase mb-4"
            style={{ color: '#9ca3af' }}
          >
            Guide
          </p>
          <h2
            className="text-2xl md:text-3xl font-light mb-8 max-w-2xl"
            style={{ color: '#1a1a1a', letterSpacing: '-0.02em', lineHeight: '1.25' }}
          >
            How to Optimize High-Intensity Interval Training Using Our Tabata Timer
          </h2>

          <div
            className="space-y-5 text-sm md:text-base leading-relaxed max-w-3xl"
            style={{ color: '#4b5563' }}
          >
            <p>
              High-Intensity Interval Training and Tabata protocols are scientifically
              proven to maximize calorie burn, improve cardiovascular health, and boost
              athletic performance. The key to unlocking these benefits lies in precise
              timing and a structured work-to-rest rhythm. This timer was built to keep
              that rhythm simple and visible.
            </p>
            <p>
              <span style={{ color: '#1a1a1a' }}>1. Set your work and rest periods.</span>{' '}
              Classic Tabata uses 20 seconds of all-out work followed by 10 seconds of
              rest, repeated for 8 cycles — about four minutes. For general HIIT, adjust
              work from 30 to 45 seconds and rest from 15 to 30 seconds. If you're new,
              start with a 1:2 work-to-rest ratio and gradually reduce rest over time.
            </p>
            <p>
              <span style={{ color: '#1a1a1a' }}>2. Choose your cycles.</span> One cycle
              is a work phase followed by a rest phase. For Tabata, set cycles to 8. For
              a full HIIT session, aim for 8 to 12. The timer tracks your current cycle
              and updates the progress bar as you go.
            </p>
            <p>
              <span style={{ color: '#1a1a1a' }}>3. Follow the visual cues.</span> The
              ring shifts from emerald green during work to warm amber during rest, so
              you can see where you are at a glance without staring at the numbers. A
              soft beep plays during the final three seconds of each interval, giving
              you a moment to prepare for the next phase.
            </p>
            <p>
              <span style={{ color: '#1a1a1a' }}>4. Pause when you need to.</span> If a
              session feels too intense, press pause and take the extra breath. The timer
              freezes and picks up exactly where you left off. Reset starts a fresh
              session with the same settings.
            </p>
            <p>
              <span style={{ color: '#1a1a1a' }}>5. Progress gradually.</span> As your
              fitness improves, decrease rest periods or increase work periods. Track
              how many cycles you complete and aim to add a round without losing form.
              Always warm up for five minutes before starting and cool down afterwards.
            </p>
            <p>
              Used consistently, this timer helps you push past plateaus, improve VO2
              max, and burn fat efficiently. Stay disciplined, listen to your body, and
              let the rhythm carry you to your next personal best.
            </p>
          </div>
        </div>

      </div>
      </div>
    </div>
  );
};

export default HiitTabataTimer;