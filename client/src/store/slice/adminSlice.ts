import {
    addDepartmentType,
    addDoctorType,
    addReceptionistType,
    editDepartmentType,
    editDoctorType,
    editReceptionistType
} from "@/types/member";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin`

export const addReceptionist = createAsyncThunk(
    "admin/addreceptionist",
    async (data: addReceptionistType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/add-receptionist`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const editReceptionist = createAsyncThunk(
    "admin/editreceptionist",
    async ({ data, receptionistId }: { data: editReceptionistType, receptionistId: string }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/edit-receptionist/${receptionistId}`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const deleteReceptionist = createAsyncThunk(
    "admin/deletereceptionist",
    async (receptionistId: string, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`${SERVER_URL}/delete-receptionist/${receptionistId}`,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const addDepartment = createAsyncThunk(
    "admin/addDepartment",
    async (data: addDepartmentType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/add-department`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const editDepartment = createAsyncThunk(
    "admin/editDepartment",
    async ({ data, departmentId }: { data: editDepartmentType, departmentId: string }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/edit-department/${departmentId}`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const deleteDepartment = createAsyncThunk(
    "admin/deleteDepartment",
    async (departmentId: string, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`${SERVER_URL}/delete-department/${departmentId}`,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const getAllDoctors = createAsyncThunk(
    "admin/allDoctors",
    async (_: null, { rejectWithValue }) => {
        try {
            const res = await axios.get(`${SERVER_URL}/all-doctors`, {
                withCredentials: true
            })
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const addDoctor = createAsyncThunk(
    "admin/addDoctor",
    async (data: addDoctorType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/add-doctor`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const editDoctor = createAsyncThunk(
    "admin/editDoctor",
    async ({ data, doctorId }: { data: editDoctorType, doctorId: string }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/edit-doctor/${doctorId}`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const deleteDoctor = createAsyncThunk(
    "admin/deleteDoctor",
    async ({ doctorId }: { doctorId: string }, { rejectWithValue }) => {
        try {
            const res = await axios.delete(`${SERVER_URL}/delete-doctor/${doctorId}`,
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
    adminLoading: boolean
}

const initialState: initialStateType = {
    adminLoading: false
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        //add receptionist
        // builder
        //     .addCase(addreceptionist.pending, (state)=>{
        //         state.adminLoading = true
        //     })

        //add department
        builder
            .addCase(addDepartment.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(addDepartment.fulfilled, (state) => {
                state.adminLoading = false
            })
            .addCase(addDepartment.rejected, (state) => {
                state.adminLoading = false
            })
        //edit department
        builder
            .addCase(editDepartment.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(editDepartment.fulfilled, (state) => {
                state.adminLoading = false
            })
            .addCase(editDepartment.rejected, (state) => {
                state.adminLoading = false
            })
        //delete department
        builder
            .addCase(deleteDepartment.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(deleteDepartment.fulfilled, (state) => {
                state.adminLoading = false
            })
            .addCase(deleteDepartment.rejected, (state) => {
                state.adminLoading = false
            })
    }
})

export default adminSlice.reducer