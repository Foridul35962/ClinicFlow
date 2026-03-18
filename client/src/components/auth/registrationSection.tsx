"use client";

import { useForm } from 'react-hook-form';
import {
    Stethoscope, User, Mail, Lock, ArrowRight,
    CircleCheckBig, Circle, Phone,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { registrationType } from '@/types/user';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { registration } from '@/store/slice/authSlice';
import { toast } from 'react-toastify';

const RegisterSection = ({setEmail}:{setEmail:React.Dispatch<React.SetStateAction<string>>}) => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: ""
        }
    });

    const passwordValue = watch("password", "");
    const confirmPasswordValue = watch("confirmPassword", "");

    const alphabetValidate = /[a-zA-Z]/.test(passwordValue);
    const numberValidate = /\d/.test(passwordValue);
    const lengthValidate = passwordValue.length >= 8;
    const matchValidate = passwordValue === confirmPasswordValue && confirmPasswordValue.length > 0;

    const dispatch = useDispatch<AppDispatch>()
    const { authLoading } = useSelector((state: RootState) => state.auth)
    const onSubmit = async (data: any) => {
        const finalData: registrationType = {
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            password: data.password,
            role: "patient"
        };

        try {
            await dispatch(registration(finalData)).unwrap()
            setEmail(finalData.email)
        } catch (error:any) {
            toast.error(error.message)
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6 py-12">
            <div className="w-full max-w-275 bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 overflow-hidden flex flex-col md:flex-row">

                {/* Left Side: Info */}
                <div className="hidden md:flex md:w-5/12 bg-slate-900 p-12 text-white flex-col justify-between relative">
                    <div className="relative z-10">
                        <Link href="/" className="flex items-center gap-2 mb-12">
                            <div className="bg-blue-600 p-2 rounded-lg"><Stethoscope className="w-6 h-6" /></div>
                            <span className="text-2xl font-black italic">Clinic<span className="text-blue-500 not-italic">Flow</span></span>
                        </Link>
                        <h2 className="text-4xl font-bold leading-tight mb-8">Join the future of healthcare.</h2>
                        <p className="text-slate-400">Create an account to experience seamless appointment management.</p>
                    </div>
                    <div className="text-xs text-slate-500 border-t border-white/10 pt-6">
                        © 2026 ClinicFlow • Secure Patient Portal
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-7/12 p-8 md:p-14 bg-white">
                    <div className="mb-10 text-center md:text-left">
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Patient Registration</h3>
                        <p className="text-slate-500 italic font-medium">Join <span className="text-blue-600">ClinicFlow</span> as a patient</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    {...register("fullName", { required: true })}
                                    type="text" placeholder="John Doe"
                                    className="w-full pl-11 pr-4 py-3.5 text-black bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        {/* Email & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        {...register("email", { required: true })}
                                        type="email" placeholder="john@example.com"
                                        className="w-full pl-11 pr-4 py-3.5 text-black bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        {...register("phoneNumber", { required: true })}
                                        type="tel" placeholder="+8801XXXXXXXXX"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 text-black border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password & Confirm Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        {...register("password", { required: true })}
                                        type="password" placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border text-black border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                    <input
                                        {...register("confirmPassword", { required: true })}
                                        type="password" placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border text-black border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Validation Checklist */}
                        <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                            <div className="flex flex-col gap-2 *:flex *:gap-2 *:items-center *:text-sm font-medium">
                                <div className={alphabetValidate ? "text-green-600" : "text-gray-400"}>
                                    {alphabetValidate ? <CircleCheckBig className="size-4" /> : <Circle className="size-4" />}
                                    <p>At least one Alphabet</p>
                                </div>
                                <div className={numberValidate ? "text-green-600" : "text-gray-400"}>
                                    {numberValidate ? <CircleCheckBig className="size-4" /> : <Circle className="size-4" />}
                                    <p>At least one number</p>
                                </div>
                                <div className={lengthValidate ? "text-green-600" : "text-gray-400"}>
                                    {lengthValidate ? <CircleCheckBig className="size-4" /> : <Circle className="size-4" />}
                                    <p>Minimum length 8 characters</p>
                                </div>
                                <div className={matchValidate ? "text-green-600" : "text-gray-400"}>
                                    {matchValidate ? <CircleCheckBig className="size-4" /> : <Circle className="size-4" />}
                                    <p>Passwords must match</p>
                                </div>
                            </div>
                        </div>

                        <button
                            disabled={!alphabetValidate || !numberValidate || !lengthValidate || !matchValidate || authLoading}
                            type="submit"
                            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
                        >
                            {authLoading ? (
                                <>
                                    <Loader2 className="size-5 animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight className="size-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 font-medium">
                        Already have an account? <Link href="/login" className="text-blue-600 font-black hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterSection;