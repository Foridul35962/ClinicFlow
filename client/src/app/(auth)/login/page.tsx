"use client";

import React from 'react';
import { Stethoscope, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { login } from '@/store/slice/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const LoginPage = () => {
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    const { authLoading } = useSelector((state: RootState) => state.auth)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        try {
            await dispatch(login({ email, password })).unwrap()
            router.push('/')
            toast.success('Login Successfully')
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
            <div className="w-full max-w-275 bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col md:flex-row">

                {/* Left Side: Visual/Brand Info */}
                <div className="hidden md:flex md:w-1/2 bg-blue-600 p-12 text-white flex-col justify-between relative overflow-hidden">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-900/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-2 mb-12">
                            <div className="bg-white p-2 rounded-lg">
                                <Stethoscope className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-2xl font-black tracking-tight italic">
                                Clinic<span className="text-blue-100 font-extrabold not-italic underline decoration-2 underline-offset-4">Flow</span>
                            </span>
                        </Link>

                        <h2 className="text-4xl font-bold leading-tight mb-6">
                            Welcome back to <br /> your health portal.
                        </h2>
                        <p className="text-blue-100 text-lg font-medium opacity-90">
                            Log in to manage your appointments, track your queue status, and stay connected with your doctors.
                        </p>
                    </div>

                    <div className="relative z-10 pt-10 border-t border-white/20">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-blue-600 bg-slate-200 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-blue-50">Joined by 10k+ patients this month</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                    <div className="mb-10">
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Log In</h3>
                        <p className="text-slate-500 font-medium italic">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    name='email'
                                    placeholder="name@example.com"
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium text-slate-800"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                                <Link href="/forget-pass" className="text-xs font-bold text-blue-600 hover:underline tracking-tight">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type="password"
                                    name='password'
                                    placeholder="••••••••"
                                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium text-slate-800"
                                />
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={authLoading}
                            className="w-full py-4 disabled:cursor-not-allowed cursor-pointer bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {authLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In to Account</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>
                    <p className="mt-10 text-center text-slate-500 font-medium">
                        Don't have an account? <Link href="/register" className="text-blue-600 font-black hover:underline">Register Now</Link>
                    </p>
                </div>

            </div>
        </div>
    );
};

export default LoginPage;