"use client";

import React from 'react';
import { 
  CalendarCheck, 
  QrCode, 
  UserCheck, 
  Activity, 
  ArrowRight, 
  ClipboardList, 
  Stethoscope, 
  BellRing 
} from 'lucide-react';
import Link from 'next/link';

const HowItWorksPage = () => {
  const patientSteps = [
    {
      title: "Book Appointment",
      desc: "Choose your preferred doctor and available time slot from our website.",
      icon: <CalendarCheck className="size-8" />,
    },
    {
      title: "Get Digital Token",
      desc: "Receive an instant digital token with a unique QR code on your dashboard.",
      icon: <QrCode className="size-8" />,
    },
    {
      title: "QR Check-in",
      desc: "Show your QR code at the hospital reception for instant check-in.",
      icon: <UserCheck className="size-8" />,
    },
    {
      title: "Live Tracking",
      desc: "Track your live queue position and get notified when it's your turn.",
      icon: <Activity className="size-8" />,
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="py-20 bg-linear-to-b from-blue-50 to-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-blue-600 font-bold tracking-[0.2em] uppercase text-xs mb-4">Process Transparency</h2>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
            How <span className="text-blue-600">ClinicFlow</span> Works
          </h1>
          <p className="mt-6 text-slate-600 text-lg max-w-2xl mx-auto font-medium">
            We've simplified the hospital visit experience into four easy steps. No more manual serials, just a smooth digital flow.
          </p>
        </div>
      </section>

      {/* Patient Workflow - Visual Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-16 justify-center md:justify-start">
             <div className="h-px w-12 bg-blue-600 hidden md:block"></div>
             <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Patient Journey</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden lg:block absolute top-16 left-0 w-full h-0.5 border-t-2 border-dashed border-blue-100 -z-10"></div>
            
            {patientSteps.map((step, index) => (
              <div key={index} className="group flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-white border-4 border-blue-50 text-blue-600 rounded-4xl flex items-center justify-center mb-6 shadow-xl shadow-blue-900/5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
                  {step.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Breakdown Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h3 className="text-3xl md:text-4xl font-black mb-4">Smart Management for Everyone</h3>
            <p className="text-slate-400 font-medium">One system, multiple roles, total efficiency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Receptionist */}
            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-sm">
              <div className="bg-blue-600/20 p-4 rounded-2xl inline-block mb-6 text-blue-400">
                <ClipboardList className="size-8" />
              </div>
              <h4 className="text-xl font-bold mb-4">Receptionist Panel</h4>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li className="flex items-center gap-2">🔹 Scan QR for instant check-in</li>
                <li className="flex items-center gap-2">🔹 Register walk-in patients</li>
                <li className="flex items-center gap-2">🔹 Assign priority (Emergency)</li>
              </ul>
            </div>

            {/* Doctor */}
            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-sm scale-105 ring-4 ring-blue-500/5">
              <div className="bg-blue-600 p-4 rounded-2xl inline-block mb-6 text-white shadow-lg shadow-blue-500/20">
                <Stethoscope className="size-8" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-blue-400">Doctor Dashboard</h4>
              <ul className="space-y-3 text-sm text-slate-200 font-medium">
                <li className="flex items-center gap-2">✅ View real-time patient queue</li>
                <li className="flex items-center gap-2">✅ Call next patient with one click</li>
                <li className="flex items-center gap-2">✅ Set break or delay updates</li>
              </ul>
            </div>

            {/* Notifications */}
            <div className="p-10 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-sm">
              <div className="bg-blue-600/20 p-4 rounded-2xl inline-block mb-6 text-blue-400">
                <BellRing className="size-8" />
              </div>
              <h4 className="text-xl font-bold mb-4">Real-time Updates</h4>
              <ul className="space-y-3 text-sm text-slate-400 font-medium">
                <li className="flex items-center gap-2">🔔 Instant app notifications</li>
                <li className="flex items-center gap-2">🔔 Live display screen sync</li>
                <li className="flex items-center gap-2">🔔 Estimated wait-time alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-6">
          <div className="bg-blue-50 rounded-[3rem] p-12 md:p-20 border border-blue-100">
             <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-8">Ready to experience <br /> ClinicFlow?</h3>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/register" className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all flex items-center justify-center gap-2">
                 Get Started Now
                 <ArrowRight className="size-5" />
               </Link>
               <Link href="/login" className="px-10 py-5 bg-white text-slate-900 border-2 border-slate-200 font-black rounded-2xl hover:bg-slate-50 transition-all">
                 Login to Portal
               </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;