// src/components/QuickPresets.jsx - ✅ LINK WALA FIX - Dabate hi page pe jayega
import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TimerContext } from '../context/TimerContext';
import { TIMER_PRESETS } from '../utils/constants';
import toast from 'react-hot-toast';
import { FiZap, FiClock, FiPlay, FiChevronDown, FiChevronUp, FiExternalLink } from 'react-icons/fi';

function QuickPresets() {
  const { addTimer } = useContext(TimerContext);
  const navigate = useNavigate();
  const [activePreset, setActivePreset] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // ✅ NEW - Link pe jayega
  const handleAddTimer = (preset) => {
    try {
      setActivePreset(preset.name);
      setIsOpen(false);
      
      // ✅ Agar link hai toh page pe jao, nahi toh purana wala timer start karo
      if (preset.link) {
        navigate(preset.link);
        toast.success(`${preset.name} - Opening page`);
      } else {
        // Fallback - old behavior
        addTimer(preset.name, preset.duration, 'preset');
        toast.success(`${preset.name} started`);
      }
      
      setTimeout(() => setActivePreset(null), 2000);
    } catch (error) {
      toast.error('Failed to open timer');
      console.error('Timer error:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDurationDisplay = (seconds) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${mins}m`;
    }
    return `${Math.floor(seconds / 60)}m`;
  };

  const getDotColor = (color) => {
    const colors = {
      emerald: 'bg-emerald-500', teal: 'bg-teal-500', indigo: 'bg-indigo-500',
      blue: 'bg-blue-500', cyan: 'bg-cyan-500', rose: 'bg-rose-500',
      orange: 'bg-orange-500', amber: 'bg-amber-500', purple: 'bg-purple-500', pink: 'bg-pink-500',
    };
    return colors[color] || 'bg-indigo-500';
  };

  const getCategoryIcon = (category) => {
    const icons = { Quick: '⚡', Work: '💼', Fitness: '💪', Entertainment: '🎬', Lifestyle: '🌿' };
    return icons[category] || '📋';
  };

  const groupedPresets = TIMER_PRESETS.reduce((acc, preset) => {
    if (!acc[preset.category]) acc[preset.category] = [];
    acc[preset.category].push(preset);
    return acc;
  }, {});

  const categoryLabels = {
    Quick: 'Quick', Work: 'Work', Fitness: 'Fitness', Entertainment: 'Entertainment', Lifestyle: 'Lifestyle'
  };

  const filteredPresets = searchTerm 
    ? TIMER_PRESETS.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : TIMER_PRESETS;

  const filteredGrouped = filteredPresets.reduce((acc, preset) => {
    if (!acc[preset.category]) acc[preset.category] = [];
    acc[preset.category].push(preset);
    return acc;
  }, {});

  return (
    <div className="mb-4" ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-50 rounded-lg border border-indigo-100">
            <FiZap size={14} className="text-indigo-600" />
          </div>
          <h2 className="text-sm font-semibold text-slate-800">Quick Start</h2>
          <span className="text-[10px] text-slate-400 font-normal hidden sm:inline">
            {TIMER_PRESETS.length} presets • Click to open page
          </span>
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isOpen 
              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          <span>{isOpen ? 'Close' : 'Browse'}</span>
          {isOpen ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-2 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-fade-in">
          <div className="p-3 border-b border-slate-200">
            <input
              type="text"
              placeholder="Search timers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="max-h-72 overflow-y-auto p-2 space-y-2">
            {Object.keys(filteredGrouped).length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">No presets found</div>
            ) : (
              Object.entries(filteredGrouped).map(([category, presets]) => (
                <div key={category} className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <span className="text-sm">{getCategoryIcon(category)}</span>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      {categoryLabels[category] || category}
                    </span>
                    <span className="text-[9px] text-slate-300">({presets.length})</span>
                    <span className="flex-1 border-t border-slate-100" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                    {presets.map((preset) => {
                      const isActive = activePreset === preset.name;
                      const dotColor = getDotColor(preset.color);

                      return (
                        <button
                          key={preset.name}
                          onClick={() => handleAddTimer(preset)}
                          className={`group flex items-center justify-between px-3 py-2 rounded-lg border transition-all duration-200 text-sm text-left w-full ${
                            isActive
                              ? 'border-indigo-300 bg-indigo-50'
                              : 'border-transparent hover:border-indigo-200 hover:bg-indigo-50'
                          } active:scale-95 touch-manipulation`}
                          title={`Go to ${preset.link || preset.slug}`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className={`w-2 h-2 rounded-full ${dotColor} flex-shrink-0`} />
                            <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">{preset.link ? '→' : '•'}</span>
                            <span className={`text-xs font-medium truncate ${isActive ? 'text-indigo-700' : 'text-slate-700'}`}>
                              {preset.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {getDurationDisplay(preset.duration)}
                            </span>
                            <span className={`p-1 rounded-md transition-all flex items-center gap-1 ${
                              isActive 
                                ? 'bg-indigo-200 text-indigo-700' 
                                : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                            }`}>
                              {preset.link ? <FiExternalLink size={12} /> : <FiPlay size={12} />}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[10px] text-slate-400">
            <span>{TIMER_PRESETS.length} timers • Click to open page</span>
            <span className="flex items-center gap-1"><FiExternalLink size={10} /> Goes to timer page</span>
          </div>
        </div>
      )}

      {!isOpen && (
        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1"><FiClock size={10} />{TIMER_PRESETS.length} presets</span>
          <span className="w-px h-3 bg-slate-200" />
          <span>Click Browse → Click any timer = Open page</span>
        </div>
      )}
    </div>
  );
}

export default QuickPresets;