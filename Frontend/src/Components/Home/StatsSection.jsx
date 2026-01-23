import React from 'react';
import { motion } from 'framer-motion';

const stats = [
    { label: "Buildings Mapped", value: "50+" },
    { label: "Steps Guided", value: "1M+" },
    { label: "Daily Users", value: "10k+" },
    { label: "Accuracy", value: "99%" },
];

const StatsSection = () => {
    return (
        <section className="py-12 bg-slate-900 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, type: "spring" }}
                            className="text-center"
                        >
                            <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-cyan-400 to-blue-600 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-400 font-medium text-sm uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
