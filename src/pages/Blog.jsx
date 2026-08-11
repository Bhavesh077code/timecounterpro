// src/pages/Blog.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from './BlogData';

function Blog() {
  // ✅ Categories
  const categories = ['All', ...new Set(blogPosts.map(post => post.category))];
  const [activeCategory, setActiveCategory] = useState('All');

  // ✅ Filter posts by category
  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a]">
      
      {/* ✅ Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        
        {/* ✅ Header - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="inline-block p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl sm:rounded-3xl shadow-2xl shadow-purple-500/25 mb-3 sm:mb-4">
            <span className="text-3xl sm:text-4xl md:text-5xl">📝</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            TimerCounterPro Blog
          </h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg mt-1 sm:mt-2 max-w-2xl mx-auto">
            Learn about timers, productivity, study techniques & more
          </p>
        </div>

        {/* ✅ Category Filters - Mobile Responsive */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ✅ Blog Grid - Mobile Responsive */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 sm:py-16">
            <div className="text-5xl sm:text-6xl mb-4">📭</div>
            <h3 className="text-xl sm:text-2xl text-white font-bold mb-2">No Posts Found</h3>
            <p className="text-gray-400 text-sm sm:text-base">Try selecting a different category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {filteredPosts.map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.id}>
                <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/30 h-full flex flex-col">
                  
                  {/* Image/Icon - Responsive */}
                  <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">{post.image}</div>
                  
                  {/* Category Badge - Responsive */}
                  <span className="self-start text-[8px] sm:text-[10px] md:text-xs text-purple-400 bg-purple-500/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                    {post.category}
                  </span>
                  
                  {/* Title - Responsive */}
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-white mt-2 sm:mt-3 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  {/* Excerpt - Responsive */}
                  <p className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2 line-clamp-2 flex-1">
                    {post.excerpt}
                  </p>
                  
                  {/* Meta Info - Responsive */}
                  <div className="flex items-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500 pt-3 sm:pt-4 border-t border-white/5">
                    <span className="flex items-center gap-1">📅 {post.date}</span>
                    <span className="flex items-center gap-1">⏱️ {post.readTime}</span>
                  </div>
                  
                  {/* Read More - Responsive */}
                  <div className="mt-3 sm:mt-4 text-purple-400 text-xs sm:text-sm font-medium group-hover:text-pink-400 transition-colors flex items-center gap-1">
                    Read More <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ✅ Post Count */}
        <div className="mt-6 sm:mt-8 text-center text-[10px] sm:text-xs text-gray-500">
          Showing {filteredPosts.length} of {blogPosts.length} posts
          {activeCategory !== 'All' && ` in "${activeCategory}"`}
        </div>
      </div>
    </div>
  );
}

export default Blog;