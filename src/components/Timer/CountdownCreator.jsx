import React, { useContext, useEffect, useRef, useState } from 'react';
import { TimerContext } from '../../context/TimerContext';
import { ShareButtons } from '../../Viral/ShareButtons';
import { URLGenerator } from '../../Viral/URLGenerator';
import toast from 'react-hot-toast';
import { FiCalendar, FiClock, FiLink, FiCopy, FiCheck, FiExternalLink, FiZap, FiArrowRight, FiChevronDown } from 'react-icons/fi';

const THEMES = [
  { 
    id: 'indigo', 
    label: 'Indigo', 
    bg: 'from-indigo-500 to-indigo-600',
    light: 'from-indigo-50 to-indigo-100',
    color: '#4f46e5',
    hover: 'hover:border-indigo-500'
  },
  { 
    id: 'emerald', 
    label: 'Emerald', 
    bg: 'from-emerald-500 to-emerald-600',
    light: 'from-emerald-50 to-emerald-100',
    color: '#059669',
    hover: 'hover:border-emerald-500'
  },
  { 
    id: 'rose', 
    label: 'Rose', 
    bg: 'from-rose-500 to-rose-600',
    light: 'from-rose-50 to-rose-100',
    color: '#e11d48',
    hover: 'hover:border-rose-500'
  },
  { 
    id: 'blue', 
    label: 'Ocean', 
    bg: 'from-blue-500 to-blue-600',
    light: 'from-blue-50 to-blue-100',
    color: '#2563eb',
    hover: 'hover:border-blue-500'
  },
  { 
    id: 'purple', 
    label: 'Purple', 
    bg: 'from-purple-500 to-purple-600',
    light: 'from-purple-50 to-purple-100',
    color: '#7c3aed',
    hover: 'hover:border-purple-500'
  },
  { 
    id: 'amber', 
    label: 'Amber', 
    bg: 'from-amber-500 to-amber-600',
    light: 'from-amber-50 to-amber-100',
    color: '#d97706',
    hover: 'hover:border-amber-500'
  },
  { 
    id: 'teal', 
    label: 'Teal', 
    bg: 'from-teal-500 to-teal-600',
    light: 'from-teal-50 to-teal-100',
    color: '#0d9488',
    hover: 'hover:border-teal-500'
  },
  { 
    id: 'pink', 
    label: 'Pink', 
    bg: 'from-pink-500 to-pink-600',
    light: 'from-pink-50 to-pink-100',
    color: '#db2777',
    hover: 'hover:border-pink-500'
  },
];

const getBaseURL = () => {
  if (typeof window === 'undefined') return 'https://timecounterpro.com';
  return window.location.origin;
};

const toLocalDateTime = (date, time) => `${date}T${time}:00`;

