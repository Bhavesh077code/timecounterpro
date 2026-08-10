import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);

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
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
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
  };

  return (
    <div className="glass rounded-2xl p-6 md:p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-white mb-6">⏱️ Digital Stopwatch</h2>

      <div className="text-center py-8">
        <div className="text-6xl md:text-7xl font-mono font-bold text-white">
          {formatTime(time)}
        </div>
        <div className="mt-4 text-gray-400 text-sm">
          {isRunning ? '▶️ Running' : '⏸️ Paused'}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={() => setIsRunning(true)} className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all">▶ Start</button>
        <button onClick={() => setIsRunning(false)} className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-xl transition-all">⏸ Pause</button>
        <button onClick={handleLap} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all">🏁 Lap</button>
        <button onClick={handleReset} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all">🔄 Reset</button>
      </div>

      {laps.length > 0 && (
        <div className="mt-6 max-h-48 overflow-y-auto">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Lap Times</h3>
          {laps.map((lap, i) => (
            <div key={i} className="flex justify-between py-1.5 border-b border-white/5 text-sm">
              <span className="text-gray-400">Lap {i + 1}</span>
              <span className="text-white font-mono">{formatTime(lap)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Stopwatch;