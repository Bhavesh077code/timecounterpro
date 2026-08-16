

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

function TimerDashboard() {
  const { activeTimers } = useContext(TimerContext);
  const [fullScreenTimer, setFullScreenTimer] = useState(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

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
      toast('🔕 Timer notifications disabled');
      return;
    }

    const enabled = await enableNotifications();

    if (enabled) {
      setNotificationsEnabled(true);
      toast.success('🔔 Timer notifications enabled');
    } else if (Notification.permission === 'denied') {
      toast.error('Notifications are blocked. Allow them in browser settings.');
    } else {
      toast.error('Notification permission was not granted.');
    }
  };

  const runningCount = activeTimers.filter((t) => t.status === 'running').length;

  if (activeTimers.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 md:py-20 lg:py-24 animate-fade-in px-4">
        <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 sm:mb-6 animate-float">⏰</div>

        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          No Active Timers
        </h3>

        <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-md mx-auto">
          Start a timer using the <span className="text-purple-400 font-semibold">presets</span> or <span className="text-pink-400 font-semibold">custom options</span> above!
        </p>

        <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {['☕ Quick Break', '🎯 Focus', '💪 Workout', '📚 Study'].map((item) => (
            <span
              key={item}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-purple-500/10 text-purple-300 rounded-full text-[10px] sm:text-xs md:text-sm border border-purple-500/20"
            >
              {item}
            </span>
          ))}
        </div>

        {isNotificationSupported() && (
          <button
            type="button"
            onClick={handleNotificationToggle}
            className="mt-6 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs sm:text-sm transition"
          >
            {notificationsEnabled ? '🔔 Notifications On' : '🔕 Enable Timer Notifications'}
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

      <div className="flex flex-wrap items-center justify-between mb-4 sm:mb-5 md:mb-6 gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <div className="text-xl sm:text-2xl">🕐</div>
            {runningCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full animate-pulse" />
            )}
          </div>

          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
            Active Timers
          </h2>

          <span className="text-[10px] sm:text-xs md:text-sm font-normal bg-purple-500/20 text-purple-300 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-purple-500/30">
            {activeTimers.length}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm">
          {isNotificationSupported() && (
            <button
              type="button"
              onClick={handleNotificationToggle}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border transition ${
                notificationsEnabled
                  ? 'bg-purple-500/15 border-purple-500/30 text-purple-300'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
              title="Timer completion notifications"
            >
              {notificationsEnabled ? '🔔 On' : '🔕 Notifications'}
            </button>
          )}

          <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-gray-400">
              <span className="text-white font-medium">{runningCount}</span>
              <span className="hidden xs:inline ml-1">running</span>
            </span>
          </div>

          {activeTimers.length > 1 && (
            <span className="text-gray-500 text-[8px] sm:text-[10px] hidden sm:inline">
              {activeTimers.length - runningCount} paused
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {activeTimers.map((timer, index) => (
          <div
            key={timer.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <TimerCard timer={timer} onFullScreen={handleFullScreen} />
          </div>
        ))}
      </div>

      {activeTimers.length > 2 && (
        <div className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-gray-500 border-t border-white/5 pt-4 sm:pt-6">
          💡 You have <span className="text-purple-400 font-medium">{activeTimers.length} timers</span> active.
        </div>
      )}
    </div>
  );
}

export default TimerDashboard;
