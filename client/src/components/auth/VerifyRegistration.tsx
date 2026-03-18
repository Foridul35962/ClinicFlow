"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mail, ArrowRight, Loader2, ShieldCheck, RotateCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { resendOtp, verifyRegi } from '@/store/slice/authSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const VerifyRegistration = ({ email }: { email: string }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const { authLoading, otpLoading } = useSelector((state: RootState) => state.auth);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    try {
      await dispatch(verifyRegi({ email, otp: fullOtp })).unwrap();
      toast.success('Verification successful');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(resendOtp({ email, topic: 'registration' })).unwrap();
      setTimer(60);
      toast.success('OTP resent to your email');
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 p-8 md:p-12 text-center">

        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 p-4 rounded-3xl shadow-xl shadow-blue-200">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-2">Verify Email</h2>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
          We've sent a 6-digit verification code to <br />
          <span className="text-blue-600 font-bold">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-center gap-2 md:gap-3">
            {otp.map((data, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={1}
                value={data}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onChange={(e) => handleChange(e.target.value, index)}
                onFocus={(e) => e.target.select()}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-black text-blue-600 bg-slate-200 border-2 border-slate-300 rounded-2xl focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10 outline-none transition-all"
              />
            ))}
          </div>

          <button
            disabled={otp.some(v => v === "") || authLoading}
            type="submit"
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {authLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Verify & Proceed</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-50">
          <p className="text-sm text-slate-400 font-medium mb-4">Didn't receive the code?</p>
          <button
            disabled={timer > 0 || otpLoading}
            onClick={handleResendOtp}
            className={`flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed mx-auto font-bold text-sm transition-all ${timer > 0 ? 'text-slate-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            <RotateCw className={`w-4 h-4 ${timer === 0 ? 'animate-pulse' : ''}`} />
            {timer > 0 ? `Resend Code in ${timer}s` : "Resend OTP Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyRegistration;