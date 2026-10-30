// src/pages/PomodoroPage.jsx
//
// The /pomodoro route previously rendered <PomodoroTimer /> directly with no
// page-level <title>/<meta>/<link rel="canonical">. That meant it inherited
// the homepage metadata. This wrapper gives the route its own unique metadata
// (via <Seo /> — see the SEO block below) and adds the written content a tool
// page should have.
//
// NOTE ON SEO:
//   The <Seo /> component is not present in the code I was given, so its props
//   are unknown. The block marked "SEO — placeholder" at the top of the
//   returned JSX must be adapted to whatever API Seo.jsx actually exposes.
//   Do not add a second <Helmet> if Seo.jsx already renders one internally.
//
// NOTE ON PRODUCT CLAIMS:
//   Several statements in the "How to use this timer" and "Troubleshooting"
//   sections assert behaviour of PomodoroTimer.jsx (localStorage, midnight
//   reset, counter semantics, alarm). I could not inspect that file. Those
//   statements are marked with "TODO: verify in PomodoroTimer.jsx" comments
//   and must be confirmed — or removed — before the page goes live.

import React from "react";
import { Link } from "react-router-dom";
import PomodoroTimer from "../components/Timer/PomodoroTimer";
// import Seo from "../components/Seo"; // TODO: uncomment and wire up once API is confirmed


const faqs = [
  {
    q: "How long is one Pomodoro session?",
    a: "Twenty-five minutes of focus followed by a five-minute short break. After four completed sessions, take a longer break of 15 to 30 minutes. The 25/5 split is the traditional default, not a scientific rule.",
  },
  {
    q: "Can I change the 25-minute length?",
    a: "This timer runs a 25/5 default. If you regularly do deep work such as coding, long-form writing or maths, 50/10 often suits better; if you are rebuilding the habit, start at 10/5 and work up.",
  },
  {
    q: "Does the timer keep running if I switch tabs?",
    a: "The countdown will keep running, but browsers throttle background tabs, so the alarm may not fire while the tab is hidden. Keep the tab visible if the sound matters to you.",
  },
  {
    q: "What do the two numbers under the timer mean?",
    a: "Focus sessions today counts completed focus intervals since midnight in your local timezone. Focused time today sums their focus minutes. They reset at midnight and are stored on your device only.",
  },
  {
    q: "Does it work offline or without an account?",
    a: "Yes. It runs in your browser, requires no sign-up, and stores your stats locally. You can install TimeCounterPro as a web app from the home page if you want an icon on your device.",
  },
  {
    q: "Why does a session not count if I get interrupted?",
    a: "The traditional rule is that an interrupted interval does not count. Note the interruption, deal with it if it is genuinely urgent, and start a new session. Honest counting is what makes your daily totals useful for planning.",
  },
  {
    q: "Is 25 minutes enough for creative work?",
    a: "Often no. Writing, debugging and complex analysis have a long warm-up, and a 25-minute cap discards it at every cycle. Many people switch to 50/10 or 90-minute blocks for that work and keep 25/5 for admin and revision.",
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
    body: "The break is part of the mechanism, not a reward. Skipping it reliably hurts the third and fourth intervals.",
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

// The cycle is the five steps the timer itself implements. The sixth habit
// (recording your counts) is described separately under "Why counting matters"
// so the two sections do not repeat each other.
const cycleSteps = [
  "Choose one task and write it down. Not a project — one task with a recognisable finish.",
  "Start a 25 minute interval and work on that task alone. If an unrelated thought arrives, write three words about it on paper and carry on.",
  "Stop when the timer rings, even mid-sentence. The unfinished sentence makes the next restart easier.",
  "Take a 5 minute break away from the screen. Stand up, move, look at something further than arm's length.",
  "After four intervals, take a longer break of 15 to 30 minutes.",
];

const workflowSteps = [
  {
    title: "Pick one task and write it down",
    body: "Chapter 4, sections 4.1–4.3, then past-paper questions. Not 'revise biology' — one task with a finish line you can recognise.",
  },
  {
    title: "Session 1 (25 min)",
    body: "Read and make notes. When the timer rings, stop mid-sentence and stand up for five minutes. Do not open the phone.",
  },
  {
    title: "Session 2 (25 min)",
    body: "Finish the section, then attempt three past-paper questions. Break again.",
  },
  {
    title: "Session 3 (25 min)",
    body: "Mark your answers against the mark scheme. Break again.",
  },
  {
    title: "Session 4 (25 min), then long break",
    body: "Re-do the questions you got wrong. Then take the long break. Check the daily stats: if it reads 1h 40m and you intended two hours, plan tomorrow against 1h 40m.",
  },
];

// Each item below makes a claim about how PomodoroTimer behaves. Confirm
// against the component source and delete any that turn out not to be true.
const troubleshooting = [
  {
    title: "The timer stalls when I switch tabs",
    // TODO: verify in PomodoroTimer.jsx — does it use a target end-time
    // timestamp, or a setInterval decrement? Behaviour differs.
    body: "Browsers throttle background tabs to save battery. The countdown keeps running, but the alarm may not fire while the tab is hidden. Keep the tab visible if the sound matters to you.",
  },
  {
    title: "The alarm did not play",
    // TODO: verify in PomodoroTimer.jsx — is the volume control wired to
    // an <audio> element, an AudioContext beep, or nothing?
    body: "Check the volume control on the timer and your device's own volume. Some browsers require you to interact with the page once (a tap or click) before they will play audio — starting the timer counts as that interaction.",
  },
  {
    title: '"Sessions: 0" is not going up',
    // TODO: verify in PomodoroTimer.jsx — when does the session counter
    // increment? On completion, on start, on reset? Change this text
    // to match.
    body: "The session counter increments for completed focus phases. If you reset mid-session it stays at its previous number. The two daily tiles below the timer are the ones to watch for overall progress.",
  },
  {
    title: "The daily stats reset",
    // TODO: verify in PomodoroTimer.jsx — is there a midnight reset in
    // code, or is it just a localStorage key that gets cleared? If the
    // reset is not implemented, remove this item.
    body: "They reset at midnight in your local timezone and are stored in your browser. Clearing site data, using a private window, or switching device will show a fresh count.",
  },
  {
    title: "I closed the tab by accident",
    // Verified by the on-page text "Timer state is not saved between visits".
    body: "Timer state is not saved between visits — this is stated on the panel. Start a new session. If you want an icon on your home screen so the tab is harder to lose, install TimeCounterPro as a web app from the home page.",
  },
];

const relatedTools = [
  { path: "/stopwatch", label: "Stopwatch", desc: "Millisecond lap timing" },
  { path: "/mock-test-timer", label: "Mock Test Timer", desc: "Sectional exam mode" },
  { path: "/meditation-timer-with-sound", label: "Meditation Timer", desc: "Breathing guide and bells" },
  { path: "/world-clock", label: "World Clock", desc: "Time zones for teams" },
];

const tocItems = [
  { id: "using-it", label: "How to use this timer" },
  { id: "origin", label: "Background" },
  { id: "cycle", label: "The cycle" },
  { id: "tracking", label: "Why counting matters" },
  { id: "workflow", label: "A study workflow" },
  { id: "intervals", label: "Interval length" },
  { id: "mistakes", label: "Common mistakes" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "faq", label: "FAQ" },
  { id: "related", label: "Related timers" },
];


function PomodoroPage() {

  return (
    <>
      {/*
        ═══════════════════════════════════════════════════════════════════
        SEO — placeholder.
        Replace this block with the actual <Seo /> usage once the props of
        src/components/Seo.jsx are known. The values below are the ones this
        page needs.
        ═══════════════════════════════════════════════════════════════════
      */}
      {/*
      <Seo
        title="Pomodoro Timer — Free 25/5 Focus Timer | TimeCounterPro"
        description="A free browser-based Pomodoro timer with a 25/5 focus cycle, daily session and focused-time counters, and an optional alarm. No sign-up."
        canonical="https://timecounterpro.com/pomodoro"
      />
      */}

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
            below, then read on for how to use the technique properly —
            including the step most people skip.
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
        {/* HOW TO USE — feature-accurate, no invented controls             */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <section id="using-it" className="mt-12 sm:mt-16 scroll-mt-20">
          <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
            Using it
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
            How to use this timer
          </h2>
          <div className="mt-4 sm:mt-5 space-y-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
            <p>
              The panel above is a 25-minute focus timer with a built-in break
              cycle and a running total for the day. Here is what each part
              does.
            </p>
            <p>
              <strong className="text-slate-900">Starting a focus session.</strong>{" "}
              Choose one task, then start the timer. The countdown runs from
              25:00 down to 0:00. No account is required and nothing is uploaded.
            </p>
            <p>
              <strong className="text-slate-900">Pausing and resetting.</strong>{" "}
              If something genuinely urgent arrives, pause the timer rather
              than let it run against work you have stopped doing. If you
              abandon a session before it finishes, reset it and start again.
              A half-finished interval is not a Pomodoro; counting it makes your
              daily total misleading.
            </p>
            <p>
              <strong className="text-slate-900">The break phase.</strong> When
              a focus phase ends, take the 5-minute short break. After four
              completed focus phases, take the longer 15 to 30 minute break.
              The timer keeps the cycle; your job is to actually leave the
              screen for the break.
            </p>
            <p>
              <strong className="text-slate-900">The volume control.</strong>{" "}
              Use it to silence the alarm in a shared space. If you mute it,
              keep the tab visible so you can see the countdown finish.
            </p>
            {/*
              TODO: verify in PomodoroTimer.jsx before publishing:
                • What exactly does the volume control adjust? Alarm beep,
                  background audio, both, something else?
                • Does the app include background audio tracks at all?
                  (The page <title> mentions ambient sounds & lofi — but
                  the visible timer UI does not surface a picker.)
                • When does the session counter increment?
                • Are daily stats written to localStorage, and is there a
                  midnight reset in code?
                • Is the timer built on a target-timestamp comparison or a
                  setInterval decrement?
              Each TODO above corresponds to one of the sentences around it.
              Once confirmed, remove any sentence that is not true.
            */}
            <p>
              <strong className="text-slate-900">The two stat tiles.</strong>{" "}
              <em>Focus sessions today</em> counts completed focus intervals
              since midnight in your timezone. <em>Focused time today</em>{" "}
              sums their focus minutes. They reset at midnight and are stored
              on your device only; they do not follow you to another browser
              or another machine.
            </p>
            <p>
              <strong className="text-slate-900">Sessions counter.</strong>{" "}
              The <em>Sessions</em> figure in the timer panel tracks the cycle
              you are currently running. It is separate from the daily total.
              Resetting the cycle resets this counter; the daily totals are not
              affected.
            </p>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ARTICLE — wide grid: TOC on right, content on left               */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        <article className="pt-12 sm:pt-16 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 lg:gap-16">

            {/* ─────────── MAIN CONTENT COLUMN ─────────── */}
            <div className="max-w-none lg:max-w-none min-w-0">

              {/* SECTION: Background / origin */}
              <section id="origin" className="scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  01 · Background
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  Where the technique came from
                </h2>
                <div className="mt-4 sm:mt-5 space-y-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  <p>
                    Francesco Cirillo developed the method as a university
                    student in the late 1980s. As he tells it, he was
                    struggling to concentrate, challenged himself to study for
                    ten minutes at a time, and used a tomato-shaped kitchen
                    timer to measure the interval. Pomodoro is Italian for
                    tomato, and the name stuck.
                  </p>
                  <p>
                    That origin explains why it is useful. It was designed by
                    someone who was struggling to begin, not by someone who was
                    already disciplined.
                  </p>
                </div>
              </section>

              {/* SECTION: The cycle (five steps the timer implements) */}
              <section id="cycle" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  02 · The Method
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  The cycle, step by step
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  The timer implements five steps. A sixth habit — recording
                  how many intervals each task actually takes — sits outside
                  the timer and is described in the next section.
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

              {/* SECTION: Why counting matters */}
              <section id="tracking" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  03 · Outside the timer
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  Why counting matters
                </h2>
                <div className="mt-4 sm:mt-5 space-y-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  <p>
                    Most people do the five steps above and skip the record
                    keeping, which is a shame — counting is where the method
                    stops being a timer and starts giving you useful data about
                    your own work.
                  </p>
                </div>

                <div className="mt-6 sm:mt-7 rounded-xl border border-indigo-200 bg-indigo-50/60 p-5 sm:p-6 md:p-7">
                  <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-700 mb-2">
                    What you learn after two weeks
                  </p>
                  <p className="text-sm sm:text-base text-slate-800 leading-7 sm:leading-8">
                    Two weeks of honest counting gives you a real number for the
                    amount of focused work you finish in a day. That number is
                    usually smaller than the day feels. It is also more useful
                    for planning than any guess. Once you know your real
                    average, your estimates start matching reality.
                  </p>
                </div>
              </section>

              {/* SECTION: Workflow */}
              <section id="workflow" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  04 · In Practice
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  A worked example: revising for an exam
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  Suppose you have three chapters to revise and two hours before
                  dinner.
                </p>
                <ol className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                  {workflowSteps.map((step, i) => (
                    <li key={i} className="flex gap-3 sm:gap-5 items-start">
                      <span className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold flex items-center justify-center tabular-nums">
                        {i + 1}
                      </span>
                      <div className="pt-0.5">
                        <p className="text-sm sm:text-base font-semibold text-slate-900 leading-6">
                          {step.title}
                        </p>
                        <p className="mt-1 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="mt-6 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  If the task is writing rather than revising — an essay, a
                  report, code — a single 25-minute block is often too short to
                  get into the work. Treat the first block as warm-up and
                  accept that you will really be productive from session two.
                  That is normal, and it is why the 50/10 split exists for deep
                  work.
                </p>
              </section>

              {/* SECTION: Interval guide */}
              <section id="intervals" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  05 · Tuning
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  Choosing your interval length
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600 leading-7 sm:leading-8">
                  The 25/5 split is a default, not a rule. Match the interval
                  to the warm-up cost of the work you are doing.
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
                  06 · Common Mistakes
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

              {/* SECTION: Troubleshooting */}
              <section id="troubleshooting" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  07 · If something isn't working
                </p>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-950 tracking-tight leading-tight">
                  Troubleshooting
                </h2>
                <div className="mt-6 sm:mt-8 divide-y divide-slate-200 border-t border-b border-slate-200">
                  {troubleshooting.map((item) => (
                    <div key={item.title} className="py-5 sm:py-6">
                      <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-6">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm md:text-[15px] text-slate-600 leading-6 sm:leading-7">
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION: FAQ */}
              <section id="faq" className="mt-12 sm:mt-16 scroll-mt-20">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] sm:tracking-[0.22em] text-indigo-600 mb-2.5 sm:mb-3">
                  08 · Questions
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