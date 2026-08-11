// src/components/Timer/Stopwatch.jsx
import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return {
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      milliseconds: String(milliseconds).padStart(2, '0'),
      formatted: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`
    };
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prev => [...prev, time]);
      toast.success('Lap recorded! 🏁');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    toast('Reset complete');
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setShowFullScreen(true);
    } else {
      document.exitFullscreen();
      setShowFullScreen(false);
    }
  };

  const timeDisplay = formatTime(time);

  // ✅ Lap times formatted
  const formattedLaps = laps.map((lap, index) => ({
    index: index + 1,
    time: formatTime(lap),
    difference: index > 0 ? lap - laps[index - 1] : 0
  }));

  return (
    <div ref={containerRef} className="glass rounded-2xl p-4 sm:p-6 md:p-8 animate-fade-in min-h-[400px] sm:min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-xl sm:text-2xl md:text-3xl">⏱️</span>
          <span className="hidden xs:inline">Digital Stopwatch</span>
          <span className="xs:hidden">Stopwatch</span>
        </h2>
        
        {/* Full Screen Button */}
        <button
          onClick={toggleFullScreen}
          className="p-1.5 sm:p-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs sm:text-sm text-gray-400 hover:text-white transition-all"
        >
          ⛶
        </button>
      </div>

      {/* Timer Display - BIG on mobile */}
      <div className="text-center py-4 sm:py-6 md:py-8">
        <div className="text-6xl xs:text-7xl sm:text-8xl md:text-9xl font-mono font-bold text-white tracking-wider leading-none">
          <span className="inline-block min-w-[2ch]">{timeDisplay.minutes}</span>
          <span className="text-purple-400 mx-0.5 sm:mx-1">:</span>
          <span className="inline-block min-w-[2ch]">{timeDisplay.seconds}</span>
          <span className="text-purple-400/50 mx-0.5 sm:mx-1 text-4xl xs:text-5xl sm:text-6xl md:text-7xl">.</span>
          <span className="inline-block min-w-[2ch] text-4xl xs:text-5xl sm:text-6xl md:text-7xl text-purple-400">
            {timeDisplay.milliseconds}
          </span>
        </div>
        <div className="mt-2 sm:mt-4 text-gray-400 text-xs sm:text-sm">
          {isRunning ? '▶️ Running' : '⏸️ Paused'}
          {isRunning && <span className="ml-2 text-green-400 animate-pulse">●</span>}
        </div>
      </div>

      {/* Controls - Mobile Optimized */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 md:gap-3 justify-center">
        <button 
          onClick={() => setIsRunning(true)} 
          className="flex-1 sm:flex-none px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all text-xs sm:text-sm md:text-base"
        >
          ▶ Start
        </button>
        <button 
          onClick={() => setIsRunning(false)} 
          className="flex-1 sm:flex-none px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-xl transition-all text-xs sm:text-sm md:text-base"
        >
          ⏸ Pause
        </button>
        <button 
          onClick={handleLap} 
          className="flex-1 sm:flex-none px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all text-xs sm:text-sm md:text-base"
        >
          🏁 Lap
        </button>
        <button 
          onClick={handleReset} 
          className="flex-1 sm:flex-none px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-xs sm:text-sm md:text-base"
        >
          🔄 Reset
        </button>
      </div>

      {/* Lap Times - Mobile Responsive */}
      {laps.length > 0 && (
        <div className="mt-4 sm:mt-6 max-h-36 sm:max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-xs sm:text-sm font-medium">🏁 Lap Times</h3>
            <span className="text-gray-500 text-[10px] sm:text-xs">{laps.length} laps</span>
          </div>
          
          <div className="space-y-1">
            {formattedLaps.map((lap) => (
              <div key={lap.index} className="flex justify-between items-center py-1.5 px-2 sm:px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                <span className="text-gray-400 text-xs sm:text-sm">Lap {lap.index}</span>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-white font-mono text-xs sm:text-sm">{lap.time.formatted}</span>
                  {lap.index > 1 && (
                    <span className="text-[10px] sm:text-xs text-purple-400 font-mono">
                      +{formatTime(lap.difference).formatted}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Stopwatch;