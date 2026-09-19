import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const tools = [
  { name: "Custom Countdown", path: "/create", description: "Set a duration for a task, event, meeting, practice session, cooking task, study block or any other activity that needs a clear end point." },,
  { name: "Pomodoro", path: "/pomodoro", description: "Use repeating focus and break periods for study, coding, reading, writing and other work where structured sessions are useful." },,
  { name: "Stopwatch", path: "/stopwatch", description: "Measure elapsed time upward and use the timing result when you need to understand how long an activity takes." },,
  { name: "World Clock", path: "/world-clock", description: "Compare the current local time in different cities when arranging calls, meetings, travel plans or remote collaboration." },,
  { name: "HIIT and Tabata", path: "/hiit-timer", description: "Create work and rest intervals for structured interval exercise. The tool measures time and does not provide medical advice." },,
  { name: "Mock Test", path: "/mock-test-timer", description: "Practice an examination under a chosen time limit so you can become familiar with pacing and time awareness." },,
  { name: "Group Study", path: "/group-study-timer", description: "Coordinate shared study periods when several people want the same start and end timing." },,
  { name: "Presentation", path: "/presentation-timer", description: "Keep a presentation, speech, lesson or rehearsal inside a planned duration." },,
  { name: "Stream Countdown", path: "/stream-timer", description: "Prepare a visible countdown for livestreams, broadcasts and stream preparation." },,
  { name: "Esports Jungle", path: "/jungle-timer", description: "Track game-related timing events during practice and gameplay. It is a general timing utility, not a source of game-policy information." },,
  { name: "Speedrun Split", path: "/speed-timer", description: "Measure elapsed attempts and splits when practicing routes or comparing personal runs." },,
  { name: "Gameplay", path: "/gameplay-timer", description: "Use a simple timing tool for gaming sessions, challenges and practice activities." },,
  { name: "Fasting Tracker", path: "/fasting-tracker-timer", description: "Measure the elapsed duration of a fasting interval. It does not determine whether fasting is suitable for a person." },,
  { name: "World Clock Board", path: "/world-clock-board-timer", description: "Keep several cities visible together when working with people in different time zones." },
];

