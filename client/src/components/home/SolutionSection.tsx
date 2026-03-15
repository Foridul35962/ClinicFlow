import React from 'react';

const SolutionSection = () => {
  const solutions = [
    {
      title: "Online Appointment Booking",
      description: "Book your slot from anywhere at any time. No more rushing to the clinic early in the morning.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "QR-Based Check-in",
      description: "Scan your unique QR code at the reception to confirm your arrival instantly. Zero paperwork required.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      title: "Real-time Queue Tracking",
      description: "Monitor your position in the live queue from your smartphone. Know exactly when it's your turn.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm6-11V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v3m6 0v10a2 2 0 00-2 2h-2a2 2 0 00-2-2V7a2 2 0 002-2h2a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: "Doctor Dashboard",
      description: "A simplified interface for doctors to call the next patient, manage breaks, and see patient history.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    }
  ];

  return (
    <section className="relative py-24 bg-linear-to-b from-white to-blue-50">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-full text-green-700 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            The Solution
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            A Smarter Way To Manage <br /> Patient Queues
          </h2>
          <p className="mt-6 text-slate-600 text-lg max-w-2xl mx-auto">
            <span className="font-bold text-blue-600">ClinicFlow</span> bridges the gap between patients and doctors with technology that respects everyone's time.
          </p>
        </div>

        {/* Solution Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {solutions.map((item, index) => (
            <div 
              key={index} 
              className="flex flex-col sm:flex-row gap-6 p-8 bg-white rounded-4xl border border-blue-50 shadow-xl shadow-blue-900/5 hover:border-blue-200 transition-all duration-300"
            >
              <div className="shrink-0 w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                {item.icon}
              </div>
              
              <div className="space-y-3">
                <h4 className="text-2xl font-bold text-slate-800">
                  {item.title}
                </h4>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Feature Highlight */}
        <div className="mt-20 overflow-hidden bg-blue-600 rounded-[3rem] p-1 text-center relative">
            <div className="bg-slate-900 rounded-[2.8rem] py-10 px-6">
                <h3 className="text-white text-xl md:text-2xl font-bold">
                    Transforming the Healthcare Experience.
                </h3>
                <p className="text-blue-200 mt-2 opacity-80">No more manual serials. Just scan, sit, and wait for your turn.</p>
            </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;