"use client"

import store from '@/store/store'
import React from 'react'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'

const ReduxProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>
            {children}
            <ToastContainer />
        </Provider>
    )
}

export default ReduxProvider