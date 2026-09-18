// src/pages/PomodoroPage.jsx
//
// The /pomodoro route previously rendered <PomodoroTimer /> directly, with no
// <Helmet> at all. That meant it inherited the homepage title, the homepage
// description and the homepage canonical from index.html - Google had no
// reason to treat it as a separate page. This wrapper fixes that and adds the
// written content an AdSense reviewer expects to find on a tool page.

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
      <Seo
        title="Pomodoro Timer Online - Free Focus Timer with Breaks"
        description="A free online Pomodoro timer with focus intervals and breaks, plus a practical guide to using the technique for study and deep work."
        path="/pomodoro"
        schema={schema}
      />

      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-indigo-600">
            Focus timer
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Pomodoro Timer
          </h1>
          <p className="mt-4 text-slate-600 leading-7">
            Work in focused intervals separated by real breaks. Start a cycle
            below, then read on for how to use the technique properly — including
            the step most people skip.
          </p>
        </header>

        <div className="bg-white border border-slate-200 p-4 sm:p-6 mb-12">
          <PomodoroTimer />
        </div>

        <article className="prose-slate max-w-none">
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              Where the technique came from
            </h2>
            <p className="mt-4 text-slate-600 leading-7">
              Francesco Cirillo developed the method as a university student in
              the late 1980s. He was struggling to concentrate, challenged
              himself to study properly for just ten minutes, and used a
              tomato-shaped kitchen timer to measure it. Pomodoro is Italian for
              tomato, and the name stuck.
            </p>
            <p className="mt-4 text-slate-600 leading-7">
              That origin explains a lot about why it works. It was never
              designed as a productivity system for people who are already
              disciplined. It was designed by someone who could not start.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              The full cycle, step by step
            </h2>
            <ol className="mt-4 space-y-3 text-slate-600 leading-7 list-decimal pl-5">
              <li>
                Choose one task and write it down. Not a project — one task with
                a recognisable finish.
              </li>
              <li>
                Start a 25 minute interval and work on that task alone. If an
                unrelated thought arrives, write three words about it on paper
                and carry on.
              </li>
              <li>
                Stop when the timer rings, even mid-sentence. The unfinished
                sentence makes the next restart easier.
              </li>
              <li>
                Take a 5 minute break away from the screen. Stand up, move, look
                at something further than arm&apos;s length.
              </li>
              <li>
                After four intervals, take a longer break of 15 to 30 minutes.
              </li>
              <li>
                Record how many intervals the task actually took.
              </li>
            </ol>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Step six is the one that changes things
            </h2>
            <p className="mt-4 text-slate-600 leading-7">
              Almost everyone does steps one to five and quietly drops step six,
              which is a shame, because counting is where the method stops being
              a timer and starts being information about you.
            </p>
            <p className="mt-4 text-slate-600 leading-7">
              Two weeks of honest counting usually produces one uncomfortable
              discovery: the amount of genuinely focused work in an eight hour
              day is much smaller than the day feels. Most people land somewhere
              between three and five hours, and that is normal. Knowing your real
              number is what makes your estimates start matching reality.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Choosing your interval length
            </h2>
            <p className="mt-4 text-slate-600 leading-7">
              The 25/5 split is a default, not a rule. Match the interval to the
              warm-up cost of the work:
            </p>
            <div className="mt-5 space-y-4">
              <div className="border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">
                  10/5 or 15/5 — rebuilding a habit
                </h3>
                <p className="mt-1 text-sm text-slate-600 leading-6">
                  If you cannot currently finish a 25 minute block without
                  checking your phone, do not conclude the method failed. Drop
                  the interval until you can finish it reliably, then build up.
                </p>
              </div>
              <div className="border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">
                  25/5 — homework, admin, revision, email
                </h3>
                <p className="mt-1 text-sm text-slate-600 leading-6">
                  Ideal for work that breaks into chunks and does not need much
                  context loading. Also the best interval for getting started on
                  something you are avoiding.
                </p>
              </div>
              <div className="border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-900">
                  50/10 — writing, coding, analysis
                </h3>
                <p className="mt-1 text-sm text-slate-600 leading-6">
                  When loading the problem into your head takes ten minutes on
                  its own, a 25 minute cap throws that work away every cycle.
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Common mistakes
            </h2>
            <ul className="mt-4 space-y-3 text-slate-600 leading-7">
              <li>
                <strong className="text-slate-900">Working through the break.</strong>{" "}
                The break is part of the mechanism, not a reward. Skipping it
                reliably ruins the third and fourth intervals.
              </li>
              <li>
                <strong className="text-slate-900">Spending the break on a phone.</strong>{" "}
                Scrolling is stimulating rather than restful, and it makes
                restarting harder than doing nothing would have.
              </li>
              <li>
                <strong className="text-slate-900">Batching several tasks into one interval.</strong>{" "}
                One interval, one task. The single-tasking is most of the value.
              </li>
              <li>
                <strong className="text-slate-900">Counting interrupted intervals.</strong>{" "}
                Dishonest counts make your estimates worse, not better.
              </li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Frequently asked questions
            </h2>
            <div className="mt-5 space-y-5">
              {faqs.map((faq) => (
                <div key={faq.q} className="border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900">{faq.q}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-bold text-slate-900">
              Related timers
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                ["/timer/pomodoro-25-5", "Pomodoro 25/5"],
                ["/timer/pomodoro-50-10", "Pomodoro 50/10"],
                ["/timer/25-minute-timer", "25 minute timer"],
                ["/timer/study-timer", "Study timer"],
                ["/stopwatch", "Stopwatch"],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2 border border-slate-200 text-sm text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
                >
                  {label}
                </Link>
              ))}
            </div>
          </section>
        </article>
      </div>
    </>
  );
}

export default PomodoroPage;
