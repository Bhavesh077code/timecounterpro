import React, { useState, useEffect } from 'react';
import virat from "../assets/virat.jpg";
import Navbar from "../components/Navbar";
import Footer from "../components/Layout/Footer";

// --- SVG Icons ---
const CricketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2v20M2 12h20" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// --- Reusable Countdown Hook ---
const useCountdown = (targetDate) => {
  const calculate = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
      ended: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculate());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line
  }, [targetDate]);

  return timeLeft;
};

// --- Individual Countdown Card ---
const MatchCountdownCard = ({ matchNo, format, teams, venue, date, time, targetDate, accent }) => {
  const t = useCountdown(targetDate);
  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className={`relative bg-[#0a0f14] rounded-xl border border-gray-800/60 p-4 overflow-hidden ${t.ended ? 'opacity-60' : ''}`}>
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />

      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
          {matchNo} · {format}
        </span>
        <span
          className="text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: `${accent}20`, color: accent }}
        >
          {t.ended ? 'LIVE / DONE' : 'UPCOMING'}
        </span>
      </div>

      <p className="text-sm font-bold text-white mb-1">{teams}</p>
      <p className="text-[10px] text-gray-500 mb-3 flex items-center gap-1">
        <PinIcon /> {venue}
      </p>

      <div className="grid grid-cols-4 gap-1.5 mb-3">
        {[
          { l: 'D', v: t.days },
          { l: 'H', v: t.hours },
          { l: 'M', v: t.minutes },
          { l: 'S', v: t.seconds },
        ].map((x, i) => (
          <div key={i} className="bg-[#111820] rounded-md py-1.5 text-center border border-gray-800/40">
            <p className="text-base font-black tabular-nums" style={{ color: accent }}>
              {pad(x.v)}
            </p>
            <p className="text-[8px] text-gray-600 uppercase">{x.l}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-2 border-t border-gray-800/50">
        <span className="flex items-center gap-1"><CalendarIcon /> {date}</span>
        <span className="flex items-center gap-1"><ClockIcon /> {time}</span>
      </div>
    </div>
  );
};

// --- Main Component ---
const Birat = () => {
  const kohliStats = {
    totalCenturies: 81,
    formats: [
      { name: 'TEST', value: 29, color: '#00e676' },
      { name: 'ODI', value: 50, color: '#00b0ff' },
      { name: 'T20I', value: 2, color: '#ff9100' },
    ],
    runs: { test: 8848, odi: 13906, t20i: 4188 },
    matches: { test: 113, odi: 295, t20i: 125 },
    average: { test: 48.9, odi: 58.7, t20i: 48.7 },
    fifties: { test: 30, odi: 72, t20i: 38 },
    highest: { test: 254, odi: 183, t20i: 122 },
  };

  const heroTarget = '2026-09-30T13:30:00+05:30';
  const hero = useCountdown(heroTarget);
  const pad = (n) => String(n).padStart(2, '0');

  const indWiSchedule = [
    { id: 1, matchNo: '1st ODI', format: 'ODI', teams: 'India vs West Indies', venue: 'Thiruvananthapuram', date: 'Sep 27, 2026', time: '1:30 PM IST', targetDate: '2026-09-27T13:30:00+05:30', accent: '#00e676' },
    { id: 2, matchNo: '2nd ODI', format: 'ODI', teams: 'India vs West Indies', venue: 'Guwahati', date: 'Sep 30, 2026', time: '1:30 PM IST', targetDate: '2026-09-30T13:30:00+05:30', accent: '#00b0ff' },
    { id: 3, matchNo: '3rd ODI', format: 'ODI', teams: 'India vs West Indies', venue: 'New Chandigarh', date: 'Oct 3, 2026', time: '1:30 PM IST', targetDate: '2026-10-03T13:30:00+05:30', accent: '#ff9100' },
    { id: 4, matchNo: '1st T20I', format: 'T20I', teams: 'India vs West Indies', venue: 'Lucknow', date: 'Oct 6, 2026', time: '7:00 PM IST', targetDate: '2026-10-06T19:00:00+05:30', accent: '#00e676' },
    { id: 5, matchNo: '2nd T20I', format: 'T20I', teams: 'India vs West Indies', venue: 'Ranchi', date: 'Oct 9, 2026', time: '7:00 PM IST', targetDate: '2026-10-09T19:00:00+05:30', accent: '#00b0ff' },
    { id: 6, matchNo: '3rd T20I', format: 'T20I', teams: 'India vs West Indies', venue: 'Indore', date: 'Oct 11, 2026', time: '7:00 PM IST', targetDate: '2026-10-11T19:00:00+05:30', accent: '#ff9100' },
    { id: 7, matchNo: '4th T20I', format: 'T20I', teams: 'India vs West Indies', venue: 'Hyderabad', date: 'Oct 14, 2026', time: '7:00 PM IST', targetDate: '2026-10-14T19:00:00+05:30', accent: '#00e676' },
    { id: 8, matchNo: '5th T20I', format: 'T20I', teams: 'India vs West Indies', venue: 'Bengaluru', date: 'Oct 17, 2026', time: '7:00 PM IST', targetDate: '2026-10-17T19:00:00+05:30', accent: '#00b0ff' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f14]">
      <Navbar />

      <div className="w-full bg-[#0a0f14] text-white font-sans overflow-x-hidden selection:bg-green-500/30">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-blue-500/5 pointer-events-none z-0" />

        {/* ===== DASHBOARD SECTION ===== */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 p-3 sm:p-4 lg:p-6">

          {/* LEFT: Kohli Stats */}
          <div className="md:col-span-6 lg:col-span-3 bg-[#111820] rounded-xl border border-gray-800/60 p-4 sm:p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-semibold text-gray-300 uppercase tracking-wider">
                Virat Kohli Stats Tracker
              </h2>
              <span className="text-green-400"><CricketIcon /></span>
            </div>

            <div className="bg-[#0a0f14] rounded-lg p-4 border border-gray-800/40">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mb-1">
                Total International Centuries
              </p>
              <p className="text-4xl sm:text-5xl font-black text-green-400">{kohliStats.totalCenturies}</p>
              <p className="text-[10px] text-gray-500 mt-1">Most by any active cricketer</p>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Format Breakdown</p>
              {kohliStats.formats.map((format) => (
                <div key={format.name} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 font-medium">{format.name}</span>
                    <span className="text-gray-400">{format.value} centuries</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${(format.value / kohliStats.totalCenturies) * 100}%`,
                        backgroundColor: format.color,
                        boxShadow: `0 0 10px ${format.color}40`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Career Statistics</p>
              <div className="bg-[#0a0f14] rounded-lg border border-gray-800/40 overflow-hidden">
                <div className="grid grid-cols-4 text-[10px] text-gray-500 uppercase bg-gray-900/60 px-2 py-1.5">
                  <span>Format</span><span>M</span><span>Runs</span><span>Avg</span>
                </div>
                {[
                  { f: 'TEST', m: kohliStats.matches.test, r: kohliStats.runs.test, a: kohliStats.average.test },
                  { f: 'ODI', m: kohliStats.matches.odi, r: kohliStats.runs.odi, a: kohliStats.average.odi },
                  { f: 'T20I', m: kohliStats.matches.t20i, r: kohliStats.runs.t20i, a: kohliStats.average.t20i },
                ].map((row) => (
                  <div key={row.f} className="grid grid-cols-4 text-[11px] px-2 py-1.5 border-t border-gray-800/40">
                    <span className="text-green-400 font-semibold">{row.f}</span>
                    <span className="text-gray-300">{row.m}</span>
                    <span className="text-gray-300">{row.r.toLocaleString()}</span>
                    <span className="text-gray-300">{row.a}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0a0f14] rounded-lg p-3 border border-gray-800/40">
                <p className="text-[10px] text-gray-500 uppercase">Fifties</p>
                <p className="text-xl font-bold text-blue-400">
                  {kohliStats.fifties.test + kohliStats.fifties.odi + kohliStats.fifties.t20i}
                </p>
              </div>
              <div className="bg-[#0a0f14] rounded-lg p-3 border border-gray-800/40">
                <p className="text-[10px] text-gray-500 uppercase">Highest</p>
                <p className="text-xl font-bold text-orange-400">{kohliStats.highest.odi}</p>
              </div>
            </div>

            <div className="mt-auto pt-3 border-t border-gray-800/60">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-transparent p-2 rounded-lg border border-green-500/20">
                <TrophyIcon />
                <div>
                  <p className="text-[10px] text-green-400 font-semibold">KING KOHLI</p>
                  <p className="text-[9px] text-gray-500">Chase Master · Run Machine</p>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Hero Countdown */}
          <div className="md:col-span-12 lg:col-span-6 flex flex-col gap-4">
            <div className="bg-[#111820] rounded-xl border border-gray-800/60 p-4 sm:p-5 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px] sm:min-h-[500px]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f14] via-transparent to-[#0a0f14]/80" />

              <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-5 w-full">
                <div className="text-center px-2">
                  <p className="text-[10px] sm:text-xs text-green-400 uppercase tracking-[0.3em] mb-2">
                    Next Match Countdown
                  </p>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">Virat Kohli</h2>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">India vs West Indies · 2nd ODI 2026</p>
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:gap-4 w-full max-w-lg">
                  {[
                    { label: 'Days', value: hero.days },
                    { label: 'Hours', value: hero.hours },
                    { label: 'Minutes', value: hero.minutes },
                    { label: 'Seconds', value: hero.seconds },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col items-center bg-[#0a0f14]/80 backdrop-blur-sm rounded-xl border border-gray-800/60 p-2 sm:p-3 lg:p-4 shadow-lg">
                      <span className="text-2xl sm:text-3xl lg:text-5xl font-black text-green-400 tabular-nums">
                        {pad(item.value)}
                      </span>
                      <span className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500 uppercase tracking-wider mt-1">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-400 bg-[#0a0f14]/60 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full border border-gray-800/40">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Guwahati
                  </span>
                  <span className="w-px h-3 bg-gray-700" />
                  <span>Barsapara Stadium</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Live Match Center */}
          <div className="md:col-span-6 lg:col-span-3 flex flex-col gap-4">

            {/* Card 1: Live Match Status */}
            <div className="bg-[#111820] rounded-xl border border-gray-800/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Live Match Center
                </h2>
                <span className="flex items-center gap-1 text-[9px] text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  LIVE
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Toss Time', value: '1:00 PM', sub: '30 min before', color: '#00e676' },
                  { label: 'Match Start', value: '1:30 PM', sub: 'Guwahati ODI', color: '#00b0ff' },
                  { label: 'Innings Break', value: '~4:45 PM', sub: 'Estimated', color: '#ff9100' },
                  { label: 'Match End', value: '~8:30 PM', sub: 'Estimated', color: '#ff9100' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-gray-400 font-semibold">{row.label}</p>
                      <p className="text-[9px] text-gray-600">{row.sub}</p>
                    </div>
                    <p className="text-xs font-bold tabular-nums" style={{ color: row.color }}>
                      {row.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-800/50 flex items-center justify-between">
                <span className="text-[10px] text-gray-500">Pitch</span>
                <span className="text-[10px] text-green-400 font-bold">Batting Friendly ✓</span>
              </div>
            </div>

            {/* Card 2: Top Performers */}
            <div className="bg-[#111820] rounded-xl border border-gray-800/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Top Performers
                </h2>
                <span className="text-[9px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                  This Week
                </span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Virat Kohli', role: 'Cricket · IND', stat: '81 100s', color: '#00e676' },
                  { name: 'Kyren Williams', role: 'NFL · Rams RB', stat: '1,144 Yds', color: '#00b0ff' },
                  { name: 'Patrick Surtain II', role: 'NFL · Broncos CB', stat: '4 INTs', color: '#00e676' },
                  { name: 'Jaylen Waddle', role: 'NFL · Dolphins WR', stat: '1,014 Yds', color: '#ff9100' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 group cursor-pointer">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-black shrink-0"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-gray-200 truncate group-hover:text-green-400 transition">
                        {p.name}
                      </p>
                      <p className="text-[9px] text-gray-500 truncate">{p.role}</p>
                    </div>
                    <p className="text-[10px] font-bold tabular-nums text-gray-400 shrink-0">
                      {p.stat}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Head-to-Head */}
            <div className="bg-[#111820] rounded-xl border border-gray-800/60 p-4">
              <h2 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">
                Head-to-Head · IND vs WI
              </h2>

              <div className="space-y-2">
                {[
                  { label: 'Total ODIs', ind: 142, wi: 64, total: 206 },
                  { label: 'Total T20Is', ind: 28, wi: 9, total: 37 },
                  { label: 'Last 5 ODIs', ind: 4, wi: 1, total: 5 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="text-gray-500 tabular-nums">
                        <span className="text-green-400 font-bold">{row.ind}</span> - <span className="text-blue-400 font-bold">{row.wi}</span>
                      </span>
                    </div>
                    <div className="flex h-1.5 rounded-full overflow-hidden bg-gray-800">
                      <div className="bg-green-400" style={{ width: `${(row.ind / row.total) * 100}%` }} />
                      <div className="bg-blue-400" style={{ width: `${(row.wi / row.total) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-800/50 flex items-center justify-between">
                <span className="text-[10px] text-gray-500">India Win %</span>
                <span className="text-xs font-black text-green-400">68.9%</span>
              </div>
            </div>

            {/* Card 4: Quick Facts */}
            <div className="bg-gradient-to-br from-green-500/10 to-transparent rounded-xl border border-green-500/20 p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-400">⚡</span>
                <h2 className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                  Quick Facts
                </h2>
              </div>

              <ul className="space-y-2 text-[10px] text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">▸</span>
                  <span>Kohli's fastest ODI 100: <strong className="text-white">52 balls</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">▸</span>
                  <span>Most ODI runs: <strong className="text-white">Sachin (18,426)</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">▸</span>
                  <span>Kohli needs <strong className="text-white">19 more</strong> for 100 100s</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">▸</span>
                  <span>Rams lead Broncos all-time: <strong className="text-white">9-6</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">▸</span>
                  <span>Guwahati 1st innings avg: <strong className="text-white">287</strong></span>
                </li>
              </ul>
            </div>

            {/* Trending Tags */}
            <div className="bg-[#111820] rounded-xl border border-gray-800/60 p-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Trending Now</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Rams vs Broncos', 'IND vs WI', 'Kohli Centuries',
                  'Sunday Night Football', 'Toss Time', 'Kyren Williams',
                  'Patrick Surtain II', 'Live Score', 'Sachin Tendulkar',
                  'Lakers Celtics', 'NBA Tonight', 'Guwahati ODI',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] text-gray-500 bg-gray-800/50 px-2 py-0.5 rounded-full border border-gray-700/30 hover:text-green-400 hover:border-green-500/30 transition cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== IND vs WI FULL SCHEDULE ===== */}
        <section className="relative z-10 px-3 sm:px-4 lg:px-6 pb-10">
          <div className="bg-[#111820] rounded-xl border border-gray-800/60 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
              <div>
                <p className="text-[10px] text-green-400 uppercase tracking-[0.3em] font-semibold mb-1">
                  Series Schedule 2026
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-white">India vs West Indies · Full Fixtures</h2>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-1">3 ODIs + 5 T20Is · Sep 27 – Oct 17, 2026 · All times IST</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live countdowns active
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {indWiSchedule.map((m) => (
                <MatchCountdownCard key={m.id} {...m} />
              ))}
            </div>
          </div>
        </section>

        {/* ===== BLOG SECTION (WHITE BG) ===== */}
        <section className="relative z-10 bg-gradient-to-b from-white via-gray-50 to-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

            {/* Breadcrumb */}
            <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-xs text-gray-500 mb-6 sm:mb-8">
              <span>Home</span><span>/</span><span>Cricket</span><span>/</span>
              <span className="text-green-600 font-semibold">Kohli & IND vs WI</span>
            </div>

            <span className="inline-block bg-green-100 text-green-700 text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-5 sm:mb-6">
              Featured Story
            </span>

            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-gray-900 leading-[1.15] mb-5 sm:mb-6 tracking-tight">
              Virat Kohli's 81 Centuries and the Road Ahead: IND vs WI 2026 Full Preview & Schedule
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8 font-light">
              A deep dive into the King's century journey, career numbers, the complete 3-ODI & 5-T20I schedule, and what to expect when India faces West Indies this October.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 sm:gap-4 pb-6 sm:pb-8 mb-8 sm:mb-10 border-b border-gray-200">
              <div className="flex items-center gap-3">
               
              </div>
            </div>

            <figure className="mb-8 sm:mb-10">
              <img
                src={virat}
                alt="Virat Kohli — Indian cricketer"
                className="w-full h-48 sm:h-72 lg:h-96 object-cover object-top rounded-2xl shadow-lg"
              />
              <figcaption className="text-[10px] sm:text-xs text-gray-500 mt-3 text-center italic">
                Virat Kohli — King of Modern Cricket | IND vs WI 2026 Series
              </figcaption>
            </figure>

            <article className="space-y-5 sm:space-y-6 text-base sm:text-lg leading-[1.75] sm:leading-[1.85] text-gray-700">

              <p className="text-lg sm:text-xl text-gray-800 leading-relaxed">
                When you talk about modern cricket, one name that instantly comes to mind is <strong className="text-gray-900">Virat Kohli</strong>. The man has been an absolute phenomenon for over a decade now, and his numbers speak louder than any words ever could.
              </p>

              <p>
                With <strong className="text-gray-900">81 international centuries</strong> under his belt, Kohli sits comfortably among the greatest batsmen to have ever graced the game. And now, with the <strong className="text-gray-900">West Indies tour of India 2026</strong> about to begin, fans have another reason to celebrate — 8 matches of pure cricketing action spread across 3 ODIs and 5 T20Is.
              </p>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 pt-5 sm:pt-6 tracking-tight">
                IND vs WI 2026 — Complete Schedule Breakdown
              </h2>

              <p>
                The series kicks off on <strong className="text-gray-900">September 27, 2026</strong> with the 1st ODI at the Greenfield International Stadium in Thiruvananthapuram. This is followed by the 2nd ODI in Guwahati on September 30, and the 3rd ODI in New Chandigarh on October 3. All three ODIs start at 1:30 PM IST, perfect for afternoon viewing.
              </p>

              <p>
                After the ODIs, the action shifts to the shortest format. The 5-match T20I series begins on <strong className="text-gray-900">October 6</strong> in Lucknow and wraps up on <strong className="text-gray-900">October 17</strong> in Bengaluru. Every T20I starts at 7:00 PM IST — ideal for prime-time entertainment. Venues include Lucknow, Ranchi, Indore, Hyderabad, and Bengaluru.
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden my-6 sm:my-8">
                <div className="bg-gray-900 text-white px-4 sm:px-5 py-3">
                  <p className="text-xs sm:text-sm font-bold uppercase tracking-wider">Full Fixtures Table</p>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[500px] sm:min-w-full divide-y divide-gray-200">
                    {indWiSchedule.map((m) => (
                      <div key={m.id} className="grid grid-cols-12 gap-2 px-4 sm:px-5 py-3 text-xs sm:text-sm items-center">
                        <span className="col-span-2 font-bold text-gray-900">{m.matchNo}</span>
                        <span className="col-span-4 text-gray-700">{m.venue}</span>
                        <span className="col-span-3 text-gray-600">{m.date}</span>
                        <span className="col-span-3 text-right font-semibold text-green-700">{m.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 pt-5 sm:pt-6 tracking-tight">
                Breaking Down the 81 International Centuries
              </h2>

              <p>
                Coming back to Kohli — his 81 centuries are spread beautifully across formats. The ODI format is his favourite hunting ground with <strong className="text-gray-900">50 hundreds</strong>, a world record that surpassed Sachin Tendulkar's long-standing mark of 49. In Test cricket, he has <strong className="text-gray-900">29 centuries</strong>, showing his adaptability in the longest format. And in T20Is, he has <strong className="text-gray-900">2 centuries</strong> — proving that when he's in the mood, no format is safe.
              </p>

              <blockquote className="border-l-4 border-green-500 pl-4 sm:pl-6 py-3 sm:py-4 my-6 sm:my-8 bg-green-50/50 rounded-r-xl">
                <p className="text-lg sm:text-xl italic text-gray-800 font-medium leading-relaxed m-0">
                  "Kohli has made a career out of delivering when it matters the most — and that is exactly why fans call him the Chase Master."
                </p>
              </blockquote>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 pt-5 sm:pt-6 tracking-tight">
                Career Numbers That Define Greatness
              </h2>

              <p>
                In <strong className="text-gray-900">295 ODIs</strong>, Kohli has amassed <strong className="text-gray-900">13,906 runs</strong> at an average of 58.7 — almost unheard of in modern cricket. His Test record shows <strong className="text-gray-900">8,848 runs</strong> in 113 matches at 48.9, while his T20I career includes <strong className="text-gray-900">4,188 runs</strong> in 125 games. Add 140 combined half-centuries, and you have the resume of a legend.
              </p>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-5 sm:p-8 my-8 sm:my-10 shadow-xl">
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-green-400 font-bold mb-4 sm:mb-6">Kohli by the numbers</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-green-400">81</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">International 100s</p>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-blue-400">27,942</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">Total Int'l Runs</p>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-black text-orange-400">58.7</p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-1 uppercase tracking-wider">ODI Average</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 pt-5 sm:pt-6 tracking-tight">
                Why Kohli Is Called the Chase Master
              </h2>

              <p>
                Numbers don't tell the full story. What defines Kohli is his hunger for runs and that never-say-die attitude. Remember the unforgettable <strong className="text-gray-900">82 not out against Australia</strong> in the 2016 T20 World Cup at Mohali? Or the <strong className="text-gray-900">133 not out against Sri Lanka</strong> in Hobart in 2012? These weren't just innings — they were statements.
              </p>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 pt-5 sm:pt-6 tracking-tight">
                IND vs WI 2026 — What to Expect
              </h2>

              <p>
                India enters the series as clear favourites, but West Indies has been quietly building a solid white-ball unit. Players like <strong className="text-gray-900">Keacy Carty</strong> and <strong className="text-gray-900">Roston Chase</strong> have been in decent form, and the Caribbean side will be looking to pull off an upset or two.
              </p>

              <p>
                However, beating India in Indian conditions is no easy task — especially with Kohli in the lineup. Every time he walks out to bat, there's a sense of anticipation: <em>Will this be another century? Will he break another record?</em>
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6 my-6 sm:my-8">
                <p className="text-xs sm:text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">Match Info — 2nd ODI</p>
                <ul className="space-y-2 text-sm sm:text-base text-blue-900 m-0 pl-0 list-none">
                  <li><strong>Match:</strong> India vs West Indies · 2nd ODI</li>
                  <li><strong>Venue:</strong> Barsapara Cricket Stadium, Guwahati</li>
                  <li><strong>Date:</strong> September 30, 2026</li>
                  <li><strong>Start Time:</strong> 1:30 PM IST</li>
                  <li><strong>Series:</strong> West Indies tour of India 2026</li>
                </ul>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 pt-5 sm:pt-6 tracking-tight">
                NFL & NBA Highlights This Week
              </h2>

              <p>
                Sports fans have plenty to look forward to beyond cricket. The NFL is heating up with the <strong className="text-gray-900">Rams taking on the Broncos</strong> at SoFi Stadium — a Sunday Night Football thriller with <strong className="text-gray-900">Kyren Williams</strong> and <strong className="text-gray-900">Patrick Surtain II</strong> in action. And the <strong className="text-gray-900">Lakers vs Celtics NBA</strong> rivalry continues — as old as the league itself.
              </p>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 pt-5 sm:pt-6 tracking-tight">
                The Legacy of King Kohli
              </h2>

              <p>
                From a young, aggressive Delhi boy to the captain of India to now being the senior statesman of Indian cricket — Kohli's growth has been remarkable. He is not just a batsman anymore. He is a mentor, a leader, and a role model for millions.
              </p>

              <p className="text-xl sm:text-2xl font-bold text-gray-900 pt-5 sm:pt-6 leading-snug">
                The King is still ruling — and honestly, we would not have it any other way.
              </p>
            </article>

            {/* FAQ */}
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-gray-200">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-3 sm:space-y-4">
                {[
                  { q: "How many international centuries does Virat Kohli have?", a: "Virat Kohli currently has 81 international centuries — 29 in Tests, 50 in ODIs, and 2 in T20Is. He holds the record for most ODI centuries." },
                  { q: "When does IND vs WI 2026 series start?", a: "The series starts on September 27, 2026 with the 1st ODI at Thiruvananthapuram. It ends on October 17 with the 5th T20I in Bengaluru." },
                  { q: "How many matches in IND vs WI 2026?", a: "There are 8 matches total — 3 ODIs and 5 T20Is, spread across September 27 to October 17, 2026." },
                  { q: "When is the Rams vs Broncos NFL game?", a: "The Rams vs Broncos Sunday Night Football game will be played at SoFi Stadium. Kickoff is scheduled for 8:20 PM ET." },
                  { q: "Who has the most ODI centuries — Kohli or Sachin?", a: "Virat Kohli has the most ODI centuries with 50, surpassing Sachin Tendulkar's 49. Sachin still holds the overall record with 100 international centuries." }
                ].map((faq, i) => (
                  <details key={i} className="group bg-gray-50 rounded-xl p-4 sm:p-5 cursor-pointer hover:bg-gray-100 transition">
                    <summary className="font-bold text-sm sm:text-base text-gray-900 list-none flex items-center justify-between gap-3">
                      <span>{faq.q}</span>
                      <span className="text-green-600 text-xl group-open:rotate-45 transition-transform shrink-0">+</span>
                    </summary>
                    <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-gray-200">
              <p className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Related Topics</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  'Virat Kohli', 'IND vs WI', 'Rams vs Broncos', 'Sunday Night Football',
                  'Kohli Centuries', 'Kyren Williams', 'Patrick Surtain II', 'Jaylen Waddle',
                  'Live Score', 'Sachin Tendulkar', 'Thiruvananthapuram', 'Toss Time',
                  'India vs West Indies', 'NFL Tonight', 'Total Centuries',
                  'IND vs WI Schedule', 'Guwahati ODI', 'New Chandigarh'
                ].map((tag) => (
                  <span key={tag} className="text-xs sm:text-sm text-gray-700 bg-gray-100 hover:bg-green-100 hover:text-green-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full transition cursor-pointer border border-gray-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Birat;