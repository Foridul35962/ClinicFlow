import React from 'react';
import { 
  Stethoscope, 
  HeartPulse,
  Brain, 
  ArrowRight, 
  Bone
} from 'lucide-react';

const Depertment = () => {
  const departments = [
    {
      name: "Medicine",
      description: "General health checkups and internal medicine specialists.",
      icon: <Stethoscope className="w-8 h-8" />,
      count: "12 Doctors"
    },
    {
      name: "Cardiology",
      description: "Expert care for your heart and cardiovascular health.",
      icon: <HeartPulse className="w-8 h-8" />,
      count: "8 Doctors"
    },
    {
      name: "Orthopedics",
      description: "Specialized treatment for bone, joint, and muscle issues.",
      icon: <Bone className="w-8 h-8" />,
      count: "6 Doctors"
    },
    {
      name: "Neurology",
      description: "Advanced care for brain, spine, and nervous system disorders.",
      icon: <Brain className="w-8 h-8" />,
      count: "5 Doctors"
    }
  ];

  return (
    <section className="py-24 bg-linear-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-3">Specialties</h2>
            <h3 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
              Our Medical <span className="text-blue-600">Departments</span>
            </h3>
            <p className="mt-4 text-slate-600 font-medium">
              Find the right specialist for your health needs across our diverse departments.
            </p>
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-bold rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 group">
            View All Departments
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept, index) => (
            <div 
              key={index} 
              className="group bg-white p-8 rounded-4xl border border-slate-100 shadow-lg shadow-blue-900/5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-300 cursor-pointer"
            >
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {dept.icon}
              </div>
              
              <h4 className="text-xl font-extrabold text-slate-800 mb-2">
                {dept.name}
              </h4>
              
              <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                {dept.description}
              </p>
              
              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                  {dept.count}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Depertment;