import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slice/authSlice'
import adminReducer from './slice/adminSlice'
import userReducer from './slice/userSlice'

const store = configureStore({
    reducer:{
        auth: authReducer,
        admin: adminReducer,
        user: userReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store