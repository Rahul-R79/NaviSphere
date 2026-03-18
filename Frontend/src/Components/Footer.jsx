import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-slate-900 border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} NaviSphere. All rights reserved.
                </p>
                <p className="text-gray-600 text-xs mt-2">
                    Indoor Navigation System
                </p>
                {/* Subtle admin access - hidden in plain sight */}
                <Link
                    to="/admin"
                    className="inline-block mt-4 text-slate-700 hover:text-slate-500 text-xs opacity-50 hover:opacity-100 transition-opacity"
                >
                    •
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
