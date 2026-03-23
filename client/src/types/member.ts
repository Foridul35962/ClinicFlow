export type addMemberType = {
    fullName: string
    email: string
    phoneNumber: string
    password: string
    role: "doctor" | "receptionist"
    image: File
}

export type editMemberType = {
    fullName?: string
    phoneNumber?: string
    image?: File
}

export type addDepartmentType = {
    name: string
    description?:string
}

export type editDepartmentType = {
    name?:string
    description?:string
}