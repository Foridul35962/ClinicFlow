"use client"

import ForgetPassDesign from '@/components/auth/forgetPass/ForgetPassDesign'
import ResetPass from '@/components/auth/forgetPass/ResetPass'
import VerifyPass from '@/components/auth/forgetPass/VerifyPass'
import React, { useState } from 'react'

const page = () => {
    const [email, setEmail] = useState('')
    const [verified, setVerified] = useState(false)
    return (
        <>
            {
                !email ? <ForgetPassDesign setEmail={setEmail} /> : (
                    !verified ? <VerifyPass email={email} setVerified={setVerified} /> :
                        <ResetPass email={email} />
                )
            }
        </>
    )
}

export default page