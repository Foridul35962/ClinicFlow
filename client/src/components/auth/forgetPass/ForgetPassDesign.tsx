"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { Mail, ArrowRight, Loader2, KeyRound, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { forgetPass } from '@/store/slice/authSlice';
import { toast } from 'react-toastify';

const ForgetPassDesign = ({ setEmail }: { setEmail: React.Dispatch<React.SetStateAction<string>> }) => {
    const dispatch = useDispatch<AppDispatch>()
    const { authLoading } = useSelector((state: RootState) => state.auth);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: ""
        }
    });

    const onSubmit = async (data: { email: string }) => {
        try {
            await dispatch(forgetPass(data)).unwrap()
            setEmail(data.email);
        } catch (error:any) {
            toast.error(error.message)
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-8 md:p-12 relative overflow-hidden">
                
                {/* Decorative Background Element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl"></div>

                {/* Back to Login */}
                <Link 
                    href="/login" 
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-sm mb-8 transition-colors group"
                >
                    <ChevronLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Login
                </Link>

                {/* Header Icon */}
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-50 p-5 rounded-3xl">
                        <KeyRound className="size-10 text-blue-600" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Forgot Password?</h2>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed italic">
                        No worries! Enter your email and we'll send you <br /> 
                        instructions to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <input 
                                {...register("email", { 
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address"
                                    }
                                })}
                                type="email" 
                                placeholder="name@example.com"
                                className={`w-full pl-11 pr-4 py-4 text-black bg-slate-50 border rounded-2xl focus:ring-4 focus:ring-blue-600/10 outline-none transition-all font-medium ${
                                    errors.email ? 'border-red-300' : 'border-slate-100 focus:border-blue-600'
                                }`}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-red-500 text-xs font-bold ml-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={authLoading}
                        type="submit" 
                        className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                        {authLoading ? (
                            <>
                                <Loader2 className="size-5 animate-spin" />
                                <span>Sending OTP...</span>
                            </>
                        ) : (
                            <>
                                <span>Send Reset OTP</span>
                                <ArrowRight className="size-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Info */}
                <div className="mt-10 text-center">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                        ClinicFlow Security System
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgetPassDesign;