import React, { useContext, useState } from "react";
import { TimerContext } from "../context/TimerContext";
import TimerDashboard from "../components/TimerDashboard";
import QuickPresets from "../components/QuickPresets";
import CustomTimer from "../components/CustomTimer";
import StatsCard from "../components/StartsCard";
import CountdownCreator from "../components/Timer/CountdownCreator";
import Stopwatch from "../components/Timer/Stopwatch";
import PomodoroTimer from "../components/Timer/PomodoroTimer";
import EmbedWidget from "../Viral/EmbedWidget";
import ModeSelector from "../UI/ModeSelector";
import { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet-async";
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
      <Helmet>
        <title>TimeCounterPro — Free Countdown, Pomodoro & Stopwatch</title>
        <meta
          name="description"
          content="Use a free online countdown timer, Pomodoro focus timer and stopwatch for study, work, workouts, cooking and daily tasks. No registration required."
        />
        <link rel="canonical" href="https://timecounterpro.com/" />
      </Helmet>
      <Toaster
        position="top-center"
        toastOptions={{ style: { background: "#0f172a", color: "#fff" } }}
      />

      
<section className="border-b border-slate-200 py-4 sm:py-6">
  <div className="max-w-6xl px-3 sm:px-5 lg:px-5">
    
    <div className="max-w-3xl">
      <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
        TimeCounterPro
      </p>

      <h1 className="text-4xl font-semibold leading-tight tracking-[-0.02em] text-slate-950 sm:text-4xl lg:text-[46px]">
       <b> Simple timers that help you stay focused </b>
      </h1>

      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-slate-600 sm:text-base">
        Countdown, Pomodoro and stopwatch tools for study, work,
        workouts and everyday tasks. Start a timer in seconds and
        keep your attention on what matters.
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



      <section className="flex justify-center mb-5">
        <ModeSelector mode={activeMode} setMode={setActiveMode} />
      </section>

      <section
        className={`timer-mode-panel mode-${activeMode}  border border-slate-200 overflow-hidden mb-6`}
      >
        <div
          className="relative px-4 sm:px-8 py-5 sm:py-7 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(15,23,42,.82), rgba(15,23,42,.48)), url(/timer-backgrounds/${activeMode}.svg)`,
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

      <div className="mb-8">
        <CustomTimer />
      </div>

      {/*
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      <StatsCard icon="◷" title="Active Timers" value={activeTimers.length} subtitle={`${activeTimers.filter(t => t.status === "running").length} running`} color="blue" />
      <StatsCard icon="✓" title="Completed" value={completedTimers.length} subtitle={`${todayTimers.length} today`} color="green" />
      <StatsCard icon="◴" title="Total Time" value={`${Math.floor(totalStats.totalTime / 3600)}h`} subtitle={`${Math.floor((totalStats.totalTime % 3600) / 60)}m tracked`} color="blue" />
      <StatsCard icon="★" title="Presets Used" value={totalStats.presetsUsed || 0} subtitle={`${totalStats.customsCreated || 0} custom`} color="yellow" />
    </section>  */}

      <QuickPresets />

      <TimerDashboard />

      <section className="mt-10 grid lg:grid-cols-2 gap-5">
        <article className="bg-white border border-slate-200  p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Why use TimeCounterPro?
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            TimeCounterPro is built for everyday timing without an account.
            Create a countdown for a deadline, use Pomodoro for focused work, or
            start the stopwatch when you need elapsed time. Your local timer
            history can stay in your browser.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>✓ Fast start with useful presets</li>
            <li>✓ Fullscreen and sound controls</li>
            <li>✓ Responsive design for phones and desktops</li>
            <li>✓ Shareable timer pages for common durations</li>
          </ul>
        </article>
        <article className="bg-white border border-slate-200  p-6 shadow-sm">
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

      <section className="mt-5 bg-white border border-slate-200  p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Frequently asked questions
        </h2>
        <div className="mt-5 grid md:grid-cols-2 gap-5">
          <div>
            <h3 className="font-semibold">Is TimeCounterPro free?</h3>
            <p className="mt-1 text-sm text-slate-500 leading-6">
              Yes. The core countdown, Pomodoro and stopwatch tools are
              available without registration.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I use it on mobile?</h3>
            <p className="mt-1 text-sm text-slate-500 leading-6">
              Yes. The interface is designed to work on modern mobile browsers
              as well as desktop screens.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Can I share a timer?</h3>
            <p className="mt-1 text-sm text-slate-500 leading-6">
              Yes. Timer pages can be opened and shared using their dedicated
              URLs.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Do I need an account?</h3>
            <p className="mt-1 text-sm text-slate-500 leading-6">
              No account is required for normal timer use.
            </p>
          </div>
        </div>
      </section>

      <div className="flex justify-center mt-8 mb-4">
        <InstallAppButton />
      </div>
    </>
  );
}
export default Home;
