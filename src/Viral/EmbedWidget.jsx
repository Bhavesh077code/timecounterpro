import React, { useState } from 'react';
import { FiCode, FiCopy, FiChevronDown, FiChevronUp } from 'react-icons/fi';
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
    <div className="glass rounded-2xl p-6 mt-6 animate-fade-in">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full text-white font-semibold">
        <div className="flex items-center gap-2">
          <FiCode size={20} />
          <span>Embed This Timer Widget</span>
          <span className="text-xs text-purple-400 ml-2">⬇️ Free Backlink</span>
        </div>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-gray-400 text-xs">Width (px)</label>
              <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div>
              <label className="text-gray-400 text-xs">Height (px)</label>
              <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={showBorder} onChange={(e) => setShowBorder(e.target.checked)} className="w-4 h-4 accent-purple-500" />
              <label className="text-gray-400 text-xs">Show Border</label>
            </div>
          </div>

          <div className="relative">
            <textarea value={generateIframeCode()} readOnly rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-300 text-xs font-mono focus:outline-none resize-none" />
            <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-all">
              <FiCopy size={14} className="text-white" />
            </button>
          </div>

          <p className="text-xs text-gray-500">💡 Embed this timer on your blog or website. Free SEO backlink to your site!</p>
        </div>
      )}
    </div>
  );
}

export default EmbedWidget;