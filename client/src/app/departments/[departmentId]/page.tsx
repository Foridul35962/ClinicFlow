"use client"

import { getDepartmentDoctor } from '@/store/slice/userSlice'
import { AppDispatch, RootState } from '@/store/store'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Calendar, Clock, MapPin, User, ArrowRight } from 'lucide-react' // Icons (optional, install lucide-react)
import Link from 'next/link'

const DepartmentDoctorsPage = () => {
    const { departmentId } = useParams()
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    
    const { departmentDoctor, userLoading } = useSelector((state: RootState) => state.user)
    const { user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        if (departmentId) {
            dispatch(getDepartmentDoctor({ departmentId: departmentId as string }))
        }
    }, [departmentId, dispatch])

    if (userLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header Section */}
            <div className="bg-blue-50 py-12 px-6 mb-10 border-b border-blue-100">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
                        Our Specialist <span className="text-blue-600">Doctors</span>
                    </h1>
                    <p className="text-slate-600 mt-2">Find and book the best doctors in this department.</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {departmentDoctor && departmentDoctor.length > 0 ? (
                        departmentDoctor.map((doctor: any) => (
                            <div key={doctor._id} className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300">
                                {/* Doctor Image & Basic Info */}
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="relative">
                                        <img 
                                            src={doctor?.userId?.image?.url || '/default-avatar.png'} 
                                            alt={doctor?.userId?.fullName}
                                            className="w-20 h-20 rounded-xl object-cover border-2 border-blue-50 shadow-sm"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
                                    </div>
                                    <div>
                                        <Link href={`/doctor/${doctor._id}`} className="font-bold text-xl hover:underline text-slate-800 group-hover:text-blue-600 transition-colors">
                                            {doctor?.userId?.fullName}
                                        </Link>
                                        <div className="flex items-center text-slate-500 text-sm mt-1">
                                            <MapPin size={14} className="mr-1 text-blue-500" />
                                            <span>Chamber: {doctor.chamberNumber}</span>
                                        </div>
                                        <div className="mt-2 text-blue-700 font-bold text-lg">
                                            ৳{doctor.consultationFee} <span className="text-xs text-slate-400 font-normal">/ Visit</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule Details */}
                                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold text-sm">
                                        <Calendar size={16} />
                                        <span>Available Schedule</span>
                                    </div>
                                    <div className="space-y-2">
                                        {doctor.schedule.map((s: any) => (
                                            <div key={s._id} className="flex justify-between items-center text-xs text-slate-600 bg-white/50 p-2 rounded-lg">
                                                <span className="font-medium">{s.dayOfWeek}</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={12} className="text-blue-400" />
                                                    {s.startTime} - {s.endTime}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <div className="text-slate-300 mb-4 flex justify-center">
                                <User size={64} />
                            </div>
                            <h3 className="text-xl font-medium text-slate-600">No doctors available right now.</h3>
                            <button onClick={() => router.back()} className="text-blue-600 underline mt-2">Go Back</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DepartmentDoctorsPage