function CountdownCreator() {
  const { addTimer } = useContext(TimerContext);
  const [eventName, setEventName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('23:59');
  const [selectedTheme, setSelectedTheme] = useState('indigo');
  const [generatedURL, setGeneratedURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const inputRef = useRef(null);
  const themeRef = useRef(null);

  useEffect(() => {
    if (!eventName.trim() || !targetDate) {
      setGeneratedURL('');
      return;
    }

    const target = new Date(toLocalDateTime(targetDate, targetTime));
    if (Number.isNaN(target.getTime())) {
      setGeneratedURL('');
      return;
    }

    const query = new URLSearchParams({
      event: eventName.trim(),
      date: target.toISOString(),
      theme: selectedTheme,
    });
    setGeneratedURL(`${getBaseURL()}?${query.toString()}`);
  }, [eventName, targetDate, targetTime, selectedTheme]);

  // Close theme dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!eventName.trim() || !targetDate) {
      toast.error('Please enter an event name and target date');
      return;
    }

    const target = new Date(toLocalDateTime(targetDate, targetTime));
    const targetAt = target.getTime();
    const duration = Math.ceil((targetAt - Date.now()) / 1000);

    if (!Number.isFinite(targetAt) || duration <= 0) {
      toast.warning('Please choose a future date and time');
      return;
    }

    setIsLoading(true);
    try {
      addTimer({
        name: eventName.trim(),
        duration,
        type: 'countdown',
        targetDate: target.toISOString(),
        theme: selectedTheme,
      });

      const query = new URLSearchParams({
        event: eventName.trim(),
        date: target.toISOString(),
        theme: selectedTheme,
      });
      const url = `${getBaseURL()}?${query.toString()}`;
      setGeneratedURL(url);
      toast.success('Countdown created successfully');

      setTimeout(() => document.getElementById('url-section')?.scrollIntoView({ behavior: 'smooth' }), 150);
    } catch (error) {
      console.error('Countdown creation error:', error);
      toast.error('Failed to create countdown. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedURL) return;
    try {
      await navigator.clipboard.writeText(generatedURL);
      setIsCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
        setIsCopied(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setIsCopied(false), 2000);
      } else {
        toast.error('Unable to copy the link');
      }
    }
  };

  const getThemeColor = () => {
    const theme = THEMES.find(t => t.id === selectedTheme);
    if (!theme) return 'from-indigo-500 to-indigo-600';
    return theme.bg;
  };

  const getThemeLabel = () => {
    const theme = THEMES.find(t => t.id === selectedTheme);
    return theme ? theme.label : 'Indigo';
  };

  const getThemeColorHex = () => {
    const theme = THEMES.find(t => t.id === selectedTheme);
    return theme ? theme.color : '#4f46e5';
  };

  const selectedThemeData = THEMES.find(t => t.id === selectedTheme);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 xs:p-5 sm:p-6 md:p-8 animate-fade-in w-full max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 xs:gap-4 mb-4 xs:mb-5 sm:mb-6">
        <div className="p-2.5 xs:p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex-shrink-0">
          <FiCalendar size={18} className="xs:text-[20px] sm:text-[22px] text-indigo-600" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-bold text-slate-800 truncate">Create Custom Countdown</h2>
          <p className="text-[11px] xs:text-xs sm:text-sm text-slate-500 mt-0.5">Set a date, choose a theme, and share with anyone</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5">
        {/* Event Name */}
        <div>
          <label className="block text-[11px] xs:text-xs sm:text-sm font-medium text-slate-700 mb-1 xs:mb-1.5">
            Event Name <span className="text-rose-500">*</span>
          </label>
          <input 
            type="text" 
            value={eventName} 
            onChange={(e) => setEventName(e.target.value)} 
            maxLength={80} 
            placeholder="e.g. Product Launch, Wedding Day, New Year" 
            className="w-full px-3 xs:px-4 py-2 xs:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm xs:text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all touch-manipulation" 
            required 
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
          <div>
            <label className="block text-[11px] xs:text-xs sm:text-sm font-medium text-slate-700 mb-1 xs:mb-1.5">
              Target Date <span className="text-rose-500">*</span>
            </label>
            <input 
              type="date" 
              value={targetDate} 
              min={new Date().toISOString().slice(0, 10)} 
              onChange={(e) => setTargetDate(e.target.value)} 
              className="w-full px-3 xs:px-4 py-2 xs:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm xs:text-base text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all touch-manipulation" 
              required 
            />
          </div>
          <div>
            <label className="block text-[11px] xs:text-xs sm:text-sm font-medium text-slate-700 mb-1 xs:mb-1.5">
              Target Time
            </label>
            <div className="relative">
              <FiClock size={14} className="xs:text-[16px] absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="time" 
                value={targetTime} 
                onChange={(e) => setTargetTime(e.target.value)} 
                className="w-full pl-8 xs:pl-9 pr-3 xs:pr-4 py-2 xs:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm xs:text-base text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all touch-manipulation" 
                required 
              />
            </div>
          </div>
        </div>

        {/* Theme Selector - Dropdown Style */}
        <div>
          <label className="block text-[11px] xs:text-xs sm:text-sm font-medium text-slate-700 mb-1 xs:mb-1.5">
            Theme Color
          </label>
          <div ref={themeRef} className="relative">
            <button
              type="button"
              onClick={() => setIsThemeOpen(!isThemeOpen)}
              className="w-full flex items-center justify-between px-3 xs:px-4 py-2 xs:py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-all touch-manipulation active:scale-[0.99]"
            >
              <div className="flex items-center gap-2.5 xs:gap-3 min-w-0">
                <div 
                  className="w-5 h-5 xs:w-6 xs:h-6 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                  style={{ background: getThemeColorHex() }}
                />
                <span className="text-xs xs:text-sm text-slate-700 font-medium truncate">
                  {getThemeLabel()}
                </span>
              </div>
              <FiChevronDown size={16} className="xs:text-[18px] text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isThemeOpen ? 'rotate-180' : ''}" />
            </button>

            {/* Dropdown */}
            {isThemeOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 xs:max-h-60 overflow-y-auto animate-fade-in">
                <div className="p-1.5 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 gap-1">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setSelectedTheme(theme.id);
                        setIsThemeOpen(false);
                      }}
                      className={`flex items-center gap-2 xs:gap-2.5 px-2 xs:px-3 py-1.5 xs:py-2 rounded-lg transition-all touch-manipulation ${
                        selectedTheme === theme.id
                          ? 'bg-slate-100 ring-2 ring-indigo-500'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div 
                        className="w-4 h-4 xs:w-5 xs:h-5 rounded-full border-2 border-white shadow-sm flex-shrink-0"
                        style={{ background: theme.color }}
                      />
                      <span className={`text-[10px] xs:text-xs font-medium truncate ${
                        selectedTheme === theme.id ? 'text-slate-800' : 'text-slate-600'
                      }`}>
                        {theme.label}
                      </span>
                      {selectedTheme === theme.id && (
                        <FiCheck size={10} className="xs:text-[12px] text-indigo-600 ml-auto flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-[9px] xs:text-[10px] text-slate-400 mt-1 xs:mt-1.5">
            Selected: <span className="text-slate-600 font-medium">{getThemeLabel()}</span> theme
          </p>
        </div>

        {/* Create Button */}
        <button 
          type="submit" 
          disabled={isLoading} 
          className={`w-full py-2.5 xs:py-3 sm:py-3.5 bg-gradient-to-r ${getThemeColor()} text-white font-semibold rounded-lg disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md transition-all duration-300 text-[11px] xs:text-xs sm:text-sm touch-manipulation active:scale-[0.99]`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3.5 h-3.5 xs:w-4 xs:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-1.5 xs:gap-2">
              <FiZap size={14} className="xs:text-[16px]" />
              Create Countdown
              <FiArrowRight size={12} className="xs:text-[14px]" />
            </span>
          )}
        </button>
      </form>

      {/* Generated URL Section */}
      {generatedURL && (
        <div id="url-section" className="mt-5 xs:mt-6 pt-5 xs:pt-6 border-t border-slate-200 animate-fade-in">
          <div className="flex items-center gap-2 xs:gap-2.5 mb-2.5 xs:mb-3 flex-wrap">
            <div className="p-1.5 bg-emerald-50 rounded-lg border border-emerald-200 flex-shrink-0">
              <FiLink size={14} className="xs:text-[16px] text-emerald-600" />
            </div>
            <h3 className="text-xs xs:text-sm font-semibold text-slate-800">Shareable Link</h3>
            <span className="text-[8px] xs:text-[10px] text-emerald-600 bg-emerald-50 px-1.5 xs:px-2 py-0.5 rounded-full font-medium border border-emerald-200">
              Ready
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative min-w-0">
              <input 
                ref={inputRef} 
                type="text" 
                value={generatedURL} 
                readOnly 
                className="w-full px-3 xs:px-4 py-2 xs:py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] xs:text-xs sm:text-sm text-slate-600 focus:outline-none font-mono pr-20 xs:pr-24 truncate" 
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 xs:gap-1.5">
                <div 
                  className="w-2 h-2 xs:w-2.5 xs:h-2.5 rounded-full border border-white flex-shrink-0"
                  style={{ background: getThemeColorHex() }}
                />
                <span className="text-[7px] xs:text-[8px] sm:text-[9px] text-slate-400 bg-slate-100 px-1 xs:px-1.5 py-0.5 rounded">
                  {getThemeLabel()}
                </span>
              </div>
            </div>
            <div className="flex gap-1.5 xs:gap-2">
              <button 
                type="button" 
                onClick={handleCopy} 
                className={`flex-1 sm:flex-none px-3 xs:px-4 py-2 xs:py-2.5 rounded-lg text-[11px] xs:text-xs sm:text-sm font-medium transition-all flex items-center justify-center gap-1 xs:gap-1.5 touch-manipulation active:scale-95 ${
                  isCopied 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md'
                }`}
              >
                {isCopied ? (
                  <>
                    <FiCheck size={12} className="xs:text-[14px]" />
                    Copied
                  </>
                ) : (
                  <>
                    <FiCopy size={12} className="xs:text-[14px]" />
                    Copy
                  </>
                )}
              </button>
              <button 
                type="button" 
                onClick={() => window.open(generatedURL, '_blank', 'noopener,noreferrer')} 
                className="flex-1 sm:flex-none px-3 xs:px-4 py-2 xs:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] xs:text-xs sm:text-sm font-medium transition-all border border-slate-200 flex items-center justify-center gap-1 xs:gap-1.5 touch-manipulation active:scale-95"
              >
                <FiExternalLink size={12} className="xs:text-[14px]" />
                <span className="hidden xs:inline">Test</span>
                <span className="xs:hidden">Open</span>
              </button>
            </div>
          </div>

          <div className="mt-3 xs:mt-4">
            <URLGenerator url={generatedURL} />
          </div>
          <div className="mt-2.5 xs:mt-3">
            <ShareButtons url={generatedURL} title={eventName} />
          </div>

          {/* Helpful tip */}
          <div className="mt-3 xs:mt-4 p-2.5 xs:p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-[9px] xs:text-[10px] text-slate-500 flex items-start gap-1.5 xs:gap-2">
              <span className="text-indigo-400 mt-0.5 flex-shrink-0">ℹ️</span>
              <span className="break-words">
                Share this link with anyone. They'll see the live countdown with your selected <span className="text-slate-700 font-medium whitespace-nowrap">{getThemeLabel()}</span> theme.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CountdownCreator;