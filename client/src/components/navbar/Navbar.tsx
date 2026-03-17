"use client";

import React, { useState } from 'react';
import { Stethoscope, Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: "Doctors", href: "#" },
    { name: "Departments", href: "#" },
    { name: "How It Works", href: "#" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-blue-50/80 backdrop-blur-md border-b border-blue-100/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-md shadow-blue-200">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight italic text-slate-900">
              Clinic<span className="text-blue-600 font-extrabold not-italic underline decoration-2 underline-offset-4">Flow</span>
            </span>
          </Link>

          {/* Center: Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href} 
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right: Auth & CTA (Desktop) */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="flex items-center gap-4 border-r border-slate-200 pr-5">
              <Link href="#" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors">Login</Link>
              <Link href="#" className="text-sm font-bold text-white bg-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-sm">
                Register
              </Link>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all duration-300 active:scale-95">
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 text-slate-600 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-slate-100 ${isOpen ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-8 space-y-6">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between text-lg font-bold text-slate-700 hover:text-blue-600 border-b border-slate-50 pb-2"
              >
                {link.name}
                <ChevronRight className="w-4 h-4" />
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col gap-4 pt-4">
            <Link href="#" className="w-full py-3 text-center font-bold text-slate-700 border border-slate-200 rounded-xl">
              Login
            </Link>
            <Link href="#" className="w-full py-3 text-center font-bold text-white bg-slate-900 rounded-xl">
              Register
            </Link>
            <button className="w-full py-4 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-100">
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;