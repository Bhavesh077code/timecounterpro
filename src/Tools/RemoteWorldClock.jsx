import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';

// ============================================
// TIMEZONES
// ============================================
const CITIES = [
  {
    id: 'sf',
    city: 'San Francisco',
    country: 'USA',
    tz: 'America/Los_Angeles',
    flag: '🇺🇸',
    role: 'HQ · West Coast',
    workStart: 9,
    workEnd: 18,
  },
  {
    id: 'ny',
    city: 'New York',
    country: 'USA',
    tz: 'America/New_York',
    flag: '🇺🇸',
    role: 'Sales · East Coast',
    workStart: 9,
    workEnd: 18,
  },
  {
    id: 'london',
    city: 'London',
    country: 'UK',
    tz: 'Europe/London',
    flag: '🇬🇧',
    role: 'EMEA Operations',
    workStart: 9,
    workEnd: 18,
  },
  {
    id: 'berlin',
    city: 'Berlin',
    country: 'Germany',
    tz: 'Europe/Berlin',
    flag: '🇩🇪',
    role: 'Engineering · EU',
    workStart: 9,
    workEnd: 18,
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    country: 'India',
    tz: 'Asia/Kolkata',
    flag: '🇮🇳',
    role: 'Engineering · APAC',
    workStart: 9,
    workEnd: 18,
  },
  {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    tz: 'Asia/Singapore',
    flag: '🇸🇬',
    role: 'APAC Sales Hub',
    workStart: 9,
    workEnd: 18,
  },
  {
    id: 'tokyo',
    city: 'Tokyo',
    country: 'Japan',
    tz: 'Asia/Tokyo',
    flag: '🇯🇵',
    role: 'APAC Partnerships',
    workStart: 9,
    workEnd: 18,
  },
  {
    id: 'sydney',
    city: 'Sydney',
    country: 'Australia',
    tz: 'Australia/Sydney',
    flag: '🇦🇺',
    role: 'ANZ Team',
    workStart: 9,
    workEnd: 18,
  },
];

// ============================================
// UTILITIES
// ============================================
function getTimeInZone(tz, offsetMinutes = 0) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + offsetMinutes);
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const parts = formatter.formatToParts(now);
    const get = (type) => parts.find((p) => p.type === type)?.value || '00';
    return {
      hh: get('hour'),
      mm: get('minute'),
      ss: get('second'),
      hour24: parseInt(get('hour'), 10),
      minute: parseInt(get('minute'), 10),
    };
  } catch (e) {
    return { hh: '00', mm: '00', ss: '00', hour24: 0, minute: 0 };
  }
}

function getDateInZone(tz, offsetMinutes = 0) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + offsetMinutes);
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(now);
  } catch (e) {
    return '';
  }
}

function getZoneOffsetMinutes(tz) {
  // Get offset of a timezone relative to UTC (in minutes)
  const now = new Date();
  try {
    const local = new Date(now.toLocaleString('en-US', { timeZone: tz }));
    const utc = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    return Math.round((local.getTime() - utc.getTime()) / 60000);
  } catch (e) {
    return 0;
  }
}

