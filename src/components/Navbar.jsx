import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TimerContext } from "../context/TimerContext";
import { formatTime } from "../utils/helpers";
import logo from "../assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const { activeTimers, completedTimers } = useContext(TimerContext);
  const [open, setOpen] = useState(false);
  const today = new Date().toDateString();
  const todayTimers = (completedTimers || []).filter(t => t && new Date(t.completedAt).toDateString() === today);
  const todayTime = todayTimers.reduce((sum, t) => sum + (t.duration || 0), 0);
  const active = (path) => location.pathname === path
    ? "bg-slate-900 text-white shadow-sm"
    : "text-slate-600 hover:text-slate-950 hover:bg-slate-100";

  const links = [
    ["/", "Home"], ["/pomodoro", "Pomodoro"],["/stopwatch", "Stopwatch"],["/timers", "Timers"],["/world-clock", "World Clock"], ["/history", "History"],
    ["/blog", "Guides"], ["/about", "About"], ["/contact", "Contact"]
  ];

  return <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
      <div className="h-14 xs:h-16 flex items-center justify-between gap-2 xs:gap-4">
        
        {/* Logo + Brand Name - Always visible on all devices */}
        <Link to="/" className="flex items-center gap-2 xs:gap-3 shrink-0" onClick={() => setOpen(false)}>
          <img 
            src={logo} 
            className="w-8 h-8 xs:w-9 sm:w-10 xs:h-9 sm:h-10  bg-slate-900 text-white grid place-items-center text-lg shadow-sm" 
            alt="TimeCounterPro Logo"
          />
          <span className="block">
            <span className="block text-xs xs:text-sm sm:text-base font-bold tracking-tight text-slate-950 leading-tight">
              TimeCounterPro
            </span>
            <span className="hidden xs:block text-[8px] xs:text-[9px] sm:text-[10px] font-medium tracking-[.12em] xs:tracking-[.14em] sm:tracking-[.16em] text-slate-500 leading-tight">
              SIMPLE • FOCUSED • FREE
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1  bg-slate-50 border border-slate-200 p-1">
          {links.map(([path, label]) => <Link key={path} to={path} className={`px-3 py-2  text-sm font-medium transition ${active(path)}`}>{label}</Link>)}
        </div>

        <div className="flex items-center gap-1.5 xs:gap-2">
          {/* Today Stats - Hidden on very small screens */}
          <div className="hidden lg:flex items-center gap-3 px-3 py-1.5  border border-slate-200 bg-white text-xs">
            <div><span className="block text-slate-400">Today</span><strong className="text-slate-800">{todayTimers.length}</strong></div>
            <div className="h-7 w-px bg-slate-200" />
            <div><span className="block text-slate-400">Time</span><strong className="text-blue-600">{formatTime(todayTime).short}</strong></div>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setOpen(v => !v)} 
            className="md:hidden w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10  border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center text-lg xs:text-xl"
            aria-label="Open menu"
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && <div className="md:hidden pb-3 border-t border-slate-100 pt-2 space-y-1">
        {links.map(([path, label]) => <Link key={path} to={path} onClick={() => setOpen(false)} className={`block px-3 py-2.5  text-sm font-medium ${active(path)}`}>{label}</Link>)}
        <div className="mt-2 px-3 py-2 rounded-lg bg-slate-50 text-xs text-slate-500">
          {activeTimers?.length || 0} active timers · {todayTimers.length} completed today
        </div>
      </div>}
    </div>
  </nav>;
};
export default Navbar;