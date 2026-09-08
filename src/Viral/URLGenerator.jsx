// src/components/Viral/URLGenerator.jsx
import React, { useState } from 'react';
import { FiCopy, FiCheck, FiShare2, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const URLGenerator = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!url) {
      toast.error('No link available to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Unable to copy link');
      }
    }
  };

  // Display clean URL without domain
  const getDisplayUrl = (fullUrl) => {
    if (!fullUrl) return '';
    try {
      const urlObj = new URL(fullUrl);
      return urlObj.pathname + urlObj.search + urlObj.hash || '/';
    } catch {
      return fullUrl.replace(/https?:\/\/[^\/]+/, '') || '/';
    }
  };

  const displayUrl = getDisplayUrl(url);
  const isLocalhost = url?.includes('localhost') || url?.includes('127.0.0.1') || url?.includes('0.0.0.0');

  // Get domain name for display
  const getDomain = (fullUrl) => {
    if (!fullUrl) return '';
    try {
      const urlObj = new URL(fullUrl);
      return urlObj.hostname;
    } catch {
      return '';
    }
  };

  const domain = getDomain(url);

  return (
    <div className="space-y-3">
      {/* Label with Domain */}
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
          <FiLink size={14} className="sm:w-[16px] sm:h-[16px]" />
        </div>
        <span className="text-slate-700 text-sm font-medium">
          Shareable Link
        </span>
        {!isLocalhost && domain && (
          <span className="text-[8px] sm:text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
            {domain}
          </span>
        )}
        {isLocalhost && (
          <span className="text-[8px] sm:text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
            Development
          </span>
        )}
      </div>

      {/* Input + Copy Button */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={displayUrl || '/'}
            readOnly
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm focus:outline-none font-mono truncate"
            aria-label="Shareable link"
            title={url || 'No link available'}
            spellCheck="false"
          />
          {!isLocalhost && url && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                Live
              </span>
            </div>
          )}
        </div>
        <button
          onClick={handleCopy}
          disabled={!url}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
            copied
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-md active:scale-95'
          } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white`}
          aria-label={copied ? 'Link copied successfully' : 'Copy link to clipboard'}
        >
          {copied ? (
            <>
              <FiCheck size={16} className="flex-shrink-0" />
              <span className="hidden xs:inline">Copied</span>
            </>
          ) : (
            <>
              <FiCopy size={16} className="flex-shrink-0" />
              <span className="hidden xs:inline">Copy</span>
              <span className="xs:hidden">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Status Information */}
      <div className="flex items-center gap-2 text-xs">
        {isLocalhost ? (
          <>
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-amber-600">
              Development URL - Deploy for production use
            </span>
          </>
        ) : url ? (
          <>
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-600">
              Production URL - Share this link with anyone
            </span>
          </>
        ) : (
          <>
            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-slate-400">
              No link available - Create a countdown first
            </span>
          </>
        )}
      </div>

      {/* Quick Share Hint */}
      <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex-shrink-0 mt-0.5 text-indigo-600">
          <FiShare2 size={14} />
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Share this link with anyone to show the live countdown. Works on all devices and browsers.
        </p>
      </div>

      {/* URL Statistics (optional helpful info) */}
      {url && !isLocalhost && (
        <div className="flex flex-wrap gap-3 text-[10px] text-slate-400 border-t border-slate-200 pt-2">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Shareable link ready</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>No login required</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>Real-time countdown</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default URLGenerator;