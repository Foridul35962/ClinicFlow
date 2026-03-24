"use client"

import React, { useState } from 'react';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { addDepartment } from '@/store/slice/adminSlice';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const AddDepartmentModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>()
    const { adminLoading } = useSelector((state: RootState) => state.admin)
    const router = useRouter()

    const handleAddDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const description = formData.get('description') as string
        if (!name) {
            return
        }
        try {
            await dispatch(addDepartment({ name, description })).unwrap()
            toast.success('Department Added')
            setIsOpen(false)
            router.refresh()
            e.currentTarget.reset()
        } catch (error: any) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex cursor-pointer items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-slate-200"
            >
                <Plus size={20} /> Add Department
            </button>

            {isOpen && (
                <div className="fixed inset-0 mt-20 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-300 flex justify-between items-center">
                            <h2 className="text-2xl font-black text-slate-900">New Department</h2>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                                <X size={24} className='text-black cursor-pointer' />
                            </button>
                        </div>

                        <form onSubmit={handleAddDepartment} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Department Name</label>
                                <input type="text" name='name' className="w-full px-5 py-3 text-black bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" placeholder="e.g. Cardiology" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                <textarea rows={3} name='description' className="w-full text-black px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500" placeholder="Describe the department..."></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <button type="button" onClick={() => setIsOpen(false)} className="py-4 bg-slate-100 cursor-pointer text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">Cancel</button>
                                <button
                                    disabled={adminLoading}
                                    type="submit"
                                    className={`py-4 px-6 flex gap-2 items-center justify-center font-bold rounded-xl transition-all shadow-lg 
                                        ${adminLoading
                                            ? 'bg-blue-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-blue-200'
                                        } text-white w-full`}
                                >
                                    {adminLoading ? (
                                        <>
                                            <Loader2 className="size-5 animate-spin" />
                                            <span>Creating...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={20} />
                                            <span>Create Dept</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default AddDepartmentModal;