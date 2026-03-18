"use client";

import React from 'react';
import { Stethoscope } from 'lucide-react';

const FirstLoad = () => {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-indigo-50/50 -z-10"></div>
      
      <div className="relative flex flex-col items-center">
        {/* Animated Logo Container */}
        <div className="relative mb-8">
          {/* Pulsing Rings */}
          <div className="absolute inset-0 rounded-3xl bg-blue-400 animate-ping opacity-20"></div>
          <div className="absolute inset-0 rounded-3xl bg-blue-600 animate-pulse opacity-10 scale-150"></div>
          
          {/* Main Logo Icon */}
          <div className="relative bg-blue-600 p-5 rounded-4xl shadow-2xl shadow-blue-500/40 animate-bounce-slow">
            <Stethoscope className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Brand Name */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight italic text-slate-900">
            Clinic<span className="text-blue-600 font-extrabold not-italic underline decoration-4 underline-offset-8">Flow</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
            Initializing System
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="mt-12 w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-r from-blue-400 via-blue-600 to-indigo-600 w-full animate-loading-bar origin-left"></div>
        </div>
      </div>
      
      {/* Custom Keyframes for Animations */}
      <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(-20%); }
          100% { transform: translateX(100%); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default FirstLoad;