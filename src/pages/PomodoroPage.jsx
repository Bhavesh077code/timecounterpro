// src/pages/PomodoroPage.jsx
//
// The /pomodoro route previously rendered <PomodoroTimer /> directly, with no
// <Helmet> at all. That meant it inherited the homepage title, the homepage
// description and the homepage canonical from index.html - Google had no
// reason to treat it as a separate page. This wrapper fixes that and adds the
// written content an AdSense reviewer expects to find on a tool page.
//
// ─────────────────────────────────────────────────────────────────────────────
// Design notes (senior-dev pass + mobile-first responsive):
//   • Editorial layout: wide body max-w-6xl with a narrow reading column inside
//   • Timer sits in a distinct, bordered "instrument panel" card
//   • Long-form content split into scannable sections with eyebrow labels
//   • Pull-quote, callout, and comparison blocks break the wall of text
//   • FAQ uses a proper two-column definition layout
//   • Related tools footer links to sibling timer pages
//   • All typography tuned for reading: leading-7/8, tracking, colour hierarchy
//   • MOBILE: 320px-safe padding, sticky TOC hidden, hero scales, cards stack,
//             timer wrapper uses less padding, tap targets stay > 44px
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { Link } from "react-router-dom";
import PomodoroTimer from "../components/Timer/PomodoroTimer";
import Seo from "../components/Seo";

const SITE_URL = "https://timecounterpro.com";

const faqs = [
  {
    q: "What is the Pomodoro Technique?",
    a: "A time management method built on short intervals of single-task work separated by deliberate breaks. The standard cycle is 25 minutes of work and a 5 minute break, with a longer break after four cycles.",
  },
  {
    q: "Why 25 minutes?",
    a: "It is short enough to feel achievable when you are avoiding a task, and 25 plus 5 gives a clean half hour, which makes planning a day straightforward. The number is a convention rather than a scientific finding.",
  },
  {
    q: "What happens if I get interrupted?",
    a: "The traditional rule is that an interrupted interval does not count. Note the interruption, handle it if it is genuinely urgent, and restart. Honest counting is what makes the method informative.",
  },
  {
    q: "Is the Pomodoro Technique suitable for creative work?",
    a: "The structure helps, but 25 minutes is often too short for work with a long warm-up, such as writing or debugging. Many people switch to 50/10 or 90 minute blocks for that kind of task.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. The timer runs in your browser. You can also install TimeCounterPro as a web app from the home page if you want an icon on your device.",
  },
];

const intervalGuide = [
  {
    label: "10 / 5",
    tag: "Rebuilding a habit",
    body: "If you cannot currently finish a 25 minute block without checking your phone, do not conclude the method failed. Drop the interval until you can finish it reliably, then build back up.",
    tone: "slate",
  },
  {
    label: "25 / 5",
    tag: "Homework, admin, revision, email",
    body: "Ideal for work that breaks into chunks and does not need much context loading. Also the best interval for getting started on something you have been avoiding.",
    tone: "indigo",
    featured: true,
  },
  {
    label: "50 / 10",
    tag: "Writing, coding, analysis",
    body: "When loading the problem into your head takes ten minutes on its own, a 25 minute cap throws that warm-up away at every cycle.",
    tone: "slate",
  },
];

const mistakes = [
  {
    title: "Working through the break",
    body: "The break is part of the mechanism, not a reward. Skipping it reliably ruins the third and fourth intervals.",
  },
  {
    title: "Spending the break on a phone",
    body: "Scrolling is stimulating rather than restful, and it makes restarting harder than doing nothing would have.",
  },
  {
    title: "Batching several tasks into one interval",
    body: "One interval, one task. The single-tasking is most of the value.",
  },
  {
    title: "Counting interrupted intervals",
    body: "Dishonest counts make your estimates worse, not better.",
  },
];

const cycleSteps = [
  "Choose one task and write it down. Not a project — one task with a recognisable finish.",
  "Start a 25 minute interval and work on that task alone. If an unrelated thought arrives, write three words about it on paper and carry on.",
  "Stop when the timer rings, even mid-sentence. The unfinished sentence makes the next restart easier.",
  "Take a 5 minute break away from the screen. Stand up, move, look at something further than arm's length.",
  "After four intervals, take a longer break of 15 to 30 minutes.",
  "Record how many intervals the task actually took.",
];

const relatedTools = [
  { path: "/stopwatch", label: "Stopwatch", desc: "Millisecond lap timing" },
  { path: "/mock-test-timer", label: "Mock Test Timer", desc: "Sectional exam mode" },
  { path: "/group-study-timer", label: "Group Study Grid", desc: "4 parallel timers" },
  { path: "/world-clock", label: "World Clock", desc: "Time zones for teams" },
];

