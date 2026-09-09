// src/pages/About.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  FiClock, FiShare2, FiCode, FiMonitor, FiUsers, 
  FiTrendingUp, FiZap, FiBarChart2, FiChevronDown, FiChevronUp,
  FiCalendar, FiStopCircle, FiPlay, FiRefreshCw
} from 'react-icons/fi';

function About() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Timer Modes Data
  const timerModes = [
    {
      id: 'countdown',
      icon: <FiCalendar className="text-2xl text-indigo-600" />,
      title: 'Countdown Timer for Events',
      description: 'Count down to any date or event. Perfect for weddings, birthdays, product launches, exams, and special occasions. Shows days, hours, minutes, and seconds remaining.',
      howToUse: 'Enter event name → Select date and time → Choose theme → Create countdown → Share the link',
      examples: 'Weddings, Birthdays, New Year, Exams, Product Launches, Anniversaries',
      bestFor: 'Event planning, Deadlines, Special occasions, Festivals'
    },
    {
      id: 'presets',
      icon: <FiZap className="text-2xl text-amber-500" />,
      title: 'Quick Timer Presets',
      description: 'Start a timer instantly with one click. Choose from 8 ready-made timers for common tasks like breaks, workouts, cooking, and meditation.',
      howToUse: 'Click any preset button → Timer starts immediately',
      examples: '5min Break, 15min Focus, 30min Deep Work, 1hr Workout, 2hr Movie, 8hr Sleep, 45min Cooking, 10min Meditation',
      bestFor: 'Quick tasks, Short sessions, Instant timing, Daily routines'
    },
    {
      id: 'custom',
      icon: <FiClock className="text-2xl text-blue-600" />,
      title: 'Custom Timer Creator',
      description: 'Build your own timer with custom hours, minutes, and seconds. Name your timer and start when you need it.',
      howToUse: 'Click expand → Enter timer name → Set hours, minutes, seconds → Start timer',
      examples: 'Project Work, Coding Session, Meeting Timer, Personal Goals',
      bestFor: 'Specific durations, Named timers, Custom timing needs'
    },
    {
      id: 'stopwatch',
      icon: <FiStopCircle className="text-2xl text-emerald-600" />,
      title: 'Digital Stopwatch Online',
      description: 'Measure elapsed time with precision. Record lap times, track splits, and analyze your performance. Free online stopwatch for any activity.',
      howToUse: 'Click Start → Click Lap to record splits → Pause to stop → Reset to clear',
      examples: 'Workouts, Cooking, Racing, Tasks, Gaming, Sports',
      bestFor: 'Sports, Fitness, Cooking, Timing activities'
    },
    {
      id: 'pomodoro',
      icon: <FiPlay className="text-2xl text-rose-600" />,
      title: 'Pomodoro Study Timer',
      description: 'Boost your productivity with the proven Pomodoro technique. 25 minutes of focused work followed by 5-minute breaks. Perfect for students and professionals.',
      howToUse: 'Click Start → Focus for 25 minutes → Take a 5-minute break → Repeat with sound alerts',
      examples: 'Studying, Working, Writing, Coding, Creative work, Reading',
      bestFor: 'Students, Professionals, Writers, Coders, Anyone needing focus'
    }
  ];

  // Comparison Table Data
  const comparisonData = [
    { feature: 'Timer Type', countdown: 'Countdown to event', stopwatch: 'Elapsed time', pomodoro: 'Focus + Break cycles', presets: 'One-click timers' },
    { feature: 'Best Use Case', countdown: 'Events & deadlines', stopwatch: 'Sports & cooking', pomodoro: 'Study & work', presets: 'Quick tasks' },
    { feature: 'Time Direction', countdown: 'Counting down', stopwatch: 'Counting up', pomodoro: 'Both cycles', presets: 'Counting down' },
    { feature: 'Max Duration', countdown: 'Any future date', stopwatch: 'Unlimited', pomodoro: '25min / 5min', presets: '5min - 8 hours' },
    { feature: 'Sound Alerts', countdown: 'Optional', stopwatch: 'Optional', pomodoro: 'Tick + completion', presets: 'Optional' },
  ];

  // Pomodoro Features
  const pomodoroFeatures = [
    {
      title: "25-Minute Focus Sessions",
      description: "Work or study with complete focus for 25 minutes. The standard Pomodoro technique helps you stay productive and avoid distractions.",
      whenToUse: "When you need deep focus on a single task without interruptions."
    },
    {
      title: "5-Minute Breaks",
      description: "Take a 5-minute break after each focus session. Stand up, stretch, drink water, or relax your mind.",
      whenToUse: "When you feel tired or lose concentration during work."
    },
    {
      title: "Tick Sound Feedback",
      description: "A gentle tick sound every second keeps you aware of time passing without being distracting.",
      whenToUse: "When you want subtle audio feedback while working."
    },
    {
      title: "Completion Alerts",
      description: "A pleasant sound plays when your focus or break session is complete. Never miss the end of your session.",
      whenToUse: "When you need to be notified without looking at the screen."
    },
    {
      title: "Adjustable Volume",
      description: "Control sound volume from 0% to 100%. Mute when you need complete silence.",
      whenToUse: "When working in quiet environments like libraries or offices."
    },
    {
      title: "Session Tracking",
      description: "Track how many Pomodoro sessions you have completed. Monitor your daily productivity progress.",
      whenToUse: "When you want to measure and improve your productivity."
    },
    {
      title: "Progress Visualization",
      description: "A colorful progress bar shows time remaining in your current session. Easy visual reference.",
      whenToUse: "When you want quick visual feedback without reading numbers."
    },
    {
      title: "Productivity Benefits",
      description: "This proven technique helps avoid burnout, maintain focus, and achieve more in less time.",
      whenToUse: "When you have multiple tasks and want to stay productive."
    }
  ];

  // Features Data
  const features = [
    {
      icon: <FiClock className="text-2xl text-indigo-600" />,
      title: "5 Timer Modes",
      description: "Choose from Countdown, Stopwatch, Pomodoro, Quick Presets, and Custom Timer. Each mode serves a different purpose.",
      useCase: "Students use Pomodoro, professionals use Stopwatch, event planners use Countdown."
    },
    {
      icon: <FiShare2 className="text-2xl text-blue-600" />,
      title: "Shareable Countdowns",
      description: "Generate a unique link for any countdown and share it with anyone. No app installation required.",
      useCase: "Share wedding countdowns, exam timers, or project deadlines with others."
    },
    {
      icon: <FiCode className="text-2xl text-indigo-600" />,
      title: "Embed Widget",
      description: "Add a live countdown timer to any website or blog. Copy and paste the embed code.",
      useCase: "Bloggers, event websites, and educational sites use embed widgets."
    },
    {
      icon: <FiMonitor className="text-2xl text-emerald-600" />,
      title: "Full Screen Mode",
      description: "Open any timer in full screen for distraction-free focus. Perfect for study, work, or events.",
      useCase: "Students, speakers, and teachers use full screen for presentations."
    },
    {
      icon: <FiZap className="text-2xl text-amber-500" />,
      title: "Quick Presets",
      description: "Start timers instantly with 8 ready-made presets for common tasks. No setup needed.",
      useCase: "Quickly start focus sessions, breaks, workouts, or cooking timers."
    },
    {
      icon: <FiBarChart2 className="text-2xl text-rose-600" />,
      title: "Timer History",
      description: "Track all completed timers and sessions. Monitor your time usage and productivity.",
      useCase: "Track study hours, workout sessions, or daily productivity."
    },
    {
      icon: <FiUsers className="text-2xl text-indigo-600" />,
      title: "100% Free",
      description: "The core timer tools are available without registration or payment. Please review our Privacy Policy for information about cookies, analytics and contact information you choose to provide.",
      useCase: "Anyone can start using immediately without any barriers."
    },
    {
      icon: <FiTrendingUp className="text-2xl text-emerald-600" />,
      title: "Simple Sharing",
      description: "Share timer links with friends, classmates, teams or readers when a simple time limit is useful.",
      useCase: "Website owners and bloggers get free SEO benefits."
    }
  ];

  // FAQ Data
  const faqs = [
    {
      question: "What is TimecounterPro and how does it work?",
      answer: "TimecounterPro is a free online timer application that helps you manage time effectively. You can create countdowns for events, use stopwatch for timing, or use Pomodoro timer for focused work. Simply choose your timer type, set the time, and start. It's that simple and completely free."
    },
    {
      question: "Which timer is best for studying?",
      answer: "The Pomodoro Timer is ideal for studying. It follows the proven 25-minute focus session followed by a 5-minute break. After four sessions, take a longer break. This technique helps maintain concentration and prevents burnout."
    },
    {
      question: "Which timer should I use for events?",
      answer: "Use the Custom Countdown Timer for events. You can set the exact date and time, and the timer shows a live countdown with days, hours, minutes, and seconds. Share the countdown link with anyone."
    },
    {
      question: "Is TimecounterPro really free?",
      answer: "Yes! TimecounterPro is completely free forever. There are no hidden charges, premium plans, or credit card requirements. All features are available to everyone at no cost."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account is required for normal timer use. Timer settings and history can be stored locally in your browser. Information you voluntarily submit through a contact form and data collected by third-party services are handled according to our Privacy Policy."
    },
    {
      question: "What is the difference between Countdown and Stopwatch?",
      answer: "A Countdown counts down to a future date (like days until an event). A Stopwatch counts up from zero (like timing how long something takes). Countdown has a set end time, while Stopwatch can run indefinitely."
    },
    {
      question: "How does the Pomodoro Technique work?",
      answer: "The Pomodoro Technique uses 25 minutes of focused work followed by a 5-minute break. After every 4 sessions, take a longer break. This method improves productivity and reduces mental fatigue."
    },
    {
      question: "Can I share my countdown with others?",
      answer: "Yes! Every countdown generates a unique shareable link. Share it with friends, family, or colleagues via WhatsApp, Twitter, Facebook, or email."
    },
    {
      question: "What are Quick Presets?",
      answer: "Quick Presets are one-click timers for common tasks. We offer 8 presets: Quick Break (5min), Focus (15min), Deep Work (30min), Workout (1hr), Movie (2hrs), Sleep (8hrs), Cooking (45min), and Meditation (10min)."
    },
    {
      question: "Does TimecounterPro work on mobile?",
      answer: "Absolutely! TimecounterPro is fully responsive and works on all devices - mobile phones, tablets, laptops, and desktops. The interface automatically adjusts to fit your screen."
    },
    {
      question: "Can I embed TimerPro on my website?",
      answer: "Yes! We provide an embed widget. Copy the iframe code and paste it on your website or blog. This adds a countdown timer to your site and provides free SEO backlinks."
    },
    {
      question: "What is Full Screen mode used for?",
      answer: "Full Screen mode removes all distractions and shows only the timer. Ideal for studying, working, presentations, or displaying countdowns on large screens."
    },
    {
      question: "Is my privacy protected?",
      answer: "Yes! TimecounterPro is designed with privacy in mind. We collect no personal information, use no tracking cookies, and send no data to external servers. Everything stays on your device."
    }
  ];

  return (
    <>
      <Helmet>
        <title>About TimecounterPro - Free Online Countdown Timer & Stopwatch</title>
        <meta name="description" content="Learn about TimecounterPro - the best free online countdown timer, stopwatch and Pomodoro timer for study, work, events and productivity. 100% free, no registration required." />
        <meta name="keywords" content="free countdown timer, online stopwatch, Pomodoro timer, study timer, productivity timer, event countdown, timer for study, work timer, free online timer, best timer app" />
        <link rel="canonical" href="https://timecounterpro.com/about" />
        <meta property="og:title" content="About TimecounterPro - Free Online Timer Tools" />
        <meta property="og:description" content="Learn about TimecounterPro - the best free online countdown timer, stopwatch and Pomodoro timer for study, work, events and productivity." />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="TimecounterPro" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <div className="min-h-screen bg-white py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header - Professional, no logo */}
          <div className="border-b border-slate-200 pb-4 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">
              About TimecounterPro
            </h1>
            <p className="text-slate-500 text-base sm:text-lg mt-2 max-w-3xl">
              The best free online countdown timer, stopwatch and Pomodoro timer for study, work, and productivity.
            </p>
            <div className="flex flex-wrap gap-2 mt-3 text-sm text-slate-500">
              <span className="bg-indigo-50 text-indigo-700 px-3 py-1 border border-indigo-200 text-xs font-medium">100% Free</span>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 border border-emerald-200 text-xs font-medium">No Registration</span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1 border border-blue-200 text-xs font-medium">Works on All Devices</span>
              <span className="bg-rose-50 text-rose-700 px-3 py-1 border border-rose-200 text-xs font-medium">Privacy Focused</span>
            </div>
          </div>

          {/* What is TimecounterPro */}
          <div className="border border-slate-200 p-6 sm:p-8 mb-8 bg-slate-50">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
              What is TimecounterPro?
            </h2>
            <p className="text-slate-700 leading-relaxed text-base">
              TimecounterPro is a <strong className="text-indigo-600">free online timer application</strong> designed to help you manage your time effectively. 
              Whether you are a <strong className="text-blue-600">student</strong> preparing for exams, 
              a <strong className="text-emerald-600">professional</strong> working on projects, or an
              <strong className="text-amber-600"> event planner</strong> organizing special occasions, 
              TimecounterPro provides the right timer for every need.
            </p>
            <p className="text-slate-500 mt-3 text-sm">
              No sign-up required for normal timer use. Open the app and start timing immediately.
            </p>
          </div>

          {/* All Timer Modes */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Timer Modes - Complete Guide
            </h2>
            <p className="text-slate-500 text-base mb-6">
              TimecounterPro offers <strong className="text-indigo-600">5 different timer modes</strong>. 
              Each mode is designed for a specific purpose.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {timerModes.map((mode, index) => (
                <div key={index} className="border border-slate-200 p-5 bg-white hover:shadow-md hover:border-indigo-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-3">
                    {mode.icon}
                    <h3 className="text-base font-bold text-slate-900">{mode.title}</h3>
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {mode.description}
                  </p>

                  <div className="bg-indigo-50 border border-indigo-100 p-3 mb-3">
                    <p className="text-indigo-700 text-xs">
                      <span className="font-semibold">How to use:</span> {mode.howToUse}
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 p-3 mb-3">
                    <p className="text-blue-700 text-xs">
                      <span className="font-semibold">Examples:</span> {mode.examples}
                    </p>
                  </div>

                  <div className="bg-emerald-50 border border-emerald-100 p-3">
                    <p className="text-emerald-700 text-xs">
                      <span className="font-semibold">Best for:</span> {mode.bestFor}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timer Comparison Table */}
          <div className="border border-slate-200 p-6 sm:p-8 mb-8 overflow-x-auto bg-white">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Timer Comparison
            </h2>
            <p className="text-slate-500 text-base mb-4">
              Quick comparison of all timer modes to help you choose the right one.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="text-left py-3 px-3 text-slate-600 font-medium">Feature</th>
                    <th className="text-left py-3 px-3 text-indigo-700 font-medium">Countdown</th>
                    <th className="text-left py-3 px-3 text-emerald-700 font-medium">Stopwatch</th>
                    <th className="text-left py-3 px-3 text-rose-700 font-medium">Pomodoro</th>
                    <th className="text-left py-3 px-3 text-amber-700 font-medium">Presets</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-3 text-slate-700 font-medium">{row.feature}</td>
                      <td className="py-3 px-3 text-slate-600">{row.countdown}</td>
                      <td className="py-3 px-3 text-slate-600">{row.stopwatch}</td>
                      <td className="py-3 px-3 text-slate-600">{row.pomodoro}</td>
                      <td className="py-3 px-3 text-slate-600">{row.presets}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pomodoro Features */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Pomodoro Timer - Features Guide
            </h2>
            <p className="text-slate-500 text-base mb-4">
              Learn how to use the Pomodoro technique for maximum productivity.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pomodoroFeatures.map((feature, index) => (
                <div key={index} className="border border-slate-200 p-5 bg-white hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                  <h3 className="text-slate-900 font-semibold text-base mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                  <div className="mt-3 bg-indigo-50 border border-indigo-100 p-3">
                    <p className="text-indigo-700 text-xs">
                      <span className="font-semibold">When to use:</span> {feature.whenToUse}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Features */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              All Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="border border-slate-200 p-5 bg-white hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-slate-900 font-semibold text-base mb-1">{feature.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                      <div className="mt-2 bg-indigo-50 border border-indigo-100 p-2">
                        <p className="text-indigo-700 text-xs">
                          <span className="font-semibold">Example:</span> {feature.useCase}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-base mb-4">
              Find answers to common questions about TimecounterPro.
            </p>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className="border border-slate-200 bg-white hover:border-slate-300 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-all touch-manipulation"
                  >
                    <span className="text-slate-900 font-medium text-sm pr-4">{faq.question}</span>
                    <span className="text-indigo-600 flex-shrink-0">
                      {openFaq === index ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                    </span>
                  </button>
                  
                  <div 
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-4 pb-4 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Who Can Use */}
          <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Who Can Use TimecounterPro?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white border border-slate-200 p-4 text-center hover:shadow-md transition-all">
                <div className="text-3xl mb-2">🎓</div>
                <div className="text-slate-900 font-semibold text-sm">Students</div>
                <div className="text-slate-500 text-xs">Study & exams</div>
              </div>
              <div className="bg-white border border-slate-200 p-4 text-center hover:shadow-md transition-all">
                <div className="text-3xl mb-2">💼</div>
                <div className="text-slate-900 font-semibold text-sm">Professionals</div>
                <div className="text-slate-500 text-xs">Work & projects</div>
              </div>
              <div className="bg-white border border-slate-200 p-4 text-center hover:shadow-md transition-all">
                <div className="text-3xl mb-2">🎉</div>
                <div className="text-slate-900 font-semibold text-sm">Event Planners</div>
                <div className="text-slate-500 text-xs">Weddings & parties</div>
              </div>
              <div className="bg-white border border-slate-200 p-4 text-center hover:shadow-md transition-all">
                <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
                <div className="text-slate-900 font-semibold text-sm">Everyone</div>
                <div className="text-slate-500 text-xs">Daily use</div>
              </div>
            </div>
          </div>

          {/* Why Use */}
          <div className="border border-slate-200 p-6 sm:p-8 mb-8 bg-white">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Why Use TimecounterPro?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-slate-50 p-4">
                <span className="text-emerald-600 text-xl flex-shrink-0">✓</span>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Completely Free</h4>
                  <p className="text-slate-500 text-sm">No payment ever. All features are free.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 p-4">
                <span className="text-emerald-600 text-xl flex-shrink-0">✓</span>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">No Registration</h4>
                  <p className="text-slate-500 text-sm">Start using immediately. No sign-up needed.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 p-4">
                <span className="text-emerald-600 text-xl flex-shrink-0">✓</span>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Works Everywhere</h4>
                  <p className="text-slate-500 text-sm">Mobile, tablet, desktop - all devices supported.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-slate-50 p-4">
                <span className="text-emerald-600 text-xl flex-shrink-0">✓</span>
                <div>
                  <h4 className="text-slate-900 font-semibold text-sm">Privacy Information</h4>
                  <p className="text-slate-500 text-sm">Timer data can remain in your browser; see the Privacy Policy for cookies and third-party services.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="border-t border-slate-200 pt-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              Start Using TimecounterPro Today
            </h2>
            <p className="text-slate-500 text-base mb-6">
              The best free online countdown timer, stopwatch and Pomodoro timer. Try it now.
            </p>
            <Link to="/">
              <button className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold border-2 border-indigo-700 transition-all duration-300 text-base hover:shadow-lg active:scale-95 touch-manipulation">
                Get Started - It's Free
              </button>
            </Link>
            <p className="text-slate-400 text-sm mt-6">
              Made with care by TimecounterPro Team • © {new Date().getFullYear()}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}

export default About;