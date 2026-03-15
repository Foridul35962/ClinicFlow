import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative bg-linear-to-br from-slate-50 to-blue-100 py-16 lg:py-28 overflow-hidden">
      {/* Background Shapes for Depth */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          
          {/* Left Side: Content */}
          <div className="lg:w-3/5 text-center lg:text-left space-y-8">
            <div className="inline-block px-4 py-1.5 bg-blue-600/10 border border-blue-200 rounded-full text-blue-700 text-sm font-bold tracking-wide uppercase">
              ⚡ Real-Time Hospital Management
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1]">
              Smart <span className="text-blue-600">Queue</span> <br />
              & Appointment
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl leading-relaxed">
              Skip the long hospital queues. Book appointments, check-in with QR, 
              and track your position in real time—fairness and transparency in every visit.
            </p>

            <div className="flex flex-wrap gap-5 justify-center lg:justify-start pt-4">
              <button className="px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
                Book Appointment
              </button>
              <button className="px-10 py-5 bg-white text-slate-800 font-bold rounded-2xl border-2 border-slate-200 shadow-sm hover:bg-slate-50 transition-all active:scale-95">
                View Doctors
              </button>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-wrap items-center gap-10 justify-center lg:justify-start pt-6 border-t border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 font-bold italic">QR</div>
                <span className="text-sm font-medium text-slate-500">Fast Scan<br/>Check-in</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">|</div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold italic">0%</div>
                <span className="text-sm font-medium text-slate-500">Wait-time<br/>Uncertainty</span>
              </div>
            </div>
          </div>

          {/* Right Side: Mockup (Pure Tailwind, No Hooks) */}
          <div className="lg:w-2/5 w-full relative group">
            <div className="relative bg-white p-6 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100 transform rotate-2">
              
              {/* Browser/App UI Header */}
              <div className="flex items-center gap-2 mb-6 px-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 h-2 w-32 bg-slate-100 rounded-full"></div>
              </div>

              {/* Live Status Card */}
              <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white mb-6 shadow-lg">
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">Live Queue Tracking</p>
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="text-3xl font-black">Token #A-42</h2>
                    <p className="text-sm opacity-90 mt-1">Dr. Ariful Islam • Cardiology</p>
                  </div>
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/30 text-xs font-mono">
                    CH-104
                  </div>
                </div>
              </div>

              {/* Next in Line List */}
              <div className="space-y-4 px-2">
                <h4 className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  Up Next
                  <span className="text-blue-600 text-[10px] bg-blue-50 px-2 py-1 rounded">3 Patients Ahead</span>
                </h4>
                
                {/* Patient 1 */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div className="space-y-1">
                      <div className="w-20 h-2 bg-slate-300 rounded"></div>
                      <div className="w-12 h-1.5 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-400">#A-43</span>
                </div>

                {/* Patient 2 */}
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                    <div className="w-20 h-2 bg-slate-200 rounded"></div>
                  </div>
                  <span className="text-sm font-bold text-slate-300">#A-44</span>
                </div>
              </div>

              {/* Floating QR Element */}
              <div className="absolute -left-12 bottom-12 bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 flex flex-col items-center animate-bounce">
                <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h6v6H3V3zm12 0h6v6h-6V3zM3 15h6v6H3v-6zm12 6h3v-3h-3v3zM12 12h3v3h-3v-3zm3-3h3v3h-3V9zm-3-3h3v3h-3V6zm3 12h3v3h-3v-3zm-3 0h3v3h-3v-3zm-3-3h3v3h-3v-3zm0-3h3v3h-3v-3zm0 6h3v3h-3v-3z"/>
                  </svg>
                </div>
                <span className="text-[10px] font-black mt-2 text-slate-800">SCAN ME</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;