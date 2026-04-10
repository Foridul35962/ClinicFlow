"use client"

import React, { useEffect } from 'react';
import { ArrowRight, Plus, Activity, ShieldPlus, Zap } from 'lucide-react';
import Link from 'next/link';
import DepartmentCard from './DepartmentCard';
import AddDepartmentModal from './AddDepartmentModal';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { getDepartments } from '@/store/slice/adminSlice';
import { toast } from 'react-toastify';

const DepartmentsDesign = ({ admin }: { admin: boolean }) => {
    const dispatch = useDispatch<AppDispatch>()
    const { departments } = useSelector((state: RootState) => state.admin)
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                await dispatch(getDepartments(null)).unwrap()
            } catch (error: any) {
                toast.error(error.message)
            }
        }
        if (departments.length === 0) {
            fetchDepartment()
        }
    }, [])

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            {/* --- Decorative Background Blobs --- */}
            <div className="absolute top-0 right-0 size-125 bg-blue-50/50 rounded-full blur-[120px] -z-10" />
            <div className="absolute top-[20%] left-0 size-100 bg-indigo-50/40 rounded-full blur-[100px] -z-10" />

            {/* --- Navigation & Admin Header --- */}
            <div className="container mx-auto px-6 pt-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-slate-100 pb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-xl text-white">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Medical Care</h2>
                            <p className="text-xs text-slate-400 font-bold italic">Excellence Guaranteed</p>
                        </div>
                    </div>

                    {/* Admin Button moved to the far right corner */}
                    {admin && (
                        <div className="group">
                            <AddDepartmentModal />
                        </div>
                    )}
                </div>
            </div>

            {/* --- Hero Section --- */}
            <section className="relative pt-6 pb-20 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">

                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter">
                            Advanced <br />
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                                Departments
                            </span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl max-w-xl font-medium leading-relaxed border-l-4 border-blue-600 pl-6">
                            Providing comprehensive medical care through our specialized units, led by world-class consultants and surgeons.
                        </p>
                    </div>
                </div>
            </section>

            {/* --- Departments Grid --- */}
            <section className="pb-24 relative">
                <div className="container mx-auto px-6">
                    {departments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {departments.map((dept: any) => (
                                <DepartmentCard key={dept._id} dept={dept} admin={admin} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm">
                            <p className="text-slate-400 font-bold text-lg">No departments found in the directory.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* --- Contact / Support Banner --- */}
            {!admin && <section className="pb-20">
                <div className="container mx-auto px-6">
                    <div className="bg-slate-900 rounded-[3.5rem] p-12 md:p-16 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-all duration-700" />

                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                            <div className="max-w-xl text-center md:text-left">
                                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                                    Can't find the right specialist?
                                </h3>
                                <p className="text-slate-400 font-medium text-lg">
                                    Our health coordinators are ready to assist you in finding the most suitable department for your diagnosis.
                                </p>
                            </div>
                            <Link href="/contact" className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-black rounded-[2rem] hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-900/20 whitespace-nowrap">
                                Get In Touch <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>}
        </div>
    );
};

export default DepartmentsDesign;