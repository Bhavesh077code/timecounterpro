// src/pages/BlogPost.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from './BlogData';

function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  // ✅ If post not found
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
        <Navbar />
        <div className="relative z-10 text-center py-20 px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Post Not Found</h1>
          <p className="text-gray-400 mt-2">The blog post you're looking for doesn't exist.</p>
          <Link to="/blog" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Schema Markup for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "TimerPro"
    }
  };

  return (
    <>
      {/* ✅ SEO Meta Tags */}
      <Helmet>
        <title>{`${post.title} - TimerPro Blog`}</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={`${post.title} - TimerPro Blog`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
        
        {/* ✅ Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>


        <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-12">
          
          {/* ✅ Back Button - Mobile Optimized */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-1.5 sm:gap-2 text-gray-400 hover:text-white transition-colors mb-4 sm:mb-6 group"
          >
            <span className="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-sm sm:text-base">Back to Blog</span>
          </Link>

          {/* ✅ Post Header - Mobile Optimized */}
          <div className="mb-6 sm:mb-8">
            {/* Image/Icon */}
            <div className="text-5xl sm:text-6xl md:text-7xl mb-3 sm:mb-4">{post.image}</div>
            
            {/* Category Badge */}
            <span className="text-[10px] sm:text-xs text-purple-400 bg-purple-500/20 px-2 sm:px-3 py-1 rounded-full inline-block">
              {post.category}
            </span>
            
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-2 sm:mt-3 leading-tight">
              {post.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
              <span className="flex items-center gap-1">📅 {post.date}</span>
              <span className="w-px h-4 bg-gray-700 hidden xs:block"></span>
              <span className="flex items-center gap-1">⏱️ {post.readTime}</span>
              <span className="w-px h-4 bg-gray-700 hidden sm:block"></span>
              <span className="flex items-center gap-1">📂 {post.category}</span>
            </div>
          </div>

          {/* ✅ Post Content - Mobile Optimized */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
            <div 
              className="text-gray-300 text-sm sm:text-base leading-relaxed prose prose-invert max-w-none prose-headings:text-white prose-headings:font-bold prose-h2:text-xl sm:prose-h2:text-2xl prose-h3:text-lg sm:prose-h3:text-xl prose-ul:list-disc prose-ul:pl-4 sm:prose-ul:pl-6 prose-li:mb-1 prose-p:mb-3 prose-a:text-purple-400 hover:prose-a:text-pink-400 prose-a:underline prose-strong:text-white"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* ✅ Tags - Mobile Optimized */}
          <div className="mt-4 sm:mt-6 flex flex-wrap gap-1.5 sm:gap-2">
            {post.tags.map((tag) => (
              <Link 
                key={tag} 
                to={`/blog?tag=${tag}`}
                className="px-2 sm:px-3 py-0.5 sm:py-1 bg-white/5 border border-white/10 rounded-full text-[8px] sm:text-[10px] md:text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>

          {/* ✅ Related Posts Suggestion - Optional */}
          <div className="mt-6 sm:mt-8">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">📚 You Might Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {blogPosts
                .filter(p => p.id !== post.id && p.category === post.category)
                .slice(0, 2)
                .map((related) => (
                  <Link 
                    key={related.id} 
                    to={`/blog/${related.slug}`}
                    className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:border-purple-500/30 transition-all group"
                  >
                    <div className="text-2xl sm:text-3xl mb-1">{related.image}</div>
                    <h4 className="text-white text-sm sm:text-base font-semibold group-hover:text-purple-400 transition-colors">
                      {related.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-0.5 line-clamp-2">{related.excerpt}</p>
                  </Link>
                ))}
            </div>
          </div>

          {/* ✅ Call to Action - Mobile Optimized */}
          <div className="mt-6 sm:mt-8 text-center bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-white font-bold text-base sm:text-lg">⏱️ Try Our Free Timer</h3>
            <p className="text-gray-400 text-sm sm:text-base mt-1 sm:mt-2">
              Start using our free online timer with sound and fullscreen.
            </p>
            <Link to="/">
              <button className="mt-3 sm:mt-4 px-5 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 transition-all text-sm sm:text-base">
                🚀 Go to Timer
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPost;