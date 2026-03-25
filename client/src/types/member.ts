export type addReceptionistType = {
    fullName: string
    email: string
    phoneNumber: string
    password: string
    role: "receptionist"
    image: File
}

export type editReceptionistType = {
    fullName?: string
    phoneNumber?: string
    image?: File
}

export type addDepartmentType = {
    name: string
    description?: string
}

export type editDepartmentType = {
    name?: string
    description?: string
}

type ScheduleType = {
    dayOfWeek: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"
    startTime: string
    endTime: string
}

export type addDoctorType = {
    fullName: string
    email: string
    phoneNumber: string
    password: string
    role: "doctor"
    image: File
    departmentId: string
    chamberNumber: string
    consultationFee: number
    slotDuration: number
    schedule: ScheduleType[]
}

type EditScheduleType = {
    dayOfWeek?: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat"
    startTime?: string
    endTime?: string
}

export type editDoctorType = {
    fullName?: string
    phoneNumber?: string
    image?: File
    departmentId?: string
    chamberNumber?: string
    consultationFee?: number
    slotDuration?: number
    schedule?: EditScheduleType[]
}