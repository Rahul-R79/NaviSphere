import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="py-20 px-4">
            <div className="max-w-5xl mx-auto bg-gradient-to-r from-cyan-900/60 to-blue-900/60 rounded-3xl p-12 md:p-20 text-center border border-cyan-500/20 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/30 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
                        Ready to Find Your Way?
                    </h2>
                    <p className="text-cyan-100 text-lg mb-10 max-w-2xl mx-auto">
                        Stop wandering and start navigating. PathPulse is ready to guide you to your destination instantly.
                    </p>

                    <Link
                        to="/map"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-cyan-50 transition-colors shadow-xl"
                    >
                        Start Exploring Now <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