function About() {
  return (
    <>
      <Helmet>
        <title>About TimeCounterPro - Free Online Time Tools</title>
        <meta
          name="description"
          content="Learn what TimeCounterPro is, how its browser-based time tools work, who they are designed for, their limitations, privacy considerations and how to get support."
        />
        <link rel="canonical" href="https://timecounterpro.com/about" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="About TimeCounterPro - Free Online Time Tools" />
        <meta
          property="og:description"
          content="A detailed guide to TimeCounterPro, its time tools, practical use cases, browser behavior, limitations, privacy information and support."
        />
      </Helmet>

      <main className="min-h-screen bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <article className="mx-auto max-w-5xl">
          <header className="border-b border-slate-200 pb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">Project information</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">About TimeCounterPro</h1>
            <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-700">
              TimeCounterPro is a browser-based collection of practical time tools. The project is designed for people who need to count down from a chosen duration, measure elapsed time, structure a focus session, compare time zones or manage a specific timed activity without installing a separate application.
            </p>
            <p className="mt-4 max-w-4xl leading-8 text-slate-600">
              This page explains the project in detail: what each group of tools is for, how visitors can choose the right page, what browser timing can and cannot do, how privacy should be understood, why obsolete generated pages are not presented as current features, and where to ask for help.
            </p>
          </header>

          <section className="py-10">
            <h2 className="text-3xl font-bold text-slate-950">The project at a glance</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-bold text-slate-900">Browser based</h3>
                <p className="mt-2 leading-7 text-slate-600">Open a maintained tool in a modern browser and use it without treating the website as a replacement for specialized software.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-bold text-slate-900">Purpose focused</h3>
                <p className="mt-2 leading-7 text-slate-600">Different activities have different timing needs, so the site provides separate pages with explanations for common use cases.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <h3 className="font-bold text-slate-900">Practical information</h3>
                <p className="mt-2 leading-7 text-slate-600">The site explains both what a tool can do and the situations where a visitor should use another source or a specialized device.</p>
              </div>
            </div>
          </section>

          <section className="border-y border-slate-200 py-10">
            <h2 className="text-3xl font-bold text-slate-950">Current tools</h2>
            <p className="mt-3 leading-8 text-slate-600">These are the maintained tool pages currently described by the project. Each destination is a real application route rather than an automatically generated duration page.</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Link to="/create" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Custom Countdown</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Set a duration for a task, event, meeting, practice session, cooking task, study block or any other activity that needs a clear end point.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/pomodoro" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Pomodoro</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Use repeating focus and break periods for study, coding, reading, writing and other work where structured sessions are useful.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/stopwatch" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Stopwatch</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Measure elapsed time upward and use the timing result when you need to understand how long an activity takes.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/world-clock" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">World Clock</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Compare the current local time in different cities when arranging calls, meetings, travel plans or remote collaboration.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/hiit-timer" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">HIIT and Tabata</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Create work and rest intervals for structured interval exercise. The tool measures time and does not provide medical advice.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/mock-test-timer" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Mock Test</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Practice an examination under a chosen time limit so you can become familiar with pacing and time awareness.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/group-study-timer" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Group Study</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Coordinate shared study periods when several people want the same start and end timing.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/presentation-timer" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Presentation</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Keep a presentation, speech, lesson or rehearsal inside a planned duration.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/stream-timer" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Stream Countdown</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Prepare a visible countdown for livestreams, broadcasts and stream preparation.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/jungle-timer" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Esports Jungle</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Track game-related timing events during practice and gameplay. It is a general timing utility, not a source of game-policy information.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/speed-timer" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Speedrun Split</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Measure elapsed attempts and splits when practicing routes or comparing personal runs.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/gameplay-timer" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Gameplay</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Use a simple timing tool for gaming sessions, challenges and practice activities.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/fasting-tracker-timer" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">Fasting Tracker</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Measure the elapsed duration of a fasting interval. It does not determine whether fasting is suitable for a person.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            <Link to="/world-clock-board-timer" className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-indigo-300 hover:shadow-sm transition">
              <h3 className="font-bold text-slate-900 group-hover:text-indigo-700">World Clock Board</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">Keep several cities visible together when working with people in different time zones.</p>
              <span className="inline-block mt-4 text-sm font-semibold text-indigo-600">Open tool →</span>
            </Link>
            </div>
          </section>

          <section className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">A note about timing accuracy</h2>
            <p className="mt-3 leading-8 text-slate-700">TimeCounterPro is a general web utility. Browser timers depend on the device clock, browser scheduling, operating-system power management and page visibility. For ordinary study, cooking, practice or presentation timing this can be convenient, but specialized scientific, industrial, legal or safety-critical measurement should use appropriate equipment and procedures.</p>
          </section>

          <div className="mt-10">
          <section key="section-1" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Project purpose</h2>
            <p className="mt-3 text-slate-700 leading-8">TimeCounterPro is organized around one simple problem: people often need to measure or plan time without installing a separate application. The website collects practical browser-based timing tools in one place.</p>
            <p className="mt-3 text-slate-600 leading-8">The project is not intended to replace professional software, medical guidance, financial advice, academic supervision or specialist equipment. Its purpose is narrower and clearer: provide accessible timing interfaces for ordinary activities.</p>
          </section>
          <section key="section-2" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">What a time tool does</h2>
            <p className="mt-3 text-slate-700 leading-8">A timing tool gives you a way to define or observe a period. A countdown begins from a selected duration and moves toward zero. A stopwatch begins at zero and measures elapsed time upward. A world clock shows local clock time in selected places.</p>
            <p className="mt-3 text-slate-600 leading-8">These are simple concepts, but the useful part is matching the interface to the activity. A student may need a focus cycle, a speaker may need a presentation limit, and a remote worker may need a time-zone comparison. The site separates these use cases so visitors can understand what each page is for.</p>
          </section>
          <section key="section-3" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Browser-first design</h2>
            <p className="mt-3 text-slate-700 leading-8">The tools are designed to run in a modern web browser. This makes them convenient when a visitor is using a desktop computer, laptop, tablet or phone and does not want to install another application for a small timing task.</p>
            <p className="mt-3 text-slate-600 leading-8">Browser behavior can still vary by device and operating system. Sound playback, background behavior, screen locking, notifications and power-saving rules can affect how a web timer behaves. Users should test important timing tasks on their own device before relying on them for critical events.</p>
          </section>
          <section key="section-4" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Simple interfaces</h2>
            <p className="mt-3 text-slate-700 leading-8">A timer is most useful when its controls are understandable. TimeCounterPro aims to keep the main action visible: choose a duration or mode, start the tool, pause or reset when appropriate, and observe the result.</p>
            <p className="mt-3 text-slate-600 leading-8">Simple does not mean every tool has identical controls. A Pomodoro session needs work and break phases, a stopwatch needs elapsed-time controls, and a world clock needs city or time-zone information. Each page therefore focuses on the controls that make sense for that task.</p>
          </section>
          <section key="section-5" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Who can use the site</h2>
            <p className="mt-3 text-slate-700 leading-8">The tools can be useful to students, teachers, remote workers, developers, writers, presenters, streamers, athletes, hobbyists, gamers, travelers and anyone who needs a visible time reference.</p>
            <p className="mt-3 text-slate-600 leading-8">The examples on this page are use cases rather than promises that a particular tool will improve performance. Results depend on how the tool is used, the device, the task and the user's own routine.</p>
          </section>
          <section key="section-6" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Students</h2>
            <p className="mt-3 text-slate-700 leading-8">Students can use timing tools to divide study into manageable sessions, practice mock examinations, coordinate group revision and monitor how long a task takes.</p>
            <p className="mt-3 text-slate-600 leading-8">A timer can help make a study session concrete, but it does not replace learning methods, subject knowledge or teacher guidance. For exam practice, users should follow the time rules and conditions that apply to their own course or examination.</p>
          </section>
          <section key="section-7" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Teachers and presenters</h2>
            <p className="mt-3 text-slate-700 leading-8">A presentation timer can help speakers rehearse a lesson, speech, class activity or demonstration. The purpose is to make elapsed time visible while practicing.</p>
            <p className="mt-3 text-slate-600 leading-8">The final timing requirement should always come from the event organizer, institution or assignment instructions. A browser timer is a convenience tool, not an authority on the permitted duration.</p>
          </section>
          <section key="section-8" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Remote teams</h2>
            <p className="mt-3 text-slate-700 leading-8">Remote teams often work across cities and countries. A world clock can make local-time differences easier to see before someone proposes a meeting time.</p>
            <p className="mt-3 text-slate-600 leading-8">Time-zone rules can change because of daylight-saving policies and local government decisions. For important meetings, users should confirm the local time with their calendar or communication platform as well.</p>
          </section>
          <section key="section-9" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Fitness and intervals</h2>
            <p className="mt-3 text-slate-700 leading-8">Interval tools can provide a sequence of work and rest periods for general workouts. They can make a planned interval structure easier to follow without manually checking a clock.</p>
            <p className="mt-3 text-slate-600 leading-8">The site does not assess fitness level, injury risk, exercise safety or medical suitability. Anyone with health concerns should follow appropriate professional advice and should stop an activity if it feels unsafe.</p>
          </section>
          <section key="section-10" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Gaming and esports</h2>
            <p className="mt-3 text-slate-700 leading-8">Gaming-focused timing pages are designed around practical timing during practice or play. They can help a player observe intervals, splits or session duration without leaving the game workflow for a separate clock.</p>
            <p className="mt-3 text-slate-600 leading-8">Game mechanics, rules and timing values can change between games and versions. Users should verify game-specific information from the official game or competition source when accuracy about a game rule matters.</p>
          </section>
          <section key="section-11" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Streaming and broadcasting</h2>
            <p className="mt-3 text-slate-700 leading-8">A stream countdown can help creators prepare an audience-facing start or other scheduled moment. It is useful when a clear visual countdown is part of a broadcast workflow.</p>
            <p className="mt-3 text-slate-600 leading-8">The website cannot control the streaming platform itself. Streamers should verify the platform's own stream status, scheduling information and moderation controls separately.</p>
          </section>
          <section key="section-12" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Personal routines</h2>
            <p className="mt-3 text-slate-700 leading-8">A countdown can be useful for cooking, cleaning, reading, breaks, practice, meetings and other everyday activities. The value comes from making the intended duration visible.</p>
            <p className="mt-3 text-slate-600 leading-8">For safety-critical activities such as cooking with heat or machinery, a browser timer should not be the only safeguard. Follow the relevant safety instructions and remain attentive to the activity itself.</p>
          </section>
          <section key="section-13" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Accessibility and readability</h2>
            <p className="mt-3 text-slate-700 leading-8">Clear headings, descriptive labels, readable text and predictable controls help visitors understand a tool before they use it. Responsive layouts also allow the interface to adapt to different screen sizes.</p>
            <p className="mt-3 text-slate-600 leading-8">Accessibility is an ongoing project rather than a claim of perfect compatibility. Browser zoom, screen readers, keyboard behavior, contrast settings and device-specific accessibility features can affect the experience. Feedback about barriers is useful for future improvements.</p>
          </section>
          <section key="section-14" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Mobile use</h2>
            <p className="mt-3 text-slate-700 leading-8">On a phone, a timer is often used while the device is being held or placed nearby. Large controls and responsive layout can make a timing page easier to operate on a smaller screen.</p>
            <p className="mt-3 text-slate-600 leading-8">Mobile operating systems may suspend background browser activity, restrict autoplay audio or reduce power use. For a critical deadline, keep the page active and confirm that the chosen sound or alert behavior works on the device.</p>
          </section>
          <section key="section-15" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Desktop use</h2>
            <p className="mt-3 text-slate-700 leading-8">Desktop browsers provide more screen space for controls, instructions and multi-city displays. They can be convenient for study, work, streaming and remote collaboration.</p>
            <p className="mt-3 text-slate-600 leading-8">Browser tabs can be suspended or affected by system power settings. If a timer matters for a live event, users should test the page and device configuration before the event starts.</p>
          </section>
          <section key="section-16" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Privacy approach</h2>
            <p className="mt-3 text-slate-700 leading-8">Privacy information should be specific rather than absolute. A modern website may use local browser storage, hosting infrastructure, analytics, advertising technology or other third-party services depending on its configuration.</p>
            <p className="mt-3 text-slate-600 leading-8">TimeCounterPro's Privacy Policy is the authoritative page for current data practices. Visitors should read it when they want details about cookies, local storage, analytics, advertising, contact information and third-party processing.</p>
          </section>
          <section key="section-17" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Local browser storage</h2>
            <p className="mt-3 text-slate-700 leading-8">Some web features may save preferences or history locally in the browser so the interface can remember a setting between visits. Local storage is controlled by the browser and can be cleared by the user.</p>
            <p className="mt-3 text-slate-600 leading-8">Clearing browser data, using private browsing or changing device settings can remove locally stored information. The availability and exact behavior of a feature may therefore differ between devices.</p>
          </section>
          <section key="section-18" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Advertising</h2>
            <p className="mt-3 text-slate-700 leading-8">If advertising is displayed on the website, ads are provided separately from the timing function. Advertising availability, placement and eligibility can change as the site evolves.</p>
            <p className="mt-3 text-slate-600 leading-8">Advertising should never be treated as part of a timer's measurement result. Users should evaluate advertisements independently and use the site's tools for their intended timing purpose.</p>
          </section>
          <section key="section-19" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">No unnecessary account</h2>
            <p className="mt-3 text-slate-700 leading-8">Many basic timing tasks do not require an account. This reduces friction for visitors who simply want to open a tool and use it.</p>
            <p className="mt-3 text-slate-600 leading-8">Features that require or benefit from stored information should be explained by the relevant page and privacy documentation. Users should not assume that every browser feature behaves identically when they are signed in, signed out or using private browsing.</p>
          </section>
          <section key="section-20" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Accuracy of time</h2>
            <p className="mt-3 text-slate-700 leading-8">A countdown or stopwatch depends on browser and device timing mechanisms. For ordinary activities, this is usually sufficient, but web timing is not the same as laboratory-grade instrumentation.</p>
            <p className="mt-3 text-slate-600 leading-8">For high-precision scientific, industrial, legal or safety-critical measurement, use equipment and procedures designed for that purpose. TimeCounterPro is a general web utility.</p>
          </section>
          <section key="section-21" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Time zones</h2>
            <p className="mt-3 text-slate-700 leading-8">World-clock tools help users compare local clock times, but time-zone information is a living area of data. Local rules can change and different systems can update their time-zone databases at different times.</p>
            <p className="mt-3 text-slate-600 leading-8">When a meeting has financial, legal, travel or operational consequences, confirm the final time with an authoritative calendar, organizer or official local source.</p>
          </section>
          <section key="section-22" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Why purpose-specific pages matter</h2>
            <p className="mt-3 text-slate-700 leading-8">A general timer can technically measure many activities, but a purpose-specific page can explain the relevant workflow before the user starts. That makes the tool easier to understand for someone who is unfamiliar with it.</p>
            <p className="mt-3 text-slate-600 leading-8">Purpose-specific pages should still avoid pretending that a timer is a complete solution. The site describes what each page does and leaves the actual decision about how to use it to the visitor.</p>
          </section>
          <section key="section-23" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Choosing a countdown</h2>
            <p className="mt-3 text-slate-700 leading-8">Choose a countdown when you know the amount of time you want to spend. Examples include a ten-minute break, a study block, a cooking interval or a presentation rehearsal.</p>
            <p className="mt-3 text-slate-600 leading-8">If the activity must finish at a real-world deadline, also consider the time needed for setup, transitions and device delays. The countdown only measures the interval you give it.</p>
          </section>
          <section key="section-24" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Choosing a stopwatch</h2>
            <p className="mt-3 text-slate-700 leading-8">Choose a stopwatch when you want to discover how long an activity takes rather than starting with a fixed limit. It can be useful for sports practice, cooking experiments, reading speed or task measurement.</p>
            <p className="mt-3 text-slate-600 leading-8">A stopwatch result is descriptive. It tells you the elapsed interval recorded by the page; it does not automatically explain why the activity took that long or whether the result is good.</p>
          </section>
          <section key="section-25" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Choosing Pomodoro</h2>
            <p className="mt-3 text-slate-700 leading-8">Choose the Pomodoro page when repeated work and break cycles match your routine. It can be useful for study, coding, writing, reading and other tasks where regular breaks are part of the plan.</p>
            <p className="mt-3 text-slate-600 leading-8">Pomodoro is a time-management technique, not a guarantee of productivity. Users can adjust their routine to their own task, environment and schedule.</p>
          </section>
          <section key="section-26" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Choosing a mock-test timer</h2>
            <p className="mt-3 text-slate-700 leading-8">Choose the mock-test page when you want to practice answering questions under a defined time limit. This can make pacing part of the practice session.</p>
            <p className="mt-3 text-slate-600 leading-8">Practice conditions should match the actual examination rules when possible. The timer does not know the official time limit unless the user sets it correctly.</p>
          </section>
          <section key="section-27" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Choosing group study</h2>
            <p className="mt-3 text-slate-700 leading-8">A group study timer can provide a shared timing reference when several people agree on the same start and stop times. It can reduce the need for one person to repeatedly announce the schedule.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool cannot guarantee that every participant sees or hears the same event at the same instant because networks and devices vary. Group members should confirm the session plan in their normal communication channel.</p>
          </section>
          <section key="section-28" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Choosing a presentation timer</h2>
            <p className="mt-3 text-slate-700 leading-8">A presentation timer is useful during rehearsal when a speaker needs to know whether a talk fits within the planned duration. It can also provide a simple visual reference during practice.</p>
            <p className="mt-3 text-slate-600 leading-8">The speaker should still use the event organizer's official time limit. Rehearsal timing can change when questions, demonstrations or audience interaction are included.</p>
          </section>
          <section key="section-29" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Choosing a world clock</h2>
            <p className="mt-3 text-slate-700 leading-8">Choose a world clock when the question is 'What time is it there?' or 'What is the difference between these cities?'. It is especially useful for international communication.</p>
            <p className="mt-3 text-slate-600 leading-8">A city label represents a time zone, not necessarily a single geographic point. For travel or legal appointments, confirm the final local time with the destination's official information.</p>
          </section>
          <section key="section-30" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Using a timer responsibly</h2>
            <p className="mt-3 text-slate-700 leading-8">A timer is a support tool. It should make a plan visible rather than becoming the only thing you pay attention to. When the task itself has safety requirements, those requirements remain more important than the countdown.</p>
            <p className="mt-3 text-slate-600 leading-8">Users should also account for device volume, browser permissions, power state and connectivity where relevant. A tool cannot compensate for a muted device or an operating system that has suspended the browser.</p>
          </section>
          <section key="section-31" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Feedback and improvements</h2>
            <p className="mt-3 text-slate-700 leading-8">A useful web project changes over time. Visitors may discover confusing labels, broken links, layout issues, device-specific behavior or missing explanations that were not obvious during development.</p>
            <p className="mt-3 text-slate-600 leading-8">The Contact page is the appropriate place to report a problem or suggest an improvement. Specific information such as the page, device, browser and steps that caused the issue can make troubleshooting easier.</p>
          </section>
          <section key="section-32" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Content standards</h2>
            <p className="mt-3 text-slate-700 leading-8">The informational text on TimeCounterPro is intended to explain the tools and their practical use. It should not make unsupported promises about health, productivity, performance, income or guaranteed outcomes.</p>
            <p className="mt-3 text-slate-600 leading-8">Where a topic involves safety, health, privacy or another specialist area, the site should distinguish general timing information from professional guidance. Visitors should use authoritative sources for decisions that require specialist expertise.</p>
          </section>
          <section key="section-33" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Maintenance</h2>
            <p className="mt-3 text-slate-700 leading-8">Maintaining a smaller set of useful pages makes it easier to review links, descriptions, metadata and functionality. Removing obsolete generated pages can also reduce confusion when a visitor encounters an old bookmark.</p>
            <p className="mt-3 text-slate-600 leading-8">The project may change its tools, interface or navigation as it is maintained. A current page should be treated as more reliable than an old screenshot, cached page or third-party description.</p>
          </section>
          <section key="section-34" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Why old generated pages were removed</h2>
            <p className="mt-3 text-slate-700 leading-8">The project previously used many duration-specific URLs. A large collection of near-identical pages can make navigation harder and can provide little additional value when the underlying function is the same.</p>
            <p className="mt-3 text-slate-600 leading-8">The current structure focuses on maintained tools and explanatory pages. The goal is to make each indexed page understandable and useful rather than creating a separate page for every possible duration.</p>
          </section>
          <section key="section-35" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Navigation philosophy</h2>
            <p className="mt-3 text-slate-700 leading-8">A visitor should be able to understand the site's main purpose from the home page and move to important informational pages such as About, Contact, Privacy and Terms without encountering dead navigation.</p>
            <p className="mt-3 text-slate-600 leading-8">Tool pages are linked where the destination is a real, maintained route. Obsolete generated paths are not presented as current features.</p>
          </section>
          <section key="section-36" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">About this page</h2>
            <p className="mt-3 text-slate-700 leading-8">This About page explains what TimeCounterPro is, what its tools are designed to do, who may find them useful, how browser timing behaves and where visitors can learn about privacy and support.</p>
            <p className="mt-3 text-slate-600 leading-8">It is intentionally more detailed than a short marketing introduction. The aim is to give a visitor enough context to understand the project before using its tools.</p>
          </section>
          <section key="section-37" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Custom Countdown overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Set a duration for a task, event, meeting, practice session, cooking task, study block or any other activity that needs a clear end point.</p>
            <p className="mt-3 text-slate-600 leading-8">The Custom Countdown page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-38" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Custom Countdown practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Custom Countdown is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-39" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Custom Countdown limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Custom Countdown tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-40" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Pomodoro overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Use repeating focus and break periods for study, coding, reading, writing and other work where structured sessions are useful.</p>
            <p className="mt-3 text-slate-600 leading-8">The Pomodoro page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-41" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Pomodoro practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Pomodoro is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-42" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Pomodoro limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Pomodoro tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-43" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Stopwatch overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Measure elapsed time upward and use the timing result when you need to understand how long an activity takes.</p>
            <p className="mt-3 text-slate-600 leading-8">The Stopwatch page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-44" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Stopwatch practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Stopwatch is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-45" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Stopwatch limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Stopwatch tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-46" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">World Clock overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Compare the current local time in different cities when arranging calls, meetings, travel plans or remote collaboration.</p>
            <p className="mt-3 text-slate-600 leading-8">The World Clock page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-47" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">World Clock practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for World Clock is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-48" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">World Clock limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The World Clock tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-49" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">HIIT and Tabata overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Create work and rest intervals for structured interval exercise. The tool measures time and does not provide medical advice.</p>
            <p className="mt-3 text-slate-600 leading-8">The HIIT and Tabata page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-50" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">HIIT and Tabata practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for HIIT and Tabata is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-51" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">HIIT and Tabata limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The HIIT and Tabata tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-52" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Mock Test overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Practice an examination under a chosen time limit so you can become familiar with pacing and time awareness.</p>
            <p className="mt-3 text-slate-600 leading-8">The Mock Test page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-53" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Mock Test practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Mock Test is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-54" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Mock Test limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Mock Test tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-55" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Group Study overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Coordinate shared study periods when several people want the same start and end timing.</p>
            <p className="mt-3 text-slate-600 leading-8">The Group Study page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-56" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Group Study practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Group Study is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-57" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Group Study limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Group Study tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-58" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Presentation overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Keep a presentation, speech, lesson or rehearsal inside a planned duration.</p>
            <p className="mt-3 text-slate-600 leading-8">The Presentation page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-59" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Presentation practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Presentation is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-60" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Presentation limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Presentation tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-61" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Stream Countdown overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Prepare a visible countdown for livestreams, broadcasts and stream preparation.</p>
            <p className="mt-3 text-slate-600 leading-8">The Stream Countdown page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-62" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Stream Countdown practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Stream Countdown is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-63" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Stream Countdown limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Stream Countdown tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-64" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Esports Jungle overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Track game-related timing events during practice and gameplay. It is a general timing utility, not a source of game-policy information.</p>
            <p className="mt-3 text-slate-600 leading-8">The Esports Jungle page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-65" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Esports Jungle practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Esports Jungle is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-66" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Esports Jungle limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Esports Jungle tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-67" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Speedrun Split overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Measure elapsed attempts and splits when practicing routes or comparing personal runs.</p>
            <p className="mt-3 text-slate-600 leading-8">The Speedrun Split page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-68" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Speedrun Split practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Speedrun Split is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-69" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Speedrun Split limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Speedrun Split tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-70" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Gameplay overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Use a simple timing tool for gaming sessions, challenges and practice activities.</p>
            <p className="mt-3 text-slate-600 leading-8">The Gameplay page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-71" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Gameplay practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Gameplay is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-72" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Gameplay limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Gameplay tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-73" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Fasting Tracker overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Measure the elapsed duration of a fasting interval. It does not determine whether fasting is suitable for a person.</p>
            <p className="mt-3 text-slate-600 leading-8">The Fasting Tracker page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-74" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Fasting Tracker practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for Fasting Tracker is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-75" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">Fasting Tracker limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The Fasting Tracker tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          <section key="section-76" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">World Clock Board overview</h2>
            <p className="mt-3 text-slate-700 leading-8">Keep several cities visible together when working with people in different time zones.</p>
            <p className="mt-3 text-slate-600 leading-8">The World Clock Board page is intended to be used directly in a browser. Read the instructions on that page before starting an important session, and verify that the controls and alerts behave as expected on your device.</p>
          </section>
          <section key="section-77" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">World Clock Board practical workflow</h2>
            <p className="mt-3 text-slate-700 leading-8">A practical workflow for World Clock Board is to first identify the activity, decide what timing information you need, open the relevant tool, choose the settings, and start only when you are ready to measure the intended interval.</p>
            <p className="mt-3 text-slate-600 leading-8">When the session ends, use the result as a reference for the activity rather than as a professional assessment. If the timing affects a deadline, appointment or safety-sensitive task, confirm the relevant external requirement as well.</p>
          </section>
          <section key="section-78" className="border-b border-slate-200 py-8">
            <h2 className="text-2xl font-bold text-slate-900">World Clock Board limitations</h2>
            <p className="mt-3 text-slate-700 leading-8">The World Clock Board tool is a browser utility and therefore depends on the browser, operating system and device on which it is running. Audio, visibility, background execution and power-management behavior may vary.</p>
            <p className="mt-3 text-slate-600 leading-8">The tool does not know the full context of the user's activity. It measures or displays the time requested by the user; it does not independently validate the task, event rules, medical suitability or expected outcome.</p>
          </section>
          </div>

          <section className="mt-12 border-t border-slate-200 pt-10">
            <h2 className="text-3xl font-bold text-slate-950">Frequently asked questions</h2>
            <p className="mt-3 max-w-3xl leading-8 text-slate-600">The answers below cover common questions about the project, browser behavior, privacy, timing limitations and the different use cases described above.</p>
            <div className="mt-6 grid gap-4">
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">What is TimeCounterPro?</summary>
            <p className="mt-3 text-slate-600 leading-7">TimeCounterPro is a collection of browser-based timing tools for countdowns, elapsed time, focused sessions, time-zone comparison and purpose-specific activities.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Do I need an account?</summary>
            <p className="mt-3 text-slate-600 leading-7">Most basic tools are designed to be usable without an account. Check the relevant page and Privacy Policy for current feature behavior.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Is the website free?</summary>
            <p className="mt-3 text-slate-600 leading-7">Core tools are provided for free at the time of writing. Features and site configuration can change over time.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can I use it on a phone?</summary>
            <p className="mt-3 text-slate-600 leading-7">Yes, the site is designed to adapt to common mobile screen sizes, although browser and operating-system behavior can affect audio and background execution.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can I use it on a computer?</summary>
            <p className="mt-3 text-slate-600 leading-7">Yes. A modern desktop browser is a suitable environment for the site's browser-based tools.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">What is a countdown?</summary>
            <p className="mt-3 text-slate-600 leading-7">A countdown begins with a chosen duration and decreases toward zero.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">What is a stopwatch?</summary>
            <p className="mt-3 text-slate-600 leading-7">A stopwatch starts from zero and measures elapsed time upward.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Which tool is useful for study?</summary>
            <p className="mt-3 text-slate-600 leading-7">Pomodoro can structure focus and break periods, while the Mock Test Timer can be used for exam-style practice.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Which tool is useful for presentations?</summary>
            <p className="mt-3 text-slate-600 leading-7">The Presentation Timer is designed for rehearsing or monitoring a planned presentation duration.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Which tool is useful for international meetings?</summary>
            <p className="mt-3 text-slate-600 leading-7">The World Clock and World Clock Board are designed to compare local times in multiple places.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Does the site give medical advice?</summary>
            <p className="mt-3 text-slate-600 leading-7">No. Timing pages are general utilities. Health-related decisions should be based on appropriate professional guidance.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Is the fasting tracker medical software?</summary>
            <p className="mt-3 text-slate-600 leading-7">No. It measures the duration of a user-defined interval and does not determine whether fasting is appropriate.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Are workout timers medical advice?</summary>
            <p className="mt-3 text-slate-600 leading-7">No. Interval timers measure the schedule chosen by the user and do not assess health, fitness or injury risk.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can a browser timer be laboratory-grade?</summary>
            <p className="mt-3 text-slate-600 leading-7">No. General web timing should not be treated as laboratory or industrial measurement equipment.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Why can audio behave differently?</summary>
            <p className="mt-3 text-slate-600 leading-7">Browsers and operating systems can restrict autoplay, background activity or audio when a page is inactive or a device is in a power-saving state.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Why should I test a timer before an important event?</summary>
            <p className="mt-3 text-slate-600 leading-7">Testing confirms that the chosen duration, sound, screen behavior and device settings work as expected before the real session.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Does the site store preferences?</summary>
            <p className="mt-3 text-slate-600 leading-7">Some browser features may use local storage. The Privacy Policy describes current storage and data practices in more detail.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can I clear local data?</summary>
            <p className="mt-3 text-slate-600 leading-7">Browser settings normally allow users to clear site data. Clearing it may reset preferences or local history.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">What happens in private browsing?</summary>
            <p className="mt-3 text-slate-600 leading-7">Private browsing can change or remove local storage and other browser behavior after the session ends.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Why were many old pages removed?</summary>
            <p className="mt-3 text-slate-600 leading-7">The project was reorganized to focus on a smaller set of maintained tools instead of many near-duplicate duration pages.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Will an old bookmarked page always work?</summary>
            <p className="mt-3 text-slate-600 leading-7">No. A page that was removed or renamed may no longer exist. Current navigation should point to maintained pages.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can I request a new feature?</summary>
            <p className="mt-3 text-slate-600 leading-7">Yes. Use the Contact page and describe the proposed feature and the problem it would solve.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">How do I report a broken page?</summary>
            <p className="mt-3 text-slate-600 leading-7">Use the Contact page and include the page address, browser or device and the steps that reproduce the issue when possible.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can I rely on the timer for a safety-critical task?</summary>
            <p className="mt-3 text-slate-600 leading-7">A general web timer should not be the only safeguard for a safety-critical task. Follow the relevant safety procedures and use appropriate equipment.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can I use it while cooking?</summary>
            <p className="mt-3 text-slate-600 leading-7">Yes for ordinary timing, but remain attentive to the cooking process and follow appliance and food-safety instructions.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can I use it for exams?</summary>
            <p className="mt-3 text-slate-600 leading-7">You can use the Mock Test Timer for practice, but official examinations should follow the organizer's approved timing system and rules.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can I use it for live streaming?</summary>
            <p className="mt-3 text-slate-600 leading-7">The Stream Countdown can provide a browser-based countdown, while the streaming platform remains responsible for the actual broadcast state.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can I use it for gaming?</summary>
            <p className="mt-3 text-slate-600 leading-7">Yes, the gaming-focused pages are designed for timing practice and sessions, but game-specific rules should be checked from the relevant official source.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Can I compare two cities?</summary>
            <p className="mt-3 text-slate-600 leading-7">World-clock tools can help compare local times, but important appointments should be confirmed with an authoritative calendar or organizer.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Why can time-zone differences change during the year?</summary>
            <p className="mt-3 text-slate-600 leading-7">Some regions use daylight-saving rules while others do not, so the difference between two places can change depending on the date.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Does the site replace a calendar?</summary>
            <p className="mt-3 text-slate-600 leading-7">No. A timer measures a duration or displays time; a calendar is better for scheduling dates and appointments.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Does the site replace a stopwatch device?</summary>
            <p className="mt-3 text-slate-600 leading-7">For ordinary timing a browser stopwatch can be convenient, but specialized measurement tasks may require dedicated equipment.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Does the site work offline?</summary>
            <p className="mt-3 text-slate-600 leading-7">Some browser behavior may continue after a page is loaded, but users should not assume every feature works offline unless the page explicitly supports it.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">What if my device goes to sleep?</summary>
            <p className="mt-3 text-slate-600 leading-7">Power-saving behavior can affect web timers. Keep the device awake for important sessions and test the behavior first.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">What if the browser tab is backgrounded?</summary>
            <p className="mt-3 text-slate-600 leading-7">Browsers may throttle background pages. For important timing, keep the page visible and verify its behavior on your device.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Why is clear labeling important?</summary>
            <p className="mt-3 text-slate-600 leading-7">A visitor should know what a tool does before starting it. Clear labels reduce confusion and make the site easier to use.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Why is a smaller tool library useful?</summary>
            <p className="mt-3 text-slate-600 leading-7">A focused library is easier to maintain, review and navigate than hundreds of nearly identical generated pages.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Where can I read privacy information?</summary>
            <p className="mt-3 text-slate-600 leading-7">Use the site's Privacy page for current information about cookies, local storage, analytics, advertising and related processing.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Where can I read terms?</summary>
            <p className="mt-3 text-slate-600 leading-7">Use the Terms page for the site's current terms and conditions.</p>
          </details>
          <details className="border border-slate-200 rounded-xl p-5 bg-white">
            <summary className="cursor-pointer font-semibold text-slate-900">Where can I contact the site?</summary>
            <p className="mt-3 text-slate-600 leading-7">Use the Contact page for questions, problem reports and feature suggestions.</p>
          </details>
            </div>
          </section>

          <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-slate-950">Important limitations</h2>
            <ul className="mt-4 space-y-3 text-slate-700 leading-7">
              <li>TimeCounterPro is a general browser utility and is not specialized measurement equipment.</li>
              <li>Health, fitness and fasting pages do not provide medical diagnosis, treatment or individualized professional advice.</li>
              <li>Important deadlines, appointments and examination rules should be confirmed with the responsible organizer or authoritative source.</li>
              <li>Browser, device, audio and power-management behavior can affect how a web timer behaves.</li>
              <li>Privacy practices can change as services and site configuration change; the Privacy Policy is the current reference.</li>
            </ul>
          </section>

          <section className="mt-10 border-t border-slate-200 pt-10">
            <h2 className="text-2xl font-bold text-slate-950">Need help?</h2>
            <p className="mt-3 leading-8 text-slate-600">For a problem report or feature suggestion, use the Contact page. For data and privacy questions, read the Privacy Policy. For site-use conditions, read the Terms page.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/contact" className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800">Contact</Link>
              <Link to="/privacy" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white">Privacy Policy</Link>
              <Link to="/terms" className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white">Terms</Link>
            </div>
          </section>

          <footer className="mt-12 border-t border-slate-200 pt-8 text-sm leading-7 text-slate-500">
            <p>TimeCounterPro provides general-purpose timing tools and informational content. The site does not replace professional, medical, legal, financial, safety or official event guidance.</p>
          </footer>
        </article>
      </main>
    </>
  );
}

export default About;
