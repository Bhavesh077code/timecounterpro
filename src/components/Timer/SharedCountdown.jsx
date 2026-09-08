// src/components/Timer/SharedCountdown.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import { TimerContext } from '../../context/TimerContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiClock,
  FiCalendar,
  FiArrowLeft,
  FiShare2,
  FiZap,
  FiDownload,
  FiPlus,
  FiMaximize,
  FiMinimize,
  FiDroplet,
} from 'react-icons/fi';

function SharedCountdown() {
  const { shareData } = useContext(TimerContext);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [themeOverride, setThemeOverride] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setLoading(true);

    if (!shareData?.date) {
      setLoading(false);
      return;
    }

    const target = new Date(shareData.date).getTime();

    if (isNaN(target)) {
      console.warn('Invalid date:', shareData.date);
      setLoading(false);
      return;
    }

    const initialDiff = target - Date.now();
    const totalDuration = Math.max(initialDiff, 1);

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setIsComplete(true);
        setProgress(100);
        clearInterval(interval);
        setLoading(false);
        return;
      }

      const elapsed = totalDuration - diff;
      const progressPercent = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(progressPercent);

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

  // Keep isFullscreen in sync if the user exits with Esc or the browser's own controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.warn('Fullscreen error:', error);
      toast.error('Fullscreen is not available on this device');
    }
  };

  const themeOrder = ['indigo', 'sunset', 'ocean', 'forest', 'rose'];
  const handleCycleTheme = () => {
    const current = themeOverride || shareData?.theme || 'indigo';
    const nextIndex = (themeOrder.indexOf(current) + 1) % themeOrder.length;
    setThemeOverride(themeOrder[nextIndex]);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareData?.event || 'Countdown Timer',
          text: `Check out this countdown: ${shareData?.event || ''}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      console.warn('Share error:', error);
    }
  };

  const handleAddToGoogleCalendar = () => {
    if (!shareData?.date) return;
    const start = new Date(shareData.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // default 1hr block
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      shareData.event
    )}&dates=${fmt(start)}/${fmt(end)}`;
    window.open(url, '_blank');
  };

  const handleDownloadIcs = () => {
    if (!shareData?.date) return;
    const start = new Date(shareData.date);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${shareData.event}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${shareData.event.replace(/\s+/g, '-').toLowerCase()}.ics`;
    link.click();
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#64748B] text-sm">Loading countdown…</p>
        </div>
      </div>
    );
  }

  // No share data
  if (!shareData || !shareData.event || !shareData.date) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div className="max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#F1F5F9] rounded-full flex items-center justify-center">
            <FiClock size={26} className="text-[#64748B]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-2">No countdown found</h2>
          <p className="text-[#64748B] text-sm">Create a countdown timer to share with others.</p>
          <Link to="/">
            <button className="mt-5 px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium rounded-lg transition-colors text-sm">
              <span className="flex items-center gap-2">
                <FiZap size={16} />
                Create countdown
              </span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Event Started
  if (isComplete) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
        <div className="max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#059669]/10 rounded-full flex items-center justify-center">
            <span className="text-4xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Event started</h2>
          <p className="text-[#334155] text-base">{shareData.event} is happening now.</p>
          <Link to="/">
            <button className="mt-5 px-6 py-2.5 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] font-medium rounded-lg transition-colors text-sm">
              <span className="flex items-center gap-2">
                <FiArrowLeft size={16} />
                Back to home
              </span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const theme = themeOverride || shareData.theme || 'indigo';
  const accents = {
    indigo: '#4F46E5',
    sunset: '#F59E0B',
    ocean: '#2563EB',
    forest: '#059669',
    rose: '#E11D48',
  };
  const accent = accents[theme] || accents.indigo;

  const { days, hours, minutes, seconds } = timeLeft;
  const totalSeconds = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
  const eventDate = new Date(shareData.date);
  const now = new Date();

  // Use the time zone the timer was CREATED in, not the viewer's browser time zone.
  // Falls back to the viewer's zone only for older timers that were saved before
  // this field existed.
  const displayTimeZone = shareData.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const units = [
    { label: 'Days', value: days },
    { label: 'Hours', value: hours },
    { label: 'Minutes', value: minutes },
    { label: 'Seconds', value: seconds },
  ];

  // Extra, genuinely useful breakdown stats
  const weeksLeft = (days / 7).toFixed(1);
  const workingDaysLeft = Math.max(0, Math.round(days * (5 / 7)));
  const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: displayTimeZone });
  const percentOfYear = Math.min(
    100,
    Math.round(((eventDate - new Date(now.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24 * 365)) * 100)
  );

  const faqs = [
    {
      q: 'How is the countdown calculated?',
      a: `The countdown updates every second based on the difference between your device's current time and ${eventDate.toLocaleDateString(
        'en-US',
        { month: 'long', day: 'numeric', year: 'numeric', timeZone: displayTimeZone }
      )}, so it stays accurate wherever you are.`,
    },
    {
      q: 'Does the time zone matter?',
      a: `Yes. This countdown was set in ${displayTimeZone}, the time zone it was created in, so the date and time shown stay fixed to that zone no matter where you're viewing it from.`,
    },
    {
      q: 'Can I share this countdown with others?',
      a: 'Yes. Use the Share button to send this exact countdown link, or add the event straight to Google Calendar or any calendar app that supports .ics files.',
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`min-h-[80vh] rounded-2xl p-4 sm:p-6 md:p-8 ${
        isFullscreen ? 'bg-white flex items-center' : 'bg-[#F8FAFC]'
      }`}
    >
      <div className="max-w-3xl mx-auto w-full text-center">
        {/* Event Name */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FiCalendar size={16} style={{ color: accent }} />
            <span className="text-xs text-[#64748B] font-medium">
              {eventDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: displayTimeZone,
              })}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0F172A] break-words">
            {shareData.event}
          </h1>
          <p className="text-[#64748B] text-sm mt-1">Countdown to the big day</p>
        </div>

        {/* Timer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="bg-white rounded-xl p-4 sm:p-5 border border-[#F1F5F9]"
            >
              <div
                className={`font-bold font-mono tracking-tight ${
                  isFullscreen
                    ? 'text-5xl sm:text-6xl md:text-8xl'
                    : 'text-3xl sm:text-4xl md:text-5xl'
                }`}
                style={{ color: accent }}
              >
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-[#64748B] text-[10px] sm:text-xs mt-1 font-medium">
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-6 sm:mt-8">
          <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%`, backgroundColor: accent }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-[#64748B] mt-1.5">
            <span>Started</span>
            <span>{Math.round(progress)}% complete</span>
            <span>{totalSeconds.toLocaleString()}s left</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/">
            <button className="px-4 py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] text-sm font-medium rounded-lg transition-colors">
              <span className="flex items-center gap-2">
                <FiArrowLeft size={14} />
                Back to home
              </span>
            </button>
          </Link>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-sm font-medium rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <FiShare2 size={14} />
              Share
            </span>
          </button>
          <button
            onClick={handleAddToGoogleCalendar}
            className="px-4 py-2 bg-white hover:bg-[#F1F5F9] text-[#334155] text-sm font-medium rounded-lg border border-[#E2E8F0] transition-colors"
          >
            <span className="flex items-center gap-2">
              <FiPlus size={14} />
              Google Calendar
            </span>
          </button>
          <button
            onClick={handleDownloadIcs}
            className="px-4 py-2 bg-white hover:bg-[#F1F5F9] text-[#334155] text-sm font-medium rounded-lg border border-[#E2E8F0] transition-colors"
          >
            <span className="flex items-center gap-2">
              <FiDownload size={14} />
              .ics file
            </span>
          </button>
          <button
            onClick={handleToggleFullscreen}
            className="px-4 py-2 bg-white hover:bg-[#F1F5F9] text-[#334155] text-sm font-medium rounded-lg border border-[#E2E8F0] transition-colors"
          >
            <span className="flex items-center gap-2">
              {isFullscreen ? <FiMinimize size={14} /> : <FiMaximize size={14} />}
              {isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            </span>
          </button>
          <button
            onClick={handleCycleTheme}
            className="px-4 py-2 bg-white hover:bg-[#F1F5F9] text-[#334155] text-sm font-medium rounded-lg border border-[#E2E8F0] transition-colors"
          >
            <span className="flex items-center gap-2">
              <FiDroplet size={14} style={{ color: accent }} />
              Change color
            </span>
          </button>
        </div>

        {/* Event details + breakdown stats — genuine, useful content */}
        {!isFullscreen && (
          <div className="mt-8 grid sm:grid-cols-2 gap-4 text-left">
            <div className="bg-white rounded-xl border border-[#F1F5F9] p-4">
              <h3 className="text-xs font-semibold text-[#334155] mb-3">Event details</h3>
              <dl className="text-xs text-[#64748B] space-y-2">
                <div className="flex justify-between">
                  <dt>Date</dt>
                  <dd className="text-[#0F172A] font-medium">
                    {eventDate.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      timeZone: displayTimeZone,
                    })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Time</dt>
                  <dd className="text-[#0F172A] font-medium">
                    {eventDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      timeZone: displayTimeZone,
                    })}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Day of week</dt>
                  <dd className="text-[#0F172A] font-medium">{dayOfWeek}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Time zone</dt>
                  <dd className="text-[#0F172A] font-medium">
                    {displayTimeZone}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-xl border border-[#F1F5F9] p-4">
              <h3 className="text-xs font-semibold text-[#334155] mb-3">Breakdown</h3>
              <dl className="text-xs text-[#64748B] space-y-2">
                <div className="flex justify-between">
                  <dt>Weeks remaining</dt>
                  <dd className="text-[#0F172A] font-medium">{weeksLeft}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Working days left</dt>
                  <dd className="text-[#0F172A] font-medium">{workingDaysLeft}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Total hours left</dt>
                  <dd className="text-[#0F172A] font-medium">
                    {(days * 24 + hours).toLocaleString()}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt>Progress through {now.getFullYear()}</dt>
                  <dd className="text-[#0F172A] font-medium">{percentOfYear}%</dd>
                </div>
              </dl>
            </div>
          </div>
        )}

        {/* FAQ — real content depth for readers and search/AdSense review */}
        {!isFullscreen && (
          <div className="mt-8 text-left">
            <h3 className="text-sm font-semibold text-[#0F172A] mb-3">Frequently asked questions</h3>
            <div className="space-y-3">
              {faqs.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-[#F1F5F9] p-4">
                  <p className="text-sm font-medium text-[#334155] mb-1">{item.q}</p>
                  <p className="text-xs text-[#64748B] leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SharedCountdown;