// src/pages/BlogPost.jsx - Title Bada + Italic (Mobile Responsive)
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from './BlogData';
import { FiArrowLeft, FiCalendar, FiClock, FiTwitter, FiFacebook, FiLink, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

function slugify(text){ return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window!== 'undefined'? window.location.href : `https://timecounterpro.com/blog/${post?.slug}`;

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h>0? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { contentWithIds } = useMemo(() => {
    if(!post) return { contentWithIds: '' };
    const newContent = post.content.replace(/<h2>(.*?)<\/h2>/g, (m, title) => {
      const id = slugify(title.replace(/<[^>]*>/g, ''));
      return `<h2 id="${id}">${title}</h2>`;
    });
    return { contentWithIds: newContent };
  }, [post]);

  if (!post) return <div className="min-h-screen grid place-items-center px-4 text-center">Post not found</div>;

  const handleShare = (platform) => {
    const links = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    };
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true); toast.success('Link copied!'); setTimeout(()=>setCopied(false),2000);
      return;
    }
    window.open(links[platform], '_blank', 'width=600,height=500');
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | TimeCounterPro Blog</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://timecounterpro.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:url" content={`https://timecounterpro.com/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={post.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
      </Helmet>

      <style>{`
        /* Mobile-first responsive blog styles */
        .blog-content h2 {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.2;
          color: #0f172a;
          margin-top: 40px;
          margin-bottom: 14px;
          letter-spacing: -0.02em;
          word-break: break-word;
        }
        
        .blog-content p {
          font-size: 15px;
          line-height: 1.8;
          color: #475569;
          margin-bottom: 18px;
          word-break: break-word;
        }
        
        .blog-content p strong {
          color: #0f172a;
          font-weight: 700;
        }
        
        .blog-content a {
          color: #4f46e5;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
          word-break: break-word;
        }
        
        .blog-content blockquote {
          border-left: 4px solid #6366f1;
          background: #f8fafc;
          padding: 16px 18px;
          margin: 28px 0;
          border-radius: 0 16px 16px 0;
          font-style: italic;
          color: #334155;
          font-size: 16px;
          word-break: break-word;
        }
        
        .blog-content ol {
          list-style: none;
          counter-reset: my-counter;
          padding: 0;
          margin: 20px 0;
        }
        
        .blog-content ol li {
          counter-increment: my-counter;
          position: relative;
          padding-left: 44px;
          margin-bottom: 16px;
          font-size: 15px;
          line-height: 1.7;
          color: #475569;
          word-break: break-word;
        }
        
        .blog-content ol li::before {
          content: counter(my-counter);
          position: absolute;
          left: 0;
          top: 0;
          width: 32px;
          height: 32px;
          background: #0f172a;
          color: white;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-weight: 800;
          font-size: 13px;
          flex-shrink: 0;
        }
        
        .blog-content ul li {
          position: relative;
          padding-left: 28px;
          margin-bottom: 12px;
          word-break: break-word;
        }
        
        .blog-content ul li::before {
          content: "•";
          position: absolute;
          left: 8px;
          top: 0;
          font-size: 20px;
          color: #6366f1;
          font-weight: bold;
        }
        
        .blog-content img {
          width: 100%;
          border-radius: 16px;
          margin: 28px 0;
          border: 1px solid #e2e8f0;
          height: auto;
        }

        /* Responsive adjustments */
        @media (min-width: 640px) {
          .blog-content h2 {
            font-size: 26px;
            margin-top: 48px;
            margin-bottom: 16px;
          }
          .blog-content p {
            font-size: 17px;
            margin-bottom: 22px;
          }
          .blog-content blockquote {
            padding: 18px 24px;
            font-size: 18px;
          }
          .blog-content ol li {
            padding-left: 52px;
            font-size: 16px;
          }
          .blog-content ol li::before {
            width: 36px;
            height: 36px;
            font-size: 14px;
          }
          .blog-content img {
            border-radius: 20px;
            margin: 36px 0;
          }
        }

        @media (min-width: 768px) {
          .blog-content h2 {
            font-size: 28px;
          }
        }
      `}</style>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-slate-100 z-[100]">
        <div className="h-full bg-slate-900 transition-all duration-200" style={{width: `${progress}%`}} />
      </div>

      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 xs:px-5 sm:px-6 py-6 xs:py-8 sm:py-10 w-full overflow-x-hidden">
          
          

          {/* Meta Info */}
          <div className="mb-4 xs:mb-5 sm:mb-6 flex flex-wrap items-center gap-2 xs:gap-3 text-[10px] xs:text-xs text-slate-500">
            <span className="px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full bg-slate-900 text-white font-bold text-[9px] xs:text-[10px]">
              {post.category.toUpperCase()}
            </span>
            <span className="flex items-center gap-1">
              <FiCalendar size={11} className="xs:text-[12px]" />
              {post.date}
            </span>
            <span className="w-1 h-1 bg-slate-300 rounded-full hidden xs:block" />
            <span className="flex items-center gap-1">
              <FiClock size={11} className="xs:text-[12px]" />
              {post.readTime}
            </span>
          </div>

          {/* BIG + ITALIC TITLE - Responsive */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black leading-[0.95] tracking-tighter text-slate-900 italic font-serif break-words">
            {post.title}
          </h1>

          {/* Excerpt - Responsive */}
          <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-slate-500 leading-relaxed mt-4 xs:mt-5 sm:mt-6 italic break-words">
            {post.excerpt}
          </p>

          {/* Featured Image - Responsive */}
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-auto max-h-[300px] xs:max-h-[400px] sm:max-h-[500px] object-cover rounded-xl xs:rounded-2xl mt-6 xs:mt-7 sm:mt-8 border border-slate-200" 
            loading="lazy"
          />

          {/* Blog Content */}
          <div className="blog-content mt-8 xs:mt-9 sm:mt-10" dangerouslySetInnerHTML={{__html: contentWithIds}} />

          {/* Share Buttons - Responsive */}
          <div className="mt-10 xs:mt-11 sm:mt-12 flex flex-wrap gap-2 xs:gap-3">
            <button 
              onClick={() => handleShare('twitter')} 
              className="w-9 h-9 xs:w-10 xs:h-10 grid place-items-center rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors touch-manipulation active:scale-95"
              aria-label="Share on Twitter"
            >
              <FiTwitter size={16} className="xs:text-[18px]" />
            </button>
            <button 
              onClick={() => handleShare('facebook')} 
              className="w-9 h-9 xs:w-10 xs:h-10 grid place-items-center rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors touch-manipulation active:scale-95"
              aria-label="Share on Facebook"
            >
              <FiFacebook size={16} className="xs:text-[18px]" />
            </button>
            <button 
              onClick={() => handleShare('copy')} 
              className="w-9 h-9 xs:w-10 xs:h-10 grid place-items-center rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors touch-manipulation active:scale-95"
              aria-label="Copy link"
            >
              {copied ? <FiCheckCircle size={16} className="xs:text-[18px]" /> : <FiLink size={16} className="xs:text-[18px]" />}
            </button>
            
            {/* Share label - hidden on mobile, visible on larger screens */}
            <span className="hidden sm:flex items-center text-sm text-slate-400 ml-2">
              Share this article
            </span>
          </div>

          {/* Divider */}
          <div className="mt-8 xs:mt-10 sm:mt-12 pt-6 xs:pt-8 sm:pt-10 border-t border-slate-200">
            <Link 
              to="/blog" 
              className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors touch-manipulation"
            >
              <FiArrowLeft size={16} />
              Back to all articles
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}