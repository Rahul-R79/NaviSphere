import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // Standard install prompt (Android/Desktop)
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowInstallButton(false);
        } else if (isIosDevice) {
            // Show prompt for iOS if not standalone (simplistic check, can be refined)
            // Ideally check localstorage to not show every time
            const hasDismissed = localStorage.getItem('iosInstallDismissed');
            if (!hasDismissed) setShowInstallButton(true);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        setDeferredPrompt(null);
        setShowInstallButton(false);
    };

    const handleDismiss = () => {
        setDismissed(true);
        setShowInstallButton(false);
        if (isIOS) localStorage.setItem('iosInstallDismissed', 'true');
    };

    if (!showInstallButton || dismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 right-4 z-50 max-w-sm w-full px-4"
            >
                <div className="bg-slate-800 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                            <Download size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white mb-1">Install NaviSphere</h3>
                            {isIOS ? (
                                <div className="text-sm text-gray-400 mb-3 space-y-2">
                                    <p>Install this app on your iPhone:</p>
                                    <p className="flex items-center gap-1">1. Tap the <span className="inline-block p-1 bg-white/10 rounded"><ShareIcon /></span> Share button</p>
                                    <p>2. Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 mb-3">
                                    Add to your home screen for quick access and offline use
                                </p>
                            )}

                            {!isIOS && (
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
                            )}
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

// Simple Share Icon for iOS instructions
const ShareIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
        <polyline points="16 6 12 2 8 6"></polyline>
        <line x1="12" y1="2" x2="12" y2="15"></line>
    </svg>
);

export default InstallPWA;
