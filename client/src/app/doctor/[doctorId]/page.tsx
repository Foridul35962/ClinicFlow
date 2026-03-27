"use client"

import { getDoctor } from '@/store/slice/userSlice'
import { AppDispatch, RootState } from '@/store/store'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  Edit3, Trash2, Calendar, MapPin,
  CircleDollarSign, Clock, ArrowLeft,
  Stethoscope, ShieldCheck, Star
} from 'lucide-react'
import Link from 'next/link'
import { deleteDoctor } from '@/store/slice/adminSlice'

const DoctorProfilePage = () => {
  const { doctorId } = useParams()
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()

  const { doctor, userLoading } = useSelector((state: RootState) => state.user)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (doctorId) {
      dispatch(getDoctor(doctorId.toString())).unwrap()
        .catch((err) => toast.error(err.message))
    }
  }, [doctorId, dispatch])

  const handleDelete = async () => {
    if (window.confirm(`Are you want to remove doctor ${doctor?.fullName}`)) {
      try {
        await dispatch(deleteDoctor(doctor._id)).unwrap()
        toast.success('Doctor Delete successfully')
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  if (userLoading) return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  )

  if (!doctor) return <div className="p-10 text-center font-bold text-red-500">Doctor data not found!</div>

  return (
    <div className="min-h-screen bg-[#f8fafc] w-full">
      {/* Top Navigation Bar */}
      <div className="w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to List
        </button>

        <div className="flex gap-3">
          {user?.role === 'admin' && (
            <>
              <Link
                href={`/admin/doctors/edit/${doctor._id}`}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100 transition font-semibold text-sm"
              >
                <Edit3 size={16} /> Edit Profile
              </Link>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition font-semibold text-sm">
                <Trash2 size={16} /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="w-full px-4 py-8 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Doctor Main Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <div className="relative mb-6">
                <img
                  src={doctor.userId?.image?.url || 'https://via.placeholder.com/150'}
                  alt="Doctor"
                  className="w-48 h-48 rounded-full object-cover ring-8 ring-blue-50 shadow-2xl"
                />
                <div className="absolute bottom-2 right-4 bg-green-500 p-2 rounded-full border-4 border-white shadow-lg">
                  <ShieldCheck size={20} className="text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-black text-slate-800 tracking-tight">{doctor.userId?.fullName}</h1>
              <div className="mt-2 inline-flex items-center px-4 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-widest">
                {doctor.departmentId?.name} Specialist
              </div>

              <div className="flex items-center gap-1 mt-4 text-amber-500">
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" />
                <Star size={18} fill="currentColor" className="text-slate-200" />
                <span className="text-slate-400 text-sm ml-2 font-medium">(4.8/5.0)</span>
              </div>

              {user?.role === 'patient' && (
                <Link
                  href={`/appointments/book/${doctor._id}`}
                  className="w-full mt-8 bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95"
                >
                  Book Appointment Now
                </Link>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Stethoscope size={20} className="text-blue-500" /> Department Details
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {doctor.departmentId?.description}
              </p>
            </div>
          </div>

          {/* Right Column: Details & Schedule */}
          <div className="lg:col-span-8 space-y-6">

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600"><CircleDollarSign size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Fee</p>
                  <p className="text-xl font-black text-slate-800">{doctor.consultationFee} BDT</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="bg-orange-50 p-4 rounded-2xl text-orange-600"><MapPin size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Chamber</p>
                  <p className="text-xl font-black text-slate-800">No. {doctor.chamberNumber}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="bg-purple-50 p-4 rounded-2xl text-purple-600"><Clock size={28} /></div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Duration</p>
                  <p className="text-xl font-black text-slate-800">{doctor.slotDuration} Min</p>
                </div>
              </div>
            </div>

            {/* Availability / Schedule Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <Calendar size={24} className="text-blue-600" /> Availability Schedule
                </h3>
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-bold">Open for Booking</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {doctor.schedule?.map((s: any) => (
                  <div
                    key={s._id}
                    className="group flex justify-between items-center p-5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-600 transition-all duration-300 cursor-default"
                  >
                    <div>
                      <p className="font-black text-slate-700 group-hover:text-white transition-colors">{s.dayOfWeek}</p>
                      <p className="text-sm text-slate-400 group-hover:text-blue-100 transition-colors">Weekly Visit</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600 group-hover:text-white transition-colors uppercase">{s.startTime} - {s.endTime}</p>
                      <p className="text-[10px] text-slate-300 group-hover:text-blue-200 uppercase tracking-widest font-bold">Available</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extra Section: Patient Guidelines */}
            <div className="bg-indigo-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
              <div className="relative z-1">
                <h4 className="text-xl font-bold mb-2">Need Help with Booking?</h4>
                <p className="text-indigo-200 text-sm max-w-md">
                  If you face any issues while booking an appointment or need urgent assistance, please contact our support desk available 24/7.
                </p>
              </div>
              <button className="relative z-1 whitespace-nowrap bg-white text-indigo-900 px-6 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                Contact Support
              </button>
              {/* Decorative Circle */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-800 rounded-full opacity-50"></div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorProfilePage