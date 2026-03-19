"use client";

import React from 'react';
import { 
  Stethoscope, 
  HeartPulse, 
  Brain, 
  Baby, 
  Bone, 
  Eye, 
  UserRound, 
  ArrowRight,
  Search,
  Users
} from 'lucide-react';
import Link from 'next/link';

const DepartmentsPage = () => {
  const departments = [
    {
      name: "Cardiology",
      desc: "Specialized care for heart and vascular conditions with advanced diagnostics.",
      icon: <HeartPulse className="size-8" />,
      doctors: 12,
      color: "bg-red-50 text-red-600 border-red-100"
    },
    {
      name: "Neurology",
      desc: "Expert treatment for brain, spine, and nervous system disorders.",
      icon: <Brain className="size-8" />,
      doctors: 8,
      color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      name: "Pediatrics",
      desc: "Comprehensive healthcare for infants, children, and adolescents.",
      icon: <Baby className="size-8" />,
      doctors: 15,
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      name: "Orthopedics",
      desc: "Focused on bone, joint, and muscle health and recovery.",
      icon: <Bone className="size-8" />,
      doctors: 10,
      color: "bg-orange-50 text-orange-600 border-orange-100"
    },
    {
      name: "Ophthalmology",
      desc: "Complete eye care services from routine exams to advanced surgery.",
      icon: <Eye className="size-8" />,
      doctors: 6,
      color: "bg-cyan-50 text-cyan-600 border-cyan-100"
    },
    {
      name: "General Medicine",
      desc: "Primary healthcare services for a wide range of common illnesses.",
      icon: <UserRound className="size-8" />,
      doctors: 20,
      color: "bg-green-50 text-green-600 border-green-100"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Header */}
      <section className="bg-white border-b border-slate-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
            Medical <span className="text-blue-600">Departments</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            Find the right specialist for your health needs. We offer a wide range of specialized medical departments equipped with modern technology.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search for a department..." 
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium"
            />
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 group cursor-pointer"
              >
                {/* Icon Box */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border transition-transform group-hover:scale-110 duration-500 ${dept.color}`}>
                  {dept.icon}
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-slate-900">{dept.name}</h3>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-slate-500 text-[10px] font-black uppercase tracking-wider">
                      <Users className="size-3" />
                      {dept.doctors} Doctors
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {dept.desc}
                  </p>

                  <div className="pt-4 flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-4 transition-all">
                    <span>View Specialists</span>
                    <ArrowRight className="size-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Help CTA */}
      <section className="pb-20">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-slate-900 rounded-[3rem] p-12 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4 relative z-10">Can't find what you're looking for?</h3>
            <p className="text-slate-400 mb-8 relative z-10">Our support team is available 24/7 to help you find the right doctor.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all relative z-10">
              Contact Support
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepartmentsPage;