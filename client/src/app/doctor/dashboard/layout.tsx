import DoctorProvider from '@/provider/DoctorProvider'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <DoctorProvider>
                {children}
            </DoctorProvider>
        </>
    )
}

export default layout