// src/components/UI/ThemeToggle.jsx
import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first, then system preference, default to light
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Store preference
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = theme === 'dark' ? '#0f172a' : '#f8fafc';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Determine button styling based on current theme
  const getButtonClasses = () => {
    const baseClasses = 'p-1.5 sm:p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    if (theme === 'dark') {
      return `${baseClasses} bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 focus:ring-amber-500 focus:ring-offset-slate-900`;
    }
    
    return `${baseClasses} bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-indigo-600 focus:ring-indigo-500 focus:ring-offset-white`;
  };

  return (
    <button
      onClick={toggleTheme}
      className={getButtonClasses()}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <FiSun size={16} className="sm:w-[18px] sm:h-[18px] text-amber-400" />
      ) : (
        <FiMoon size={16} className="sm:w-[18px] sm:h-[18px] text-indigo-600" />
      )}
    </button>
  );
}

export default ThemeToggle;