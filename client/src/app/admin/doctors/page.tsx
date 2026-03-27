"use client"

import { getAllDoctors } from '@/store/slice/adminSlice'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Phone, Mail, Clock, Search, Stethoscope, Plus } from 'lucide-react'
import Link from 'next/link'

const DoctorsPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { getDoctorLoading, allDoctor } = useSelector((state: RootState) => state.admin)

  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(getAllDoctors(null)).unwrap()
      } catch (error: any) {
        toast.error(error.message || "Something went wrong")
      }
    }
    if (allDoctor.length===0) {
      fetchData()
    }
  }, [dispatch])

  // Filtering Logic
  const filteredDoctors = allDoctor?.filter((doctor: any) =>
    doctor.userId?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.userId?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.departmentId?.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen font-sans">
      {/* Top Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Doctor <span className="text-blue-600">Management</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            View, search, and onboard new medical specialists.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search specialists..."
              className="block w-full pl-10 pr-3 py-2.5 border text-black border-slate-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add Doctor Button */}
          <Link
            href={'/admin/add-doctor'}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 w-full sm:w-auto text-sm"
          >
            <Plus size={20} />
            <span>Add Doctor</span>
          </Link>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {getDoctorLoading ? (
          <div className="p-24 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-slate-500 font-semibold animate-pulse">Syncing Database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="p-5">Doctor Details</th>
                  <th className="p-5">Department</th>
                  <th className="p-5">Weekly Schedule</th>
                  <th className="p-5">Consultation Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDoctors && filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor: any) => (
                    <tr key={doctor._id} className="hover:bg-blue-50/30 transition-all duration-150 group">
                      {/* Specialist Info */}
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <img
                              src={doctor.userId?.image?.url || "https://via.placeholder.com/150"}
                              alt={doctor.userId?.fullName}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm group-hover:rotate-3 transition-transform"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                          <div className="flex flex-col">
                            <Link
                              href={`/doctor/${doctor._id}`}
                              className="font-bold text-slate-800 hover:text-blue-600 text-base"
                            >
                              {doctor.userId?.fullName}
                            </Link>
                            <span className="text-xs text-slate-500 flex items-center gap-1 mt-1 lowercase font-medium">
                              <Mail size={12} className="text-slate-400" /> {doctor.userId?.email}
                            </span>
                            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                              <Phone size={12} className="text-slate-400" /> {doctor.userId?.phoneNumber}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="p-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-tighter">
                          {doctor.departmentId?.name}
                        </span>
                      </td>

                      {/* Schedule */}
                      <td className="p-5">
                        <div className="grid grid-cols-1 gap-1">
                          {doctor.schedule?.map((s: any) => (
                            <div key={s._id} className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 w-fit">
                              <Clock size={10} className="text-blue-500" />
                              <span>{s.dayOfWeek}: {s.startTime} - {s.endTime}</span>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Fee */}
                      <td className="p-5">
                        <div className="flex items-center gap-2 font-black text-slate-900 text-lg">
                          <span className="text-blue-600 text-sm italic font-normal text-opacity-70">BDT</span>
                          {doctor.consultationFee}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-24 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-40">
                        <Stethoscope size={50} className="text-slate-300" />
                        <p className="text-lg font-bold text-slate-500 tracking-tight">No doctors found matching "{searchTerm}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorsPage