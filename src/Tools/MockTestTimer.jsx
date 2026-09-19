import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

// ============================================
// DEFAULT SECTIONS
// ============================================
const DEFAULT_SECTIONS = [
  { id: 1, name: 'Quantitative Aptitude', duration: 45 * 60, questions: 30 },
  { id: 2, name: 'Verbal Ability', duration: 60 * 60, questions: 34 },
  { id: 3, name: 'Data Interpretation', duration: 30 * 60, questions: 20 },
  { id: 4, name: 'Logical Reasoning', duration: 40 * 60, questions: 24 },
];

const MockTestTimer = () => {
  // --- State ---
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [isRunning, setIsRunning] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SECTIONS[0].duration);
  const [completedSections, setCompletedSections] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('transition'); // 'transition' | 'expired' | 'complete'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [examName, setExamName] = useState('MOCK CAT 2025 — Sectional Test');

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const pageRef = useRef(null);

  // --- Audio ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const playBeep = useCallback((freq = 880, dur = 0.2, type = 'sine') => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = 0.15;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  }, [initAudio]);

  // --- Format time as MM:SS or HH:MM:SS ---
  const formatTime = useCallback((seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
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

  // --- Timer tick ---
  useEffect(() => {
    if (!isRunning || isLocked || isFinished) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;

        // Warning beeps
        if (next === 300) {
          // 5 min warning
          playBeep(660, 0.2);
        }
        if (next === 60) {
          // 1 min warning — double beep
          playBeep(880, 0.15);
          setTimeout(() => playBeep(880, 0.15), 200);
        }
        if (next > 0 && next <= 10) {
          playBeep(1000, 0.1);
        }

        // Time expired
        if (next <= 0) {
          setIsRunning(false);
          setIsLocked(true);
          playBeep(400, 0.8, 'square');

          const isLastSection = currentSectionIndex >= sections.length - 1;
          if (isLastSection) {
            setModalType('complete');
            setIsFinished(true);
          } else {
            setModalType('expired');
          }
          setShowModal(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isLocked, isFinished, currentSectionIndex, sections.length, playBeep]);

  // --- Handlers ---
  const handleStart = () => {
    initAudio();
    if (timeLeft <= 0) {
      setTimeLeft(sections[currentSectionIndex].duration);
    }
    setIsRunning(true);
    setIsLocked(false);
  };

  const handlePause = () => setIsRunning(false);

  const handleReset = () => {
    setIsRunning(false);
    setIsLocked(false);
    setIsFinished(false);
    setCurrentSectionIndex(0);
    setTimeLeft(sections[0].duration);
    setCompletedSections([]);
    setShowModal(false);
  };

  const handleSectionComplete = (auto = false) => {
    const current = sections[currentSectionIndex];
    const timeUsed = current.duration - timeLeft;
    setCompletedSections((prev) => [
      ...prev,
      {
        ...current,
        timeUsed,
        completedAt: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    ]);

    if (currentSectionIndex >= sections.length - 1) {
      // All sections complete
      setIsFinished(true);
      setModalType('complete');
      setShowModal(true);
      setIsRunning(false);
      setIsLocked(true);
      return;
    }

    // Move to next section
    const nextIndex = currentSectionIndex + 1;
    setCurrentSectionIndex(nextIndex);
    setTimeLeft(sections[nextIndex].duration);
    setShowModal(false);
    setIsLocked(false);
    if (auto) setIsRunning(true);
  };

  const handleSkipSection = () => {
    handleSectionComplete(true);
  };

  // --- Section editor ---
  const updateSection = (index, field, value) => {
    const next = [...sections];
    if (field === 'duration') {
      next[index] = { ...next[index], duration: Math.max(60, parseInt(value) * 60 || 60) };
    } else if (field === 'name') {
      next[index] = { ...next[index], name: value };
    } else if (field === 'questions') {
      next[index] = { ...next[index], questions: Math.max(1, parseInt(value) || 1) };
    }
    setSections(next);
    if (index === currentSectionIndex && !isRunning && !isLocked) {
      if (field === 'duration') setTimeLeft(next[index].duration);
    }
  };

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Date.now(),
        name: `Section ${sections.length + 1}`,
        duration: 30 * 60,
        questions: 20,
      },
    ]);
  };

  const removeSection = (index) => {
    if (sections.length <= 1) return;
    const next = sections.filter((_, i) => i !== index);
    setSections(next);
    if (index <= currentSectionIndex && currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => Math.max(0, prev - 1));
    }
  };

  // --- Computed ---
  const currentSection = sections[currentSectionIndex];
  const progressPercent = currentSection
    ? 1 - timeLeft / currentSection.duration
    : 0;
  const totalElapsed = completedSections.reduce((acc, s) => acc + s.timeUsed, 0);
  const isUrgent = timeLeft <= 300 && timeLeft > 0 && isRunning; // last 5 min
  const isCritical = timeLeft <= 60 && timeLeft > 0 && isRunning; // last 1 min

  // --- Color theming ---
  const examBlue = '#1e40af';
  const examBlueLight = '#3b82f6';
  const examRed = '#dc2626';
  const examGray = '#475569';

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800">
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
          minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
          overflowY: 'auto',
          background: '#f1f5f9',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">

          {/* ===== EXAM HEADER (like real portal) ===== */}
          <div
            className="rounded-lg overflow-hidden mb-5"
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3"
              style={{ background: examBlue, color: '#ffffff' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center text-sm font-black"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  ✎
                </div>
                <div>
                  <p className="text-[10px] tracking-widest uppercase font-bold opacity-80">
                    Online Examination Portal
                  </p>
                  <p className="text-sm md:text-base font-bold">{examName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const name = window.prompt('Exam name:', examName);
                    if (name) setExamName(name);
                  }}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
                >
                  Edit Title
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
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
              </div>
            </div>

            {/* Status strip */}
            <div className="px-4 md:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 bg-slate-50 border-b border-slate-200">
              <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  Total Sections: {sections.length}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Completed: {completedSections.length}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Total Time: {formatTime(sections.reduce((a, s) => a + s.duration, 0))}
                </span>
              </div>
              <div className="text-[11px] font-mono font-bold text-slate-700">
                Candidate ID: <span className="text-blue-700">MOCK-2025-0001</span>
              </div>
            </div>
          </div>

          {/* ===== MAIN SPLIT-PANE LAYOUT ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* ===== LEFT: SECTION CONFIGURATION ===== */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] tracking-widest uppercase font-bold text-slate-500">
                      Section Configuration
                    </p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">
                      Pre-Configure Test
                    </p>
                  </div>
                  <span
                    className="text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded"
                    style={{
                      background: isRunning || isLocked ? '#fef3c7' : '#dbeafe',
                      color: isRunning || isLocked ? '#92400e' : '#1e40af',
                    }}
                  >
                    {isRunning || isLocked ? '🔒 Locked' : '✎ Editable'}
                  </span>
                </div>

                {/* Sections list */}
                <div
                  className="p-4 space-y-3 no-scrollbar overflow-y-auto"
                  style={{ maxHeight: '520px' }}
                >
                  {sections.map((sec, i) => {
                    const isActive = i === currentSectionIndex && isRunning;
                    const isDone = i < currentSectionIndex;
                    return (
                      <div
                        key={sec.id}
                        className="rounded-md border transition-all"
                        style={{
                          background: isDone
                            ? '#f0fdf4'
                            : isActive
                            ? '#eff6ff'
                            : '#ffffff',
                          borderColor: isDone
                            ? '#86efac'
                            : isActive
                            ? examBlueLight
                            : '#e2e8f0',
                          borderWidth: isActive ? '2px' : '1px',
                          padding: isActive ? '11px' : '12px',
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold"
                              style={{
                                background: isDone
                                  ? '#22c55e'
                                  : isActive
                                  ? examBlueLight
                                  : '#cbd5e1',
                                color: '#ffffff',
                              }}
                            >
                              {isDone ? '✓' : i + 1}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {isDone
                                ? 'Completed'
                                : isActive
                                ? 'In Progress'
                                : 'Upcoming'}
                            </span>
                          </div>
                          {sections.length > 1 && !isRunning && !isLocked && (
                            <button
                              onClick={() => removeSection(i)}
                              className="text-slate-400 hover:text-red-600 text-sm"
                              title="Remove section"
                            >
                              ×
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={sec.name}
                          onChange={(e) => updateSection(i, 'name', e.target.value)}
                          disabled={isRunning || isLocked}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-sm font-semibold text-slate-800 focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 mb-2"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                              Duration
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                min="1"
                                max="180"
                                value={Math.round(sec.duration / 60)}
                                onChange={(e) => updateSection(i, 'duration', e.target.value)}
                                disabled={isRunning || isLocked}
                                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-bold tabular-nums text-slate-800 focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 pr-8"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400">
                                min
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                              Questions
                            </label>
                            <input
                              type="number"
                              min="1"
                              max="200"
                              value={sec.questions}
                              onChange={(e) => updateSection(i, 'questions', e.target.value)}
                              disabled={isRunning || isLocked}
                              className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm font-bold tabular-nums text-slate-800 focus:outline-none focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {!isRunning && !isLocked && (
                    <button
                      onClick={addSection}
                      className="w-full py-2.5 rounded-md border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      + Add Section
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ===== RIGHT: LIVE COUNTDOWN ===== */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                }}
              >
                {/* Top strip */}
                <div
                  className="px-5 py-3 flex items-center justify-between border-b border-slate-200"
                  style={{ background: '#f8fafc' }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isRunning ? 'animate-pulse' : ''
                      }`}
                      style={{
                        background: isRunning
                          ? isCritical
                            ? examRed
                            : isUrgent
                            ? '#f59e0b'
                            : '#22c55e'
                          : '#cbd5e1',
                        boxShadow: isRunning && isCritical ? '0 0 12px #dc2626' : 'none',
                      }}
                    ></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      {isFinished
                        ? 'Exam Complete'
                        : isLocked
                        ? 'Section Locked'
                        : isRunning
                        ? 'Exam in Progress'
                        : 'Awaiting Start'}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Section {currentSectionIndex + 1} of {sections.length}
                  </span>
                </div>

                {/* Current section label */}
                <div className="px-5 md:px-8 pt-6 pb-2 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-1">
                    Current Section
                  </p>
                  <p
                    className="text-lg md:text-2xl font-bold truncate"
                    style={{ color: examBlue }}
                  >
                    {currentSection?.name}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1">
                    {currentSection?.questions} questions · {Math.round(currentSection?.duration / 60)} minutes
                  </p>
                </div>

                {/* Timer display */}
                <div className="px-5 md:px-8 py-6 md:py-10">
                  <div
                    className="text-center font-mono font-bold tabular-nums rounded-lg py-6 md:py-10 transition-all"
                    style={{
                      fontSize: 'clamp(2.5rem, 9vw, 5rem)',
                      letterSpacing: '-0.02em',
                      background: isCritical
                        ? '#fef2f2'
                        : isUrgent
                        ? '#fffbeb'
                        : '#f8fafc',
                      color: isCritical
                        ? examRed
                        : isUrgent
                        ? '#b45309'
                        : '#0f172a',
                      border: `2px solid ${
                        isCritical ? '#fca5a5' : isUrgent ? '#fcd34d' : '#e2e8f0'
                      }`,
                      animation: isCritical ? 'pulse 1s ease-in-out infinite' : 'none',
                    }}
                  >
                    {formatTime(timeLeft)}
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5">
                    <div className="flex items-center justify-between mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <span>Progress</span>
                      <span>{Math.round(progressPercent * 100)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${progressPercent * 100}%`,
                          background: isCritical
                            ? examRed
                            : isUrgent
                            ? '#f59e0b'
                            : examBlueLight,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Controls */}
                <div className="px-5 md:px-8 pb-6">
                  <div className="grid grid-cols-2 gap-3">
                    {!isRunning ? (
                      <button
                        onClick={handleStart}
                        disabled={isLocked || isFinished}
                        className="py-3.5 rounded-md font-bold text-sm tracking-wider uppercase text-white transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: examBlue,
                          boxShadow: '0 2px 8px rgba(30, 64, 175, 0.3)',
                        }}
                      >
                        {isFinished
                          ? 'Exam Ended'
                          : timeLeft < currentSection?.duration
                          ? '▶ Resume'
                          : '▶ Start Section'}
                      </button>
                    ) : (
                      <button
                        onClick={handlePause}
                        className="py-3.5 rounded-md font-bold text-sm tracking-wider uppercase transition-all duration-150 active:scale-[0.98]"
                        style={{
                          background: '#fef3c7',
                          color: '#92400e',
                          border: '1px solid #fcd34d',
                        }}
                      >
                        ⏸ Pause
                      </button>
                    )}

                    <button
                      onClick={() => {
                        const confirmed = window.confirm(
                          'Complete this section and move to the next? This action cannot be undone.'
                        );
                        if (confirmed) handleSkipSection();
                      }}
                      disabled={isFinished || isLocked}
                      className="py-3.5 rounded-md font-bold text-sm tracking-wider uppercase transition-all duration-150 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid #cbd5e1',
                      }}
                    >
                      ⏭ Next Section
                    </button>

                    <button
                      onClick={handleReset}
                      className="col-span-2 py-3 rounded-md font-semibold text-xs tracking-wider uppercase transition-all duration-150 active:scale-[0.98]"
                      style={{
                        background: '#ffffff',
                        color: '#64748b',
                        border: '1px solid #e2e8f0',
                      }}
                    >
                      ↺ Reset Entire Test
                    </button>
                  </div>
                </div>

                {/* Completed sections log */}
                {completedSections.length > 0 && (
                  <div className="border-t border-slate-200">
                    <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Completed Sections Log
                      </p>
                    </div>
                    <div className="max-h-40 overflow-y-auto no-scrollbar">
                      {completedSections.map((s, i) => (
                        <div
                          key={i}
                          className="px-5 py-2 flex items-center justify-between border-b border-slate-100 last:border-b-0 text-[12px]"
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                              ✓
                            </span>
                            <span className="font-semibold text-slate-700 truncate">
                              {s.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0 ml-2">
                            <span className="font-mono tabular-nums font-bold text-slate-700">
                              {formatTime(s.timeUsed)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {s.completedAt}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider">
                      <span className="text-slate-500">Total Time Used</span>
                      <span className="font-mono tabular-nums text-slate-800">
                        {formatTime(totalElapsed)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== SEO SECTION ===== */}
          <div
            className="mt-12 rounded-lg p-6 md:p-10"
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-bold px-3 py-1.5 rounded"
                style={{ background: '#dbeafe', color: examBlue }}
              >
                Academic Guide
              </span>
            </div>

            <h2 className="text-xl md:text-3xl font-bold tracking-tight text-slate-800 mb-6 max-w-3xl">
              How to Train for Rigid Competitive Exam Time Constraints at Home
            </h2>

            <div className="space-y-4 text-sm md:text-[15px] leading-relaxed max-w-4xl text-slate-600">
              <p>
                Competitive exams like CAT, GRE, GMAT, JEE, and UPSC don't just
                test knowledge — they test how efficiently you can apply it under
                rigid time pressure. A student who knows every formula but freezes
                when the clock hits 5 minutes remaining will consistently
                underperform against a student who has trained their brain to
                handle pressure. That training starts at home, with a structured
                sectional timer like this one.
              </p>
              <p>
                <span className="text-slate-800 font-bold">
                  1. Simulate the real exam environment.
                </span>{' '}
                The first step to training is to replicate exam conditions as
                closely as possible. Set up a dedicated desk, remove distractions,
                put your phone on silent, and use a timer that locks the layout
                when a section expires — just like the real portal does. When the
                timer hits zero, you must stop. No grace period. No exceptions.
                This discipline trains your brain to work within the constraint
                rather than around it.
              </p>
              <p>
                <span className="text-slate-800 font-bold">
                  2. Configure realistic sectional budgets.
                </span>{' '}
                Use the configuration panel to set each section's duration to
                match your target exam. For example, in CAT, the VARC section
                typically gives 40 minutes for 24 questions, while Quant gives 40
                minutes for 22 questions. Don't cheat by giving yourself extra
                time. If anything, shave off 2–3 minutes per section during
                practice so that on exam day, you have a psychological buffer.
              </p>
              <p>
                <span className="text-slate-800 font-bold">
                  3. Train with sectional lock-in.
                </span>{' '}
                The most powerful feature of this timer is that it locks the
                layout when a section expires and forces you to move on. This
                mimics real exams where you cannot return to a completed section.
                Train yourself to accept this — spend the first few minutes of
                each section identifying which questions to solve and which to
                skip. Strategic skipping is often the difference between a 90th
                percentile and a 99th percentile score.
              </p>
              <p>
                <span className="text-slate-800 font-bold">
                  4. Review your section logs.
                </span>{' '}
                After every mock test, review the completed sections log. How
                long did you actually spend on Quant vs. how long you planned?
                Did you rush the last section because you overspent time on the
                first? These patterns emerge only when you track time data. Over
                weeks of practice, you'll build a personal pace model that's
                far more reliable than intuition.
              </p>
              <p>
                <span className="text-slate-800 font-bold">
                  5. Build the 3-minute warning habit.
                </span>{' '}
                The 5-minute and 1-minute warning beeps in this timer aren't
                decorative — they train a specific skill. When you hear the
                1-minute beep, your brain should immediately switch to
                "review mode": mark unanswered questions, eliminate wrong
                options, and make a strategic guess if needed. Athletes call this
                "clutch training." You're building the same reflex for exams.
              </p>
              <p>
                <span className="text-slate-800 font-bold">
                  6. Consistency beats intensity.
                </span>{' '}
                One mock test a week won't build exam stamina. Aim for three to
                four sectional timers per week, gradually increasing to full
                mock tests. By the time you sit for the real exam, the timer
                will feel like a familiar tool rather than a threat. That
                familiarity is your biggest advantage.
              </p>
              <p>
                Train with rigid constraints at home, and the real exam will feel
                like just another practice session. Stay disciplined. Track
                everything. Score higher.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== URGENT MODAL (section expired / transition / complete) ===== */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="w-full max-w-lg rounded-lg overflow-hidden animate-pulse-slow"
            style={{
              background: '#ffffff',
              border: `3px solid ${
                modalType === 'complete' ? '#22c55e' : '#dc2626'
              }`,
              boxShadow: `0 24px 64px ${
                modalType === 'complete'
                  ? 'rgba(34, 197, 94, 0.4)'
                  : 'rgba(220, 38, 38, 0.4)'
              }`,
            }}
          >
            {/* Modal header strip */}
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{
                background:
                  modalType === 'complete'
                    ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                    : 'linear-gradient(135deg, #b91c1c, #dc2626)',
                color: '#ffffff',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-black flex-shrink-0 animate-pulse"
                style={{ background: 'rgba(255,255,255,0.2)' }}
              >
                {modalType === 'complete' ? '✓' : '!'}
              </div>
              <div>
                <p className="text-[10px] tracking-[0.25em] uppercase font-bold opacity-90">
                  {modalType === 'complete'
                    ? 'Test Completed'
                    : 'Section Time Expired'}
                </p>
                <p className="text-lg md:text-xl font-bold">
                  {modalType === 'complete'
                    ? 'All Sections Finished'
                    : 'Stop Writing Immediately'}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {modalType === 'complete' ? (
                <>
                  <p className="text-sm leading-relaxed text-slate-700 mb-4">
                    You have successfully completed all{' '}
                    <strong>{sections.length}</strong> sections of this mock test.
                    Your responses have been logged.
                  </p>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-semibold text-emerald-800">
                        Total Time Used
                      </span>
                      <span className="font-mono font-bold text-emerald-900">
                        {formatTime(totalElapsed)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-emerald-800">
                        Sections Completed
                      </span>
                      <span className="font-bold text-emerald-900">
                        {completedSections.length} / {sections.length}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 italic mb-4">
                    Please remain seated. Review your completed sections log
                    before leaving the test window.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-slate-700 mb-4">
                    The time allocated for the section{' '}
                    <strong className="text-red-700">
                      "{currentSection?.name}"
                    </strong>{' '}
                    has ended. As per exam rules, <strong>no further edits</strong>{' '}
                    are permitted in this section.
                  </p>

                  <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-700 mb-2">
                      Section Summary
                    </p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-red-800 font-semibold">
                          Questions
                        </span>
                        <span className="font-bold text-red-900">
                          {currentSection?.questions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-red-800 font-semibold">
                          Time Allocated
                        </span>
                        <span className="font-mono font-bold text-red-900">
                          {formatTime(currentSection?.duration || 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {currentSectionIndex < sections.length - 1 && (
                    <>
                      <div className="rounded-lg bg-blue-50 border-2 border-blue-300 p-4 mb-5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-blue-700 mb-1">
                          ⏭ Transition Immediately
                        </p>
                        <p className="text-sm font-bold text-blue-900">
                          Next Section: {sections[currentSectionIndex + 1]?.name}
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          Duration: {formatTime(sections[currentSectionIndex + 1]?.duration || 0)} · {sections[currentSectionIndex + 1]?.questions} questions
                        </p>
                      </div>
                      <p className="text-xs text-slate-500 italic mb-4">
                        Click the button below to begin the next section. The
                        timer will start immediately.
                      </p>
                    </>
                  )}
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {modalType === 'complete' ? (
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 rounded-md font-bold text-sm tracking-wider uppercase text-white transition-all duration-150 active:scale-[0.98]"
                    style={{
                      background: '#16a34a',
                      boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)',
                    }}
                  >
                    ↺ Start New Test
                  </button>
                ) : (
                  <button
                    onClick={() => handleSectionComplete(true)}
                    className="flex-1 py-3 rounded-md font-bold text-sm tracking-wider uppercase text-white transition-all duration-150 active:scale-[0.98]"
                    style={{
                      background: '#1e40af',
                      boxShadow: '0 2px 8px rgba(30, 64, 175, 0.3)',
                    }}
                  >
                    Proceed to Next Section →
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* pulse-slow keyframe */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MockTestTimer;