"use client";

import { getAllReceptionist, addReceptionist, deleteReceptionist, editReceptionist } from '@/store/slice/adminSlice';
import { AppDispatch, RootState } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import {
  Plus, Edit, Trash2, X, Upload, User,
  Mail, Phone, Lock, Loader2, Check
} from 'lucide-react';

const ReceptionistPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { adminLoading, receptionist, receptionistFetch } = useSelector((state: RootState) => state.admin);

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // React Hook Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
    }
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        await dispatch(getAllReceptionist(null)).unwrap();
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    if (receptionist.length === 0) fetch();
  }, []);

  // Handle Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Open Modal for Add
  const openAddModal = () => {
    setEditMode(false);
    setSelectedId(null);
    setSelectedFile(null);
    setPreviewImage(null);
    reset({ fullName: '', email: '', phoneNumber: '', password: '' });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const openEditModal = (data: any) => {
    setEditMode(true);
    setSelectedId(data._id);
    setSelectedFile(null);
    setPreviewImage(data.image?.url || null);
    reset({
      fullName: data.fullName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: ''
    });
    setIsModalOpen(true);
  };

  // Handle Submit
  const onSubmit = async (values: any) => {
    const data = new FormData();
    data.append('fullName', values.fullName);
    data.append('phoneNumber', values.phoneNumber);
    if (selectedFile) data.append('image', selectedFile);

    try {
      if (editMode && selectedId) {
        // Edit Logic - updated trigger
        await dispatch(editReceptionist({ data, receptionistId: selectedId as string })).unwrap();
        toast.success("Receptionist Updated!");
      } else {
        // Add Logic
        data.append('email', values.email);
        data.append('password', values.password);
        if (!selectedFile) {
          toast.error('image is required')
          return
        }
        await dispatch(addReceptionist(data)).unwrap();
        toast.success("Receptionist Added!");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this receptionist?")) {
      setDeletingId(id);
      try {
        await dispatch(deleteReceptionist(id)).unwrap();
        toast.success("Deleted Successfully!");
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Receptionist List</h1>
          <p className="text-slate-500 text-sm">Manage your clinic receptionists and their accounts</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center cursor-pointer justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 active:scale-95"
        >
          <Plus size={20} /> Add New Receptionist
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Profile</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Full Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Contact Info</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider">Joined Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {receptionistFetch && receptionist.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-400 font-medium">
                    <Loader2 className="animate-spin mx-auto mb-2 text-blue-600" size={32} />
                    Loading...
                  </td>
                </tr>
              ) : receptionist.map((item: any) => (
                <tr key={item._id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <img src={item.image?.url || '/default-avatar.png'} alt="" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{item.fullName}</p>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md font-bold uppercase">Staff</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600"><Mail size={14} /> {item.email}</div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mt-1"><Phone size={14} /> {item.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit size={18} /></button>
                      <button
                        disabled={deletingId === item._id}
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                      >
                        {deletingId === item._id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-slate-800">{editMode ? "Edit Receptionist" : "Add New Receptionist"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload */}
                <label className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:border-blue-400 cursor-pointer overflow-hidden group">
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  <div className="relative mb-4">
                    <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white flex items-center justify-center">
                      {previewImage ? <img src={previewImage} className="w-full h-full object-cover" alt="Preview" /> : <User size={40} className="text-slate-300" />}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${previewImage ? 'bg-green-500' : 'bg-blue-600'}`}>
                      {previewImage ? <Check size={14} className="text-white" /> : <Plus size={16} className="text-white" />}
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-black text-slate-700 uppercase">{previewImage ? "Change Photo" : "Upload Photo"}</p>
                  </div>
                </label>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      {...register("fullName", {
                        required: "FullName is required",
                        minLength: { value: 3, message: "Too short" }
                      })}
                      placeholder='John Doe'
                      className={`w-full pl-10 pr-4 text-black py-2.5 bg-white border rounded-xl outline-none transition-all ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'}`}
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Email (Add Mode only) */}
                {!editMode && (
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid Email" }
                        })}
                        placeholder="john@example.com"
                        className={`w-full pl-10 text-black pr-4 py-2.5 bg-white border rounded-xl outline-none ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email.message}</p>}
                  </div>
                )}

                {/* Phone Number */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Phone Number (BN)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      {...register("phoneNumber", {
                        required: "phoneNumber is required",
                        pattern: {
                          value: /^(\+8801|8801|01)[3-9]\d{8}$/,
                          message: "phoneNumber is invalid"
                        }
                      })}
                      placeholder="01XXXXXXXXX"
                      className={`w-full pl-10 text-black pr-4 py-2.5 bg-white border rounded-xl outline-none ${errors.phoneNumber ? 'border-red-500' : 'border-slate-200'}`}
                    />
                  </div>
                  {errors.phoneNumber && <p className="text-red-500 text-xs font-bold mt-1">{errors.phoneNumber.message}</p>}
                </div>

                {/* Password (Add Mode only) */}
                {!editMode && (
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input
                        type="password"
                        {...register("password", {
                          required: "password is required",
                          minLength: { value: 8, message: "password must be at least 8 characters" },
                          validate: {
                            hasLetter: v => /[a-zA-Z]/.test(v) || "password must contain a letter",
                            hasNumber: v => /[0-9]/.test(v) || "password must contain a number",
                          }
                        })}
                        placeholder="Min 8 chars, 1 letter, 1 number"
                        className={`w-full pl-10 text-black pr-4 py-2.5 bg-white border rounded-xl outline-none ${errors.password ? 'border-red-500' : 'border-slate-200'}`}
                      />
                    </div>
                    {errors.password && <p className="text-red-500 text-xs font-bold mt-1">{errors.password.message}</p>}
                  </div>
                )}

                <button
                  disabled={adminLoading}
                  className="w-full cursor-pointer disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {adminLoading ? <Loader2 className="animate-spin" /> : editMode ? "Save Changes" : "Create Account"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceptionistPage;