
// src/pages/CreateTimer.jsx

import React from "react";
import CustomTimer from "../components/CustomTimer";
import TimerDashboard from "../components/TimerDashboard";
import Navbar from "../components/Navbar";
import Footer from "../components/Layout/Footer";

function CreateTimer() {
  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

         {/* Page Header */}
        <div className="mb-6">
       

        {/* Page Title */}
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
        <section>
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

      </div>
    </div>
     <Footer />
    </div>
  );
}

export default CreateTimer;
