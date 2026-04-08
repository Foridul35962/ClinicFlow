"use client"

import AppointmentValuePage from '@/components/patient/AppointmentValuePage'
import { getAppointment, getCurrentToken, updateStatus, updateToken } from '@/store/slice/patientSlice'
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
    const { patientLoading, appointment, currentToken } = useSelector((state: RootState) => state.patient)

    useEffect(() => {
        const fetchData = async () => {
            if (!appointmentId) return;
            try {
                const res = await dispatch(getAppointment({ appointmentId: appointmentId as string })).unwrap()

                if (res?.data?.appointment?.doctorId) {
                    dispatch(getCurrentToken({ doctorId: res.data.appointment.doctorId, date: res.data.appointment.date }))
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to fetch appointment")
            }
        }
        fetchData()
    }, [appointmentId, dispatch])

    useEffect(() => {
        const handleUpdateStatus = ({ status }: { status: string }) => {
            dispatch(updateStatus(status))
        }
        socket.on('appointmentStatusUpdate', handleUpdateStatus)
        return () => { socket.off('appointmentStatusUpdate', handleUpdateStatus) }
    }, [dispatch])

    useEffect(() => {
        if (!appointment?.appointment) return;

        const { doctorId, date } = appointment.appointment;

        const formattedDate = new Date(date)
            .toISOString()
            .split('T')[0];

        socket.emit('joinQueue', { doctorId, date: formattedDate })

        return () => {
            socket.emit('leaveQueue', { doctorId, date: formattedDate })
        }
    }, [appointment?.appointment?.doctorId, appointment?.appointment?.date])

    useEffect(() => {
        const handleCurrentToken = ({ currentToken }: { currentToken: number }) => {
            dispatch(updateToken(currentToken))
        }

        socket.on("updateToken", handleCurrentToken)

        return () => {
            socket.off("updateToken", handleCurrentToken)
        }
    }, [dispatch])

    // Loading State
    if (patientLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
                <p className="text-slate-500 font-medium animate-pulse">Loading appointment details...</p>
            </div>
        )
    }

    if (!appointment && !patientLoading) {
        return <AppointmentNotFound />
    }

    return (
        <>
            {appointment && <AppointmentValuePage appointmentValue={appointment} currentToken={currentToken} />}
        </>
    )
}

export default Page