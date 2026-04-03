"use client";

import React, { useState } from 'react';
import {
  Stethoscope, Menu, X, ChevronRight, LogOut,
  ChevronDown, LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { logout } from '@/store/slice/authSlice';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>()

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogOut = async () => {
    if (window.confirm('Are you want to logged out?')) {
      try {
        await dispatch(logout(null)).unwrap()
        toast.success('Logout Successfully')
        setIsOpenMenu(false)
      } catch (error: any) {
        toast.error(error.message)
      }
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-blue-50/80 backdrop-blur-md border-b border-blue-100/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2 group cursor-pointer shrink-0">
            <div className="bg-blue-600 p-2 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-md shadow-blue-200">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight italic text-slate-900">
              Clinic<span className="text-blue-600 font-extrabold not-italic underline decoration-2 underline-offset-4">Flow</span>
            </span>
          </Link>

          {/* Center: Desktop Menu (As per your provided logic) */}
          <div className="hidden lg:flex items-center gap-8">

            {(!user || user.role !== 'admin') && (
              <>
                <Link
                  href={'/departments'}
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors relative group"
                >
                  Departments
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href={'/works'}
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors relative group"
                >
                  How To Work
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}

            {/* admin */}
            {user && user.role === 'admin' && (
              <>
                <Link
                  href={'admin/departments'}
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors relative group"
                >
                  Departments
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  href={'admin/doctors'}
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors relative group"
                >
                  Doctors
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  href={'admin/add-doctor'}
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors relative group"
                >
                  Add Doctor
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>

                <Link
                  href={'admin/receptionist'}
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors relative group"
                >
                  Receptionist
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}

            {/* receptionist */}
            {user && user.role === 'receptionist' && (
              <>
                <Link
                  href={'receptionist/scan'}
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors relative group"
                >
                  CheckIn
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
                <Link
                  href={'receptionist/recall'}
                  className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors relative group"
                >
                  Recall
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </>
            )}
          </div>

          {/* Right: Auth & Profile Section */}
          <div className="hidden lg:flex items-center gap-5">
            <div className="relative inline-block">
              {!user ? (
                <Link
                  href={'/login'}
                  className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-105 transition-all duration-300 active:scale-95 flex items-center justify-center min-w-27.5"
                >
                  Login
                </Link>
              ) : (
                <>
                  {/* Profile Trigger Button */}
                  <button
                    onClick={() => setIsOpenMenu(!isOpenMenu)}
                    className="relative z-110 flex items-center gap-2 p-1 rounded-full hover:bg-blue-50 transition-all border border-slate-200 bg-white"
                  >
                    <img
                      src={user?.image?.url || '/avatar.png'}
                      alt="profile"
                      className="w-9 h-9 rounded-full object-cover border border-blue-100 shadow-sm"
                    />
                    <ChevronDown size={14} className={`text-slate-500 cursor-pointer mr-1 transition-transform duration-300 ${isOpenMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Desktop Full Screen Backdrop (Fix for closing on outside click) */}
                  {isOpenMenu && (
                    <div
                      className="fixed inset-0 w-full h-dvh z-100 bg-transparent cursor-default"
                      onClick={() => setIsOpenMenu(false)}
                    ></div>
                  )}

                  {/* Dropdown Menu */}
                  {isOpenMenu && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 z-105 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                      <div className="p-4 border-b border-slate-50 bg-blue-50/30">
                        <p className="font-bold text-slate-800 truncate leading-tight">
                          {user?.fullName}
                        </p>
                        <p className="text-[11px] font-black uppercase tracking-widest text-blue-600 mt-1">
                          {user?.role}
                        </p>
                      </div>

                      <div className="p-2 space-y-1">
                        <Link href={`/${user.role}/dashboard`} onClick={() => setIsOpenMenu(false)} className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all font-medium text-sm group">
                          <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <div className="my-1 border-t border-slate-50"></div>
                        <button onClick={handleLogOut} className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm group">
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={toggleMenu}
              className="p-2 text-slate-600 hover:bg-blue-100 rounded-lg transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-b border-slate-100 ${isOpen ? 'max-h-200 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 py-8 space-y-6">
          <div className="flex flex-col gap-4">

            {(!user || user.role !== 'admin') && (
              <>
                <Link href="/departments" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2">
                  Departments <ChevronRight size={18} />
                </Link>

                <Link href="/works" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2">
                  How To Work <ChevronRight size={18} />
                </Link>
              </>
            )}

            {user && user.role === 'admin' && (
              <>
                <Link href="/admin/department" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2">
                  Department <ChevronRight size={18} />
                </Link>
                <Link href="/admin/doctors" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2">
                  Doctors <ChevronRight size={18} />
                </Link>
                <Link href="/admin/add-doctor" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2">
                  Add Doctor <ChevronRight size={18} />
                </Link>
                <Link href="/admin/receptionist" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2">
                  Receptionist <ChevronRight size={18} />
                </Link>
              </>
            )}

            {/* receptionist */}
            {user && user.role === 'receptionist' && (
              <>
                <Link href="/receptionist/scan" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2">
                  CheckIn <ChevronRight size={18} />
                </Link>
                <Link href="/receptionist/recall" onClick={() => setIsOpen(false)} className="text-lg font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2">
                  Recall <ChevronRight size={18} />
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-4 border-t border-slate-50">
            {!user ? (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-3.5 text-center font-bold text-slate-700 border-2 border-slate-100 rounded-xl">Login</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="w-full py-3.5 text-center font-bold text-white bg-blue-600 rounded-xl shadow-lg">Get Started</Link>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                  <img src={user?.image?.url || '/avatar.png'} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
                  <div>
                    <p className="font-bold text-slate-800">{user?.fullName}</p>
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-widest">{user?.role}</p>
                  </div>
                </div>
                <Link href={`/${user.role}/dashboard`} onClick={() => setIsOpen(false)} className="block w-full py-3.5 text-center font-bold text-slate-700 border-2 border-blue-100 rounded-xl">
                  Dashboard
                </Link>
                <button onClick={handleLogOut} className="w-full cursor-pointer py-3.5 flex items-center justify-center gap-2 font-bold text-red-500 bg-red-50 rounded-xl">
                  <LogOut size={20} /> Logout Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;