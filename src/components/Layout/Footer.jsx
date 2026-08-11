// src/components/Layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pb-4 sm:pb-6 md:pb-8 mt-8 sm:mt-12 md:mt-16">
      <div className="pt-4 sm:pt-6 md:pt-8 border-t border-white/5">
        
        {/* ✅ Main Footer Content - Mobile Optimized */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          
          {/* ✅ Left Side - Brand Info */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs md:text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="text-sm sm:text-base">⏱️</span>
              <span className="hidden xs:inline">TimeCounterPro</span>
              <span className="xs:hidden">TCPro</span>
              <span className="text-gray-600 text-[8px] sm:text-[10px]">v2.0</span>
            </span>
            <span className="hidden sm:inline text-gray-600">•</span>
            <span className="flex items-center gap-1">
              <span>❤️</span>
              <span className="hidden xs:inline">Made with</span>
              <span className="xs:hidden">❤️</span>
              <span className="hidden xs:inline">React</span>
            </span>
            <span className="hidden sm:inline text-gray-600">•</span>
            <span className="flex items-center gap-1">
              <span>💾</span>
              <span className="hidden xs:inline">Zero Backend</span>
            </span>
          </div>

          {/* ✅ Right Side - Links */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 md:gap-3 text-[10px] sm:text-xs">
            <Link to="/" className="text-gray-500 hover:text-purple-400 transition-colors duration-300 hover:scale-105">
              Home
            </Link>
            <span className="text-gray-600 text-[8px] sm:text-[10px]">|</span>
            <Link to="/about" className="text-gray-500 hover:text-purple-400 transition-colors duration-300 hover:scale-105">
              About
            </Link>
            <span className="text-gray-600 text-[8px] sm:text-[10px]">|</span>
            <Link to="/contact" className="text-gray-500 hover:text-purple-400 transition-colors duration-300 hover:scale-105">
              Contact
            </Link>
            <span className="text-gray-600 text-[8px] sm:text-[10px]">|</span>
            <Link to="/privacy" className="text-gray-500 hover:text-purple-400 transition-colors duration-300 hover:scale-105">
              Privacy
            </Link>
            <span className="text-gray-600 text-[8px] sm:text-[10px]">|</span>
            <Link to="/terms" className="text-gray-500 hover:text-purple-400 transition-colors duration-300 hover:scale-105">
              Terms
            </Link>
          </div>
        </div>

        {/* ✅ Copyright - Mobile Optimized */}
        <div className="text-center text-[8px] sm:text-[10px] md:text-xs text-gray-600 mt-2 sm:mt-3 md:mt-4">
          © {currentYear} TimeCounterPro. 
          <span className="hidden xs:inline"> All rights reserved.</span>
          <span className="xs:hidden"> All rights reserved.</span>
        </div>

        {/* ✅ Quick Back to Top - Mobile Only */}
        <div className="md:hidden text-center mt-2">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-gray-500 hover:text-purple-400 transition-colors duration-300 text-[10px]"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;