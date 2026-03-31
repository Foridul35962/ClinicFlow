import { appointmentType } from "@/types/patient";
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

interface initialStateType{
    patientLoading: boolean
    appointmentValue: any
}

const initialState:initialStateType = {
    patientLoading: false,
    appointmentValue: null
}

const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {},
    extraReducers: (builder)=>{
        // add apointment
        builder
            .addCase(appointment.pending, (state)=>{
                state.patientLoading = true
            })
            .addCase(appointment.fulfilled, (state, action)=>{
                state.patientLoading = false
                state.appointmentValue = action.payload.data
            })
            .addCase(appointment.rejected, (state)=>{
                state.patientLoading = false
            })
    }
})

export default patientSlice.reducer