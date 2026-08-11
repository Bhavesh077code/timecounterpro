// src/components/Timer/SharedCountdown.jsx
import React, { useState, useEffect, useContext } from 'react';
import { TimerContext } from '../../context/TimerContext';
import { Link } from 'react-router-dom';

function SharedCountdown() {
  const { shareData } = useContext(TimerContext);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    if (!shareData?.date) {
      setLoading(false);
      return;
    }

    const target = new Date(shareData.date).getTime();
    
    if (isNaN(target)) {
      console.warn('⚠️ Invalid date:', shareData.date);
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsComplete(true);
        clearInterval(interval);
        setLoading(false);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
      setLoading(false);
    }, 1000);

    return () => clearInterval(interval);
  }, [shareData]);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400 text-sm sm:text-base">Loading countdown...</p>
        </div>
      </div>
    );
  }

  // ✅ If no share data, show message
  if (!shareData || !shareData.event || !shareData.date) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4 animate-fade-in">
        <div>
          <div className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6">⚠️</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">No Countdown Found</h2>
          <p className="text-gray-400 text-sm sm:text-base">Please create a countdown first.</p>
          <Link to="/">
            <button className="mt-4 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 text-sm sm:text-base">
              🚀 Create Countdown
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Event Started
  if (isComplete) {
    return (
      <div className="min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center text-center px-4 animate-fade-in">
        <div>
          <div className="text-7xl sm:text-8xl md:text-9xl mb-4 sm:mb-6 animate-bounce">🎉</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">Event Started!</h2>
          <p className="text-purple-300 text-lg sm:text-xl md:text-2xl">{shareData.event} is happening now! 🥳</p>
          <Link to="/">
            <button className="mt-4 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 bg-white/10 border border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 text-sm sm:text-base">
              🏠 Go to Home
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
    <div className={`min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center bg-gradient-to-br ${bgClasses[theme] || bgClasses.neon} rounded-2xl p-4 sm:p-6 md:p-8 animate-fade-in`}>
      <div className="text-center max-w-4xl mx-auto w-full px-2 sm:px-4">
        {/* Event Name - Mobile Responsive */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 break-words">
          {shareData.event}
        </h1>

        {/* Timer Grid - 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {/* Days */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-mono">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-white/60 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2">Days</div>
          </div>

          {/* Hours */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-mono">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-white/60 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2">Hours</div>
          </div>

          {/* Minutes */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-mono">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-white/60 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2">Minutes</div>
          </div>

          {/* Seconds - with pulse animation */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/20">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-mono animate-pulse">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-white/60 text-[10px] sm:text-xs md:text-sm mt-1 sm:mt-2">Seconds</div>
          </div>
        </div>

        {/* Bottom Info - Mobile Responsive */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
          <p className="text-white/50 text-xs sm:text-sm">
            🎯 {new Date(shareData.date).toLocaleString()}
          </p>
          <Link to="/">
            <button className="px-4 sm:px-5 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 border border-white/10">
              ← Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SharedCountdown;