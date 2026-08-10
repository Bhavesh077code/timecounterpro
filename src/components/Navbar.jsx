// src/components/Navbar.jsx
import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TimerContext } from '../context/TimerContext';
import { formatTime } from '../utils/helpers';
import StickerVault from './StrickerVault';

const Navbar = () => {
  const location = useLocation();
  const { activeTimers, completedTimers } = useContext(TimerContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStickers, setShowStickers] = useState(false);

  const getTodayStats = () => {
    try {
      const today = new Date().toDateString();
      const todayTimers = (completedTimers || []).filter(t => 
        t && new Date(t.completedAt).toDateString() === today
      );
      return {
        count: todayTimers.length,
        time: todayTimers.reduce((acc, t) => acc + (t.duration || 0), 0)
      };
    } catch (e) {
      return { count: 0, time: 0 };
    }
  };

  const todayStats = getTodayStats();

  const isActive = (path) => {
    return location.pathname === path 
      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25' 
      : 'text-gray-400 hover:text-white hover:bg-white/5';
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* ✅ StickerVault Modal */}
      {showStickers && (
        <StickerVault onClose={() => setShowStickers(false)} />
      )}

      <nav className="relative z-50 sticky top-0 backdrop-blur-2xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 cursor-pointer flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl shadow-lg shadow-purple-500/25">
                ⏱️
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  TimeCounterPro
                </h1>
                <p className="text-[10px] text-gray-400 tracking-wider hidden sm:block">PROFESSIONAL TIMER</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1">
              <Link to="/">
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${isActive('/')}`}>
                  <span className="flex items-center gap-2">
                    <span>📊</span> Home
                    {(activeTimers || []).length > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {(activeTimers || []).length}
                      </span>
                    )}
                  </span>
                </button>
              </Link>
              
              <Link to="/history">
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${isActive('/history')}`}>
                  <span className="flex items-center gap-2">
                    <span>📜</span> History
                    {(completedTimers || []).length > 0 && (
                      <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                        {(completedTimers || []).length}
                      </span>
                    )}
                  </span>
                </button>
              </Link>

              <Link to="/about">
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${isActive('/about')}`}>
                  <span className="flex items-center gap-2">
                    <span>ℹ️</span> About
                  </span>
                </button>
              </Link>

              <Link to="/contact">
                <button className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 ${isActive('/contact')}`}>
                  <span className="flex items-center gap-2">
                    <span>✉️</span> Contact
                  </span>
                </button>
              </Link>

              {/* ✅ Sticker Button - Desktop */}
              <button
                onClick={() => setShowStickers(true)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/20 text-purple-300 flex items-center gap-1.5"
              >
                <span>✨</span> Stickers
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Today Stats */}
              <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-lg bg-white/5">
                <div className="text-center">
                  <div className="text-xs text-gray-500">Today</div>
                  <div className="text-sm font-bold text-white">{todayStats.count}</div>
                </div>
                <div className="w-px h-8 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-500">Time</div>
                  <div className="text-sm font-bold text-purple-400">{formatTime(todayStats.time).short}</div>
                </div>
              </div>

              {/* Legal Links */}
              <div className="hidden xl:flex items-center gap-2 text-xs">
                <Link to="/privacy" className="text-gray-500 hover:text-purple-400 transition-colors px-2 py-1">
                  Privacy
                </Link>
                <span className="text-gray-600">|</span>
                <Link to="/terms" className="text-gray-500 hover:text-purple-400 transition-colors px-2 py-1">
                  Terms
                </Link>
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden flex items-center gap-2">
                {/* ✅ Sticker Button - Mobile */}
                <button
                  onClick={() => setShowStickers(true)}
                  className="text-gray-400 hover:text-white p-2 text-lg"
                >
                  ✨
                </button>
                <Link to="/contact" className="text-gray-400 hover:text-white p-2">
                  ✉️
                </Link>
                <button onClick={toggleMobileMenu} className="text-gray-400 hover:text-white p-2">
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Legal Links */}
          <div className="md:hidden flex items-center justify-center gap-3 py-2 border-t border-white/5 text-xs">
            <Link to="/privacy" className="text-gray-500 hover:text-purple-400 transition-colors">
              Privacy
            </Link>
            <span className="text-gray-600">|</span>
            <Link to="/terms" className="text-gray-500 hover:text-purple-400 transition-colors">
              Terms
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-2xl border-b border-white/5">
            <div className="px-4 py-4 space-y-2">
              <Link to="/" onClick={closeMobileMenu} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5">📊 Home</Link>
              <Link to="/history" onClick={closeMobileMenu} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5">📜 History</Link>
              <Link to="/about" onClick={closeMobileMenu} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5">ℹ️ About</Link>
              <Link to="/contact" onClick={closeMobileMenu} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/5">✉️ Contact</Link>
              {/* ✅ Sticker Button - Mobile Menu */}
              <button
                onClick={() => {
                  closeMobileMenu();
                  setShowStickers(true);
                }}
                className="w-full text-left px-4 py-2 rounded-lg text-purple-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
              >
                ✨ Stickers
              </button>
              <Link to="/privacy" onClick={closeMobileMenu} className="block px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">🔒 Privacy</Link>
              <Link to="/terms" onClick={closeMobileMenu} className="block px-4 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">📋 Terms</Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;