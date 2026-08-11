// src/components/Viral/ShareButtons.jsx
import React from 'react';
import { FaWhatsapp, FaTwitter, FaFacebook, FaLink, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const ShareButtons = ({ url, title }) => {
  // ✅ Validate props
  const shareUrl = url || window.location.href;
  const shareTitle = title || 'Check out this countdown';

  const shareData = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`⏱️ ${shareTitle} - `)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this countdown: ${shareUrl}`)}`,
  };

  const handleShare = (platform) => {
    try {
      window.open(shareData[platform], '_blank', 'width=600,height=400,scrollbars=yes');
    } catch (error) {
      console.warn('Share error:', error);
      toast.error('Failed to share');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('✅ Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  // ✅ Share button config
  const buttons = [
    { 
      id: 'whatsapp', 
      icon: FaWhatsapp, 
      label: 'WhatsApp', 
      color: 'bg-green-600 hover:bg-green-700',
      activeColor: 'hover:shadow-lg hover:shadow-green-600/30'
    },
    { 
      id: 'twitter', 
      icon: FaTwitter, 
      label: 'Twitter', 
      color: 'bg-sky-600 hover:bg-sky-700',
      activeColor: 'hover:shadow-lg hover:shadow-sky-600/30'
    },
    { 
      id: 'facebook', 
      icon: FaFacebook, 
      label: 'Facebook', 
      color: 'bg-blue-700 hover:bg-blue-800',
      activeColor: 'hover:shadow-lg hover:shadow-blue-700/30'
    },
    { 
      id: 'linkedin', 
      icon: FaLink, 
      label: 'LinkedIn', 
      color: 'bg-blue-600 hover:bg-blue-700',
      activeColor: 'hover:shadow-lg hover:shadow-blue-600/30'
    },
  ];

  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {/* ✅ Share Buttons */}
      {buttons.map((btn) => {
        const Icon = btn.icon;
        return (
          <button
            key={btn.id}
            onClick={() => handleShare(btn.id)}
            className={`flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 text-white rounded-lg transition-all duration-300 text-[10px] sm:text-xs md:text-sm font-medium ${btn.color} ${btn.activeColor} hover:scale-105 active:scale-95`}
            aria-label={`Share on ${btn.label}`}
          >
            <Icon size={14} className="sm:w-[16px] sm:h-[16px]" />
            <span className="hidden xs:inline">{btn.label}</span>
          </button>
        );
      })}

      {/* ✅ Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg transition-all duration-300 text-[10px] sm:text-xs md:text-sm font-medium hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-white/10"
        aria-label="Copy link"
      >
        <FaCopy size={14} className="sm:w-[16px] sm:h-[16px]" />
        <span className="hidden xs:inline">Copy Link</span>
        <span className="xs:hidden">Copy</span>
      </button>
    </div>
  );
};

export default ShareButtons;