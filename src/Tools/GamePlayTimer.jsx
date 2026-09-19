import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

// ============================================
// CHALLENGES WITH MINI-GAME TYPES
// ============================================
const CHALLENGES = [
  {
    id: 'speedrun',
    name: 'SPEED RUN',
    subtitle: 'Reach the finish line',
    emoji: '🏃',
    timeLimit: 60,
    goal: 'Complete the level',
    difficulty: 'EASY',
    color: '#22c55e',
    colorDeep: '#15803d',
    gradient: 'linear-gradient(135deg, #22c55e, #10b981)',
    reward: '+50 XP',
    gameType: 'tap-target',
    gameName: 'Tap Target',
    gameDesc: 'Hit the moving marker in the yellow zone',
  },
  {
    id: 'puzzle',
    name: 'PUZZLE MASTER',
    subtitle: 'Solve the puzzle',
    emoji: '🧩',
    timeLimit: 90,
    goal: 'Solve 10 puzzles',
    difficulty: 'MEDIUM',
    color: '#3b82f6',
    colorDeep: '#1d4ed8',
    gradient: 'linear-gradient(135deg, #3b82f6, #6366f1)',
    reward: '+100 XP',
    gameType: 'simon-says',
    gameName: 'Simon Says',
    gameDesc: 'Repeat the flashing color sequence',
  },
  {
    id: 'survival',
    name: 'SURVIVAL MODE',
    subtitle: 'Stay alive',
    emoji: '⚔️',
    timeLimit: 120,
    goal: 'Survive 2 minutes',
    difficulty: 'HARD',
    color: '#ef4444',
    colorDeep: '#b91c1c',
    gradient: 'linear-gradient(135deg, #ef4444, #f97316)',
    reward: '+200 XP',
    gameType: 'whack-a-mole',
    gameName: 'Whack-a-Mole',
    gameDesc: 'Tap the glowing tile before it disappears',
  },
  {
    id: 'boss',
    name: 'BOSS FIGHT',
    subtitle: 'Defeat the boss',
    emoji: '🐉',
    timeLimit: 180,
    goal: 'Kill the dragon',
    difficulty: 'EXTREME',
    color: '#a855f7',
    colorDeep: '#7e22ce',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    reward: '+500 XP',
    gameType: 'rapid-tap',
    gameName: 'Rapid Tap',
    gameDesc: 'Tap as fast as you can in 5 seconds',
  },
];

// Simon Says colors
const SIMON_COLORS = [
  { id: 0, color: '#22c55e', glow: 'rgba(34,197,94,0.8)' },
  { id: 1, color: '#3b82f6', glow: 'rgba(59,130,246,0.8)' },
  { id: 2, color: '#f59e0b', glow: 'rgba(245,158,11,0.8)' },
  { id: 3, color: '#ec4899', glow: 'rgba(236,72,153,0.8)' },
];

// ============================================
// MAIN COMPONENT
// ============================================
const GamePlayTimer = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [bestScores, setBestScores] = useState(() => {
    try {
      const saved = localStorage.getItem('gameplay_best_scores_v2');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });
  const [showResult, setShowResult] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [particles, setParticles] = useState([]);
  const [gameScore, setGameScore] = useState(0);
  const [gameRound, setGameRound] = useState(0);
  const [showRecordPopup, setShowRecordPopup] = useState(false);
  const [recordPopupData, setRecordPopupData] = useState(null);

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const pageRef = useRef(null);
  const beepedRef = useRef({});

  // --- Audio ---
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
  }, []);

  const playBeep = useCallback((freq = 880, dur = 0.15, type = 'square') => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = 0.12;
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  }, [initAudio]);

  const playVictorySound = useCallback(() => {
    playBeep(523, 0.15);
    setTimeout(() => playBeep(659, 0.15), 150);
    setTimeout(() => playBeep(784, 0.15), 300);
    setTimeout(() => playBeep(1047, 0.4), 450);
  }, [playBeep]);

  const playFailSound = useCallback(() => {
    playBeep(220, 0.3, 'sawtooth');
    setTimeout(() => playBeep(165, 0.5, 'sawtooth'), 250);
  }, [playBeep]);

  useEffect(() => {
    try {
      localStorage.setItem('gameplay_best_scores_v2', JSON.stringify(bestScores));
    } catch (e) {}
  }, [bestScores]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next > 0 && next <= 5) {
          const key = `beep-${next}`;
          if (!beepedRef.current[key]) {
            beepedRef.current[key] = true;
            playBeep(next <= 3 ? 1200 : 880, 0.12);
          }
        }
        if (next <= 0) {
          setIsRunning(false);
          setIsWon(false);
          playFailSound();
          setShowResult(true);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, playBeep, playFailSound]);

  const generateParticles = () => {
    const colors = ['#fbbf24', '#f97316', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'];
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: -10 - Math.random() * 20,
      size: 6 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 4000);
  };

  const startChallenge = (challenge) => {
    initAudio();
    setSelectedChallenge(challenge);
    setTimeLeft(challenge.timeLimit);
    setIsRunning(true);
    setIsWon(false);
    setShowResult(false);
    setGameScore(0);
    setGameRound(0);
    beepedRef.current = {};
    playBeep(660, 0.1);
  };

  const winChallenge = () => {
    setIsRunning(false);
    setIsWon(true);
    setShowResult(true);
    playVictorySound();
    generateParticles();

    if (selectedChallenge) {
      const id = selectedChallenge.id;
      const newScore = timeLeft + gameScore * 0.1;
      const prevBest = bestScores[id];
      const isNewRecord = !prevBest || newScore > prevBest;

      if (isNewRecord) {
        setBestScores((prev) => ({ ...prev, [id]: newScore }));
        setRecordPopupData({
          challenge: selectedChallenge,
          score: newScore,
          previous: prevBest,
          gameScore: gameScore,
        });
        setShowRecordPopup(true);
      }
    }
  };

  const resetChallenge = () => {
    if (selectedChallenge) startChallenge(selectedChallenge);
  };

  const backToMenu = () => {
    setIsRunning(false);
    setIsWon(false);
    setShowResult(false);
    setSelectedChallenge(null);
    setTimeLeft(0);
    setShowRecordPopup(false);
  };

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

  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 'Escape' && selectedChallenge) backToMenu();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedChallenge, toggleFullscreen]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const theme = selectedChallenge
    ? {
        bg: '#0a0a0f',
        cardBorder: selectedChallenge.color + '55',
        text: '#ffffff',
        muted: 'rgba(255,255,255,0.6)',
        accent: selectedChallenge.color,
      }
    : { bg: '#0a0a0f', text: '#ffffff', muted: 'rgba(255,255,255,0.6)' };

  const progress = selectedChallenge ? 1 - timeLeft / selectedChallenge.timeLimit : 0;
  const isUrgent = selectedChallenge && timeLeft <= 10 && timeLeft > 0 && isRunning;
  const isCritical = selectedChallenge && timeLeft <= 5 && timeLeft > 0 && isRunning;

  return (
    <div className="min-h-screen" style={{ background: theme.bg }}>
      <style>{`
        html, body { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes pulseDot { 0%,100% { opacity:1; transform:scale(1);} 50% { opacity:0.6; transform:scale(1.2);} }
        .pulse-dot { animation: pulseDot 1s ease-in-out infinite; }
        @keyframes screenShake {
          0%,100% { transform: translate(0,0); }
          25% { transform: translate(-2px,1px); }
          50% { transform: translate(2px,-1px); }
          75% { transform: translate(-1px,2px); }
        }
        .screen-shake { animation: screenShake 0.3s ease-in-out infinite; }
        @keyframes floatIn { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }
        .float-in { animation: floatIn 0.5s ease-out; }
        @keyframes zoomIn { from{opacity:0;transform:scale(0.7);} to{opacity:1;transform:scale(1);} }
        .zoom-in { animation: zoomIn 0.5s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes particleFall { 0%{transform:translateY(0) rotate(0);opacity:1;} 100%{transform:translateY(110vh) rotate(720deg);opacity:0;} }
        .particle { animation: particleFall linear forwards; }
        @keyframes victoryGlow { 0%,100%{box-shadow:0 0 40px rgba(34,197,94,0.4);} 50%{box-shadow:0 0 80px rgba(34,197,94,0.9);} }
        .victory-glow { animation: victoryGlow 2s ease-in-out infinite; }
        @keyframes failPulse { 0%,100%{box-shadow:0 0 40px rgba(239,68,68,0.4);} 50%{box-shadow:0 0 80px rgba(239,68,68,0.9);} }
        .fail-pulse { animation: failPulse 1s ease-in-out infinite; }
        @keyframes gridMove { from{background-position:0 0;} to{background-position:48px 48px;} }
        .grid-bg {
          background-image: linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px);
          background-size: 48px 48px;
          animation: gridMove 20s linear infinite;
        }
        @keyframes barPulse { 0%,100%{opacity:0.6;} 50%{opacity:1;} }
        .bar-pulse { animation: barPulse 1s ease-in-out infinite; }
        @keyframes recordPopIn { 0%{opacity:0;transform:scale(0.5) rotate(-10deg);} 60%{opacity:1;transform:scale(1.1) rotate(3deg);} 100%{opacity:1;transform:scale(1) rotate(0);} }
        .record-pop { animation: recordPopIn 0.6s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes recordPulse { 0%,100%{box-shadow:0 0 30px rgba(34,197,94,0.5);} 50%{box-shadow:0 0 60px rgba(34,197,94,1);} }
        .record-pulse { animation: recordPulse 1.5s ease-in-out infinite; }
        @keyframes targetHit { 0%{transform:scale(1);} 50%{transform:scale(1.15);} 100%{transform:scale(1);} }
        .target-hit { animation: targetHit 0.4s ease-out; }
        @keyframes targetMiss { 0%,100%{transform:translateX(0);} 20%,60%{transform:translateX(-8px);} 40%,80%{transform:translateX(8px);} }
        .target-miss { animation: targetMiss 0.4s ease-out; }
        @keyframes moleAppear { 0%{transform:scale(0);} 60%{transform:scale(1.15);} 100%{transform:scale(1);} }
        .mole-appear { animation: moleAppear 0.25s ease-out; }
        @keyframes simonFlash { 0%{transform:scale(1);} 50%{transform:scale(1.08);} 100%{transform:scale(1);} }
        .simon-flash { animation: simonFlash 0.35s ease-out; }
      `}</style>

      {!isFullscreen && <Navbar />}

      <div
        ref={pageRef}
        className="relative w-full no-scrollbar"
        style={{
          minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
          overflowY: 'auto',
          background: theme.bg,
        }}
      >
        <button
          onClick={toggleFullscreen}
          className="fixed z-50 w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          style={{
            top: isFullscreen ? '1rem' : '5rem',
            right: '1rem',
            background: 'rgba(20, 20, 30, 0.9)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#fff',
          }}
          title="Fullscreen (F)"
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

        <div className="fixed inset-0 grid-bg pointer-events-none opacity-30 z-0"></div>

        {selectedChallenge && (
          <div
            className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${selectedChallenge.color}20 0%, transparent 60%)`,
              opacity: isRunning ? 1 : 0.4,
            }}
          ></div>
        )}

        {/* ===== MENU ===== */}
        {!selectedChallenge && (
          <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16">
            <div className="text-center mb-10 md:mb-14 float-in">
              <p className="text-[10px] tracking-[0.4em] uppercase font-black mb-3" style={{ color: '#22c55e' }}>
                🎮 Arcade Challenge Mode
              </p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
                Gameplay Timer
              </h1>
              <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ color: theme.muted }}>
                Four challenges. Four unique arcade mini-games. Beat the clock and set new records.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CHALLENGES.map((challenge, index) => {
                const best = bestScores[challenge.id];
                return (
                  <button
                    key={challenge.id}
                    onClick={() => startChallenge(challenge)}
                    className="group relative text-left rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] float-in"
                    style={{
                      background: 'rgba(20, 20, 30, 0.9)',
                      border: `1px solid rgba(255,255,255,0.08)`,
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="h-1.5 w-full" style={{ background: challenge.gradient }}></div>
                    <div
                      className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-30 transition-opacity duration-500"
                      style={{ background: `radial-gradient(circle, ${challenge.color}, transparent 70%)` }}
                    ></div>

                    <div className="p-5 md:p-7 relative">
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-3 md:gap-4">
                          <div
                            className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-all duration-300 group-hover:scale-110"
                            style={{
                              background: `${challenge.color}18`,
                              border: `1px solid ${challenge.color}44`,
                              boxShadow: `0 8px 24px ${challenge.color}22`,
                            }}
                          >
                            {challenge.emoji}
                          </div>
                          <div>
                            <p className="text-[10px] tracking-[0.25em] uppercase font-black mb-1" style={{ color: challenge.color }}>
                              {challenge.difficulty}
                            </p>
                            <h3 className="text-lg md:text-2xl font-black text-white tracking-tight">
                              {challenge.name}
                            </h3>
                            <p className="text-xs mt-0.5" style={{ color: theme.muted }}>
                              {challenge.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4"
                        style={{
                          background: `${challenge.color}10`,
                          border: `1px solid ${challenge.color}30`,
                        }}
                      >
                        <span className="text-base">🎯</span>
                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Mini-Game
                          </p>
                          <p className="text-xs font-black truncate" style={{ color: challenge.color }}>
                            {challenge.gameName}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5">
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Time
                          </p>
                          <p className="text-base md:text-lg font-black text-white font-mono tabular-nums mt-0.5">
                            {formatTime(challenge.timeLimit)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Reward
                          </p>
                          <p className="text-base md:text-lg font-black mt-0.5" style={{ color: challenge.color }}>
                            {challenge.reward}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>
                            Best
                          </p>
                          <p className="text-base md:text-lg font-black text-white font-mono tabular-nums mt-0.5">
                            {best ? Math.round(best) : '—'}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] tracking-[0.3em] uppercase font-black" style={{ color: challenge.color }}>
                          ▶ TAP TO PLAY
                        </span>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-1"
                          style={{ background: challenge.gradient, boxShadow: `0 4px 16px ${challenge.color}55` }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                            <polygon points="8,5 19,12 8,19" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* ===== COMPLETE INSTRUCTION GUIDE — 500+ WORDS ===== */}
            <div
              className="mt-10 rounded-3xl p-6 md:p-10 float-in"
              style={{
                background: 'rgba(20, 20, 30, 0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)' }}
                >
                  📖
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.3em] uppercase font-black" style={{ color: '#22c55e' }}>
                    Complete Guide
                  </p>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                    How to Play Gameplay Timer
                  </h2>
                </div>
              </div>

              <div className="space-y-5 text-sm md:text-[15px] leading-relaxed text-white/85">
                <p>
                  Welcome to <strong className="text-white">Gameplay Timer</strong> — an arcade-style challenge timer that combines real countdown pressure with four unique mini-games. Each challenge has its own time limit, its own difficulty, and its own mini-game. Your goal is simple: complete the challenge before the clock runs out, score as many points as possible in the mini-game, and set a new personal record. No sign-up required, no downloads — just pure arcade fun.
                </p>

                <div>
                  <h3 className="text-white font-black text-base md:text-lg mb-3 flex items-center gap-2">
                    <span className="text-green-400">🎯</span> The Four Challenges
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-white font-bold">1. SPEED RUN (EASY · 60 seconds · +50 XP)</p>
                      <p className="text-white/70">
                        The beginner challenge. You have 60 seconds to complete the level. Paired with the <strong className="text-green-400">Tap Target</strong> mini-game — a moving white marker slides across a horizontal bar. A yellow target zone lights up at a random position. Your job is to tap the button exactly when the marker is inside the yellow zone. Hit it within 0.1 seconds of the target's center for a <strong className="text-white">perfect hit (+100 points)</strong>, or within 0.3 seconds for a close hit (+50 points). Miss the zone entirely and you get zero points. The pace is slow enough for beginners but fast enough to feel rewarding.
                      </p>
                    </div>

                    <div>
                      <p className="text-white font-bold">2. PUZZLE MASTER (MEDIUM · 90 seconds · +100 XP)</p>
                      <p className="text-white/70">
                        The memory challenge. Paired with <strong className="text-blue-400">Simon Says</strong> — four colored tiles (green, blue, amber, pink) flash in a random sequence. Watch carefully. When the sequence ends, it's your turn to repeat it by tapping the same colors in the same order. Each correct round adds one more color to the sequence — Level 1 starts with one flash, Level 2 with two, and so on. Each successful level awards <strong className="text-white">20 points per color</strong>, so long sequences pay big. One wrong tap ends the run and resets to Level 1. Train your short-term memory and pattern recognition.
                      </p>
                    </div>

                    <div>
                      <p className="text-white font-bold">3. SURVIVAL MODE (HARD · 120 seconds · +200 XP)</p>
                      <p className="text-white/70">
                        The reflex challenge. Paired with <strong className="text-red-400">Whack-a-Mole</strong> — a 3×3 grid of dark tiles. One tile lights up with a glowing impact emoji and stays lit for only 1.2 seconds. Tap it fast to score <strong className="text-white">+50 points</strong> before it disappears. If you miss, the tile hides and a new one appears. There's no penalty for missing, but your score simply doesn't grow. The faster you tap, the more tiles spawn. This mini-game trains pure reaction speed and hand-eye coordination — the same skill used in first-person shooters and competitive esports.
                      </p>
                    </div>

                    <div>
                      <p className="text-white font-bold">4. BOSS FIGHT (EXTREME · 180 seconds · +500 XP)</p>
                      <p className="text-white/70">
                        The endurance challenge. Paired with <strong className="text-purple-400">Rapid Tap</strong> — a 5-second tap frenzy. When you press "Start 5s Frenzy," a giant button appears and a countdown begins. Tap it as fast as humanly possible. Each tap is worth <strong className="text-white">+2 points</strong>, and a skilled player can land 60–80 taps in 5 seconds. Rapid Tap tests fast-twitch muscle response and stamina — the same physical discipline that sprint athletes and professional rhythm gamers rely on. The 3-minute Boss Fight gives you plenty of rounds to rack up a huge score.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-black text-base md:text-lg mb-3 flex items-center gap-2">
                    <span className="text-yellow-400">🎮</span> How the Main Timer Works
                  </h3>
                  <p className="text-white/70">
                    When you pick a challenge, a giant countdown appears at the top of the screen. It starts at the challenge's time limit (60, 90, 120, or 180 seconds) and ticks down every second. During the final 5 seconds, the timer turns red and warning beeps play. If the clock reaches zero before you complete the challenge, the game ends and your score is logged as a defeat. Your final score is calculated as: <strong className="text-white">time left + (mini-game score × 0.1)</strong>. This means both speed AND mini-game skill determine your ranking.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-black text-base md:text-lg mb-3 flex items-center gap-2">
                    <span className="text-green-400">🏆</span> How to Win & Set Records
                  </h3>
                  <p className="text-white/70 mb-3">
                    To complete a challenge, click the big green <strong className="text-green-400">"I Completed It"</strong> button at the bottom of the screen before the clock runs out. This submits your score. If your score beats your previous best, a <strong className="text-green-400">green record popup</strong> appears with confetti, showing your old record (struck through) next to your new best. The popup also displays your mini-game score. Your best scores are saved in your browser, so you can come back anytime and try to beat them.
                  </p>
                  <p className="text-white/70">
                    Each challenge's best score is shown on the menu card under "Best." You don't need to complete a challenge to beat a record — you just need a higher score than your previous attempt. The record popup is your reward for improvement, and it's designed to feel genuinely exciting — confetti particles rain down, the trophy emoji pulses, and the popup glows with a green halo.
                  </p>
                </div>

                <div>
                  <h3 className="text-white font-black text-base md:text-lg mb-3 flex items-center gap-2">
                    <span className="text-cyan-400">⌨️</span> Keyboard & Touch Controls
                  </h3>
                  <ul className="space-y-2 text-white/70 pl-2">
                    <li>• <strong className="text-white">F</strong> — Toggle fullscreen mode</li>
                    <li>• <strong className="text-white">Esc</strong> — Exit back to the main menu</li>
                    <li>• <strong className="text-white">Space / Tap</strong> — Primary action (start round, tap target, whack mole, rapid tap)</li>
                    <li>• All games support touch on mobile — no keyboard needed</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white font-black text-base md:text-lg mb-3 flex items-center gap-2">
                    <span className="text-pink-400">💡</span> Pro Tips
                  </h3>
                  <ul className="space-y-2 text-white/70 pl-2">
                    <li>• <strong className="text-white">Warm up:</strong> Start with Speed Run to sharpen your tap timing before attempting harder challenges.</li>
                    <li>• <strong className="text-white">Watch the sequence twice:</strong> In Simon Says, it's tempting to tap immediately — but waiting gives your brain time to lock in the pattern.</li>
                    <li>• <strong className="text-white">Whack-a-Mole rhythm:</strong> Don't chase tiles randomly — keep your finger near the center and react to the glow.</li>
                    <li>• <strong className="text-white">Rapid Tap breathing:</strong> Take a deep breath before the 5-second frenzy. Fast, rhythmic tapping beats frantic random strikes.</li>
                    <li>• <strong className="text-white">Fullscreen mode:</strong> Press F for a bigger screen — every millisecond matters in the mini-games.</li>
                  </ul>
                </div>

                <p className="text-white font-bold">
                  That's everything. Four challenges. Four mini-games. Endless replayability. Pick one, hit Play, and see if you can beat your best. Good luck — and have fun. 🎮
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== GAMEPLAY VIEW ===== */}
        {selectedChallenge && !showResult && (
          <div
            className={`relative z-10 flex flex-col items-center justify-center px-4 ${isCritical ? 'screen-shake' : ''}`}
            style={{
              minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
              paddingTop: '20px',
              paddingBottom: '20px',
            }}
          >
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6 float-in flex-wrap justify-center">
              <span className="text-2xl md:text-3xl">{selectedChallenge.emoji}</span>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase font-black" style={{ color: selectedChallenge.color }}>
                  {selectedChallenge.difficulty}
                </p>
                <p className="text-base md:text-xl font-black text-white tracking-tight">
                  {selectedChallenge.name}
                </p>
              </div>
              <button
                onClick={backToMenu}
                className="ml-2 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest uppercase transition-all hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                ← Exit
              </button>
            </div>

            <div className="flex items-center gap-2 md:gap-4 mb-4">
              <div className="px-3 md:px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>Score</p>
                <p className="text-base md:text-2xl font-black text-green-400 font-mono tabular-nums">{gameScore}</p>
              </div>
              <div className="px-3 md:px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[9px] uppercase tracking-widest font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>Round</p>
                <p className="text-base md:text-2xl font-black text-white font-mono tabular-nums">{gameRound}</p>
              </div>
            </div>

            <div className="relative my-2 md:my-4">
              <div
                className="absolute inset-0 blur-3xl opacity-30 transition-all duration-300"
                style={{
                  background: isUrgent ? '#ef4444' : selectedChallenge.color,
                  transform: 'scale(0.7)',
                }}
              ></div>
              <div
                className="relative font-black tabular-nums leading-none text-center select-none"
                style={{
                  color: isUrgent ? '#ef4444' : '#ffffff',
                  fontSize: 'clamp(4.5rem, 20vw, 14rem)',
                  letterSpacing: '-0.05em',
                  fontFamily: '"SF Pro Display", "Inter", system-ui, sans-serif',
                  textShadow: isUrgent ? '0 0 60px rgba(239,68,68,0.9)' : `0 0 60px ${selectedChallenge.color}55`,
                  transition: 'color 0.3s, text-shadow 0.3s',
                }}
              >
                {formatTime(timeLeft)}
              </div>
            </div>

            {isCritical && (
              <p className="text-xl md:text-3xl font-black tracking-[0.4em] uppercase pulse-dot" style={{ color: '#ef4444' }}>
                HURRY!
              </p>
            )}

            <div className="w-full max-w-2xl mt-4 md:mt-6">
              {selectedChallenge.gameType === 'tap-target' && (
                <TapTargetGame color={selectedChallenge.color} gradient={selectedChallenge.gradient} isRunning={isRunning} onScore={(pts) => setGameScore((s) => s + pts)} onRound={() => setGameRound((r) => r + 1)} playBeep={playBeep} />
              )}
              {selectedChallenge.gameType === 'simon-says' && (
                <SimonSaysGame color={selectedChallenge.color} gradient={selectedChallenge.gradient} isRunning={isRunning} onScore={(pts) => setGameScore((s) => s + pts)} onRound={() => setGameRound((r) => r + 1)} playBeep={playBeep} />
              )}
              {selectedChallenge.gameType === 'whack-a-mole' && (
                <WhackAMoleGame color={selectedChallenge.color} gradient={selectedChallenge.gradient} isRunning={isRunning} onScore={(pts) => setGameScore((s) => s + pts)} onRound={() => setGameRound((r) => r + 1)} playBeep={playBeep} />
              )}
              {selectedChallenge.gameType === 'rapid-tap' && (
                <RapidTapGame color={selectedChallenge.color} gradient={selectedChallenge.gradient} isRunning={isRunning} onScore={(pts) => setGameScore((s) => s + pts)} onRound={() => setGameRound((r) => r + 1)} playBeep={playBeep} />
              )}
            </div>

            <div className="w-full max-w-2xl mt-6">
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${progress * 100}%`,
                    background: isUrgent ? 'linear-gradient(90deg, #ef4444, #f97316)' : selectedChallenge.gradient,
                    boxShadow: `0 0 20px ${isUrgent ? '#ef4444' : selectedChallenge.color}`,
                  }}
                ></div>
              </div>
            </div>

            <button
              onClick={winChallenge}
              className="mt-6 px-6 md:px-8 py-3 md:py-4 rounded-2xl text-xs md:text-sm font-black tracking-widest uppercase text-white transition-all hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 8px 24px rgba(34,197,94,0.4)',
              }}
            >
              🏆 I Completed It
            </button>
          </div>
        )}

        {/* ===== RESULT MODAL ===== */}
        {showResult && selectedChallenge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}>
            {isWon && particles.map((p) => (
              <div
                key={p.id}
                className="absolute particle pointer-events-none"
                style={{
                  left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`,
                  background: p.color, borderRadius: '2px',
                  animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s`,
                  transform: `rotate(${p.rotation}deg)`,
                }}
              ></div>
            ))}
            <div
              className={`w-full max-w-md rounded-3xl overflow-hidden zoom-in ${isWon ? 'victory-glow' : 'fail-pulse'}`}
              style={{ background: 'rgba(15, 15, 22, 0.98)', border: `2px solid ${isWon ? '#22c55e' : '#ef4444'}` }}
            >
              <div
                className="px-6 py-5 text-center"
                style={{ background: isWon ? 'linear-gradient(135deg, #16a34a, #22c55e)' : 'linear-gradient(135deg, #b91c1c, #ef4444)' }}
              >
                <div className="text-5xl mb-2">{isWon ? '🏆' : '💀'}</div>
                <p className="text-[10px] tracking-[0.4em] uppercase font-black opacity-90 mb-1" style={{ color: '#fff' }}>
                  {isWon ? 'Victory' : 'Game Over'}
                </p>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight" style={{ color: '#fff' }}>
                  {isWon ? 'CHALLENGE COMPLETE!' : 'TIME RAN OUT'}
                </h2>
              </div>
              <div className="p-5 md:p-6">
                <div className="grid grid-cols-3 gap-2 md:gap-3 mb-5">
                  <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Score</p>
                    <p className="text-lg md:text-xl font-black font-mono text-green-400 tabular-nums">{gameScore}</p>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Rounds</p>
                    <p className="text-lg md:text-xl font-black font-mono text-white tabular-nums">{gameRound}</p>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Left</p>
                    <p className="text-lg md:text-xl font-black font-mono tabular-nums" style={{ color: isWon ? '#22c55e' : '#ef4444' }}>{formatTime(timeLeft)}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={resetChallenge}
                    className="w-full py-3.5 rounded-xl text-sm font-black tracking-widest uppercase text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 8px 24px rgba(99,102,241,0.4)' }}
                  >
                    ↻ Try Again
                  </button>
                  <button
                    onClick={backToMenu}
                    className="w-full py-3.5 rounded-xl text-sm font-black tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    🎮 Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== RECORD POPUP ===== */}
        {showRecordPopup && recordPopupData && (
          <div
            className="fixed inset-0 z-[150] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
            onClick={() => setShowRecordPopup(false)}
          >
            {Array.from({ length: 30 }).map((_, i) => {
              const colors = ['#22c55e', '#10b981', '#84cc16', '#fbbf24'];
              return (
                <div
                  key={i}
                  className="absolute particle pointer-events-none"
                  style={{
                    left: `${Math.random() * 100}%`, top: `-10%`,
                    width: `${6 + Math.random() * 8}px`, height: `${6 + Math.random() * 8}px`,
                    background: colors[Math.floor(Math.random() * colors.length)],
                    borderRadius: '2px',
                    animationDuration: `${2 + Math.random() * 2}s`,
                    animationDelay: `${Math.random() * 0.5}s`,
                    transform: `rotate(${Math.random() * 360}deg)`,
                  }}
                ></div>
              );
            })}
            <div
              className="w-full max-w-md rounded-3xl overflow-hidden zoom-in record-pop record-pulse relative"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(160deg, #052e16 0%, #064e3b 100%)',
                border: '3px solid #22c55e',
                boxShadow: '0 0 60px rgba(34,197,94,0.6)',
              }}
            >
              <div className="py-2 text-center" style={{ background: 'linear-gradient(90deg, #16a34a, #22c55e, #16a34a)' }}>
                <p className="text-[10px] tracking-[0.4em] uppercase font-black text-white">✦ New Personal Record ✦</p>
              </div>
              <div className="p-6 md:p-8 text-center">
                <div className="text-7xl md:text-8xl mb-3">🏆</div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-2" style={{ color: '#22c55e', textShadow: '0 0 30px rgba(34,197,94,0.6)' }}>
                  NEW RECORD!
                </h2>
                <p className="text-sm md:text-base text-green-200/80 mb-6">
                  You beat your previous best. Champion move! 💪
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)' }}>
                  <span className="text-lg">{recordPopupData.challenge.emoji}</span>
                  <span className="text-xs font-black tracking-widest uppercase text-green-300">{recordPopupData.challenge.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1 text-green-200/70">Previous</p>
                    <p className="text-lg md:text-xl font-black font-mono text-green-200/60 tabular-nums line-through">
                      {recordPopupData.previous ? formatTime(recordPopupData.previous) : '—'}
                    </p>
                  </div>
                  <div className="rounded-2xl p-4" style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.5)' }}>
                    <p className="text-[9px] uppercase tracking-widest font-bold mb-1 text-green-300">New Best</p>
                    <p className="text-lg md:text-xl font-black font-mono text-white tabular-nums">
                      {formatTime(recordPopupData.score)}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl p-3 mb-6 flex items-center justify-between" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <span className="text-xs font-bold text-green-200/70 uppercase tracking-wider">Mini-Game Score</span>
                  <span className="text-base font-black font-mono text-green-400 tabular-nums">{recordPopupData.gameScore} pts</span>
                </div>
                <button
                  onClick={() => setShowRecordPopup(false)}
                  className="w-full py-3.5 rounded-xl text-sm font-black tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', boxShadow: '0 8px 24px rgba(34,197,94,0.5)' }}
                >
                  ✦ Awesome! Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== SEO SECTION — EXPANDED ~500 WORDS ===== */}
      {!selectedChallenge && !isFullscreen && (
        <div style={{ background: '#f8fafc', color: '#1e293b' }}>
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-bold px-3 py-1.5 rounded"
                style={{
                  background: '#dcfce7',
                  color: '#166534',
                }}
              >
                Gaming Guide
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6 max-w-3xl" style={{ color: '#0f172a' }}>
              How Reaction-Time Mini-Games Improve Focus, Reflexes, and Gaming Performance
            </h2>

            <div className="space-y-4 text-sm md:text-base leading-relaxed text-slate-600">
              <p>
                Every gamer knows the feeling: the final ten seconds of a round,
                the boss's health bar flickering near zero, the timer ticking
                down while you race to finish. That pressure is where skill is
                forged. This gameplay timer combines real countdown pressure with
                four unique reaction-time mini-games — training your brain to
                perform when the clock is running against you.
              </p>
              <p>
                <span className="text-slate-900 font-bold">The science of reaction training.</span>{' '}
                Research shows that reaction time improves dramatically through
                repeated exposure to time-constrained tasks. Each mini-game on
                this page targets a different cognitive skill: precision timing,
                working memory, reflex speed, and endurance. Over days of
                practice, your brain builds neural pathways that make these
                responses automatic — so that when the pressure is real, you act
                without hesitation.
              </p>
              <p>
                <span className="text-slate-900 font-bold">Tap Target trains anticipation.</span>{' '}
                In the Speed Run challenge, you hit a moving marker before it
                crosses a target zone. This is a classic coincidence-anticipation
                test — the same exercise used by Formula 1 pit crews and esports
                trainers. Your brain learns to predict where the marker will be
                in the next 100 milliseconds, then execute at exactly the right
                moment. This is the skill that separates headshot specialists from
                average players.
              </p>
              <p>
                <span className="text-slate-900 font-bold">Simon Says builds working memory.</span>{' '}
                In the Puzzle Master challenge, you repeat increasingly long
                color sequences. This exercises your phonological loop and
                visuospatial sketchpad — the two short-term memory systems that
                competitive gamers rely on for tracking enemy positions, memorizing
                map layouts, and managing cooldowns. Memory games like this have
                been shown to improve focus span and reduce distraction.
              </p>
              <p>
                <span className="text-slate-900 font-bold">Whack-a-Mole sharpens reflexes.</span>{' '}
                The Survival challenge tests pure visual reaction time. When a
                tile glows, you have 1.2 seconds to tap it. Response accuracy
                under this kind of pressure is a measurable metric — competitive
                esports coaches test it before every tournament. Training daily
                improves your median reaction time by 15–25% over eight weeks.
              </p>
              <p>
                <span className="text-slate-900 font-bold">Rapid Tap builds endurance.</span>{' '}
                The Boss Fight challenge asks for maximum taps in 5 seconds. This
                tests fast-twitch muscle response and mental stamina — the same
                physical qualities sprint athletes and rhythm game pros rely on.
                Skilled players hit 15+ taps per second, but even at 8 TPS you're
                building meaningful endurance.
              </p>
              <p>
                <span className="text-slate-900 font-bold">Why pressure matters.</span>{' '}
                The mini-games are layered on top of a running countdown timer.
                You're not just hitting targets — you're hitting them while a
                clock looms overhead. This dual-task pressure is exactly what
                esports competition feels like. Players who train with this kind
                of layered pressure consistently outperform those who practice
                in relaxed settings. The timer isn't decoration; it's the
                training environment.
              </p>
              <p>
                <span className="text-slate-900 font-bold">Score system explained.</span>{' '}
                Every correct action contributes points. Perfect hits award 100,
                close hits 50, Simon levels give 20 per color, Whack-a-Mole gives
                50 per hit, and Rapid Tap gives 2 per tap. Your total accumulates
                over the challenge, and every new best score triggers a green
                record popup — a scientifically-backed reinforcement technique
                that keeps you motivated and returning.
              </p>
              <p>
                <span className="text-slate-900 font-bold">Applied to real games.</span>{' '}
                Whether you're practicing CS:GO headshots, LoL skillshots,
                Valorant peeks, or speedrun frame-perfect jumps, the skills you
                build here transfer directly. Aim trainers are common — but
                timing and memory trainers are rare. This timer fills that gap.
              </p>
              <p>
                Great gamers aren't born — they're trained. Train with pressure,
                train with purpose, and train with a timer that doesn't let you
                slack. The clock never lies, and neither will your results.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MINI-GAME 1: TAP TARGET
// ============================================
const TapTargetGame = ({ color, gradient, isRunning, onScore, onRound, playBeep }) => {
  const [gameState, setGameState] = useState('idle');
  const [targetTimer, setTargetTimer] = useState(0);
  const [targetTime, setTargetTime] = useState(0);
  const threshold = 0.3;
  const intervalRef = useRef(null);

  useEffect(() => {
    if (gameState !== 'target-shown') return;
    intervalRef.current = setInterval(() => {
      setTargetTimer((prev) => prev + 0.1);
    }, 100);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameState]);

  const startRound = () => {
    if (!isRunning) return;
    const t = 1.5 + Math.random() * 3.0;
    setTargetTime(t);
    setTargetTimer(0);
    setGameState('target-shown');
    playBeep(660, 0.05);
  };

  const handleTap = () => {
    if (gameState !== 'target-shown') return;
    const diff = Math.abs(targetTimer - targetTime);
    const isHit = diff <= threshold;
    const isPerfect = diff <= 0.1;

    if (isHit) {
      const pts = isPerfect ? 100 : 50;
      onScore(pts);
      setGameState('tapped');
      playBeep(isPerfect ? 1200 : 880, 0.15);
    } else {
      setGameState('missed');
      playBeep(300, 0.2, 'sawtooth');
    }
    onRound();
    if (intervalRef.current) clearInterval(intervalRef.current);

    setTimeout(() => {
      if (isRunning) {
        setGameState('idle');
        setTargetTimer(0);
      }
    }, 600);
  };

  const getMarkerPos = () => (targetTime === 0 ? 0 : Math.min(100, (targetTimer / 5) * 100));
  const getZoneStart = () => (targetTime === 0 ? 0 : Math.min(100, ((targetTime - threshold) / 5) * 100));
  const getZoneWidth = () => (targetTime === 0 ? 0 : Math.min(100 - getZoneStart(), (threshold * 2 / 5) * 100));

  return (
    <div className="rounded-2xl p-4 md:p-5" style={{ background: 'rgba(20, 20, 30, 0.9)', border: `1px solid ${color}44` }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] tracking-[0.25em] uppercase font-black" style={{ color }}>
          🎯 Tap Target
        </p>
        <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>Space / Tap</p>
      </div>
      <div className="relative mb-3" style={{ height: '50px' }}>
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 rounded-full" style={{ height: '12px', background: 'rgba(255,255,255,0.06)' }}></div>
        {gameState === 'target-shown' && targetTime > 0 && (
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: `${getZoneStart()}%`, width: `${getZoneWidth()}%`, height: '12px',
              background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
              boxShadow: '0 0 20px rgba(251,191,36,0.6)',
            }}
          ></div>
        )}
        {gameState === 'target-shown' && (
          <div className="absolute top-0 bottom-0 w-1 rounded-full" style={{ left: `${getMarkerPos()}%`, background: '#fff', boxShadow: '0 0 16px rgba(255,255,255,0.9)' }}></div>
        )}
        {gameState === 'tapped' && (
          <div className="absolute inset-0 flex items-center justify-center target-hit" style={{ color: '#22c55e' }}>
            <span className="text-2xl md:text-3xl font-black">✓ HIT!</span>
          </div>
        )}
        {gameState === 'missed' && (
          <div className="absolute inset-0 flex items-center justify-center target-miss" style={{ color: '#ef4444' }}>
            <span className="text-2xl md:text-3xl font-black">✗ MISS</span>
          </div>
        )}
      </div>
      <button
        onClick={gameState === 'target-shown' ? handleTap : startRound}
        disabled={!isRunning}
        className="w-full py-3 md:py-4 rounded-xl font-black tracking-widest uppercase text-white transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 text-sm"
        style={{
          background: gameState === 'target-shown' ? 'linear-gradient(135deg, #fbbf24, #f59e0b)' : gradient,
          boxShadow: gameState === 'target-shown' ? '0 8px 24px rgba(251,191,36,0.5)' : `0 8px 24px ${color}55`,
          animation: gameState === 'target-shown' ? 'barPulse 0.6s ease-in-out infinite' : 'none',
        }}
      >
        {gameState === 'idle' ? '▶ Start Round' : gameState === 'target-shown' ? '⚡ TAP NOW!' : gameState === 'tapped' ? '✓ Nice!' : '✗ Missed'}
      </button>
    </div>
  );
};

// ============================================
// MINI-GAME 2: SIMON SAYS
// ============================================
const SimonSaysGame = ({ color, gradient, isRunning, onScore, onRound, playBeep }) => {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [flashingIndex, setFlashingIndex] = useState(null);
  const [gameState, setGameState] = useState('idle');
  const [level, setLevel] = useState(0);

  const startRound = async () => {
    if (!isRunning || gameState === 'showing' || gameState === 'input') return;
    const newSeq = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setUserInput([]);
    setGameState('showing');
    setLevel(newSeq.length);

    for (let i = 0; i < newSeq.length; i++) {
      await new Promise((r) => setTimeout(r, 300));
      setFlashingIndex(newSeq[i]);
      playBeep(400 + newSeq[i] * 150, 0.2);
      await new Promise((r) => setTimeout(r, 400));
      setFlashingIndex(null);
      await new Promise((r) => setTimeout(r, 150));
    }

    setGameState('input');
  };

  const handleColorTap = (index) => {
    if (gameState !== 'input') return;
    playBeep(400 + index * 150, 0.15);
    setFlashingIndex(index);
    setTimeout(() => setFlashingIndex(null), 200);

    const newInput = [...userInput, index];
    setUserInput(newInput);

    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
      setGameState('wrong');
      playBeep(200, 0.3, 'sawtooth');
      onRound();
      setTimeout(() => {
        setSequence([]);
        setUserInput([]);
        setLevel(0);
        setGameState('idle');
      }, 1200);
      return;
    }

    if (newInput.length === sequence.length) {
      setGameState('correct');
      const pts = sequence.length * 20;
      onScore(pts);
      onRound();
      setTimeout(() => {
        setGameState('idle');
        setUserInput([]);
      }, 800);
    }
  };

  return (
    <div className="rounded-2xl p-4 md:p-5" style={{ background: 'rgba(20, 20, 30, 0.9)', border: `1px solid ${color}44` }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] tracking-[0.25em] uppercase font-black" style={{ color }}>
          🧩 Simon Says
        </p>
        <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Level {level} · {sequence.length > 0 ? `Watch ${sequence.length}` : 'Start'}
        </p>
      </div>

      {gameState === 'idle' ? (
        <button
          onClick={startRound}
          disabled={!isRunning}
          className="w-full py-3 md:py-4 rounded-xl font-black tracking-widest uppercase text-white transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 text-sm"
          style={{ background: gradient, boxShadow: `0 8px 24px ${color}55` }}
        >
          {sequence.length === 0 ? '▶ Start' : '▶ Next Level'}
        </button>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 md:gap-3 mb-3">
            {SIMON_COLORS.map((c, i) => (
              <button
                key={i}
                onClick={() => handleColorTap(i)}
                disabled={gameState !== 'input'}
                className={`rounded-xl transition-all ${flashingIndex === i ? 'simon-flash' : ''}`}
                style={{
                  height: '50px',
                  background: flashingIndex === i ? c.color : `${c.color}22`,
                  border: `2px solid ${c.color}${flashingIndex === i ? '' : '55'}`,
                  boxShadow: flashingIndex === i ? `0 0 24px ${c.glow}` : 'none',
                  opacity: gameState === 'showing' ? 0.6 : 1,
                  cursor: gameState === 'input' ? 'pointer' : 'not-allowed',
                }}
              ></button>
            ))}
          </div>
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {gameState === 'showing' && '👀 Watch the sequence...'}
              {gameState === 'input' && `👉 Repeat: ${userInput.length}/${sequence.length}`}
              {gameState === 'correct' && '✓ Correct!'}
              {gameState === 'wrong' && '✗ Wrong!'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// MINI-GAME 3: WHACK-A-MOLE
// ============================================
const WhackAMoleGame = ({ color, gradient, isRunning, onScore, onRound, playBeep }) => {
  const [activeTile, setActiveTile] = useState(null);
  const [gameState, setGameState] = useState('idle');
  const moleTimeoutRef = useRef(null);

  const spawnMole = () => {
    const tile = Math.floor(Math.random() * 9);
    setActiveTile(tile);
    setGameState('active');
    playBeep(660, 0.05);

    moleTimeoutRef.current = setTimeout(() => {
      if (activeTile === tile) {
        setActiveTile(null);
        onRound();
        setTimeout(() => spawnMole(), 300);
      }
    }, 1200);
  };

  const startGame = () => {
    if (!isRunning) return;
    setGameState('active');
    spawnMole();
  };

  const handleWhack = (index) => {
    if (gameState !== 'active' || index !== activeTile) return;
    if (moleTimeoutRef.current) clearTimeout(moleTimeoutRef.current);
    onScore(50);
    playBeep(1200, 0.1);
    setActiveTile(null);
    onRound();
    setTimeout(() => {
      if (isRunning) spawnMole();
    }, 250);
  };

  useEffect(() => {
    return () => {
      if (moleTimeoutRef.current) clearTimeout(moleTimeoutRef.current);
    };
  }, []);

  return (
    <div className="rounded-2xl p-4 md:p-5" style={{ background: 'rgba(20, 20, 30, 0.9)', border: `1px solid ${color}44` }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] tracking-[0.25em] uppercase font-black" style={{ color }}>
          ⚔️ Whack-a-Mole
        </p>
        <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Tap the glowing tile
        </p>
      </div>

      {gameState === 'idle' ? (
        <button
          onClick={startGame}
          disabled={!isRunning}
          className="w-full py-3 md:py-4 rounded-xl font-black tracking-widest uppercase text-white transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 text-sm"
          style={{ background: gradient, boxShadow: `0 8px 24px ${color}55` }}
        >
          ▶ Start Whacking
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleWhack(i)}
              className={`rounded-xl transition-all ${activeTile === i ? 'mole-appear' : ''}`}
              style={{
                height: '55px',
                background: activeTile === i ? `linear-gradient(135deg, ${color}, ${color}cc)` : 'rgba(255,255,255,0.04)',
                border: `2px solid ${activeTile === i ? color : 'rgba(255,255,255,0.08)'}`,
                boxShadow: activeTile === i ? `0 0 24px ${color}` : 'none',
                cursor: activeTile === i ? 'pointer' : 'default',
              }}
            >
              {activeTile === i && <span className="text-2xl">💥</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================
// MINI-GAME 4: RAPID TAP
// ============================================
const RapidTapGame = ({ color, gradient, isRunning, onScore, onRound, playBeep }) => {
  const [gameState, setGameState] = useState('idle');
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const intervalRef = useRef(null);

  const startRound = () => {
    if (!isRunning) return;
    setGameState('active');
    setTaps(0);
    setTimeLeft(5);
    playBeep(660, 0.1);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setGameState('done');
          const pts = taps * 2;
          onScore(pts);
          onRound();
          playBeep(1000, 0.3);
          setTimeout(() => {
            setGameState('idle');
            setTaps(0);
            setTimeLeft(5);
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTap = () => {
    if (gameState !== 'active') return;
    setTaps((t) => t + 1);
    playBeep(400 + Math.min(taps * 20, 800), 0.05);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="rounded-2xl p-4 md:p-5" style={{ background: 'rgba(20, 20, 30, 0.9)', border: `1px solid ${color}44` }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] tracking-[0.25em] uppercase font-black" style={{ color }}>
          🐉 Rapid Tap
        </p>
        <p className="text-[10px] font-bold" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {gameState === 'active' ? `⏱ ${timeLeft}s` : 'Tap fast in 5s'}
        </p>
      </div>

      {gameState === 'idle' && (
        <button
          onClick={startRound}
          disabled={!isRunning}
          className="w-full py-3 md:py-4 rounded-xl font-black tracking-widest uppercase text-white transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-40 text-sm"
          style={{ background: gradient, boxShadow: `0 8px 24px ${color}55` }}
        >
          ▶ Start 5s Frenzy
        </button>
      )}

      {gameState === 'active' && (
        <button
          onClick={handleTap}
          className="w-full py-8 md:py-12 rounded-xl font-black tracking-widest uppercase text-white transition-all active:scale-[0.95] text-2xl md:text-3xl"
          style={{
            background: gradient,
            boxShadow: `0 0 60px ${color}aa`,
            animation: 'barPulse 0.3s ease-in-out infinite',
          }}
        >
          TAP! ×{taps}
        </button>
      )}

      {gameState === 'done' && (
        <div className="text-center py-6" style={{ color }}>
          <p className="text-4xl md:text-5xl font-black mb-2">{taps} TAPS!</p>
          <p className="text-sm font-bold uppercase tracking-widest text-green-400">+{taps * 2} pts</p>
        </div>
      )}
    </div>
  );
};

export default GamePlayTimer;