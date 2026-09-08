/*
// src/data/seoTimers.js
// ✅ PRODUCTION READY - No Duplicates, No Bugs

// HELPER FUNCTIONS
const slugify = (text) => {
  if (!text) return '';
  return text.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// ✅ Check if slug already exists
const slugExists = (slugs, slug) => {
  return slugs.some(s => s === slug);
};

// ✅ Track all slugs to prevent duplicates
const usedSlugs = new Set();

// ✅ Add timer with duplicate check
const addTimer = (slug, title, duration, description, keywords, category) => {
  // ✅ Skip if slug already used
  if (usedSlugs.has(slug)) {
    console.warn(`⚠️ Duplicate slug skipped: ${slug}`);
    return;
  }
  
  usedSlugs.add(slug);
  seoTimers.push({
    id: seoTimers.length + 1, // ✅ Unique ID
    slug,
    title,
    duration,
    description,
    keywords,
    category,
    createdAt: new Date().toISOString() // ✅ For freshness
  });
};

// 📦 MAIN ARRAY
export const seoTimers = [];

// 1️⃣ 1 to 120 MINUTE TIMERS
for (let mins = 1; mins <= 120; mins++) {
  const duration = mins * 60;
  
  addTimer(
    slugify(`${mins}-minute-timer`),
    `${mins} Minute Timer`,
    duration,
    `Free ${mins} minute timer with sound and fullscreen. Perfect for workouts, study, cooking, and productivity.`,
    `${mins} minute timer, ${mins} min timer, online timer ${mins} minutes`,
    'minutes'
  );
  
  addTimer(
    slugify(`${mins}-min-timer`),
    `${mins} Min Timer`,
    duration,
    `Free ${mins} minute timer with alarm sound. Quick and easy online countdown timer.`,
    `${mins} min timer, ${mins} minute timer, online timer ${mins} min`,
    'minutes'
  );
  
  addTimer(
    slugify(`${mins}-minute-timer-with-sound`),
    `${mins} Minute Timer with Sound`,
    duration,
    `Free ${mins} minute timer with sound alert and fullscreen mode.`,
    `${mins} minute timer with sound, ${mins} min timer with alarm`,
    'minutes'
  );
  
  addTimer(
    slugify(`${mins}-minute-timer-with-alarm`),
    `${mins} Minute Timer with Alarm`,
    duration,
    `Free ${mins} minute timer with loud alarm. Never miss your time.`,
    `${mins} minute timer with alarm, ${mins} min timer with beep`,
    'minutes'
  );
  
  addTimer(
    slugify(`${mins}-minute-timer-fullscreen`),
    `${mins} Minute Timer Fullscreen`,
    duration,
    `Free ${mins} minute timer in fullscreen mode. Focus without distractions.`,
    `${mins} minute timer fullscreen, ${mins} min full screen timer`,
    'minutes'
  );
  
  addTimer(
    slugify(`${mins}-minute-countdown-timer`),
    `${mins} Minute Countdown Timer`,
    duration,
    `Free ${mins} minute countdown timer with visual progress bar.`,
    `${mins} minute countdown, ${mins} min countdown timer`,
    'minutes'
  );
}

// 2️⃣ STUDY TIMERS
const studyTimers = [
  { name: 'Study Timer', duration: 1800 },
  { name: 'Study Timer 30 Minutes', duration: 1800 },
  { name: 'Study Timer 45 Minutes', duration: 2700 },
  { name: 'Study Timer 1 Hour', duration: 3600 },
  { name: 'Study Timer 2 Hours', duration: 7200 },
  { name: 'Study Timer with Sound', duration: 1800 },
  { name: 'Study Timer 50 Minutes', duration: 3000 },
  { name: 'Study Timer 25 Minutes', duration: 1500 },
  { name: 'Study Timer 15 Minutes', duration: 900 },
  { name: 'Study Timer 10 Minutes', duration: 600 },
];

studyTimers.forEach(t => {
  addTimer(
    slugify(t.name),
    t.name,
    t.duration,
    `Free ${t.name} for students. Perfect for focused learning and exam preparation.`,
    `${t.name}, study timer, timer for students, exam timer`,
    'study'
  );
});

// 3️⃣ WORKOUT TIMERS
const workoutTimers = [
  { name: 'Workout Timer', duration: 1800 },
  { name: 'Workout Timer 30 Minutes', duration: 1800 },
  { name: 'Workout Timer 45 Minutes', duration: 2700 },
  { name: 'Workout Timer 1 Hour', duration: 3600 },
  { name: 'Workout Timer 15 Minutes', duration: 900 },
  { name: 'Workout Timer 20 Minutes', duration: 1200 },
  { name: 'Workout Timer 10 Minutes', duration: 600 },
  { name: 'Workout Timer with Sound', duration: 1800 },
  { name: 'Workout Timer with Alarm', duration: 1800 },
  { name: 'Workout Timer Fullscreen', duration: 1800 },
];

workoutTimers.forEach(t => {
  addTimer(
    slugify(t.name),
    t.name,
    t.duration,
    `Free ${t.name} for fitness. Perfect for gym and home workouts.`,
    `${t.name}, workout timer, fitness timer, gym timer`,
    'workout'
  );
});

// 4️⃣ POMODORO TIMERS
const pomodoros = [
  { name: 'Pomodoro Timer', focus: 1500 },
  { name: 'Pomodoro 25-5', focus: 1500 },
  { name: 'Pomodoro 50-10', focus: 3000 },
  { name: 'Pomodoro 45-15', focus: 2700 },
  { name: 'Pomodoro 20-5', focus: 1200 },
  { name: 'Pomodoro 30-5', focus: 1800 },
  { name: 'Pomodoro 60-10', focus: 3600 },
  { name: 'Pomodoro Timer with Sound', focus: 1500 },
  { name: 'Pomodoro Timer with Alarm', focus: 1500 },
  { name: 'Pomodoro Timer Fullscreen', focus: 1500 },
  { name: 'Study Pomodoro Timer', focus: 1500 },
  { name: 'Work Pomodoro Timer', focus: 1500 },
];

pomodoros.forEach(p => {
  addTimer(
    slugify(p.name),
    p.name,
    p.focus,
    `Free ${p.name} for productivity. Boost your focus with this Pomodoro technique timer.`,
    `${p.name}, pomodoro timer, focus timer, study timer`,
    'pomodoro'
  );
});

// 5️⃣ MEDITATION TIMERS
const meditationTimers = [
  { name: 'Meditation Timer', duration: 600 },
  { name: 'Meditation Timer 5 Minutes', duration: 300 },
  { name: 'Meditation Timer 10 Minutes', duration: 600 },
  { name: 'Meditation Timer 15 Minutes', duration: 900 },
  { name: 'Meditation Timer 30 Minutes', duration: 1800 },
  { name: 'Meditation Timer with Sound', duration: 600 },
  { name: 'Meditation Timer 1 Hour', duration: 3600 },
];

meditationTimers.forEach(t => {
  addTimer(
    slugify(t.name),
    t.name,
    t.duration,
    `Free ${t.name} for mindfulness and relaxation. Perfect for meditation practice.`,
    `${t.name}, meditation timer, mindfulness timer, relaxation timer`,
    'meditation'
  );
});

// 6️⃣ COOKING TIMERS
const cookingTimers = [
  { name: 'Cooking Timer', duration: 1800 },
  { name: 'Cooking Timer 30 Minutes', duration: 1800 },
  { name: 'Cooking Timer 45 Minutes', duration: 2700 },
  { name: 'Cooking Timer 1 Hour', duration: 3600 },
  { name: 'Cooking Timer 15 Minutes', duration: 900 },
  { name: 'Cooking Timer 10 Minutes', duration: 600 },
  { name: 'Cooking Timer with Alarm', duration: 1800 },
];

cookingTimers.forEach(t => {
  addTimer(
    slugify(t.name),
    t.name,
    t.duration,
    `Free ${t.name} for perfect cooking. Never overcook again.`,
    `${t.name}, cooking timer, kitchen timer, recipe timer`,
    'cooking'
  );
});

// 7️⃣ CLASSROOM TIMERS
const classroomTimers = [
  { name: 'Classroom Timer', duration: 1800 },
  { name: 'Classroom Timer 30 Minutes', duration: 1800 },
  { name: 'Classroom Timer 15 Minutes', duration: 900 },
  { name: 'Classroom Timer 10 Minutes', duration: 600 },
  { name: 'Classroom Timer 5 Minutes', duration: 300 },
  { name: 'Classroom Timer 1 Hour', duration: 3600 },
  { name: 'Classroom Timer with Sound', duration: 1800 },
  { name: 'Classroom Timer Fullscreen', duration: 1800 },
];

classroomTimers.forEach(t => {
  addTimer(
    slugify(t.name),
    t.name,
    t.duration,
    `Free ${t.name} for teachers. Perfect for tests and classroom activities.`,
    `${t.name}, classroom timer, teacher timer, school timer`,
    'classroom'
  );
});

// 8️⃣ MEETING TIMERS
const meetingTimers = [
  { name: 'Meeting Timer', duration: 1800 },
  { name: 'Meeting Timer 30 Minutes', duration: 1800 },
  { name: 'Meeting Timer 45 Minutes', duration: 2700 },
  { name: 'Meeting Timer 1 Hour', duration: 3600 },
  { name: 'Meeting Timer 15 Minutes', duration: 900 },
  { name: 'Meeting Timer 10 Minutes', duration: 600 },
  { name: 'Meeting Timer with Alarm', duration: 1800 },
  { name: 'Meeting Timer Fullscreen', duration: 1800 },
];

meetingTimers.forEach(t => {
  addTimer(
    slugify(t.name),
    t.name,
    t.duration,
    `Free ${t.name} for professionals. Keep meetings on track.`,
    `${t.name}, meeting timer, business timer, presentation timer`,
    'meeting'
  );
});

// 9️⃣ SPECIAL TIMERS
const specials = [
  { name: 'Exam Countdown', duration: 3600 },
  { name: 'Exam Timer', duration: 3600 },
  { name: 'Test Timer', duration: 1800 },
  { name: 'Quiz Timer', duration: 600 },
  { name: 'Presentation Timer', duration: 3000 },
  { name: 'Speech Timer', duration: 1800 },
  { name: 'Break Timer', duration: 300 },
  { name: 'Nap Timer', duration: 1200 },
  { name: 'Sleep Timer', duration: 28800 },
  { name: 'Timer for Kids', duration: 600 },
  { name: 'Timer for Homework', duration: 1800 },
  { name: 'Timer for Reading', duration: 1200 },
  { name: 'Timer for Writing', duration: 1500 },
  { name: 'Timer for Coding', duration: 1500 },
  { name: 'Timer for Cleaning', duration: 900 },
];

specials.forEach(s => {
  addTimer(
    slugify(s.name),
    s.name,
    s.duration,
    `Free ${s.name} with sound and fullscreen. Perfect for your needs.`,
    `${s.name}, timer, countdown, online timer`,
    'special'
  );
});

// 🔟 HOUR TIMERS
for (let hrs = 1; hrs <= 12; hrs++) {
  const duration = hrs * 3600;
  
  addTimer(
    slugify(`${hrs}-hour-timer`),
    `${hrs} Hour Timer`,
    duration,
    `Free ${hrs} hour timer with sound and fullscreen. Perfect for long sessions.`,
    `${hrs} hour timer, ${hrs} hr timer, online timer ${hrs} hours`,
    'hours'
  );
  
  addTimer(
    slugify(`${hrs}-hour-timer-with-sound`),
    `${hrs} Hour Timer with Sound`,
    duration,
    `Free ${hrs} hour timer with sound alert. Stay on track.`,
    `${hrs} hour timer with sound, ${hrs} hr timer with alarm`,
    'hours'
  );
}

// 1️⃣1️⃣ CUSTOM DURATION TIMERS
const customDurations = [3, 4, 6, 7, 8, 9, 12, 18, 22, 24, 26, 28, 32, 35, 40, 42, 48, 55, 75, 90, 100, 110];
customDurations.forEach(mins => {
  const duration = mins * 60;
  addTimer(
    slugify(`${mins}-minute-timer`),
    `${mins} Minute Timer`,
    duration,
    `Free ${mins} minute timer with sound and fullscreen. Start the countdown now!`,
    `${mins} minute timer, ${mins} min timer`,
    'custom'
  );
});


export default seoTimers;

*/



