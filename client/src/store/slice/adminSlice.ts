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

export const getDepartments = createAsyncThunk(
    "admin/getDepartment",
    async(_:null, {rejectWithValue})=>{
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/allDepartment`)
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
    async (data: FormData, { rejectWithValue }) => {
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
    getDoctorLoading: boolean
    allDoctor: any
    departments: any
}

const initialState: initialStateType = {
    adminLoading: false,
    getDoctorLoading: false,
    allDoctor: [],
    departments: []
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
            .addCase(addDepartment.fulfilled, (state, action) => {
                state.adminLoading = false
                state.departments = [...state.departments, action.payload.data]
            })
            .addCase(addDepartment.rejected, (state) => {
                state.adminLoading = false
            })
        //edit department
        builder
            .addCase(editDepartment.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(editDepartment.fulfilled, (state, action) => {
                state.adminLoading = false
                const departmentId = action.payload.data._id
                const idx = state.departments.findIndex((department:any)=>department._id === departmentId)
                state.departments[idx] = action.payload.data
            })
            .addCase(editDepartment.rejected, (state) => {
                state.adminLoading = false
            })
        //delete department
        builder
            .addCase(deleteDepartment.pending, (state) => {
                state.adminLoading = true
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                state.adminLoading = false
                const departmentId = action.payload.data
                state.departments = state.departments.filter((department:any)=>department._id !== departmentId)
            })
            .addCase(deleteDepartment.rejected, (state) => {
                state.adminLoading = false
            })
        //get department
        builder
            .addCase(getDepartments.fulfilled, (state, action)=>{
                state.departments = action.payload.data
            })
        //get all doctors
        builder
            .addCase(getAllDoctors.pending, (state)=>{
                state.getDoctorLoading = true
            })
            .addCase(getAllDoctors.fulfilled, (state, action)=>{
                state.getDoctorLoading = false
                state.allDoctor = action.payload.data
            })
            .addCase(getAllDoctors.rejected, (state)=>{
                state.getDoctorLoading = false
            })
        //add doctor
        builder
            .addCase(addDoctor.pending, (state)=>{
                state.adminLoading=true
            })
            .addCase(addDoctor.fulfilled, (state, action)=>{
                state.adminLoading=false
                state.allDoctor = [...state.allDoctor, action.payload.data]
            })
            .addCase(addDoctor.rejected, (state)=>{
                state.adminLoading=false
            })
    }
})

export default adminSlice.reducer