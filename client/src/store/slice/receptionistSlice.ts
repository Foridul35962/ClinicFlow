import { completeAppointmentType } from "@/types/doctor";
import { checkInPatientType } from "@/types/receptionist";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/receptionist`

export const checkInPatient = createAsyncThunk(
    "receptionist/checkIn",
    async (data: checkInPatientType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/checkIn`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const reCall = createAsyncThunk(
    "receptionist/recall",
    async(data:completeAppointmentType, {rejectWithValue})=>{
        try {
            const res = await axios.post(`${SERVER_URL}/recall`, data,
                {withCredentials: true}
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

const initialState = {}

const receptionistSlice = createSlice({
    name: "receptionist",
    initialState,
    reducers: {},
    extraReducers: (builder) => { }
})

export default receptionistSlice.reducer