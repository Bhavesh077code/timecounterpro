import React from 'react';
import { FaWhatsapp, FaTwitter, FaFacebook, FaLink } from 'react-icons/fa';

export const ShareButtons = ({ url, title }) => {
  const shareData = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`Check out this countdown: ${title || ''} ${url}`)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`⏱️ ${title || 'Countdown'} - `)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const handleShare = (platform) => {
    window.open(shareData[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => handleShare('whatsapp')} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 text-sm">
        <FaWhatsapp size={16} /> WhatsApp
      </button>
      <button onClick={() => handleShare('twitter')} className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 text-sm">
        <FaTwitter size={16} /> Twitter
      </button>
      <button onClick={() => handleShare('facebook')} className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-all duration-300 flex items-center gap-2 text-sm">
        <FaFacebook size={16} /> Facebook
      </button>
    </div>
  );
};