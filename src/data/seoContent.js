// src/data/seoContent.js
//
// Written guide + FAQ for each of the 10 traffic pages.
// Rendered by <SeoArticle /> under the tool (so it is part of the real page,
// visible to people and to Googlebot / the AdSense crawler) and also output as
// FAQPage structured data by <Seo />.
//
// Rules for editing: keep it useful, specific and written for a human reader.
// Do not stuff keywords. Each page needs different content.

export const seoContent = {
  "/": {
    heading: "How to use the online countdown timer",
    sections: [
      {
        h: "Set a countdown in three steps",
        p: [
          "Type a name for your timer, choose the hours, minutes and seconds (or pick a target date), and press start. The countdown runs in your browser, so there is nothing to install and no account to create. Open the fullscreen view when you want the numbers readable from across a room, for example on a classroom projector or a second monitor.",
          "Timers keep running if you switch tabs. The countdown is calculated from the exact end time rather than by counting ticks, so a throttled background tab does not make it drift. When it reaches zero you get an alarm sound and, if you allowed them, a browser notification.",
        ],
      },
      {
        h: "What people use a countdown timer for",
        list: [
          "Exams and homework: set the exact time left so you practise at real pace.",
          "Cooking and baking: run several named timers for different dishes at once.",
          "Meetings and calls: keep each agenda item to its slot.",
          "Events and deadlines: count down to a launch, a trip or a birthday and share the link.",
          "Games and classroom activities: a visible clock keeps everyone on the same page.",
        ],
      },
      {
        h: "Share a countdown with a link",
        p: [
          "Every countdown can be turned into a link that opens the same event and target date for anyone you send it to. A countdown to a date uses the clock on the device that opens it, so people in other time zones see the time remaining until that moment on their own clock. If the exact moment matters, state the time zone in the event name.",
        ],
      },
    ],
    faq: [
      { q: "Is the countdown timer free?", a: "Yes. It is free, needs no sign-up and has no usage limit." },
      { q: "Will the timer keep running if I close the tab?", a: "Your timers are saved in this browser. When you come back, timers that were running continue from their real end time, and timers that finished while you were away are moved to history." },
      { q: "What is the longest timer I can set?", a: "A single timer can run up to 24 hours." },
      { q: "Does it work on a phone?", a: "Yes. It works in any modern mobile or desktop browser. Keep the screen awake for the alarm sound if your phone locks quickly." },
      { q: "Where is my data stored?", a: "In your own browser storage. TimeCounterPro does not need an account and does not keep your timers on a server." },
    ],
  },

  "/pomodoro": {
    heading: "Getting more from the Pomodoro timer",
    sections: [
      {
        h: "Choosing session lengths that suit your work",
        p: [
          "This timer uses the classic pattern: 25 minutes of focus and a 5 minute break, with a longer break of 15 to 30 minutes after four rounds. It is a good starting point because 25 minutes is short enough to start without dread and long enough to make real progress.",
          "If your work needs longer blocks, such as writing, programming or problem sets, some people prefer 45 or 50 minute sessions with a 10 minute break. For that, set a custom time on the countdown timer on the home page and take your break manually. Let the task decide: answering email fits short intervals, while a hard chapter usually needs longer.",
        ],
      },
      {
        h: "Make the breaks count",
        p: [
          "A break only works if it is a break. Stand up, drink water, look at something far away and move around. Scrolling a feed keeps your brain in the same input mode and the next session feels harder. Keep the long break (15 to 30 minutes) for a walk, a snack or a real conversation.",
        ],
      },
      {
        h: "Common mistakes",
        list: [
          "Planning sessions without a clear single task for each one.",
          "Skipping breaks when you feel productive, then hitting a wall an hour later.",
          "Counting an interrupted session as complete. If you were pulled away, restart it.",
          "Using it for tasks that do not need focus, which makes the timer feel like a chore.",
        ],
      },
    ],
    faq: [
      { q: "How long is one Pomodoro?", a: "Traditionally 25 minutes of work followed by a 5 minute break. That is exactly what this timer runs. For other lengths, use the countdown timer." },
      { q: "How many Pomodoros should I do per day?", a: "Most people manage between 6 and 10 focused sessions on a full working day. Start with a smaller target and build up." },
      { q: "Can I use it for studying?", a: "Yes. Students use Pomodoro sessions to break a syllabus into small, trackable blocks. Pair it with the mock test timer for exam practice." },
      { q: "Does the timer sound when the session ends?", a: "Yes. You can turn the sound on or off and adjust the volume." },
      { q: "Does the timer keep time in a background tab?", a: "Yes. Sessions are timed from an exact end time, so a background tab does not make them run slow." },
    ],
  },

  "/stopwatch": {
    heading: "Using the online stopwatch and lap timer",
    sections: [
      {
        h: "Start, split and stop",
        p: [
          "Press start to begin timing and press the lap button each time you want to record a split. The stopwatch keeps counting while laps are recorded, so you see both the time of each lap and the total elapsed time. Pause freezes the clock and resume continues from the same point; reset clears the time and all laps.",
          "Time is measured against the system clock rather than by adding up timer ticks, which keeps the reading accurate even if the browser is busy.",
        ],
      },
      {
        h: "Stopwatch or timer: which one do you need?",
        p: [
          "A stopwatch counts up from zero and is for measuring how long something takes: a run, a lab step, a speech, a process in your day. A timer counts down from a set time and is for making sure something ends on time. If you already know the duration, use the countdown timer. If you want to find out the duration, use the stopwatch.",
        ],
      },
      {
        h: "Good uses for lap times",
        list: [
          "Running and swimming: compare each lap to find where you slow down.",
          "Study sessions: record how long each practice question takes.",
          "Work: time repetitive tasks to see what is worth automating.",
          "Cooking, science experiments and presentations rehearsals.",
        ],
      },
    ],
    faq: [
      { q: "How accurate is the online stopwatch?", a: "It displays minutes, seconds and hundredths of a second and uses the device clock for timing. It is accurate for everyday use, but button press delay and screen refresh mean it is not a replacement for certified sports timing." },
      { q: "Can I record laps?", a: "Yes. You can record unlimited laps, and each shows its own split time." },
      { q: "Does it keep running in another tab?", a: "Yes. The elapsed time is based on timestamps, so it stays correct while you use other tabs." },
      { q: "What is the difference between lap time and split time?", a: "A lap time is the time for one segment. A split time is the total elapsed time at the moment you pressed the button." },
      { q: "Is the stopwatch free?", a: "Yes, free and without sign-up." },
    ],
  },

  "/world-clock": {
    heading: "Planning across time zones",
    sections: [
      {
        h: "Find a meeting time that works for everyone",
        p: [
          "Add the cities your team or family lives in and the clock shows each local time side by side. Use the time slider to move forward or back and watch every city update together. The goal is to find a window where everyone is within normal working hours, or to see who has to stretch for the call so you can rotate the burden fairly.",
        ],
      },
      {
        h: "Things that trip people up",
        list: [
          "Daylight saving time starts and ends on different dates in different regions, so the gap between two cities can change for a few weeks each year.",
          "Some time zones are offset by 30 or 45 minutes. India is UTC+5:30 and Nepal is UTC+5:45, so Nepal is 15 minutes ahead of India.",
          "A date can differ between cities. When it is late evening in the Americas it may already be tomorrow in Asia.",
          "Always write the time zone in invitations (for example, 15:00 UTC) instead of assuming people will convert correctly.",
        ],
      },
    ],
    faq: [
      { q: "How do I convert time between two cities?", a: "Add both cities to the world clock. Each shows its current local time, and the slider lets you check a future time in both at once." },
      { q: "Does it handle daylight saving time?", a: "Yes. City times come from the browser's time zone database, which applies daylight saving rules for each region automatically." },
      { q: "What is my home time zone based on?", a: "You can set your home city. It is saved in your browser so the comparison starts from your own time." },
      { q: "Which time zones have unusual offsets?", a: "Examples include India (UTC+5:30), Nepal (UTC+5:45), parts of Australia (UTC+9:30 or +10:30) and Newfoundland in Canada (UTC-3:30 or -2:30)." },
      { q: "Is the world clock free?", a: "Yes, free and no account needed." },
    ],
  },

  "/time-card-calculator-online": {
    heading: "Time card calculator guide",
    sections: [
      {
        h: "How the calculation works",
        p: [
          "For each day, enter the time you clocked in, the time you clocked out and any unpaid break. The calculator subtracts the break from the span between in and out to get hours worked, adds the days together for the week and applies your hourly rate. Hours beyond 40 in the week are treated as overtime at the multiplier you choose (1.5 by default), and you can set hours after which double time applies.",
          "Example: Monday 9:00 to 17:30 with a 30 minute unpaid lunch is 8 hours. If you work 9:00 to 18:00 on each of five days with a 30 minute lunch, that is 8.5 hours a day, or 42.5 hours in the week, which leaves 2.5 hours of overtime above 40.",
        ],
      },
      {
        h: "Overtime basics",
        p: [
          "In the United States, the federal Fair Labor Standards Act requires overtime at one and a half times the regular rate for hours over 40 in a workweek for covered, non-exempt employees. Some states add daily overtime, for example after 8 hours in a day, and other countries have different rules. This tool uses a 40 hour weekly threshold and lets you change the multipliers, so check it against your own contract or local law. It gives you an estimate, not payroll or legal advice.",
        ],
      },
      {
        h: "Tips for accurate timesheets",
        list: [
          "Record times as soon as you clock in and out, not at the end of the week.",
          "Check whether your employer rounds to the nearest 5, 10 or 15 minutes.",
          "Keep unpaid breaks separate from paid breaks.",
          "Compare the total with your payslip and raise any difference early.",
        ],
      },
    ],
    faq: [
      { q: "How do I calculate hours worked from clock in and out?", a: "Subtract the clock in time from the clock out time, then subtract any unpaid break. For 9:00 to 17:30 with a 30 minute break, that is 8 hours." },
      { q: "Does it calculate overtime?", a: "Yes. Hours above 40 per week are paid at your overtime multiplier, and double time can apply after the hours you choose." },
      { q: "Can I include unpaid lunch breaks?", a: "Yes. Enter when your lunch starts and ends each day and it is deducted from that day's hours." },
      { q: "Is my timesheet saved?", a: "It is saved in your browser on this device, and you can copy the results. Nothing is uploaded to a server." },
      { q: "Is this a payroll tool?", a: "No. It is a calculator for estimating hours and pay. Your employer's payroll records are the official source." },
    ],
  },

  "/hiit-timer": {
    heading: "Setting up an interval workout",
    sections: [
      {
        h: "HIIT and Tabata in plain terms",
        p: [
          "High intensity interval training alternates hard effort with recovery. Classic Tabata, from research published by Izumi Tabata in 1996, is 20 seconds of all-out work and 10 seconds of rest, repeated 8 times for four minutes. To use it here, set work to 20, rest to 10 and cycles to 8. The default of 30 seconds work and 15 seconds rest suits beginners and general HIIT.",
        ],
      },
      {
        h: "Example workouts you can set",
        list: [
          "Beginner: 30 seconds work, 30 seconds rest, 8 rounds.",
          "General fitness: 40 seconds work, 20 seconds rest, 10 rounds.",
          "Classic Tabata: 20 seconds work, 10 seconds rest, 8 rounds.",
          "Core circuit: 45 seconds work, 15 seconds rest, 12 rounds across four exercises.",
        ],
      },
      {
        h: "Staying safe",
        p: [
          "Warm up for five minutes first and cool down afterwards. Hard intervals are demanding, so stop if you feel dizzy, feel chest pain or have unusual shortness of breath. If you have a heart condition, are pregnant, are returning from injury or have not exercised for a long time, check with a doctor before starting. Quality of movement matters more than finishing every round.",
        ],
      },
    ],
    faq: [
      { q: "What is a Tabata timer?", a: "A Tabata timer alternates 20 seconds of work with 10 seconds of rest for 8 rounds. This timer is fully adjustable, so you can run Tabata or any other interval pattern." },
      { q: "How many rounds should I do?", a: "Eight rounds is the Tabata standard. For a longer HIIT session, most people use 8 to 12 rounds." },
      { q: "Does it beep before the interval changes?", a: "Yes. A short beep plays near the end of each interval so you can prepare for the next one." },
      { q: "How often should I do HIIT?", a: "Two or three sessions per week with rest days in between is a common approach, because the intensity needs recovery time." },
      { q: "Do I need to install an app?", a: "No. It runs in your browser on a phone, tablet or computer." },
    ],
  },

  "/fasting-tracker-timer": {
    heading: "Using the fasting timer well",
    sections: [
      {
        h: "Choosing a fasting schedule",
        p: [
          "The 16:8 pattern means fasting for 16 hours and eating within an 8 hour window, for example eating between 12:00 and 20:00. 18:6 and 20:4 compress the eating window further. Most beginners start with 12:12 or 14:10 and work up. You can also set a custom fasting and eating length in the timer.",
          "Start your timer when you finish your last meal. The timer shows elapsed time, time remaining and the stage you are likely in, and it records each completed fast in your history along with badges for streaks.",
        ],
      },
      {
        h: "What the stages mean",
        p: [
          "The stages shown (fed, early fasting, fat burning, ketosis and so on) are general guides based on how the body shifts from using recent food to stored energy over many hours. People differ widely, and the hour marks are approximations, not measurements. Treat them as context rather than as a promise of specific results.",
        ],
      },
      {
        h: "Drinks, comfort and consistency",
        list: [
          "Water, plain tea and black coffee are generally used during the fasting window.",
          "Use the water tracker to keep track of daily intake.",
          "Break a fast with a balanced meal rather than a very large one.",
          "Consistency matters more than the longest possible fast.",
        ],
      },
      {
        h: "Who should be careful",
        p: [
          "This tool is for general information and is not medical advice. Talk to a doctor before fasting if you are pregnant or breastfeeding, have diabetes or take medicines that depend on food, are under 18, or have had an eating disorder. Stop and seek help if you feel unwell.",
        ],
      },
    ],
    faq: [
      { q: "What is 16:8 intermittent fasting?", a: "Fasting for 16 hours a day and eating within an 8 hour window." },
      { q: "Can I drink water while fasting?", a: "Yes. Water is normally allowed, and many people also have plain tea or black coffee. The tracker includes a water counter." },
      { q: "Where is my fasting data stored?", a: "In your own browser on this device. It is not uploaded and does not need an account." },
      { q: "Can I use a custom schedule?", a: "Yes. Beyond 16:8, 18:6 and 20:4 you can set your own fasting and eating hours." },
      { q: "Is the timer medical advice?", a: "No. It is a tracking tool. Speak to a healthcare professional about whether fasting suits you." },
    ],
  },

  "/mock-test-timer": {
    heading: "Practising with a sectional exam timer",
    sections: [
      {
        h: "Why timing practice matters",
        p: [
          "In many competitive exams you are not only tested on what you know but on how well you spend a fixed number of minutes. In sectional exams you also cannot go back after a section ends. Practising with the same limits trains you to skip, return and decide quickly, and shows where the minutes go.",
        ],
      },
      {
        h: "Set your own sections",
        p: [
          "The timer loads four example sections which you can rename, resize and add to. Edit the names, durations and question counts to match your exam. Always check the latest official notification for the pattern. For example, UPSC Civil Services Preliminary papers are two hours each, and the CAT is currently organised into three timed sections, but patterns change between years.",
          "When a section ends the screen locks and moves on, the way a real exam portal does. You get a warning when five minutes remain and a stronger one at one minute.",
        ],
      },
      {
        h: "How to run a good mock",
        list: [
          "Take it at the real exam time of day, in a quiet place, with your phone away.",
          "Use fullscreen so the clock is always visible but nothing else distracts.",
          "After each mock, note which questions took too long and which sections finished early.",
          "Review mistakes within 24 hours while you still remember your reasoning.",
        ],
      },
    ],
    faq: [
      { q: "Can I use it for CAT, JEE, UPSC or GRE?", a: "Yes. Set the sections, durations and question counts to match your exam's pattern." },
      { q: "Does the screen lock after each section?", a: "Yes. When a section ends you move to the next, and you cannot continue the previous one." },
      { q: "Is there a warning before time runs out?", a: "Yes. There is a warning at five minutes and a stronger one at one minute." },
      { q: "Can I rename the test?", a: "Yes. You can edit the exam name and each section's name." },
      { q: "Is it free?", a: "Yes. It is free and runs in your browser." },
    ],
  },

  "/presentation-timer": {
    heading: "Timing a talk or speech",
    sections: [
      {
        h: "Choose the right length and warning",
        p: [
          "Pick a preset (5, 10, 18, 30, 45 or 60 minutes) or set your own time. The display is intentionally large so you can read it from a distance. It stays green while you have time, turns amber when two minutes remain and red when time is up, so you get a clear signal without looking away from your audience.",
        ],
      },
      {
        h: "Planning how much to say",
        p: [
          "A comfortable speaking pace is roughly 120 to 150 words per minute, so a ten minute talk is around 1,200 to 1,500 words, less when you use pauses and visuals. As a guide, many speakers allow one to two minutes per slide. Rehearse with the timer on, and cut content rather than speeding up if you run over.",
        ],
      },
      {
        h: "Practical tips",
        list: [
          "Rehearse out loud at least twice with the real timer.",
          "Plan a checkpoint at the halfway mark.",
          "Leave a buffer of one minute for questions or technical trouble.",
          "Place the timer on a second screen or a laptop at the front of the room.",
        ],
      },
    ],
    faq: [
      { q: "How do I set up a timer for a 10 minute presentation?", a: "Choose the 10 minute preset (or enter your own time), open fullscreen and press start." },
      { q: "Does it warn me when time is almost up?", a: "Yes. The display changes to amber with two minutes remaining and to red when time ends, with a sound alert." },
      { q: "Can I use it on a projector?", a: "Yes. Open fullscreen and share or extend the screen to the projector." },
      { q: "What are common talk lengths?", a: "Lightning talks are about 5 minutes, conference talks often 18 to 20 minutes, and keynotes 30 to 45 minutes." },
      { q: "Is it free to use?", a: "Yes. It is free, in your browser and needs no sign-up." },
    ],
  },

  "/meditation-timer-with-sound": {
    heading: "Starting a daily meditation habit",
    sections: [
      {
        h: "Begin with five minutes",
        p: [
          "A short session you actually do beats a long one you skip. Sit comfortably, press start and follow the breathing circle: it expands as you breathe in and contracts as you breathe out. When your mind wanders, which it will, notice it and return to the breath without judging yourself. That return is the practice.",
        ],
      },
      {
        h: "Bell, bowl and background sound",
        p: [
          "Choose a gentle start and end sound, such as a bell or a singing bowl, so you are not jolted back by a harsh alarm. Soft rain or ambient sound can mask household noise. Many people prefer silence, which you can choose by turning the sounds off.",
        ],
      },
      {
        h: "Building the habit",
        list: [
          "Practise at the same time each day, for example just after waking.",
          "Increase by a minute or two each week rather than jumping to 20 minutes.",
          "Pair meditation with a habit you already have, like making tea.",
          "Use it before a study session to settle in, then switch to the Pomodoro timer.",
        ],
      },
    ],
    faq: [
      { q: "How long should a beginner meditate?", a: "Five minutes is a good start. Add a little time as it becomes easy." },
      { q: "Does the timer have a breathing guide?", a: "Yes. An animated circle guides a slow in and out rhythm." },
      { q: "Can I turn off the sounds?", a: "Yes. Bell, bowl and ambient sounds are each optional." },
      { q: "Is the animation reduced for people sensitive to motion?", a: "Yes. If your device is set to reduce motion, the animation is calmed." },
      { q: "Is it a substitute for medical care?", a: "No. Meditation is a wellbeing practice and not a treatment. Speak to a professional if you are struggling." },
    ],
  },
};

export default seoContent;