function formatOffset(minutes) {
  const sign = minutes >= 0 ? '+' : '−';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m > 0 ? ':' + String(m).padStart(2, '0') : ''}`;
}

// ============================================
// MAIN COMPONENT
// ============================================
const RemoteWorldClock = () => {
  const [offsetMinutes, setOffsetMinutes] = useState(0); // user time-travel offset
  const [tick, setTick] = useState(0); // re-render trigger
  const [baseOffset, setBaseOffset] = useState(0); // user's local tz offset
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  const intervalRef = useRef(null);
  const pageRef = useRef(null);

  // --- Live tick every second ---
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // --- Init base offset ---
  useEffect(() => {
    setBaseOffset(-new Date().getTimezoneOffset());
  }, []);

  // --- Fullscreen ---
  const toggleFullscreen = useCallback(() => {
    const el = pageRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  // --- Keyboard ---
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.key === 'f' || e.key === 'F') toggleFullscreen();
      if (e.key === 'd' || e.key === 'D') setDarkMode((v) => !v);
      if (e.key === 'Escape' || e.key === '0') setOffsetMinutes(0);
      if (e.key === 'ArrowRight') setOffsetMinutes((v) => Math.min(720, v + 60));
      if (e.key === 'ArrowLeft') setOffsetMinutes((v) => Math.max(-720, v - 60));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [toggleFullscreen]);

  // --- Theme ---
  const theme = darkMode
    ? {
        bg: '#0f172a',
        bg2: '#1e293b',
        card: '#1e293b',
        cardBorder: '#334155',
        text: '#f1f5f9',
        textMuted: '#94a3b8',
        textSubtle: '#64748b',
        accent: '#3b82f6',
        accentSoft: '#1e3a8a',
        green: '#10b981',
        greenSoft: '#064e3b',
        amber: '#f59e0b',
        amberSoft: '#78350f',
        red: '#ef4444',
        redSoft: '#7f1d1d',
        divider: '#334155',
        inputBg: '#0f172a',
      }
    : {
        bg: '#f8fafc',
        bg2: '#f1f5f9',
        card: '#ffffff',
        cardBorder: '#e2e8f0',
        text: '#0f172a',
        textMuted: '#64748b',
        textSubtle: '#94a3b8',
        accent: '#2563eb',
        accentSoft: '#dbeafe',
        green: '#16a34a',
        greenSoft: '#dcfce7',
        amber: '#d97706',
        amberSoft: '#fef3c7',
        red: '#dc2626',
        redSoft: '#fee2e2',
        divider: '#e2e8f0',
        inputBg: '#f1f5f9',
      };

  // --- User's local time (with offset) ---
  const userNow = new Date();
  userNow.setMinutes(userNow.getMinutes() + offsetMinutes);
  const userTimeStr = userNow.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const userDateStr = userNow.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // --- Timeline range: -12h to +12h ---
  const MIN_OFFSET = -720; // -12h
  const MAX_OFFSET = 720; // +12h
  const timelinePercent =
    ((offsetMinutes - MIN_OFFSET) / (MAX_OFFSET - MIN_OFFSET)) * 100;

  // Hour ticks on timeline
  const hourTicks = [];
  for (let h = -12; h <= 12; h += 2) {
    hourTicks.push(h);
  }

  // --- Availability calculation for a city at given offset ---
  const isInWorkHours = (city, offset) => {
    const t = getTimeInZone(city.tz, offset);
    return t.hour24 >= city.workStart && t.hour24 < city.workEnd;
  };

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: theme.bg, color: theme.text }}
    >
      <style>{`
        html, body { scrollbar-width: none; -ms-overflow-style: none; }
        html::-webkit-scrollbar, body::-webkit-scrollbar { display: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; width: 0; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .float-in { animation: floatIn 0.3s ease-out; }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .pulse-dot { animation: pulseDot 2s ease-in-out infinite; }
        /* Custom timeline slider */
        input[type="range"].timeline-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
        }
        input[type="range"].timeline-slider::-webkit-slider-track {
          background: transparent;
        }
        input[type="range"].timeline-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${theme.accent};
          border: 3px solid ${theme.card};
          box-shadow: 0 2px 8px rgba(0,0,0,0.2), 0 0 0 2px ${theme.accent}44;
          cursor: grab;
          transition: transform 0.15s ease;
        }
        input[type="range"].timeline-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }
        input[type="range"].timeline-slider::-webkit-slider-thumb:active {
          cursor: grabbing;
          transform: scale(1.2);
        }
        input[type="range"].timeline-slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${theme.accent};
          border: 3px solid ${theme.card};
          cursor: grab;
        }
        input[type="range"].timeline-slider::-moz-range-track {
          background: transparent;
        }
      `}</style>

      {!isFullscreen && <Navbar />}

      <div
        ref={pageRef}
        className="relative w-full no-scrollbar"
        style={{
          minHeight: isFullscreen ? '100vh' : 'calc(100vh - 64px)',
          overflowY: 'auto',
          background: theme.bg,
        }}
      >
        {/* Top-right controls */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <button
            onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
            className="h-9 px-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 text-xs font-semibold"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textMuted,
            }}
            title="Toggle view"
          >
            {view === 'grid' ? '☰ List' : '⊞ Grid'}
          </button>
          <button
            onClick={() => setDarkMode((v) => !v)}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-sm"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
            }}
            title="Toggle dark mode (D)"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={toggleFullscreen}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.textMuted,
            }}
            title="Fullscreen (F)"
          >
            {isFullscreen ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
            )}
          </button>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">

          {/* ===== HEADER ===== */}
          <div className="mb-6 md:mb-10">
            <p
              className="text-[10px] tracking-[0.3em] uppercase font-bold mb-2"
              style={{ color: theme.accent }}
            >
              Global Operations · Team Dashboard
            </p>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight" style={{ color: theme.text }}>
              World Clock Board
            </h1>
            <p
              className="mt-2 text-sm md:text-base max-w-2xl leading-relaxed"
              style={{ color: theme.textMuted }}
            >
              Live times across key business hubs. Drag the timeline below to
              plan meetings — every clock shifts in sync.
            </p>

            {/* Local strip */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div
                className="px-4 py-2 rounded-lg flex items-center gap-2"
                style={{
                  background: theme.card,
                  border: `1px solid ${theme.cardBorder}`,
                }}
              >
                <span className="pulse-dot w-2 h-2 rounded-full" style={{ background: theme.green }}></span>
                <span className="text-xs font-bold tracking-wider" style={{ color: theme.text }}>
                  Your time: {userTimeStr}
                </span>
                <span className="text-xs" style={{ color: theme.textMuted }}>
                  · {userDateStr}
                </span>
              </div>

              {offsetMinutes !== 0 && (
                <div
                  className="px-4 py-2 rounded-lg flex items-center gap-2 float-in"
                  style={{
                    background: theme.amberSoft,
                    border: `1px solid ${theme.amber}44`,
                  }}
                >
                  <span className="text-xs font-bold tracking-wider" style={{ color: theme.amber }}>
                    {offsetMinutes > 0 ? '+' : ''}
                    {offsetMinutes} min preview
                  </span>
                  <button
                    onClick={() => setOffsetMinutes(0)}
                    className="text-[10px] font-bold uppercase tracking-widest underline"
                    style={{ color: theme.amber }}
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ===== CLOCK GRID ===== */}
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
                : 'flex flex-col gap-2'
            }
          >
            {CITIES.map((city) => {
              const time = getTimeInZone(city.tz, offsetMinutes);
              const date = getDateInZone(city.tz, offsetMinutes);
              const offsetMin = getZoneOffsetMinutes(city.tz);
              const inWork = isInWorkHours(city, offsetMinutes);

              // Determine work status
              let statusColor = theme.textSubtle;
              let statusBg = theme.card;
              let statusLabel = 'Off hours';
              if (inWork) {
                statusColor = theme.green;
                statusBg = theme.greenSoft;
                statusLabel = 'Working';
              } else if (time.hour24 >= city.workStart - 2 && time.hour24 < city.workStart) {
                statusColor = theme.amber;
                statusBg = theme.amberSoft;
                statusLabel = 'Starting soon';
              } else if (time.hour24 >= city.workEnd && time.hour24 < city.workEnd + 2) {
                statusColor = theme.amber;
                statusBg = theme.amberSoft;
                statusLabel = 'Wrapping up';
              } else {
                statusColor = theme.red;
                statusBg = theme.redSoft;
                statusLabel = 'Asleep';
              }
              if (time.hour24 >= 22 || time.hour24 < 6) {
                statusColor = theme.red;
                statusBg = theme.redSoft;
                statusLabel = 'Asleep';
              }

              if (view === 'grid') {
                return (
                  <div
                    key={city.id}
                    className="rounded-2xl p-5 transition-all duration-200 hover:scale-[1.01]"
                    style={{
                      background: theme.card,
                      border: `1px solid ${theme.cardBorder}`,
                      boxShadow: darkMode
                        ? '0 4px 16px rgba(0,0,0,0.3)'
                        : '0 4px 16px rgba(15,23,42,0.04)',
                    }}
                  >
                    {/* Card header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-2xl flex-shrink-0">{city.flag}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate" style={{ color: theme.text }}>
                            {city.city}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider truncate" style={{ color: theme.textMuted }}>
                            {city.role}
                          </p>
                        </div>
                      </div>
                      <div
                        className="px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex-shrink-0 flex items-center gap-1"
                        style={{ background: statusBg, color: statusColor, border: `1px solid ${statusColor}33` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }}></span>
                        {statusLabel}
                      </div>
                    </div>

                    {/* Time */}
                    <div className="my-3">
                      <div
                        className="font-bold tabular-nums leading-none tracking-tight"
                        style={{
                          color: theme.text,
                          fontSize: 'clamp(2.25rem, 4.5vw, 3rem)',
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {time.hh}
                        <span style={{ color: theme.textSubtle }}>:</span>
                        {time.mm}
                        <span
                          style={{ color: theme.textSubtle, fontSize: '0.5em' }}
                          className="ml-1"
                        >
                          {time.ss}
                        </span>
                      </div>
                      <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                        {date}
                      </p>
                    </div>

                    {/* Footer */}
                    <div
                      className="pt-3 flex items-center justify-between text-[10px]"
                      style={{ borderTop: `1px solid ${theme.divider}` }}
                    >
                      <span className="font-mono font-bold tracking-wider" style={{ color: theme.textSubtle }}>
                        {formatOffset(offsetMin)}
                      </span>
                      <span style={{ color: theme.textMuted }}>
                        {String(city.workStart).padStart(2, '0')}:00 – {String(city.workEnd).padStart(2, '0')}:00
                      </span>
                    </div>
                  </div>
                );
              }

              // List view
              return (
                <div
                  key={city.id}
                  className="rounded-xl px-4 py-3 flex items-center gap-4 transition-all"
                  style={{
                    background: theme.card,
                    border: `1px solid ${theme.cardBorder}`,
                  }}
                >
                  <span className="text-xl flex-shrink-0">{city.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: theme.text }}>
                      {city.city}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider truncate" style={{ color: theme.textMuted }}>
                      {city.role}
                    </p>
                  </div>
                  <p className="text-xs font-mono font-bold tabular-nums hidden sm:block" style={{ color: theme.textSubtle }}>
                    {formatOffset(offsetMin)}
                  </p>
                  <div
                    className="px-2 py-1 rounded text-[9px] font-bold uppercase tracking-wider flex-shrink-0 flex items-center gap-1"
                    style={{ background: statusBg, color: statusColor }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }}></span>
                    {statusLabel}
                  </div>
                  <div className="text-right flex-shrink-0" style={{ minWidth: '5.5rem' }}>
                    <div className="text-lg font-bold tabular-nums" style={{ color: theme.text }}>
                      {time.hh}:{time.mm}
                    </div>
                    <div className="text-[10px]" style={{ color: theme.textMuted }}>
                      {date}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===== TIMELINE SLIDER ===== */}
          <div
            className="mt-8 md:mt-12 rounded-2xl p-6 md:p-8"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: darkMode
                ? '0 4px 16px rgba(0,0,0,0.3)'
                : '0 4px 16px rgba(15,23,42,0.04)',
            }}
          >
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
              <div>
                <p
                  className="text-[10px] tracking-[0.25em] uppercase font-bold mb-1"
                  style={{ color: theme.textMuted }}
                >
                  Time Machine
                </p>
                <p className="text-lg font-bold tracking-tight" style={{ color: theme.text }}>
                  Plan Meeting Across Timezones
                </p>
                <p className="text-xs mt-1" style={{ color: theme.textMuted }}>
                  Drag the slider to preview any hour — every clock above shifts in sync
                </p>
              </div>

              {/* Current offset display */}
              <div className="flex items-center gap-2">
                <div
                  className="px-4 py-2 rounded-lg"
                  style={{
                    background: offsetMinutes === 0 ? theme.accentSoft : theme.amberSoft,
                    border: `1px solid ${offsetMinutes === 0 ? theme.accent : theme.amber}44`,
                  }}
                >
                  <p
                    className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: offsetMinutes === 0 ? theme.accent : theme.amber }}
                  >
                    {offsetMinutes === 0 ? 'Live' : 'Preview'}
                  </p>
                  <p
                    className="text-sm font-bold tabular-nums"
                    style={{ color: offsetMinutes === 0 ? theme.accent : theme.amber }}
                  >
                    {offsetMinutes > 0 ? '+' : ''}
                    {offsetMinutes} min
                  </p>
                </div>
                {offsetMinutes !== 0 && (
                  <button
                    onClick={() => setOffsetMinutes(0)}
                    className="px-3 py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: theme.accent,
                      color: '#fff',
                    }}
                  >
                    ⟲ Now
                  </button>
                )}
              </div>
            </div>

            {/* Slider */}
            <div className="relative mb-4">
              {/* Hour ticks */}
              <div className="flex justify-between px-0.5 mb-2">
                {hourTicks.map((h) => (
                  <div
                    key={h}
                    className="flex flex-col items-center"
                    style={{ width: '20px' }}
                  >
                    <span
                      className="text-[9px] font-mono font-bold"
                      style={{ color: theme.textSubtle }}
                    >
                      {h > 0 ? `+${h}h` : h === 0 ? 'Now' : `${h}h`}
                    </span>
                  </div>
                ))}
              </div>

              {/* Track container */}
              <div className="relative" style={{ paddingTop: '6px', paddingBottom: '6px' }}>
                {/* Background track */}
                <div
                  className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-2 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${theme.accentSoft}, ${theme.accent}, ${theme.accentSoft})`,
                    opacity: 0.35,
                  }}
                ></div>

                {/* Zero marker */}
                <div
                  className="absolute top-0 bottom-0 w-[2px]"
                  style={{
                    left: '50%',
                    background: theme.accent,
                    opacity: 0.5,
                  }}
                ></div>

                {/* Active fill from zero to current */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full"
                  style={{
                    left: offsetMinutes >= 0 ? '50%' : `${timelinePercent}%`,
                    width: `${Math.abs(50 - timelinePercent)}%`,
                    background: theme.accent,
                    opacity: 0.8,
                  }}
                ></div>

                {/* Slider input */}
                <input
                  type="range"
                  min={MIN_OFFSET}
                  max={MAX_OFFSET}
                  step={15}
                  value={offsetMinutes}
                  onChange={(e) => setOffsetMinutes(parseInt(e.target.value))}
                  className="timeline-slider w-full relative z-10"
                  style={{ width: '100%', height: '28px' }}
                />
              </div>
            </div>

            {/* Quick jump buttons */}
            <div className="flex flex-wrap gap-2 mt-6 pt-5" style={{ borderTop: `1px solid ${theme.divider}` }}>
              <span
                className="text-[10px] font-bold uppercase tracking-widest self-center mr-2"
                style={{ color: theme.textMuted }}
              >
                Quick Jump:
              </span>
              {[
                { label: 'Now', value: 0 },
                { label: '+1h', value: 60 },
                { label: '+3h', value: 180 },
                { label: '+6h', value: 360 },
                { label: '+12h', value: 720 },
                { label: '−6h', value: -360 },
                { label: '−12h', value: -720 },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setOffsetMinutes(opt.value)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: offsetMinutes === opt.value ? theme.accent : theme.inputBg,
                    color: offsetMinutes === opt.value ? '#fff' : theme.textMuted,
                    border: `1px solid ${offsetMinutes === opt.value ? theme.accent : theme.cardBorder}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Best meeting windows hint */}
            <div
              className="mt-5 p-4 rounded-xl flex items-start gap-3"
              style={{ background: theme.inputBg, border: `1px solid ${theme.divider}` }}
            >
              <span className="text-lg flex-shrink-0">💡</span>
              <div>
                <p className="text-xs font-bold mb-1" style={{ color: theme.text }}>
                  Pro Tip
                </p>
                <p className="text-[11px] leading-relaxed" style={{ color: theme.textMuted }}>
                  Slide to a target hour and check which cities are still showing green
                  "Working" badges. That's your sweet spot for scheduling. If you can't
                  find one, the meeting may need to be async — or rotated between timezones
                  each quarter.
                </p>
              </div>
            </div>
          </div>

          {/* ===== SEO SECTION ===== */}
          <div
            className="mt-12 rounded-2xl p-6 md:p-10"
            style={{
              background: theme.card,
              border: `1px solid ${theme.cardBorder}`,
              boxShadow: darkMode
                ? '0 4px 16px rgba(0,0,0,0.3)'
                : '0 4px 16px rgba(15,23,42,0.04)',
            }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-bold px-3 py-1.5 rounded"
                style={{
                  background: theme.accentSoft,
                  color: theme.accent,
                  border: `1px solid ${theme.accent}33`,
                }}
              >
                Corporate Guide
              </span>
            </div>

            <h2
              className="text-xl md:text-3xl font-bold tracking-tight mb-6 max-w-3xl"
              style={{ color: theme.text }}
            >
              Strategies for Synchronizing Communication Across Distributed Global Teams
            </h2>

            <div
              className="space-y-5 text-sm md:text-base leading-relaxed max-w-4xl"
              style={{ color: theme.textMuted }}
            >
              <p>
                Distributed teams are the new normal. A product manager in San
                Francisco, an engineer in Bangalore, a designer in Berlin, and a
                customer success lead in Sydney can all work on the same product —
                but only if communication is deliberate. When teams span four or
                more timezones, casual "hey, quick question" pings no longer work.
                Every interaction becomes a scheduling decision. Here's how the
                best remote teams keep collaboration healthy without burning
                anyone out.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  1. Find the overlap window — and protect it.
                </span>{' '}
                Most distributed teams share only two to four hours of overlap
                per day. That window is precious. Reserve it for synchronous work:
                standups, brainstorming, decisions that require real-time
                dialogue. Everything else — status updates, code reviews, doc
                edits — should happen asynchronously. Use this timer's timeline
                slider to identify the exact overlap window for your team every
                quarter, and put it on the calendar as a non-negotiable block.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  2. Rotate meeting times quarterly.
                </span>{' '}
                If your daily standup is always at 9 AM San Francisco time, the
                Mumbai team is dialing in at 10:30 PM every single day. That's
                unsustainable. The best teams rotate the painful hour: one quarter
                APAC takes the early morning, next quarter EMEA, next quarter
                Americas. Nobody loves the 6 AM shift, but everybody gets a fair
                share of it.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  3. Default to async, escalate to sync.
                </span>{' '}
                Written communication scales across timezones; meetings don't.
                Train your team to write decision docs, use threaded Slack
                updates, and record Loom videos instead of scheduling calls.
                Meetings should only happen when a decision truly requires live
                debate — and even then, a pre-read document should accompany the
                invite so nobody wastes the first 15 minutes catching up.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  4. Publish a global availability map.
                </span>{' '}
                Every team member should know, at a glance, when their colleagues
                are online. A shared dashboard (like this one) that shows live
                local times removes the guesswork. Before sending that "urgent"
                message at your 4 PM, check the board — your colleague in Tokyo
                might be asleep. A simple glance saves hurt feelings and
                unproductive pings.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  5. Build in "no-meeting" days.
                </span>{' '}
                Pick one day per week — usually Wednesday — with no recurring
                meetings. It gives everyone a long uninterrupted block to do deep
                work. Distributed teams rely on this more than colocated ones,
                because their calendar load is often higher to compensate for
                lost hallway time. Protect that day fiercely.
              </p>

              <p>
                <span style={{ color: theme.text, fontWeight: 700 }}>
                  6. Over-communicate context.
                </span>{' '}
                In a colocated office, you pick up context from overheard
                conversations. Distributed teams don't have that luxury. Write
                more than feels necessary. Add "why" to every task. Over-document
                decisions. The teams that do this well feel unified despite the
                distance — the ones that don't slowly drift apart.
              </p>

              <p>
                Timezones are not a problem to solve — they are a reality to
                design around. With deliberate processes, the right tools, and
                a shared understanding of each other's days, distributed teams
                can outperform colocated ones. Synchronize on purpose, not by
                accident.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoteWorldClock;