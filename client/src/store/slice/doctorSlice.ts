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
    async(_:null, {rejectWithValue})=>{
        try {
            const res = await axios.get(`${SERVER_URL}/call-next-patient`,{
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
    async(data:completeAppointmentType, {rejectWithValue})=>{
        try {
            const res = await axios.patch(`${SERVER_URL}/completeAppointment`, data,
                {withCredentials:true}
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
}

const initialState: initialStateType = {
    dashboardLoading: false,
    dashboardData: null
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
    }
})

export default doctorSlice.reducer