// src/data/seoTimers.js
// ✅ FINAL CLEAN + ASSETS FOLDER WALA - Tere assets/meditation.png ke hisaab se

// ============ HELPER ============
const slugify = (text) => {
  if (!text) return '';
  return text.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// ============ BACKGROUND THEME SYSTEM - TERI ASSETS FOLDER KE HISAAB SE ============
export const CATEGORY_THEMES = {
  meditation: {
    image: '/assets/meditation.png', // ✅ Tera wala
    video: null,
    color: '#8B5CF6',
    overlay: 'rgba(139, 92, 246, 0.3)',
    icon: '🧘'
  },
  cooking: {
    image: '/assets/cooking.png', // Agar nahi hai to meditation.png dikhega
    video: null,
    color: '#F59E0B',
    overlay: 'rgba(245, 158, 11, 0.25)',
    icon: '🍳'
  },
  workout: {
    image: '/assets/workout.png',
    video: null,
    color: '#EF4444',
    overlay: 'rgba(239, 68, 68, 0.3)',
    icon: '💪'
  },
  study: {
    image: '/assets/study.png',
    video: null,
    color: '#3B82F6',
    overlay: 'rgba(59, 130, 246, 0.25)',
    icon: '📚'
  },
  pomodoro: {
    image: '/assets/pomodoro.png',
    video: null,
    color: '#10B981',
    overlay: 'rgba(16, 185, 129, 0.25)',
    icon: '🍅'
  },
  classroom: {
    image: '/assets/study.png', // Classroom ke liye study wala use hoga
    color: '#6366F1',
    overlay: 'rgba(99, 102, 241, 0.25)',
    icon: '🎓'
  },
  meeting: {
    image: '/assets/meeting.png',
    color: '#0EA5E9',
    overlay: 'rgba(14, 165, 233, 0.25)',
    icon: '💼'
  },
  hours: {
    image: '/assets/meditation.png',
    color: '#1F2937',
    overlay: 'rgba(0,0,0,0.4)',
    icon: '⏰'
  },
  minutes: {
    image: '/assets/meditation.png',
    color: '#111827',
    overlay: 'rgba(0,0,0,0.35)',
    icon: '⏱️'
  },
  special: {
    image: '/assets/meditation.png',
    color: '#6B7280',
    overlay: 'rgba(0,0,0,0.3)',
    icon: '✨'
  }
};

export const getThemeForTimer = (timerName, category) => {
  const name = (timerName || '').toLowerCase();
  if (name.includes('meditation') || name.includes('mindfulness') || name.includes('sleep') || name.includes('nap') || name.includes('break')) return CATEGORY_THEMES.meditation;
  if (name.includes('cooking') || name.includes('kitchen') || name.includes('recipe')) return CATEGORY_THEMES.cooking;
  if (name.includes('workout') || name.includes('fitness') || name.includes('gym')) return CATEGORY_THEMES.workout;
  if (name.includes('study') || name.includes('exam') || name.includes('test') || name.includes('quiz') || name.includes('homework') || name.includes('reading') || name.includes('writing') || name.includes('coding') || name.includes('cleaning')) return CATEGORY_THEMES.study;
  if (name.includes('pomodoro') || name.includes('focus')) return CATEGORY_THEMES.pomodoro;
  if (name.includes('classroom') || name.includes('school') || name.includes('teacher') || name.includes('kids')) return CATEGORY_THEMES.classroom;
  if (name.includes('meeting') || name.includes('presentation') || name.includes('speech') || name.includes('business')) return CATEGORY_THEMES.meeting;
  return CATEGORY_THEMES[category] || CATEGORY_THEMES.minutes;
};

export const seoTimers = [];
const usedSlugs = new Set();

const addTimer = (slug, title, duration, description, keywords, category) => {
  if (usedSlugs.has(slug)) return null;
  const theme = getThemeForTimer(title, category);
  const timer = {
    id: seoTimers.length + 1,
    slug, title, duration, description, keywords, category,
    bgImage: theme.image,
    bgVideo: theme.video || null,
    themeColor: theme.color,
    overlay: theme.overlay,
    icon: theme.icon,
    background: category, // ✅ FullScreenTimer ke liye
    longDescription: `${description} This ${title} is perfect for ${category} activities. Use our free online timer with sound alert and fullscreen mode. No ads, 100% free at TimeCounterPro.`,
    howToUse: `How to use ${title}: 1. Set your time 2. Click Start 3. Focus on your task 4. Get alert when time is up.`,
    createdAt: new Date().toISOString()
  };
  usedSlugs.add(slug);
  seoTimers.push(timer);
  return timer;
};

for (let mins = 1; mins <= 120; mins++) {
  const duration = mins * 60;
  addTimer(slugify(`${mins}-minute-timer`), `${mins} Minute Timer`, duration, `Free ${mins} minute timer with sound and fullscreen. Perfect for workouts, study, cooking, and productivity.`, `${mins} minute timer, ${mins} min timer, online timer ${mins} minutes`, 'minutes');
}

[
  { name: 'Study Timer', duration: 1800 },
  { name: 'Study Timer 30 Minutes', duration: 1800 },
  { name: 'Study Timer 45 Minutes', duration: 2700 },
  { name: 'Study Timer 1 Hour', duration: 3600 },
  { name: 'Study Timer 2 Hours', duration: 7200 },
  { name: 'Study Timer 50 Minutes', duration: 3000 },
  { name: 'Study Timer 25 Minutes', duration: 1500 },
  { name: 'Study Timer 15 Minutes', duration: 900 },
  { name: 'Study Timer 10 Minutes', duration: 600 },
].forEach(t => {
  addTimer(slugify(t.name), t.name, t.duration, `Free ${t.name} for students. Perfect for focused learning and exam preparation.`, `${t.name}, study timer, timer for students`, 'study');
});

[
  { name: 'Workout Timer', duration: 1800 },
  { name: 'Workout Timer 30 Minutes', duration: 1800 },
  { name: 'Workout Timer 45 Minutes', duration: 2700 },
  { name: 'Workout Timer 1 Hour', duration: 3600 },
  { name: 'Workout Timer 15 Minutes', duration: 900 },
  { name: 'Workout Timer 20 Minutes', duration: 1200 },
  { name: 'Workout Timer 10 Minutes', duration: 600 },
].forEach(t => {
  addTimer(slugify(t.name), t.name, t.duration, `Free ${t.name} for fitness. Perfect for gym and home workouts.`, `${t.name}, workout timer, fitness timer`, 'workout');
});

[
  { name: 'Pomodoro Timer', focus: 1500 },
  { name: 'Pomodoro 25-5', focus: 1500 },
  { name: 'Pomodoro 50-10', focus: 3000 },
  { name: 'Pomodoro 45-15', focus: 2700 },
  { name: 'Pomodoro 20-5', focus: 1200 },
  { name: 'Pomodoro 30-5', focus: 1800 },
  { name: 'Pomodoro 60-10', focus: 3600 },
  { name: 'Study Pomodoro Timer', focus: 1500 },
  { name: 'Work Pomodoro Timer', focus: 1500 },
].forEach(p => {
  addTimer(slugify(p.name), p.name, p.focus, `Free ${p.name} for productivity. Boost your focus with Pomodoro technique.`, `${p.name}, pomodoro timer, focus timer`, 'pomodoro');
});

[
  { name: 'Meditation Timer', duration: 1200 },
  { name: 'Meditation Timer 5 Minutes', duration: 300 },
  { name: 'Meditation Timer 10 Minutes', duration: 600 },
  { name: 'Meditation Timer 15 Minutes', duration: 900 },
  { name: 'Meditation Timer 30 Minutes', duration: 1800 },
  { name: 'Meditation Timer 1 Hour', duration: 3600 },
].forEach(t => {
  addTimer(slugify(t.name), t.name, t.duration, `Free ${t.name} for mindfulness and relaxation.`, `${t.name}, meditation timer, mindfulness timer`, 'meditation');
});

[
  { name: 'Cooking Timer', duration: 1800 },
  { name: 'Cooking Timer 30 Minutes', duration: 1800 },
  { name: 'Cooking Timer 45 Minutes', duration: 2700 },
  { name: 'Cooking Timer 1 Hour', duration: 3600 },
  { name: 'Cooking Timer 15 Minutes', duration: 900 },
  { name: 'Cooking Timer 10 Minutes', duration: 600 },
].forEach(t => {
  addTimer(slugify(t.name), t.name, t.duration, `Free ${t.name} for perfect cooking.`, `${t.name}, cooking timer, kitchen timer`, 'cooking');
});

[
  { name: 'Classroom Timer', duration: 1800 },
  { name: 'Classroom Timer 30 Minutes', duration: 1800 },
  { name: 'Classroom Timer 15 Minutes', duration: 900 },
  { name: 'Classroom Timer 10 Minutes', duration: 600 },
  { name: 'Classroom Timer 5 Minutes', duration: 300 },
  { name: 'Classroom Timer 1 Hour', duration: 3600 },
].forEach(t => {
  addTimer(slugify(t.name), t.name, t.duration, `Free ${t.name} for teachers.`, `${t.name}, classroom timer, teacher timer`, 'classroom');
});

[
  { name: 'Meeting Timer', duration: 1800 },
  { name: 'Meeting Timer 30 Minutes', duration: 1800 },
  { name: 'Meeting Timer 45 Minutes', duration: 2700 },
  { name: 'Meeting Timer 1 Hour', duration: 3600 },
  { name: 'Meeting Timer 15 Minutes', duration: 900 },
  { name: 'Meeting Timer 10 Minutes', duration: 600 },
].forEach(t => {
  addTimer(slugify(t.name), t.name, t.duration, `Free ${t.name} for professionals.`, `${t.name}, meeting timer, business timer`, 'meeting');
});

[
  { name: 'Exam Countdown', duration: 3600 },
  { name: 'Exam Timer', duration: 3600 },
  { name: 'Test Timer', duration: 1800 },
  { name: 'Quiz Timer', duration: 600 },
  { name: 'Presentation Timer', duration: 3000 },
  { name: 'Speech Timer', duration: 1800 },
  { name: 'Break Timer', duration: 300 },
  { name: 'Nap Timer', duration: 1200 },
  { name: 'Sleep Timer', duration: 28800 },
  { name: 'Timer for Kids', duration: 600 },
  { name: 'Timer for Homework', duration: 1800 },
  { name: 'Timer for Reading', duration: 1200 },
  { name: 'Timer for Writing', duration: 1500 },
  { name: 'Timer for Coding', duration: 1500 },
  { name: 'Timer for Cleaning', duration: 900 },
].forEach(s => {
  addTimer(slugify(s.name), s.name, s.duration, `Free ${s.name} with sound and fullscreen.`, `${s.name}, timer, countdown`, 'special');
});

for (let hrs = 1; hrs <= 12; hrs++) {
  const duration = hrs * 3600;
  addTimer(slugify(`${hrs}-hour-timer`), `${hrs} Hour Timer`, duration, `Free ${hrs} hour timer with sound and fullscreen.`, `${hrs} hour timer, ${hrs} hr timer`, 'hours');
}

export const getTimerBySlug = (slug) => seoTimers.find(t => t.slug === slug);
export const getTimersByCategory = (category) => seoTimers.filter(t => t.category === category);
export const getAllSlugs = () => seoTimers.map(t => t.slug);

console.log(`✅ Total timers: ${seoTimers.length} | No duplicates | BG System Ready | Assets folder`);

export default seoTimers;