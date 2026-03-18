"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import {
  Lock,
  ShieldCheck,
  ArrowRight,
  Loader2,
  CircleCheckBig,
  Circle,
  RefreshCw
} from 'lucide-react';
import { resetPass } from '@/store/slice/authSlice';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const ResetPass = ({ email }: { email: string }) => {
  const { authLoading } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  });

  // Password validation logic
  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");

  const alphabetValidate = /[a-zA-Z]/.test(passwordValue);
  const numberValidate = /\d/.test(passwordValue);
  const lengthValidate = passwordValue.length >= 8;
  const matchValidate = passwordValue === confirmPasswordValue && confirmPasswordValue.length > 0;

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const onSubmit = async (data: any) => {
    try {
      await dispatch(resetPass({ email, password: data.password })).unwrap()
      router.push('/login')
      toast.success('Password Reset Successfully')
    } catch (error: any) {
      toast.error(error.message)
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-8 md:p-12 relative overflow-hidden">

        {/* Header Icon */}
        <div className="flex justify-center mb-8">
          <div className="bg-blue-50 p-5 rounded-3xl">
            <RefreshCw className="size-10 text-blue-600 animate-spin-slow" />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Set New Password</h2>
          <p className="text-slate-500 text-sm font-medium italic">
            Almost there! Create a strong password for <br />
            <span className="text-blue-600 font-bold not-italic">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* New Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                {...register("password", { required: true })}
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-4 text-black bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
            <div className="relative group">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                {...register("confirmPassword", { required: true })}
                type="password"
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-4 text-black bg-slate-50 border rounded-2xl focus:ring-4 focus:ring-blue-600/10 outline-none transition-all font-medium ${matchValidate ? 'border-green-200 focus:border-green-600' : 'border-slate-100 focus:border-blue-600'
                  }`}
              />
            </div>
          </div>

          {/* Validation Checklist */}
          <div className="p-5 bg-slate-50 rounded-4xl border border-slate-100 space-y-3">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Security Standards</p>
            <div className="flex flex-col gap-2.5 *:flex *:gap-2 *:items-center *:text-xs font-bold transition-all">
              <div className={alphabetValidate ? "text-green-600" : "text-gray-400"}>
                {alphabetValidate ? <CircleCheckBig className="size-4" /> : <Circle className="size-4" />}
                <p>At least one Alphabet</p>
              </div>
              <div className={numberValidate ? "text-green-600" : "text-gray-400"}>
                {numberValidate ? <CircleCheckBig className="size-4" /> : <Circle className="size-4" />}
                <p>At least one Number</p>
              </div>
              <div className={lengthValidate ? "text-green-600" : "text-gray-400"}>
                {lengthValidate ? <CircleCheckBig className="size-4" /> : <Circle className="size-4" />}
                <p>Minimum 8 Characters</p>
              </div>
              <div className={matchValidate ? "text-green-600" : "text-gray-400"}>
                {matchValidate ? <CircleCheckBig className="size-4" /> : <Circle className="size-4" />}
                <p>Passwords Match</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={!alphabetValidate || !numberValidate || !lengthValidate || !matchValidate || authLoading}
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {authLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <span>Reset Password</span>
                <ArrowRight className="size-5" />
              </>
            )}
          </button>
        </form>

        {/* Custom Styles for Spin */}
        <style jsx>{`
          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ResetPass;