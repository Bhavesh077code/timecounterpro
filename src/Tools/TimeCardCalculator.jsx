import React, { useState, useMemo, useEffect, useRef } from 'react';
import Footer from '../components/Layout/Footer';
import Navbar from '../components/Navbar';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const STORAGE_KEY = 'timecard-calculator-v3';

// ---------- Time helpers ----------
const toMin = (t) => {
  if (!t || t.trim() === '') return null;
  const [h, m] = t.split(':').map(Number);
  return isNaN(h) || isNaN(m) ? null : h * 60 + m;
};
const toHHMM = (m) => {
  m = ((Math.round(m) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};
const fHrs = (h) => (Math.round(h * 100) / 100).toFixed(2);
const fMoney = (n) =>
  n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
const fClock = (h) => {
  if (h < 1) return `${Math.round(h * 60)} min`;
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return mm ? `${hh}h ${mm}m` : `${hh}h`;
};

// ---------- Day calculation ----------
const calcDay = (row) => {
  const ci = toMin(row.clockIn);
  const co = toMin(row.clockOut);
  const lo = toMin(row.lunchOut);
  const li = toMin(row.lunchIn);

  if (ci === null || co === null)
    return { hours: 0, flagged: false, message: '', breakMin: 0, grossMin: 0 };

  let gross = co - ci;
  let flagged = false;
  let message = '';
  let breakMin = 0;

  if (gross <= 0) {
    flagged = true;
    message = 'Clock out is before clock in';
    gross = 0;
  }

  if (lo !== null && li !== null) {
    breakMin = li - lo;
    if (breakMin < 0) {
      flagged = true;
      message = 'Invalid lunch break';
    } else if (breakMin > gross) {
      flagged = true;
      message = 'Lunch longer than shift';
    }
  } else if ((lo === null) !== (li === null)) {
    flagged = true;
    message = 'Incomplete lunch break';
  }

  const netMin = Math.max(0, gross - Math.max(0, breakMin));
  return {
    hours: netMin / 60,
    flagged,
    message,
    breakMin: Math.max(0, breakMin),
    grossMin: gross,
  };
};

// ---------- Component ----------
const TimeCardCalculator = () => {
  const load = () => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  };
  const saved = load();

  const [rows, setRows] = useState(
    saved?.rows ||
      DAYS.map((_, i) => ({
        enabled: i < 5,
        clockIn: '',
        lunchOut: '',
        lunchIn: '',
        clockOut: '',
        holiday: false,
        pto: false,
        sick: false,
        note: '',
      }))
  );

  const [settings, setSettings] = useState(
    saved?.settings || {
      hourlyRate: 25,
      otMultiplier: 1.5,
      doubleTimeAfter: 60,
      doubleTimeMultiplier: 2,
      rounding: 'none',
      goalHours: 40,
      currency: 'USD',
      showNotes: false,
      showPay: true,
      showGoal: true,
    }
  );

  const [darkMode, setDarkMode] = useState(saved?.darkMode || false);
  const [copied, setCopied] = useState(false);
  const [breakMenu, setBreakMenu] = useState(false);
  const [toast, setToast] = useState(null);
  const [, setActiveView] = useState('grid');
  const menuRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ rows, settings, darkMode }));
  }, [rows, settings, darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setBreakMenu(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const fire = (msg, tone = 'success') => {
    setToast({ msg, tone });
    setTimeout(() => setToast(null), 2200);
  };

  const updateRow = (idx, patch) =>
    setRows((prev) => {
      const n = [...prev];
      n[idx] = { ...n[idx], ...patch };
      return n;
    });

  const updateSetting = (patch) => setSettings((p) => ({ ...p, ...patch }));

  const applyRounding = (h) => {
    if (settings.rounding === 'none') return h;
    const step = parseInt(settings.rounding, 10) / 60;
    return Math.round(h / step) * step;
  };

  const { dayResults, totals } = useMemo(() => {
    const results = rows.map((row) => {
      const r = calcDay(row);
      const rounded = applyRounding(r.hours);
      const counted = row.enabled && !row.holiday && !row.pto && !row.sick ? rounded : 0;
      return { ...r, rawHours: r.hours, counted };
    });

    const totalHours = results.reduce((s, r) => s + r.counted, 0);
    const regular = Math.min(totalHours, 40);
    const ot = Math.max(0, Math.min(totalHours, settings.doubleTimeAfter) - 40);
    const dt = Math.max(0, totalHours - settings.doubleTimeAfter);

    const regPay = regular * settings.hourlyRate;
    const otPay = ot * settings.hourlyRate * settings.otMultiplier;
    const dtPay = dt * settings.hourlyRate * settings.doubleTimeMultiplier;
    const totalPay = regPay + otPay + dtPay;

    const daysWorked = results.filter((r) => r.counted > 0).length;
    const ptoDays = rows.filter((r) => r.pto).length;
    const holidayDays = rows.filter((r) => r.holiday).length;
    const sickDays = rows.filter((r) => r.sick).length;

    const totalBreak = results.reduce((s, r) => s + r.breakMin, 0) / 60;
    const grossHours = results.reduce((s, r) => s + r.grossMin, 0) / 60;

    const goalPct = Math.min(100, (totalHours / settings.goalHours) * 100);
    const warnings = results.filter((r) => r.flagged);

    return {
      dayResults: results,
      totals: {
        totalHours, regular, ot, dt, regPay, otPay, dtPay, totalPay,
        daysWorked, ptoDays, holidayDays, sickDays, totalBreak, grossHours, goalPct, warnings,
      },
    };
  }, [rows, settings]);

  const applyBreak = (mins) => {
    setRows((prev) =>
      prev.map((r) => {
        if (!r.enabled || !r.clockIn || !r.clockOut) return r;
        const ci = toMin(r.clockIn);
        const co = toMin(r.clockOut);
        if (ci === null || co === null || co <= ci) return r;
        const mid = ci + (co - ci) / 2;
        return { ...r, lunchOut: toHHMM(mid), lunchIn: toHHMM(mid + mins) };
      })
    );
    setBreakMenu(false);
    fire(`${mins} min lunch applied`);
  };

  const fillStandard = () => {
    setRows((prev) =>
      prev.map((r) =>
        !r.enabled || r.holiday || r.pto || r.sick
          ? r
          : { ...r, clockIn: '09:00', lunchOut: '12:00', lunchIn: '13:00', clockOut: '17:00' }
      )
    );
    fire('Standard 9–5 shift filled');
  };

  const duplicateMonday = () => {
    const mon = rows[0];
    setRows((prev) =>
      prev.map((r, i) =>
        i === 0 || !r.enabled || r.holiday || r.pto || r.sick
          ? r
          : {
              ...r,
              clockIn: mon.clockIn,
              lunchOut: mon.lunchOut,
              lunchIn: mon.lunchIn,
              clockOut: mon.clockOut,
            }
      )
    );
    fire('Monday duplicated to all weekdays');
  };

  const clearAll = () => {
    if (!window.confirm('Clear all time entries?')) return;
    setRows((prev) =>
      prev.map((r) => ({
        ...r,
        clockIn: '', lunchOut: '', lunchIn: '', clockOut: '', note: '',
      }))
    );
    fire('All entries cleared');
  };

  const copySummary = async () => {
    const lines = [
      '🗓️ Weekly Time Card Summary',
      '─'.repeat(30),
      ...DAYS.map((d, i) => {
        const r = rows[i];
        const res = dayResults[i];
        if (!r.enabled) return `${d.padEnd(10)} — (off)`;
        if (r.holiday) return `${d.padEnd(10)} Holiday`;
        if (r.pto) return `${d.padEnd(10)} PTO`;
        if (r.sick) return `${d.padEnd(10)} Sick`;
        return `${d.padEnd(10)} ${fHrs(res.counted).padStart(6)} hrs`;
      }),
      '─'.repeat(30),
      `Total:     ${fHrs(totals.totalHours)} hrs`,
      `Regular:   ${fHrs(totals.regular)} hrs`,
      `Overtime:  ${fHrs(totals.ot)} hrs`,
      totals.dt > 0 ? `Double:    ${fHrs(totals.dt)} hrs` : null,
      `Est. Pay:  ${fMoney(totals.totalPay)}`,
    ].filter(Boolean);
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopied(true);
      fire('Summary copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      fire('Copy failed', 'error');
    }
  };

  const downloadCSV = () => {
    const header = ['Day', 'Clock In', 'Lunch Out', 'Lunch In', 'Clock Out', 'Break (h)', 'Hours', 'Note'];
    const body = DAYS.map((d, i) => {
      const r = rows[i];
      return [
        d, r.clockIn, r.lunchOut, r.lunchIn, r.clockOut,
        fHrs(dayResults[i].breakMin / 60),
        fHrs(dayResults[i].counted),
        r.note || '',
      ];
    });
    const footer = [
      [],
      ['Total', '', '', '', '', fHrs(totals.totalBreak), fHrs(totals.totalHours)],
      ['Regular', '', '', '', '', '', fHrs(totals.regular)],
      ['Overtime', '', '', '', '', '', fHrs(totals.ot)],
      ['Est. Pay', '', '', '', '', '', fMoney(totals.totalPay)],
    ];
    const csv = [header, ...body, ...footer]
      .map((r) => r.map((v) => `"${v}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timecard-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    fire('CSV downloaded');
  };

  const t = darkMode
    ? {
        bg: 'bg-slate-950',
        card: 'bg-slate-900 border-slate-800',
        text: 'text-slate-100',
        sub: 'text-slate-400',
        muted: 'text-slate-500',
        border: 'border-slate-800',
        input: 'bg-slate-800 border-slate-700 text-slate-100 focus:border-rose-400 focus:ring-rose-500/20',
        rowHover: 'hover:bg-slate-800/40',
        pill: 'bg-rose-500/10 text-rose-300',
        chip: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700',
        ring: 'stroke-rose-500/30',
        ringActive: 'stroke-rose-400',
      }
    : {
        bg: 'bg-white',
        card: 'bg-white border-slate-100',
        text: 'text-slate-800',
        sub: 'text-slate-500',
        muted: 'text-slate-400',
        border: 'border-slate-100',
        input: 'bg-white border-slate-200 text-slate-700 focus:border-rose-300 focus:ring-rose-50',
        rowHover: 'hover:bg-rose-50/30',
        pill: 'bg-rose-50 text-rose-700',
        chip: 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50',
        ring: 'stroke-rose-100',
        ringActive: 'stroke-rose-400',
      };

  const R = 58;
  const C = 2 * Math.PI * R;
  const offset = C - (totals.goalPct / 100) * C;

  return (
    <div>
      <Navbar />

      <div>
        <div className={`min-h-screen ${t.bg} transition-colors duration-300`}>
          {/* Toast */}
          {toast && (
            <div
              className={`fixed top-4 right-4 left-4 sm:left-auto sm:top-6 sm:right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-xs sm:text-sm font-medium transition-all ${
                toast.tone === 'error'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {toast.tone === 'error' ? '⚠️ ' : '✅ '}
              {toast.msg}
            </div>
          )}

          <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-8">
            {/* ===== Header ===== */}
            <div className="flex items-center justify-between mb-5 sm:mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className={`text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight ${t.text}`}>
                    Time Card Calculator
                  </h1>
                  <p className={`text-[0.7rem] sm:text-xs md:text-sm ${t.sub}`}>
                    Weekly hours · auto lunch · overtime · pay
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <button onClick={fillStandard} className={`px-2.5 sm:px-3 py-2 rounded-xl text-[0.7rem] sm:text-xs font-medium border transition ${t.chip}`}>
                  ⚡ Fill 9–5
                </button>
                <button onClick={duplicateMonday} className={`px-2.5 sm:px-3 py-2 rounded-xl text-[0.7rem] sm:text-xs font-medium border transition ${t.chip}`}>
                  📅 Copy Mon
                </button>
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setBreakMenu((s) => !s)}
                    className={`px-2.5 sm:px-3 py-2 rounded-xl text-[0.7rem] sm:text-xs font-medium border transition ${t.chip}`}
                  >
                    🍽️ Break
                  </button>
                  {breakMenu && (
                    <div className={`absolute right-0 mt-2 w-40 rounded-xl border shadow-lg z-20 p-1 ${t.card}`}>
                      {[15, 30, 45, 60, 90].map((m) => (
                        <button
                          key={m}
                          onClick={() => applyBreak(m)}
                          className={`w-full text-left px-3 py-2 text-xs rounded-lg ${t.text} ${t.rowHover}`}
                        >
                          {m} min lunch
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={copySummary} className={`px-2.5 sm:px-3 py-2 rounded-xl text-[0.7rem] sm:text-xs font-medium border transition ${t.chip}`}>
                  {copied ? '✅ Copied' : '📋 Copy'}
                </button>
                <button onClick={downloadCSV} className={`px-2.5 sm:px-3 py-2 rounded-xl text-[0.7rem] sm:text-xs font-medium border transition ${t.chip}`}>
                  ⬇️ CSV
                </button>
                <button onClick={clearAll} className={`px-2.5 sm:px-3 py-2 rounded-xl text-[0.7rem] sm:text-xs font-medium border transition ${t.chip}`}>
                  🗑️ Reset
                </button>
                <button onClick={() => setDarkMode((d) => !d)} className={`px-2.5 sm:px-3 py-2 rounded-xl text-[0.7rem] sm:text-xs font-medium border transition ${t.chip}`}>
                  {darkMode ? '☀️' : '🌙'}
                </button>
              </div>
            </div>

            {/* ===== Circular Progress + Stats Row ===== */}
            {settings.showGoal && (
              <div className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 md:p-6 mb-5 sm:mb-6 ${t.card}`}>
                <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 sm:gap-6 items-center">
                  {/* Circle */}
                  <div className="flex items-center gap-4 sm:gap-5 justify-center md:justify-start">
                    <div className="relative w-[110px] h-[110px] sm:w-[136px] sm:h-[136px] shrink-0">
                      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                        <circle cx="70" cy="70" r={R} fill="none" strokeWidth="10" className={t.ring} />
                        <circle
                          cx="70" cy="70" r={R} fill="none" strokeWidth="10" strokeLinecap="round"
                          className={`${t.ringActive} transition-all duration-500`}
                          strokeDasharray={C} strokeDashoffset={offset}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-xl sm:text-2xl font-semibold tabular-nums ${t.text}`}>
                          {fHrs(totals.totalHours)}
                        </span>
                        <span className={`text-[0.6rem] sm:text-[0.65rem] uppercase tracking-wider ${t.muted}`}>
                          of {settings.goalHours}h
                        </span>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className={`text-[0.65rem] sm:text-[0.68rem] uppercase tracking-wider font-semibold mb-1 ${t.muted}`}>
                        Weekly Progress
                      </div>
                      <div className={`text-base sm:text-lg font-semibold ${t.text}`}>
                        {totals.goalPct.toFixed(0)}% complete
                      </div>
                      <div className={`text-[0.7rem] sm:text-xs mt-1 ${t.sub}`}>
                        {totals.totalHours >= settings.goalHours
                          ? `🎉 Goal reached! ${fHrs(totals.totalHours - settings.goalHours)}h over`
                          : `${fHrs(settings.goalHours - totals.totalHours)}h remaining`}
                      </div>
                    </div>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                    <QuickStat label="Worked" value={fClock(totals.totalHours)} t={t} />
                    <QuickStat label="Break" value={fClock(totals.totalBreak)} t={t} />
                    <QuickStat label="Overtime" value={fClock(totals.ot)} accent t={t} />
                    {settings.showPay && (
                      <QuickStat label="Est. Pay" value={fMoney(totals.totalPay)} accent t={t} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== Settings ===== */}
            <details className={`rounded-2xl border mb-5 sm:mb-6 ${t.card}`}>
              <summary className={`cursor-pointer px-4 sm:px-5 py-3.5 text-xs sm:text-sm font-medium ${t.text} flex items-center justify-between gap-2`}>
                <span>⚙️ Settings · Rate, Overtime, Rounding</span>
                <span className={`text-[0.65rem] sm:text-xs ${t.muted} hidden sm:inline`}>click to expand</span>
              </summary>
              <div className={`px-4 sm:px-5 pb-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 border-t pt-4 ${t.border}`}>
                <Field label="Hourly Rate" t={t}>
                  <input type="number" min="0" step="0.5" value={settings.hourlyRate}
                    onChange={(e) => updateSetting({ hourlyRate: parseFloat(e.target.value) || 0 })}
                    className={`w-full px-2.5 sm:px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition focus:ring-4 ${t.input}`} />
                </Field>
                <Field label="OT Multiplier" t={t}>
                  <input type="number" min="1" step="0.1" value={settings.otMultiplier}
                    onChange={(e) => updateSetting({ otMultiplier: parseFloat(e.target.value) || 1 })}
                    className={`w-full px-2.5 sm:px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition focus:ring-4 ${t.input}`} />
                </Field>
                <Field label="Double-Time After (h)" t={t}>
                  <input type="number" min="40" step="1" value={settings.doubleTimeAfter}
                    onChange={(e) => updateSetting({ doubleTimeAfter: parseFloat(e.target.value) || 60 })}
                    className={`w-full px-2.5 sm:px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition focus:ring-4 ${t.input}`} />
                </Field>
                <Field label="2× Multiplier" t={t}>
                  <input type="number" min="1" step="0.1" value={settings.doubleTimeMultiplier}
                    onChange={(e) => updateSetting({ doubleTimeMultiplier: parseFloat(e.target.value) || 2 })}
                    className={`w-full px-2.5 sm:px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition focus:ring-4 ${t.input}`} />
                </Field>
                <Field label="Rounding" t={t}>
                  <select value={settings.rounding}
                    onChange={(e) => updateSetting({ rounding: e.target.value })}
                    className={`w-full px-2.5 sm:px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition focus:ring-4 ${t.input}`}>
                    <option value="none">None</option>
                    <option value="5">5 min</option>
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                  </select>
                </Field>
                <Field label="Weekly Goal (h)" t={t}>
                  <input type="number" min="1" step="1" value={settings.goalHours}
                    onChange={(e) => updateSetting({ goalHours: parseFloat(e.target.value) || 40 })}
                    className={`w-full px-2.5 sm:px-3 py-2 rounded-xl border text-xs sm:text-sm outline-none transition focus:ring-4 ${t.input}`} />
                </Field>
                <div className="flex flex-wrap items-end gap-3 col-span-2">
                  <label className={`flex items-center gap-1.5 text-[0.7rem] sm:text-xs ${t.text} cursor-pointer`}>
                    <input type="checkbox" checked={settings.showNotes}
                      onChange={(e) => updateSetting({ showNotes: e.target.checked })}
                      className="rounded border-slate-300 accent-rose-500" />
                    Notes
                  </label>
                  <label className={`flex items-center gap-1.5 text-[0.7rem] sm:text-xs ${t.text} cursor-pointer`}>
                    <input type="checkbox" checked={settings.showPay}
                      onChange={(e) => updateSetting({ showPay: e.target.checked })}
                      className="rounded border-slate-300 accent-rose-500" />
                    Pay
                  </label>
                  <label className={`flex items-center gap-1.5 text-[0.7rem] sm:text-xs ${t.text} cursor-pointer`}>
                    <input type="checkbox" checked={settings.showGoal}
                      onChange={(e) => updateSetting({ showGoal: e.target.checked })}
                      className="rounded border-slate-300 accent-rose-500" />
                    Goal
                  </label>
                </div>
              </div>
            </details>

            {/* ===== Warnings ===== */}
            {totals.warnings.length > 0 && (
              <div className="mb-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 px-3 sm:px-4 py-3 text-[0.7rem] sm:text-xs text-amber-800 dark:text-amber-200">
                ⚠️ {totals.warnings.length} issue{totals.warnings.length > 1 ? 's' : ''}:{' '}
                {totals.warnings.map((w, i) => (
                  <span key={i} className="font-medium">
                    {DAYS[dayResults.indexOf(w)]} — {w.message}
                    {i < totals.warnings.length - 1 ? '; ' : ''}
                  </span>
                ))}
              </div>
            )}

            {/* ===== Table ===== */}
            <div className={`rounded-2xl border overflow-hidden ${t.card}`}>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm min-w-[720px] sm:min-w-0">
                  <thead>
                    <tr className={`border-b ${t.border}`}>
                      <th className={`text-left text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider py-2.5 sm:py-3 px-2 sm:px-4 ${t.muted}`}>Day</th>
                      <th className={`text-center text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider py-2.5 sm:py-3 px-1 sm:px-2 ${t.muted}`}>On</th>
                      <th className={`text-left text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider py-2.5 sm:py-3 px-1 sm:px-2 ${t.muted}`}>In</th>
                      <th className={`text-left text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider py-2.5 sm:py-3 px-1 sm:px-2 ${t.muted}`}>L‑Out</th>
                      <th className={`text-left text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider py-2.5 sm:py-3 px-1 sm:px-2 ${t.muted}`}>L‑In</th>
                      <th className={`text-left text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider py-2.5 sm:py-3 px-1 sm:px-2 ${t.muted}`}>Out</th>
                      <th className={`text-center text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider py-2.5 sm:py-3 px-1 ${t.muted}`}>Hol</th>
                      <th className={`text-center text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider py-2.5 sm:py-3 px-1 ${t.muted}`}>PTO</th>
                      <th className={`text-center text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider py-2.5 sm:py-3 px-1 ${t.muted}`}>Sick</th>
                      <th className={`text-right text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider py-2.5 sm:py-3 px-2 sm:px-4 ${t.muted}`}>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day, idx) => {
                      const row = rows[idx];
                      const res = dayResults[idx];
                      const disabled = !row.enabled || row.holiday || row.pto || row.sick;
                      return (
                        <tr
                          key={day}
                          className={`border-b last:border-b-0 transition-colors ${t.border} ${
                            res.flagged ? 'bg-amber-50/50 dark:bg-amber-500/5' : ''
                          } ${t.rowHover}`}
                        >
                          <td className={`py-2 px-2 sm:px-4 font-medium whitespace-nowrap ${t.text}`}>{day}</td>
                          <td className="py-2 px-1 sm:px-2 text-center">
                            <input type="checkbox" checked={row.enabled}
                              onChange={(e) => updateRow(idx, { enabled: e.target.checked })}
                              className="rounded border-slate-300 accent-rose-500" />
                          </td>
                          {['clockIn', 'lunchOut', 'lunchIn', 'clockOut'].map((f) => (
                            <td key={f} className="py-2 px-1 sm:px-2">
                              <input
                                type="time"
                                value={row[f]}
                                disabled={disabled}
                                onChange={(e) => updateRow(idx, { [f]: e.target.value })}
                                className={`w-full max-w-[90px] sm:max-w-[105px] px-1.5 sm:px-2.5 py-1.5 rounded-lg border text-[0.7rem] sm:text-xs md:text-sm outline-none transition focus:ring-4 ${t.input} ${
                                  disabled ? 'opacity-40 cursor-not-allowed' : ''
                                }`}
                              />
                            </td>
                          ))}
                          {['holiday', 'pto', 'sick'].map((f) => (
                            <td key={f} className="py-2 px-1 text-center">
                              <input
                                type="checkbox"
                                checked={row[f]}
                                onChange={(e) => {
                                  const patch = { [f]: e.target.checked };
                                  if (e.target.checked) {
                                    ['holiday', 'pto', 'sick'].forEach((k) => {
                                      if (k !== f) patch[k] = false;
                                    });
                                  }
                                  updateRow(idx, patch);
                                }}
                                className="rounded border-slate-300 accent-rose-500"
                              />
                            </td>
                          ))}
                          <td className="py-2 px-2 sm:px-4 text-right">
                            {row.holiday || row.pto || row.sick ? (
                              <span className={`text-[0.65rem] sm:text-xs font-medium px-1.5 sm:px-2 py-1 rounded-full ${t.chip}`}>
                                {row.holiday ? 'Holiday' : row.pto ? 'PTO' : 'Sick'}
                              </span>
                            ) : (
                              <span className={`inline-block min-w-[48px] sm:min-w-[58px] text-center px-1.5 sm:px-2.5 py-1 rounded-full font-semibold text-[0.7rem] sm:text-xs md:text-sm tabular-nums ${t.pill}`}>
                                {fHrs(res.counted)}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ===== Summary Cards ===== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-5 sm:mt-6">
              <SummaryCard label="Total Hours" value={fHrs(totals.totalHours)} unit="hrs" t={t} big />
              <SummaryCard label="Regular" value={fHrs(totals.regular)} unit="hrs" t={t} />
              <SummaryCard label="Overtime" value={fHrs(totals.ot)} unit="hrs" accent t={t} />
              {settings.showPay && (
                <SummaryCard label="Est. Pay" value={fMoney(totals.totalPay)} t={t} accent big />
              )}
            </div>

            {settings.showPay && (
              <div className={`mt-4 rounded-2xl border p-3 sm:p-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 ${t.card}`}>
                <MiniStat label="Regular Pay" value={fMoney(totals.regPay)} t={t} />
                <MiniStat label="Overtime Pay" value={fMoney(totals.otPay)} t={t} />
                {totals.dt > 0 && <MiniStat label="Double-Time Pay" value={fMoney(totals.dtPay)} t={t} />}
                <MiniStat label="Days Worked" value={`${totals.daysWorked} / 7`} t={t} />
                <MiniStat label="PTO · Holiday · Sick" value={`${totals.ptoDays} · ${totals.holidayDays} · ${totals.sickDays}`} t={t} />
                <MiniStat label="Gross Hours" value={fHrs(totals.grossHours)} t={t} />
                <MiniStat label="Total Break" value={fHrs(totals.totalBreak)} t={t} />
              </div>
            )}

            {/* ===== Blog Section ===== */}
            <section className="mt-10 sm:mt-12 bg-white px-1 sm:px-0">
              <span className="inline-block text-[0.62rem] sm:text-[0.65rem] uppercase tracking-[0.15em] font-semibold mb-3 px-2.5 sm:px-3 py-1 rounded-full bg-rose-50 text-rose-700">
                Guide
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-slate-800 leading-snug">
                The Complete Guide to Time Card Calculators
              </h2>
              <p className="max-w-3xl text-xs sm:text-sm md:text-base leading-6 sm:leading-7 mb-8 sm:mb-10 text-slate-500">
                Keeping track of working hours sounds simple until you have to deal with different shifts, lunch breaks, overtime, holidays, and changing schedules. A time card calculator brings all of that information together and turns daily time entries into a clear weekly total.
              </p>
              <div className="space-y-8 sm:space-y-10 text-xs sm:text-sm md:text-[15px] leading-6 sm:leading-7 text-slate-500">
                <article>
                  <h3 className="text-base sm:text-lg font-semibold mb-2.5 sm:mb-3 text-slate-800">How to use a time card calculator</h3>
                  <p>Start by entering the time you started and finished work for each day. If you took an unpaid lunch break, enter the time you left and returned from lunch as well. The calculator then works out the number of hours worked for that day and adds them to your weekly total.</p>
                  <p className="mt-3">You can use either a 24-hour clock or the familiar AM and PM format. Days that you did not work can simply be left unused. For a normal workday, the <em>Fill 9–5</em> option can save a few seconds, while the break presets make it easy to add a common lunch duration.</p>
                  <p className="mt-3">Once your week is complete, you can review the total hours, estimated pay, overtime, and other information before copying the summary or exporting it as a CSV file.</p>
                </article>
                <article>
                  <h3 className="text-base sm:text-lg font-semibold mb-2.5 sm:mb-3 text-slate-800">Why accurate time tracking matters</h3>
                  <p>A small mistake on a time sheet can become a much bigger problem when it affects several days or several employees. Forgetting a lunch break, entering the wrong finishing time, or missing an overtime hour can all change the final payroll amount.</p>
                  <p className="mt-3">Keeping a consistent record of working hours makes these mistakes much easier to spot. It also gives employees and managers a simple way to look back at the week instead of trying to remember hours from memory. For freelancers, contractors, and small teams, this can be especially useful when hours need to be reported to a client.</p>
                </article>
                <article>
                  <h3 className="text-base sm:text-lg font-semibold mb-2.5 sm:mb-3 text-slate-800">Regular hours and overtime</h3>
                  <p>Overtime rules are not exactly the same everywhere, so it is important to understand the rules that apply to your job or location. A common example is a standard 40-hour workweek, where hours beyond that point may qualify for an overtime rate.</p>
                  <p className="mt-3">The calculator can make the calculation easier by separating regular hours from overtime based on the thresholds and multipliers you choose. For example, you might set an overtime multiplier of 1.5 if that is the rate used by your workplace.</p>
                  <p className="mt-3">These calculations are estimates for tracking purposes. Always check your employer's payroll policy and the employment laws that apply to your situation before using the result for official payroll.</p>
                </article>
                <article>
                  <h3 className="text-base sm:text-lg font-semibold mb-2.5 sm:mb-3 text-slate-800">How lunch breaks affect your total hours</h3>
                  <p>Lunch breaks are one of the easiest things to overlook when calculating working hours. If an unpaid break is included in the start-to-finish time, your total can be higher than the number of hours you actually worked.</p>
                  <p className="mt-3">For example, someone who works from 9:00 AM to 5:00 PM with a one-hour unpaid lunch has eight hours of working time, not nine. Entering both lunch times allows the calculator to remove that break from the daily total.</p>
                  <p className="mt-3">If you do not take an unpaid lunch break, there is no need to enter one. The important thing is to use the same approach consistently throughout the week.</p>
                </article>
                <article>
                  <h3 className="text-base sm:text-lg font-semibold mb-2.5 sm:mb-3 text-slate-800">Understanding the weekly progress ring</h3>
                  <p>The progress ring gives you a quick visual idea of how close you are to your weekly hour goal. The default goal can be useful for a typical full-time schedule, but it does not have to be the same for everyone.</p>
                  <p className="mt-3">Someone working part-time might choose a smaller weekly target, while a person with a longer schedule may want a different goal. As you add or change time entries, the ring updates automatically so you can see your progress without doing the calculation yourself.</p>
                </article>
                <article>
                  <h3 className="text-base sm:text-lg font-semibold mb-2.5 sm:mb-3 text-slate-800">Your time entries stay in your browser</h3>
                  <p>The calculator is designed to keep your entries on your own device. Your time records, settings, and notes are stored in your browser's local storage rather than being sent to a server by the calculator.</p>
                  <p className="mt-3">This is convenient when you want to return to your timesheet later without creating an account. You can also copy your weekly summary or export your information as a CSV file when you need to move the data into a spreadsheet or another payroll system.</p>
                  <p className="mt-3">Keep in mind that browser storage can be cleared, and data may not be available if you switch to another device or browser. For important payroll records, it is a good idea to keep an exported copy as well.</p>
                </article>
                <article>
                  <h3 className="text-base sm:text-lg font-semibold mb-2.5 sm:mb-3 text-slate-800">A simple way to stay on top of your hours</h3>
                  <p>You do not need a complicated spreadsheet to keep track of a normal workweek. Enter your daily times, add your breaks, check the weekly total, and review the overtime and pay information when needed.</p>
                  <p className="mt-3">Whether you are tracking your own hours, checking a timesheet before payroll, or keeping records for freelance work, a time card calculator can take care of the repetitive math and leave you with a clearer view of where your working time went.</p>
                </article>
              </div>
            </section>

            {/* ===== SEO FAQ BLOCK ===== */}
            <section className="mt-10 sm:mt-12 bg-white border-t-2 border-rose-100 pt-8 sm:pt-10 px-1 sm:px-0">
              <div className="max-w-4xl mx-auto">
                <span className="inline-block text-[0.62rem] sm:text-[0.65rem] uppercase tracking-[0.15em] font-semibold mb-3 px-2.5 sm:px-3 py-1 rounded-full bg-rose-50 text-rose-700">
                  FAQs
                </span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-slate-800 leading-snug">
                  Frequently Asked Questions About Time Card Calculator
                </h2>
                <p className="text-xs sm:text-sm md:text-base leading-6 sm:leading-7 mb-6 sm:mb-8 text-slate-500">
                  Quick answers to the most common questions about calculating weekly work hours, lunch breaks, overtime, and estimated pay.
                </p>

                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      q: 'What is a time card calculator?',
                      a: 'A time card calculator is an online tool that converts your daily clock-in and clock-out times into total weekly working hours. It automatically subtracts lunch breaks, separates regular hours from overtime, and can estimate your weekly pay based on an hourly rate.'
                    },
                    {
                      q: 'How do I calculate my weekly work hours with lunch breaks?',
                      a: 'Enter your clock-in and clock-out time for each day, then add your lunch-out and lunch-in times. The calculator subtracts the unpaid lunch break from your total shift, giving you the exact number of hours you actually worked that day. For example, 9:00 AM to 5:00 PM with a 1-hour lunch equals 7 working hours.'
                    },
                    {
                      q: 'How is overtime calculated on a time card?',
                      a: 'Overtime is typically calculated after 40 hours in a workweek. The calculator separates your total hours into regular (first 40 hours) and overtime (hours beyond 40), then applies your chosen overtime multiplier — commonly 1.5× for time-and-a-half. Any hours beyond the double-time threshold use the 2× multiplier.'
                    },
                    {
                      q: 'Does the time card calculator support holidays, PTO, and sick days?',
                      a: 'Yes. Each day row has Holiday, PTO, and Sick checkboxes. When you mark a day, that day is excluded from worked hours and labelled accordingly in your summary, so you can track attendance separately from actual hours worked.'
                    },
                    {
                      q: 'Is my time card data saved and is it private?',
                      a: 'Your time entries, settings, and notes are saved automatically in your browser\'s local storage. The data never leaves your device and is not sent to any server. You can also copy your weekly summary or download it as a CSV file at any time.'
                    },
                    {
                      q: 'Is this time card calculator free to use?',
                      a: 'Yes, this time card calculator is completely free. No account, sign-up, or payment is required. It works on mobile, tablet, and desktop, and it also works offline once the page has loaded.'
                    }
                  ].map((faq, i) => (
                    <details
                      key={i}
                      className="group rounded-xl sm:rounded-2xl border border-rose-100 bg-rose-50/40 p-3 sm:p-4 md:p-5 cursor-pointer transition hover:bg-rose-50"
                    >
                      <summary className="font-semibold text-xs sm:text-sm md:text-base text-slate-800 list-none flex items-start sm:items-center justify-between gap-2 sm:gap-3 leading-snug">
                        <span className="flex-1 pr-1">{faq.q}</span>
                        <span className="text-rose-600 text-lg sm:text-xl group-open:rotate-45 transition-transform shrink-0 mt-0.5 sm:mt-0">
                          +
                        </span>
                      </summary>
                      <p className="text-xs sm:text-sm md:text-[15px] text-slate-500 mt-2.5 sm:mt-3 leading-6 sm:leading-7">
                        {faq.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            <p className={`text-center text-[0.7rem] sm:text-xs mt-8 ${t.muted}`}>
              Data saved locally · No account · Works offline
            </p>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

// ---------- Subcomponents ----------
const Field = ({ label, children, t }) => (
  <div>
    <label className={`block text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider mb-1 ${t.muted}`}>
      {label}
    </label>
    {children}
  </div>
);

const QuickStat = ({ label, value, accent, t }) => (
  <div className={`rounded-xl sm:rounded-2xl border p-2.5 sm:p-3 ${t.border}`}>
    <div className={`text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-wider mb-1 ${t.muted}`}>{label}</div>
    <div className={`text-base sm:text-lg font-semibold tabular-nums ${accent ? 'text-rose-600 dark:text-rose-400' : t.text}`}>
      {value}
    </div>
  </div>
);

const SummaryCard = ({ label, value, unit, accent, big, t }) => (
  <div className={`rounded-xl sm:rounded-2xl border p-3 sm:p-4 ${t.card}`}>
    <div className={`text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-wider mb-1 ${t.muted}`}>{label}</div>
    <div
      className={`${big ? 'text-xl sm:text-2xl md:text-3xl' : 'text-lg sm:text-xl'} font-semibold tabular-nums tracking-tight ${
        accent ? 'text-rose-600 dark:text-rose-400' : t.text
      }`}
    >
      {value}
      {unit && <span className={`text-xs sm:text-sm font-normal ml-1 ${t.muted}`}>{unit}</span>}
    </div>
  </div>
);

const MiniStat = ({ label, value, t }) => (
  <div>
    <div className={`text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-wider mb-0.5 ${t.muted}`}>{label}</div>
    <div className={`text-xs sm:text-sm font-medium tabular-nums ${t.text}`}>{value}</div>
  </div>
);

export default TimeCardCalculator;