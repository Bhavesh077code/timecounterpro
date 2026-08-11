// src/components/StickerVault.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STICKERS = [
  { id: 1, category: 'ecommerce', title: 'Hot Deal', desc: 'Save 50% Today', icon: '🔥', color: '#ff6b6b', badge: 'Sale' },
  { id: 2, category: 'ecommerce', title: 'Pro Member', desc: 'Exclusive VIP Access', icon: '👑', color: '#ffd700', badge: 'VIP' },
  { id: 3, category: 'ecommerce', title: 'Free Shipping', desc: 'Orders Over $50', icon: '🚚', color: '#1abc9c', badge: 'Offer' },
  { id: 4, category: 'ecommerce', title: 'Money Back', desc: '30-Day Guarantee', icon: '💰', color: '#2ed573', badge: 'Safe' },
  { id: 5, category: 'pets', title: 'Purr Approved', desc: 'Cats Love This Item', icon: '🐾', color: '#ff9ff3', badge: 'Best' },
  { id: 6, category: 'pets', title: '100% Catnip', desc: 'Pure & Organic', icon: '🌿', color: '#10ac84', badge: 'Eco' },
  { id: 7, category: 'pets', title: 'Claw Proof', desc: 'Scratch Resistant', icon: '🐱', color: '#ff6b81', badge: 'Tough' },
  { id: 8, category: 'pets', title: 'Vet Checked', desc: 'Recommended by Vets', icon: '🩺', color: '#1dd1a1', badge: 'Trust' },
  { id: 9, category: 'apps', title: 'AI Powered', desc: 'Smart Automation', icon: '🤖', color: '#c084fc', badge: 'New' },
  { id: 10, category: 'apps', title: 'No Ads Inside', desc: 'Distraction Free', icon: '🚫', color: '#2ed573', badge: 'Clean' },
  { id: 11, category: 'apps', title: 'Offline Play', desc: 'No Wifi Needed', icon: '✈️', color: '#70a1ff', badge: 'App' },
  { id: 12, category: 'apps', title: '60 FPS Smooth', desc: 'Lag-Free Performance', icon: '⚡', color: '#ff4757', badge: 'Fast' },
  { id: 13, category: 'toys', title: 'Non-Toxic', desc: '100% Safe Material', icon: '🧸', color: '#ff9f43', badge: 'Kids' },
  { id: 14, category: 'toys', title: 'BPA Free', desc: 'Child & Pet Safe', icon: '🌱', color: '#54a0ff', badge: 'Safe' },
  { id: 15, category: 'toys', title: 'Fun Guaranteed', desc: 'Hours of Playtime', icon: '🎉', color: '#feca57', badge: 'Top' },
  { id: 16, category: 'toys', title: 'Extra Durable', desc: 'Unbreakable Material', icon: '🔨', color: '#ff7675', badge: 'Tough' },
  { id: 17, category: 'ecommerce', title: 'Flash Sale', desc: 'Limited Time Only', icon: '⚡', color: '#ff4757', badge: 'Flash' },
  { id: 18, category: 'pets', title: 'Dog Approved', desc: 'Puppy Love Guaranteed', icon: '🐶', color: '#ffa502', badge: 'Best' },
  { id: 19, category: 'apps', title: 'Cloud Sync', desc: 'Real-Time Backup', icon: '☁️', color: '#70a1ff', badge: 'Sync' },
  { id: 20, category: 'toys', title: 'STEM Toy', desc: 'Educational & Fun', icon: '🧪', color: '#1dd1a1', badge: 'STEM' },
];

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'ecommerce', label: '🛍️ E-Commerce' },
  { id: 'pets', label: '🐾 Pets & Cats' },
  { id: 'apps', label: '📱 Apps & Tech' },
  { id: 'toys', label: '🧸 Toys & Fun' },
];

