import React, { useContext, useState } from 'react';
import { TimerContext } from '../context/TimerContext';
import { formatTime, calculateStats } from '../utils/helpers';

function TimerHistory() {
  const { completedTimers, clearHistory } = useContext(TimerContext);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = calculateStats(completedTimers);
  const filteredTimers = completedTimers.filter(timer => {
    const matchFilter = filter === 'all' || timer.type === filter;
    const matchSearch = timer.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (completedTimers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-7xl mb-4">📭</div>
        <h3 className="text-2xl font-bold text-white mb-2">No History</h3>
        <p className="text-gray-400">Complete some timers to see your history here!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-gray-500">Total</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-400">{Math.floor(stats.totalTime / 3600)}h</div>
          <div className="text-xs text-gray-500">Total Time</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-pink-400">{Math.floor(stats.averageTime / 60)}m</div>
          <div className="text-xs text-gray-500">Average</div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{stats.mostPopular || 'N/A'}</div>
          <div className="text-xs text-gray-500">Most Used</div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          <button onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-lg text-sm transition-all ${filter === 'all' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            All ({completedTimers.length})
          </button>
          <button onClick={() => setFilter('preset')} className={`px-4 py-1.5 rounded-lg text-sm transition-all ${filter === 'preset' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            Presets
          </button>
          <button onClick={() => setFilter('custom')} className={`px-4 py-1.5 rounded-lg text-sm transition-all ${filter === 'custom' ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}>
            Custom
          </button>
        </div>
        
        <div className="flex gap-2">
          <input type="text" placeholder="🔍 Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-500" />
          <button onClick={() => { if (window.confirm('Clear all history?')) clearHistory(); }} className="px-4 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-all">Clear</button>
        </div>
      </div>

      <div className="space-y-2">
        {filteredTimers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No timers found</div>
        ) : (
          filteredTimers.map((timer) => (
            <div key={timer.id} className="bg-white/5 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-2 hover:bg-white/10 transition-all">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{timer.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${timer.type === 'preset' ? 'bg-purple-500/20 text-purple-300' : 'bg-pink-500/20 text-pink-300'}`}>
                    {timer.type}
                  </span>
                </div>
                <div className="flex gap-3 text-xs text-gray-500 mt-1">
                  <span>⏱️ {formatTime(timer.duration).short}</span>
                  <span>📅 {new Date(timer.completedAt).toLocaleDateString()}</span>
                  <span>🕐 {new Date(timer.completedAt).toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✅</span>
                <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Done</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TimerHistory;