"use client"

import RegisterSection from '@/components/auth/registrationSection'
import VerifyRegistration from '@/components/auth/VerifyRegistration'
import React, { useState } from 'react'

const page = () => {
    const [email, setEmail] = useState('')
  return (
    <>
    {
        !email ? <RegisterSection setEmail={setEmail} /> : <VerifyRegistration email={email} />
    }
    </>
  )
}

export default page