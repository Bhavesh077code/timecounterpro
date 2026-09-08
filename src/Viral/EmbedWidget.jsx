// src/components/Viral/EmbedWidget.jsx
import React, { useState } from 'react';
import { FiCode, FiCopy, FiChevronDown, FiChevronUp, FiCheck, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

function EmbedWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(400);
  const [showBorder, setShowBorder] = useState(true);
  const [copied, setCopied] = useState(false);

  const embedURL = `${window.location.origin}?view=embed`;

  const generateIframeCode = () => {
    const borderStyle = showBorder ? 'border:1px solid #e2e8f0;' : 'border:none;';
    return `<iframe src="${embedURL}" width="${width}" height="${height}" style="${borderStyle} border-radius:12px; background:#f8fafc;" allowfullscreen loading="lazy"></iframe>`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateIframeCode());
      setCopied(true);
      toast.success('Embed code copied successfully');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 md:p-6 mt-4 sm:mt-5 md:mt-6 animate-fade-in">
      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-slate-900 font-semibold group hover:text-indigo-700 transition-colors"
        aria-expanded={isOpen}
        aria-controls="embed-content"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <FiCode size={16} className="sm:w-[18px] sm:h-[18px]" />
          </div>
          <span className="text-sm sm:text-base font-medium">Embed Timer Widget</span>
          <span className="text-[8px] sm:text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-medium">
            Free Backlink
          </span>
        </div>
        <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
          {isOpen ? <FiChevronUp size={18} className="sm:w-[20px] sm:h-[20px]" /> : <FiChevronDown size={18} className="sm:w-[20px] sm:h-[20px]" />}
        </span>
      </button>

      {/* Content */}
      {isOpen && (
        <div id="embed-content" className="mt-4 sm:mt-5 space-y-4 sm:space-y-5 animate-fade-in">
          {/* Controls Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label htmlFor="embed-width" className="block text-slate-600 text-xs font-medium mb-1.5">
                Width (px)
              </label>
              <input 
                id="embed-width"
                type="number" 
                value={width} 
                onChange={(e) => setWidth(Math.max(100, Number(e.target.value) || 100))} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                min="100"
                max="2000"
                aria-label="Widget width in pixels"
              />
            </div>
            <div>
              <label htmlFor="embed-height" className="block text-slate-600 text-xs font-medium mb-1.5">
                Height (px)
              </label>
              <input 
                id="embed-height"
                type="number" 
                value={height} 
                onChange={(e) => setHeight(Math.max(100, Number(e.target.value) || 100))} 
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                min="100"
                max="2000"
                aria-label="Widget height in pixels"
              />
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <input 
                id="embed-border"
                type="checkbox" 
                checked={showBorder} 
                onChange={(e) => setShowBorder(e.target.checked)} 
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 focus:ring-2 cursor-pointer" 
                aria-label="Toggle border visibility"
              />
              <label htmlFor="embed-border" className="text-slate-600 text-sm cursor-pointer select-none">
                Show Border
              </label>
            </div>
          </div>

          {/* Code Output */}
          <div className="relative">
            <label className="block text-slate-600 text-xs font-medium mb-1.5">
              Embed Code
            </label>
            <div className="relative">
              <textarea 
                value={generateIframeCode()} 
                readOnly 
                rows={3} 
                className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-mono focus:outline-none resize-none overflow-x-auto"
                aria-label="Embed code for the timer widget"
                spellCheck="false"
              />
              <button 
                onClick={handleCopy} 
                className="absolute top-2 right-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                aria-label={copied ? 'Copied successfully' : 'Copy embed code'}
              >
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
              </button>
            </div>
          </div>

          {/* Features & Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex-shrink-0 mt-0.5 text-indigo-600">
                <FiExternalLink size={14} />
              </div>
              <div>
                <h4 className="text-slate-700 text-xs font-medium">Free Backlink</h4>
                <p className="text-slate-500 text-[10px]">Get a free SEO backlink to your website</p>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex-shrink-0 mt-0.5 text-indigo-600">
                <FiCode size={14} />
              </div>
              <div>
                <h4 className="text-slate-700 text-xs font-medium">Easy Integration</h4>
                <p className="text-slate-500 text-[10px]">Copy and paste, works on any website</p>
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="flex items-start gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
            <span className="text-indigo-600 text-sm flex-shrink-0">ℹ️</span>
            <p className="text-xs text-indigo-700 leading-relaxed">
              Add this timer to your blog or website. The embed is responsive and works on all devices. 
              Includes a free backlink to help with your SEO rankings.
            </p>
          </div>

          {/* AdSense Notice - Professional */}
          <div className="text-center text-[9px] text-slate-400 border-t border-slate-200 pt-3 mt-2">
            This widget is provided free of charge. Backlink attribution is required.
          </div>
        </div>
      )}
    </div>
  );
}

export default EmbedWidget;