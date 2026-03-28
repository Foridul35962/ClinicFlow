import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user`

export const getDoctor = createAsyncThunk(
    "user/fetchDoctor",
    async (doctorId: string, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/doctor/${doctorId}`)
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const getDepartmentDoctor = createAsyncThunk(
    "user/departmentDoctor",
    async ({ departmentId }: { departmentId: string }, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/departmentDoctor/${departmentId}`)
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

interface userType {
    userLoading: boolean
    doctor: any
    departmentDoctor: any
}

const initialState: userType = {
    userLoading: false,
    doctor: null,
    departmentDoctor: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //get doctor
        builder
            .addCase(getDoctor.pending, (state) => {
                state.userLoading = true
            })
            .addCase(getDoctor.fulfilled, (state, action) => {
                state.userLoading = false
                state.doctor = action.payload.data
            })
            .addCase(getDoctor.rejected, (state) => {
                state.userLoading = false
            })
        builder
            .addCase(getDepartmentDoctor.pending, (state)=>{
                state.userLoading = true
            })
            .addCase(getDepartmentDoctor.fulfilled, (state, action)=>{
                state.userLoading = false
                state.departmentDoctor = action.payload.data
            })
            .addCase(getDepartmentDoctor.rejected, (state)=>{
                state.userLoading = false
            })
    }
})

export default userSlice.reducer