import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Search, Smartphone, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroScene from '../Components/3D/HeroScene';
import HowItWorks from '../Components/Home/HowItWorks';
import StatsSection from '../Components/Home/StatsSection';
import TestimonialsSection from '../Components/Home/TestimonialsSection';
import CTASection from '../Components/Home/CTASection';

const HomePage = () => {
    const scrollToHowItWorks = () => {
        const element = document.getElementById('how-it-works');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white selection:bg-cyan-500/30">

            {/* Hero Section */}
            <section className="relative px-4 pt-32 pb-20 overflow-hidden min-h-[600px] flex items-center">
                {/* 3D Scene Background */}
                <HeroScene />

                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] -z-10" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full bg-white/5 border border-white/10 text-cyan-400 text-sm font-medium mb-6 backdrop-blur-sm">
                            ✨ Next Gen Indoor Navigation
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                            Find Your Way <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                Without Getting Lost
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Experience seamless indoor navigation for hospitals, campuses, and large complexes.
                            Real-time pathfinding right at your fingertips.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/map"
                                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-lg shadow-lg shadow-cyan-900/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Launch Map <ArrowRight size={20} />
                            </Link>
                            <button
                                onClick={scrollToHowItWorks}
                                className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-medium text-lg transition-all"
                            >
                                Learn More
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <StatsSection />

            {/* How It Works Section */}
            <div id="how-it-works">
                <HowItWorks />
            </div>

            {/* Features Section */}
            <section className="py-24 bg-slate-950/50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why PathPulse?</h2>
                        <p className="text-gray-400">Everything you need to navigate complex spaces.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-colors"
                        >
                            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 mb-6">
                                <Navigation size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Smart Routing</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Our algorithm finds the shortest, most accessible path to your destination in milliseconds.
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors"
                        >
                            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400 mb-6">
                                <Search size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Instant Search</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Find doctors, wards, or labs instantly with our powerful, fuzzy-search enabled directory.
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-colors"
                        >
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
                                <Smartphone size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Mobile Optimization</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Designed for mobile-first. Interactive touch controls and responsive layouts for any device.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <TestimonialsSection />

            {/* CTA */}
            <CTASection />

        </div>
    );
};

export default HomePage;
