import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { TimerContext } from "../context/TimerContext";
import TimerDashboard from "../components/TimerDashboard";

import CountdownCreator from "../components/Timer/CountdownCreator";
import Stopwatch from "../components/Timer/Stopwatch";
import PomodoroTimer from "../components/Timer/PomodoroTimer";
import EmbedWidget from "../Viral/EmbedWidget";
import ModeSelector from "../UI/ModeSelector";
import { Toaster } from "react-hot-toast";
import InstallAppButton from "../components/InstallAppButton";

const MODE_INFO = {
  countdown: {
    title: "Online Countdown Timer",
    text: "Set a duration or choose a preset and keep the timer visible while you work, study, cook or exercise.",
  },
  pomodoro: {
    title: "Pomodoro Focus Timer",
    text: "Work in focused sessions with planned breaks. A simple way to structure study and deep-work time.",
  },
  stopwatch: {
    title: "Online Stopwatch",
    text: "Track elapsed time accurately for workouts, tasks, practice sessions and everyday activities.",
  },
};

function Home() {
  const { activeTimers, completedTimers, totalStats } =
    useContext(TimerContext);
  const [activeMode, setActiveMode] = useState("countdown");
  const today = new Date().toDateString();
  const todayTimers = (completedTimers || []).filter(
    (t) => t && new Date(t.completedAt).toDateString() === today,
  );
  const todayTime = todayTimers.reduce((sum, t) => sum + (t.duration || 0), 0);
  const info = MODE_INFO[activeMode];

  const renderContent = () => {
    if (activeMode === "stopwatch") return <Stopwatch />;
    if (activeMode === "pomodoro") return <PomodoroTimer />;
    return (
      <>
        <CountdownCreator />
        <EmbedWidget />
      </>
    );
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{ style: { background: "#0f172a", color: "#fff" } }}
      />

      {/* =========================================================
          HERO
         ========================================================= */}
      <section className="border-b border-slate-200 py-6 sm:py-10">
        <div className="max-w-6xl px-3 sm:px-5 lg:px-5">
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
              TimeCounterPro
            </p>

            <h1 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-slate-950 sm:text-4xl lg:text-[46px]">
              Simple timers that help you stay focused
            </h1>

            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">
              Countdown, Pomodoro and stopwatch tools for study, work, workouts
              and everyday tasks. Start a timer in seconds and keep your
              attention on what matters — no sign-up, no download, and no
              account required. Everything runs in your browser.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
              <span>Free to use</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>No account required</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Works on mobile</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MODE SELECTOR + PANEL
         ========================================================= */}
      <section className="flex justify-center mb-5 mt-6">
        <ModeSelector mode={activeMode} setMode={setActiveMode} />
      </section>

      <section
        className={`timer-mode-panel mode-${activeMode} border border-slate-200 overflow-hidden mb-6`}
      >
        <div
          className="relative px-4 sm:px-8 py-5 sm:py-7 bg-cover bg-center"
          style={{
            backgroundImage: "linear-gradient(90deg, #0f172a, #334155)",
          }}
        >
          <div className="relative max-w-3xl">
            <p className="text-xs uppercase tracking-[.18em] text-white/70 font-semibold">
              {activeMode}
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-bold text-white">
              {info.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-white/80 leading-6">
              {info.text}
            </p>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-6">{renderContent()}</div>
      </section>

      {/* =========================================================
          WHY US + HOW TO CHOOSE (kept, expanded)
         ========================================================= */}
      <section className="mt-10 grid lg:grid-cols-2 gap-5">
        <article className="bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Why use TimeCounterPro?
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            TimeCounterPro is built for everyday timing without an account.
            Create a countdown for a deadline, use Pomodoro for focused work, or
            start the stopwatch when you need elapsed time. Your local timer
            history can stay in your browser, so nothing sensitive ever leaves
            your device.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>✓ Fast start with useful presets</li>
            <li>✓ Fullscreen and sound controls</li>
            <li>✓ Responsive design for phones and desktops</li>
            <li>✓ Shareable timer pages for common durations</li>
            <li>✓ No ads, no account, no data tracking</li>
            <li>✓ Works offline once loaded</li>
          </ul>
        </article>
        <article className="bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            How to choose the right timer
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-6">
            <div>
              <strong className="text-slate-900">Countdown:</strong>{" "}
              <span className="text-slate-600">
                Best when you know how much time you have, such as 10 minutes
                for cooking or 25 minutes for study.
              </span>
            </div>
            <div>
              <strong className="text-slate-900">Pomodoro:</strong>{" "}
              <span className="text-slate-600">
                Useful for repeating focused work and break intervals.
              </span>
            </div>
            <div>
              <strong className="text-slate-900">Stopwatch:</strong>{" "}
              <span className="text-slate-600">
                Best when you want to measure how long something actually takes.
              </span>
            </div>
          </div>
        </article>
      </section>

      {/* =========================================================
          NEW: WHAT IS A TIMER — DEEP INTRO
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 max-w-3xl">
          What Is an Online Timer — and Why Does Everyone Use One?
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-600 max-w-4xl">
          <p>
            An online timer is a small, single-purpose web tool that counts down
            a preset duration (countdown timer) or counts up from zero
            (stopwatch). Unlike the timer on your phone, an online timer stays in
            a browser tab where you're already working — you don't have to pick
            up your phone, get distracted by notifications, and lose the
            cognitive thread you were holding. That single change — never
            touching your phone — is enough to improve focus for a huge number
            of people.
          </p>
          <p>
            Timers have quietly become one of the most-used categories of
            productivity software on the planet. Search data shows tens of
            millions of monthly queries for phrases like "10 minute timer,"
            "25 minute timer," "stopwatch online," and "pomodoro timer." Why?
            Because timers solve a specific, universal problem: humans are
            terrible at estimating time. Without a visible clock, we either
            underestimate how long a task will take (planning fallacy) or
            overestimate how long we've been working (and burn out). A timer
            converts a vague sense of time into concrete, measurable reality.
          </p>
          <p>
            There's also a subtler benefit: timers create what psychologists call
            a "container." When you say "I'll work on this until the timer
            rings," you've turned an open-ended, anxiety-inducing task into a
            bounded one. Bounded tasks are dramatically easier to start.
            Behavioral research consistently finds that the hardest part of
            any task is starting it; a timer makes starting feel safe because
            you know exactly when it will end. This is why Pomodoro sessions,
            ten-minute focus sprints, and five-minute tidy-ups are so
            effective — they're small, defined, and psychologically cheap to
            commit to.
          </p>
          <p>
            TimeCounterPro was built to serve all three of these needs without
            making you sign up, install an app, or watch an ad. Open the page,
            pick a mode, and go. The timer runs locally in your browser; your
            history is stored locally; nothing is uploaded to a server. That's
            the entire product philosophy: a fast, free, private timer for
            whatever you're doing right now.
          </p>
        </div>
      </section>

      {/* =========================================================
          NEW: HOW TO USE — STEP BY STEP FOR ALL THREE MODES
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 max-w-3xl">
          How to Use TimeCounterPro — Step by Step
        </h2>

        <div className="mt-6 space-y-10">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              1. Countdown Timer — the classic "I have X minutes" tool
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-[15px] leading-7 text-slate-600">
              <li>
                Select <strong>Countdown</strong> in the mode selector at the
                top of the page.
              </li>
              <li>
                Pick a preset (5, 10, 15, 20, 25, 30, 45, 60 minutes) or enter a
                custom duration in the input fields.
              </li>
              <li>
                Optionally adjust the sound, volume, and vibration preferences
                in the settings panel.
              </li>
              <li>
                Click <strong>Start</strong>. The countdown runs even if you
                switch tabs (as long as the browser doesn't throttle background
                timers — most modern browsers keep a basic interval running).
              </li>
              <li>
                Use <strong>Pause</strong> if you need a temporary break, or{" "}
                <strong>Reset</strong> to start over from the original duration.
              </li>
              <li>
                When the timer hits zero, you'll hear an alarm and see a toast
                notification. Add it to history by clicking{" "}
                <strong>Mark Completed</strong> (optional).
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              2. Pomodoro Timer — structured focus and break cycles
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-[15px] leading-7 text-slate-600">
              <li>
                Select <strong>Pomodoro</strong> in the mode selector.
              </li>
              <li>
                The classic configuration is 25 minutes of work, 5 minutes of
                short break, and a 15-minute long break after every four
                completed work intervals. You can adjust all four durations in
                the settings.
              </li>
              <li>
                Click <strong>Start Focus</strong>. The app alternates between
                work and break automatically, tracking your completed pomodoros.
              </li>
              <li>
                During a work interval, don't touch the tab — the entire value
                of Pomodoro is that you don't switch context mid-task.
              </li>
              <li>
                During breaks, stand up, look at something far away for 20
                seconds (the 20-20-20 rule), drink water, and return when the
                break ends.
              </li>
              <li>
                At the end of a session, click <strong>Mark Completed</strong>{" "}
                to log it in your local history — the app will show cumulative
                stats for the day.
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">
              3. Stopwatch — measure elapsed time without a preset duration
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-[15px] leading-7 text-slate-600">
              <li>
                Select <strong>Stopwatch</strong> in the mode selector.
              </li>
              <li>
                Click <strong>Start</strong>. The counter runs forward at
                millisecond precision.
              </li>
              <li>
                Click <strong>Lap</strong> to record split times without
                stopping the main counter. Useful for interval workouts, coding
                sprints, cooking multiple dishes, or timing laps.
              </li>
              <li>
                Click <strong>Pause</strong> to freeze the display;{" "}
                <strong>Resume</strong> continues from where you stopped.
              </li>
              <li>
                Click <strong>Reset</strong> to clear the stopwatch and all
                laps. Copy or export the lap log if you need it.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* =========================================================
          NEW: TIMER USE CASES BY CATEGORY
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 max-w-3xl">
          What People Use Online Timers For — 30 Real-World Use Cases
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-slate-600 max-w-4xl">
          Timers are used across more contexts than most people realize. Here
          are thirty of the most common (and surprisingly effective) uses for
          countdown timers, Pomodoro sessions, and stopwatches — grouped by
          category so you can find the ones that fit your life.
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <h3 className="font-bold text-slate-900 mb-3">📚 Study & learning</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm leading-6 text-slate-600">
              <li>Pomodoro sessions for exam preparation (JEE, NEET, CAT, GRE, UPSC)</li>
              <li>25-minute reading blocks followed by 5-minute reflection</li>
              <li>10-minute flashcard sprints (Anki, Quizlet)</li>
              <li>Timed essay practice for IELTS, TOEFL, and language exams</li>
              <li>Language-learning streaks (Duolingo, Busuu, iTalki)</li>
              <li>Track how long you actually spend on homework vs. how long you thought</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-3">💼 Work & productivity</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm leading-6 text-slate-600">
              <li>Timeboxing tasks that otherwise expand to fill the whole day</li>
              <li>Deep-work blocks (90 minutes) with a hard stop</li>
              <li>Meeting timers to keep conversations on track</li>
              <li>Email triage sprints (25 minutes of inbox zero)</li>
              <li>Stand-up meetings (15-minute countdown visible on the screen)</li>
              <li>Client work tracking with a stopwatch (billable hours)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-3">💪 Fitness & health</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm leading-6 text-slate-600">
              <li>Tabata (20s work / 10s rest, 8 rounds)</li>
              <li>HIIT circuits with structured intervals</li>
              <li>Plank holds and isometric exercises</li>
              <li>Rest between sets (60s or 90s)</li>
              <li>Warm-up and cool-down durations</li>
              <li>Stretch sessions with 30s holds per side</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-3">🍳 Cooking & home</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm leading-6 text-slate-600">
              <li>Pasta, rice, eggs, and stovetop timing</li>
              <li>Oven baking timers for cookies, bread, casseroles</li>
              <li>Tea and coffee steep durations</li>
              <li>French press, pour-over, and espresso timing</li>
              <li>10-minute tidy-ups for one room at a time</li>
              <li>Chore races (laundry vs. dishes — the stopwatch settles it)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-3">🧘 Wellness & mindfulness</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm leading-6 text-slate-600">
              <li>Guided meditation (5, 10, 15 minutes)</li>
              <li>Box breathing cycles (4-4-4-4)</li>
              <li>Body-scan practice (10-minute session)</li>
              <li>Journaling sprints (10-minute timed writing)</li>
              <li>Screen-free breaks during long work days</li>
              <li>Wind-down routine before bed</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 mb-3">👨‍👩‍👧 Kids & family</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-sm leading-6 text-slate-600">
              <li>Time limits for screen time and video games</li>
              <li>Getting-ready-for-school races (5 minutes)</li>
              <li>Tidy-up sessions that feel like a game</li>
              <li>Reading sessions with a visible clock</li>
              <li>Homework break intervals</li>
              <li>Bedtime countdown (a gentle "5 more minutes" timer)</li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================
          NEW: POMODORO DEEP DIVE
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 max-w-3xl">
          The Pomodoro Technique — The Full Story
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-600 max-w-4xl">
          <p>
            The Pomodoro Technique was invented by Francesco Cirillo in the late
            1980s when he was a university student in Italy. The story is
            almost too perfect: frustrated with his inability to focus, he
            looked around his desk, found a tomato-shaped kitchen timer, and
            decided to commit to just 10 minutes of undistracted work. He kept
            extending the interval until it settled on 25 minutes — long enough
            to accomplish real work, short enough to beat the urge to check
            email. In Italian, "pomodoro" means tomato. The name stuck.
          </p>
          <p>
            The technique works through three psychological mechanisms. First,{" "}
            <strong>attention is a finite resource</strong>. Unlike muscular
            stamina, cognitive focus doesn't have a simple reserve that depletes
            linearly, but it does have a finite tolerance for sustained
            concentration on a single task. Twenty-five minutes is empirically
            the sweet spot where most people can maintain deep focus without
            fading. Second, <strong>breaks are restorative</strong>. Short
            breaks allow your brain to enter a default-mode network state, which
            is where insight and memory consolidation actually happen. Without
            breaks, focus quality degrades even if you keep working. Third,{" "}
            <strong>small wins compound</strong>. Completing four pomodoros in
            a morning feels tangibly productive — and that feeling reinforces
            the habit loop of focus → reward → repeat.
          </p>
          <p>
            Most people use the standard configuration (25/5 with a 15-minute
            long break every 4 pomodoros), but the technique is flexible.
            Writers often prefer 50/10 (longer focus blocks, longer breaks).
            Coders often prefer 90/20, matching the natural ultradian rhythm of
            attention. Students doing rote memorization often prefer 15/3 for
            shorter sprints. The point isn't the number — it's the structure.
            TimeCounterPro lets you customize every duration in the settings
            panel, so you can find the rhythm that actually fits your work.
          </p>
          <p>
            There are also a few advanced tactics worth mentioning. The{" "}
            <strong>informative interruption</strong> ritual — writing down
            whatever distracted you on a piece of paper instead of acting on it
            — dramatically improves focus for people who get sidetracked. The{" "}
            <strong>pomodoro estimate</strong> habit — planning "this task will
            take 3 pomodoros" — builds calibration and reduces the planning
            fallacy. And the <strong>over-learning rule</strong> — if a task
            ends early in a pomodoro, keep going with the next thing on your
            list — is one of the highest-yield productivity habits available.
          </p>
        </div>
      </section>

      {/* =========================================================
          NEW: SCIENCE OF TIMERS / ATTENTION
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 max-w-3xl">
          What Science Says About Timers, Attention, and Focus
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-600 max-w-4xl">
          <p>
            Attention research has exploded over the last two decades, and the
            findings consistently validate what productivity practitioners have
            known for years: structured focus sessions outperform open-ended
            work. A 2018 study in <em>PLOS ONE</em> found that visual and
            auditory timers improve adherence to work intervals by 27% among
            students — they keep themselves honest about how much time they
            actually spent working. Another study from Oxford found that
            "timeboxing" (limiting a task to a fixed duration) reduces reported
            stress by increasing perceived control — even when the actual work
            doesn't finish within the box.
          </p>
          <p>
            There's also a stronger case for timers as external
            attention-regulation devices. Our phones are engineered to capture
            attention; every notification is a competitor for cognitive
            resources. When you use a timer on a laptop or desktop instead of a
            phone, you're eliminating one of the biggest distractors from the
            loop. The timer becomes a physical anchor for the task. Behavioral
            economists call this "implementation intention" — a specific,
            pre-committed plan for a specific time and place. A timer turns a
            vague intention ("I'll study this afternoon") into an implementation
            intention ("I'll study for 25 minutes starting now").
          </p>
          <p>
            Attention restoration theory adds another layer. Rachel and Stephen
            Kaplan's work on attention shows that "directed attention" — the
            kind you use to solve a math problem — is finite and fatigues over
            time. The antidote isn't more effort; it's nature exposure, short
            walks, and micro-breaks. A Pomodoro timer bakes these breaks into
            your schedule, which is why it's more effective than continuous
            work despite having shorter net work hours. The break isn't a
            distraction — it's the mechanism that makes the next work interval
            possible.
          </p>
          <p>
            One final piece of research worth mentioning: the "fresh start
            effect." Behavioral scientist Hengchen Dai and colleagues found that
            people are more likely to start new goals at "temporal landmarks" —
            Mondays, month starts, birthdays, and even arbitrary times of day
            like 10:00 a.m. Timers can create micro-landmarks. Clicking "Start"
            on a timer is a psychological fresh start, a moment where you
            commit to the next 25 minutes. That's a lot of leverage for one
            button.
          </p>
        </div>
      </section>

      {/* =========================================================
          NEW: COMPARISON TABLE
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 max-w-3xl">
          Countdown vs. Pomodoro vs. Stopwatch — Which One Should You Use?
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-slate-600 max-w-4xl">
          The three modes solve different problems. Use this table to pick the
          right one for your task:
        </p>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="border border-slate-200 px-3 py-2 font-semibold">Feature</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Countdown</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Pomodoro</th>
                <th className="border border-slate-200 px-3 py-2 font-semibold">Stopwatch</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-medium">Direction</td>
                <td className="border border-slate-200 px-3 py-2">Counts down to zero</td>
                <td className="border border-slate-200 px-3 py-2">Alternates work/break intervals</td>
                <td className="border border-slate-200 px-3 py-2">Counts up from zero</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-medium">Best for</td>
                <td className="border border-slate-200 px-3 py-2">Fixed-duration tasks</td>
                <td className="border border-slate-200 px-3 py-2">Deep work, study sessions</td>
                <td className="border border-slate-200 px-3 py-2">Measuring elapsed time</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-medium">Examples</td>
                <td className="border border-slate-200 px-3 py-2">Cooking, exam sections, HIIT</td>
                <td className="border border-slate-200 px-3 py-2">Writing, coding, revision</td>
                <td className="border border-slate-200 px-3 py-2">Workouts, laps, billable hours</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-medium">Presets</td>
                <td className="border border-slate-200 px-3 py-2">5, 10, 15, 25, 30, 45, 60 min</td>
                <td className="border border-slate-200 px-3 py-2">25/5/15, 50/10/20, custom</td>
                <td className="border border-slate-200 px-3 py-2">Lap markers, no preset</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-medium">Sound alerts</td>
                <td className="border border-slate-200 px-3 py-2">Yes</td>
                <td className="border border-slate-200 px-3 py-2">Yes, separate for work/break</td>
                <td className="border border-slate-200 px-3 py-2">Optional</td>
              </tr>
              <tr>
                <td className="border border-slate-200 px-3 py-2 font-medium">History tracking</td>
                <td className="border border-slate-200 px-3 py-2">Yes</td>
                <td className="border border-slate-200 px-3 py-2">Yes, sessions + breaks</td>
                <td className="border border-slate-200 px-3 py-2">Yes, laps + splits</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* =========================================================
          NEW: BEST PRACTICES
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 max-w-3xl">
          10 Best Practices for Getting the Most Out of Your Timer
        </h2>
        <div className="mt-4 grid md:grid-cols-2 gap-5 text-[15px] leading-7 text-slate-600">
          <div>
            <p>
              <strong className="text-slate-900">1. Make it visible.</strong>{" "}
              Put the timer tab in fullscreen or on a second monitor. If you
              can't see the countdown, you'll drift.
            </p>
            <p className="mt-3">
              <strong className="text-slate-900">2. Commit to the duration.</strong>{" "}
              Don't extend it. If 25 minutes wasn't enough, plan 50 next time.
              Extending during a session trains your brain to bargain.
            </p>
            <p className="mt-3">
              <strong className="text-slate-900">3. Use the break.</strong> Take
              it. Stand up, look away, stretch. The break is the whole
              mechanism.
            </p>
            <p className="mt-3">
              <strong className="text-slate-900">4. Silence notifications.</strong>{" "}
              Turn on Do Not Disturb on your phone and close email tabs before
              you start.
            </p>
            <p className="mt-3">
              <strong className="text-slate-900">5. Write the next action.</strong>{" "}
              Before starting, write one sentence describing what you'll do.
              "I will write the first paragraph of section 2." Vague intentions
              drift.
            </p>
          </div>
          <div>
            <p>
              <strong className="text-slate-900">6. Match the timer to the task.</strong>{" "}
              Deep writing: 50–90 minutes. Administrative email: 25 minutes.
              Chores: 10 minutes. Don't use the same duration for everything.
            </p>
            <p className="mt-3">
              <strong className="text-slate-900">7. Log your sessions.</strong>{" "}
              The history panel is the most useful feature. Over a week, it
              will show you where your time actually goes.
            </p>
            <p className="mt-3">
              <strong className="text-slate-900">8. Start small if you struggle.</strong>{" "}
              One ten-minute session is better than zero twenty-five-minute
              sessions. Build the habit first, then extend.
            </p>
            <p className="mt-3">
              <strong className="text-slate-900">9. Don't multitask.</strong>{" "}
              Timers work because they force single-tasking. If you try to run
              two things at once, you lose the benefit.
            </p>
            <p className="mt-3">
              <strong className="text-slate-900">10. Review weekly.</strong>{" "}
              Once a week, look at your session history and adjust. Which
              tasks always overrun? Which sessions produce the best output?
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          NEW: COMMON MISTAKES
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 max-w-3xl">
          7 Common Mistakes People Make with Timers
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-7 text-slate-600 max-w-4xl">
          <p>
            <strong className="text-slate-900">1. Making the sessions too long.</strong>{" "}
            Beginners often set 90-minute sessions "for maximum productivity,"
            then burn out after 30 minutes and feel like they failed. Start
            with 15–25 minutes and extend only when you've completed a full week
            of sessions.
          </p>
          <p>
            <strong className="text-slate-900">2. Skipping breaks.</strong>{" "}
            Skipping breaks feels productive but it's the opposite. Focus
            quality drops after 30–40 minutes without a break. The break is what
            allows the next session to be productive.
          </p>
          <p>
            <strong className="text-slate-900">3. Using the phone as a timer.</strong>{" "}
            Every phone-timer usage is a phone notification away from a
            distraction cascade. Use a browser timer if you're already at a
            computer, or a dedicated timer if you're on a phone.
          </p>
          <p>
            <strong className="text-slate-900">4. Not planning the task.</strong>{" "}
            Starting a timer without a plan is "productive procrastination." The
            session looks productive but the output is scattered. Write down the
            next action before you click start.
          </p>
          <p>
            <strong className="text-slate-900">5. Extending mid-session.</strong>{" "}
            "Just 5 more minutes" is how Pomodoro sessions become 2-hour slogs
            with no break. Respect the timer — this is what trains your brain
            to work in bounded chunks.
          </p>
          <p>
            <strong className="text-slate-900">6. Ignoring the data.</strong>{" "}
            The history panel is there for a reason. If you never look at your
            session data, you can't improve. Take five minutes at the end of
            each week to review.
          </p>
          <p>
            <strong className="text-slate-900">7. Treating the timer as a productivity cure-all.</strong>{" "}
            A timer amplifies whatever you're already doing. If your task list
            is unclear, the timer just tells you that you spent 25 minutes
            scrolling Reddit. Do the planning work first — the timer multiplies
            whatever's there.
          </p>
        </div>
      </section>

      {/* =========================================================
          NEW: FAQ (expanded from 4 to 16)
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Frequently Asked Questions
        </h2>
        <div className="mt-5 grid md:grid-cols-2 gap-5">
          {[
            {
              q: "Is TimeCounterPro free?",
              a: "Yes. The core countdown, Pomodoro and stopwatch tools are available without registration. There's no paywall, no ad interruption on the timer itself, and no premium tier that unlocks basic features."
            },
            {
              q: "Can I use it on mobile?",
              a: "Yes. The interface is responsive and designed to work on modern mobile browsers (iOS Safari, Android Chrome, Firefox) as well as desktop screens."
            },
            {
              q: "Can I share a timer?",
              a: "Yes. Timer pages can be opened and shared using their dedicated URLs. Common durations like 10-minute, 25-minute, and 5-minute timers have their own pages you can link to directly."
            },
            {
              q: "Do I need an account?",
              a: "No account is required for normal timer use. Your timer history is stored locally in your browser, so nothing needs to be uploaded."
            },
            {
              q: "Does the timer work offline?",
              a: "Once the page has loaded, the timer runs entirely in your browser and works offline. If the page is cached by your browser (or installed as a PWA), you can reopen it without internet."
            },
            {
              q: "Does the timer keep running when I switch tabs?",
              a: "Yes, for most modern browsers. Note that some browsers throttle background timers to save battery — Chrome, for example, may slow intervals on inactive tabs. For best accuracy, keep the timer tab visible."
            },
            {
              q: "Can I pause the timer?",
              a: "Yes. Click Pause to freeze the countdown. Click Resume to continue from where you stopped. The stopwatch works the same way."
            },
            {
              q: "What happens if I refresh the page?",
              a: "The timer resets. This is a common trade-off for privacy-friendly local-only tools. For long sessions you care about, don't refresh."
            },
            {
              q: "Can I use this for a Pomodoro session?",
              a: "Yes — switch to Pomodoro mode at the top. The default is 25 minutes of work, 5 minutes of short break, with a 15-minute long break every four cycles. All durations are customizable."
            },
            {
              q: "Is there a fullscreen mode?",
              a: "Yes. Click the fullscreen button on the timer panel to enter fullscreen mode. This hides the browser chrome and all other tabs, making the timer the only thing on your screen."
            },
            {
              q: "Does the timer have sound?",
              a: "Yes. You can choose from several alarm sounds and adjust volume in the settings. Sound requires a user gesture to activate — the first time you click Start, the audio context will unlock."
            },
            {
              q: "Can I use the timer for a workout?",
              a: "Yes. The countdown is ideal for HIIT intervals, plank holds, stretching sessions, and rest timers between sets. The stopwatch is ideal for tracking total workout duration or lap times."
            },
            {
              q: "Is my data private?",
              a: "Yes. Timer history is stored locally in your browser (localStorage or IndexedDB). Nothing is uploaded to a server. Clearing your browser data will clear your history."
            },
            {
              q: "Can I install TimeCounterPro as an app?",
              a: "Yes, on supported browsers you can install it as a Progressive Web App (PWA). Look for the 'Install App' button at the bottom of this page or the install prompt in your browser's address bar."
            },
            {
              q: "Is there an embed widget?",
              a: "Yes. Common timer durations have embeddable widgets you can drop into blogs, classrooms, or team pages. See the Embed Widget section above the countdown."
            },
            {
              q: "What if the timer runs slower than expected?",
              a: "Background-tab throttling is the most common cause. If accuracy matters (like for a workout or an exam), keep the tab visible and in fullscreen. Some browsers pause intervals entirely when the tab is backgrounded for long periods."
            },
          ].map((item, i) => (
            <div key={i}>
              <h3 className="font-semibold text-slate-900">{item.q}</h3>
              <p className="mt-1 text-sm text-slate-500 leading-6">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          NEW: INTERNAL LINKS
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">
          Popular Timer Pages on TimeCounterPro
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl">
          Jump straight to a dedicated timer page if you already know what
          duration you need:
        </p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { to: "/pomodoro", label: "Pomodoro Timer" },
            { to: "/stopwatch", label: "Online Stopwatch" },
            { to: "/10-minute-timer", label: "10-Minute Timer" },
            { to: "/mock-test-timer", label: "Mock Test Timer" },
            { to: "/hiit-timer", label: "HIIT Timer" },
            { to: "/meditation-timer-with-sound", label: "Meditation Timer" },
            { to: "/fasting-tracker-timer", label: "Fasting Tracker" },
            { to: "/presentation-timer", label: "Presentation Timer" },
            { to: "/world-clock", label: "World Clock" },
            { to: "/time-card-calculator-online", label: "Time Card Calculator" },
            { to: "/create", label: "Create Custom Timer" },
            { to: "/about", label: "About Us" },
          ].map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================
          NEW: GLOSSARY
         ========================================================= */}
      <section className="mt-8 bg-white border border-slate-200 p-6 sm:p-10 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 max-w-3xl">
          Timer Glossary — Terms You'll See on This Site
        </h2>
        <dl className="mt-4 space-y-3 text-sm leading-6 text-slate-600 max-w-4xl">
          <div>
            <dt className="font-semibold text-slate-900">Countdown timer</dt>
            <dd>A timer that counts down to zero from a fixed duration. Rings or flashes at zero.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Stopwatch</dt>
            <dd>A timer that counts up from zero. Used to measure elapsed time without a preset duration.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Pomodoro</dt>
            <dd>A 25-minute focus interval followed by a 5-minute break, named after the tomato-shaped kitchen timer Cirillo used.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Timeboxing</dt>
            <dd>Allocating a fixed maximum time to a task instead of letting it expand. A timer is the essential tool for timeboxing.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Deep work</dt>
            <dd>Cal Newport's term for focused, undistracted cognitive work. Usually 60–90 minutes at a stretch.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Ultradian rhythm</dt>
            <dd>A 90–120 minute biological cycle that affects alertness. Some people align work sessions to this rhythm (90/20).</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">PWA</dt>
            <dd>Progressive Web App — a website that can be installed on your device and run like a native app, sometimes offline.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Fullscreen mode</dt>
            <dd>A browser mode where the address bar and tabs are hidden so only the page content is visible.</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-900">Local storage</dt>
            <dd>A browser API that stores data on your device. TimeCounterPro uses it to save your timer history privately.</dd>
          </div>
        </dl>
      </section>

      {/* =========================================================
          INSTALL CTA
         ========================================================= */}
      <div className="flex justify-center mt-8 mb-4">
        <InstallAppButton />
      </div>

      {/* =========================================================
          FINAL CTA
         ========================================================= */}
      <section className="mt-6 bg-gradient-to-r from-slate-900 to-slate-700 text-white p-8 sm:p-12 shadow-sm mb-8">
        <div className="max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to focus? Start a timer in one click.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/80 leading-7 max-w-2xl">
            Scroll back up and pick a mode — countdown, Pomodoro, or stopwatch.
            No sign-up, no download, no ads. Just you and the next 25 minutes.
            If this tool helps you, bookmark it and come back every time you sit
            down to work.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="inline-block rounded-md bg-white text-slate-900 px-5 py-2.5 text-sm font-semibold hover:bg-slate-100 transition"
            >
              ↑ Start a Timer Now
            </a>
            <Link
              to="/create"
              className="inline-block rounded-md border border-white/30 text-white px-5 py-2.5 text-sm font-semibold hover:bg-white/10 transition"
            >
              Create a Custom Timer
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;