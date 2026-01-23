import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Navigation, Menu, X, Map } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-2 rounded-lg">
                            <Navigation size={20} className="text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            PathPulse
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink
                                to="/"
                                className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-cyan-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                            >
                                Home
                            </NavLink>
                            <NavLink
                                to="/map"
                                className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-cyan-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                            >
                                Launch Map
                            </NavLink>
                            <NavLink
                                to="/admin"
                                className={({ isActive }) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-cyan-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                            >
                                Map Builder
                            </NavLink>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-900 border-b border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <NavLink
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-cyan-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            to="/map"
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-cyan-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                        >
                            Launch Map
                        </NavLink>
                        <NavLink
                            to="/admin"
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-cyan-400 bg-white/5' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                        >
                            Map Builder
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
