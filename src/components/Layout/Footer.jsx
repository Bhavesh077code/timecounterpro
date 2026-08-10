import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 mt-16">
      <div className="pt-8 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>⏱️ TimeCounterPro v2.0</span>
            <span className="hidden sm:inline">•</span>
            <span>❤️ Made with React</span>
            <span className="hidden sm:inline">•</span>
            <span>💾 Zero Backend</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <Link to="/" className="text-gray-500 hover:text-purple-400 transition-colors">Home</Link>
            <span className="text-gray-600">|</span>
            <Link to="/about" className="text-gray-500 hover:text-purple-400 transition-colors">About</Link>
            <span className="text-gray-600">|</span>
            <Link to="/contact" className="text-gray-500 hover:text-purple-400 transition-colors">Contact</Link>
            <span className="text-gray-600">|</span>
            <Link to="/privacy" className="text-gray-500 hover:text-purple-400 transition-colors">Privacy</Link>
            <span className="text-gray-600">|</span>
            <Link to="/terms" className="text-gray-500 hover:text-purple-400 transition-colors">Terms</Link>
          </div>
        </div>
        <div className="text-center text-xs text-gray-600 mt-4">
          © {new Date().getFullYear()} TimeCounterPro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;