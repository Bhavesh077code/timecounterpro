import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import seoTimers from "../data/seoTimers";

const categoryInfo = {
  study: { title: "Study & Focus Timers", text: "Useful countdowns for revision, reading, homework and focused work sessions." },
  pomodoro: { title: "Pomodoro Timers", text: "Ready-made focus and break cycles for people who prefer structured work sessions." },
  workout: { title: "Workout Timers", text: "Simple intervals and countdowns for exercise, warm-ups and home workouts." },
  cooking: { title: "Cooking Timers", text: "Keep track of cooking and preparation time without repeatedly checking the clock." },
  meditation: { title: "Meditation Timers", text: "Quiet countdowns for meditation, breathing practice and short mindfulness sessions." },
  classroom: { title: "Classroom Timers", text: "Clear time limits for classroom activities, quizzes and study exercises." },
  meeting: { title: "Meeting Timers", text: "Keep presentations, discussions and focused work blocks within a planned duration." },
  special: { title: "Useful Everyday Timers", text: "Practical timers for reading, cleaning, coding, breaks and other everyday tasks." },
  hours: { title: "Long Duration Timers", text: "Longer countdowns for extended activities where a simple visible timer is useful." },
  custom: { title: "Minute Timers", text: "Popular minute-based countdowns for common short sessions." },
};

const featuredSlugs = [
  "5-minute-timer", "10-minute-timer", "15-minute-timer", "20-minute-timer", "25-minute-timer",
  "30-minute-timer", "45-minute-timer", "60-minute-timer", "pomodoro-timer", "pomodoro-25-5",
  "pomodoro-50-10", "study-timer", "workout-timer", "cooking-timer", "meditation-timer","meditation-timer-with-sound",
  "classroom-timer", "meeting-timer", "exam-timer", "reading-timer", "coding-timer"
];

function Timers() {
  const featured = featuredSlugs.map((slug) => seoTimers.find((timer) => timer.slug === slug)).filter(Boolean);
  const categories = Object.entries(categoryInfo);

  return (
    <>
      <Helmet>
        <title>Online Timers — Study, Workout, Cooking & Pomodoro | TimeCounterPro</title>
        <meta name="description" content="Browse TimeCounterPro's practical online timers for study, Pomodoro, workouts, cooking, meditation, meetings and everyday tasks." />
        <link rel="canonical" href="https://timecounterpro.com/timers" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <header className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-indigo-600">Timer library</p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">Online timers for real tasks</h1>
          <p className="mt-4 text-slate-600 leading-7">Choose a ready-made countdown or open the home page to create your own duration. This library focuses on useful timer types rather than requiring an account or installation.</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Popular timers</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((timer) => (
              <Link key={timer.slug} to={`/timer/${timer.slug}`} className="bg-white border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition">
                <h3 className="font-semibold text-slate-900">{timer.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-6">{timer.description}</p>
                <span className="inline-block mt-4 text-sm font-medium text-indigo-600">Open timer →</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-5">Browse by purpose</h2>
          <div className="space-y-8">
            {categories.map(([category, info]) => {
              const timers = seoTimers.filter((timer) => timer.category === category).slice(0, 8);
              if (!timers.length) return null;
              return (
                <article key={category} className="bg-white border border-slate-200 p-6">
                  <h2 className="text-xl font-bold text-slate-900">{info.title}</h2>
                  <p className="mt-2 text-sm text-slate-600 leading-6">{info.text}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {timers.map((timer) => <Link key={timer.slug} to={`/timer/${timer.slug}`} className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-700 hover:border-indigo-300 hover:text-indigo-700">{timer.title}</Link>)}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12 bg-slate-900 text-white p-7">
          <h2 className="text-2xl font-bold">Need a duration that is not listed?</h2>
          <p className="mt-2 text-slate-300 leading-7">Use the custom timer on the home page to choose hours, minutes and seconds for your own task.</p>
          <Link to="/" className="inline-flex mt-5 px-5 py-3 bg-white text-slate-900 font-semibold rounded-lg">Create a custom timer</Link>
        </section>
      </div>
    </>
  );
}

export default Timers;
