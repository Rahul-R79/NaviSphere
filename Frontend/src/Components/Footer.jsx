import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full bg-slate-900 border-t border-white/10 py-8">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} PathPulse. All rights reserved.
                </p>
                <p className="text-gray-600 text-xs mt-2">
                    Indoor Hospital Navigation System
                </p>
            </div>
        </footer>
    );
};

export default Footer;
