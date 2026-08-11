// src/components/Viral/URLGenerator.jsx
import React, { useState } from 'react';
import { FiCopy, FiCheck, FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const URLGenerator = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('✅ Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  // ✅ Display clean URL without domain
  const getDisplayUrl = (fullUrl) => {
    try {
      const urlObj = new URL(fullUrl);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      return fullUrl.replace(/https?:\/\/[^\/]+/, '');
    }
  };

  const displayUrl = getDisplayUrl(url);

  // ✅ Check if URL is localhost
  const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');

  return (
    <div className="space-y-2 sm:space-y-3">
      {/* ✅ Label - Mobile Optimized */}
      <label className="flex items-center gap-1.5 sm:gap-2 text-gray-400 text-xs sm:text-sm font-medium">
        <span className="text-base sm:text-lg">🔗</span>
        <span>Shareable Link</span>
        {!isLocalhost && (
          <span className="text-[8px] sm:text-[10px] text-green-400 bg-green-500/20 px-1.5 sm:px-2 py-0.5 rounded-full">
            Live
          </span>
        )}
      </label>

      {/* ✅ Input + Copy Button - Mobile Optimized */}
      <div className="flex gap-1.5 sm:gap-2">
        <input
          type="text"
          value={displayUrl}
          readOnly
          className="flex-1 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs sm:text-sm focus:outline-none truncate"
          aria-label="Shareable link"
        />
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg transition-all duration-300 text-xs sm:text-sm font-medium ${
            copied
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-purple-500 hover:bg-purple-600 text-white hover:scale-105 active:scale-95'
          }`}
          aria-label={copied ? 'Copied!' : 'Copy link'}
        >
          {copied ? (
            <>
              <FiCheck size={14} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Copied!</span>
            </>
          ) : (
            <>
              <FiCopy size={14} className="sm:w-[18px] sm:h-[18px]" />
              <span className="hidden xs:inline">Copy</span>
              <span className="xs:hidden">📋</span>
            </>
          )}
        </button>
      </div>

      {/* ✅ Status - Mobile Optimized */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-[8px] sm:text-[10px] md:text-xs">
        {isLocalhost ? (
          <>
            <span className="text-yellow-400">⚠️</span>
            <span className="text-yellow-400/80">Development URL - Deploy for production</span>
          </>
        ) : (
          <>
            <span className="text-green-400">✅</span>
            <span className="text-green-400/80">Production URL - Share this link</span>
          </>
        )}
      </div>

      {/* ✅ Quick Share Hint - Mobile */}
      <div className="text-[8px] sm:text-[10px] text-gray-500 flex items-center gap-1">
        <span>💡</span>
        <span>Share this link with anyone to show the countdown</span>
      </div>
    </div>
  );
};

export default URLGenerator;