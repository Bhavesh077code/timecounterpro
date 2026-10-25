// src/pages/CreateTimer.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomTimer from "../components/CustomTimer";
import TimerDashboard from "../components/TimerDashboard";
import Navbar from "../components/Navbar";
import Footer from "../components/Layout/Footer";
import {
  FiPlus,
  FiMinus,
  FiZap,
  FiShield,
  FiSmartphone,
  FiClock,
  FiBookOpen,
  FiBriefcase,
  FiActivity,
  FiCoffee,
  FiHeart,
  FiUsers,
  FiArrowUp,
  FiCheckCircle,
  FiInfo,
} from "react-icons/fi";

/* ============================================================
   SECTION WRAPPER — consistent visual rhythm for all content
   ============================================================ */
function Section({ id, eyebrow, icon: Icon, title, intro, children, tone = "indigo" }) {
  const tones = {
    indigo: { bg: "bg-indigo-50", text: "text-indigo-600", ring: "ring-indigo-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-100" },
    sky: { bg: "bg-sky-50", text: "text-sky-600", ring: "ring-sky-100" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100" },
  };
  const t = tones[tone] || tones.indigo;

  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <div className="mb-5 flex items-start gap-3">
        {Icon && (
          <div className={`shrink-0 w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center ring-1 ${t.ring}`}>
            <Icon size={18} className={t.text} />
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${t.text} mb-1`}>
              {eyebrow}
            </p>
          )}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {title}
          </h2>
          {intro && (
            <p className="text-sm text-slate-500 mt-1.5 max-w-3xl leading-relaxed">
              {intro}
            </p>
          )}
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent mb-5" />
      {children}
    </section>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
function CreateTimer() {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "What is a custom timer?",
      a: "A custom timer is a simple countdown that lets you choose exactly how much time you need for a task. You can set hours, minutes, or seconds depending on what you are doing. It is useful for studying, working, cooking, exercising, meetings, breaks, and many everyday activities. Just choose your duration, give the timer a name if you want, and start it. Unlike a preset 5-minute or 10-minute timer, a custom timer adapts to your specific task — whether that's a 7-minute plank routine, a 47-minute deep work block, or a 90-second tea steep.",
    },
    {
      q: "Is this timer tool free?",
      a: "Yes, this custom timer is completely free to use. You can create timers for different activities without paying for each timer or session. There are no complicated plans or hidden charges required just to use the basic timer. Open the tool, set your preferred duration, and start your countdown whenever you need it. There is no premium tier, no ad interruption on the timer itself, and no credit card requirement at any point.",
    },
    {
      q: "Do I need an account?",
      a: "No, you do not need to create an account before using the timer. You can open the page and start creating a countdown immediately without going through registration or verification. This makes the tool useful when you need a timer quickly. Simply choose your time, set it up, and begin your session. Your timer history is stored locally in your browser, so privacy is maintained without a login.",
    },
    {
      q: "What is the maximum time?",
      a: "You can set a timer for up to 24 hours, which gives you plenty of flexibility for both short and long activities. A few minutes can be used for a quick break, while longer durations can be useful for study sessions or other extended tasks. The 24-hour limit is equal to 86,400 seconds. Choose the duration that fits your activity and start the countdown. For most practical purposes — cooking, studying, workouts, Pomodoro sessions — durations well under 2 hours are the most common.",
    },
    {
      q: "Can I use it for Pomodoro?",
      a: "Yes, a custom timer works very well for the Pomodoro technique. You can create a 25-minute timer for focused work and another timer for a short break. This makes it easier to separate focused study or work time from rest periods. You can also adjust the durations when a different work routine suits you better. Many people prefer 50-minute work blocks with 10-minute breaks for deep work, and a custom timer accommodates both the classic 25/5 configuration and these modified versions.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes, the timer is designed to work on mobile phones as well as tablets, laptops, and desktop computers. You do not need to download a separate application to use it. Open the website in your browser, choose your duration, and start the timer. The responsive interface makes it convenient to use wherever you are. On iOS Safari and Android Chrome, the timer continues counting even when the screen is locked or you switch to another app — though some browsers may throttle background activity for long periods.",
    },
    {
      q: "Will it run in the background?",
      a: "The timer can continue counting while you switch to another browser tab, so you do not have to keep staring at the countdown. This can be useful when you are studying, working, cooking, or doing another activity at the same time. For the most reliable experience, keep the timer page open while it is running. Browser or device settings may affect background behavior in some situations. Chrome, for example, throttles timers on inactive tabs to save battery — so if precision matters (like for an exam or workout), keep the tab visible.",
    },
    {
      q: "Can I name my timers?",
      a: "Yes, you can give your timers custom names so you can quickly understand what each countdown is for. You might name one Study, another Workout, and another Cooking or Meeting. Custom names are especially useful when you have several timers for different activities. This keeps your timer setup easier to understand and manage. For students juggling multiple subjects, naming timers after each subject (Maths, Physics, Chemistry) makes the dashboard immediately scannable.",
    },
    {
      q: "Can I run multiple timers?",
      a: "Yes, you can create multiple timers for different tasks instead of relying on a single countdown. Each timer can have its own duration and name, which makes it easier to organize different activities. For example, you could have separate timers for study, exercise, and breaks. Each countdown can be managed independently from the timer interface. This is particularly useful for cooking multiple dishes simultaneously, or for teachers managing different activity rotations in a classroom.",
    },
    {
      q: "How do I stop a timer?",
      a: "You can manage an active timer using the controls provided with the countdown. If you need to take a break, you can pause the timer and continue it later when you are ready. You can also remove a timer when you no longer need it. These controls make it simple to manage your countdown without starting everything again. Pausing preserves the remaining time exactly — there's no penalty or reset.",
    },
    {
      q: "Does it play a sound?",
      a: "Yes, the timer can play an alert when the countdown reaches zero. This is useful when you are focused on another activity and do not want to keep checking the screen. You can use the alert for study sessions, workouts, cooking, meetings, or short breaks. When the countdown finishes, the sound helps you notice that your set time is over. You can adjust the volume or mute the alert in your browser settings, though we recommend keeping it on so you don't miss the end of a session.",
    },
    {
      q: "Is my data saved?",
      a: "Timer information can be stored locally in your browser so that your timer setup can remain available on your device. This means you do not necessarily need an account just to keep track of your timers. The information is associated with the browser and device you are using. Clearing your browser's stored data may remove locally saved timer information. Nothing is uploaded to our servers — your timer names, durations, and history stay entirely on your device.",
    },
    {
      q: "Can I use it for workouts?",
      a: "Yes, a custom timer can be useful for many types of workouts and exercise routines. You can set specific durations for exercises, rest periods, HIIT intervals, cardio sessions, or strength-training sets. Creating separate timers can help you follow your routine without constantly checking a clock. Choose the duration you need and let the countdown keep track of the time. Popular workout timings include 20 seconds on / 10 seconds off (Tabata), 40 seconds on / 20 seconds off (HIIT), and 60–90 second rest periods between strength sets.",
    },
    {
      q: "Is it good for students?",
      a: "Yes, students can use a custom timer to organize focused study sessions and planned breaks. You can set a countdown for reading, revision, practice questions, or completing a particular study task. Using a timer can also make it easier to create a consistent study routine. Adjust the duration depending on the subject, task, and amount of focused time you want. Research on study habits consistently shows that timed sessions reduce procrastination and improve retention compared to open-ended study.",
    },
    {
      q: "Can I use it for cooking?",
      a: "Yes, the timer is useful for keeping track of cooking and preparation times. You can create a countdown for boiling, baking, brewing, resting food, or any other recipe step that needs accurate timing. Instead of repeatedly checking the clock, set the timer and continue with your cooking. When the countdown finishes, the alert lets you know that the selected time has passed. For multi-step recipes, create separate named timers for each dish or stage — one for the pasta, one for the sauce, one for the garlic bread.",
    },
    {
      q: "Does it work offline?",
      a: "Once the timer page has loaded, it can continue working without needing a constant internet connection. This can be useful when you are in a place with an unstable connection or temporarily lose access to the internet. The page should remain open in your browser while you use the timer. If you completely close or reload the page, offline behavior can depend on how the browser has stored the website. Installing the site as a Progressive Web App (PWA) improves offline reliability.",
    },
    {
      q: "Is there a timer limit?",
      a: "There is no fixed limit on the number of timers you can create for your different activities. You can make separate countdowns for studying, workouts, cooking, meetings, breaks, or other tasks. Having multiple timers can be helpful when you want each activity to have its own duration. The practical number you can keep active may depend on your device and browser, but in normal use you can comfortably run 5–10 timers at once without any performance issues.",
    },
    {
      q: "Can I use it for meditation?",
      a: "Yes, a custom timer can be useful for meditation, breathing exercises, yoga, mindfulness, and quiet practice. You can choose a short session such as five minutes or set a longer countdown when you have more time available. Once the timer starts, you can focus on your practice instead of checking the clock repeatedly. The finishing alert can let you know when your planned session has ended. Many meditation apps offer similar functionality, but a simple custom timer avoids the guided audio and subscription costs.",
    },
    {
      q: "Do you track my activity?",
      a: "The timer is designed so that you can use it without creating a personal account or profile. Timer settings that are stored locally remain associated with your browser rather than requiring you to register. This makes the tool convenient for quick, private timer sessions on your own device. Any additional website analytics or services, if enabled, should be checked against the site's privacy policy. We do not sell, share, or use your timer data for advertising.",
    },
    {
      q: "Can I share this tool?",
      a: "Yes, you can share the timer page with friends, classmates, family members, teammates, or anyone who needs a simple countdown. They can open the shared page in their own browser and create a timer for their particular task. You do not need to create a timer for them beforehand. This makes the tool easy to recommend whenever someone needs a quick and flexible countdown. Teachers frequently share the link with students, and coaches share it with their teams.",
    },
    {
      q: "How is a custom timer different from a preset timer?",
      a: "A preset timer is locked to a specific duration — a 10-minute timer is always 10 minutes. A custom timer lets you dial in any duration you need, from 1 second to 24 hours. This matters because real tasks rarely align with round numbers. A recipe needs 7 minutes of simmering. A workout interval needs 45 seconds. A study block might work best at 37 minutes for your attention span. A custom timer adapts to the task instead of forcing the task to adapt to the timer.",
    },
    {
      q: "Can I use a custom timer for time-blocking?",
      a: "Yes. Time-blocking is the practice of assigning specific blocks of time to specific tasks, and a timer is the enforcement mechanism. Instead of a vague plan like 'work on the report today,' you block 45 minutes and start the timer. When it rings, you stop — even if you're not finished. This trains accurate time estimation and prevents Parkinson's Law (work expanding to fill the time available). Many productivity systems, from Cal Newport's deep work to simple daily planning, rely on time-boxing with a timer.",
    },
    {
      q: "Does the timer work in fullscreen?",
      a: "Yes. Most modern browsers support fullscreen mode, which hides the address bar, tabs, and other browser chrome so only the timer is visible. This is especially useful for classroom settings, gym workouts, and exam simulations where you don't want any distraction. On mobile, the timer fills the screen when you're in the browser tab; entering fullscreen removes the status bar and navigation controls.",
    },
    {
      q: "Can I use it for language learning?",
      a: "Yes, a custom timer is excellent for language practice. Set a 10-minute timer for vocabulary review, a 15-minute timer for reading practice, or a 5-minute timer for speaking drills. The constraint forces you to engage with the material rather than passively scrolling. Language learners often use timed sessions for shadowing (repeating audio aloud), flashcard review, and writing practice. The timer creates a clear boundary so practice feels finite and achievable rather than endless.",
    },
    {
      q: "What should I do if I miss the alarm?",
      a: "If you're away from the screen when the timer ends, the alert may play and finish before you return. When you come back, the timer will show 00:00 and indicate that the session is complete. You can then decide whether to restart it, adjust the duration, or move on. For critical timers (cooking, medication, exam sections), we recommend keeping the tab visible and the volume turned up so you don't miss the end.",
    },
    {
      q: "Is there a timer I can use without internet?",
      a: "Yes — once this page has loaded in your browser, the timer runs locally and does not need an internet connection. You can disconnect from Wi-Fi or mobile data and the countdown will continue. If you close the tab entirely, you'll need to reload the page (which requires internet unless it's cached). For the most reliable offline experience, install the site as a PWA using your browser's 'Install' or 'Add to Home Screen' option.",
    },
  ];

  const benefits = [
    {
      icon: FiZap,
      title: "Instant Start",
      desc: "Set your time and hit start in seconds. No setup wizard, no account, no waiting.",
      tone: "from-amber-400 to-orange-500",
    },
    {
      icon: FiShield,
      title: "100% Free",
      desc: "No signup, no payment, no hidden limits. Every feature is available to everyone.",
      tone: "from-emerald-400 to-teal-500",
    },
    {
      icon: FiSmartphone,
      title: "Any Device",
      desc: "Works on mobile, tablet, laptop, and desktop with the same clean interface.",
      tone: "from-sky-400 to-indigo-500",
    },
    {
      icon: FiClock,
      title: "Always Reliable",
      desc: "Runs in the background without interruption. Accuracy you can trust for any task.",
      tone: "from-violet-400 to-fuchsia-500",
    },
  ];

  const useCases = [
    {
      icon: FiBookOpen,
      tone: "border-sky-400",
      bg: "bg-sky-50",
      text: "text-sky-700",
      title: "Students & Exam Aspirants",
      body: "Pomodoro sessions for JEE, NEET, CAT, GRE, and UPSC prep. Timed practice sets. Reading blocks with breaks. Flashcards sprints. Language learning. The timer converts “I should study” into “I will study for 25 minutes starting now” — which is the only version that actually works.",
    },
    {
      icon: FiBriefcase,
      tone: "border-indigo-400",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      title: "Professionals & Freelancers",
      body: "Deep work blocks (45–90 minutes). Meeting time limits. Email triage sprints. Billable hour tracking. Task timeboxing to prevent Parkinson's Law. Writers use 30-minute drafting sprints. Developers time focused coding sessions to avoid burnout. Managers keep stand-ups to 15 minutes.",
    },
    {
      icon: FiActivity,
      tone: "border-rose-400",
      bg: "bg-rose-50",
      text: "text-rose-700",
      title: "Fitness & Training",
      body: "HIIT intervals (40s on / 20s off). Tabata (20s / 10s). Rest periods between strength sets (60–90 seconds). Plank holds. Stretching routines with timed holds. Circuit training rotations. Warm-up and cool-down durations. The timer keeps you honest about rest times that otherwise drift.",
    },
    {
      icon: FiCoffee,
      tone: "border-amber-400",
      bg: "bg-amber-50",
      text: "text-amber-700",
      title: "Cooking & Baking",
      body: "Boiling pasta, rice, and eggs. Baking cookies, bread, and casseroles. Brewing tea and coffee (French press, pour-over, espresso). Resting meat. Proofing dough. Multi-step recipes where different dishes need different timers running at once.",
    },
    {
      icon: FiHeart,
      tone: "border-emerald-400",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      title: "Wellness & Mindfulness",
      body: "Meditation sessions (5, 10, 15, 20 minutes). Breathwork cycles. Body-scan practice. Yoga nidra. Journaling sprints. Screen-free breaks. Wind-down routines before bed. A simple timer avoids the guided audio and subscription costs of dedicated meditation apps.",
    },
    {
      icon: FiUsers,
      tone: "border-violet-400",
      bg: "bg-violet-50",
      text: "text-violet-700",
      title: "Parents & Kids",
      body: "Screen-time limits. Getting-ready-for-school races (5 minutes). Tidy-up sessions framed as games. Reading practice with a visible clock. Homework break intervals. Bedtime countdowns for “5 more minutes.” Timers remove the negotiation — the clock decides, not the parent.",
    },
  ];

  const mistakes = [
    { n: 1, t: "Making sessions too long.", d: "Beginners often set 90-minute timers “for maximum productivity,” then burn out after 30 minutes and feel like they failed. Start with 15–25 minutes and build up. Consistency matters more than duration." },
    { n: 2, t: "Skipping breaks.", d: "Skipping breaks feels productive but it's the opposite. Focus quality drops after 30–40 minutes without a break. The break is what makes the next session possible, not a luxury." },
    { n: 3, t: "Using the phone as a timer.", d: "Every phone-timer usage is one notification away from a distraction cascade. Use a browser tab on the device you're already working on, or a dedicated physical timer." },
    { n: 4, t: "Starting without a plan.", d: "Starting a timer without knowing what you'll do is “productive procrastination.” Write one sentence describing the next action before you click start. “I will outline section 2” is a plan. “I will work on the report” is not." },
    { n: 5, t: "Extending mid-session.", d: "“Just 5 more minutes” is how 25-minute sessions become 2-hour slogs with no break. Respect the timer. If 25 minutes wasn't enough, plan 50 next time — don't extend this time." },
    { n: 6, t: "Ignoring the data.", d: "Your timer history is the most useful feedback channel you have. If tasks always overrun their time blocks, your estimates are wrong. Review your history weekly." },
    { n: 7, t: "Treating the timer as a cure-all.", d: "A timer amplifies whatever you're already doing. If your task list is unclear, the timer just tells you that you spent 25 minutes scrolling. Do the planning work first." },
  ];

  const glossary = [
    { term: "Countdown timer", def: "A timer that counts down to zero from a fixed duration. Rings or alerts at zero." },
    { term: "Stopwatch", def: "A timer that counts up from zero. Measures elapsed time without a preset duration." },
    { term: "Pomodoro", def: "A 25-minute focus interval followed by a 5-minute break, named after the tomato timer Cirillo used." },
    { term: "Timeboxing", def: "Allocating a fixed maximum time to a task instead of letting it expand. A timer is the essential tool." },
    { term: "Deep work", def: "Cal Newport's term for focused, undistracted cognitive work. Usually 60–90 minutes at a stretch." },
    { term: "Parkinson's Law", def: "The adage that work expands to fill the time available. A timer constrains that time deliberately." },
    { term: "Implementation intention", def: "A specific plan for when and where you will do something. “I will study for 25 minutes at 2 PM” beats “I should study.”" },
    { term: "PWA", def: "Progressive Web App — a website that can be installed on your device and run like a native app, sometimes offline." },
  ];

  const relatedLinks = [
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
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
  ];

  const scrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* =========================================================
              HERO HEADER
             ========================================================= */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-6 sm:px-10 py-10 sm:py-14 mb-8 shadow-lg">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, #ffffff 0, transparent 40%), radial-gradient(circle at 80% 70%, #a5b4fc 0, transparent 45%)",
              }}
            />
            <div className="relative max-w-3xl">
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-100 bg-white/10 rounded-full px-3 py-1.5 mb-4 backdrop-blur">
                <FiZap size={11} /> Custom Timer Builder
              </p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                Create Your Custom Timer
              </h1>
              <p className="mt-4 text-sm sm:text-base lg:text-lg text-indigo-100 leading-relaxed max-w-2xl">
                Create a timer for any task, study session, workout, meeting,
                break, or anything you need. Choose any duration from 1 second
                to 24 hours, name it, and start instantly — no account required.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-indigo-100/90">
                <span className="inline-flex items-center gap-1.5"><FiCheckCircle size={12} /> 100% free</span>
                <span className="inline-flex items-center gap-1.5"><FiCheckCircle size={12} /> No signup</span>
                <span className="inline-flex items-center gap-1.5"><FiCheckCircle size={12} /> Works on any device</span>
              </div>
            </div>
          </div>

          {/* =========================================================
              CUSTOM TIMER CREATOR (functional component)
             ========================================================= */}
          <div className="mb-10 rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 shadow-sm">
            <CustomTimer />
          </div>

          {/* =========================================================
              YOUR TIMERS
             ========================================================= */}
          <Section
            eyebrow="Dashboard"
            icon={FiClock}
            title="Your Timers"
            intro="Your newly created timer will appear here. Pause, resume, or remove any timer from the dashboard."
            tone="indigo"
          >
            <TimerDashboard />
          </Section>

          {/* =========================================================
              WHY CHOOSE — benefit cards
             ========================================================= */}
          <Section
            eyebrow="Why this timer"
            icon={FiShield}
            title="Why Choose Our Timer?"
            intro="Built for speed, focus, and simplicity — with no compromises on privacy."
            tone="emerald"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map(({ icon: Icon, title, desc, tone }) => (
                <div
                  key={title}
                  className="group p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tone} flex items-center justify-center mb-4 shadow-sm`}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* =========================================================
              MAIN ARTICLE
             ========================================================= */}
          <Section
            eyebrow="About the tool"
            icon={FiInfo}
            title="About Our Free Custom Timer"
            intro="Everything you should know before creating your first timer."
            tone="sky"
          >
            <article className="prose prose-slate max-w-none bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
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
                writing, reading, and language learning. The key insight is
                that starting is harder than continuing — a timer makes
                starting feel cheap and reversible.
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
            </article>
          </Section>

          {/* =========================================================
              HOW TO USE — numbered steps
             ========================================================= */}
          <Section
            eyebrow="Getting started"
            icon={FiZap}
            title="How to Use the Custom Timer"
            intro="Six quick steps from blank page to finished countdown."
            tone="amber"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { t: "Enter your duration", d: "Use the hour, minute, and second fields to set exactly how long you need — from 1 second up to 24 hours." },
                { t: "Give it a name", d: "Type a label like “Study — Physics” or “Pasta timer” so you can identify it at a glance." },
                { t: "Click Start", d: "The countdown begins immediately with large, readable digits you can see across the room." },
                { t: "Switch tabs freely", d: "The timer keeps running in the background. You don't need to keep the page visible." },
                { t: "Pause and resume", d: "If you need a break, hit pause. The remaining time is preserved exactly — no reset." },
                { t: "Listen for the alert", d: "When the countdown reaches zero, a sound plays and the display shows that time is up." },
              ].map((step, i) => (
                <div
                  key={i}
                  className="relative bg-white border border-slate-200 rounded-2xl p-5 pt-6 hover:border-amber-200 hover:shadow-sm transition-all"
                >
                  <div className="absolute -top-3 left-4 w-7 h-7 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shadow">
                    {i + 1}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">{step.t}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{step.d}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* =========================================================
              USE CASES
             ========================================================= */}
          <Section
            eyebrow="Real world"
            icon={FiUsers}
            title="Who Uses Custom Timers?"
            intro="Custom timers aren't just for productivity enthusiasts. They're used across dozens of professions and daily activities."
            tone="rose"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {useCases.map(({ icon: Icon, tone, bg, text, title, body }) => (
                <div
                  key={title}
                  className={`bg-white border-l-4 ${tone} border-y border-r border-slate-200 rounded-r-2xl rounded-l-sm p-5 hover:shadow-sm transition-all`}
                >
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                      <Icon size={15} className={text} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* =========================================================
              POMODORO DEEP DIVE
             ========================================================= */}
          <Section
            eyebrow="Deep dive"
            icon={FiClock}
            title="The Pomodoro Technique: How It Works (and When It Doesn't)"
            intro="The most popular timer structure in the world — and its honest limitations."
            tone="violet"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                The Pomodoro Technique was developed by Francesco Cirillo in the
                late 1980s when he was a university student struggling to focus.
                He used a tomato-shaped kitchen timer (pomodoro is Italian for
                tomato) to commit to just 10 minutes of undistracted work at a
                time. The technique evolved into the standard 25-minute work /
                5-minute break cycle that millions of people use today.
              </p>
              <p>
                <strong className="text-slate-800">How it works:</strong> Choose a
                single task. Set a timer for 25 minutes. Work with complete focus
                — no phone, no email, no tab switching. When the timer rings, stop
                immediately and take a 5-minute break. After four “pomodoros,”
                take a longer 15–30 minute break. The structure is simple, which
                is why it works. It converts an overwhelming task into a small,
                bounded commitment that feels psychologically cheap to start.
              </p>
              <p>
                <strong className="text-slate-800">Why it works:</strong> The
                timer creates a visible container for work. Starting is the
                hardest part of any task; a 25-minute commitment is small enough
                to overcome inertia, but long enough to accomplish real work.
                The forced breaks prevent the cognitive fatigue that accumulates
                during continuous work. And the small wins (completing a
                pomodoro) reinforce the habit loop of focus → reward → repeat.
              </p>
              <p>
                <strong className="text-slate-800">When it doesn't work:</strong>{" "}
                The Pomodoro Technique has real limitations. It can disrupt deep
                focus — if you need 15–20 minutes to enter a flow state, a
                25-minute timer interrupts you just as you're getting productive.
                It's also poorly suited for complex creative work where ideas
                need space to unfold. And it conflicts with collaborative
                environments where interruptions are part of the job. For these
                situations, a longer custom timer (50–90 minutes) or an
                open-ended stopwatch may work better.
              </p>
              <div className="rounded-xl bg-violet-50 border border-violet-100 p-4">
                <p className="text-sm text-violet-900 leading-relaxed">
                  <strong>The takeaway:</strong> Use the classic 25/5 configuration
                  for tasks you're avoiding — administrative work, email,
                  studying, chores. Use longer custom blocks (50–90 minutes) for
                  deep creative work where flow matters. Use a stopwatch when you
                  want to measure time without constraining it. The custom timer
                  gives you the flexibility to choose.
                </p>
              </div>
            </div>
          </Section>

          {/* =========================================================
              SCIENCE
             ========================================================= */}
          <Section
            eyebrow="Research"
            icon={FiBookOpen}
            title="Why Timers Work: The Science of Time and Focus"
            intro="What psychology and productivity research tell us about bounded sessions."
            tone="sky"
          >
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>
                Humans are notoriously bad at estimating time. Without a clock,
                we consistently underestimate how long tasks will take (the
                planning fallacy) and overestimate how long we've been working
                (leading to burnout). A timer replaces these unreliable internal
                estimates with concrete, external reality.
              </p>
              <p>
                Research on interruptions is particularly striking. A study by
                Gloria Mark and colleagues at UC Irvine found that after an
                interruption, it takes an average of 23 minutes and 15 seconds to
                return to the original task. Every “quick check” of email or
                social media carries a hidden cost far larger than the
                interruption itself. A timer session is valuable not just for
                what it helps you accomplish, but for the distractions it
                prevents during its duration.
              </p>
              <p>
                Timers also work through a mechanism called implementation
                intentions. A vague goal like “I should study today” has a low
                completion rate. A specific plan like “I will study for 25
                minutes starting at 2:00 PM” has a much higher follow-through
                rate. The timer is the physical trigger for the second type of
                intention. Clicking “Start” is a commitment device — a small,
                concrete action that locks in the next block of focused time.
              </p>
              <p>
                Finally, timers provide a sense of control. When a task feels
                open-ended and endless, it creates anxiety. When it's bounded by
                a visible countdown, it becomes a finite challenge with a clear
                end point. This shift from “endless” to “finite” is often enough
                to make a difficult task feel approachable.
              </p>
            </div>
          </Section>

          {/* =========================================================
              MISTAKES
             ========================================================= */}
          <Section
            eyebrow="Avoid these"
            icon={FiInfo}
            title="7 Common Mistakes People Make with Timers"
            intro="Small fixes that dramatically improve how much you get out of each session."
            tone="rose"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {mistakes.map((m) => (
                <div
                  key={m.n}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3 hover:border-rose-200 hover:shadow-sm transition-all"
                >
                  <div className="shrink-0 w-7 h-7 rounded-full bg-rose-50 text-rose-600 text-xs font-black flex items-center justify-center ring-1 ring-rose-100">
                    {m.n}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 mb-1">{m.t}</p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{m.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* =========================================================
              GLOSSARY
             ========================================================= */}
          <Section
            eyebrow="Reference"
            icon={FiBookOpen}
            title="Timer Glossary — Key Terms Explained"
            intro="Quick definitions for the vocabulary you'll see across our site."
            tone="amber"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {glossary.map((g) => (
                <div key={g.term} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-amber-200 transition-all">
                  <dt className="text-sm font-bold text-slate-900 mb-1">{g.term}</dt>
                  <dd className="text-xs sm:text-sm text-slate-600 leading-relaxed">{g.def}</dd>
                </div>
              ))}
            </div>
          </Section>

          {/* =========================================================
              RELATED LINKS
             ========================================================= */}
          <Section
            eyebrow="Explore"
            icon={FiClock}
            title="Related Timer Pages"
            intro="Jump straight to a dedicated timer if you already know what you need."
            tone="indigo"
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {relatedLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-800 transition-colors"
                >
                  <span className="truncate">{link.label}</span>
                  <span className="text-slate-300 group-hover:text-indigo-500 transition-colors">→</span>
                </Link>
              ))}
            </div>
          </Section>

          {/* =========================================================
              FAQ
             ========================================================= */}
          <Section
            eyebrow="Help center"
            icon={FiInfo}
            title="Frequently Asked Questions"
            intro="Quick answers to the most common questions about our timer."
            tone="emerald"
          >
            <div className="space-y-2.5 max-w-4xl">
              {faqs.map((faq, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={i}
                    className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
                      isOpen
                        ? "border-emerald-300 shadow-sm"
                        : "border-slate-200 hover:border-emerald-200"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-3 text-left px-4 sm:px-5 py-4"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-start gap-3 min-w-0">
                        <span
                          className={`shrink-0 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                            isOpen
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-slate-800 pr-2">
                          {faq.q}
                        </span>
                      </span>
                      <span
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          isOpen ? "bg-emerald-100" : "bg-slate-100"
                        }`}
                      >
                        {isOpen ? (
                          <FiMinus size={13} className="text-emerald-700" />
                        ) : (
                          <FiPlus size={13} className="text-slate-600" />
                        )}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pl-4 sm:pl-16">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>

          {/* =========================================================
              CLOSING CTA
             ========================================================= */}
          <section className="mb-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-6 sm:p-10">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 85% 15%, #ffffff 0, transparent 40%), radial-gradient(circle at 10% 90%, #a5b4fc 0, transparent 40%)",
              }}
            />
            <div className="relative max-w-3xl">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mb-3">
                Create Your First Custom Timer Now
              </h2>
              <p className="text-sm sm:text-base text-indigo-100 leading-relaxed max-w-2xl">
                Scroll back up, enter any duration you need, and click Start.
                That's the entire setup. No account, no download, no payment. If
                this timer helps you focus, bookmark the page and come back
                every time you sit down to work, study, cook, or train.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#top"
                  onClick={scrollTop}
                  className="inline-flex items-center gap-2 rounded-lg bg-white text-indigo-700 px-5 py-2.5 text-sm font-semibold hover:bg-indigo-50 transition shadow-sm"
                >
                  <FiArrowUp size={14} /> Create a Timer
                </a>
                <Link
                  to="/pomodoro"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/40 text-white px-5 py-2.5 text-sm font-semibold hover:bg-white/10 transition"
                >
                  Try Pomodoro Mode →
                </Link>
              </div>
            </div>
          </section>

        </div>
      </div>

    </div>
  );
}

export default CreateTimer;