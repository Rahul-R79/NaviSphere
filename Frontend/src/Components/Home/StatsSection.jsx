import React from 'react';
import { motion } from 'framer-motion';
import { Building2, GraduationCap, Stethoscope, Plane, ShoppingBag, Landmark } from 'lucide-react';

const industries = [
    { icon: <GraduationCap size={24} />, label: "Universities" },
    { icon: <Stethoscope size={24} />, label: "Healthcare" },
    { icon: <Building2 size={24} />, label: "Corporate Offices" },
    { icon: <ShoppingBag size={24} />, label: "Shopping Malls" },
    { icon: <Plane size={24} />, label: "Airports" },
];

const StatsSection = () => {
    return (
        <section className="py-10 bg-slate-950/50 border-y border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
                <span className="text-gray-500 font-semibold uppercase tracking-widest text-sm whitespace-nowrap">
                    Perfect for Large Complexes
                </span>

                <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4 opacity-50 contrast-50 grayscale hover:grayscale-0 hover:opacity-100 hover:contrast-100 transition-all duration-500">
                    {industries.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 group cursor-default">
                            <span className="text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </span>
                            <span className="text-lg font-semibold text-slate-300">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
