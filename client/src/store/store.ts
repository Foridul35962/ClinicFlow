import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/authSlice'
import adminReducer from './slice/adminSlice'
import userReducer from './slice/userSlice'
import patientReducer from './slice/patientSlice'
import receptionistReducer from './slice/receptionistSlice'
import doctorReducer from './slice/doctorSlice'

const store = configureStore({
    reducer:{
        auth: authReducer,
        admin: adminReducer,
        user: userReducer,
        patient: patientReducer,
        receptionist: receptionistReducer,
        doctor: doctorReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store