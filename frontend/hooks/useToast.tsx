/**
 * Toast Notification Hook
 * Simple toast notifications for user feedback
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (type: ToastType, message: string, duration: number = 5000) => {
            const id = Date.now().toString();
            const toast: Toast = { id, type, message, duration };

            setToasts((prev) => [...prev, toast]);

            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }
        },
        [removeToast]
    );

    const success = useCallback(
        (message: string, duration?: number) => showToast('success', message, duration),
        [showToast]
    );

    const error = useCallback(
        (message: string, duration?: number) => showToast('error', message, duration),
        [showToast]
    );

    const warning = useCallback(
        (message: string, duration?: number) => showToast('warning', message, duration),
        [showToast]
    );

    const info = useCallback(
        (message: string, duration?: number) => showToast('info', message, duration),
        [showToast]
    );

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <XCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5" />;
            case 'info':
                return <Info className="w-5 h-5" />;
        }
    };

    const getColors = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-green-500/20 border-green-500/50 text-green-400';
            case 'error':
                return 'bg-red-500/20 border-red-500/50 text-red-400';
            case 'warning':
                return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
            case 'info':
                return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.8 }}
                            className={`flex items-center gap-3 p-4 rounded-lg border backdrop-blur-sm ${getColors(
                                toast.type
                            )}`}
                        >
                            {getIcon(toast.type)}
                            <p className="flex-1 text-sm font-medium">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="hover:opacity-70 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
