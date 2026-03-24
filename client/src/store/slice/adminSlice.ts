import { addDepartmentType, addMemberType, editMemberType, editDepartmentType } from "@/types/member";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const SERVER_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin`

export const addMember = createAsyncThunk(
    "admin/addMember",
    async (data: addMemberType, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${SERVER_URL}/add-member`, data,
                { withCredentials: true }
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const editMember = createAsyncThunk(
    "admin/editMember",
    async ({ data, memberId }: { data: editMemberType, memberId: string }, {rejectWithValue}) => {
        try {
            const res = await axios.patch(`${SERVER_URL}/edit-member/${memberId}`, data,
                {withCredentials: true}
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

export const deleteMember = createAsyncThunk(
    "admin/deleteMember",
    async(memberId:string, {rejectWithValue})=>{
        try {
            const res = await axios.delete(`${SERVER_URL}/delete-member/${memberId}`,
                {withCredentials: true}
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
    async(data:addDepartmentType, {rejectWithValue})=>{
        try {
            const res = await axios.post(`${SERVER_URL}/add-department`, data,
                {withCredentials: true}
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
    async({data, departmentId}:{data:editDepartmentType, departmentId: string}, {rejectWithValue})=>{
        try {
            const res = await axios.patch(`${SERVER_URL}/edit-department/${departmentId}`, data,
                {withCredentials: true}
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
    async(departmentId:string, {rejectWithValue})=>{
        try {
            const res = await axios.delete(`${SERVER_URL}/delete-department/${departmentId}`,
                {withCredentials: true}
            )
            return res.data
        } catch (error) {
            const err = error as AxiosError<any>
            return rejectWithValue(err?.response?.data || "Something went wrong")
        }
    }
)

interface initialStateType{
    adminLoading: boolean
}

const initialState:initialStateType={
    adminLoading:false
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        //add member
        // builder
        //     .addCase(addMember.pending, (state)=>{
        //         state.adminLoading = true
        //     })

        //add department
        builder
            .addCase(addDepartment.pending, (state)=>{
                state.adminLoading = true
            })
            .addCase(addDepartment.fulfilled, (state)=>{
                state.adminLoading = false
            })
            .addCase(addDepartment.rejected, (state)=>{
                state.adminLoading = false
            })
        //edit department
        builder
            .addCase(editDepartment.pending, (state)=>{
                state.adminLoading = true
            })
            .addCase(editDepartment.fulfilled, (state)=>{
                state.adminLoading = false
            })
            .addCase(editDepartment.rejected, (state)=>{
                state.adminLoading = false
            })
        //delete department
        builder
            .addCase(deleteDepartment.pending, (state)=>{
                state.adminLoading = true
            })
            .addCase(deleteDepartment.fulfilled, (state)=>{
                state.adminLoading = false
            })
            .addCase(deleteDepartment.rejected, (state)=>{
                state.adminLoading = false
            })
    }
})

export default adminSlice.reducer