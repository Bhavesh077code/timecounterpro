/*
// src/pages/TimerSlugPage.jsx
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import seoTimers from "../data/seoTimers";
import FullScreenTimer from "../components/FullScreenTimer";
import { TimerContext } from "../context/TimerContext";

const getBackground = (slug = "", title = "") => {
  const value = `${slug} ${title}`.toLowerCase();
  if (/pomodoro|focus|study|exam|work/.test(value)) return "pomodoro";
  if (/workout|exercise|gym|run|fitness/.test(value)) return "workout";
  if (/cook|kitchen|bake|food/.test(value)) return "cooking";
  if (/sleep|nap|bed/.test(value)) return "sleep";
  return "countdown";
};

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
          background: "pomodoro",
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
            background: getBackground(slug, title),
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

  const timerWithBackground = { ...timerProps, background: timer.background || getBackground(timer.slug, timer.title) };

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
        <FullScreenTimer timer={timerWithBackground} onClose={() => navigate("/")} />
      </div>
    </>
  );
};

export default TimerSlugPage;

*/







// src/pages/TimerSlugPage.jsx - SEO CTR + Content Boost Version
import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import seoTimers from "../data/seoTimers";
import FullScreenTimer from "../components/FullScreenTimer";
import { TimerContext } from "../context/TimerContext";

const getBackground = (slug = "", title = "") => {
  const value = `${slug} ${title}`.toLowerCase();
  if (/meditation|mindfulness|sleep|nap|bed|breath|zen|yoga/.test(value)) return "meditation";
  if (/cook|kitchen|bake|food|recipe/.test(value)) return "cooking";
  if (/workout|exercise|gym|run|fitness/.test(value)) return "workout";
  if (/pomodoro|focus/.test(value)) return "pomodoro";
  if (/study|exam|classroom|school|homework|reading|test|quiz/.test(value)) return "study";
  if (/meeting|presentation|work/.test(value)) return "meeting";
  return "meditation";
};

// ✅ NEW - Har category ka alag attractive content
const CATEGORY_CONTENT = {
  meditation: {
    intro: "Find inner peace with this meditation timer. Perfect for mindfulness, breathing exercises, and relaxation.",
    benefits: ["Reduces stress and anxiety", "Improves focus and clarity", "Better sleep quality", "Mindfulness practice"],
    howTo: ["Sit comfortably", "Set your intention", "Start timer and breathe deeply", "Bell will guide you when complete"]
  },
  cooking: {
    intro: "Never overcook again! This kitchen timer ensures perfect results every time with loud alarm.",
    benefits: ["Perfect cooking timing", "Loud alarm for kitchen", "Never burn food", "Recipe precision"],
    howTo: ["Set time as per recipe", "Start timer", "Continue cooking", "Alarm when done"]
  },
  study: {
    intro: "Boost your productivity with this study timer. Scientifically proven to improve focus and retention.",
    benefits: ["Improved concentration", "Better exam preparation", "Pomodoro technique", "Track study sessions"],
    howTo: ["Choose study duration", "Eliminate distractions", "Focus completely", "Take break when alarm rings"]
  },
  workout: {
    intro: "Stay fit with this workout timer. Perfect for HIIT, gym sessions, and home exercises.",
    benefits: ["Perfect workout intervals", "HIIT training", "Rest timer included", "Fitness tracking"],
    howTo: ["Set workout duration", "Start exercising", "Follow intervals", "Cool down when complete"]
  },
  pomodoro: {
    intro: "Master productivity with Pomodoro technique. 25 min work, 5 min break - proven method.",
    benefits: ["25-5 proven technique", "Avoid burnout", "Maximum productivity", "Time management"],
    howTo: ["Work 25 minutes focused", "Take 5 min break", "Repeat 4 times", "Long break after"]
  },
  default: {
    intro: "Free online timer with sound and fullscreen. No ads, 100% free, works on all devices.",
    benefits: ["Free forever", "Sound alert", "Fullscreen mode", "Works offline"],
    howTo: ["Set your time", "Click start", "Focus on task", "Get alert when done"]
  }
};

const TimerSlugPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { activeTimers, addTimer, removeTimer } = useContext(TimerContext);
  const [timer, setTimer] = useState(null);
  const [loading, setLoading] = useState(true);
  const createdRef = useRef(false);
  const timerKeyRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const pomodoroMatch = slug?.match(/pomodoro-(\d+)-(\d+)/);
    if (pomodoroMatch) {
      if (!cancelled) {
        setTimer({
          slug, title: `Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]}`, background: "pomodoro",
          duration: parseInt(pomodoroMatch[1], 10) * 60,
          description: `Free Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]} timer for productivity.`,
          keywords: "pomodoro timer, focus timer", category: "pomodoro",
        });
        setLoading(false);
      }
      return () => { cancelled = true; };
    }
    const found = seoTimers.find((item) => item.slug === slug);
    if (!found && slug) {
      const durationMatch = slug.match(/(\d+)-min/);
      const durationMin = durationMatch ? parseInt(durationMatch[1], 10) : null;
      if (durationMin && durationMin > 0 && durationMin <= 120) {
        const title = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        if (!cancelled) {
          setTimer({
            slug, title, duration: durationMin * 60,
            description: `Free ${title} with sound and fullscreen.`,
            keywords: `${title}, timer`, isCustom: true,
            background: getBackground(slug, title), category: getBackground(slug, title),
          });
          setLoading(false);
        }
        return () => { cancelled = true; };
      }
    }
    if (!cancelled) {
      if (found) {
        setTimer({ ...found, background: found.background || getBackground(found.slug, found.title), category: found.category || getBackground(found.slug, found.title) });
      } else {
        setTimer(found || null);
      }
      setLoading(false);
    }
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (loading || !timer || createdRef.current) return undefined;
    createdRef.current = true;
    addTimer(timer.title, timer.duration, "seo");
    return undefined;
  }, [loading, timer, addTimer]);

  useEffect(() => {
    if (!timer || !createdRef.current) return;
    const matches = activeTimers.filter((item) => item.type === "seo" && item.name === timer.title && item.duration === timer.duration);
    const latest = matches[matches.length - 1];
    if (latest) timerKeyRef.current = latest.id;
  }, [activeTimers, timer]);

  useEffect(() => {
    return () => {
      if (timerKeyRef.current) removeTimer(timerKeyRef.current);
      createdRef.current = false;
      timerKeyRef.current = null;
    };
  }, [removeTimer]);

  const liveTimer = timerKeyRef.current ? activeTimers.find((item) => item.id === timerKeyRef.current) : null;
  const timerProps = liveTimer || {
    id: timerKeyRef.current || `seo-${slug}`,
    name: timer?.title || "Timer", duration: timer?.duration || 0, remaining: timer?.duration || 0,
    type: "seo", status: "running", background: timer?.background || getBackground(slug, timer?.title),
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white"><div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }
  if (!timer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="text-8xl font-bold text-purple-400 mb-4">404</div>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl">Back to Home</Link>
        </div>
      </div>
    );
  }

  const canonicalUrl = `https://timecounterpro.com/timer/${timer.slug}`;
  const category = timer.category || getBackground(timer.slug, timer.title);
  const content = CATEGORY_CONTENT[category] || CATEGORY_CONTENT.default;
  const minutes = Math.floor(timer.duration / 60);
  
  // ✅ CTR BOOST - Attractive Title & Description for Google
  const attractiveTitle = `${timer.title} ⏱️ Free Online Timer with Sound & Fullscreen`;
  const attractiveDesc = `⏰ ${timer.title} - Free online with loud alarm & fullscreen. Perfect for ${category}. No ads, 100% free. Start now at TimeCounterPro!`;

  const schemaMarkup = {
    "@context": "https://schema.org", "@type": "WebApplication",
    name: timer.title, description: timer.description,
    applicationCategory: "UtilityApplication", operatingSystem: "All",
    url: canonicalUrl, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
  };

  const faqSchema = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `How to use ${timer.title}?`, acceptedAnswer: { "@type": "Answer", text: content.howTo.join(", ") } },
      { "@type": "Question", name: `Is ${timer.title} free?`, acceptedAnswer: { "@type": "Answer", text: `Yes, ${timer.title} is 100% free with sound and fullscreen at TimeCounterPro. No ads, no signup required.` } },
      { "@type": "Question", name: `Does ${timer.title} have sound?`, acceptedAnswer: { "@type": "Answer", text: `Yes, ${timer.title} has loud alarm sound with volume control and works even when tab is in background.` } }
    ]
  };

  const timerWithBackground = { ...timerProps, background: timer.background || getBackground(timer.slug, timer.title), category, slug: timer.slug, title: timer.title };

  return (
    <>
      <Helmet>
        <title>{attractiveTitle}</title>
        <meta name="description" content={attractiveDesc} />
        <meta name="keywords" content={timer.keywords} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={attractiveTitle} />
        <meta property="og:description" content={attractiveDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={attractiveTitle} />
        <meta name="twitter:description" content={attractiveDesc} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a]">
        <FullScreenTimer timer={timerWithBackground} onClose={() => navigate("/")} />
        
        {/* ✅ NEW - SEO Content Below Timer - AdSense ke liye */}
        <div className="relative z-10 bg-[#0a0a0a] border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{timer.title} - Free Online Timer</h2>
            <p className="text-gray-300 text-base leading-relaxed mb-8">{content.intro} This {minutes} minute timer comes with loud alarm sound, fullscreen mode, and works on all devices. Perfect for {category} activities at TimeCounterPro - 100% free, no ads.</p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/[0.05] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">✨ Benefits</h3>
                <ul className="space-y-2">
                  {content.benefits.map((b, i) => <li key={i} className="text-gray-300 text-sm flex items-center gap-2"><span className="text-purple-400">•</span> {b}</li>)}
                </ul>
              </div>
              <div className="bg-white/[0.05] border border-white/10 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-3">📝 How to Use</h3>
                <ol className="space-y-2">
                  {content.howTo.map((h, i) => <li key={i} className="text-gray-300 text-sm flex gap-2"><span className="text-purple-400">{i+1}.</span> {h}</li>)}
                </ol>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">⏰ Why Choose TimeCounterPro?</h3>
              <p className="text-gray-300 text-sm">Free forever, no signup, loud alarm even in background tab, fullscreen mode, mobile friendly, works offline. Trusted by 100k+ users for {category} timers.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/timer/10-minute-timer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/80">10 Min Timer</Link>
              <Link to="/timer/25-minute-timer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/80">25 Min Timer</Link>
              <Link to="/timer/pomodoro-timer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/80">Pomodoro</Link>
              <Link to="/timer/meditation-timer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/80">Meditation</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimerSlugPage;