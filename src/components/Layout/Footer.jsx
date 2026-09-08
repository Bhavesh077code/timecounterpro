// src/components/Layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white mt-12 sm:mt-16 md:mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          
          {/* Brand Section */}
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              TimeCounterPro
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Free online countdown timer, stopwatch and Pomodoro timer for study, work, and productivity.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 border border-indigo-200 font-medium">Free</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 border border-emerald-200 font-medium">No Sign-up</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Quick Links</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Legal</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/privacy" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                  Terms of Service
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Timer Types */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Timers</h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/countdown" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                  Countdown Timer
                </Link>
              </li>
              <li>
                <Link to="/stopwatch" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                  Stopwatch
                </Link>
              </li>
              <li>
                <Link to="/pomodoro" className="text-sm text-slate-500 hover:text-indigo-600 transition-colors duration-200">
                  Pomodoro Timer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar - Copyright */}
        <div className="border-t border-slate-200 mt-6 sm:mt-8 pt-4 sm:pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-500">
            © {currentYear} TimeCounterPro. All rights reserved.
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Made with ❤️</span>
            <span className="hidden xs:inline">•</span>
            <span className="hidden xs:inline">React & Tailwind CSS</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">v2.0</span>
          </div>
        </div>

        {/* Back to Top - Mobile */}
        <div className="sm:hidden text-center mt-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-xs text-slate-400 hover:text-indigo-600 transition-colors duration-200"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;