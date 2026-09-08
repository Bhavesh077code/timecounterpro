import React, { useContext, useState, useMemo } from 'react';
import { TimerContext } from '../context/TimerContext';
import { formatTime, calculateStats } from '../utils/helpers';
import { FiSearch, FiTrash2, FiClock, FiCalendar, FiBarChart2, FiFilter } from 'react-icons/fi';

function TimerHistory() {
  const { completedTimers, clearHistory } = useContext(TimerContext);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Calculate stats with useMemo for performance
  const stats = useMemo(() => calculateStats(completedTimers), [completedTimers]);

  // Filter and sort timers
  const filteredTimers = useMemo(() => {
    let timers = completedTimers.filter(timer => {
      const matchFilter = filter === 'all' || timer.type === filter;
      const matchSearch = timer.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchFilter && matchSearch;
    });

    // Sort timers
    switch (sortBy) {
      case 'newest':
        timers.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        break;
      case 'oldest':
        timers.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
        break;
      case 'longest':
        timers.sort((a, b) => b.duration - a.duration);
        break;
      case 'shortest':
        timers.sort((a, b) => a.duration - b.duration);
        break;
      default:
        break;
    }

    return timers;
  }, [completedTimers, filter, searchTerm, sortBy]);

  // Get unique timer types for filter
  const timerTypes = useMemo(() => {
    const types = new Set(completedTimers.map(t => t.type));
    return ['all', ...Array.from(types)];
  }, [completedTimers]);

  // Get most used timer name
  const getMostUsed = () => {
    if (completedTimers.length === 0) return 'N/A';
    const nameCount = {};
    completedTimers.forEach(t => {
      nameCount[t.name] = (nameCount[t.name] || 0) + 1;
    });
    let maxCount = 0;
    let mostUsed = 'N/A';
    for (const [name, count] of Object.entries(nameCount)) {
      if (count > maxCount) {
        maxCount = count;
        mostUsed = name;
      }
    }
    return mostUsed;
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear all timer history? This action cannot be undone.')) {
      clearHistory();
      setShowClearConfirm(false);
    }
  };

  // Export history as CSV
  const exportHistory = () => {
    if (completedTimers.length === 0) {
      toast.error('No history to export');
      return;
    }

    const headers = ['Name', 'Type', 'Duration (seconds)', 'Completed At'];
    const rows = completedTimers.map(t => [
      t.name,
      t.type,
      t.duration,
      new Date(t.completedAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timer-history-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (completedTimers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
          <FiClock size={32} className="text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No History</h3>
        <p className="text-slate-500 text-sm">Complete some timers to see your history here</p>
        <p className="text-slate-400 text-xs mt-2">Your completed timers will appear here automatically</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          <div className="text-xs text-slate-500 font-medium">Total Timers</div>
          <div className="text-[10px] text-slate-400 mt-1">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-indigo-600">{Math.floor(stats.totalTime / 3600)}h</div>
          <div className="text-xs text-slate-500 font-medium">Total Time</div>
          <div className="text-[10px] text-slate-400 mt-1">{Math.floor((stats.totalTime % 3600) / 60)}m remaining</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-emerald-600">{Math.floor(stats.averageTime / 60)}m</div>
          <div className="text-xs text-slate-500 font-medium">Average Duration</div>
          <div className="text-[10px] text-slate-400 mt-1">per timer</div>
        </div>
        <div className="bg-white rounded-xl p-4 text-center border border-slate-200 shadow-sm">
          <div className="text-2xl font-bold text-amber-600 truncate" title={getMostUsed()}>
            {getMostUsed().length > 12 ? getMostUsed().slice(0, 12) + '...' : getMostUsed()}
          </div>
          <div className="text-xs text-slate-500 font-medium">Most Used</div>
          <div className="text-[10px] text-slate-400 mt-1">timer name</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {timerTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === type
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              {type === 'all' && (
                <span className="ml-1 text-[10px] opacity-70">({completedTimers.length})</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <div className="relative">
            <FiSearch size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search timers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 w-32 sm:w-40 transition-all"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="longest">Longest First</option>
            <option value="shortest">Shortest First</option>
          </select>

          {/* Export */}
          <button
            onClick={exportHistory}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-all hover:shadow-sm"
            title="Export history as CSV"
          >
            Export
          </button>

          {/* Clear */}
          <button
            onClick={handleClearHistory}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5"
          >
            <FiTrash2 size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Timer List */}
      {filteredTimers.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-slate-500 text-sm">No timers found matching your criteria</p>
          <button
            onClick={() => { setFilter('all'); setSearchTerm(''); }}
            className="mt-2 text-indigo-600 text-sm hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTimers.map((timer) => (
            <div
              key={timer.id}
              className="bg-white rounded-xl p-4 border border-slate-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-slate-900 font-medium text-sm truncate">
                      {timer.name}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      timer.type === 'preset'
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        : timer.type === 'countdown'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {timer.type}
                    </span>
                    {timer.duration >= 3600 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Long
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1.5">
                    <span className="flex items-center gap-1">
                      <FiClock size={12} className="text-slate-400" />
                      {formatTime(timer.duration).short}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={12} className="text-slate-400" />
                      {new Date(timer.completedAt).toLocaleDateString()}
                    </span>
                    <span className="text-slate-400">
                      {new Date(timer.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
                    Complete
                  </span>
                  <span className="text-emerald-600">
                    <FiBarChart2 size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Summary */}
      {filteredTimers.length > 0 && (
        <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-200 pt-3 mt-2">
          <span>
            Showing {filteredTimers.length} of {completedTimers.length} timers
          </span>
          <span>
            Total time: {Math.floor(stats.totalTime / 3600)}h {Math.floor((stats.totalTime % 3600) / 60)}m
          </span>
        </div>
      )}
    </div>
  );
}

export default TimerHistory;