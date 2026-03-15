import React from 'react';
import { Stethoscope, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-blue-50 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight italic text-slate-900">
              Clinic<span className="text-blue-600 font-extrabold not-italic underline decoration-2 underline-offset-4">Flow</span>
            </span>
          </div>

          {/* Center: Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Home</a>
            <a href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Doctors</a>
            <a href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Departments</a>
            <a href="#" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">How It Works</a>
          </div>

          {/* Right: Auth & CTA */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-4 border-r border-slate-200 pr-5">
              <a href="#" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Login</a>
              <a href="#" className="text-sm font-bold text-white bg-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all">Register</a>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all duration-300 active:scale-95">
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden">
            <button className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <Menu className="w-7 h-7" />
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;