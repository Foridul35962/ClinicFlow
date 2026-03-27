"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Trash2, Upload, User, Phone, Building, Clock, CreditCard, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { editDoctor, getDepartments } from '@/store/slice/adminSlice'
import { getDoctor } from '@/store/slice/userSlice'
import { useParams, useRouter } from 'next/navigation'

const EditDoctorPage = () => {
    const { doctorId } = useParams()
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()

    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { departments } = useSelector((state: RootState) => state.admin)
    const { doctor } = useSelector((state: RootState) => state.user)

    const { register, control, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        defaultValues: {
            fullName: '',
            phoneNumber: '',
            departmentId: '',
            chamberNumber: '',
            consultationFee: '',
            slotDuration: 15,
            image: null as File | null,
            schedule: [] as any[]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "schedule"
    })

    useEffect(() => {
        const initData = async () => {
            try {
                if (departments.length === 0) dispatch(getDepartments(null));

                let currentDoctor = doctor;
                if (!currentDoctor || currentDoctor._id !== doctorId) {
                    currentDoctor = await dispatch(getDoctor(doctorId as string)).unwrap();
                    currentDoctor = currentDoctor.data
                }

                if (currentDoctor) {
                    reset({
                        fullName: currentDoctor.userId.fullName,
                        phoneNumber: currentDoctor.userId.phoneNumber,
                        departmentId: currentDoctor.departmentId?._id || currentDoctor.departmentId,
                        chamberNumber: currentDoctor.chamberNumber,
                        consultationFee: currentDoctor.consultationFee,
                        slotDuration: currentDoctor.slotDuration,
                        schedule: currentDoctor.schedule || []
                    });
                    if (currentDoctor.userId.image?.url) setImagePreview(currentDoctor.userId.image.url);
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to load data");
            }
        }
        initData();
    }, [doctorId, dispatch, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setValue('image', file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const onSubmit = async (formData: any) => {
        setLoading(true)
        try {
            const data = new FormData()

            // হেল্পার ফাংশন: শুধু চেঞ্জ হলেই অ্যাপেন্ড করবে
            const appendIfChanged = (key: string, newValue: any, oldValue: any) => {
                const normalizedNew = String(newValue).trim();
                const normalizedOld = String(oldValue).trim();

                if (normalizedNew !== normalizedOld) {
                    data.append(key, newValue);
                }
                // চেঞ্জ না হলে কিছুই করবে না (অটোমেটিক ব্যাকেন্ডে undefined থাকবে)
            }

            appendIfChanged('fullName', formData.fullName, doctor?.fullName)
            appendIfChanged('phoneNumber', formData.phoneNumber, doctor?.phoneNumber)
            appendIfChanged('departmentId', formData.departmentId, doctor?.departmentId?._id || doctor?.departmentId)
            appendIfChanged('chamberNumber', formData.chamberNumber, doctor?.chamberNumber)
            appendIfChanged('consultationFee', formData.consultationFee, doctor?.consultationFee)
            appendIfChanged('slotDuration', formData.slotDuration, doctor?.slotDuration)

            // ইমেজ থাকলে অ্যাড করবে
            if (formData.image) {
                data.append('image', formData.image)
            }

            // শিডিউল কম্পারিজন
            if (JSON.stringify(formData.schedule) !== JSON.stringify(doctor?.schedule)) {
                data.append('schedule', JSON.stringify(formData.schedule))
            }

            await dispatch(editDoctor({ data, doctorId: doctorId as string })).unwrap()
            toast.success("Doctor updated successfully!")
            router.push('/admin/doctors')
        } catch (error: any) {
            console.log(error)
            toast.error(error.message || "Update failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/doctors" className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Edit Doctor Profile</h1>
                        <p className="text-sm text-slate-500 font-medium">Update current practitioner information.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <label className="block text-sm font-bold text-slate-700 mb-4 uppercase text-center">Profile Photo</label>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all border-slate-200 bg-slate-50 hover:border-blue-400"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-6 text-slate-400">
                                        <Upload size={32} className="mx-auto mb-2" />
                                        <span className="text-sm font-medium">Change Photo</span>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                            <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">Practice Details</h3>
                            <FormInput
                                label="Consultation Fee (BDT)"
                                type="number"
                                icon={<CreditCard size={16} />}
                                error={errors.consultationFee?.message}
                                registration={register("consultationFee")}
                            />
                            <FormInput
                                label="Chamber Number"
                                icon={<Building size={16} />}
                                error={errors.chamberNumber?.message}
                                registration={register("chamberNumber")}
                            />
                            <FormInput
                                label="Slot Duration (Min)"
                                type="number"
                                icon={<Clock size={16} />}
                                error={errors.slotDuration?.message}
                                registration={register("slotDuration")}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-slate-800 border-b pb-3 mb-6 flex items-center gap-2">
                                <User size={18} className="text-blue-600" /> Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormInput
                                    label="Full Name"
                                    icon={<User size={16} />}
                                    error={errors.fullName?.message}
                                    registration={register("fullName")}
                                />

                                <FormInput
                                    label="Phone Number"
                                    icon={<Phone size={16} />}
                                    error={errors.phoneNumber?.message}
                                    registration={register("phoneNumber")}
                                />

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Department</label>
                                    <select
                                        {...register("departmentId")}
                                        className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-black focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                                    >
                                        <option value="">Choose Department</option>
                                        {departments?.map((dept: any) => (
                                            <option key={dept._id} value={dept._id}>{dept.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <Clock size={18} className="text-blue-600" /> Availability Schedule
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => append({ dayOfWeek: 'Sun', startTime: '09:00', endTime: '12:00' })}
                                    className="text-xs bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all"
                                >
                                    + Add Day
                                </button>
                            </div>

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex flex-wrap items-end gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                                        <div className="flex-1 min-w-30">
                                            <select
                                                {...register(`schedule.${index}.dayOfWeek` as const)}
                                                className="w-full p-2 border border-slate-200 rounded-lg text-black bg-white text-sm"
                                            >
                                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                                    <option key={day} value={day}>{day}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex-1 min-w-30">
                                            <input type="time" {...register(`schedule.${index}.startTime` as const)} className="w-full p-2 border border-slate-200 rounded-lg text-black bg-white text-sm" />
                                        </div>
                                        <div className="flex-1 min-w-30">
                                            <input type="time" {...register(`schedule.${index}.endTime` as const)} className="w-full p-2 border border-slate-200 rounded-lg text-black bg-white text-sm" />
                                        </div>
                                        <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Link href="/admin/doctors" className="px-8 py-3 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-12 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 cursor-pointer hover:bg-blue-700'}`}
                            >
                                {loading ? "Updating..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

const FormInput = ({ label, icon, error, registration, ...props }: any) => (
    <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                {icon}
            </div>
            <input
                {...props}
                {...registration}
                className={`block w-full pl-10 pr-4 py-2.5 border ${error ? 'border-red-400 ring-1 ring-red-100' : 'border-slate-200'} rounded-xl bg-slate-50 text-black focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium transition-all shadow-sm`}
            />
        </div>
        {error && <p className="text-red-500 text-[10px] font-bold uppercase">{error}</p>}
    </div>
)

export default EditDoctorPage