"use client"

import React, { useState, useRef } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Plus, Trash2, Upload, User, Mail, Lock, Phone, Building, Clock, CreditCard, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import Link from 'next/link'

const AddDoctorPage = () => {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // React Hook Form Initialization
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      departmentId: '',
      chamberNumber: '',
      consultationFee: '',
      slotDuration: 15,
      image: null as File | null,
      schedule: [{ dayOfWeek: 'Sun', startTime: '09:00', endTime: '12:00' }]
    }
  })

  // Dynamic Schedule Array
  const { fields, append, remove } = useFieldArray({
    control,
    name: "schedule"
  })

  // Image change handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setValue('image', file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  // Final Form Submission
  const onSubmit = async (formData: any) => {
    setLoading(true)
    try {
      const data = new FormData()
      
      // Append Simple Fields
      Object.keys(formData).forEach(key => {
        if (key !== 'schedule' && key !== 'image') {
          data.append(key, formData[key])
        }
      })

      // Append Image
      if (formData.image) {
        data.append('image', formData.image)
      }

      // Append Schedule (Stringified)
      data.append('schedule', JSON.stringify(formData.schedule))

      // API Call Placeholder
      console.log("FormData ready to send!")
      toast.success("Doctor registered successfully!")
      
    } catch (error: any) {
      toast.error(error.message || "Failed to add doctor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/doctors" className="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Add New Doctor</h1>
            <p className="text-sm text-slate-500 font-medium">Please fill out all required fields carefully.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Image & Fee */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <label className="block text-sm font-bold text-slate-700 mb-4 uppercase text-center">Profile Photo</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all ${errors.image ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-blue-400'}`}
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <Upload size={32} className="mx-auto mb-2" />
                    <span className="text-sm font-medium">Upload Doctor Image</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-2 text-center">Image is required</p>}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-2 mb-4">Practice Details</h3>
              
              <FormInput 
                label="Consultation Fee (BDT)" 
                placeholder="500" 
                type="number"
                icon={<CreditCard size={16}/>}
                error={errors.consultationFee?.message}
                registration={register("consultationFee", { required: "Fee is required", min: { value: 0, message: "Fee must be positive" } })}
              />

              <FormInput 
                label="Chamber Number" 
                placeholder="A-101" 
                icon={<Building size={16}/>}
                error={errors.chamberNumber?.message}
                registration={register("chamberNumber", { required: "Chamber is required" })}
              />

              <FormInput 
                label="Slot Duration (Min)" 
                type="number"
                placeholder="15" 
                icon={<Clock size={16}/>}
                error={errors.slotDuration?.message}
                registration={register("slotDuration", { required: "Duration is required", min: { value: 1, message: "Min 1 min" } })}
              />
            </div>
          </div>

          {/* Right Column: Main Info & Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 border-b pb-3 mb-6 flex items-center gap-2">
                <User size={18} className="text-blue-600" /> Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                  label="Full Name" 
                  placeholder="Dr. Foridul Islam" 
                  icon={<User size={16}/>}
                  error={errors.fullName?.message}
                  registration={register("fullName", { required: "FullName is required" })}
                />

                <FormInput 
                  label="Email Address" 
                  placeholder="doctor@gmail.com" 
                  icon={<Mail size={16}/>}
                  error={errors.email?.message}
                  registration={register("email", { 
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                  })}
                />

                <FormInput 
                  label="Phone Number" 
                  placeholder="017XXXXXXXX" 
                  icon={<Phone size={16}/>}
                  error={errors.phoneNumber?.message}
                  registration={register("phoneNumber", { 
                    required: "Phone is required",
                    pattern: { value: /^(?:\+88|88)?(01[3-9]\d{8})$/, message: "Invalid BD number" }
                  })}
                />

                <FormInput 
                  label="Password" 
                  type="password"
                  placeholder="Min 8 chars, 1 letter, 1 number" 
                  icon={<Lock size={16}/>}
                  error={errors.password?.message}
                  registration={register("password", { 
                    required: "Password is required",
                    minLength: { value: 8, message: "Min 8 characters" },
                    validate: {
                      hasLetter: v => /[a-zA-Z]/.test(v) || "Must contain a letter",
                      hasNumber: v => /[0-9]/.test(v) || "Must contain a number"
                    }
                  })}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Department</label>
                  <select 
                    {...register("departmentId", { required: "Select a department" })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 text-black focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  >
                    <option value="">Choose Department</option>
                    <option value="69c28f03a9dfe643f8776548">Cardiology</option>
                    <option value="69c28f03a9dfe643f8776549">Neurology</option>
                  </select>
                  {errors.departmentId && <p className="text-red-500 text-[10px] font-bold uppercase">{errors.departmentId.message}</p>}
                </div>
              </div>
            </div>

            {/* Availability Schedule */}
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
                  <div key={field.id} className="flex flex-wrap items-end gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 relative group">
                    <div className="flex-1 min-w-30">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Day</label>
                      <select 
                        {...register(`schedule.${index}.dayOfWeek` as const, { required: true })}
                        className="w-full p-2 border border-slate-200 rounded-lg text-black bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1 min-w-30">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Start</label>
                      <input 
                        type="time" 
                        {...register(`schedule.${index}.startTime` as const, { required: true })}
                        className="w-full p-2 border border-slate-200 rounded-lg text-black bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex-1 min-w-30">
                      <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">End</label>
                      <input 
                        type="time" 
                        {...register(`schedule.${index}.endTime` as const, { 
                          required: true,
                          validate: (val, formValues) => {
                            const start = formValues.schedule[index].startTime;
                            return val > start || "End must be after start";
                          }
                        })}
                        className="w-full p-2 border border-slate-200 rounded-lg text-black bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    )}

                    {/* Schedule Error Message */}
                    {errors.schedule?.[index]?.endTime && (
                      <p className="absolute -bottom-5 left-4 text-[10px] text-red-500 font-bold uppercase">
                        {errors.schedule[index]?.endTime?.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Link href="/admin/doctors" className="px-8 py-3 rounded-xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 transition-all">
                Cancel
              </Link>
              <button 
                type="submit" 
                disabled={loading}
                className={`px-12 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
              >
                {loading ? "Registering..." : "Register Doctor"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// Reusable Sub-Component with text-black and Error Handling
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
        className={`block w-full pl-10 pr-4 py-2.5 border ${error ? 'border-red-400 ring-1 ring-red-100' : 'border-slate-200'} rounded-xl bg-slate-50 text-black focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium transition-all shadow-sm`}
      />
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold uppercase">{error}</p>}
  </div>
)

export default AddDoctorPage