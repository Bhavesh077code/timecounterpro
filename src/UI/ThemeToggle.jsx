// src/components/UI/ThemeToggle.jsx
import React, { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-1.5 sm:p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 text-gray-400 hover:text-white hover:scale-110 active:scale-95"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <FiSun size={16} className="sm:w-[18px] sm:h-[18px] text-yellow-400" />
      ) : (
        <FiMoon size={16} className="sm:w-[18px] sm:h-[18px] text-blue-400" />
      )}
    </button>
  );
}

export default ThemeToggle;