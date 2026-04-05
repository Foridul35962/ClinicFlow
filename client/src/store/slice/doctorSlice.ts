import { completeAppointmentType } from "@/types/doctor";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/doctor`

export const doctorDashboard = createAsyncThunk(
    "doctor/dashboard",
    async (_: null, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/dashboard`,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const callNextPatient = createAsyncThunk(
    "doctor/callNext",
    async (_: null, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/call-next-patient`, {
                withCredentials: true
            })
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const completeAppointment = createAsyncThunk(
    "doctor/completeAppointment",
    async (data: completeAppointmentType, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/completeAppointment`, data,
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
    dashboardLoading: boolean
    dashboardData: any
    doctorNextCallLoading: boolean
    appointmentDoneLoading: boolean
}

const initialState: initialStateType = {
    dashboardLoading: false,
    dashboardData: null,
    doctorNextCallLoading: false,
    appointmentDoneLoading: false
}

const doctorSlice = createSlice({
    name: "doctor",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(doctorDashboard.pending, (state) => {
                state.dashboardLoading = true
            })
            .addCase(doctorDashboard.fulfilled, (state, action) => {
                state.dashboardLoading = false
                state.dashboardData = action.payload.data
            })
            .addCase(doctorDashboard.rejected, (state) => {
                state.dashboardLoading = false
            })
        //next patient called
        builder
            .addCase(callNextPatient.pending, (state) => {
                state.doctorNextCallLoading = true
            })
            .addCase(callNextPatient.fulfilled, (state, action) => {
                state.doctorNextCallLoading = false;

                const data = action.payload.data;

                const queue = state.dashboardData.queue;

                queue.currentToken = data.currentAppointment.tokenNumber;

                queue.currentAppointment = data.currentAppointment;

                queue.nextPatients = queue.nextPatients.filter(
                    (token: any) => token !== data.nextToken
                );

                if (data.skippedToken) {
                    queue.skippedPatients = queue.skippedPatients || [];
                    queue.skippedPatients.push(data.skippedToken);
                }
            })
            .addCase(callNextPatient.rejected, (state) => {
                state.doctorNextCallLoading = false
            })
        //complete appointment
        builder
            .addCase(completeAppointment.pending, (state) => {
                state.appointmentDoneLoading = true
            })
            .addCase(completeAppointment.fulfilled, (state, action) => {
                state.appointmentDoneLoading = false
                const data = action.payload.data

                const queue = state.dashboardData.queue;
                const stats = state.dashboardData.stats;

                stats.completed += 1;
                stats.waiting -= 1;
                stats.income += queue.consultationFee;

                queue.currentToken = data.skippedToken;

                queue.currentAppointment = data.currentAppointment;

                queue.nextPatients = queue.nextPatients.filter(
                    (token: any) => token !== data.currentAppointment.tokenNumber
                );

                if (data.skippedToken) {
                    queue.skippedPatients = queue.skippedPatients || [];
                    queue.skippedPatients.push(data.skippedToken);
                }
            })
            .addCase(completeAppointment.rejected, (state) => {
                state.appointmentDoneLoading = false
            })
    }
})

export default doctorSlice.reducer