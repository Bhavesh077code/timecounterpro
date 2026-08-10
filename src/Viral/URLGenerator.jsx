// src/components/Viral/URLGenerator.jsx
import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const URLGenerator = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied! 🔗');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  // ✅ Display clean URL without localhost
  const displayUrl = url.replace(/https?:\/\/[^\/]+/, '');

  return (
    <div className="space-y-3">
      <label className="block text-gray-400 text-sm font-medium">🔗 Shareable Link</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={displayUrl}
          readOnly
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all duration-300 flex items-center gap-2"
        >
          {copied ? <FiCheck size={18} /> : <FiCopy size={18} />}
          <span className="text-sm hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="text-xs text-gray-500">
        {url.includes('localhost') ? (
          <span className="text-yellow-400">⚠️ Development URL - Deploy for production link</span>
        ) : (
          <span className="text-green-400">✅ Production URL - Share this link</span>
        )}
      </div>
    </div>
  );
};