import React, { useContext, useState } from 'react';
import { TimerContext } from '../context/TimerContext';
import TimerDashboard from '../components/TimerDashboard';
import QuickPresets from '../components/QuickPresets';
import CustomTimer from '../components/CustomTimer';
import StatsCard from '../components/StartsCard';
import CountdownCreator from '../components/Timer/CountdownCreator';
import Stopwatch from '../components/Timer/Stopwatch';
import PomodoroTimer from '../components/Timer/PomodoroTimer';
import EmbedWidget from '../Viral/EmbedWidget';
import ModeSelector from '../UI/ModeSelector';
import { formatTime } from '../utils/helpers';
import { Toaster } from 'react-hot-toast';

function Home() {
  const { activeTimers, completedTimers, totalStats } = useContext(TimerContext);
  const [activeMode, setActiveMode] = useState('countdown');

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayTimers = completedTimers.filter(t => 
      t && new Date(t.completedAt).toDateString() === today
    );
    return {
      count: todayTimers.length,
      time: todayTimers.reduce((acc, t) => acc + (t.duration || 0), 0)
    };
  };

  const todayStats = getTodayStats();

  const renderContent = () => {
    switch (activeMode) {
      case 'stopwatch':
        return <Stopwatch />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'countdown':
      default:
        return (
          <>
            <CountdownCreator />
            <EmbedWidget />
          </>
        );
    }
  };

  return (
    <>
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#1a0a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />

      <div className="mb-6">
        <ModeSelector mode={activeMode} setMode={setActiveMode} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon="⏱️"
          title="Active Timers"
          value={activeTimers.length}
          subtitle={`${activeTimers.filter(t => t.status === 'running').length} running`}
          color="purple"
        />
        <StatsCard
          icon="✅"
          title="Completed"
          value={completedTimers.length}
          subtitle={`${todayStats.count} today`}
          color="green"
        />
        <StatsCard
          icon="⏰"
          title="Total Time"
          value={`${Math.floor(totalStats.totalTime / 3600)}h`}
          subtitle={`${Math.floor((totalStats.totalTime % 3600) / 60)}m tracked`}
          color="blue"
        />
        <StatsCard
          icon="🏆"
          title="Presets Used"
          value={totalStats.presetsUsed || 0}
          subtitle={`${totalStats.customsCreated || 0} custom`}
          color="yellow"
        />
      </div>

      <QuickPresets />
      <CustomTimer />
      {renderContent()}
      <TimerDashboard />
    </>
  );
}

export default Home; 