const tocItems = [
  { id: "origin", label: "Where it came from" },
  { id: "cycle", label: "The full cycle" },
  { id: "step-six", label: "Step six" },
  { id: "intervals", label: "Interval length" },
  { id: "mistakes", label: "Common mistakes" },
  { id: "faq", label: "FAQ" },
  { id: "related", label: "Related timers" },
];

function PomodoroPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Pomodoro Timer",
        url: `${SITE_URL}/pomodoro`,
        applicationCategory: "UtilityApplication",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <>
      

      {/* Container: safe padding on tiny screens (320px+), wider on desktop */}
      <div className="mx-auto  w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* HERO — eyebrow, H1, lede                                         */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <header className="pt-2 sm:pt-4 lg:pt-1 pb-8 sm:pb-12 lg:pb-14 border-b border-slate-200">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600">
            Focus Timer
          </p>
          <h1 className="mt-2.5 sm:mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.1] sm:leading-[1.05]">
            Pomodoro Timer
          </h1>
          <p className="mt-2 sm:mt-5 max-w-2xl text-base sm:text-lg lg:text-xl text-slate-600 leading-7 sm:leading-8">
            Work in focused intervals separated by real breaks. Start a cycle
            below, then read on for how to use the technique properly — including
            the step almost everyone skips.
          </p>

          {/* Quick meta row — wraps on mobile */}
          <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Runs in your browser
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              25 / 5 default
            </span>
          </div>
        </header>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* TIMER INSTRUMENT PANEL                                           */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section className="pt-4 sm:pt-4 lg:pt-7">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-slate-500">
              Instrument · Live
            </p>
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-400">
              Timer state is not saved between visits
            </p>
          </div>

          <div className="relative bg-white border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.04)]">
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500"></div>

            {/* Padding tightens on mobile so the timer has room */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-10">
              <PomodoroTimer />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ARTICLE — wide grid: TOC on right, content on left               */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <article className="pt-12 sm:pt-16 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 lg:gap-16">

            {/* ─────────── MAIN CONTENT COLUMN ─────────── */}
            <div className="max-w-none lg:max-w-none min-w-0">

              {/* SECTION: Origin */}
              <section id="origin" className="scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  01 · Origin
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  Where the technique came from
                </h2>
                <div className="mt-4 sm:mt-5 space-y-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  <p>
                    Francesco Cirillo developed the method as a university
                    student in the late 1980s. He was struggling to concentrate,
                    challenged himself to study properly for just ten minutes,
                    and used a tomato-shaped kitchen timer to measure it.
                    Pomodoro is Italian for tomato, and the name stuck.
                  </p>
                  <p>
                    That origin explains a lot about why it works. It was never
                    designed as a productivity system for people who are already
                    disciplined. It was designed by someone who could not start.
                  </p>
                </div>

                {/* Pull quote */}
                <blockquote className="mt-6 sm:mt-8 border-l-2 border-indigo-500 pl-4 sm:pl-6">
                  <p className="text-base sm:text-lg md:text-xl text-slate-800 italic leading-7 sm:leading-8">
                    It was never designed for people who are already disciplined.
                    It was designed by someone who could not start.
                  </p>
                </blockquote>
              </section>

              {/* SECTION: Full cycle */}
              <section id="cycle" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  02 · The Method
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  The full cycle, step by step
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  The method has six steps. Five of them are the timer. The
                  sixth is what turns it into information about your own work.
                </p>

                <ol className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  {cycleSteps.map((step, i) => (
                    <li
                      key={i}
                      className="flex gap-3 sm:gap-5 items-start"
                    >
                      <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center tabular-nums">
                        {i + 1}
                      </span>
                      <p className="text-sm sm:text-base text-slate-700 leading-7 sm:leading-8 pt-0.5">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              {/* SECTION: Step 6 callout */}
              <section id="step-six" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  03 · The Step Most People Skip
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  Step six is the one that changes things
                </h2>
                <div className="mt-4 sm:mt-5 space-y-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  <p>
                    Almost everyone does steps one to five and quietly drops
                    step six, which is a shame, because counting is where the
                    method stops being a timer and starts being information
                    about you.
                  </p>
                </div>

                {/* Callout card — mobile padding tightens */}
                <div className="mt-6 sm:mt-7 rounded-xl border border-indigo-200 bg-indigo-50/60 p-5 sm:p-6 md:p-7">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-700 mb-2">
                    The uncomfortable discovery
                  </p>
                  <p className="text-sm sm:text-base text-slate-800 leading-7 sm:leading-8">
                    Two weeks of honest counting usually produces one
                    realisation: the amount of genuinely focused work in an
                    eight hour day is much smaller than the day feels. Most
                    people land somewhere between{" "}
                    <strong className="text-slate-950">three and five hours</strong>{" "}
                    — and that is normal. Knowing your real number is what makes
                    your estimates start matching reality.
                  </p>
                </div>
              </section>

              {/* SECTION: Interval guide */}
              <section id="intervals" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  04 · Tuning
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  Choosing your interval length
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  The 25/5 split is a default, not a rule. Match the interval to
                  the warm-up cost of the work you are doing.
                </p>

                <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  {intervalGuide.map((item) => {
                    const isFeatured = item.featured;
                    return (
                      <div
                        key={item.label}
                        className={`rounded-xl border p-4 sm:p-6 transition-colors ${
                          isFeatured
                            ? "border-indigo-300 bg-indigo-50/50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-baseline justify-between gap-3 flex-wrap">
                          <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                            <span
                              className={`text-lg sm:text-2xl font-bold tabular-nums tracking-tight ${
                                isFeatured ? "text-indigo-700" : "text-slate-900"
                              }`}
                            >
                              {item.label}
                            </span>
                            {isFeatured && (
                              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-indigo-700 bg-white border border-indigo-200 rounded-full px-2 sm:px-2.5 py-0.5 sm:py-1">
                                Recommended
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider">
                            {item.tag}
                          </span>
                        </div>
                        <p className="mt-2 sm:mt-3 text-sm sm:text-[15px] text-slate-600 leading-6 sm:leading-7">
                          {item.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* SECTION: Mistakes */}
              <section id="mistakes" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  05 · Common Mistakes
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  What quietly breaks the method
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  Four failure modes account for most of the times people try
                  Pomodoro and give up.
                </p>

                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {mistakes.map((m, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.16em] sm:tracking-[0.18em] text-slate-500">
                          Mistake {String(i + 1).padStart(2, "0")}
                        </p>
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-6">
                        {m.title}
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 leading-6">
                        {m.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION: FAQ */}
              <section id="faq" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  06 · Questions
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  Frequently asked questions
                </h2>

                <div className="mt-6 sm:mt-8 divide-y divide-slate-200 border-t border-b border-slate-200">
                  {faqs.map((faq) => (
                    <div key={faq.q} className="py-5 sm:py-6">
                      <h3 className="font-semibold text-slate-900 text-sm sm:text-base md:text-lg leading-6 sm:leading-7">
                        {faq.q}
                      </h3>
                      <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-[15px] text-slate-600 leading-6 sm:leading-7">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION: Related tools */}
              <section id="related" className="mt-12 sm:mt-16 mb-12 sm:mb-20 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  Continue
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  Related timers on TimeCounterPro
                </h2>
                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedTools.map((t) => (
                    <Link
                      key={t.path}
                      to={t.path}
                      className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors min-h-[68px] flex flex-col justify-center"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900 text-sm sm:text-base group-hover:text-indigo-700 transition-colors">
                          {t.label}
                        </p>
                        <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all">
                          →
                        </span>
                      </div>
                      <p className="mt-1 text-xs sm:text-sm text-slate-500">{t.desc}</p>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* ─────────── SIDEBAR / TOC (desktop only) ─────────── */}
            <aside className="hidden lg:block">
              <div className="sticky top-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 mb-4">
                  On this page
                </p>
                <nav className="space-y-1">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-sm text-slate-600 hover:text-indigo-600 py-1.5 border-l-2 border-transparent hover:border-indigo-500 pl-3 transition-all"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                {/* Micro card */}
                <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                    A quiet reminder
                  </p>
                  <p className="text-sm text-slate-700 leading-6">
                    The break is not a reward for finishing the interval. It is
                    part of the interval.
                  </p>
                </div>

                {/* Install hint */}
                <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-700 mb-2">
                    Install
                  </p>
                  <p className="text-sm text-slate-700 leading-6">
                    Add TimeCounterPro to your home screen from the browser menu
                    — no app store required.
                  </p>
                </div>
              </div>
            </aside>
          </div>

          {/* ─────────── MOBILE TOC (visible below lg) ─────────── */}
          <div className="lg:hidden mt-12 sm:mt-16">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">
                On this page
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                {tocItems.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-xs sm:text-sm text-slate-600 hover:text-indigo-600 py-1.5 border-l-2 border-transparent hover:border-indigo-500 pl-2.5 transition-all truncate"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile micro reminder */}
            <div className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-700 mb-1.5">
                A quiet reminder
              </p>
              <p className="text-xs sm:text-sm text-slate-700 leading-6">
                The break is not a reward. It is part of the interval.
              </p>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}

export default PomodoroPage;