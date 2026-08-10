// src/components/Timer/PomodoroTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

function PomodoroTimer() {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  // ✅ Create Tick Sound using Web Audio API
  const playTickSound = () => {
    if (!soundEnabled) return;
    
    try {
      // Create audio context if not exists
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const context = audioContextRef.current;
      
      // Create oscillator for tick sound
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      // Short high-frequency tick
      oscillator.frequency.value = 1200;
      oscillator.type = 'sine';
      
      // Very short duration
      gainNode.gain.setValueAtTime(0.15, context.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.05);
      
      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 0.05);
      
      // ✅ Second tick (softer)
      const oscillator2 = context.createOscillator();
      const gainNode2 = context.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(context.destination);
      
      oscillator2.frequency.value = 800;
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0.08, context.currentTime + 0.03);
      gainNode2.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.08);
      
      oscillator2.start(context.currentTime + 0.03);
      oscillator2.stop(context.currentTime + 0.08);
      
    } catch (error) {
      console.warn('Sound error:', error);
    }
  };

  // ✅ Play completion sound
  const playCompletionSound = () => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const context = audioContextRef.current;
      
      // Three ascending notes
      const notes = [523, 659, 784]; // C5, E5, G5
      
      notes.forEach((freq, i) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        
        const startTime = context.currentTime + i * 0.15;
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.2);
      });
      
    } catch (error) {
      console.warn('Completion sound error:', error);
    }
  };

  // ✅ Timer Logic with Tick Sound
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            
            // ✅ Play completion sound
            playCompletionSound();
            
            toast.success(`${mode === 'focus' ? '🎯 Focus' : '☕ Break'} complete!`);

            if (mode === 'focus') {
              setSessions(prevSessions => prevSessions + 1);
              setMode('break');
              setTimeLeft(BREAK_TIME);
            } else {
              setMode('focus');
              setTimeLeft(FOCUS_TIME);
            }
            return 0;
          }
          
          // ✅ Play tick sound on every second (except last)
          if (prev > 2) {
            playTickSound();
          }
          
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    // ✅ Resume audio context if suspended
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'focus' ? FOCUS_TIME : BREAK_TIME);
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toast(soundEnabled ? '🔇 Sound Off' : '🔊 Sound On');
  };

  const progress = mode === 'focus' 
    ? ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * 100
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className="glass rounded-2xl p-6 md:p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>🍅</span> Pomodoro Timer
        </h2>
        
        {/* ✅ Sound Toggle Button */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-lg transition-all duration-300 ${
            soundEnabled 
              ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' 
              : 'bg-white/5 text-gray-500 hover:bg-white/10'
          }`}
          aria-label="Toggle sound"
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      <div className="text-center py-8">
        <div className="text-sm text-gray-400 mb-2">
          {mode === 'focus' ? '🎯 Focus Time' : '☕ Break Time'}
        </div>
        <div className="text-7xl md:text-8xl font-mono font-bold text-white">
          {formatTime(timeLeft)}
        </div>
        <div className="mt-4 text-gray-400 text-sm">
          Sessions Completed: <span className="text-purple-400 font-bold">{sessions}</span>
        </div>
      </div>

      <div className="w-full bg-white/10 rounded-full h-2 mb-6">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            mode === 'focus' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'
          }`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button 
          onClick={toggleTimer} 
          className={`px-8 py-3 text-white font-semibold rounded-xl transition-all ${
            isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isRunning ? '⏸ Pause' : '▶ Start'}
        </button>
        <button 
          onClick={handleReset} 
          className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
        >
          🔄 Reset
        </button>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
        {isRunning && (
          <span className="ml-3 text-purple-400 animate-pulse">● Live</span>
        )}
      </div>
    </div>
  );
}

export default PomodoroTimer;