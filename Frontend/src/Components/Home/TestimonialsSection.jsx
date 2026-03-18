import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
    {
        name: "Alex R.",
        role: "Medical Student",
        text: "Using NaviSphere saved me so much time during my first week of residency. I never get lost finding wards anymore!",
        rating: 5
    },
    {
        name: "Sarah L.",
        role: "Hospital Visitor",
        text: "I was anxious about finding the cardiology department, but this app guided me directly there. Super easy to use.",
        rating: 5
    },
    {
        name: "Dr. James K.",
        role: "Senior Surgeon",
        text: "Efficient navigation is crucial in a large hospital. NaviSphere helps our new staff integrate seamlessly.",
        rating: 4
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-slate-900">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Everyone</h2>
                    <p className="text-gray-400">Join thousands of users navigating with confidence.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-slate-800/50 p-8 rounded-2xl border border-white/5 relative"
                        >
                            {/* Quote Icon Background */}
                            <div className="absolute top-4 right-4 text-white/5 text-6xl font-serif font-bold leading-none">
                                &rdquo;
                            </div>

                            <div className="flex gap-1 text-yellow-500 mb-4">
                                {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>

                            <p className="text-gray-300 mb-6 leading-relaxed relative z-10">
                                "{t.text}"
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-white text-sm">
                                    {t.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-sm">{t.name}</div>
                                    <div className="text-cyan-400 text-xs">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
