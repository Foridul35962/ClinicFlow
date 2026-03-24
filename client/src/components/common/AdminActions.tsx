"use client"

import React, { useState } from 'react';
import { Edit2, Trash2, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { deleteDepartment, editDepartment } from '@/store/slice/adminSlice';

const AdminActions = ({ dept }: { dept: any }) => {
    const router = useRouter();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const { authLoading } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>()

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete "${dept.name}"?`)) {
            try {
                await dispatch(deleteDepartment(dept._id)).unwrap()
                toast.success("Department deleted successfully");
                router.refresh();
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const updatedData = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
        };

        try {
            await dispatch(editDepartment({data: updatedData, departmentId:dept._id})).unwrap()
            toast.success("Department updated successfully");
            setIsEditOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update department");
        }
    };

    return (
        <>
            <div className="flex gap-2">
                <button
                    onClick={() => setIsEditOpen(true)}
                    className="p-2 cursor-pointer text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    onClick={handleDelete}
                    disabled={authLoading}
                    className="p-2 text-slate-400 cursor-pointer disabled:cursor-not-allowed hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* --- Edit Modal --- */}
            {isEditOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Edit Department</h2>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Update Information</p>
                            </div>
                            <button
                                onClick={() => setIsEditOpen(false)}
                                className="p-2 hover:bg-white shadow-sm border border-slate-100 rounded-full transition-all"
                            >
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleEditSubmit} className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Department Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    defaultValue={dept.name}
                                    required
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-slate-900 font-medium"
                                    placeholder="e.g. Cardiology"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    defaultValue={dept.description}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-slate-900 font-medium"
                                    placeholder="Describe the department's focus..."
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditOpen(false)}
                                    className="py-4 bg-slate-100 cursor-pointer text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={authLoading}
                                    type="submit"
                                    className="py-4 bg-blue-600 text-white cursor-pointer disabled:cursor-not-allowed font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                                >
                                    {authLoading ? (
                                        <Loader2 className="animate-spin size-5" />
                                    ) : (
                                        "Save Changes"
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

export default AdminActions;