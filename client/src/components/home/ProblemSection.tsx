import React from 'react';

const ProblemSection = () => {
  const problems = [
    {
      title: "Long Waiting Time",
      description: "Patients often spend 3-5 hours just waiting for their turn in a crowded environment.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Manual Serial System",
      description: "Paper-based tokens are hard to manage, prone to errors, and easily lost or manipulated.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "Missed Appointments",
      description: "No reminders or real-time tracking leads to patients missing their slots and wasting time.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "No Queue Visibility",
      description: "Zero transparency on how many patients are ahead, causing frustration and anxiety.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    }
  ];

  return (
    <section className="relative py-24 bg-linear-to-b from-blue-100 to-white">
      <div className="container mx-auto px-6 relative">
        
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <h2 className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">
            Identifying the Pain Points
          </h2>
          <h3 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            The Problem With Traditional Hospital Queues
          </h3>
          <p className="mt-6 text-slate-600 font-medium">
            At <span className="text-blue-600 font-bold">ClinicFlow</span>, we understand the frustration of outdated manual management.
          </p>
        </div>

        {/* Problem Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((item, index) => (
            <div 
              key={index} 
              className="group bg-white/60 backdrop-blur-sm p-10 rounded-[2.5rem] border border-white shadow-xl shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-3"
            >
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                {item.icon}
              </div>
              
              <h4 className="text-xl font-extrabold text-slate-800 mb-4 leading-tight">
                {item.title}
              </h4>
              
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Subtle Decorative element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent -z-10"></div>
      </div>
    </section>
  );
};

export default ProblemSection;