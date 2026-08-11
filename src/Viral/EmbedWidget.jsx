// src/components/Viral/EmbedWidget.jsx
import React, { useState } from 'react';
import { FiCode, FiCopy, FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

function EmbedWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);
  const [showBorder, setShowBorder] = useState(true);
  const [copied, setCopied] = useState(false);

  const embedURL = `${window.location.origin}?view=embed`;

  const generateIframeCode = () => {
    const borderStyle = showBorder ? 'border:1px solid #333;' : 'border:none;';
    return `<iframe src="${embedURL}" width="${width}" height="${height}" style="${borderStyle} border-radius:12px; background:#0a0a0a;" allowfullscreen></iframe>`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateIframeCode());
      setCopied(true);
      toast.success('✅ Embed code copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 mt-4 sm:mt-5 md:mt-6 animate-fade-in">
      {/* ✅ Toggle Button - Mobile Optimized */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-white font-semibold group"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <FiCode size={16} className="sm:w-[20px] sm:h-[20px] text-purple-400" />
          <span className="text-sm sm:text-base">Embed This Timer Widget</span>
          <span className="text-[8px] sm:text-[10px] text-purple-400 ml-1 sm:ml-2 bg-purple-500/20 px-1.5 sm:px-2 py-0.5 rounded-full">
            ⬇️ Backlink
          </span>
        </div>
        <span className="text-gray-400 group-hover:text-white transition-colors">
          {isOpen ? <FiChevronUp size={16} className="sm:w-[20px] sm:h-[20px]" /> : <FiChevronDown size={16} className="sm:w-[20px] sm:h-[20px]" />}
        </span>
      </button>

      {/* ✅ Content - Mobile Responsive */}
      {isOpen && (
        <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4 animate-fade-in">
          {/* Controls - Mobile Optimized */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            <div>
              <label className="text-gray-400 text-[10px] sm:text-xs">Width (px)</label>
              <input 
                type="number" 
                value={width} 
                onChange={(e) => setWidth(Math.max(100, Number(e.target.value) || 100))} 
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-all"
                min="100"
                max="2000"
              />
            </div>
            <div>
              <label className="text-gray-400 text-[10px] sm:text-xs">Height (px)</label>
              <input 
                type="number" 
                value={height} 
                onChange={(e) => setHeight(Math.max(100, Number(e.target.value) || 100))} 
                className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-purple-500 transition-all"
                min="100"
                max="2000"
              />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 col-span-2 sm:col-span-1">
              <input 
                type="checkbox" 
                checked={showBorder} 
                onChange={(e) => setShowBorder(e.target.checked)} 
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-purple-500 cursor-pointer" 
              />
              <label className="text-gray-400 text-[10px] sm:text-xs cursor-pointer">Show Border</label>
            </div>
          </div>

          {/* Code Output - Mobile Optimized */}
          <div className="relative">
            <textarea 
              value={generateIframeCode()} 
              readOnly 
              rows={3} 
              className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-[8px] sm:text-[10px] md:text-xs font-mono focus:outline-none resize-none overflow-x-auto"
            />
            <button 
              onClick={handleCopy} 
              className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 p-1.5 sm:p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              {copied ? <FiCheck size={12} className="sm:w-[14px] sm:h-[14px] text-white" /> : <FiCopy size={12} className="sm:w-[14px] sm:h-[14px] text-white" />}
            </button>
          </div>

          {/* Info */}
          <p className="text-[8px] sm:text-[10px] md:text-xs text-gray-500 flex items-start gap-1">
            <span className="text-purple-400">💡</span>
            <span>Embed this timer on your blog or website. Free SEO backlink to your site!</span>
          </p>
        </div>
      )}
    </div>
  );
}

export default EmbedWidget;