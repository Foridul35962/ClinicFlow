"use client"

import AppointmentValuePage from '@/components/patient/AppointmentValuePage'
import { getAppointment, updateStatus } from '@/store/slice/patientSlice'
import { AppDispatch, RootState } from '@/store/store'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { Loader2 } from 'lucide-react'
import AppointmentNotFound from '@/components/not-found/AppointmentNotFound'
import socket from '@/socket'

const Page = () => {
    const { appointmentId } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const { patientLoading, appointment } = useSelector((state: RootState) => state.patient)

    useEffect(() => {
        const fetch = async () => {
            if (!appointmentId) return;
            try {
                await dispatch(getAppointment({ appointmentId: appointmentId as string })).unwrap()
            } catch (error: any) {
                toast.error(error.message || "Failed to fetch appointment")
            }
        }
        fetch()
    }, [appointmentId, dispatch])

    type AppointmentStatusPayload = {
        status: string
    }

    useEffect(() => {
        const handleUpdateStatus = ({ status }: AppointmentStatusPayload) => {
            dispatch(updateStatus(status))
        }

        socket.on('appointmentStatusUpdate', handleUpdateStatus)

        return () => {
            socket.off('appointmentStatusUpdate', handleUpdateStatus)
        }
    }, [dispatch, appointmentId])

    // Loading State UI
    if (patientLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
                <p className="text-slate-500 font-medium animate-pulse">Loading appointment details...</p>
            </div>
        )
    }

    // Appointment Not Found State
    if (!appointment && !patientLoading) {
        return <AppointmentNotFound />
    }

    return (
        <>
            {appointment && <AppointmentValuePage appointmentValue={appointment} />}
        </>
    )
}

export default Page