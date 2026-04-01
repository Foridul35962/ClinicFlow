"use client";

import { getAppointmentHistory } from '@/store/slice/patientSlice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Calendar, Clock, User, ChevronRight, Stethoscope } from 'lucide-react';
import Link from 'next/link';

const AppointmentHistoryPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { patientLoading, appointmentHistory } = useSelector((state: RootState) => state.patient);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        await dispatch(getAppointmentHistory(null)).unwrap();
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch history");
      }
    };
    if (appointmentHistory.length === 0) {
      fetchHistory();
    }
  }, [dispatch]);

  // Loading State
  if (patientLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-900">Appointment History</h1>
          <p className="text-slate-500 text-sm mt-1">View and manage your past and upcoming visits</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-8">
        {appointmentHistory && appointmentHistory.length > 0 ? (
          <div className="space-y-4">
            {appointmentHistory.map((appointment: any) => {
              // Date formatting
              const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              const doctor = appointment.doctorId?.userId;

              return (
                <Link
                  key={appointment._id}
                  href={`/patient/${appointment._id}`}
                  className="block group"
                >
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 transition-all duration-200 hover:shadow-md hover:border-blue-200 active:scale-[0.99]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Doctor Image */}
                        <div className="relative">
                          <img
                            src={doctor?.image?.url || "https://via.placeholder.com/150"}
                            alt={doctor?.fullName}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                          />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${appointment.status === 'Booked' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {doctor?.fullName || "General Physician"}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} /> {formattedDate}
                            </span>
                            <span className="flex items-center gap-1 border-l border-slate-200 pl-3">
                              <Clock size={14} /> {appointment.slotStart} - {appointment.slotEnd}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="hidden md:block text-right">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${appointment.status === 'Booked'
                              ? 'bg-blue-50 text-blue-600'
                              : 'bg-slate-100 text-slate-600'
                            }`}>
                            {appointment.status}
                          </span>
                        </div>
                        <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-dashed border-slate-300 rounded-3xl p-12 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Stethoscope className="text-slate-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No appointments found</h3>
            <p className="text-slate-500 mt-2">You haven't booked any appointments yet.</p>
            <Link
              href="/doctors"
              className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Book Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentHistoryPage;