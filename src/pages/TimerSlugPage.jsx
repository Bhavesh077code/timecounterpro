/*
// src/pages/TimerSlugPage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import seoTimers from "../data/seoTimers";
import FullScreenTimer from "../components/FullScreenTimer";
import { TimerContext } from "../context/TimerContext";

const TimerSlugPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { activeTimers, addTimer, removeTimer } = useContext(TimerContext);

  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const createdRef = useRef(false);
  const timerKeyRef = useRef(null);

  // IMPORTANT: every hook is above every conditional return.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const pomodoroMatch = slug?.match(/pomodoro-(\d+)-(\d+)/);

    if (pomodoroMatch) {
      const focus = parseInt(pomodoroMatch[1], 10) * 60;
      if (!cancelled) {
        setTimer({
          slug,
          title: `Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]}`,
          duration: focus,
          description: `Free Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]} timer for productivity. Perfect for focused work sessions.`,
          keywords: "pomodoro timer, focus timer, study timer, productivity timer",
          category: "pomodoro",
        });
        setLoading(false);
      }
      return () => {
        cancelled = true;
      };
    }

    const found = seoTimers.find((item) => item.slug === slug);

    if (!found && slug) {
      const durationMatch = slug.match(/(\d+)-min/);
      const durationMin = durationMatch ? parseInt(durationMatch[1], 10) : null;

      if (durationMin && durationMin > 0 && durationMin <= 120) {
        const title = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        if (!cancelled) {
          setTimer({
            slug,
            title,
            duration: durationMin * 60,
            description: `Free ${title} with sound and fullscreen. Start the countdown now!`,
            keywords: `${title}, timer, countdown, online timer`,
            isCustom: true,
          });
          setLoading(false);
        }
        return () => {
          cancelled = true;
        };
      }
    }

    if (!cancelled) {
      setTimer(found || null);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Create one real Context timer after the SEO timer definition is loaded.
  useEffect(() => {
    if (loading || !timer || createdRef.current) return undefined;

    createdRef.current = true;
    addTimer(timer.title, timer.duration, "seo");

    return undefined;
  }, [loading, timer, addTimer]);

  // Find the timer created for this SEO page.
  useEffect(() => {
    if (!timer || !createdRef.current) return;

    const matches = activeTimers.filter(
      (item) =>
        item.type === "seo" &&
        item.name === timer.title &&
        item.duration === timer.duration
    );

    const latest = matches[matches.length - 1];
    if (latest) {
      timerKeyRef.current = latest.id;
    }
  }, [activeTimers, timer]);

  // Remove the SEO timer when leaving the page.
  useEffect(() => {
    return () => {
      if (timerKeyRef.current) {
        removeTimer(timerKeyRef.current);
      }
      createdRef.current = false;
      timerKeyRef.current = null;
    };
  }, [removeTimer]);

  const liveTimer = timerKeyRef.current
    ? activeTimers.find((item) => item.id === timerKeyRef.current)
    : null;

  const timerProps = liveTimer || {
    id: timerKeyRef.current || `seo-${slug}`,
    name: timer?.title || "Timer",
    duration: timer?.duration || 0,
    remaining: timer?.duration || 0,
    type: "seo",
    status: "running",
  };

  // Conditional UI comes only AFTER all hooks.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Loading timer...</p>
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://timecounterpro.com/timer/${timer.slug}`;

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: timer.title,
    description: timer.description,
    applicationCategory: "UtilityApplication",
    applicationSubCategory: "Timer",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    image: "https://timecounterpro.com/time.png",
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

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
        item: canonicalUrl,
      },
    ],
  };

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

        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a]">
        <FullScreenTimer timer={timerProps} onClose={() => navigate("/")} />
      </div>
    </>
  );
};

export default TimerSlugPage;

*/






// src/pages/TimerSlugPage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import seoTimers from "../data/seoTimers";
import FullScreenTimer from "../components/FullScreenTimer";
import { TimerContext } from "../context/TimerContext";

const TimerSlugPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { activeTimers, addTimer, removeTimer } = useContext(TimerContext);

  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const createdRef = useRef(false);
  const timerKeyRef = useRef(null);

  // IMPORTANT: every hook is above every conditional return.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const pomodoroMatch = slug?.match(/pomodoro-(\d+)-(\d+)/);

    if (pomodoroMatch) {
      const focus = parseInt(pomodoroMatch[1], 10) * 60;
      if (!cancelled) {
        setTimer({
          slug,
          title: `Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]}`,
          duration: focus,
          description: `Free Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]} timer for productivity. Perfect for focused work sessions.`,
          keywords: "pomodoro timer, focus timer, study timer, productivity timer",
          category: "pomodoro",
        });
        setLoading(false);
      }
      return () => {
        cancelled = true;
      };
    }

    const found = seoTimers.find((item) => item.slug === slug);

    if (!found && slug) {
      const durationMatch = slug.match(/(\d+)-min/);
      const durationMin = durationMatch ? parseInt(durationMatch[1], 10) : null;

      if (durationMin && durationMin > 0 && durationMin <= 120) {
        const title = slug
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        if (!cancelled) {
          setTimer({
            slug,
            title,
            duration: durationMin * 60,
            description: `Free ${title} with sound and fullscreen. Start the countdown now!`,
            keywords: `${title}, timer, countdown, online timer`,
            isCustom: true,
          });
          setLoading(false);
        }
        return () => {
          cancelled = true;
        };
      }
    }

    if (!cancelled) {
      setTimer(found || null);
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Create one real Context timer after the SEO timer definition is loaded.
  useEffect(() => {
    if (loading || !timer || createdRef.current) return undefined;

    createdRef.current = true;
    addTimer(timer.title, timer.duration, "seo");

    return undefined;
  }, [loading, timer, addTimer]);

  // Find the timer created for this SEO page.
  useEffect(() => {
    if (!timer || !createdRef.current) return;

    const matches = activeTimers.filter(
      (item) =>
        item.type === "seo" &&
        item.name === timer.title &&
        item.duration === timer.duration
    );

    const latest = matches[matches.length - 1];
    if (latest) {
      timerKeyRef.current = latest.id;
    }
  }, [activeTimers, timer]);

  // Remove the SEO timer when leaving the page.
  useEffect(() => {
    return () => {
      if (timerKeyRef.current) {
        removeTimer(timerKeyRef.current);
      }
      createdRef.current = false;
      timerKeyRef.current = null;
    };
  }, [removeTimer]);

  const liveTimer = timerKeyRef.current
    ? activeTimers.find((item) => item.id === timerKeyRef.current)
    : null;

  const timerProps = liveTimer || {
    id: timerKeyRef.current || `seo-${slug}`,
    name: timer?.title || "Timer",
    duration: timer?.duration || 0,
    remaining: timer?.duration || 0,
    type: "seo",
    status: "running",
  };

  // Conditional UI comes only AFTER all hooks.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-400">Loading timer...</p>
        </div>
      </div>
    );
  }

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
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://timecounterpro.com/timer/${timer.slug}`;

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: timer.title,
    description: timer.description,
    applicationCategory: "UtilityApplication",
    applicationSubCategory: "Timer",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    image: "https://timecounterpro.com/time.png",
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

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
        item: canonicalUrl,
      },
    ],
  };

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

        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a]">
        <FullScreenTimer timer={timerProps} onClose={() => navigate("/")} />
      </div>
    </>
  );
};

export default TimerSlugPage;
