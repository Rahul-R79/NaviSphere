import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Dummy Credentials
        if (username === 'admin' && password === 'admin123') {
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin/builder');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 py-8 sm:py-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-800/50 backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl w-full max-w-md relative z-10 shadow-2xl"
            >
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
                        Admin Login
                    </h1>
                    <p className="text-gray-400 text-sm sm:text-base">Access the Map Builder</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-2.5 sm:py-3 pl-10 pr-4 text-white text-sm sm:text-base focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="Enter username"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg py-2.5 sm:py-3 pl-10 pr-4 text-white text-sm sm:text-base focus:outline-none focus:border-cyan-500 transition-colors"
                                placeholder="Enter password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-400 text-xs sm:text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 sm:py-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95 text-sm sm:text-base"
                    >
                        Login
                    </button>

                    <div className="text-center text-xs sm:text-sm text-slate-500 mt-3 sm:mt-4 pb-2">
                        Default: <span className="font-mono">admin / admin123</span>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
