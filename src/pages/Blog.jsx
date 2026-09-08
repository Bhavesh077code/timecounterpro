// src/pages/Blog.jsx
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { blogPosts } from './BlogData';
import { FiClock, FiCalendar, FiArrowRight, FiSearch, FiTrendingUp } from 'react-icons/fi';

function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', ...new Set(blogPosts.map(p => p.category))];

  const filtered = useMemo(() => {
    return blogPosts.filter(p => {
      const cat = activeCategory === 'All' || p.category === activeCategory;
      const s = p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
      return cat && s;
    });
  }, [activeCategory, search]);

  const featured = activeCategory === 'All' && !search ? filtered.find(p => p.popular) : null;
  const rest = featured ? filtered.filter(p => p.id !== featured.id) : filtered;

  const getCatColor = (c) => {
    const m = {
      'Productivity': 'bg-violet-600 text-white',
      'Study Tips': 'bg-emerald-600 text-white',
      'Fitness': 'bg-rose-600 text-white',
      'Wellness': 'bg-teal-600 text-white',
      'Time Management': 'bg-amber-500 text-white',
    }
    return m[c] || 'bg-slate-800 text-white';
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      <div className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-12 w-full overflow-x-hidden">

        <div className="max-w-3xl mb-6 xs:mb-8 sm:mb-10">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Productivity that <span className="text-indigo-600">sticks.</span>
          </h1>
          <p className="text-slate-500 mt-2 xs:mt-3 sm:mt-4 text-sm xs:text-base">
            No fluff. Only proven timers, techniques and systems used by top 1% students & pros.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 xs:gap-4 justify-between items-start md:items-center bg-white border border-slate-200 p-2.5 xs:p-3  shadow-sm mb-6 xs:mb-8">
          <div className="flex gap-1.5 xs:gap-2 flex-wrap w-full md:w-auto">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded-full text-[10px] xs:text-xs font-bold transition-all border touch-manipulation active:scale-95 ${
                  activeCategory === cat 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Improved Search Bar - Mobile Friendly */}
          <div className="relative w-full md:w-64 flex-shrink-0">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <FiSearch size={16} className="xs:text-[18px]" />
            </div>
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Search articles..." 
              className="w-full pl-10 xs:pl-11 pr-3 xs:pr-4 py-2 xs:py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all touch-manipulation placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors touch-manipulation"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {featured && (
          <Link 
            to={`/blog/${featured.slug}`} 
            className="group grid grid-cols-1 md:grid-cols-2 bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 mb-5 xs:mb-6 touch-manipulation"
          >
            <div className="h-52 xs:h-64 md:h-full overflow-hidden relative">
              <img 
                src={featured.image} 
                alt={featured.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                loading="lazy"
              />
              <span className="absolute top-3 xs:top-4 left-3 xs:left-4 px-2.5 xs:px-3 py-1 rounded-full bg-white text-slate-900 text-[9px] xs:text-xs font-bold flex items-center gap-1 shadow">
                <FiTrendingUp size={12} className="xs:text-[14px]" /> FEATURED
              </span>
            </div>
            <div className="p-4 xs:p-6 sm:p-8 flex flex-col">
              <span className={`w-fit px-2.5 xs:px-3 py-1 rounded-full text-[9px] xs:text-xs font-bold tracking-widest ${getCatColor(featured.category)}`}>
                {featured.category.toUpperCase()}
              </span>
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-slate-900 mt-3 xs:mt-4 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                {featured.title}
              </h2>
              <p className="text-slate-500 mt-2 xs:mt-3 text-xs xs:text-sm leading-relaxed line-clamp-3">
                {featured.excerpt}
              </p>
              <div className="mt-auto pt-4 xs:pt-6 flex items-center gap-2 xs:gap-3 text-[10px] xs:text-xs text-slate-400 flex-wrap">
                <span className="flex items-center gap-1"><FiCalendar size={12} className="xs:text-[14px]" />{featured.date}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full hidden xs:block" />
                <span className="flex items-center gap-1"><FiClock size={12} className="xs:text-[14px]" />{featured.readTime}</span>
              </div>
            </div>
          </Link>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-5 sm:gap-6">
          {rest.map(post => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`} 
              className="group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 touch-manipulation"
            >
              <div className="h-44 xs:h-48 sm:h-52 md:h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  loading="lazy"
                />
              </div>
              <div className="p-4 xs:p-5 sm:p-6">
                <div className="flex items-center justify-between mb-2 xs:mb-3 flex-wrap gap-1.5">
                  <span className={`px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-full text-[8px] xs:text-[10px] font-bold ${getCatColor(post.category)}`}>
                    {post.category}
                  </span>
                  <span className="text-[9px] xs:text-xs text-slate-400 flex items-center gap-1">
                    <FiClock size={10} className="xs:text-[12px]" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-sm xs:text-base sm:text-lg leading-snug text-slate-900 group-hover:text-indigo-600 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-xs xs:text-sm mt-1.5 xs:mt-2 line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="mt-3 xs:mt-4 text-[10px] xs:text-xs font-bold text-slate-900 flex items-center gap-1">
                  READ ARTICLE <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={12} className="xs:text-[14px]" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {rest.length === 0 && (
          <div className="text-center py-8 xs:py-12">
            <p className="text-slate-500 text-sm xs:text-base">No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;