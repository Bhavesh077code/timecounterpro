import React from 'react';

const MODES = [
  { id: 'countdown', label: '📅 Countdown' },
  { id: 'stopwatch', label: '⏱️ Stopwatch' },
  { id: 'pomodoro', label: '🍅Pomodoro'  },
];

function ModeSelector({ mode, setMode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-white/5 rounded-xl p-1 border border-white/5">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
            mode === m.id
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

export default ModeSelector; 