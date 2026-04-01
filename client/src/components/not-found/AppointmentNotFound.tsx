"use client";

import React from 'react';
import { FileQuestion, ArrowLeft, Home, CalendarSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AppointmentNotFound = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Icon with subtle animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 blur-2xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white border-2 border-blue-100 p-6 rounded-full shadow-sm text-blue-600">
          <CalendarSearch size={64} strokeWidth={1.5} />
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center max-w-md mx-auto space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">
          Appointment Not Found
        </h1>
        <p className="text-slate-500 leading-relaxed">
          We couldn't find the appointment details you're looking for. It might have been cancelled, expired, or the link is incorrect.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
        
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl transition-all active:scale-95"
        >
          <Home size={18} />
          Dashboard
        </button>
      </div>

      {/* Support text */}
      <p className="mt-12 text-sm text-slate-400">
        Need help? <span className="text-blue-600 cursor-pointer font-medium hover:underline">Contact Clinic Support</span>
      </p>
    </div>
  );
};

export default AppointmentNotFound;