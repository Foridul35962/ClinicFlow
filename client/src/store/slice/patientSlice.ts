import { AppointmentProps, appointmentType } from "@/types/patient";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/patient`

export const appointment = createAsyncThunk(
    "patient/appointment",
    async (data: appointmentType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/appointment`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const getAppointmentHistory = createAsyncThunk(
    "patient/appointmentHistory",
    async (_: null, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/appointmentHistory`,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const getAppointment = createAsyncThunk(
    "patient/getAppointment",
    async ({ appointmentId }: { appointmentId: string }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/get-appointment/${appointmentId}`,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

interface initialStateType {
    patientLoading: boolean
    appointmentValue: AppointmentProps | null
    appointmentHistory: any
    appointment: any
}

const initialState: initialStateType = {
    patientLoading: false,
    appointmentValue: null,
    appointment: null,
    appointmentHistory: []
}

const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        updateStatus: (state, action) => {
            if (state.appointment?.appointment) {
                state.appointment.appointment.status = action.payload
            }
        }
    },
    extraReducers: (builder) => {
        // add apointment
        builder
            .addCase(appointment.pending, (state) => {
                state.patientLoading = true
            })
            .addCase(appointment.fulfilled, (state, action) => {
                state.patientLoading = false
                state.appointmentValue = action.payload.data
                state.appointmentHistory = [action.payload.data, ...state.appointmentHistory]
            })
            .addCase(appointment.rejected, (state) => {
                state.patientLoading = false
            })
        //appointment history
        builder
            .addCase(getAppointmentHistory.pending, (state) => {
                state.patientLoading = true
            })
            .addCase(getAppointmentHistory.fulfilled, (state, action) => {
                state.patientLoading = false
                state.appointmentHistory = action.payload.data
            })
            .addCase(getAppointmentHistory.rejected, (state) => {
                state.patientLoading = false
            })
        // get appointment
        builder
            .addCase(getAppointment.pending, (state) => {
                state.patientLoading = true
            })
            .addCase(getAppointment.fulfilled, (state, action) => {
                state.patientLoading = false
                state.appointment = action.payload.data
            })
            .addCase(getAppointment.rejected, (state) => {
                state.patientLoading = false
            })
    }
})

export default patientSlice.reducer
export const { updateStatus } = patientSlice.actions