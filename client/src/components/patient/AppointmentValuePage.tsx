"use client";

import React from 'react';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  CheckCircle2, 
  QrCode, 
  ArrowLeft,
  Copy,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const AppointmentValuePage = ({ appointmentValue }: any) => {
  const router = useRouter();
  const { appointment, qrImage } = appointmentValue;

  // Format date: e.g., "Thursday, April 2, 2026"
  const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-12">
      {/* Top Navigation */}
      <div className="max-w-2xl mx-auto px-6 py-6 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-slate-50 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-bold text-lg">Appointment Details</h1>
        <div className="w-10" /> 
      </div>

      <div className="max-w-2xl mx-auto px-6">
        {/* Status & Token Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Status</p>
              <h2 className="text-2xl font-bold text-blue-900">{appointment.status}</h2>
            </div>
          </div>

          {/* Token Number Display - Only shows if exists */}
          {appointment.tokenNumber && (
            <div className="bg-white px-5 py-2 rounded-2xl border border-blue-200 shadow-sm text-center">
              <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Token</p>
              <p className="text-2xl font-black text-blue-600">#{appointment.tokenNumber}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <section>
              <label className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-2">
                <Calendar size={16} /> APPOINTMENT DATE
              </label>
              <p className="text-lg font-semibold text-slate-800">{formattedDate}</p>
            </section>

            <section>
              <label className="flex items-center gap-2 text-slate-400 text-sm font-medium mb-2">
                <Clock size={16} /> TIME SLOT
              </label>
              <p className="text-lg font-semibold text-slate-800">
                {appointment.slotStart} — {appointment.slotEnd}
              </p>
            </section>

            <section className="pt-4 border-t border-slate-100">
              <label className="text-slate-400 text-xs font-medium mb-2 block uppercase">Appointment ID</label>
              <div className="flex items-center justify-between bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                <code className="text-xs text-slate-600">{appointment._id}</code>
                <button 
                  onClick={() => navigator.clipboard.writeText(appointment._id)}
                  className="p-1 hover:bg-white rounded transition-colors"
                >
                  <Copy size={14} className="text-slate-400 hover:text-blue-600" />
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: QR Code */}
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue-100 to-indigo-100 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img 
                src={qrImage} 
                alt="Appointment QR Code" 
                className="relative w-48 h-48 object-contain rounded-lg shadow-sm"
              />
            </div>
            <div className="mt-4 text-center">
              <p className="flex items-center justify-center gap-2 font-bold text-slate-800">
                <QrCode size={18} className="text-blue-600" />
                Scan at Reception
              </p>
              <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter font-mono">
                {appointment.qrHash.substring(0, 16)}...
              </p>
            </div>
          </div>
        </div>

        {/* Helpful Reminder */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900 text-white flex items-start gap-4">
          <div className="bg-white/10 p-2 rounded-lg">
            <Stethoscope size={20} className="text-blue-400" />
          </div>
          <div>
            <h4 className="font-semibold mb-1">Check-in Instructions</h4>
            <p className="text-sm text-slate-400 leading-relaxed">
              Please arrive at the clinic 10 minutes before your scheduled time. 
              Show the QR code to the front desk to confirm your arrival. 
              {appointment.tokenNumber && ` Your token number is #${appointment.tokenNumber}.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentValuePage;