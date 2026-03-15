import React from 'react';
import { 
  Monitor, 
  LayoutDashboard, 
  Users, 
  Zap, 
  ShieldAlert 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: "Real-time Queue",
      description: "Live updates powered by Socket.io. Patients see their position move in real-time without refreshing.",
      icon: <Zap className="w-7 h-7" />,
      tag: "Live"
    },
    {
      title: "Priority Queue System",
      description: "Smart sorting logic to handle Emergency, Priority, and Normal cases fairly and efficiently.",
      icon: <ShieldAlert className="w-7 h-7" />,
      tag: "Smart"
    },
    {
      title: "Doctor Dashboard",
      description: "A specialized interface for doctors to manage current calls, mark completion, or set delay status.",
      icon: <LayoutDashboard className="w-7 h-7" />,
      tag: "Staff"
    },
    {
      title: "Receptionist Panel",
      description: "Effortlessly scan QR codes, register walk-in patients, and manage multiple doctor queues.",
      icon: <Users className="w-7 h-7" />,
      tag: "Admin"
    },
    {
      title: "Live Display Screen",
      description: "A dedicated full-screen mode for hospital TVs to show current and upcoming tokens.",
      icon: <Monitor className="w-7 h-7" />,
      tag: "Public"
    }
  ];

  return (
    <section className="py-24 bg-blue-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-100 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-xs mb-4">Powerful Capabilities</h2>
          <h3 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            Comprehensive Features of <span className="text-blue-600">ClinicFlow</span>
          </h3>
          <p className="mt-6 text-slate-600 text-lg">
            Built with modern technology to ensure a seamless experience for patients, doctors, and staff.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`group p-10 rounded-[2.5rem] border border-slate-100 bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-2 ${
                index === 4 ? "md:col-span-2 lg:col-span-1" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-6">
                  {feature.icon}
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase rounded-lg tracking-widest">
                  {feature.tag}
                </span>
              </div>
              
              <h4 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">
                {feature.title}
              </h4>
              
              <p className="text-slate-500 leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;