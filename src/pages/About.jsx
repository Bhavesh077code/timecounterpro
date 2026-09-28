import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://timecounterpro.com";

function About() {
  const tools = [
    {
      name: "Countdown Timer",
      description:
        "A countdown timer helps you measure a specific amount of time from a chosen starting point. It can be useful for studying, cooking, meetings, presentations, classroom activities, practice sessions, personal challenges and many other everyday tasks.",
      useCases: [
        "Study sessions",
        "Cooking and baking",
        "Meetings and presentations",
        "Classroom activities",
        "Practice sessions",
        "Daily productivity tasks",
      ],
    },
    {
      name: "Pomodoro Timer",
      description:
        "The Pomodoro Timer is designed around focused work periods followed by planned breaks. It can help students, developers, writers, readers and other users create a simple structure for focused work without continuously checking the clock.",
      useCases: [
        "Studying",
        "Coding",
        "Reading",
        "Writing",
        "Research",
        "Focused office work",
      ],
    },
    {
      name: "Online Stopwatch",
      description:
        "The online stopwatch measures elapsed time starting from zero. It can be useful whenever you want to know how long an activity takes, compare attempts or practice completing an activity within a particular period.",
      useCases: [
        "Sports practice",
        "Workout sessions",
        "Speed practice",
        "Cooking",
        "Experiments",
        "Everyday time measurement",
      ],
    },
    {
      name: "World Clock",
      description:
        "The World Clock helps users compare the current time in different locations. This can be useful for remote teams, online meetings, communication with friends and family in other countries, travel planning and international work.",
      useCases: [
        "Remote work",
        "International meetings",
        "Travel planning",
        "Online classes",
        "Communication across countries",
        "Time-zone comparison",
      ],
    },
    {
      name: "World Clock Board",
      description:
        "The World Clock Board provides a convenient way to keep multiple locations visible together. Instead of checking different websites repeatedly, users can compare selected locations from one place.",
      useCases: [
        "Remote teams",
        "International businesses",
        "Travel planning",
        "Friends and family in different countries",
        "Online communities",
      ],
    },
    {
      name: "HIIT Timer",
      description:
        "The HIIT Timer is intended for structured work and rest intervals. Users can use timed intervals during exercise sessions where alternating periods need to be clearly separated.",
      useCases: [
        "Interval training",
        "Home workouts",
        "Exercise practice",
        "Circuit training",
        "Fitness routines",
      ],
    },
    {
      name: "Tabata Timer",
      description:
        "The Tabata Timer provides a simple timing structure for activities that use repeated work and rest intervals. It can be used during personal workouts and practice sessions.",
      useCases: [
        "Tabata-style workouts",
        "Interval exercise",
        "Fitness practice",
        "Home training",
      ],
    },
    {
      name: "Fasting Timer",
      description:
        "The Fasting Timer is a time-tracking utility for users who want to measure the duration of a fasting period. It is a timing tool only and does not provide medical advice, diagnosis or individualized nutrition recommendations.",
      useCases: [
        "Personal time tracking",
        "Meal schedule tracking",
        "Duration tracking",
      ],
    },
    {
      name: "Mock Test Timer",
      description:
        "The Mock Test Timer helps students practice completing tests within a planned time limit. A visible timer can make practice sessions more similar to situations where a fixed amount of time is available.",
      useCases: [
        "Exam preparation",
        "Mock tests",
        "Practice papers",
        "Timed quizzes",
        "Study sessions",
      ],
    },
    {
      name: "Group Study Timer",
      description:
        "The Group Study Timer can be used when several people want to follow the same planned study or activity period. It provides a shared timing structure that can make group sessions easier to organize.",
      useCases: [
        "Group study",
        "Classroom activities",
        "Study groups",
        "Team practice",
      ],
    },
    {
      name: "Presentation Timer",
      description:
        "The Presentation Timer helps speakers monitor the length of a presentation, speech, lesson or rehearsal. Practicing with a timer can help users understand how much content fits into a planned time period.",
      useCases: [
        "Presentations",
        "Public speaking practice",
        "Classroom presentations",
        "Lectures",
        "Speech rehearsal",
      ],
    },
    {
      name: "Stream Timer",
      description:
        "The Stream Timer provides a timing tool for livestream preparation, broadcasts, content creation and other activities where a visible countdown or duration indicator can be useful.",
      useCases: [
        "Livestreams",
        "Content creation",
        "Broadcast preparation",
        "Streaming sessions",
      ],
    },
    {
      name: "Speedrun Timer",
      description:
        "The Speedrun Timer is designed for users who want to measure and compare timed attempts during speedrun practice or other activities where elapsed time and splits are important.",
      useCases: [
        "Speedrun practice",
        "Gaming challenges",
        "Timed attempts",
        "Performance comparison",
      ],
    },
    {
      name: "Gameplay Timer",
      description:
        "The Gameplay Timer provides a simple timing utility for gaming sessions, challenges and practice activities. It can help players track a particular duration without needing a separate timer application.",
      useCases: [
        "Gaming sessions",
        "Challenges",
        "Practice",
        "Timed gameplay",
      ],
    },
    {
      name: "Meditation Timer",
      description:
        "The Meditation Timer provides a quiet timing experience for users who want to keep track of a meditation or focused breathing session. It is a timing utility and does not provide medical treatment or therapeutic advice.",
      useCases: [
        "Meditation",
        "Breathing practice",
        "Quiet focus",
        "Mindfulness sessions",
      ],
    },
  ];

  const faqs = [
    {
      question: "What is TimeCounterPro?",
      answer:
        "TimeCounterPro is a browser-based collection of online timing tools. It provides countdown timers, stopwatches, Pomodoro timers, world clocks and activity-specific timing tools that can be used directly from a web browser.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No account is required for normal use of the core TimeCounterPro tools. Users can open a tool and use it without creating a traditional account or login.",
    },
    {
      question: "Does TimeCounterPro work on mobile devices?",
      answer:
        "The website is designed as a responsive web application and can be accessed from supported phones, tablets, laptops and desktop computers. The exact experience can vary depending on the browser, screen size and device.",
    },
    {
      question: "Does TimeCounterPro store my timer settings?",
      answer:
        "Some features may use browser storage such as localStorage to remember selected settings or preferences. This storage is maintained by the browser on your device and is not the same as a TimeCounterPro user account.",
    },
    {
      question: "Is TimeCounterPro a precision timing instrument?",
      answer:
        "No. TimeCounterPro is a browser-based timing utility. Browser behavior, background tabs, device performance, operating-system restrictions and other technical factors can affect timing behavior. It should not be used as a certified instrument for safety-critical or regulated timing.",
    },
    {
      question: "Can I use TimeCounterPro for studying?",
      answer:
        "Yes. Countdown timers, Pomodoro sessions and mock-test timers can be useful for organizing study periods, practice tests, revision sessions and focused work.",
    },
    {
      question: "Can I use TimeCounterPro for workouts?",
      answer:
        "Some timing tools can be used for exercise intervals, HIIT-style sessions and other personal workout timing. However, the website does not provide medical advice or individualized exercise recommendations.",
    },
    {
      question: "Does TimeCounterPro provide medical advice?",
      answer:
        "No. TimeCounterPro provides timing utilities only. Health-related tools should not be treated as medical diagnosis, treatment or professional healthcare advice.",
    },
    {
      question: "Does TimeCounterPro use analytics?",
      answer:
        "The website uses Vercel Web Analytics to understand general website usage and performance. Analytics helps with understanding traffic patterns and identifying areas where the website can be improved.",
    },
    {
      question: "Does TimeCounterPro show advertisements?",
      answer:
        "The website may display advertisements through services such as Google AdSense. Advertising providers may use cookies or similar technologies according to their own policies and applicable settings.",
    },
    {
      question: "How can I report a bug?",
      answer:
        "You can use the Contact page to send a bug report, describe the problem and provide information that can help us understand what happened.",
    },
    {
      question: "Can I suggest a new feature?",
      answer:
        "Yes. Feature suggestions are welcome. When suggesting a feature, explaining the problem it would solve and how you would use it can make the feedback more useful.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          About TimeCounterPro | Free Online Timers, Stopwatch & World Clock
        </title>

        <meta
          name="description"
          content="Learn about TimeCounterPro, why it was created, how its online timers work, available tools, use cases, privacy approach, limitations and frequently asked questions."
        />

        <link rel="canonical" href={`${SITE_URL}/about`} />

        <meta name="robots" content="index,follow" />

        <meta property="og:title" content="About TimeCounterPro" />

        <meta
          property="og:description"
          content="Learn about TimeCounterPro and its collection of practical browser-based timing tools."
        />

        <meta property="og:url" content={`${SITE_URL}/about`} />
      </Helmet>

      <main className="min-h-screen bg-white text-slate-900">
        <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">

          {/* HERO */}

          <header className="pb-10">

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
              About TimeCounterPro
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Simple Online Time Tools for Real Everyday Activities
            </h1>

            <p className="mt-5 text-base leading-7 text-slate-700">
              TimeCounterPro is a browser-based collection of practical time
              management and timing tools designed for people who need a
              simple way to measure, organize or compare time. Instead of
              requiring users to install a separate application for every
              small timing task, TimeCounterPro brings different timing
              utilities together in one accessible website.
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Whether you are studying for an examination, working through a
              focused coding session, preparing a presentation, practicing a
              speedrun, measuring an exercise interval, checking another
              country's time or simply counting down to an event, the purpose
              of TimeCounterPro is to provide a clear and easy-to-use timing
              experience.
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              The project is built around a simple idea: time tools should be
              easy to understand, quick to access and useful for the specific
              activity a person is trying to complete.
            </p>

          </header>

          {/* WHY */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Why TimeCounterPro Exists
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Time is involved in almost every part of everyday life. Students
              use time limits when preparing for examinations. Developers
              divide work into focused sessions. Teachers plan classroom
              activities. Speakers practice presentations within a fixed
              duration. Cooks measure preparation and cooking periods.
              Athletes and fitness enthusiasts work with intervals. Remote
              teams coordinate across different time zones.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Although these activities are different, they share a common
              requirement: people need to understand how much time has passed,
              how much time remains or what the current time is somewhere else.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              TimeCounterPro was created around this common need. Instead of
              treating a timer as a single-purpose tool, the project brings
              together different timing experiences for different situations.
              The intention is not simply to display numbers on a screen.
              Each tool is designed around a particular use case so that users
              can understand why the tool exists and how it can help them.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              The project also aims to keep the experience straightforward.
              A visitor should be able to open a useful timing tool without
              going through a complicated registration process or learning a
              complicated interface before starting.
            </p>

          </section>

          {/* WHO */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Who Can Use TimeCounterPro?
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              TimeCounterPro is intended for general users who need browser
              based timing tools. It is not limited to one profession, age
              group or activity.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              {[
                [
                  "Students",
                  "Students can use countdowns, Pomodoro sessions and mock-test timers for revision, practice and focused study.",
                ],
                [
                  "Developers",
                  "Developers can use focused timing sessions while coding, debugging, reading documentation or taking planned breaks.",
                ],
                [
                  "Teachers",
                  "Teachers can use timers for classroom activities, quizzes, presentations, exercises and structured learning sessions.",
                ],
                [
                  "Professionals",
                  "Professionals can use timers for meetings, presentations, focused work sessions and time-zone coordination.",
                ],
                [
                  "Content Creators",
                  "Creators can use presentation, stream and countdown tools while preparing videos, livestreams and other content.",
                ],
                [
                  "Gamers",
                  "Gamers can use stopwatch and speedrun-related timing tools for practice, challenges and timed attempts.",
                ],
                [
                  "Fitness Users",
                  "Users can use interval-based timing tools during personal exercise sessions where a visible work and rest structure is useful.",
                ],
                [
                  "Everyday Users",
                  "Anyone who needs a simple countdown, stopwatch or clock can use the website for ordinary timing tasks.",
                ],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <h3 className="text-sm font-bold">{title}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-600">
                    {description}
                  </p>
                </div>
              ))}

            </div>

          </section>

          {/* HOW */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              How TimeCounterPro Works
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              TimeCounterPro is primarily a browser-based web application.
              When a user opens a timing tool, the website loads the
              application interface in the user's browser. The browser then
              handles much of the interactive timing experience.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              This approach means that normal use does not require creating a
              traditional user account. Users can visit the website, select
              the tool they need and begin using it.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Some features can use browser storage to remember preferences or
              settings. Browser storage is controlled by the browser and
              device being used. Clearing site data from the browser can
              remove locally stored preferences.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Like other web applications, the experience can also be
              influenced by the device, browser, operating system, internet
              connection and background-tab behavior.
            </p>

          </section>

          {/* TOOLS */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Our Timing Tools
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              TimeCounterPro contains several types of timing tools. Each tool
              is intended to serve a particular timing need. The purpose of
              having separate tools is to provide an experience that matches
              the activity instead of presenting every user with the same
              generic timer.
            </p>

            <div className="mt-6 space-y-3">

              {tools.map((tool, index) => (
                <section
                  key={tool.name}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                      {index + 1}
                    </div>

                    <div className="min-w-0">

                      <h3 className="text-base font-bold">
                        {tool.name}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {tool.description}
                      </p>

                      <div className="mt-3">
                        <p className="text-xs font-semibold text-slate-900">
                          Common uses:
                        </p>

                        <ul className="mt-1 grid gap-0.5 sm:grid-cols-2">
                          {tool.useCases.map((useCase) => (
                            <li
                              key={useCase}
                              className="text-xs leading-5 text-slate-600"
                            >
                              • {useCase}
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>

                  </div>
                </section>
              ))}

            </div>

          </section>

          {/* STUDY */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              TimeCounterPro for Study and Productivity
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              One of the most common reasons people use timing tools is to
              create structure around focused work. A timer does not
              automatically make a person productive, but it can provide a
              visible boundary around a task.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              For example, a student can choose a focused study period and
              work until the countdown finishes. After the session, the
              student can take a planned break and then begin another session.
              This can make a long study period feel more manageable because
              the learner is working with a defined time block instead of an
              open-ended task.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              The same principle can be applied to coding, writing, reading,
              research and other activities. The timer is simply a tool that
              helps make the intended time period visible.
            </p>

          </section>

          {/* PRESENTATIONS */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              TimeCounterPro for Presentations
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Presentations often have a fixed time limit. A speaker may have
              five minutes, ten minutes, twenty minutes or another defined
              amount of time to communicate an idea.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Practicing with a presentation timer can help a speaker discover
              whether the prepared material fits within the available time.
              It can also help identify sections that consistently take longer
              than expected.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              TimeCounterPro does not judge presentation quality. It simply
              provides the timing component so that the user can focus on
              preparing and delivering the content.
            </p>

          </section>

          {/* WORLD CLOCK */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Time Zones and World Clocks
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Modern communication frequently crosses time zones. A person
              working with a remote team may need to know whether it is morning
              or evening for a colleague in another country. A student may
              attend an international online class. A traveler may want to
              compare local time with the time at home.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              TimeCounterPro's world-clock tools are designed to make these
              comparisons easier by presenting times for selected locations in
              a single interface.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Time-zone information can be affected by daylight-saving rules
              and changes maintained by operating systems and time-zone
              databases. Users should verify critical scheduling information
              when an exact appointment or regulated deadline is involved.
            </p>

          </section>

          {/* FITNESS */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Timing for Exercise and Personal Activities
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Timing can also be useful during personal exercise routines.
              Interval-based tools can provide a visible structure for periods
              of activity and rest.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              TimeCounterPro includes timing experiences that may be useful
              for HIIT-style sessions, Tabata-style intervals and other
              personal workout routines.
            </p>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="text-sm font-bold text-amber-900">
                Important health notice
              </h3>

              <p className="mt-2 text-xs leading-5 text-amber-900">
                TimeCounterPro provides timing functionality only. It does not
                provide medical diagnosis, treatment, personalized exercise
                prescriptions or medical advice. If you have a health
                condition or concern, seek advice from an appropriately
                qualified healthcare professional.
              </p>
            </div>

          </section>

          {/* DESIGN PRINCIPLES */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              How We Approach the User Experience
            </h2>

            <div className="mt-5 space-y-4">

              <div>
                <h3 className="text-base font-bold">
                  1. Keep the main task clear
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  A timer should make the remaining or elapsed time easy to
                  understand. The interface should not make users search
                  through unnecessary controls before they can start a basic
                  timing task.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold">
                  2. Build around real use cases
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Separate tools exist because different activities have
                  different timing requirements. A presentation timer and a
                  world clock, for example, solve different problems.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold">
                  3. Make tools accessible from the browser
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Browser-based tools can be convenient because users can open
                  them from supported devices without installing dedicated
                  software for every timing task.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold">
                  4. Explain limitations honestly
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  A browser timer has technical limitations. We believe users
                  should understand those limitations rather than being given
                  unrealistic claims about precision or reliability.
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold">
                  5. Improve based on actual problems
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Feedback and real-world use can reveal problems that are not
                  obvious during development. Bug reports and feature
                  suggestions can therefore help guide future improvements.
                </p>
              </div>

            </div>

          </section>

          {/* PRIVACY */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Privacy and Data Approach
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              TimeCounterPro is designed so that normal use of its core timing
              tools does not require creating an account. This means users can
              use the main functionality without submitting registration
              information.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Some browser-based features may use local storage to remember
              preferences or configurations. This information is stored by
              the browser on the user's device.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              The website also uses third-party services for purposes such as
              hosting, analytics and advertising. These services may process
              technical or advertising-related information according to their
              own policies.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              We provide more detailed information about these technologies,
              browser storage, analytics and advertising in our Privacy
              Policy.
            </p>

            <Link
              to="/privacy"
              className="mt-4 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Read the complete Privacy Policy →
            </Link>

          </section>

          {/* ADVERTISING */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Advertising and Keeping the Website Available
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              TimeCounterPro may display advertisements through third-party
              advertising services such as Google AdSense. Advertising can
              help support the ongoing hosting, development, maintenance and
              improvement of a free web service.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Advertising is separate from the core purpose of the website.
              The purpose of the timing tools is to provide useful timing
              functionality, while advertising can help support the operation
              of the project.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Third-party advertising providers may use cookies or similar
              technologies according to their own policies and applicable user
              settings. Details about advertising and cookies are explained in
              the Privacy Policy.
            </p>

          </section>

          {/* ANALYTICS */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Website Analytics
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              TimeCounterPro uses Vercel Web Analytics to understand general
              website usage and performance. Analytics can provide useful
              information about how pages are being used and can help identify
              technical or usability problems.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Analytics information is useful for improving the project
              because development decisions should ideally be based on actual
              website behavior rather than assumptions alone.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              The use of analytics does not mean that TimeCounterPro requires
              users to create an account. The core tools remain available
              without traditional registration.
            </p>

          </section>

          {/* ACCURACY */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Understanding Timer Accuracy
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              It is important to understand that TimeCounterPro is a web
              application rather than a certified hardware timing instrument.
              Modern browsers perform many tasks simultaneously, and the
              operating system may change how background browser tabs,
              inactive windows or resource-intensive applications are handled.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Device performance, browser behavior, battery-saving modes,
              background activity and operating-system scheduling can all
              influence when visual updates occur.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              For normal activities such as studying, cooking, presentations,
              meetings, personal productivity and general practice, a browser
              timer can be convenient. However, users should not depend on it
              as the sole timing source for safety-critical, medical,
              industrial, laboratory, competition-regulated or legally
              sensitive activities.
            </p>

          </section>

          {/* MOBILE */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Using TimeCounterPro on Different Devices
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              TimeCounterPro is designed as a responsive website so that timing
              tools can be accessed from different screen sizes. Depending on
              the specific tool and device, the layout may adapt to provide
              controls suitable for smaller or larger displays.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              On mobile devices, browser and operating-system behavior can
              affect timers when the browser is placed in the background or
              when the device enters a power-saving state. For important
              timing requirements, users should keep these limitations in mind.
            </p>

          </section>

          {/* ACCESSIBILITY */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Accessibility and Simplicity
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              A useful timing tool should not require advanced technical
              knowledge. TimeCounterPro aims to keep the main interactions
              understandable so that users can focus on the activity they are
              timing rather than learning complicated software.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              The project continues to improve layouts, controls and
              information so that the website can be easier to use across
              supported devices and browsing environments.
            </p>

          </section>

          {/* CONTENT */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Our Approach to Content
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              TimeCounterPro is not intended to be a collection of pages that
              exist only to attract search traffic. Each useful tool should
              have a clear purpose, and supporting content should help visitors
              understand when and how that tool can be used.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              We aim to provide explanations that are practical and
              understandable rather than filling pages with unnecessary
              repetition. When information changes, content should be reviewed
              and updated so that it remains relevant to users.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              This approach also means that some pages may be changed, merged
              or removed when they no longer provide a meaningful experience.
            </p>

          </section>

          {/* FUTURE */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Future Development
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              TimeCounterPro is an evolving project. Future development may
              focus on improving existing timers, refining the interface,
              improving accessibility, expanding useful timing workflows and
              fixing issues reported by users.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              New features should be added when they solve a genuine user
              problem rather than simply increasing the number of pages or
              controls on the website.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              The long-term goal is to make TimeCounterPro a dependable
              collection of practical web-based timing utilities that people
              can return to whenever they need a simple way to work with time.
            </p>

          </section>

          {/* RESPONSIBLE USE */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Responsible Use
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              TimeCounterPro is designed to support everyday timing tasks, but
              users are responsible for deciding whether a browser-based tool
              is appropriate for their particular situation.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              If a task has serious safety, medical, legal, industrial or
              professional consequences, use an appropriate certified system
              or professional procedure rather than relying only on a general
              web timer.
            </p>

          </section>

          {/* FAQ */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Frequently Asked Questions
            </h2>

            <div className="mt-5 space-y-2">

              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-slate-200 bg-slate-50 p-4"
                >
                  <summary className="cursor-pointer list-none text-sm font-bold text-slate-900">
                    <span className="flex items-center justify-between gap-3">
                      {faq.question}

                      <span className="text-indigo-600 transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>

                  <p className="mt-3 text-xs leading-5 text-slate-600">
                    {faq.answer}
                  </p>
                </details>
              ))}

            </div>

          </section>

          {/* LINKS */}

          <section className="border-t border-slate-200 py-10">

            <h2 className="text-2xl font-bold">
              Learn More About the Website
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Transparency is important when operating a web service. If you
              want to understand how information is handled, what third-party
              services may be involved or what rules apply when using the
              website, please review the dedicated legal pages.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              <Link
                to="/privacy"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-indigo-400 hover:text-indigo-700"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-indigo-400 hover:text-indigo-700"
              >
                Terms of Service
              </Link>

              <Link
                to="/contact"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Contact Us
              </Link>

            </div>

          </section>

          {/* CONTACT */}

          <section className="border-t border-slate-200 py-10">

            <div className="rounded-2xl bg-slate-950 p-6 text-white sm:p-8">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
                Have feedback?
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Help Us Improve TimeCounterPro
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                If you discover a bug, experience a problem with a timing
                tool, have a useful feature suggestion or notice information
                that should be corrected, we welcome your feedback. Clear
                reports help us understand what needs improvement.
              </p>

              <Link
                to="/contact"
                className="mt-5 inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
              >
                Contact TimeCounterPro
              </Link>

            </div>

          </section>

          {/* PURPOSE SECTION — SEPARATE, CLEAN SIDE LAYOUT */}

          <section className="mt-16 border-t-2 border-indigo-100 pt-12">

            {/* PURPOSE HEADER */}

            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-6 sm:p-8">

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Our Purpose
              </p>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Why We Built TimeCounterPro
              </h2>

              <p className="mt-5 text-base leading-7 text-slate-700">
                TimeCounterPro was created with a simple purpose: to make useful
                time-based tools easy to access, easy to understand and practical for
                everyday activities. Time is something people work with every day, but
                the way people need to measure or manage time can be very different.
                A student may need a study countdown, a developer may want a focused
                work session, a speaker may need to practice a presentation, a person
                in another country may want to compare time zones, and someone preparing
                a workout may need repeating work and rest intervals.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                These activities all involve time, but a single generic stopwatch or
                countdown does not always provide the most useful experience. This is
                one of the main reasons TimeCounterPro is organized around different
                timing tools and different real-world use cases.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                The goal is not simply to put a large number on a screen and call it a
                timer. The goal is to create tools that help people understand and
                manage a specific period of time while they are doing something
                meaningful.
              </p>

            </div>

            {/* PURPOSE CARDS — 2 COLUMN GRID */}

            <div className="mt-8 grid gap-4 md:grid-cols-2">

              {/* 01 */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                    01
                  </span>
                  <h3 className="text-base font-bold text-slate-950">
                    Make Time Tools Easy to Access
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  One purpose of TimeCounterPro is accessibility. Many everyday timing
                  tasks do not require complicated software, yet people often have to
                  search for a suitable application, install software or use a tool that
                  contains many features they do not need.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  TimeCounterPro provides browser-based timing tools that can be opened
                  directly from a supported web browser. The intention is to reduce the
                  unnecessary steps between identifying a timing need and starting the
                  timer.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Users can choose the type of tool that matches their activity and
                  begin using it without needing to create a traditional account for
                  normal use of the core tools.
                </p>
              </div>

              {/* 02 */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                    02
                  </span>
                  <h3 className="text-base font-bold text-slate-950">
                    Help People Structure Their Time
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A timer can provide a simple boundary around an activity. Instead of
                  working without a clear endpoint, a person can decide how much time
                  they want to spend and use a countdown to make that period visible.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This can be useful for studying, reading, writing, coding, practicing
                  a presentation, completing a mock test or working through another
                  focused task.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  TimeCounterPro does not claim that a timer automatically makes a
                  person productive. Its purpose is more practical: to provide a clear
                  time boundary that users can incorporate into their own routines.
                </p>
              </div>

              {/* 03 */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                    03
                  </span>
                  <h3 className="text-base font-bold text-slate-950">
                    Support Students and Learning
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Students are one of the important groups that can benefit from
                  practical timing tools. Studying often involves activities with
                  different time requirements, such as revision, reading, practice
                  questions, mock examinations and focused study sessions.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A student can use a countdown to create a defined study period, a
                  Pomodoro timer to organize focused sessions and breaks, or a mock-test
                  timer to practice completing questions within a fixed duration.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The purpose is not to replace a student's study method or teacher.
                  Instead, TimeCounterPro provides a simple supporting tool that can
                  help make the planned time visible.
                </p>
              </div>

              {/* 04 */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                    04
                  </span>
                  <h3 className="text-base font-bold text-slate-950">
                    Support Focused Work
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Modern work often requires people to divide their attention between
                  many tasks. A clearly defined work period can sometimes make it
                  easier to concentrate on one activity before moving to another.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Developers can use a timer during coding sessions. Writers can use
                  one while drafting. Readers can create a reading period. Professionals
                  can use a timer while preparing a document or practicing a
                  presentation.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  TimeCounterPro provides the timing component while leaving the actual
                  productivity method to the individual user.
                </p>
              </div>

              {/* 05 */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                    05
                  </span>
                  <h3 className="text-base font-bold text-slate-950">
                    Make Presentations Easier to Practice
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Presentations often have a fixed time limit. A speaker may know the
                  subject well but still need to practice how long the complete
                  presentation takes.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  A presentation timer allows users to rehearse while watching the
                  available time. This can reveal whether the introduction is too long,
                  whether a particular section takes more time than expected or whether
                  the entire presentation fits within the planned duration.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The tool does not evaluate the quality of a presentation. It simply
                  provides a clear timing reference so the speaker can focus on the
                  content and delivery.
                </p>
              </div>

              {/* 06 */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                    06
                  </span>
                  <h3 className="text-base font-bold text-slate-950">
                    Help With Time-Zone Differences
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  People increasingly communicate and work with others who live in
                  different cities and countries. A meeting that is convenient for one
                  person may happen very early in the morning or late at night for
                  another person.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  TimeCounterPro's world-clock tools are intended to make these
                  differences easier to understand by allowing users to compare
                  locations in one place.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This can be useful for remote teams, international communication,
                  online classes, travel planning, friends and families living in
                  different countries and anyone who regularly works across time zones.
                </p>
              </div>

              {/* 07 */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                    07
                  </span>
                  <h3 className="text-base font-bold text-slate-950">
                    Provide Practical Tools for Activities
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Different activities require different types of timing. An online
                  stopwatch is useful when measuring elapsed time, while a countdown is
                  useful when working toward a deadline. An interval timer is useful
                  when repeating work and rest periods, and a world clock is useful
                  when comparing locations.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  TimeCounterPro's purpose is therefore to organize timing tools around
                  these practical differences rather than treating every timing
                  situation as exactly the same.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This makes it easier for visitors to identify the tool that matches
                  the task they are actually trying to complete.
                </p>
              </div>

              {/* 08 */}
              <div className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600">
                    08
                  </span>
                  <h3 className="text-base font-bold text-slate-950">
                    Keep the Experience Simple
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A timing tool should not become more complicated than the activity it
                  is helping with. For many users, the most important requirements are
                  simply seeing the time clearly, controlling the timer and knowing when
                  the selected period has finished.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  TimeCounterPro aims to keep the primary task understandable while
                  still providing useful controls for users who need additional
                  functionality.
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This balance between simplicity and usefulness is an important part of
                  the project's purpose.
                </p>
              </div>

            </div>

            {/* DEEPER PURPOSE */}

            <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-6 sm:p-8">

              <h3 className="text-xl font-bold text-slate-950">
                Our Broader Purpose
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                The broader purpose of TimeCounterPro is to make working with time feel
                less complicated. People already have enough things to think about when
                they are studying, working, presenting, practicing, exercising or
                coordinating with others. A timing tool should support the activity
                rather than become another problem to solve.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                This is why the project focuses on clear timing experiences and
                activity-based tools. Instead of assuming that every visitor has the
                same need, the website provides different ways to work with time.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                The project also aims to be honest about what a browser timer can and
                cannot do. A web timer can be convenient for ordinary activities, but it
                should not be presented as a certified precision instrument. Browser
                performance, background tabs, device behavior and operating-system
                restrictions can affect timing behavior. Explaining these limitations is
                part of providing a responsible user experience.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-700">
                In the same way, TimeCounterPro does not claim that a timer will
                automatically improve productivity, guarantee better exam performance
                or replace professional advice. The website provides tools; users
                decide how those tools fit into their own activities and routines.
              </p>

            </div>

            {/* REAL-WORLD VALUE */}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

              <h3 className="text-xl font-bold text-slate-950">
                How TimeCounterPro Can Fit Into Everyday Life
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                A useful timing tool can become part of many small everyday routines.
                Someone preparing breakfast may use a countdown while cooking. A
                student may use a twenty-five-minute focus session before taking a
                break. A developer may set a work interval while solving a programming
                problem. A speaker may rehearse a presentation several times to
                understand its actual duration. A remote worker may check the current
                time in another country before scheduling a meeting.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                These are simple examples, but they represent the practical role that
                timing tools can play. The purpose of TimeCounterPro is to make these
                small timing tasks easier to perform without requiring a complicated
                workflow.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Because different people have different routines, the project continues
                to develop different tools instead of assuming that one timer can serve
                every situation equally well.
              </p>

            </div>

            {/* WHAT WE DO NOT CLAIM — YELLOW CONTAINER */}

            <div className="mt-8 rounded-2xl border-l-4 border-amber-400 bg-amber-50 p-6 sm:p-8">

              <h3 className="text-xl font-bold text-amber-950">
                What TimeCounterPro Does Not Claim
              </h3>

              <p className="mt-3 text-sm leading-6 text-amber-900">
                Being transparent about limitations is an important part of the
                project's purpose. TimeCounterPro does not claim to be a replacement
                for certified timing equipment, professional medical services,
                specialized industrial systems or regulated timing equipment.
              </p>

              <ul className="mt-4 space-y-2 text-sm leading-6 text-amber-900">

                <li>• It is not a certified precision timing instrument.</li>

                <li>• It does not provide medical diagnosis or treatment.</li>

                <li>• It does not guarantee that a user will become more productive.</li>

                <li>
                  • It does not guarantee a particular academic, fitness or professional
                  result.
                </li>

                <li>
                  • It should not be the only timing source for safety-critical
                  activities.
                </li>

                <li>
                  • Third-party services used by the website operate under their own
                  policies.
                </li>

              </ul>

            </div>

            {/* LONG-TERM PURPOSE */}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">

              <h3 className="text-xl font-bold text-slate-950">
                Our Long-Term Purpose
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                The long-term purpose of TimeCounterPro is to build a useful collection
                of dependable web-based timing utilities that people can return to when
                they need them. That means improving existing tools instead of simply
                creating more pages, fixing problems when they are discovered, making
                interfaces easier to understand and adding features only when they
                provide meaningful value.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                A growing website is not useful simply because it has more URLs. The
                more important question is whether each page helps a real person
                accomplish something. TimeCounterPro therefore aims to focus on
                practical tools and useful explanations rather than creating unnecessary
                variations of the same functionality.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                As the project develops, user feedback, technical improvements and
                changing web standards can influence how the tools are designed. The
                objective remains the same: provide clear, practical and accessible
                ways to work with time through the web.
              </p>

            </div>

          </section>

          {/* FINAL */}

          <footer className="mt-12 border-t border-slate-200 pt-6">

            <p className="text-xs leading-5 text-slate-500">
              TimeCounterPro is a browser-based timing utility project created
              to make everyday time measurement, countdowns, focused sessions
              and time-zone comparison more accessible from the web.
            </p>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Last reviewed: September 28, 2026
            </p>

          </footer>

        </article>
      </main>
    </>
  );
}

export default About;