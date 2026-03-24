import React from 'react';
import { 
    Stethoscope, // default
    HeartPulse,  // Cardiology
    Brain,       // Neurology
    Baby,        // Pediatrics
    Bone,        // Orthopedics
    Eye,         // Ophthalmology
    UserRound,   // General/Admin
    ArrowRight 
} from 'lucide-react';
import Link from 'next/link';
import AdminActions from './AdminActions';

const departmentMap: { [key: string]: { icon: React.ElementType, color: string, bg: string } } = {
    "cardiology": { icon: HeartPulse, color: "text-red-600", bg: "bg-red-50" },
    "neurology": { icon: Brain, color: "text-purple-600", bg: "bg-purple-50" },
    "pediatrics": { icon: Baby, color: "text-amber-600", bg: "bg-amber-50" },
    "orthopedics": { icon: Bone, color: "text-emerald-600", bg: "bg-emerald-50" },
    "ophthalmology": { icon: Eye, color: "text-sky-600", bg: "bg-sky-50" },
    "general surgery": { icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50" },
};

const defaultStyle = { icon: Stethoscope, color: "text-blue-600", bg: "bg-blue-50" };

const DepartmentCard = ({ dept, admin }: { dept: any, admin: boolean }) => {
    const deptKey = dept.name?.toLowerCase().trim();
    const style = departmentMap[deptKey] || defaultStyle;
    const Icon = style.icon;

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative flex flex-col h-full overflow-hidden">
            
            <div className={`absolute -top-10 -right-10 size-32 ${style.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

            
            <div className={`size-16 ${style.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative z-10`}>
                <Icon className={`size-8 ${style.color}`} />
            </div>
            
            
            <h3 className="text-2xl uppercase font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors relative z-10">
                {dept.name}
            </h3>
            <p className="text-slate-500 leading-relaxed mb-8 line-clamp-2 font-medium relative z-10">
                {dept.description || "Expert medical care and specialized services for your wellbeing."}
            </p>

            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100 relative z-10 gap-4">
                <Link href={`/departments/${dept._id}`} className="text-blue-600 font-bold flex items-center gap-2 group/link text-sm uppercase whitespace-nowrap">
                    Explore Details
                    <ArrowRight className="size-4 group-hover/link:translate-x-1.5 transition-transform" />
                </Link>
                
                {admin && (
                    <div className="relative z-20">
                        <AdminActions dept={dept} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DepartmentCard;