// src/components/Viral/ShareButtons.jsx
import React from 'react';
import { FaWhatsapp, FaTwitter, FaFacebook, FaLinkedin, FaLink, FaCopy } from 'react-icons/fa';
import toast from 'react-hot-toast';

export const ShareButtons = ({ url, title }) => {
  // Validate props
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareTitle = title || 'Check out this countdown timer';

  const shareData = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareTitle} ${shareUrl}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${shareTitle} - `)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this countdown timer: ${shareUrl}`)}`,
  };

  const handleShare = (platform) => {
    try {
      window.open(shareData[platform], '_blank', 'width=600,height=400,scrollbars=yes,noopener,noreferrer');
    } catch (error) {
      console.warn('Share error:', error);
      toast.error('Unable to share');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    } catch (error) {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        toast.success('Link copied to clipboard');
      } catch {
        toast.error('Unable to copy link');
      }
    }
  };

  // Share button configuration with professional colors
  const buttons = [
    { 
      id: 'whatsapp', 
      icon: FaWhatsapp, 
      label: 'WhatsApp', 
      color: 'bg-emerald-600 hover:bg-emerald-700',
      activeColor: 'hover:shadow-md hover:shadow-emerald-600/25'
    },
    { 
      id: 'twitter', 
      icon: FaTwitter, 
      label: 'Twitter', 
      color: 'bg-sky-500 hover:bg-sky-600',
      activeColor: 'hover:shadow-md hover:shadow-sky-500/25'
    },
    { 
      id: 'facebook', 
      icon: FaFacebook, 
      label: 'Facebook', 
      color: 'bg-blue-700 hover:bg-blue-800',
      activeColor: 'hover:shadow-md hover:shadow-blue-700/25'
    },
    { 
      id: 'linkedin', 
      icon: FaLinkedin, 
      label: 'LinkedIn', 
      color: 'bg-blue-600 hover:bg-blue-700',
      activeColor: 'hover:shadow-md hover:shadow-blue-600/25'
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Share Buttons */}
      {buttons.map((btn) => {
        const Icon = btn.icon;
        return (
          <button
            key={btn.id}
            onClick={() => handleShare(btn.id)}
            className={`flex items-center gap-1.5 px-3 py-2 text-white rounded-lg transition-all duration-200 text-xs font-medium ${btn.color} ${btn.activeColor} hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-${btn.id === 'whatsapp' ? 'emerald' : btn.id === 'twitter' ? 'sky' : 'blue'}-500`}
            aria-label={`Share on ${btn.label}`}
            title={`Share on ${btn.label}`}
          >
            <Icon size={14} className="flex-shrink-0" />
            <span className="hidden sm:inline">{btn.label}</span>
          </button>
        );
      })}

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200 text-xs font-medium hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
        aria-label="Copy link to clipboard"
        title="Copy link"
      >
        <FaCopy size={14} className="flex-shrink-0" />
        <span className="hidden sm:inline">Copy Link</span>
        <span className="sm:hidden">Copy</span>
      </button>

      {/* Direct Link Button */}
      <button
        onClick={() => {
          try {
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
          } catch {
            toast.error('Unable to open link');
          }
        }}
        className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all duration-200 text-xs font-medium hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white"
        aria-label="Open link"
        title="Open link"
      >
        <FaLink size={14} className="flex-shrink-0" />
        <span className="hidden sm:inline">Open Link</span>
        <span className="sm:hidden">Open</span>
      </button>
    </div>
  );
};

export default ShareButtons;