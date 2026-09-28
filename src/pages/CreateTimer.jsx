// src/pages/CreateTimer.jsx

import React, { useState } from "react";
import CustomTimer from "../components/CustomTimer";
import TimerDashboard from "../components/TimerDashboard";
import Navbar from "../components/Navbar";
import Footer from "../components/Layout/Footer";
import { FiPlus, FiMinus, FiZap, FiCheckCircle, FiShield, FiSmartphone, FiClock } from "react-icons/fi";

function CreateTimer() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
  {
    q: "What is a custom timer?",
    a: "A custom timer is a simple countdown that lets you choose exactly how much time you need for a task. You can set hours, minutes, or seconds depending on what you are doing. It is useful for studying, working, cooking, exercising, meetings, breaks, and many everyday activities. Just choose your duration, give the timer a name if you want, and start it."
  },

  {
    q: "Is this timer tool free?",
    a: "Yes, this custom timer is completely free to use. You can create timers for different activities without paying for each timer or session. There are no complicated plans or hidden charges required just to use the basic timer. Open the tool, set your preferred duration, and start your countdown whenever you need it."
  },

  {
    q: "Do I need an account?",
    a: "No, you do not need to create an account before using the timer. You can open the page and start creating a countdown immediately without going through registration or verification. This makes the tool useful when you need a timer quickly. Simply choose your time, set it up, and begin your session."
  },

  {
    q: "What is the maximum time?",
    a: "You can set a timer for up to 24 hours, which gives you plenty of flexibility for both short and long activities. A few minutes can be used for a quick break, while longer durations can be useful for study sessions or other extended tasks. The 24-hour limit is equal to 86,400 seconds. Choose the duration that fits your activity and start the countdown."
  },

  {
    q: "Can I use it for Pomodoro?",
    a: "Yes, a custom timer works very well for the Pomodoro technique. You can create a 25-minute timer for focused work and another timer for a short break. This makes it easier to separate focused study or work time from rest periods. You can also adjust the durations when a different work routine suits you better."
  },

  {
    q: "Does it work on mobile?",
    a: "Yes, the timer is designed to work on mobile phones as well as tablets, laptops, and desktop computers. You do not need to download a separate application to use it. Open the website in your browser, choose your duration, and start the timer. The responsive interface makes it convenient to use wherever you are."
  },

  {
    q: "Will it run in the background?",
    a: "The timer can continue counting while you switch to another browser tab, so you do not have to keep staring at the countdown. This can be useful when you are studying, working, cooking, or doing another activity at the same time. For the most reliable experience, keep the timer page open while it is running. Browser or device settings may affect background behavior in some situations."
  },

  {
    q: "Can I name my timers?",
    a: "Yes, you can give your timers custom names so you can quickly understand what each countdown is for. You might name one Study, another Workout, and another Cooking or Meeting. Custom names are especially useful when you have several timers for different activities. This keeps your timer setup easier to understand and manage."
  },

  {
    q: "Can I run multiple timers?",
    a: "Yes, you can create multiple timers for different tasks instead of relying on a single countdown. Each timer can have its own duration and name, which makes it easier to organize different activities. For example, you could have separate timers for study, exercise, and breaks. Each countdown can be managed independently from the timer interface."
  },

  {
    q: "How do I stop a timer?",
    a: "You can manage an active timer using the controls provided with the countdown. If you need to take a break, you can pause the timer and continue it later when you are ready. You can also remove a timer when you no longer need it. These controls make it simple to manage your countdown without starting everything again."
  },

  {
    q: "Does it play a sound?",
    a: "Yes, the timer can play an alert when the countdown reaches zero. This is useful when you are focused on another activity and do not want to keep checking the screen. You can use the alert for study sessions, workouts, cooking, meetings, or short breaks. When the countdown finishes, the sound helps you notice that your set time is over."
  },

  {
    q: "Is my data saved?",
    a: "Timer information can be stored locally in your browser so that your timer setup can remain available on your device. This means you do not necessarily need an account just to keep track of your timers. The information is associated with the browser and device you are using. Clearing your browser's stored data may remove locally saved timer information."
  },

  {
    q: "Can I use it for workouts?",
    a: "Yes, a custom timer can be useful for many types of workouts and exercise routines. You can set specific durations for exercises, rest periods, HIIT intervals, cardio sessions, or strength-training sets. Creating separate timers can help you follow your routine without constantly checking a clock. Choose the duration you need and let the countdown keep track of the time."
  },

  {
    q: "Is it good for students?",
    a: "Yes, students can use a custom timer to organize focused study sessions and planned breaks. You can set a countdown for reading, revision, practice questions, or completing a particular study task. Using a timer can also make it easier to create a consistent study routine. Adjust the duration depending on the subject, task, and amount of focused time you want."
  },

  {
    q: "Can I use it for cooking?",
    a: "Yes, the timer is useful for keeping track of cooking and preparation times. You can create a countdown for boiling, baking, brewing, resting food, or any other recipe step that needs accurate timing. Instead of repeatedly checking the clock, set the timer and continue with your cooking. When the countdown finishes, the alert lets you know that the selected time has passed."
  },

  {
    q: "Does it work offline?",
    a: "Once the timer page has loaded, it can continue working without needing a constant internet connection. This can be useful when you are in a place with an unstable connection or temporarily lose access to the internet. The page should remain open in your browser while you use the timer. If you completely close or reload the page, offline behavior can depend on how the browser has stored the website."
  },

  {
    q: "Is there a timer limit?",
    a: "There is no fixed limit on the number of timers you can create for your different activities. You can make separate countdowns for studying, workouts, cooking, meetings, breaks, or other tasks. Having multiple timers can be helpful when you want each activity to have its own duration. The practical number you can keep active may depend on your device and browser."
  },

  {
    q: "Can I use it for meditation?",
    a: "Yes, a custom timer can be useful for meditation, breathing exercises, yoga, mindfulness, and quiet practice. You can choose a short session such as five minutes or set a longer countdown when you have more time available. Once the timer starts, you can focus on your practice instead of checking the clock repeatedly. The finishing alert can let you know when your planned session has ended."
  },

  {
    q: "Do you track my activity?",
    a: "The timer is designed so that you can use it without creating a personal account or profile. Timer settings that are stored locally remain associated with your browser rather than requiring you to register. This makes the tool convenient for quick, private timer sessions on your own device. Any additional website analytics or services, if enabled, should be checked against the site's privacy policy."
  },

  {
    q: "Can I share this tool?",
    a: "Yes, you can share the timer page with friends, classmates, family members, teammates, or anyone who needs a simple countdown. They can open the shared page in their own browser and create a timer for their particular task. You do not need to create a timer for them beforehand. This makes the tool easy to recommend whenever someone needs a quick and flexible countdown."
  }
];

  const benefits = [
    { icon: FiZap, title: "Instant Start", desc: "Set your time and hit start in seconds." },
    { icon: FiShield, title: "100% Free", desc: "No signup, no payment, no hidden limits." },
    { icon: FiSmartphone, title: "Any Device", desc: "Works on mobile, tablet, and desktop." },
    { icon: FiClock, title: "Always Reliable", desc: "Runs in background without interruption." },
  ];

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Page Header */}
          <div className="mb-6">
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Create Your Custom Timer
              </h1>
            </div>
            <p className="mt-2 text-sm sm:text-base text-slate-500">
              Create a timer for any task, study session, workout, meeting,
              break, or anything you need.
            </p>
          </div>

          {/* Custom Timer Creator */}
          <div className="mb-8">
            <CustomTimer />
          </div>

          {/* Created Timers */}
          <section className="mb-10">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Your Timers
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Your newly created timer will appear here.
              </p>
            </div>
            <TimerDashboard />
          </section>

          {/* Why Choose Our Timer */}
          <section className="mb-10">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Why Choose Our Timer?
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Built for speed, focus, and simplicity.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {benefits.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-3">
                    <Icon size={16} className="text-indigo-600" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">{title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* SEO Article Section */}
          <section className="mb-10">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                About Our Free Custom Timer
              </h2>
            </div>
            <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                Time is the one thing we can never get back. Most people don't
                struggle with time itself — they struggle with focus. You sit
                down to work, glance at your phone for a second, and suddenly
                an hour is gone. A simple custom timer fixes that. It gives
                your day structure, sets clear boundaries, and makes it easier
                to start tasks you've been avoiding. It's one of the smallest
                tools you can add to your routine with the biggest payoff.
              </p>
              <p>
                Our free custom timer tool is built to do one thing extremely
                well: count down the exact time you set. You choose hours,
                minutes, and seconds, give the timer a name if you like, and
                hit start. No signup, no download, no ads interrupting your
                session. Just a clean, reliable timer that works the moment
                you need it. Whether you need a quick 1-minute timer or a
                long 24-hour countdown, it's all possible right here.
              </p>
              <p>
                Students are among the biggest users of timers. When preparing
                for exams, the material can feel endless. But break study time
                into 25-minute blocks with short breaks, and suddenly it's
                manageable. This is the Pomodoro Technique, and it works
                because it tricks your brain into starting. Once you begin,
                focus follows naturally. Timers also help with revision, note
                writing, reading, and language learning.
              </p>
              <p>
                Professionals use custom timers for deep work. Writers set
                30-minute sprints to draft chapters. Developers time coding
                sessions to avoid burnout. Managers keep meetings short.
                Freelancers track billable hours. Even chefs and home cooks
                rely on timers for boiling, baking, and brewing. Almost every
                task becomes easier when you add a little structure — and a
                timer provides that instantly, without any setup.
              </p>
              <p>
                Our tool runs entirely in your browser. That means it works on
                any device — phone, tablet, laptop, or desktop — with nothing
                to install. Your timers keep running in the background even if
                you switch tabs. When time is up, you get a clear notification
                so you never miss it. And because we don't track you or store
                anything on a server, your data stays completely private on
                your own device.
              </p>
              <p>
                Small habits compound over time. Reading 20 minutes a day adds
                up to dozens of books a year. Exercising 15 minutes daily can
                transform your health. A timer turns big overwhelming goals
                into small, doable steps. So whether you're studying for an
                exam, finishing a project, training for a race, or simply
                trying to be more present in your day, a custom timer is one
                of the simplest changes you can make. Create your first one
                now — it takes just a few seconds.
              </p>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-10">
            <div className="mb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Quick answers to the most common questions about our timer.
              </p>
            </div>

            <div className="space-y-2">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-indigo-200 transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-3 text-left px-4 py-3.5"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-slate-800 pr-2">
                        {faq.q}
                      </span>
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center">
                        {isOpen ? (
                          <FiMinus size={12} className="text-indigo-600" />
                        ) : (
                          <FiPlus size={12} className="text-indigo-600" />
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 -mt-1">
                        <p className="text-sm text-slate-500 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CreateTimer;