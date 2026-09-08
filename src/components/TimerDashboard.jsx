// src/components/TimerDashboard.jsx
import React, { useContext, useEffect, useState } from 'react';
import { TimerContext } from '../context/TimerContext';
import TimerCard from './TimerCard';
import FullScreenTimer from './FullScreenTimer';
import {
  disableNotifications,
  enableNotifications,
  getNotificationEnabled,
  isNotificationSupported,
} from '../utils/notifications';
import toast from 'react-hot-toast';
import { FiClock, FiBell, FiBellOff, FiPlay, FiPause, FiGrid, FiList } from 'react-icons/fi';

function TimerDashboard() {
  const { activeTimers } = useContext(TimerContext);
  const [fullScreenTimer, setFullScreenTimer] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    setNotificationsEnabled(getNotificationEnabled());
  }, []);

  const handleFullScreen = (timer) => {
    setFullScreenTimer(timer);
  };

  const handleCloseFullScreen = () => {
    setFullScreenTimer(null);
  };

  const handleNotificationToggle = async () => {
    if (!isNotificationSupported()) {
      toast.error('Browser notifications are not supported here.');
      return;
    }

    if (notificationsEnabled) {
      disableNotifications();
      setNotificationsEnabled(false);
      toast.success('Timer notifications disabled');
      return;
    }

    const enabled = await enableNotifications();

    if (enabled) {
      setNotificationsEnabled(true);
      toast.success('Timer notifications enabled');
    } else if (Notification.permission === 'denied') {
      toast.error('Notifications are blocked. Allow them in browser settings.');
    } else {
      toast.error('Notification permission was not granted.');
    }
  };

  const runningCount = activeTimers.filter((t) => t.status === 'running').length;
  const pausedCount = activeTimers.filter((t) => t.status === 'paused').length;

  // Preset suggestions for empty state
  const presetSuggestions = [
    { name: 'Quick Break', duration: '5 min' },
    { name: 'Focus Session', duration: '15 min' },
    { name: 'Workout', duration: '30 min' },
    { name: 'Study', duration: '45 min' },
  ];

  if (activeTimers.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 md:py-20 lg:py-24 animate-fade-in px-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mx-auto mb-4 sm:mb-6 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
          <FiClock size={40} className="sm:w-[48px] sm:h-[48px] md:w-[56px] md:h-[56px] text-indigo-400" />
        </div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-2 sm:mb-3">
          No Active Timers
        </h3>

        <p className="text-slate-500 text-sm sm:text-base md:text-lg max-w-md mx-auto">
          Start a timer using the <span className="text-indigo-600 font-semibold">presets</span> or <span className="text-emerald-600 font-semibold">custom options</span> above
        </p>

        <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {presetSuggestions.map((item) => (
            <span
              key={item.name}
              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs border border-indigo-200 font-medium"
            >
              {item.name} ({item.duration})
            </span>
          ))}
        </div>

        {isNotificationSupported() && (
          <button
            type="button"
            onClick={handleNotificationToggle}
            className="mt-6 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-sm font-medium transition-all hover:shadow-sm"
          >
            {notificationsEnabled ? (
              <span className="flex items-center gap-2">
                <FiBell size={16} className="text-indigo-600" />
                Notifications On
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FiBellOff size={16} className="text-slate-500" />
                Enable Notifications
              </span>
            )}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      {fullScreenTimer && (
        <FullScreenTimer timer={fullScreenTimer} onClose={handleCloseFullScreen} />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-5 md:mb-6 gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-100">
              <FiClock size={18} className="text-indigo-600" />
            </div>
            {runningCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse border-2 border-white" />
            )}
          </div>

          <div>
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-slate-900">
              Active Timers
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block">
              {runningCount} running {pausedCount > 0 && `• ${pausedCount} paused`}
            </p>
          </div>

          <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
            {activeTimers.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Notification Toggle */}
          {isNotificationSupported() && (
            <button
              type="button"
              onClick={handleNotificationToggle}
              className={`p-2 rounded-lg border transition-all ${
                notificationsEnabled
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
              title={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
              aria-label={notificationsEnabled ? 'Disable notifications' : 'Enable notifications'}
            >
              {notificationsEnabled ? <FiBell size={16} /> : <FiBellOff size={16} />}
            </button>
          )}

          {/* View Toggle */}
          <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              aria-label="Grid view"
              title="Grid view"
            >
              <FiGrid size={14} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              aria-label="List view"
              title="List view"
            >
              <FiList size={14} />
            </button>
          </div>

          {/* Status Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <span className={`w-1.5 h-1.5 rounded-full ${runningCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{runningCount}</span>
              <span className="text-slate-400 ml-1">running</span>
            </span>
          </div>
        </div>
      </div>

      {/* Timer Grid */}
      <div className={`grid gap-3 sm:gap-4 md:gap-5 lg:gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {activeTimers.map((timer, index) => (
          <div
            key={timer.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <TimerCard timer={timer} onFullScreen={handleFullScreen} viewMode={viewMode} />
          </div>
        ))}
      </div>

      {/* Footer Info */}
      {activeTimers.length > 2 && (
        <div className="mt-6 sm:mt-8 text-center text-xs text-slate-400 border-t border-slate-200 pt-4 sm:pt-6">
          <span className="flex items-center justify-center gap-2">
            <FiClock size={12} className="text-slate-400" />
            You have <span className="text-indigo-600 font-medium">{activeTimers.length} active timers</span>
            {runningCount > 0 && (
              <span className="text-emerald-600">
                • {runningCount} currently running
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

export default TimerDashboard;