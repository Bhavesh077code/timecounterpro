// src/pages/Timers.jsx
//
// The category sections used to pull up to 8 timers per category straight out
// of an 800-entry generated array, which meant this page linked to hundreds of
// near-identical thin URLs. seoTimers.js is now a curated list of 24, so every
// link on this page points at a page with its own written content.

import React from "react";
import { Link } from "react-router-dom";
import seoTimers from "../data/seoTimers";
import Seo from "../components/Seo";

const categoryInfo = {
  minutes: {
    title: "Minute timers",
    text: "The standard durations people search for most: short breaks, study blocks and half-hour sessions.",
  },
  hours: {
    title: "Long duration timers",
    text: "Longer blocks for deep work, full exam papers, slow cooking and extended study sessions.",
  },
  pomodoro: {
    title: "Pomodoro timers",
    text: "Ready-made focus and break cycles, including the classic 25/5 and the longer 50/10 variant.",
  },
  study: {
    title: "Study, exam and work timers",
    text: "Timers built around how revision, timed papers, reading and programming actually work.",
  },
  workout: {
    title: "Exercise timers",
    text: "Timed sets, holds and rest periods, with a fullscreen display you can read from the floor.",
  },
  meditation: {
    title: "Rest and meditation timers",
    text: "Quiet countdowns for meditation, breathing practice and naps that end at the right moment.",
  },
  cooking: {
    title: "Kitchen timers",
    text: "Timings for boiling, baking, resting and every recipe step that is easy to forget.",
  },
  classroom: {
    title: "Classroom timers",
    text: "Large, readable countdowns for group work, quizzes, transitions and timed activities.",
  },
  meeting: {
    title: "Meeting timers",
    text: "Keep agenda items, stand-ups and presentations inside their planned slot.",
  },
};

const featuredSlugs = [
  "5-minute-timer",
  "10-minute-timer",
  "25-minute-timer",
  "30-minute-timer",
  "pomodoro-25-5",
  "study-timer",
  "workout-timer",
  "cooking-timer",
];

function Timers() {
  const featured = featuredSlugs
    .map((slug) => seoTimers.find((timer) => timer.slug === slug))
    .filter(Boolean);
  const categories = Object.entries(categoryInfo);

  return (
    <>
      <Seo
        title="Online Timers for Study, Work, Cooking & Exercise | TimeCounterPro"
        description="Browse 24 hand-written timer pages for study, Pomodoro, workouts, cooking, meditation, classrooms and meetings. Free and no signup."
        path="/timers"
      />

      <div className="max-w-5xl mx-auto">
        <header className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-indigo-600">
            Timer library
          </p>
          <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-slate-950">
            Online timers for real tasks
          </h1>
          <p className="mt-4 text-slate-600 leading-7">
            Every timer below has its own page explaining what that duration is
            actually good for, how to use it, and where it goes wrong. Pick one,
            or create a custom duration on the home page.
          </p>
        </header>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Most used timers
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((timer) => (
              <Link
                key={timer.slug}
                to={`/timer/${timer.slug}`}
                className="bg-white border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-sm transition"
              >
                <h3 className="font-semibold text-slate-900">{timer.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-6">
                  {timer.description}
                </p>
                <span className="inline-block mt-4 text-sm font-medium text-indigo-600">
                  Open timer →
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-5">
            Browse by purpose
          </h2>
          <div className="space-y-6">
            {categories.map(([category, info]) => {
              const timers = seoTimers.filter(
                (timer) => timer.category === category,
              );
              if (!timers.length) return null;
              return (
                <article
                  key={category}
                  className="bg-white border border-slate-200 p-6"
                >
                  <h3 className="text-xl font-bold text-slate-900">
                    {info.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-6">
                    {info.text}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {timers.map((timer) => (
                      <Link
                        key={timer.slug}
                        to={`/timer/${timer.slug}`}
                        className="px-3 py-2 text-sm border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                      >
                        {timer.title}
                      </Link>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-14 max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">
            How to pick the right duration
          </h2>
          <p className="mt-4 text-slate-600 leading-7">
            Most people choose a timer length based on how long they think they
            ought to work, and then abandon the session halfway. A more reliable
            method is to choose based on the warm-up cost of the task — how long
            it takes before you are properly into it.
          </p>
          <p className="mt-4 text-slate-600 leading-7">
            Tasks with almost no warm-up cost, like flashcards, tidying or
            answering short emails, work well in ten or fifteen minute blocks.
            Tasks with a high warm-up cost, like writing, debugging or reading
            dense material, lose most of their value when interrupted at
            twenty-five minutes and are better served by fifty or ninety.
          </p>
          <p className="mt-4 text-slate-600 leading-7">
            If you are unsure, start shorter than feels right. A fifteen minute
            block you actually finish is worth more than a ninety minute block
            you abandon at minute twenty, because finishing is what makes you
            willing to start again tomorrow.
          </p>
        </section>

        <section className="bg-slate-900 text-white p-7">
          <h2 className="text-2xl font-bold">
            Need a duration that is not listed?
          </h2>
          <p className="mt-2 text-slate-300 leading-7">
            Use the custom timer on the home page to set any combination of
            hours, minutes and seconds, then run it fullscreen or share it.
          </p>
          <Link
            to="/"
            className="inline-flex mt-5 px-5 py-3 bg-white text-slate-900 font-semibold"
          >
            Create a custom timer
          </Link>
        </section>
      </div>
    </>
  );
}

export default Timers;
