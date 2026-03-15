import React from 'react';
import { CalendarDays, ArrowRight, Sparkles } from 'lucide-react';

const CTA = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="relative overflow-hidden bg-slate-900 rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl shadow-blue-900/20">
          
          {/* Decorative Background Patterns */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
            
            {/* Icon & Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-blue-300 text-sm font-bold mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Join 10,000+ Happy Patients
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
              Ready to skip the <br /> 
              <span className="text-blue-500">waiting line?</span>
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-xl">
              Experience the future of healthcare management with <span className="text-white font-bold">ClinicFlow</span>. 
              Book your appointment today and track your status in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button className="flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/40 hover:bg-blue-700 hover:scale-105 transition-all duration-300">
                <CalendarDays className="w-6 h-6" />
                Book Appointment Now
              </button>
              
              <button className="flex items-center justify-center gap-3 px-10 py-5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                Learn More
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-slate-500 text-sm font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Secure QR Check-in
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Real-time Tracking
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;