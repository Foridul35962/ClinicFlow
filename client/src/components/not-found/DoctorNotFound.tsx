"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft, UserRoundX, Home } from 'lucide-react';
import Link from 'next/link';

const DoctorNotFound = () => {
    const router = useRouter();

    return (
        <div className="min-h-[85vh] w-full flex items-center justify-center bg-white px-6">
            <div className="max-w-md w-full">

                {/* Icon Section */}
                <div className="flex justify-center mb-6">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 relative">
                        <UserRoundX size={48} className="text-slate-300" strokeWidth={1.5} />
                        <div className="absolute top-0 right-0 h-8 w-8 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
                            <Search size={14} className="text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Text Section */}
                <div className="text-center space-y-3 mb-10">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                        Doctor Profile Not Found
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                        The profile you are looking for might have been deactivated or the URL is incorrect. Please try searching again.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link
                        href={'/'}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all active:scale-[0.98] shadow-md shadow-blue-100"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>

                    <button
                        onClick={() => router.back()}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-slate-600 text-sm font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all active:scale-[0.98]"
                    >
                        <ArrowLeft size={18} />
                        Return to Previous Page
                    </button>
                </div>

                {/* Footer Info */}
                <div className="mt-12 text-center">
                    <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                        Error Code: 404_DR_NOT_FOUND
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DoctorNotFound;