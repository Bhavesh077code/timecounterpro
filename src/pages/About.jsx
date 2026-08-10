// src/pages/About.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  // ✅ Timer Modes Data
  const timerModes = [
    {
      id: 'countdown',
      icon: <FiCalendar className="text-4xl text-purple-400" />,
      title: '📅 Custom Countdown Timer',
      description: 'Counts down to a specific date and time. Shows days, hours, minutes, and seconds remaining until your event.',
      howToUse: 'Enter Event Name → Select Date & Time → Choose Theme → Click "Create Countdown" → Share the link!',
      examples: '🎂 Birthday, 💍 Wedding, 🎆 New Year, 📚 Exam, ✈️ Vacation, 🏆 Event Launch',
      bestFor: 'Events, Deadlines, Special Occasions, Festivals, Anniversaries'
    },
    {
      id: 'presets',
      icon: <FiZap className="text-4xl text-yellow-400" />,
      title: '⚡ Quick Start Presets',
      description: 'Ready-made timers that start with one click. No setup needed, just click and go!',
      howToUse: 'Click any preset button → Timer starts immediately!',
      examples: '☕ Quick Break (5min), 🎯 Focus (15min), 📚 Deep Work (30min), 💪 Workout (1hr), 🎬 Movie (2hrs), 😴 Sleep (8hrs), 🍳 Cooking (45min), 🧘 Meditate (10min)',
      bestFor: 'Quick tasks, Breaks, Short sessions, Instant timing'
    },
    {
      id: 'custom',
      icon: <FiClock className="text-4xl text-blue-400" />,
      title: '🎨 Custom Manual Timer',
      description: 'Build your own timer with custom hours, minutes, and seconds. Give it a name and start whenever you want.',
      howToUse: 'Click "▼ Expand" → Enter Timer Name → Set Hours, Minutes, Seconds → Click "🚀 Start Timer"',
      examples: 'Project Task, Coding Session, Meeting Timer, Personal Goal, Any specific duration',
      bestFor: 'Specific time needs, Custom durations, Named timers, Multiple timers'
    },
    {
      id: 'stopwatch',
      icon: <FiStopCircle className="text-4xl text-green-400" />,
      title: '⏱️ Digital Stopwatch',
      description: 'Measures elapsed time - counts up from zero. Perfect for timing activities with lap recording.',
      howToUse: 'Click "▶ Start" → Click "🏁 Lap" to record split times → Click "⏸ Pause" to stop → Click "🔄 Reset" to clear',
      examples: '🏃 Workout, 🍳 Cooking, 🏁 Racing, 📝 Tasks, 🎮 Gaming, ⏱️ Any timed activity',
      bestFor: 'Sports, Cooking, Tasks, Racing, Gaming, Measuring duration'
    },
    {
      id: 'pomodoro',
      icon: <FiPlay className="text-4xl text-red-400" />,
      title: '🍅 Pomodoro Study Timer',
      description: 'A proven study technique: 25 minutes of focused work followed by 5 minute breaks. Perfect for productivity!',
      howToUse: 'Click "▶ Start" → Focus for 25 minutes → Take 5 minute break → Repeat! → Sound alerts for focus and break',
      examples: '📚 Studying, 💻 Working, ✍️ Writing, 💻 Coding, 🎨 Creative work, 📖 Reading',
      bestFor: 'Students, Professionals, Writers, Coders, Anyone needing focus'
    }
  ];

  // ✅ Timer Comparison Table Data
  const comparisonData = [
    { feature: 'What it does', countdown: 'Counts down to event', stopwatch: 'Measures elapsed time', pomodoro: 'Focus + Break cycles', presets: 'One-click timers' },
    { feature: 'Best for', countdown: 'Events, deadlines', stopwatch: 'Sports, cooking', pomodoro: 'Study, work', presets: 'Quick tasks' },
    { feature: 'Time direction', countdown: '⬇️ Counting down', stopwatch: '⬆️ Counting up', pomodoro: '🔄 Both', presets: '⬇️ Counting down' },
    { feature: 'Duration', countdown: 'Custom (any date)', stopwatch: 'Unlimited', pomodoro: '25min / 5min', presets: '5min to 8hrs' },
    { feature: 'Sound', countdown: 'Optional', stopwatch: 'Optional', pomodoro: 'Tick + completion', presets: 'Optional' },
  ];

  // ✅ Pomodoro Features
  const pomodoroFeatures = [
    {
      title: "25-Minute Focus Sessions",
      description: "Work or study for 25 minutes with complete focus. This is the standard Pomodoro technique that helps you stay productive.",
      whenToUse: "When you need to focus on a task without distractions. Perfect for studying, writing, coding, or any deep work."
    },
    {
      title: "5-Minute Breaks",
      description: "After each focus session, take a 5-minute break. Stand up, stretch, drink water, or relax your mind.",
      whenToUse: "When you feel tired or lose concentration. Short breaks help you recharge and stay productive."
    },
    {
      title: "Tick Sound",
      description: "Hear a gentle tick sound every second. This keeps you aware of time passing without being distracting.",
      whenToUse: "When you want to stay focused with subtle audio feedback. Turn it on/off anytime."
    },
    {
      title: "Completion Sound",
      description: "A pleasant sound plays when your focus or break session is complete. You'll never miss the end of your session.",
      whenToUse: "When you want to be notified without looking at the screen. Perfect for when you're away from your desk."
    },
    {
      title: "Volume Control",
      description: "Adjust the sound volume from 0% to 100%. Mute when you need complete silence.",
      whenToUse: "When you're in a quiet environment like a library or office. Customize the volume to your preference."
    },
    {
      title: "Session Counter",
      description: "Track how many Pomodoro sessions you've completed. Watch your productivity grow day by day.",
      whenToUse: "When you want to measure your daily productivity. See how many sessions you completed today."
    },
    {
      title: "Visual Progress Bar",
      description: "A colorful progress bar shows how much time is left in your current session. Green, yellow, or red based on time remaining.",
      whenToUse: "When you want a quick visual reference of time remaining without reading numbers."
    },
    {
      title: "Pomodoro Technique Benefits",
      description: "This technique helps you avoid burnout, maintain focus, and get more work done in less time.",
      whenToUse: "When you have a lot of work to do and want to stay productive for longer periods."
    }
  ];

  // ✅ All Features Data
  const features = [
    {
      icon: <FiClock className="text-3xl text-purple-400" />,
      title: "Multiple Timer Modes",
      description: "Use 5 different timer modes: Countdown (for events), Stopwatch (for timing), Pomodoro (for study/work), Quick Presets (one-click), and Custom Timer (manual setup).",
      useCase: "Students use Pomodoro for study, professionals use Stopwatch for tasks, event planners use Countdown for events."
    },
    {
      icon: <FiShare2 className="text-3xl text-pink-400" />,
      title: "Shareable Links",
      description: "Create a unique link for your countdown and share it with anyone. They can see the live countdown without any app installation.",
      useCase: "Share wedding countdown with guests, share exam countdown with classmates, share project deadline with team."
    },
    {
      icon: <FiCode className="text-3xl text-blue-400" />,
      title: "Embed Widget",
      description: "Add a live countdown timer to your website or blog. Just copy the embed code and paste it anywhere.",
      useCase: "Bloggers add countdown to their posts, event planners add to event websites, teachers add to school websites."
    },
    {
      icon: <FiMonitor className="text-3xl text-green-400" />,
      title: "Full Screen Mode",
      description: "Open the timer in full screen for distraction-free focus. Perfect for studying, working, or events.",
      useCase: "Students use for focused study, speakers use for event countdowns, teachers use for classroom activities."
    },
    {
      icon: <FiZap className="text-3xl text-yellow-400" />,
      title: "Quick Presets",
      description: "Start a timer instantly with one click. Choose from 8 ready-made timers: Break, Focus, Deep Work, Workout, Movie, Sleep, Cooking, Meditation.",
      useCase: "Quickly start a 25-minute focus session, 5-minute break, or 45-minute workout without any setup."
    },
    {
      icon: <FiBarChart2 className="text-3xl text-red-400" />,
      title: "Timer History & Stats",
      description: "Track all your completed timers. See how many timers you've completed and total time spent.",
      useCase: "Track your daily productivity, see how much time you spent studying, monitor your workout sessions."
    },
    {
      icon: <FiUsers className="text-3xl text-indigo-400" />,
      title: "Free & No Registration",
      description: "Use all features without creating an account. No sign-up, no login, no personal data collected.",
      useCase: "Anyone can start using immediately. Perfect for quick use without any hassle."
    },
    {
      icon: <FiTrendingUp className="text-3xl text-orange-400" />,
      title: "SEO & Backlinks",
      description: "When you embed the timer on your website, you get a free backlink to your site. This helps your website rank higher on Google.",
      useCase: "Bloggers and website owners get free SEO benefits while providing a useful tool to their visitors."
    }
  ];

  // ✅ FAQ Data
  const faqs = [
    {
      question: "What is TimerPro and how does it work?",
      answer: "TimerPro is a free online timer application that helps you manage your time effectively. You can create countdowns for events, use stopwatch for timing, or use Pomodoro timer for focused work. Just open the app, choose your timer type, set the time, and start. It's that simple!"
    },
    {
      question: "Which timer should I use for studying?",
      answer: "The Pomodoro Timer is best for studying. It uses the proven technique: 25 minutes of focused study followed by a 5-minute break. After 4 sessions, take a longer break. This helps you stay focused and avoid burnout."
    },
    {
      question: "Which timer should I use for events?",
      answer: "Use the Custom Countdown Timer for events. You can set the exact date and time of your event, and it will show a live countdown with days, hours, minutes, and seconds. You can also share the countdown link with others."
    },
    {
      question: "Is TimerPro really free to use?",
      answer: "Yes! TimerPro is 100% free forever. There are no hidden charges, no premium plans, and no credit card required. All features are available to everyone for free."
    },
    {
      question: "Do I need to create an account or sign up?",
      answer: "No! TimerPro doesn't require any registration. You can start using it immediately. We don't collect any personal data. Your timers are stored locally on your device."
    },
    {
      question: "What is the difference between Countdown and Stopwatch?",
      answer: "Countdown counts down to a future date and time (like days until an event). Stopwatch counts up from zero (like timing how long something takes). Countdown has a set end time, Stopwatch can run indefinitely."
    },
    {
      question: "How does the Pomodoro Timer work?",
      answer: "The Pomodoro Timer follows the proven Pomodoro Technique: 25 minutes of focused work followed by a 5-minute break. After every 4 sessions, you can take a longer break. You can also customize the time if needed."
    },
    {
      question: "Can I share my countdown with others?",
      answer: "Yes! TimerPro generates a unique shareable link for every countdown you create. You can copy this link and share it with friends, family, or colleagues via WhatsApp, Twitter, Facebook, or any other platform."
    },
    {
      question: "What are Quick Presets?",
      answer: "Quick Presets are ready-made timers you can start with one click. We offer 8 presets: Quick Break (5min), Focus (15min), Deep Work (30min), Workout (1hr), Movie (2hrs), Sleep (8hrs), Cooking (45min), and Meditation (10min)."
    },
    {
      question: "Can I use TimerPro on my phone?",
      answer: "Absolutely! TimerPro is fully responsive and works on all devices - mobile phones, tablets, laptops, and desktop computers. The interface automatically adjusts to fit your screen size."
    },
    {
      question: "Can I embed TimerPro on my website?",
      answer: "Yes! TimerPro provides an easy embed widget. You can copy the iframe code and paste it on your website or blog. It's a great way to add a countdown timer to your site and get free SEO backlinks."
    },
    {
      question: "What is Full Screen mode for?",
      answer: "Full Screen mode removes all distractions and shows only the timer. It's perfect for studying, working, presentations, or displaying countdowns on large screens during events."
    },
    {
      question: "Is my privacy protected?",
      answer: "Yes! TimerPro is designed with privacy in mind. We don't collect any personal information, don't use cookies for tracking, and don't send any data to external servers. Everything stays on your device."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* ✅ Header */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl shadow-purple-500/25 mb-4">
            <span className="text-6xl">⏱️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            TimecounterPro - Complete Guide
          </h1>
          <p className="text-gray-400 mt-3 text-lg max-w-2xl mx-auto">
            Everything you need to know about TimecounterPro features, timers, and how to use them.
            <br />
            <span className="text-purple-400">100% Free • No Registration Required</span>
          </p>
        </div>

        {/* ✅ What is TimerPro */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">❓ What is TimecounterPro?</h2>
          <p className="text-gray-300 leading-relaxed">
            TimecounterPro is a <span className="text-purple-400 font-semibold">free online timer application</span> that helps you 
            manage your time effectively. Whether you're a <span className="text-blue-400">student</span> studying for exams, 
            a <span className="text-green-400">professional</span> working on projects, or an
            <span className="text-yellow-400"> event planner</span> organizing a wedding or party, 
            TimecounterPro has the right timer for you.
          </p>
          <p className="text-gray-400 mt-3 text-sm">
            No sign-up needed. No personal data collected. Just open the app and start using it instantly.
          </p>
        </div>

        {/* ✅ All Timer Modes - Detailed Explanation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <span>🕐</span> All Timer Modes - Complete Guide
          </h2>
          <p className="text-gray-400 mb-6">
            TimecounterPro offers <span className="text-purple-400 font-semibold">5 different timer modes</span>. 
            Each mode is designed for a specific purpose. Choose the one that fits your need!
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timerModes.map((mode, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-4 mb-4">
                  {mode.icon}
                  <h3 className="text-xl font-bold text-white">{mode.title}</h3>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                  {mode.description}
                </p>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-3">
                  <p className="text-purple-300 text-xs">
                    <span className="font-semibold">📖 How to use:</span> {mode.howToUse}
                  </p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-3">
                  <p className="text-blue-300 text-xs">
                    <span className="font-semibold">✨ Examples:</span> {mode.examples}
                  </p>
                </div>

                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <p className="text-green-300 text-xs">
                    <span className="font-semibold">🎯 Best for:</span> {mode.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Timer Comparison Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-8 overflow-x-auto">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <span>📊</span> Timer Comparison
          </h2>
          <p className="text-gray-400 mb-4">Quick comparison of all timer modes to help you choose the right one.</p>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Feature</th>
                <th className="text-left py-3 px-4 text-purple-400 font-medium">📅 Countdown</th>
                <th className="text-left py-3 px-4 text-green-400 font-medium">⏱️ Stopwatch</th>
                <th className="text-left py-3 px-4 text-red-400 font-medium">🍅 Pomodoro</th>
                <th className="text-left py-3 px-4 text-yellow-400 font-medium">⚡ Presets</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-gray-300 font-medium">{row.feature}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{row.countdown}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{row.stopwatch}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{row.pomodoro}</td>
                  <td className="py-3 px-4 text-gray-400 text-xs">{row.presets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Pomodoro Timer Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <span>🍅</span> Pomodoro Timer - Features Guide
          </h2>
          <p className="text-gray-400 mb-4">Learn how to use the Pomodoro technique for maximum productivity.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pomodoroFeatures.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                <div className="mt-3 bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
                  <p className="text-purple-300 text-xs">
                    <span className="font-semibold">💡 When to use:</span> {feature.whenToUse}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ All Features Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <span>⭐</span> All Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                    <div className="mt-2 bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
                      <p className="text-purple-300 text-xs">
                        <span className="font-semibold">💡 Example:</span> {feature.useCase}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ FAQ Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <span>❓</span> Frequently Asked Questions
          </h2>
          <p className="text-gray-400 mb-6">Find answers to the most common questions about TimecounterPro.</p>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-all duration-300"
                >
                  <span className="text-white font-medium text-base">{faq.question}</span>
                  <span className="text-purple-400 flex-shrink-0 ml-4">
                    {openFaq === index ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </span>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Who Can Use */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <span>👥</span> Who Can Use TimecounterPro?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-2">🎓</div>
              <div className="text-white text-sm font-semibold">Students</div>
              <div className="text-gray-500 text-xs">Study & exams</div>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-2">💼</div>
              <div className="text-white text-sm font-semibold">Professionals</div>
              <div className="text-gray-500 text-xs">Work & projects</div>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-2">🎉</div>
              <div className="text-white text-sm font-semibold">Event Planners</div>
              <div className="text-gray-500 text-xs">Weddings & parties</div>
            </div>
            <div className="text-center bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="text-3xl mb-2">👨‍👩‍👧‍👦</div>
              <div className="text-white text-sm font-semibold">Everyone</div>
              <div className="text-gray-500 text-xs">Daily use</div>
            </div>
          </div>
        </div>

        {/* ✅ Why Use TimerPro */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
            <span>💡</span> Why Use TimecounterPro?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <h4 className="text-white font-semibold">Completely Free</h4>
                <p className="text-gray-400 text-sm">No payment ever. All features are free.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <h4 className="text-white font-semibold">No Registration</h4>
                <p className="text-gray-400 text-sm">Start using immediately. No sign-up needed.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <h4 className="text-white font-semibold">Works Everywhere</h4>
                <p className="text-gray-400 text-sm">Mobile, tablet, desktop - all devices supported.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/5 rounded-xl p-4">
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <h4 className="text-white font-semibold">Privacy Focused</h4>
                <p className="text-gray-400 text-sm">No data collection. Your timers stay on your device.</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Call to Action */}
        <div className="text-center pt-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Ready to Start?
          </h2>
          <p className="text-gray-400 mb-6">
            Try TimecounterPro now. It's free, fast, and easy to use.
          </p>
          <Link to="/">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300">
              🚀 Start Using TimecounterPro
            </button>
          </Link>
          <p className="text-gray-500 text-sm mt-6">
            Made with ❤️ by TimecounterPro Team • © {new Date().getFullYear()}
          </p>
        </div>

      </div>
    </div>
  );
}

export default About;