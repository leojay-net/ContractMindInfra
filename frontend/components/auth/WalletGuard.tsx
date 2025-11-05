/**
 * Wallet Authentication Guard
 * 
 * Protects dashboard routes by requiring wallet connection.
 * Redirects unauthorized users to the landing page.
 * 
 * @module components/auth/WalletGuard
 */

'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

interface WalletGuardProps {
    children: React.ReactNode;
}

export default function WalletGuard({ children }: WalletGuardProps) {
    const { isConnected, isConnecting } = useAccount();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Wait for wagmi to finish checking connection status
        if (!isConnecting) {
            if (!isConnected) {
                router.push('/');
            } else {
                setIsChecking(false);
            }
        }
    }, [isConnected, isConnecting, router]);

    // Show loading state while checking authentication
    if (isChecking || isConnecting) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent mb-4"></div>
                    <p className="text-white/60 text-sm">Verifying wallet connection...</p>
                </div>
            </div>
        );
    }

    // Render protected content only when wallet is connected
    return <>{children}</>;
}