function StickerVault({ onClose }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSticker, setSelectedSticker] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredStickers = useMemo(() => {
    let result = STICKERS;
    if (activeFilter !== 'all') {
      result = result.filter(s => s.category === activeFilter);
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(s =>
        s.title.toLowerCase().includes(term) ||
        s.desc.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term)
      );
    }
    return result;
  }, [activeFilter, searchTerm]);

  const getCategoryCount = (categoryId) => {
    if (categoryId === 'all') return STICKERS.length;
    return STICKERS.filter(s => s.category === categoryId).length;
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#090d16] overflow-y-auto">
      {/* Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-56 sm:w-72 md:w-96 h-56 sm:h-72 md:h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
        
        {/* ✅ Header - TimeCounterPro */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-base sm:text-xl shadow-lg shadow-purple-500/25">
              ⏱️
            </div>
            <div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                <span className="md:hidden">TCPro</span>
                <span className="hidden md:inline">TimeCounterPro</span>
              </h1>
              <p className="text-[8px] sm:text-[10px] text-gray-400 tracking-wider hidden xs:block">
                PROFESSIONAL TIMER
              </p>
            </div>
          </Link>
          
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-300 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm hover:scale-105 active:scale-95"
          >
            <span>✕</span>
            <span className="hidden xs:inline">Close</span>
          </button>
        </div>

        {/* Hero Section */}
        <section className="text-center py-4 sm:py-5 md:py-6 px-2 sm:px-4 max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-1 sm:mb-2">
            ✨ Premium Sticker Collection
          </h1>
          <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm">
            Discover & collect premium UI badges, stickers, tags & labels for your projects.
          </p>
        </section>

        {/* Search */}
        <div className="relative w-full max-w-xs mx-auto mb-3 sm:mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search stickers..."
            className="w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[10px] sm:text-xs">🔍</span>
        </div>

        {/* Categories with Count */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 px-1 sm:px-4 mb-4 sm:mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition-all duration-300 ${
                activeFilter === cat.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat.label}
              <span className="ml-1 text-[8px] sm:text-[10px] opacity-60">({getCategoryCount(cat.id)})</span>
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center text-[10px] sm:text-xs text-gray-500 mb-3 sm:mb-4">
          Showing {filteredStickers.length} of {STICKERS.length} stickers
        </div>

        {/* Stickers Grid */}
        {filteredStickers.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl text-white font-bold mb-1 sm:mb-2">No Stickers Found</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Try a different search term or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4 max-w-6xl mx-auto px-1 sm:px-2 pb-6 sm:pb-8 w-full">
            {filteredStickers.map((sticker) => (
              <div
                key={sticker.id}
                className="relative bg-white/5 backdrop-blur-lg border rounded-xl p-3 sm:p-4 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/30 hover:shadow-xl hover:shadow-purple-500/10 active:scale-95 cursor-pointer"
                style={{ borderColor: `${sticker.color}80` }}
                onClick={() => setSelectedSticker(sticker)}
              >
                <span
                  className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 text-[7px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider"
                  style={{ background: `${sticker.color}33`, color: sticker.color, border: `1px solid ${sticker.color}80` }}
                >
                  {sticker.badge}
                </span>
                
                <div className="mt-3 sm:mt-4 flex flex-col items-center">
                  <div className="text-2xl sm:text-3xl md:text-4xl mb-0.5 sm:mb-1 drop-shadow-lg">
                    {sticker.icon}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold" style={{ color: sticker.color }}>
                    {sticker.title}
                  </h3>
                  <p className="text-gray-400 text-[8px] sm:text-xs mt-0.5 sm:mt-1 truncate max-w-full">
                    {sticker.desc}
                  </p>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSticker(sticker);
                  }}
                  className="w-full mt-2 sm:mt-3 py-1.5 sm:py-2 rounded-lg bg-white/10 hover:bg-purple-600 text-white text-[10px] sm:text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 active:scale-95"
                >
                  Preview
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Footer - TimeCounterPro */}
        <footer className="text-center py-3 sm:py-4 border-t border-white/5 text-gray-500 text-[10px] sm:text-xs">
          <span>⏱️ TimeCounterPro</span>
          <span className="mx-1">•</span>
          <span>Premium Sticker Collection</span>
          <div className="mt-1">
            © {new Date().getFullYear()} TimeCounterPro. All rights reserved.
          </div>
        </footer>
      </div>

      {/* Modal */}
      {selectedSticker && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-[1000] p-3 sm:p-4 animate-fade-in"
          onClick={() => setSelectedSticker(null)}
        >
          <div
            className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 md:p-6 max-w-xs sm:max-w-sm w-full text-center relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedSticker(null)}
              className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-400 hover:text-white text-xl sm:text-2xl transition-colors"
            >
              &times;
            </button>
            
            <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-3">{selectedSticker.icon}</div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1" style={{ color: selectedSticker.color }}>
              {selectedSticker.title}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4">{selectedSticker.desc}</p>
            
            <div className="bg-black rounded-lg p-2 sm:p-3 text-left font-mono text-[10px] sm:text-xs text-purple-300 overflow-x-auto mb-3 sm:mb-4">
              &lt;div className="sticker" style="border-color: {selectedSticker.color}"&gt;<br />
              &nbsp;&nbsp;&lt;span&gt;{selectedSticker.icon}&lt;/span&gt;<br />
              &nbsp;&nbsp;&lt;h3&gt;{selectedSticker.title}&lt;/h3&gt;<br />
              &lt;/div&gt;
            </div>
            
            <button
              onClick={() => setSelectedSticker(null)}
              className="w-full py-2 sm:py-2.5 rounded-lg font-bold transition-all text-sm sm:text-base hover:scale-105 active:scale-95"
              style={{ background: selectedSticker.color, color: '#000' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StickerVault;