"use client";

import React, { useState, useEffect } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ArrowLeft, RotateCcw, Info, Loader2, UserCheck, Monitor, Smartphone, CameraOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { reCall } from "@/store/slice/receptionistSlice";
import { toast } from "react-toastify";

export default function RecallScanPage() {
    const router = useRouter();
    const [isScanning, setIsScanning] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [hasCamera, setHasCamera] = useState(true);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Device detection logic
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);

        if (!isMobile) {
            setIsDesktop(true);
        } else {
            setShowScanner(true);
        }

        // Camera availability check
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                const videoDevices = devices.filter(device => device.kind === 'videoinput');
                if (videoDevices.length === 0) {
                    setHasCamera(false);
                }
            });
        }
    }, []);

    const handleScan = async (result: any) => {
        if (result && isScanning) {
            const text = result[0]?.rawValue;

            if (text) {
                setIsScanning(false);
                setLoading(true);

                try {
                    const url = new URL(text);
                    const appointmentId = url.searchParams.get("appointmentId");

                    if (!appointmentId) {
                        throw new Error("Invalid QR Code: Appointment ID not found");
                    }

                    await dispatch(reCall({
                        appointmentId: appointmentId as string
                    })).unwrap();

                    toast.success('Patient Recalled Successfully');
                    router.push('/');
                } catch (error: any) {
                    toast.error(error.message || "Failed to recall patient");
                    setIsScanning(true);
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    // Desktop Warning View
    if (isDesktop && !showScanner) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white/5 p-10 rounded-3xl border border-white/10 max-w-md shadow-2xl backdrop-blur-xl">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Monitor size={80} className="text-slate-500" />
                            <Smartphone size={40} className="text-orange-500 absolute -bottom-2 -right-2 bg-slate-900 rounded-lg p-1" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Recall via Mobile?</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        Scanning is more efficient on mobile devices. Would you like to continue on this desktop or use your phone?
                    </p>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setShowScanner(true)}
                            className="w-full py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-semibold transition-all"
                        >
                            Use Desktop Camera
                        </button>
                        <button
                            onClick={() => router.back()}
                            className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-all border border-white/10"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Camera Not Found View
    if (!hasCamera && showScanner) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
                <CameraOff size={64} className="text-red-500 mb-6" />
                <h2 className="text-2xl font-bold mb-2">No Camera Found</h2>
                <p className="text-slate-400 max-w-xs mb-8">
                    We couldn't detect any camera. Please connect a webcam or try using a mobile device for scanning.
                </p>
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <>
            {
                showScanner &&
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
                            <RotateCcw className="text-orange-400" size={20} />
                            <span className="font-semibold tracking-wide uppercase text-sm text-orange-400">Patient Recall</span>
                        </div>
                        <div className="w-10" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold mb-2">Recall Missed Patient</h1>
                            <p className="text-slate-400 text-sm">
                                Align the QR code within the frame to bring them back to queue
                            </p>
                        </div>

                        {/* Scanner Container */}
                        <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border-4 border-white/10 bg-black shadow-2xl">
                            <div className="absolute inset-0 z-10 pointer-events-none">
                                <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-orange-500 rounded-tl-lg"></div>
                                <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-orange-500 rounded-tr-lg"></div>
                                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-orange-500 rounded-bl-lg"></div>
                                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-orange-500 rounded-br-lg"></div>

                                {isScanning && !loading && (
                                    <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.8)] animate-scan-move"></div>
                                )}
                            </div>

                            <Scanner
                                onScan={handleScan}
                                onError={(err) => console.log(err)}
                                styles={{
                                    container: { width: '100%', height: '100%' }
                                }}
                            />

                            {loading && (
                                <div className="absolute inset-0 z-20 bg-slate-900/80 flex flex-col items-center justify-center">
                                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                                    <p className="font-medium">Recalling Patient...</p>
                                </div>
                            )}
                        </div>

                        {/* Helper Footer */}
                        <div className="mt-10 flex items-start gap-3 bg-white/5 p-4 rounded-2xl max-w-sm border border-white/5">
                            <UserCheck className="text-orange-400 shrink-0" size={20} />
                            <p className="text-xs text-slate-400 leading-relaxed">
                                This action will re-activate the patient's appointment. Make sure the patient is now present at the waiting area.
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
            }
        </>
    );
}