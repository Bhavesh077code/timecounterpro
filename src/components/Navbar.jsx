// src/components/Navbar.jsx - Updated with smaller button sizes
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TimerContext } from "../context/TimerContext";
import { formatTime } from "../utils/helpers";
import StickerVault from "./StrickerVault";

const Navbar = () => {
  const location = useLocation();
  const { activeTimers, completedTimers } = useContext(TimerContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStickers, setShowStickers] = useState(false);

  const getTodayStats = () => {
    try {
      const today = new Date().toDateString();
      const todayTimers = (completedTimers || []).filter(
        (t) => t && new Date(t.completedAt).toDateString() === today,
      );
      return {
        count: todayTimers.length,
        time: todayTimers.reduce((acc, t) => acc + (t.duration || 0), 0),
      };
    } catch (e) {
      return { count: 0, time: 0 };
    }
  };

  const todayStats = getTodayStats();

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
      : "text-gray-400 hover:text-white hover:bg-white/5";
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  return (
    <>
      {showStickers && <StickerVault onClose={() => setShowStickers(false)} />}

      <nav className="relative z-50 sticky top-0 backdrop-blur-2xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* ✅ Logo - Smaller */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0"
            >
              <div className="w-7 h-7 sm:w-8 md:w-9 sm:h-8 md:h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm sm:text-base md:text-lg shadow-lg shadow-purple-500/25">
                ⏱️
              </div>
              <div>
                <h1 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  <span className="md:hidden">TCPro</span>
                  <span className="hidden md:inline">TimeCounterPro</span>
                </h1>
                <p className="text-[8px] sm:text-[10px] text-gray-400 tracking-wider hidden sm:block">
                  PROFESSIONAL TIMER
                </p>
              </div>
            </Link>

            {/* ✅ Desktop Navigation - Bigger Buttons */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <Link to="/">
                <button
                  className={`px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg text-[11px] lg:text-[12px] xl:text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive("/")}`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">📊</span>
                    <span className="hidden lg:inline">Home</span>
                    {(activeTimers || []).length > 0 && (
                      <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                        {(activeTimers || []).length}
                      </span>
                    )}
                  </span>
                </button>
              </Link>

              <Link to="/history">
                <button
                  className={`px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg text-[11px] lg:text-[12px] xl:text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive("/history")}`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">📜</span>
                    <span className="hidden lg:inline">History</span>
                    {(completedTimers || []).length > 0 && (
                      <span className="bg-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                        {(completedTimers || []).length}
                      </span>
                    )}
                  </span>
                </button>
              </Link>

              <Link to="/about">
                <button
                  className={`px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg text-[11px] lg:text-[12px] xl:text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive("/about")}`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">ℹ️</span>
                    <span className="hidden lg:inline">About</span>
                  </span>
                </button>
              </Link>

              <Link to="/contact">
                <button
                  className={`px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg text-[11px] lg:text-[12px] xl:text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive("/contact")}`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">✉️</span>
                    <span className="hidden lg:inline">Contact</span>
                  </span>
                </button>
              </Link>

              <Link to="/blog">
                <button
                  className={`px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg text-[11px] lg:text-[12px] xl:text-sm font-medium transition-all duration-300 whitespace-nowrap ${isActive("/blog")}`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">📝</span>
                    <span className="hidden lg:inline">Blog</span>
                  </span>
                </button>
              </Link>

              {/* ✅ Sticker Button - Bigger */}
              <button
                onClick={() => setShowStickers(true)}
                className="px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg text-[11px] lg:text-[12px] xl:text-sm font-medium transition-all duration-300 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/20 text-purple-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap"
              >
                <span className="text-sm">✨</span>
                <span className="hidden lg:inline">Stickers</span>
              </button>

              {/* ✅ Feedback Button - Bigger */}
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSdHdxQbSQ8IvTlCZ5BYCZij2fXM4a27XWubfbD-a442fwGvkA/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-lg text-[11px] lg:text-[12px] xl:text-sm font-medium transition-all duration-300 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/20 text-purple-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap"
              >
                <span className="text-sm">💬</span>
                <span className="hidden lg:inline">Feedback</span>
              </a>
            </div>

            {/* ✅ Right Side - Mobile Optimized */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              {/* Today Stats - Desktop */}
              <div className="hidden lg:flex items-center gap-2 xl:gap-3 px-2 xl:px-3 py-1 rounded-lg bg-white/5">
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">Today</div>
                  <div className="text-xs xl:text-sm font-bold text-white">
                    {todayStats.count}
                  </div>
                </div>
                <div className="w-px h-6 xl:h-8 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-[10px] text-gray-500">Time</div>
                  <div className="text-xs xl:text-sm font-bold text-purple-400">
                    {formatTime(todayStats.time).short}
                  </div>
                </div>
              </div>

              {/* Today Stats - Mobile */}
              <div className="flex lg:hidden items-center gap-1 px-1.5 py-0.5 rounded-lg bg-white/5">
                <div className="text-center">
                  <div className="text-[7px] text-gray-500">Today</div>
                  <div className="text-[9px] font-bold text-white">
                    {todayStats.count}
                  </div>
                </div>
                <div className="w-px h-3.5 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-[7px] text-gray-500">Time</div>
                  <div className="text-[9px] font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {formatTime(todayStats.time).short}
                  </div>
                </div>
              </div>

              {/* Legal Links */}
              <div className="hidden xl:flex items-center gap-1.5 text-[10px]">
                <Link
                  to="/privacy"
                  className="text-gray-500 hover:text-purple-400 transition-colors px-1.5 py-0.5"
                >
                  Privacy
                </Link>
                <span className="text-gray-600">|</span>
                <Link
                  to="/terms"
                  className="text-gray-500 hover:text-purple-400 transition-colors px-1.5 py-0.5"
                >
                  Terms
                </Link>
              </div>

              {/* Mobile Menu Icons */}
              <div className="flex md:hidden items-center gap-0.5">
                <button
                  onClick={() => setShowStickers(true)}
                  className="text-gray-400 hover:text-white p-1 text-sm"
                  aria-label="Stickers"
                >
                  ✨
                </button>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white p-1 text-sm"
                  aria-label="Contact"
                >
                  ✉️
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="text-gray-400 hover:text-white p-1 text-sm"
                  aria-label="Menu"
                >
                  {isMobileMenuOpen ? "✕" : "☰"}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Legal Links */}
          <div className="md:hidden flex items-center justify-center gap-1.5 py-1 border-t border-white/5 text-[8px]">
            <Link
              to="/privacy"
              className="text-gray-500 hover:text-purple-400 transition-colors"
            >
              Privacy
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              to="/terms"
              className="text-gray-500 hover:text-purple-400 transition-colors"
            >
              Terms
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              to="/blog"
              className="text-gray-500 hover:text-purple-400 transition-colors"
            >
              📝 Blog
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-[550px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-black/95 backdrop-blur-2xl border-b border-white/5 px-4 py-3 space-y-1">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <span>📊</span> Home
              {(activeTimers || []).length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {(activeTimers || []).length}
                </span>
              )}
            </Link>
            <Link
              to="/history"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <span>📜</span> History
              {(completedTimers || []).length > 0 && (
                <span className="ml-auto bg-purple-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                  {(completedTimers || []).length}
                </span>
              )}
            </Link>
            <Link
              to="/about"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <span>ℹ️</span> About
            </Link>
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <span>✉️</span> Contact
            </Link>
            <Link
              to="/blog"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <span>📝</span> Blog
            </Link>

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdHdxQbSQ8IvTlCZ5BYCZij2fXM4a27XWubfbD-a442fwGvkA/viewform"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <span>💬</span> Give Feedback
            </a>

            <div className="border-t border-white/5 my-2"></div>

            <button
              onClick={() => {
                closeMobileMenu();
                setShowStickers(true);
              }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-purple-300 hover:text-white hover:bg-white/5 transition-all text-sm w-full"
            >
              <span>✨</span> Stickers
            </button>
            <Link
              to="/privacy"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <span>🔒</span> Privacy Policy
            </Link>
            <Link
              to="/terms"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            >
              <span>📋</span> Terms & Conditions
            </Link>

            <div className="border-t border-white/5 my-2 pt-2">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-gray-500 text-xs">Today</span>
                <div className="flex items-center gap-3">
                  <span className="text-white font-bold text-sm">
                    {todayStats.count} timers
                  </span>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold text-sm">
                    {formatTime(todayStats.time).short}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
