import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Save the event so it can be triggered later
            setDeferredPrompt(e);
            // Show the install button
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowInstallButton(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        await deferredPrompt.userChoice;

        // Clear the deferredPrompt
        setDeferredPrompt(null);
        setShowInstallButton(false);
    };

    const handleDismiss = () => {
        setDismissed(true);
        setShowInstallButton(false);
    };

    if (!showInstallButton || dismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 right-4 z-50 max-w-sm"
            >
                <div className="bg-slate-800 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Download size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white mb-1">Install PathPulse</h3>
                            <p className="text-sm text-gray-400 mb-3">
                                Add to your home screen for quick access and offline use
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleInstallClick}
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-cyan-900/20"
                                >
                                    Install
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 text-sm font-medium rounded-lg transition-all"
                                >
                                    Not Now
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={handleDismiss}
                            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X size={18} className="text-gray-400" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default InstallPWA;
