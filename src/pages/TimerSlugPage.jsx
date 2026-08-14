// src/pages/TimerSlugPage.jsx
/*
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import seoTimers from "../data/seoTimers";
import FullScreenTimer from "../components/FullScreenTimer";

const TimerSlugPage = () => {
  const { slug } = useParams();
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // ✅ Check for Pomodoro pattern first
    const pomodoroMatch = slug.match(/pomodoro-(\d+)-(\d+)/);
    if (pomodoroMatch) {
      const focus = parseInt(pomodoroMatch[1]) * 60;
      setTimer({
        slug: slug,
        title: `Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]}`,
        duration: focus,
        description: `Free Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]} timer for productivity. Perfect for focused work sessions.`,
        keywords: `pomodoro timer, focus timer, study timer, productivity timer`,
        category: "pomodoro",
      });
      setLoading(false);
      return;
    }

    // ✅ Find timer from SEO data
    const found = seoTimers.find((t) => t.slug === slug);

    if (!found && slug) {
      // ✅ Parse custom timers like "study-5-min"
      const durationMatch = slug.match(/(\d+)-min/);
      const durationMin = durationMatch ? parseInt(durationMatch[1]) : null;

      if (durationMin && durationMin > 0 && durationMin <= 120) {
        const title = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        setTimer({
          slug: slug,
          title: title,
          duration: durationMin * 60,
          description: `Free ${title} with sound and fullscreen. Start the countdown now!`,
          keywords: `${title}, timer, countdown, online timer`,
          isCustom: true,
        });
        setLoading(false);
        return;
      }

      setTimer(null);
      setLoading(false);
      return;
    }

    setTimer(found || null);
    setLoading(false);
  }, [slug]);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading timer...</p>
        </div>
      </div>
    );
  }

  // ✅ 404 Page - Mobile Responsive
  if (!timer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-8xl md:text-9xl font-bold text-purple-400 mb-4 animate-pulse">404</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Timer Not Found</h1>
          <p className="text-gray-400 text-sm md:text-base mb-6">
            The timer you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <span>🏠</span> Back to Home
          </Link>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500">5 Minute Timer</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500">10 Minute Timer</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500">Study Timer</span>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Timer Props for FullScreenTimer
  const timerProps = {
    id: timer.slug,
    name: timer.title,
    duration: timer.duration,
    remaining: timer.duration,
    type: "seo",
  };

  // ✅ Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: timer.title,
    description: timer.description,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    url: `https://timecounterpro.com/timer/${timer.slug}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // ✅ Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://timecounterpro.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Timers",
        item: "https://timecounterpro.com/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: timer.title,
        item: `https://timecounterpro.com/timer/${timer.slug}`,
      },
    ],
  };

  const canonicalUrl = `https://timecounterpro.com/timer/${timer.slug}`;

  return (
    <>
      <Helmet>
       
        <title>{`${timer.title} - Free Online Timer with Sound & Fullscreen | TimeCounterPro`}</title>
        <meta name="description" content={timer.description} />
        <meta name="keywords" content={timer.keywords} />
        <link rel="canonical" href={canonicalUrl} />
        
        
        <meta property="og:title" content={`${timer.title} - TimeCounterPro`} />
        <meta property="og:description" content={timer.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TimeCounterPro" />
        
       
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${timer.title} - TimeCounterPro`} />
        <meta name="twitter:description" content={timer.description} />
        
        
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-[#0a0a0a]">
        <FullScreenTimer timer={timerProps} onClose={() => {}} />
      </div>
    </>
  );
};

export default TimerSlugPage;

*/


// src/pages/TimerSlugPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import seoTimers from "../data/seoTimers";
import FullScreenTimer from "../components/FullScreenTimer";

const TimerSlugPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // ✅ Check for Pomodoro pattern first
    const pomodoroMatch = slug.match(/pomodoro-(\d+)-(\d+)/);
    if (pomodoroMatch) {
      const focus = parseInt(pomodoroMatch[1]) * 60;
      setTimer({
        slug: slug,
        title: `Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]}`,
        duration: focus,
        description: `Free Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]} timer for productivity. Perfect for focused work sessions.`,
        keywords: `pomodoro timer, focus timer, study timer, productivity timer`,
        category: "pomodoro",
      });
      setLoading(false);
      return;
    }

    // ✅ Find timer from SEO data
    const found = seoTimers.find((t) => t.slug === slug);

    if (!found && slug) {
      // ✅ Parse custom timers like "study-5-min"
      const durationMatch = slug.match(/(\d+)-min/);
      const durationMin = durationMatch ? parseInt(durationMatch[1]) : null;

      if (durationMin && durationMin > 0 && durationMin <= 120) {
        const title = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        setTimer({
          slug: slug,
          title: title,
          duration: durationMin * 60,
          description: `Free ${title} with sound and fullscreen. Start the countdown now!`,
          keywords: `${title}, timer, countdown, online timer`,
          isCustom: true,
        });
        setLoading(false);
        return;
      }

      setTimer(null);
      setLoading(false);
      return;
    }

    setTimer(found || null);
    setLoading(false);
  }, [slug]);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-400">Loading timer...</p>
        </div>
      </div>
    );
  }

  // ✅ 404 Page - Mobile Responsive
  if (!timer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-8xl md:text-9xl font-bold text-purple-400 mb-4 animate-pulse">404</div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">Timer Not Found</h1>
          <p className="text-gray-400 text-sm md:text-base mb-6">
            The timer you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
          >
            <span>🏠</span> Back to Home
          </Link>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500">5 Minute Timer</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500">10 Minute Timer</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-500">Study Timer</span>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Timer Props for FullScreenTimer
  const timerProps = {
    id: timer.slug,
    name: timer.title,
    duration: timer.duration,
    remaining: timer.duration,
    type: "seo",
  };

  // ✅ Schema Markup
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: timer.title,
    description: timer.description,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    image: "https://timecounterpro.com/time.png",
    applicationSubCategory: "Timer",
    url: `https://timecounterpro.com/timer/${timer.slug}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  // ✅ Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://timecounterpro.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Timers",
        item: "https://timecounterpro.com/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: timer.title,
        item: `https://timecounterpro.com/timer/${timer.slug}`,
      },
    ],
  };

  const canonicalUrl = `https://timecounterpro.com/timer/${timer.slug}`;

  return (
    <>
      <Helmet>
        {/* ✅ Primary Meta Tags */}
        <title>{`${timer.title} - Free Online Timer with Sound & Fullscreen | TimeCounterPro`}</title>
        <meta name="description" content={timer.description} />
        <meta name="keywords" content={timer.keywords} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* ✅ Open Graph */}
        <meta property="og:title" content={`${timer.title} - TimeCounterPro`} />
        <meta property="og:description" content={timer.description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TimeCounterPro" />
        
        {/* ✅ Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${timer.title} - TimeCounterPro`} />
        <meta name="twitter:description" content={timer.description} />
        
        {/* ✅ Schema */}
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-[#0a0a0a]">
        <FullScreenTimer timer={timerProps} onClose={() => navigate("/")} />
      </div>
    </>
  );
};

export default TimerSlugPage;