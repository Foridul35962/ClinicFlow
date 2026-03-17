import React from 'react';
import { CalendarCheck, QrCode, UserCheck, Activity } from 'lucide-react';

const Work = () => {
  const steps = [
    {
      number: "01",
      title: "Book Appointment",
      description: "Select your preferred doctor, department, and available time slot from our easy-to-use portal.",
      icon: <CalendarCheck className="w-8 h-8" />
    },
    {
      number: "02",
      title: "Get QR Token",
      description: "Instantly receive a digital token with a unique QR code. No need to print anything—it's on your phone.",
      icon: <QrCode className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Scan At Hospital",
      description: "When you arrive, show your QR code at the reception. One quick scan and you are checked in.",
      icon: <UserCheck className="w-8 h-8" />
    },
    {
      number: "04",
      title: "Join Live Queue",
      description: "You're now in the live queue! Track your exact position and estimated wait time in real-time.",
      icon: <Activity className="w-8 h-8" />
    }
  ];

  return (
    <section className="pt-24 pb-10 bg-blue-50">
      <div className="container mx-auto px-6 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h3 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            How It Works
          </h3>
          <p className="mt-4 text-slate-600 font-medium italic">
            Simple steps to a hassle-free visit at <span className="text-blue-600 font-bold">ClinicFlow</span>
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
          
          {/* Connector Line (Desktop Only) - Pure CSS */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-blue-200 -z-10 -translate-y-16"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Step Card */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-900/5 hover:border-blue-400 transition-all duration-300 h-full flex flex-col items-center text-center">
                
                {/* Step Number Bubble */}
                <div className="absolute -top-6 bg-blue-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-blue-300 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                  {step.number}
                </div>

                <div className="mt-6 mb-6 w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  {step.icon}
                </div>

                <h4 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-tight">
                  {step.title}
                </h4>
                
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action text */}
        <div className="mt-16 text-center">
           <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest">
             Fast • Efficient • Transparent
           </p>
        </div>
      </div>
    </section>
  );
};

export default Work;