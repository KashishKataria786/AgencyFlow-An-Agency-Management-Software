import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, X } from 'lucide-react';

const NoInternet = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            // Optional: keep showing for a second more with an "Online" status
            setTimeout(() => setShowNotification(false), 3000);
        };

        const handleOffline = () => {
            setIsOffline(true);
            setShowNotification(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check
        if (!navigator.onLine) {
            setShowNotification(true);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleRetry = () => {
        window.location.reload();
    };

    return (
        <AnimatePresence>
            {showNotification && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-md"
                >
                    <div className="bg-[#1a1a1c]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/50 relative overflow-hidden group">
                        {/* Animated background glow */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${isOffline ? 'from-red-500/10 to-transparent' : 'from-green-500/10 to-transparent'} opacity-50`} />

                        <div className="relative flex items-center gap-5">
                            <div className={`p-4 rounded-2xl ${isOffline ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'} shrink-0`}>
                                {isOffline ? (
                                    <motion.div
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <WifiOff size={28} />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1 }}
                                    >
                                        <RefreshCw size={28} />
                                    </motion.div>
                                )}
                            </div>

                            <div className="flex-1">
                                <h3 className="text-white font-bold text-lg leading-tight">
                                    {isOffline ? "No Connection" : "Back Online!"}
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">
                                    {isOffline
                                        ? "Check your internet connection to continue working."
                                        : "Your connection has been restored successfully."}
                                </p>
                            </div>

                            {isOffline ? (
                                <button
                                    onClick={handleRetry}
                                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-xl border border-white/10 transition-colors shrink-0 flex items-center gap-2"
                                >
                                    <RefreshCw size={14} />
                                    Retry
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowNotification(false)}
                                    className="p-2 hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NoInternet;
