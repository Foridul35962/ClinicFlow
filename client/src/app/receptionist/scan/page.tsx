"use client";

import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ArrowLeft, ShieldCheck, Info, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { checkInPatient } from "@/store/slice/receptionistSlice";
import { toast } from "react-toastify";

export default function ScanPage() {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>()

  const handleScan = async (result: any) => {
    if (result && isScanning) {
      const text = result[0]?.rawValue;

      if (text) {
        setIsScanning(false);
        setLoading(true);

        try {
          const url = new URL(text);
          const appointmentId = url.searchParams.get("appointmentId");
          const hash = url.searchParams.get("hash");

          await dispatch(checkInPatient({
            appointmentId: appointmentId as string,
            hash: hash as string
          })).unwrap()

          toast.success('Patient CheckIn Successfully')
          router.push('/')
        } catch (error: any) {
          toast.error(error.message)
          setIsScanning(true);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Top Header */}
      <div className="p-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-blue-400" size={20} />
          <span className="font-semibold tracking-wide uppercase text-sm">Secure Check-in</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Scan Appointment QR</h1>
          <p className="text-slate-400 text-sm">
            Align the QR code within the frame to check-in
          </p>
        </div>

        {/* Scanner Container */}
        <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border-4 border-white/10 bg-black shadow-2xl">
          {/* Custom Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            {/* Corner Borders */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>

            {/* Animated Scanning Line */}
            {isScanning && !loading && (
              <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] animate-scan-move"></div>
            )}
          </div>

          {/* Actual Scanner */}
          <Scanner
            onScan={handleScan}
            onError={(err) => console.log(err)}
            styles={{
              container: { width: '100%', height: '100%' }
            }}
          />

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 z-20 bg-slate-900/80 flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="font-medium">Verifying...</p>
            </div>
          )}
        </div>

        {/* Helper Footer */}
        <div className="mt-10 flex items-start gap-3 bg-white/5 p-4 rounded-2xl max-w-sm">
          <Info className="text-blue-400 shrink-0" size={20} />
          <p className="text-xs text-slate-400 leading-relaxed">
            Ensure you are at the reception desk. If the scanner doesn't pick up the code, try adjusting your phone's brightness.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan-move {
          0% { top: 20%; }
          50% { top: 80%; }
          100% { top: 20%; }
        }
        .animate-scan-move {
          animation: scan-move 3s infinite linear;
        }
      `}</style>
    </div>
  );
}