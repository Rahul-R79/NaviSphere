import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: <MapPin size={32} />,
        title: "1. Select Location",
        description: "Choose your current location and where you want to go from our detailed campus map."
    },
    {
        icon: <Navigation size={32} />,
        title: "2. Follow the Path",
        description: "Get a clear, color-coded path overlaid on the map. Just follow the blue line!"
    },
    {
        icon: <CheckCircle size={32} />,
        title: "3. Arrive Stress-Free",
        description: "Reach your destination quickly without asking for directions or getting lost."
    }
];

const HowItWorks = () => {
    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-900 to-transparent -translate-y-1/2 z-0" />

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
                    <p className="text-gray-400">Simple steps to get you moving.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="text-center relative"
                        >
                            <div className="w-20 h-20 mx-auto bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-cyan-400 mb-6 shadow-xl shadow-cyan-900/10 relative z-10">
                                {step.icon}
                                <div className="absolute inset-0 bg-cyan-400/20 rounded-full animate-ping opacity-20" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                            <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
