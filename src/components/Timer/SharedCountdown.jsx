// src/components/Timer/SharedCountdown.jsx
import React, { useState, useEffect, useContext } from 'react';
import { TimerContext } from '../../context/TimerContext';
import { Link } from 'react-router-dom';

function SharedCountdown() {
  const { shareData } = useContext(TimerContext);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!shareData?.date) return;

    const target = new Date(shareData.date).getTime();
    
    // ✅ Check if date is valid
    if (isNaN(target)) {
      console.warn('Invalid date:', shareData.date);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsComplete(true);
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [shareData]);

  // ✅ If no share data, show message
  if (!shareData || !shareData.event || !shareData.date) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="text-6xl mb-6">⚠️</div>
        <h2 className="text-3xl font-bold text-white mb-4">No Countdown Found</h2>
        <p className="text-gray-400">Please create a countdown first.</p>
        <Link to="/">
          <button className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
            Create Countdown
          </button>
        </Link>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-center animate-fade-in">
        <div>
          <div className="text-8xl mb-6 animate-bounce">🎉</div>
          <h2 className="text-5xl font-bold text-white mb-4">Event Started!</h2>
          <p className="text-purple-300 text-xl">{shareData.event} is happening now! 🥳</p>
          <Link to="/">
            <button className="mt-6 px-6 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300">
              Go to Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const theme = shareData.theme || 'neon';
  const bgClasses = {
    neon: 'from-purple-900 to-pink-900',
    sunset: 'from-orange-600 to-pink-600',
    cyber: 'from-cyan-900 to-purple-900',
    ocean: 'from-blue-900 to-teal-900',
    forest: 'from-green-900 to-emerald-900',
  };

  return (
    <div className={`min-h-[80vh] flex items-center justify-center bg-gradient-to-br ${bgClasses[theme] || bgClasses.neon} rounded-2xl p-8 animate-fade-in`}>
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
          {shareData.event}
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="text-5xl md:text-7xl font-bold text-white font-mono">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="text-white/60 text-sm mt-2">Days</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="text-5xl md:text-7xl font-bold text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-white/60 text-sm mt-2">Hours</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="text-5xl md:text-7xl font-bold text-white font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-white/60 text-sm mt-2">Minutes</div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
            <div className="text-5xl md:text-7xl font-bold text-white font-mono animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-white/60 text-sm mt-2">Seconds</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <p className="text-white/50 text-sm">
            🎯 {new Date(shareData.date).toLocaleString()}
          </p>
          <Link to="/">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all duration-300 border border-white/10">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SharedCountdown;