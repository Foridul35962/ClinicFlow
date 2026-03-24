import AdminProvider from '@/provider/AdminProvider'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <AdminProvider>
                {children}
            </AdminProvider>
        </>
    )
}

export default layout