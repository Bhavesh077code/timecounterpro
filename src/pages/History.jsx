import React from 'react';
import { Helmet } from 'react-helmet-async';
import TimerHistory from '../components/TimerHistory';

function History() {
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <Helmet>
        <title>Your Timer History | TimeCounterPro</title>
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <TimerHistory />
    </div>
  );
}

export default History;