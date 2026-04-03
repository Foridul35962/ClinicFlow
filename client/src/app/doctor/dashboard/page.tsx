"use client"

import { doctorDashboard } from '@/store/slice/doctorSlice'
import { AppDispatch, RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Users, CheckCircle, XCircle, Clock, DollarSign, PlayCircle, User, Phone, Calendar } from 'lucide-react'

const DoctorDashboard = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { dashboardData, dashboardLoading } = useSelector((state: RootState) => state.doctor)

    useEffect(() => {
        const fetch = async () => {
            try {
                await dispatch(doctorDashboard(null)).unwrap()
            } catch (error: any) {
                toast.error(error.message)
            }
        }
        fetch()
    }, [dispatch])

    // Appointment complete korar function
    const handleCompleteAppointment = (appointmentId: string) => {
        toast.success(`Completing appointment: ${appointmentId}`)
        // Ekhane tomar API call ba dispatch logic likhbe
        // dispatch(completeAppointment(appointmentId))
    }

    if (dashboardLoading) return <div className="text-white p-10">Loading Dashboard...</div>

    const stats = dashboardData?.stats || {
        totalAppointments: 0,
        completed: 0,
        cancelled: 0,
        waiting: 0,
        income: 0
    }

    const queue = dashboardData?.queue || {
        currentToken: 0,
        lastToken: 0,
        currentAppointment: null,
        nextPatients: []
    }

    const currentAppt = queue.currentAppointment;

    return (
        <div className="min-h-screen bg-[#0f172a] p-6 text-slate-200">
            {/* Header Section */}
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                    Doctor Dashboard
                </h1>
                <p className="text-slate-400">Welcome back! Here is what's happening today.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total" value={stats.totalAppointments} icon={<Users size={24}/>} color="blue" />
                <StatCard title="Waiting" value={stats.waiting} icon={<Clock size={24}/>} color="yellow" />
                <StatCard title="Completed" value={stats.completed} icon={<CheckCircle size={24}/>} color="emerald" />
                <StatCard title="Earnings" value={`$${stats.income}`} icon={<DollarSign size={24}/>} color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Queue & Current Patient Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Queue Control Center */}
                    <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <PlayCircle className="text-blue-400" /> Queue Control
                        </h2>
                        
                        <div className="flex flex-col md:flex-row items-center justify-around bg-white/5 rounded-xl p-8 border border-white/5">
                            <div className="text-center mb-6 md:mb-0">
                                <span className="text-sm uppercase tracking-widest text-slate-400">Current Token</span>
                                <div className="text-6xl font-black text-blue-500 mt-2">{queue.currentToken}</div>
                            </div>
                            
                            <div className="h-20 w-px bg-white/10 hidden md:block"></div>

                            <div className="text-center">
                                <button 
                                    onClick={() => toast.info("Calling next patient...")}
                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 transition-all rounded-full font-bold shadow-lg shadow-blue-500/20 flex items-center gap-3 active:scale-95"
                                >
                                    Call Next Patient
                                </button>
                                <p className="mt-3 text-sm text-slate-500">Last token issued: {queue.lastToken}</p>
                            </div>
                        </div>
                    </div>

                    {/* Current Appointment Details Card */}
                    {currentAppt && (
                        <div className="bg-white/5 border border-emerald-500/20 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <User className="text-emerald-400" /> Current Patient Details
                                </h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${currentAppt.checkedIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {currentAppt.checkedIn ? 'Checked In' : 'Not Checked In'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase">Patient Name</label>
                                        <p className="text-lg font-medium">{currentAppt.patientId?.fullName}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-slate-400" />
                                        <p className="text-slate-300">{currentAppt.patientId?.phoneNumber}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 text-right md:text-left">
                                    <div>
                                        <label className="text-xs text-slate-500 uppercase">Time Slot</label>
                                        <div className="flex items-center gap-2 mt-1 md:justify-start justify-end">
                                            <Calendar size={16} className="text-slate-400" />
                                            <p className="font-medium text-blue-400">{currentAppt.slotStart} - {currentAppt.slotEnd}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Done Button */}
                                    <button 
                                        onClick={() => handleCompleteAppointment(currentAppt._id)}
                                        className="w-full md:w-auto px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} /> Mark as Completed
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Upcoming Queue */}
                <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl h-fit">
                    <h2 className="text-xl font-semibold mb-6">Next in Line</h2>
                    <div className="space-y-4">
                        {queue.nextPatients?.length > 0 ? (
                            queue.nextPatients.map((patientId: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                                    <span className="font-medium">Token: {patientId}</span>
                                    <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">Upcoming</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-slate-500 py-10 italic">
                                No more patients in queue.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Sub-component for Stats
const StatCard = ({ title, value, icon, color }: any) => {
    const colors: any = {
        blue: "text-blue-400 bg-blue-500/10",
        yellow: "text-yellow-400 bg-yellow-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
        purple: "text-purple-400 bg-purple-500/10"
    }
    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-2xl hover:bg-white/10 transition-all">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-slate-400 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${colors[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

export default DoctorDashboard