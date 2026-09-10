import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import seoTimers from "../data/seoTimers";
import FullScreenTimer from "../components/FullScreenTimer";
import { TimerContext } from "../context/TimerContext";

const INDEXABLE_TIMERS = new Set([
  "5-minute-timer","10-minute-timer","15-minute-timer","20-minute-timer","25-minute-timer",
  "30-minute-timer","45-minute-timer","60-minute-timer","pomodoro-timer","pomodoro-25-5",
  "pomodoro-50-10","study-timer","workout-timer","cooking-timer","meditation-timer",
  "classroom-timer","meeting-timer","exam-timer","reading-timer","coding-timer"
]);

const getBackground = (slug = "", title = "") => {
  const value = `${slug} ${title}`.toLowerCase();
  if (/meditation|mindfulness|sleep|nap|bed|breath|zen|yoga/.test(value)) return "meditation";
  if (/cook|kitchen|bake|food|recipe/.test(value)) return "cooking";
  if (/workout|exercise|gym|run|fitness/.test(value)) return "workout";
  if (/pomodoro|focus/.test(value)) return "pomodoro";
  if (/study|exam|classroom|school|homework|reading|test|quiz/.test(value)) return "study";
  if (/meeting|presentation|work/.test(value)) return "meeting";
  return "countdown";
};

const CATEGORY_CONTENT = {
  meditation: {
    intro: "A meditation timer gives you a simple boundary for a quiet session, so you can spend less attention checking the clock.",
    benefits: ["Creates a clear session length", "Useful for breathing practice", "Works for short or longer sessions", "Keeps the timing simple"],
    howTo: ["Choose a comfortable position", "Set the session length", "Start the timer and focus on your practice", "Return when the timer reaches zero"],
    tips: "For a new routine, a short session can be easier to repeat consistently than an ambitious session that is difficult to maintain."
  },
  cooking: {
    intro: "A kitchen timer is useful whenever a recipe asks you to wait for a specific amount of time. It lets you work on another preparation step without constantly watching the clock.",
    benefits: ["Clear cooking countdown", "Useful for preparation and baking", "Easy to restart for another step", "Fullscreen view is easy to glance at"],
    howTo: ["Read the recipe and choose the required duration", "Start the countdown", "Continue the next preparation step", "Check the timer when the alert finishes"],
    tips: "Use the timer as a reminder rather than as a substitute for checking food. Cooking results can also depend on the recipe, appliance and ingredients."
  },
  study: {
    intro: "A study timer can turn a large study plan into a clearly defined session. The goal is to make the next block of work visible and manageable.",
    benefits: ["Defines a clear study block", "Useful for revision and reading", "Helps separate work from breaks", "Easy to use without an account"],
    howTo: ["Choose one specific study task", "Set a realistic duration", "Start the timer and remove distractions", "Stop or continue after reviewing your progress"],
    tips: "Try matching the timer to the task. A short review may need only 10–15 minutes, while a larger topic can be divided into several sessions."
  },
  workout: {
    intro: "A workout countdown can help you keep a planned exercise or rest interval visible while you train.",
    benefits: ["Simple exercise timing", "Useful for work and rest intervals", "Fullscreen display is easy to see", "Suitable for home workouts and practice"],
    howTo: ["Choose the interval you need", "Start the timer", "Complete the planned activity", "Use the alert as a cue to change or finish"],
    tips: "A timer only manages time. Choose exercise intensity and rest periods that are appropriate for your own fitness level and follow professional advice when needed."
  },
  pomodoro: {
    intro: "Pomodoro timers organize work into focused periods followed by planned breaks. TimeCounterPro provides ready-made cycles so you can start without calculating each interval.",
    benefits: ["Clear focus and break boundaries", "Useful for study and desk work", "Simple repeatable routine", "Ready-made 25/5 and longer cycles"],
    howTo: ["Choose a focus-and-break cycle", "Work on one task during the focus period", "Take the planned break", "Repeat the cycle and adjust it to your routine"],
    tips: "The 25/5 pattern is a common starting point, but it is not a rule. Choose intervals that fit your task, environment and attention span."
  },
  classroom: {
    intro: "A classroom timer can make activity limits visible to students and teachers during quizzes, group work, reading and short exercises.",
    benefits: ["Visible activity deadline", "Useful for quizzes and exercises", "Simple fullscreen display", "No account required"],
    howTo: ["Tell participants the time limit", "Set the matching duration", "Start the timer", "Give your planned instruction when time ends"],
    tips: "For assessments, use the timer as a communication aid and follow the rules or accommodations that apply to your class."
  },
  meeting: {
    intro: "A meeting timer helps teams keep a planned discussion, presentation or work block within its allocated time.",
    benefits: ["Clear meeting time limit", "Useful for presentations", "Easy to display on a shared screen", "Simple countdown without setup"],
    howTo: ["Agree on the time limit", "Set the duration", "Start when the meeting begins", "Use the ending alert as a cue to wrap up"],
    tips: "A visible timer works best when participants know the time limit before the discussion starts."
  },
  default: {
    intro: "This online countdown gives you a clear time limit for a task without requiring an account or a separate application.",
    benefits: ["Simple countdown interface", "Sound and fullscreen controls", "Works in modern browsers", "Useful for many everyday tasks"],
    howTo: ["Choose the duration", "Start the timer", "Focus on the task", "Return when the countdown finishes"],
    tips: "Pick a duration that matches the task rather than using the same timer for every situation."
  }
};

function TimerSlugPage() {
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
        const focusMinutes = Number(pomodoroMatch[1]);
        setTimer({
          slug,
          title: `Pomodoro ${pomodoroMatch[1]}-${pomodoroMatch[2]}`,
          duration: focusMinutes * 60,
          description: `A Pomodoro timer with a ${pomodoroMatch[1]} minute focus period and a ${pomodoroMatch[2]} minute break period.`,
          keywords: "pomodoro timer, focus timer, study timer",
          category: "pomodoro",
          background: "pomodoro"
        });
        setLoading(false);
      }
      return () => { cancelled = true; };
    }

    const found = seoTimers.find((item) => item.slug === slug);
    if (!cancelled) {
      setTimer(found ? { ...found, background: found.background || getBackground(found.slug, found.title), category: found.category || getBackground(found.slug, found.title) } : null);
      setLoading(false);
    }
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (loading || !timer || createdRef.current) return;
    createdRef.current = true;
    addTimer(timer.title, timer.duration, "seo");
  }, [loading, timer, addTimer]);

  useEffect(() => {
    if (!timer || !createdRef.current) return;
    const match = activeTimers.filter((item) => item.type === "seo" && item.name === timer.title && item.duration === timer.duration).at(-1);
    if (match) timerKeyRef.current = match.id;
  }, [activeTimers, timer]);

  useEffect(() => () => {
    if (timerKeyRef.current) removeTimer(timerKeyRef.current);
    createdRef.current = false;
    timerKeyRef.current = null;
  }, [removeTimer]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Loading timer…</p></div>;
  if (!timer) return <div className="min-h-screen flex flex-col items-center justify-center gap-4"><h1 className="text-4xl font-bold">Timer not found</h1><Link className="text-indigo-600" to="/timers">Browse timers</Link></div>;

  const canonicalUrl = `https://timecounterpro.com/timer/${timer.slug}`;
  const category = timer.category || getBackground(timer.slug, timer.title);
  const content = CATEGORY_CONTENT[category] || CATEGORY_CONTENT.default;
  const minutes = Math.max(1, Math.round(timer.duration / 60));
  const indexable = INDEXABLE_TIMERS.has(timer.slug);
  const title = `${timer.title} — Free ${minutes} Min Online Timer | TimeCounterPro`;
  const baseDescription = timer.description && timer.description.trim().length > 0 ? timer.description.trim() : content.intro;
  const description = `${baseDescription} ${minutes} minute ${category} timer with sound and fullscreen, free, no signup.`.slice(0, 160);
  const seoBlurb = `${content.intro} ${minutes} minute ${category} timer with sound — free, no signup needed.`;
  const liveTimer = timerKeyRef.current ? activeTimers.find((item) => item.id === timerKeyRef.current) : null;
  const timerProps = liveTimer
    ? { ...liveTimer, seoBlurb }
    : { id: timerKeyRef.current || `seo-${slug}`, name: timer.title, duration: timer.duration, remaining: timer.duration, type: "seo", status: "running", seoBlurb };

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: timer.title,
    description,
    applicationCategory: "UtilityApplication",
    operatingSystem: "All",
    url: canonicalUrl,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: `How do I use the ${timer.title}?`, acceptedAnswer: { "@type": "Answer", text: content.howTo.join(" ") } },
      { "@type": "Question", name: `What can I use a ${timer.title} for?`, acceptedAnswer: { "@type": "Answer", text: content.intro } },
      { "@type": "Question", name: `Is the ${timer.title} free to use?`, acceptedAnswer: { "@type": "Answer", text: "The timer is available to use without creating an account. Standard browser features such as sound may depend on your device and browser settings." } }
    ]
  };

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        {!indexable && <meta name="robots" content="noindex,follow" />}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {indexable && <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>}
        {indexable && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a]">
        <FullScreenTimer timer={{ ...timerProps, background: timer.background || getBackground(timer.slug, timer.title), category, slug: timer.slug, title: timer.title }} seoBlurb={seoBlurb} onClose={() => navigate("/timers")} />

        <article className="relative z-10 bg-[#0a0a0a] border-t border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-12 text-white">
            <p className="text-xs uppercase tracking-[.18em] text-purple-300">{category} timer</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold">{timer.title}</h1>
            <p className="mt-4 text-gray-300 text-base leading-7">{content.intro} This {minutes}-minute countdown is designed to make the time limit easy to see while you work on the task.</p>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <section className="border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold">Why use this timer?</h2>
                <ul className="mt-4 space-y-3 text-gray-300 text-sm leading-6">{content.benefits.map((item) => <li key={item}>• {item}</li>)}</ul>
              </section>
              <section className="border border-white/10 rounded-xl p-6">
                <h2 className="text-xl font-semibold">How to use it</h2>
                <ol className="mt-4 space-y-3 text-gray-300 text-sm leading-6">{content.howTo.map((item, i) => <li key={item}><span className="text-purple-300 mr-2">{i + 1}.</span>{item}</li>)}</ol>
              </section>
            </div>

            <section className="mt-6 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold">A practical tip</h2>
              <p className="mt-3 text-gray-300 leading-7">{content.tips}</p>
            </section>

            <section className="mt-6 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-semibold">About this timer</h2>
              <p className="mt-3 text-gray-300 leading-7">TimeCounterPro provides browser-based timing tools for study, work, exercise, cooking, meetings and everyday tasks. You can start a timer without creating an account. Timer history and preferences may be stored locally in your browser according to the site's privacy policy.</p>
            </section>

            <nav className="mt-8 flex flex-wrap gap-2" aria-label="Related timers">
              <Link to="/timers" className="px-4 py-2 rounded-full bg-white/10 text-sm hover:bg-white/20">All timers</Link>
              <Link to="/timer/10-minute-timer" className="px-4 py-2 rounded-full bg-white/10 text-sm hover:bg-white/20">10 minute timer</Link>
              <Link to="/timer/25-minute-timer" className="px-4 py-2 rounded-full bg-white/10 text-sm hover:bg-white/20">25 minute timer</Link>
              <Link to="/timer/pomodoro-timer" className="px-4 py-2 rounded-full bg-white/10 text-sm hover:bg-white/20">Pomodoro timer</Link>
            </nav>
          </div>
        </article>
      </div>
    </>
  );
}

export default TimerSlugPage;
