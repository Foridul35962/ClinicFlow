import ReceptionistProvider from '@/provider/ReceptionistProvider'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {
                <ReceptionistProvider >
                    {children}
                </ReceptionistProvider>
            }
        </>
    )
}

export default layout