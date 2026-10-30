// src/pages/StopwatchPage.jsx
//
// Same fix as PomodoroPage: the /stopwatch route had no <Helmet>, so it
// inherited the homepage title and the homepage canonical. It now has its own
// meta tags and its own written content.

import React from "react";
import { Link } from "react-router-dom";
import Stopwatch from "../components/Timer/Stopwatch";


const faqs = [
  {
    q: "What is the difference between a stopwatch and a timer?",
    a: "A stopwatch counts up from zero and measures how long something took. A timer counts down from a duration you choose and tells you when the time is up. Use a stopwatch when you do not know the answer in advance.",
  },
  {
    q: "How accurate is a browser stopwatch?",
    a: "It reads the system clock rather than counting frames, so elapsed time stays accurate over long periods. For sub-hundredth-of-a-second precision in competitive timing, dedicated hardware is still the right tool.",
  },
  {
    q: "What are lap times for?",
    a: "A lap records the split between one press and the next without stopping the overall count. It is how you compare the four rounds of a circuit, or the first and last kilometre of a run.",
  },
  {
    q: "Does the stopwatch keep running in a background tab?",
    a: "On desktop browsers, yes. Some mobile browsers suspend background tabs to save battery, so keep the screen on if the measurement matters.",
  },
];

function StopwatchPage() {

  return (
    <>

      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-indigo-600">
            Elapsed time
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            Online Stopwatch
          </h1>
          <p className="mt-4 text-slate-600 leading-7">
            Measure how long something actually takes. Start, stop, record laps
            and reset — no account, no download, nothing stored on a server.
          </p>
        </header>

        <div className="bg-white border border-slate-200 p-4 sm:p-6 mb-12">
          <Stopwatch />
        </div>

        <article>
          <section>
            <h2 className="text-2xl font-bold text-slate-900">
              When to use a stopwatch instead of a timer
            </h2>
            <p className="mt-4 text-slate-600 leading-7">
              The distinction is about which end you know. A countdown answers
              &quot;tell me when twenty minutes is up&quot;. A stopwatch answers
              &quot;how long did that take?&quot; — which is the more interesting
              question when you are trying to improve at something, or when you
              are estimating work.
            </p>
            <p className="mt-4 text-slate-600 leading-7">
              A practical example: if you never seem to have time to write
              reports, stopwatch the next one. People routinely find the task
              they had been avoiding for a week took forty minutes.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Things worth measuring
            </h2>
            <ul className="mt-4 space-y-2 text-slate-600 leading-7">
              <li>— Running, swimming or cycling intervals, with a lap per rep</li>
              <li>— How long a recurring work task really takes, before you estimate it again</li>
              <li>— Speaking practice, where the target length is fixed and your pace is not</li>
              <li>— Instrument or language practice, to track real minutes rather than intentions</li>
              <li>— Cooking steps you want to repeat exactly next time</li>
              <li>— Reading speed, for planning how long a book or chapter will take</li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Using lap times well
            </h2>
            <p className="mt-4 text-slate-600 leading-7">
              A lap marks a split without stopping the clock. The value is in the
              comparison between splits rather than the total. If your first
              circuit round takes 3:10 and your fourth takes 4:40, that gap tells
              you something about pacing that the final time hides completely.
            </p>
            <p className="mt-4 text-slate-600 leading-7">
              The same applies to work. Timing four similar tasks and finding
              that the last one took twice as long is usually a fatigue signal,
              not a difficulty signal.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-2xl font-bold text-slate-900">
              Read the display and choose a useful lap pattern
            </h2>
            <p className="mt-4 text-slate-600 leading-7">
              The display shows minutes, seconds and hundredths of a second. Start
              the clock when the activity begins. Use a lap when you reach a
              checkpoint you want to compare, such as the end of a running
              interval or one stage of a practice routine. The main stopwatch
              keeps counting, so you can record several splits during one run.
            </p>
            <p className="mt-4 text-slate-600 leading-7">
              Try to use the same checkpoints each time you repeat an activity.
              For example, record one lap per round rather than pressing the lap
              button at random moments. Consistent splits make it easier to see
              whether your pace is changing. If you are timing a task at work,
              record the same milestones on each attempt so the comparison is
              useful rather than just a list of unrelated times.
            </p>
            <p className="mt-4 text-slate-600 leading-7">
              You can pause the stopwatch when the measurement itself needs to
              stop, then continue the same run. Reset only when you are ready to
              begin a new measurement; resetting clears the current elapsed time
              and lap list. The floating picture-in-picture view may also be
              available in supported browsers, which can keep the clock visible
              while you work in another window. Browser support varies by
              device, so the standard page remains the dependable option.
            </p>
            <p className="mt-4 text-slate-600 leading-7">
              This tool is intended for everyday timing and practice. It displays
              hundredths of a second, but a browser stopwatch is not certified
              sports or laboratory equipment. For official competition results
              or measurements where tiny timing differences matter, use the
              timing system required by that activity.
            </p>
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

        </article>
      </div>
    </>
  );
}

export default StopwatchPage;
